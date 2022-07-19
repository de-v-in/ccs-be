interface ISPLTransfer {
  total: number;
  data: ISolSPLTransferData[];
}

interface ISolSPLTransferData {
  _id: string;
  address: string;
  signature: string[];
  changeType: string;
  changeAmount: number;
  decimals: number;
  postBalance: string;
  preBalance: string;
  tokenAddress: string;
  owner: string;
  symbol: string;
  blockTime: number;
  slot: number;
  fee: number;
}

interface IStepNSPLTransfer extends ISolSPLTransferData {
  balance: ISPLTransferBalance;
}

interface ISPLTransferBalance {
  amount: string;
  decimals: number;
}

interface ISPLTrade {
  success: boolean;
  data: ISPLTradeData[];
}

interface ISPLTradeData {
  _id: string;
  mint: string;
  name: string;
  symbol: string;
  buyer: string;
  seller: string;
  price: number;
  collection: string;
  collectionId: string;
  tradeTime: number;
  dex: string;
  signature: string;
  family: string;
  type: string;
  image: string;
  attributes: ISPLTradeAttribute[];
}

interface ISPLTradeAttribute {
  trait_type: string;
  value: string;
}

interface ITokenMeta {
  name: string;
  symbol: string;
  decimals: number;
  tokenAuthority: string;
  supply: string;
  type: string;
}

interface ITransactionDetail {
  blockTime: number;
  slot: number;
  txHash: string;
  fee: number;
  status: string;
  lamport: number;
  signer: string[];
  logMessage: string[];
  inputAccount: IInputAccount[];
  recentBlockhash: string;
  innerInstructions: IInnerInstruction[];
  tokenBalanes: any[];
  parsedInstruction: IParsedTransactionInstruction[];
  confirmations: number;
  tokenTransfers: any[];
  solTransfers: any[];
  serumTransactions: any[];
  raydiumTransactions: any[];
  unknownTransfers: IUnknownTransfer[];
}

interface IInputAccount {
  account: string;
  signer: boolean;
  writable: boolean;
  preBalance: number;
  postBalance: number;
}

interface IInnerInstruction {
  index: number;
  parsedInstructions: IParsedInnerInstruction[];
}

interface IParsedInnerInstruction {
  programId: string;
  program: string;
  type: string;
  name: string;
  params: IInnerParams;
}

interface IInnerParams {
  source: string;
  destination: string;
  amount: number;
}

interface IParsedTransactionInstruction {
  programId: string;
  type: string;
  data: string;
  dataEncode: string;
  name: string;
  params: { [key: string]: string };
}

interface IUnknownTransfer {
  programId: string;
  event: IUnknownEvent[];
}

interface IUnknownEvent {
  source: string;
  destination: string;
  amount: number;
  type: string;
  decimals: number;
  symbol: string;
  tokenAddress: string;
}
