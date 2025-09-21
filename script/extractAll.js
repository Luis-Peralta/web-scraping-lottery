/* eslint-disable no-undef */
import puppeteer from 'puppeteer';
import { saveData } from './services/mongoConnection.js';
import 'dotenv/config';

//const selectors:::
const table = '.results-list';
const tableHeader = '.card-header h5';
const iconPlus = '.results-list__item a';
const itemsLeft = '[class="results-list__item"] .results-number:nth-child(1)';
const itemsRight = '[class="results-list__item"] .results-number:nth-child(2)';
const firstLeft = '[class="results-list__item"]:nth-child(2) .results-number:nth-child(1)';
const firstRight = '[class="results-list__item"]:nth-child(2) .results-number:nth-child(2)';
const firstIconPlus = '.results-list__item:nth-child(2) a';
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0';
const regexSorteo = /[0-9]{1,7}/gm;
const regexFecha = /([\d]{2}\/[\d]{2}\/[\d]{2})/gm;
const regexNumber = /[0-9]{1,2}/gm;

(async () => {
  console.log('\x1b[36mObtaining data...\x1b[0m');
  //data:::
  const allResults = [];

  //puppet config:::
  const browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--start-maximized', '--no-sandbox' ] });
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);
  await page.goto(process.env.URL ?? '');
  await page.waitForSelector(table);
  await page.waitForSelector(iconPlus);

  //save all data:::disable by default
  if((process.env.ALL_DATA ?? '').toLowerCase() === 'true') {
    for (let index = 0; index < 10; index++) {
      /** @type {any} */
      const objectResult = { results: {} };
      /** @type {any} */
      const sorteo = await page.$$eval(itemsLeft, texts => { return texts.map(text => text.textContent); });
      /** @type {any} */
      const fecha = await page.$$eval(itemsRight, texts => { return texts.map(text => text.textContent); });
      objectResult.sorteo = parseInt(sorteo[index].match(regexSorteo)[0]);
      objectResult.fecha = fecha[index].match(regexFecha)[0];
      const results = await page.$$(iconPlus);
      await results[index].evaluate(button => button.click());
  
      await obtainNumbers(objectResult);
      
      allResults.push(objectResult);
      await page.goBack();
    }
  } else {
    //save the last results (first element):::
    /** @type {any} */
    const objectResult = { results: {} };
    /** @type {any} */
    const sorteo = await page.$eval(firstLeft, text => text.textContent);
    /** @type {any} */
    const fecha = await page.$eval(firstRight, text => text.textContent);

    objectResult.sorteo = parseInt(sorteo.match(regexSorteo)[0]);
    objectResult.fecha = fecha.match(regexFecha)[0];
    await page.click(firstIconPlus);

    await obtainNumbers(objectResult);

    allResults.push(objectResult);
  }

  //function to obtain the all results for each sorteo
  /** @param {any} objectResult */
  async function obtainNumbers(objectResult) {
    await page.waitForSelector(tableHeader);
    /** @type {any} */
    const nSorteo = await page.$eval(tableHeader, text => text.textContent);
    objectResult.results.numSorteo = parseInt(nSorteo.match(regexSorteo)[0]);
    /** @type {any} */
    const ubicacion = await page.$$eval(itemsLeft, texts => { return texts.map(text => text.textContent); });
    /** @type {any} */
    const premiados = await page.$$eval(itemsRight, texts => { return texts.map(text => text.textContent); });
    for (let index = 0; index < 10; index++) {
      objectResult.results[`number-${ubicacion[index].match(regexNumber)[0]}`] = parseInt(premiados[index].match(regexNumber)[0]);
    }
  }

  console.table(allResults);
  await browser.close();
  console.log('\x1b[36mScript finished!\x1b[0m');

  (process.env.SAVE_DATA ?? '').toLowerCase() === 'true' && allResults.length > 0 
    ? saveData(allResults) 
    : console.log('\x1b[33mdata not sent to MongoDB\x1b[0m');
})();