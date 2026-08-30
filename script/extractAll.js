import puppeteer from 'puppeteer';
import { saveData } from './services/mongoConnection.js';
import config from '../config.js';
import process from 'process';
import path from 'path';
import { extractEstimatedJackpotFromPdf } from './services/poceadaPdf.js';

//const selectors:::
const table = '.results-list';
const tableHeader = '.card-header h5';
const iconPlus = '.results-list__item a';
const itemsLeft = '[class="results-list__item"] .results-number:nth-child(1)';
const itemsRight = '[class="results-list__item"] .results-number:nth-child(2)';
const firstLeft = '[class="results-list__item"]:nth-child(2) .results-number:nth-child(1)';
const firstRight = '[class="results-list__item"]:nth-child(2) .results-number:nth-child(2)';
const firstIconPlus = '.results-list__item:nth-child(2) a';
const selectJackpot5 = (/** @type {number} */ index) => `.group-body > .card-list:nth-of-type(2) .results-list__item:nth-child(2) .results-number:nth-of-type(${index})`;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0';
const regexSorteo = /[0-9]{1,7}/gm;
const regexFecha = /([\d]{2}\/[\d]{2}\/[\d]{2})/gm;
const regexNumber = /[0-9]{1,2}/gm;

// CI-specific timeouts (GitHub runners are slower + sites often have anti-bot)
const isCI = !!process.env.CI;
const NAV_TIMEOUT = isCI ? 180000 : 60000;   // 3 minutes in CI
const WAIT_TIMEOUT = isCI ? 120000 : 30000;

// Robust navigation helper with retries
/**
 * @param {import("puppeteer-core").Page} page
 * @param {string} url
 * @param {number} timeout
 */
async function safeGoto(page, url, timeout) {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`\x1b[36mNavigating to page (attempt ${attempt}/${maxAttempts})...\x1b[0m`);
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout,
      });
      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Navigation attempt ${attempt} failed: ${errorMessage}`);
      if (attempt === maxAttempts) throw err;
      await new Promise(r => setTimeout(r, 8000));
    }
  }
}

// Take a full-page screenshot for debugging when things fail in CI
/**
 * @param {import("puppeteer-core").Page} page
 */
async function takeDebugScreenshot(page, label = 'error') {
  try {
    const dir = process.env.GITHUB_WORKSPACE || process.cwd();
    const filePath = path.join(dir, `puppeteer-debug-${label}-${Date.now()}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`\x1b[33mDebug screenshot saved: ${filePath}\x1b[0m`);
    return filePath;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('Failed to take debug screenshot:', errorMessage);
  }
}

