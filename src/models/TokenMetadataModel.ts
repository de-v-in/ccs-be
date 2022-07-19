import { Property } from "@tsed/schema";

export class TokenMetadataModel implements IStepNTokenMeta {
  @Property()
  name: string;
  @Property()
  symbol: string;
  @Property()
  description: string;
  @Property()
  seller_fee_basis_points: number;
  @Property()
  image: string;
  @Property()
  external_url: string;
  @Property()
  properties: ITokenStepNProperties;
  @Property()
  attributes: ITokenStepNAttribute[];
  @Property()
  collection: ITokenStepNCollection;
}
