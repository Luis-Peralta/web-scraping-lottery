/* eslint-disable no-undef */
import puppeteer from 'puppeteer';
import 'dotenv/config';

//const selectors:::
const table = '.results-list';
const tableHeader = '.card-header h5';
const iconPlus = '.results-list__item a';
const itemsLeft = '[class="results-list__item"] .results-number:nth-child(1)';
const itemsRight = '[class="results-list__item"] .results-number:nth-child(2)';

(async () => {
  const allResults = [];
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: null, args:['--start-maximized' ] });
  const page = await browser.newPage();

  await page.goto(process.env.URL);
  await page.waitForSelector(table);

  for (let index = 0; index < 10; index++) {
    const objectResult = {};
    objectResult.results = {};
    await page.waitForSelector(iconPlus);
    const sorteo = await page.$$eval(itemsLeft, texts => { return texts.map(text => text.textContent.match(/[0-9]{1,7}/gm)); });
    const fecha = await page.$$eval(itemsRight, texts => { return texts.map(text => text.textContent.match(/([\d]{2}\/[\d]{2}\/[\d]{2})/gm)); });
    objectResult.sorteo = parseInt(sorteo[index][0]);
    objectResult.fecha = fecha[index][0];
    
    const results = await page.$$(iconPlus);
    await results[index].evaluate(button => button.click());
    await page.waitForSelector(tableHeader);

    const nSorteo = await page.$eval(tableHeader, text => text.textContent.match(/[0-9]{1,7}/gm));
    objectResult.results.numSorteo = parseInt(nSorteo[0]);
    const ubicacion = await page.$$eval(itemsLeft, texts => { return texts.map(text => text.textContent.match(/[0-9]{1,2}/gm)); });
    const premiados = await page.$$eval(itemsRight, texts => { return texts.map(text => text.textContent.match(/[0-9]{1,2}/gm)); });
    for (let index = 0; index < 10; index++) {
      objectResult.results[`number-${ubicacion[index][0]}`] = parseInt(premiados[index][0]);
    }

    allResults.push(objectResult);
    await page.goBack();
  }

  console.log(allResults);

  await browser.close();
})();