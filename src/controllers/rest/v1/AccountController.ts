import { Controller, Inject } from "@tsed/di";
import { PathParams, QueryParams } from "@tsed/platform-params";
import { Description, Get, Returns, Summary } from "@tsed/schema";
import { SolSplTransferDataModel } from "src/models/SolSplTransferDataModel";
import { SolanaService } from "src/services/SolanaService";
import { CLogger } from "src/utils/logger";

@Controller("/account")
export class AccountController {
  @Inject()
  logger: CLogger;

  @Inject()
  solanaService: SolanaService;

  $onInit() {
    this.logger.name = "AccountController";
  }

  @Get("/:address")
  @Summary("Get account SPL transfer history")
  @Description("Return history for this account")
  @Returns(200, Array).Of(SolSplTransferDataModel)
  async splTranfer(
    @PathParams("address") address: string,
    @QueryParams("offset") offset: number = 0,
    @QueryParams("limit") limit: number = 30
  ): Promise<SolSplTransferDataModel[]> {
    const transferMap: { [key: string]: ISolSPLTransferData } = {};
    const stepnTokens: ISolSPLTransferData[] = [];

    const data = await this.solanaService.getSPLTransfer(address, offset, limit);
    const transferList = data.data;
    const getTokenMetaApiList = transferList
      .map((transfer) => {
        transferMap[transfer.tokenAddress] = transfer;
        return transfer.tokenAddress;
      })
      .map((address): Promise<{ tokenMeta: ITokenMeta; address: string }> => {
        return new Promise((resolve, reject) => {
          this.solanaService
            .getTokenMetaData(address)
            .then((data) =>
              resolve({
                tokenMeta: data,
                address
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
            this.logger.info("getAccountTranferHistory", "Found seaker", tokenMeta.name);
            stepnTokens.push(transferMap[address]);
          }
        }
      });
    });
    return stepnTokens;
  }
}
