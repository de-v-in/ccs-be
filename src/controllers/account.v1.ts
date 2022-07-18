import { Logger } from "@utils/log";
import { SolanaServices } from "@services/solana";

const log = new Logger("AccountController.v1");

const getAccountTransferHistory = async (
  account: string,
  offset = 0,
  limit = 30
): Promise<IStepNSPLTransfer[]> => {
  const transferMap = {};
  const stepnTokens: IStepNSPLTransfer[] = [];

  const data = await SolanaServices.getSPLTransfer(account, offset, limit);
  const transferList = data.data;
  const getTokenMetaApiList = transferList
    .map((transfer) => {
      transferMap[transfer.tokenAddress] = transfer;
      return transfer.tokenAddress;
    })
    .map((address): Promise<{ tokenMeta: ITokenMeta; address: string }> => {
      return new Promise((resolve, reject) => {
        SolanaServices.getTokenMetaData(address)
          .then((data) =>
            resolve({
              tokenMeta: data,
              address,
            })
          )
          .catch(reject);
      });
    });

  await Promise.allSettled(getTokenMetaApiList).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const { tokenMeta, address } = result.value;
        const nameArr = tokenMeta.name.split(" ");
        if (nameArr[0] === "Sneaker") {
          log.i("getAccountTranferHistory", "Found seaker", tokenMeta.name);
          stepnTokens.push(transferMap[address]);
        }
      }
    });
  });
  return stepnTokens;
};

export { getAccountTransferHistory };
