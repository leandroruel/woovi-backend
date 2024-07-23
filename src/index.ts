import cors from "@koa/cors";
import dotenv from "dotenv";
import http from "http";
import app from "./server";
import { NODE_PORT } from "./config";

import authDirective from "@/graphql/directives";
import { getUser } from "@/helpers/auth";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

dotenv.config();

const EXTERNAL_ENDPOINT = String(process.env.GRAPHQL_URL);

async function server({ typeDefs, resolvers }: any) {
  const httpServer = http.createServer();
  const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective(
    "auth",
    getUser,
  );
  const schema = makeExecutableSchema({
    typeDefs: [typeDefs, authDirectiveTypeDefs],
    resolvers,
  });

  const schemaWithAuthDirective = authDirectiveTransformer(schema);

  const apolloServer = new ApolloServer({
    schema: schemaWithAuthDirective,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
  });

  await apolloServer.start();

  httpServer.on("request", app.callback());

  app.use(
    koaMiddleware(apolloServer, {
      context: async ({ ctx }) => ({
        token: ctx.headers.authorization,
      }),
    }),
  );

  await new Promise((resolve: any) =>
    httpServer.listen({ port: NODE_PORT }, resolve),
  );

  console.log(`🚀 Server ready at ${EXTERNAL_ENDPOINT}`);

  return { apolloServer, app };
}

server({ typeDefs, resolvers }).then(({ app }) => {
  app.use(
    cors({
      origin: "*",
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
      exposeHeaders: ["X-Request-Id"],
    }),
  );
});

export default app;
