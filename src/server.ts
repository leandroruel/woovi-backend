import Koa from "koa";
import { koaBody } from "koa-body";
import logger from "koa-logger";

import Mongoose from "mongoose";
import { MONGODB_URL } from "./config";
import router from "./routes";
import checkRequest from "./middlewares/test.middleware";

const app = new Koa();

// Middlewares
app.use(logger());
app.use(checkRequest);

Mongoose.connect(MONGODB_URL);

Mongoose.connection.on("error", (error) => {
  console.log("Error connecting to database", error);
});

// Body parser
app.use(koaBody({ multipart: true }));

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
