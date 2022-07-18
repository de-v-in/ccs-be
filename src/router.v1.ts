import Router from "koa-router";

import { getAccountTransferHistory } from "@controllers/account.v1";
import {
  getTokenMetadata,
  getTokenOpenseaPricing,
  getTokenTradeHistory,
} from "@controllers/token.v1";
import { ResponseBuilder } from "@utils/response-builder";

export const routerV1 = new Router({ prefix: "/api/v1" })
  .get("/account/:address", async (c) => {
    c.body = await getAccountTransferHistory(
      c.params.address,
      parseInt(c.query.offset as string, 10) || undefined,
      parseInt(c.query.limit as string, 10) || undefined
    )
      .then((data) => new ResponseBuilder(data).success().build())
      .catch((e) => new ResponseBuilder(e).error().build());
  })
  .get("/token/:address/opensea", async (c) => {
    c.body = await getTokenOpenseaPricing(c.params.address)
      .then((data) => new ResponseBuilder(data).success().build())
      .catch((e) => new ResponseBuilder(e).error().build());
  })
  .get("/token/:address/trades", async (c) => {
    c.body = await getTokenTradeHistory(
      c.params.address,
      parseInt(c.query.offset as string, 10) || undefined,
      parseInt(c.query.limit as string, 10) || undefined
    )
      .then((data) => new ResponseBuilder(data).success().build())
      .catch((e) => new ResponseBuilder(e).error().build());
  })
  .get("/token/:address", async (c) => {
    c.body = await getTokenMetadata(c.params.address)
      .then((data) => new ResponseBuilder(data).success().build())
      .catch((e) => new ResponseBuilder(e).error().build());
  });