(async () => {
  console.log('\x1b[36mObtaining data...\x1b[0m');
  //data:::
  const allResults = [];

  // Puppeteer setup
  console.log(`\x1b[36mRunning in CI: ${isCI}\x1b[0m`);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1920,1080',
      '--no-zygote',
    ],
  });

  const page = await browser.newPage();

  // Stealth / anti-detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    // @ts-ignore
    window.chrome = { runtime: {} };
  });

  await page.setUserAgent(userAgent);
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  });

  // Block heavy/unnecessary resources to make the page load much faster (huge help in CI)
  // Note: 'stylesheet' is intentionally not blocked — some sites rely on CSS for layout/visibility of results
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (['image', 'font', 'media'].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // Higher default timeout in CI
  page.setDefaultTimeout(WAIT_TIMEOUT);

  try {
    // Use the robust navigation helper (now inside try so errors get screenshot + guaranteed browser close)
    await safeGoto(page, config.URL, NAV_TIMEOUT);

    // Wait for the critical elements with explicit (longer in CI) timeout
    await page.waitForSelector(table, { timeout: WAIT_TIMEOUT });
    await page.waitForSelector(iconPlus, { timeout: WAIT_TIMEOUT });

    // Inner helper functions (need access to the current page instance)
    /** @param {any} objectResult */
    async function obtainNumbers(objectResult) {
      await page.waitForSelector(tableHeader, { timeout: WAIT_TIMEOUT });
      /** @type {any} */
      const nSorteoText = await page.$eval(tableHeader, text => text.textContent || '');
      const nSorteoMatch = nSorteoText.match(regexSorteo);
      objectResult.results.numSorteo = nSorteoMatch ? parseInt(nSorteoMatch[0], 10) : 0;

      /** @type {any} */
      const ubicacion = await page.$$eval(itemsLeft, texts => { return texts.map(text => text.textContent || ''); });
      /** @type {any} */
      const premiados = await page.$$eval(itemsRight, texts => { return texts.map(text => text.textContent || ''); });
      for (let index = 0; index < 10; index++) {
        const numMatch = (ubicacion[index] || '').match(regexNumber);
        const premioMatch = (premiados[index] || '').match(regexNumber);
        const key = numMatch ? `number-${numMatch[0]}` : `number-${index}`;
        objectResult.results[key] = premioMatch ? parseInt(premioMatch[0], 10) : 0;
      }
    }

    /** 
     * @returns {Promise<object>}
     */
    async function obtainJackpotFiveDetails() {
      const [jackpot, rawTotal, winnersNumber, rawVacant] = await Promise.all(
        [1, 2, 3, 4].map(index => 
          page.$eval(selectJackpot5(index), text => (text.textContent || '').trim())
        )
      );

      return {
        jackpot,
        totalAccumulated: `$${rawTotal}`,
        winnersNumber,
        vacant: /VACANTE/i.test(rawVacant),
        estimatedNextDraw: await obtainEstimatedNextDrawJackpot(),
      };
    }

    /**
     * @returns {Promise<string | null>}
     */
    async function obtainEstimatedNextDrawJackpot() {
      try {
        const pdfUrl = await page.$eval('a[href*=".pdf"]', link => link.href);
        const amount = await extractEstimatedJackpotFromPdf(pdfUrl);

        if (!amount) {
          console.warn('\x1b[33mEstimated jackpot was not found in the Poceada PDF.\x1b[0m');
        }

        return amount;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`\x1b[33mCould not obtain the estimated jackpot: ${errorMessage}\x1b[0m`);
        return null;
      }
    }

    //save all data:::disable by default
    if((config.ALL_DATA ?? '').toLowerCase() === 'true') {
      for (let index = 0; index < 10; index++) {
        /** @type {any} */
        const objectResult = { results: {} };
        /** @type {any} */
        const sorteoTexts = await page.$$eval(itemsLeft, texts => { return texts.map(text => text.textContent || ''); });
        /** @type {any} */
        const fechaTexts = await page.$$eval(itemsRight, texts => { return texts.map(text => text.textContent || ''); });
        const sorteoMatch = sorteoTexts[index] ? sorteoTexts[index].match(regexSorteo) : null;
        const fechaMatch = fechaTexts[index] ? fechaTexts[index].match(regexFecha) : null;
        objectResult.sorteo = sorteoMatch ? parseInt(sorteoMatch[0], 10) : 0;
        objectResult.fecha = fechaMatch ? fechaMatch[0] : '';
        const results = await page.$$(iconPlus);
        await results[index].evaluate(button => button.click());

        await obtainNumbers(objectResult);
        objectResult.pozo = await obtainJackpotFiveDetails();

        allResults.push(objectResult);
        await page.goBack();
        // Small pause after going back (helps in CI)
        await new Promise(r => setTimeout(r, 1500));
      }
    } else {
      //save the last results (first element):::
      /** @type {any} */
      const objectResult = { results: {} };
      /** @type {any} */
      const sorteoText = await page.$eval(firstLeft, text => text.textContent || '');
      /** @type {any} */
      const fechaText = await page.$eval(firstRight, text => text.textContent || '');
      const sorteoMatch = sorteoText.match(regexSorteo);
      const fechaMatch = fechaText.match(regexFecha);
      objectResult.sorteo = sorteoMatch ? parseInt(sorteoMatch[0], 10) : 0;
      objectResult.fecha = fechaMatch ? fechaMatch[0] : '';
      await page.click(firstIconPlus);

      await obtainNumbers(objectResult);
      objectResult.pozo = await obtainJackpotFiveDetails();

      allResults.push(objectResult);
    }

    console.table(allResults);
    console.log('\x1b[32mScraping completed successfully.\x1b[0m');

  } catch (error) {
    console.error('\x1b[31mError during scraping:\x1b[0m', error);
    await takeDebugScreenshot(page, 'scrape-failure');
    throw error; // rethrow so the workflow fails clearly
  } finally {
    await browser.close().catch(() => {});
  }

  console.log('\x1b[36mScript finished!\x1b[0m');

  (config.SAVE_DATA ?? '').toLowerCase() === 'true' && allResults.length > 0 
    ? saveData(allResults) 
    : console.log('\x1b[33mdata not sent to MongoDB\x1b[0m');
})();
