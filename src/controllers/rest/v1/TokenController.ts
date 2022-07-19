import { Controller, Inject } from "@tsed/di";
import { BadRequest, InternalServerError, NotFound } from "@tsed/exceptions";
import { PathParams, QueryParams } from "@tsed/platform-params";
import { Description, Get, Returns, Summary } from "@tsed/schema";
import got from "got/dist/source";
import { CommonResponseModel } from "src/models/CommonResponseModel";
import { SplTradeHistoryModel } from "src/models/SplTradeHistoryModel";
import { TokenMetadataModel } from "src/models/TokenMetadataModel";
import { OpenseaService } from "src/services/OpenseaService";
import { SolanaService } from "src/services/SolanaService";
import { CLogger } from "src/utils/logger";

@Controller("/token")
export class TokenController {
  @Inject()
  logger: CLogger;

  @Inject()
  solanaService: SolanaService;

  @Inject()
  openseaService: OpenseaService;

  $onInit() {
    this.logger.name = "TokenController";
  }

  @Get("/:address/metadata")
  @Summary("API to get token's metadata")
  @Description("Return metadata of Token if found")
  @Returns(200, TokenMetadataModel)
  @Returns(404, BadRequest)
  async metadata(@PathParams("address") address: string) {
    try {
      const tokenURI = await this.solanaService.getTokenUri(address);
      if (tokenURI) {
        return got(tokenURI).json<TokenMetadataModel>();
      }
    } catch (e) {
      throw new NotFound("Token not found");
    }
  }

  @Get("/:address/trades")
  @Summary("API to get token's metadata")
  @Description("Return metadata of Token if found")
  @Returns(200, Array).Of(SplTradeHistoryModel)
  @Returns(404, NotFound)
  @Returns(400, BadRequest)
  async trades(
    @PathParams("address") address: string,
    @QueryParams("offset") offset: number = 0,
    @QueryParams("limit") limit: number = 30
  ) {
    try {
      const data = await this.solanaService.getSPLTradeHistory(address, offset, limit);
      if (data.success) {
        return data.data;
      }
    } catch (e) {
      throw new BadRequest("Address not valid!");
    }
    throw new NotFound("Token not found!");
  }

  @Get("/:address/opensea/price")
  @Summary("API to get token's metadata")
  @Description("Return metadata of Token if found")
  @Returns(200, CommonResponseModel<number>)
  @Returns(404, NotFound)
  @Returns(500, InternalServerError)
  async openseaPricing(@PathParams("address") address: string) {
    try {
      const data = await this.openseaService.getNFTPricing(address);
      if (data) {
        return { result: data };
      }
    } catch (e) {
      this.logger.error("opeseaPricing", "failed to get data", e);
      throw new InternalServerError("Crawl services failed");
    }
    throw new NotFound("Token not found");
  }
}
