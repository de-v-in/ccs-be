import Koa from "koa";
import { Logger } from "@utils/log";
import { routerV1 } from "./router.v1";
import { performance } from "perf_hooks";

const app = new Koa();

const gLog = new Logger("Global");
const port = process.env.PORT || 3000;

app.use(async (ctx, next) => {
  const startTime = performance.now();
  await next();
  const endTime = performance.now();
  gLog.r(ctx.method, ctx.url, {
    status: ctx.body?.status,
    processTime: `${Math.round(endTime - startTime)}ms`,
  });
});

/**
 * Add the routers to the app
 */
app.use(routerV1.routes());

gLog.i("APP", `Running at http://localhost:${port}`);

export { gLog };

app.listen(process.env.PORT || 3000);
