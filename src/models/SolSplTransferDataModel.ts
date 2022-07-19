import { Property } from "@tsed/schema";

export class SolSplTransferDataModel implements ISolSPLTransferData {
  @Property()
  _id: string;

  @Property()
  address: string;

  @Property()
  signature: string[];

  @Property()
  changeType: string;

  @Property()
  changeAmount: number;

  @Property()
  decimals: number;

  @Property()
  postBalance: string;

  @Property()
  preBalance: string;

  @Property()
  tokenAddress: string;

  @Property()
  owner: string;

  @Property()
  symbol: string;

  @Property()
  blockTime: number;

  @Property()
  slot: number;

  @Property()
  fee: number;
}
