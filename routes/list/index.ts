import puppeteer from 'puppeteer';
import scrapCardsFromPage from './scrapCardsFromPage';

const url = 'https://www.zrsr.sk/index';

// const search = '54980747';
// const search = 'peter kovac';

const list = async (search: string) => {
  console.log('start parsing');

  const startDate = new Date();

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    let timing = 0;
    const intervalID = setInterval(async () => {
      timing++;
      if (timing === 10) {
        await browser.close();
        clearInterval(intervalID);
      }
    }, 1000);
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    if (!Number.isNaN(Number(search))) {
      await page.type('#filter_ico', search);
    } else {
      await page.click('#how-filtered-om');
      await page.click('#filter_kdekolvek');
      await page.type('#filter_om', search);
    }
    await page.keyboard.press('Enter');
    await page.waitForSelector('.idsk-card');
    const result = await page.evaluate(scrapCardsFromPage);
    const endDate = new Date();
    console.log((endDate.getTime() - startDate.getTime()) * 0.001, 'seconds');
    await browser.close();
    clearInterval(intervalID);
    return result;
  } catch (error) {
    console.log(error);
    await browser.close();
    return [];
  }
};

export default list;
