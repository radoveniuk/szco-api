import { scrapInfo } from './scrapInfo';
import PuppeteerBrowser from '../../browser';
import axios from 'axios';

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

    const financialData = await axios({
      method: 'GET',
      url: 'https://iz.opendata.financnasprava.sk/api/data/ds_dsrdp/search',
      params: {
        page: 1,
        column: 'ico',
        search: result.cin
      },
      headers: {
        accept: 'application/json',
        key: 'ocXNnDN0FDdwWKuVB46OSHw1MEe6Wga8PLMIzd8ZGri7AobdXwdK3WraVz4xaw57kqOr3CuUyt0LvMggUCHQ7KEOecBxXHTE4DteWyQFi8MsTF2Fdx5gXeTbkm5FEr3CHpao6AQqAdb9BulVABzSDqQqSRs527USspcmxLteeJVn3KCnADsae8StuBP5cTwpQExP0JOeQFcGWvrDVZAyR2N6qtts3mDA7CnTNX9bljF0SO6oXsjG4ZNrfh'
      }
    }).then(res => res.data.data?.[0]);

    return { ...result, DIC: financialData.DIC };
  } catch (error) {
    console.log(error);
    await PuppeteerBrowser.close();
    return null;
  }
};

export default extended;
