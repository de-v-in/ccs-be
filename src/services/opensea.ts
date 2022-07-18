import { QueueManager } from "@saintno/needed-tools";
import { Logger } from "@utils/log";
import { CrawlerInstance } from "./crawler";

class OpenseaCrawlerService {
  maxParallelCall = 2;

  queue: QueueManager;
  logger: Logger;

  constructor() {
    this.queue = new QueueManager(
      "OpenseaQueueServices",
      this.maxParallelCall,
      false
    );
    this.logger = new Logger("OpenseaCrawlerServices");
  }

  async getNFTPricing(address: string): Promise<number | false> {
    const data = await CrawlerInstance.crawlStatic(
      `https://opensea.io/assets/solana/${address}`,
      "div.TradeStation--price-container > .TradeStation--price > .Price--amount"
    );
    return data ? parseFloat(data[0].trim().split("\n")[0]) : false;
  }
}

const OpenseaServiceInstance = new OpenseaCrawlerService();

export { OpenseaServiceInstance };
