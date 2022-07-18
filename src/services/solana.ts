import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";
import { QueueManager } from "@saintno/needed-tools";
import { Logger } from "@utils/log";
import got from "got/dist/source";

class SolanaCrawlerService {
  endpoint = "https://public-api.solscan.io";
  chain = "https://api.mainnet-beta.solana.com";
  maxParallelCall = 20;

  queue: QueueManager;
  logger: Logger;

  constructor() {
    this.queue = new QueueManager(
      "SolscanQueueService",
      this.maxParallelCall,
      false
    );
    this.logger = new Logger("SolanaCrawlerServices");
  }

  async getSPLTransfer(account: string, offset = 0, limit = 0) {
    /**
     * High priority for table loading first
     */
    this.logger.i("getSPLTransfer", account, { offset, limit });
    return this.queue.wait(
      () =>
        got(
          `${this.endpoint}/account/splTransfers?account=${account}&offset=${offset}&limit=${limit}`
        ).json<ISPLTransfer>(),
      true
    );
  }

  async getTransactionDetail(signature: string) {
    this.logger.i("getTransactionDetail", signature);
    return this.queue.wait(() =>
      got(
        `${this.endpoint}/transaction/${signature}`
      ).json<ITransactionDetail>()
    );
  }

  async getTokenMetaData(address: string) {
    this.logger.i("getTokenMetaData", address);
    return this.queue.wait(() =>
      got(
        `${this.endpoint}/token/meta?tokenAddress=${address}`
      ).json<ITokenMeta>()
    );
  }

  async getSPLTradeHistory(address: string, offset = 0, limit = 0) {
    this.logger.i("getSPLTradeHistory", address, { offset, limit });
    return this.queue.wait(() =>
      got(
        `https://api.solscan.io/nft/trade?mint=${address}&offset=${offset}&limit=${limit}`
      ).json<ISPLTrade>()
    );
  }

  async getTokenUri(address: string): Promise<string> {
    this.logger.i("getTokenUri", address);
    const mintPubkey = new PublicKey(address as string);
    const connection = new Connection(this.chain);
    const tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
    const tokenmeta: any = await Metadata.load(connection, tokenmetaPubkey);
    return tokenmeta.data.data.uri;
  }
}

const SolanaServiceInsatance = new SolanaCrawlerService();

export { SolanaServiceInsatance };
