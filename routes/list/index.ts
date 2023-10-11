import puppeteer from 'puppeteer';
import scrapCardsFromPage from './scrapCardsFromPage';

const url = 'https://www.zrsr.sk/index';

// const search = '54980747';
// const search = 'peter kovac';

const list = async (search: string) => {
  console.log('start parsing');

  const startDate = new Date();

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
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
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default list;
