import { Property } from "@tsed/schema";

export class SplTradeHistoryModel implements ISPLTradeData {
  @Property()
  _id: string;
  @Property()
  mint: string;
  @Property()
  name: string;
  @Property()
  symbol: string;
  @Property()
  buyer: string;
  @Property()
  seller: string;
  @Property()
  price: number;
  @Property()
  collection: string;
  @Property()
  collectionId: string;
  @Property()
  tradeTime: number;
  @Property()
  dex: string;
  @Property()
  signature: string;
  @Property()
  family: string;
  @Property()
  type: string;
  @Property()
  image: string;
  @Property()
  attributes: ISPLTradeAttribute[];
}
