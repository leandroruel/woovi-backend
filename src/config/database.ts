import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: string | number;
  name: string;
  username: string;
  password: string;
}

interface Config {
  database: DatabaseConfig;
  dropDatabase: boolean;
}

/**
 * Application configuration
 * @constant {Config} config - The application configuration
 */
const config: Config = {
  database: {
    host: process.env.MONGO_HOST || "localhost",
    port: process.env.MONGO_PORT || 27017,
    name: process.env.MONGODB_DATABASE || "mydatabase",
    username: process.env.MONGO_USERNAME || "root",
    password: String(process.env.MONGO_PASSWORD),
  },
  dropDatabase: true,
};

/**
 * Check if the application is in production
 */
const isProduction = process.env.NODE_ENV === "production";

/**
 * MongoDB application name
 * @constant {string} MONGO_APP_NAME - The name of the MongoDB application
 */
const MONGO_APP_NAME = process.env.MONGO_APP_NAME || "myapp";

/**
 * MongoDB URI
 * @constant {string} MONGO_URI - The URI to connect to MongoDB
 */
const MONGO_URI = process.env.MONGO_URI || "";

/**
 * MongoDB URL, if products use MONGO_URI, otherwise construct the URL from the config
 * @constant {string} MONGODB_URL - The URL to connect to MongoDB
 */
export const MONGODB_URL: string = isProduction
  ? MONGO_URI
  : `mongodb://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}?authSource=admin`;
