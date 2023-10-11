import puppeteer from 'puppeteer';
import { scrapInfo } from './scrapInfo';

const extended = async (id: string) => {
  const startDate = new Date();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = `https://www.zrsr.sk/Detail/${id}`;

  await page.goto(url, { waitUntil: 'networkidle2' });
  // page.click('#vypis_uplny');
  try {
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
