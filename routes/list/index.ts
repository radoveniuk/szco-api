import scrapCardsFromPage from './scrapCardsFromPage';
import PuppeteerBrowser from '../../browser';

const url = 'https://www.zrsr.sk/index';

const spinner = ['|', '/', '-', '\\'];

const list = async (search: string) => {
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
    await PuppeteerBrowser.close();
    clearInterval(intervalID);
    return result;
  } catch (error) {
    console.log(error);
    await PuppeteerBrowser.close();
    return [];
  }
};

export default list;
