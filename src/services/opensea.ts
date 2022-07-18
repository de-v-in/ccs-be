import { QueueManager } from "@saintno/needed-tools";
import { exec } from "child_process";
import { Logger } from "@utils/log";

class OpenseaCrawlerServices {
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
    const result: string = await this.queue.wait(
      () =>
        new Promise((resolve, rej) =>
          exec(
            `curl --user-agent 'Chrome/79' --silent https://opensea.io/assets/solana/${address} > /tmp/${address} && xidel -s /tmp/${address} --xpath "//div[contains(@class, 'Price--amount')]" && rm /tmp/${address}`,
            (err, stdout) => {
              if (err) {
                resolve("");
              }
              resolve(stdout);
            }
          )
        )
    );
    return result.length > 0 ? parseFloat(result.trim().split("\n")[0]) : false;
  }
}

const OpenseaServices = new OpenseaCrawlerServices();

export { OpenseaServices };
