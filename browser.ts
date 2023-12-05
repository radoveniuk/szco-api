import puppeteer from 'puppeteer';

export default class PuppeteerBrowser {
  private static instance: puppeteer.Browser | null = null;

  static async browser (): Promise<puppeteer.Browser> {
    try {
      if (!PuppeteerBrowser.instance) {
        PuppeteerBrowser.instance = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      }
      return PuppeteerBrowser.instance;
    } catch (error) {
      console.error('Ошибка при запуске браузера:', error);
      throw error;
    }
  }

  static async close (): Promise<void> {
    try {
      if (PuppeteerBrowser.instance) {
        await PuppeteerBrowser.instance.close();
        PuppeteerBrowser.instance = null;
      }
    } catch (error) {
      console.error('Ошибка при закрытии браузера:', error);
      throw error;
    }
  }
}
