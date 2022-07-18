interface IStepNTokenMeta {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  external_url: string;
  properties: ITokenStepNProperties;
  attributes: ITokenStepNAttribute[];
  collection: ITokenStepNCollection;
}

interface ITokenStepNProperties {
  files: ITokenStepNMedia[];
  category: string;
  creators: ITokenStepNCreator[];
}

interface ITokenStepNMedia {
  uri: string;
  type: string;
}

interface ITokenStepNCreator {
  address: string;
  share: number;
}

interface ITokenStepNAttribute {
  trait_type: string;
  value: string;
}

interface ITokenStepNCollection {
  name: string;
  family: string;
}
