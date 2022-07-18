import { OpenseaServiceInstance } from "@services/opensea";
import { SolanaServiceInsatance } from "@services/solana";
import { Logger } from "@utils/log";
import got from "got/dist/source";

const log = new Logger("TokenController.v1");

const getTokenMetadata = async (address: string): Promise<IStepNTokenMeta> => {
  const tokenURI = await SolanaServiceInsatance.getTokenUri(address);
  log.i("getTokenMetadata", "Found tokenURI", tokenURI);
  const meta = await got
    .get(tokenURI, {
      method: "GET",
    })
    .json<IStepNTokenMeta>();
  return meta;
};

const getTokenOpenseaPricing = async (address: string) => {
  const price = await OpenseaServiceInstance.getNFTPricing(address);
  log.i("getTokenOpenseaPricing", price ? "Found price" : "Price unknown", {
    price,
  });

  return {
    result: price,
    type: "SOL",
    link: `https://opensea.io/assets/solana/${address}`,
  };
};

const getTokenTradeHistory = async (address: string, offset = 0, limit = 5) => {
  const trades = await SolanaServiceInsatance.getSPLTradeHistory(
    address,
    offset,
    limit
  );
  log.i("getTokenTradeHistory", address, `Found ${trades.data.length} trades`);
  return trades;
};

export { getTokenMetadata, getTokenOpenseaPricing, getTokenTradeHistory };
