import { scrapInfo } from './scrapInfo';
import PuppeteerBrowser from '../../browser';

const spinner = ['|', '/', '-', '\\'];

const extended = async (id: string) => {
  const browser = await PuppeteerBrowser.browser();
  const page = await browser.newPage();

  try {
    let timing = 0;
    const intervalID = setInterval(async () => {
      timing++;
      process.stdout.write(`\r${spinner[timing % spinner.length]} Loading... ${timing / 100} seconds`);
      if (timing === 400) {
        await PuppeteerBrowser.close();
        clearInterval(intervalID);
      }
    }, 10);
    const url = `https://www.zrsr.sk/Detail/${id}`;

    await page.goto(url, { waitUntil: 'networkidle2' });
    const combobox = await page.$('#vypis_uplny');
    if (!combobox) {
      clearInterval(intervalID);
      await PuppeteerBrowser.close();
      return null;
    }
    await page.click('#vypis_uplny');
    const result = await page.evaluate(scrapInfo);
    clearInterval(intervalID);
    await PuppeteerBrowser.close();
    return result;
  } catch (error) {
    console.log(error);
    await PuppeteerBrowser.close();
    return null;
  }
};

export default extended;
