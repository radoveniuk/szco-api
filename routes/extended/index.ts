import puppeteer from 'puppeteer';
import { scrapInfo } from './scrapInfo';

const extended = async (id: string) => {
  const startDate = new Date();

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    const url = `https://www.zrsr.sk/Detail/${id}`;

    await page.goto(url, { waitUntil: 'networkidle2' });
    const combobox = await page.$('#vypis_uplny');
    if (!combobox) {
      await browser.close();
      const endDate = new Date();
      console.log((endDate.getTime() - startDate.getTime()) * 0.001, 'seconds');
      return null;
    }
    await page.click('#vypis_uplny');
    const result = await page.evaluate(scrapInfo);
    await browser.close();
    const endDate = new Date();
    console.log((endDate.getTime() - startDate.getTime()) * 0.001, 'seconds');
    return result;
  } catch (error) {
    console.log(error);
    await browser.close();
    return null;
  }
};

export default extended;
