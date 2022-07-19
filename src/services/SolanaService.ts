import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";
import { UseCache } from "@tsed/common";
import { Inject, Injectable } from "@tsed/di";
import got from "got";
import { CLogger } from "src/utils/logger";

@Injectable()
export class SolanaService {
  endpoint = "https://public-api.solscan.io";
  chain = "https://api.mainnet-beta.solana.com";

  @Inject()
  logger: CLogger;

  $onInit() {
    this.logger.name = "SolanaService";
    this.logger.info("onInit", "Solana service started!");
  }

  @UseCache({ ttl: 120 })
  async getSPLTransfer(account: string, offset = 0, limit = 0) {
    this.logger.info("getSPLTransfer", account, { offset, limit });
    return got(`${this.endpoint}/account/splTransfers?account=${account}&offset=${offset}&limit=${limit}`).json<ISPLTransfer>();
  }

  @UseCache()
  async getTokenMetaData(address: string) {
    this.logger.info("getTokenMetaData", address);
    return got(`${this.endpoint}/token/meta?tokenAddress=${address}`).json<ITokenMeta>();
  }

  @UseCache()
  async getTransactionDetail(signature: string) {
    this.logger.info("getTransactionDetail", signature);
    return got(`${this.endpoint}/transaction/${signature}`).json<ITransactionDetail>();
  }

  @UseCache({ ttl: 120 })
  async getSPLTradeHistory(address: string, offset = 0, limit = 0) {
    this.logger.info("getSPLTradeHistory", address, { offset, limit });
    return got(`https://api.solscan.io/nft/trade?mint=${address}&offset=${offset}&limit=${limit}`).json<ISPLTrade>();
  }

  @UseCache()
  async getTokenUri(address: string): Promise<string> {
    this.logger.info("getTokenUri", address);
    const mintPubkey = new PublicKey(address as string);
    const connection = new Connection(this.chain);
    const tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
    const tokenmeta = await Metadata.load(connection, tokenmetaPubkey);
    return tokenmeta.data.data.uri;
  }
}
