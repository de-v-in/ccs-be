import { Inject, Injectable } from "@tsed/di";
import { CLogger } from "src/utils/logger";
import { CrawlService } from "./CrawlService";

@Injectable()
export class OpenseaService {
  @Inject()
  logger: CLogger;

  @Inject()
  crawlService: CrawlService;

  $onInit() {
    this.logger.name = "OpenseaService";
    this.logger.info("onInit", "Opensea service started!");
  }

  async getNFTPricing(address: string): Promise<number | false> {
    const data = await this.crawlService.crawlStatic(
      `https://opensea.io/assets/solana/${address}`,
      "div.TradeStation--price-container > .TradeStation--price > .Price--amount"
    );
    return data ? parseFloat(data[0].trim().split("\n")[0]) : false;
  }
}
