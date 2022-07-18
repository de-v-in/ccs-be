import { QueueManager } from "@saintno/needed-tools";
import { Logger } from "@utils/log";
import { load } from "cheerio";
import { Browser, PuppeteerLifeCycleEvent } from "puppeteer";
import Puppeteer from "puppeteer-extra";
import StealPlugin from "puppeteer-extra-plugin-stealth";
import { exec } from "child_process";

/**
 * Crawl web data service
 * Static web: Using cURL => cherrio for parsing data
 * Dynamic web: Using puppeteer then parsing with its engine
 */
class Crawler {
  /**
   * Allow page crawl at same time
   * For better server resource, keep this value as low as possible
   */
  maxParallelCall: 4;
  browser: Browser;

  log: Logger;
  queue: QueueManager;

  constructor() {
    this.log = new Logger("Crawler");
    this.queue = new QueueManager("CrawlerQueue", this.maxParallelCall, false);
    Puppeteer.use(StealPlugin());
    Puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    }).then((browser) => (this.browser = browser));
  }

  /**
   * Handle crawling dynamic web with puppeteer
   */
  private async crawl(
    url: string,
    selector: string,
    opts: { wait?: PuppeteerLifeCycleEvent }
  ) {
    if (!this.browser) return;
    try {
      const page = await this.browser.newPage();
      await page.setRequestInterception(true);
      await page.setCacheEnabled(false);

      /**
       * Disabled unused resource => more speed
       */
      page.on("request", (req) => {
        switch (req.resourceType()) {
          case "image":
          case "stylesheet":
          case "font":
            req.abort();
            break;
          default:
            req.continue();
        }
      });

      await page.goto(url, { waitUntil: opts?.wait || "networkidle0" });

      /**
       * Get needed information
       */
      const result = await page.$$(selector);
      const data = (
        await Promise.allSettled(
          result?.map((v) => v.evaluate((e) => e.textContent as string))
        )
      )
        .map((v) => (v.status === "fulfilled" ? v.value : ""))
        .filter((v) => v.length > 0);
      this.log.i("crawl", "Success get page content", {
        url,
        data,
      });
      await page.close();
      return data;
    } catch (e) {
      this.log.w("crawl", `Crawl data failed for link ${url}`, e);
      return false;
    }
  }

  /**
   * Crawl static web => using curl for better resources
   */
  public async crawlStatic(url: string, selector: string) {
    this.log.i("get", `Start crawling link`, url);
    const html = await new Promise<string>((resolve) =>
      exec(
        `curl --tls-max 1.1 -A 'Chrome/79' ${url}`,
        { maxBuffer: 1024 * 2048 }, // Max allow 2 MB between call
        (err, stdout) => {
          if (err) {
            console.log(err);
            resolve("");
          }
          resolve(stdout);
        }
      )
    );
    if (html.length > 0) {
      try {
        const $ = load(html);
        const result = $(selector).text();
        return result || false;
      } catch (e) {
        this.log.w("get", `Crawl data failed for link ${url}`, e);
      }
    }
    return false;
  }

  /**
   * Crawl dynamic web => using puppeteer for better compatible
   */
  public async crawlLive(
    url: string,
    selector: string,
    opts?: { wait?: PuppeteerLifeCycleEvent }
  ) {
    this.log.i("get_live", `Start crawling link`, url);
    const result = await this.queue.wait(() => this.crawl(url, selector, opts));
    return result || false;
  }
}

const CrawlerInstance = new Crawler();

export { CrawlerInstance };
