import Koa from "koa";
import { koaBody } from "koa-body";
import logger from "koa-logger";

import Mongoose from "mongoose";
import { MONGODB_URL } from "./config";
import router from "./routes";
import checkRequest from "./middlewares/test.middleware";

const app = new Koa();
const isProduction = process.env.NODE_ENV === "production";

// Middlewares
app.use(logger());
app.use(checkRequest);

console.log("connecting to URL", MONGODB_URL);
Mongoose.connect(
  MONGODB_URL,
  isProduction
    ? {
        tlsCAFile: "global-bundle.pem", // for amazon DocumentDB
        tls: true,
      }
    : {},
);

Mongoose.connection.on("error", (error) => {
  console.log("Error connecting to database", error);
});

// Body parser
app.use(koaBody({ multipart: true }));

// Routes
app.use(router.routes());

export default app;
