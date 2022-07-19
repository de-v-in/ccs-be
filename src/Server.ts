import { join } from "path";
import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-koa"; // /!\ keep this import
import bodyParser from "koa-bodyparser";
import compress from "koa-compress";
import cors from "@koa/cors";
import methodOverride from "koa-override";
import "@tsed/ajv";
import "@tsed/swagger";
import { config } from "./config/index";
import { AccountController, TokenController } from "./controllers/rest";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    "/api/v1": [AccountController, TokenController],
    "/": ["./controllers/pages/*.ts"]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [cors(), compress({}), methodOverride(), bodyParser()],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  cache: {
    ttl: 300, // default TTL
    store: "memory"
    // options options depending on the choosen storage type
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
