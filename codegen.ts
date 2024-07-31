import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";
dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_URL,
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-mongodb"],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
  config: {
    scalars: {
      DateTime: "Date",
      UUID: "string",
      ObjectID: "string",
      JSON: "Record<string, any>",
    },
  },
};

export default config;
