import puppeteer from 'puppeteer';
import { scrapInfo } from './scrapInfo';

const extended = async (id: string) => {
  const startDate = new Date();

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const url = `https://www.zrsr.sk/Detail/${id}`;

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.click('#vypis_uplny');
    const result = await page.evaluate(scrapInfo);
    await browser.close();
    const endDate = new Date();
    console.log((endDate.getTime() - startDate.getTime()) * 0.001, 'seconds');
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default extended;
