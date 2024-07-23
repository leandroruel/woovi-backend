import dotenv from 'dotenv';
dotenv.config();
/**
 * Application configuration
 * @constant {Config} config - The application configuration
 */
const config = {
    database: {
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        name: process.env.MONGODB_DATABASE || 'mydatabase',
        username: process.env.MONGO_USERNAME || 'root',
        password: process.env.MONGO_PASSWORD || 'MyPassword123!'
    },
    dropDatabase: true
};
/**
 * MongoDB URL
 * @constant {string} MONGODB_URL - The URL to connect to MongoDB
 */
export const MONGODB_URL = `mongodb://${config.database.host}:${config.database.port}/${config.database.name}?authSource=admin`;
/**
 * MongoDB database name
 * @constant {string} MONGODB_DB_NAME - The name of the MongoDB database
 */
export const MONGODB_DATABASE = config.database.name;
/**
 * MongoDB database username
 * @constant {string} MONGODB_USERNAME - The username for the MongoDB database
 */
export const MONGODB_USERNAME = config.database.username;
/**
 * MongoDB password
 * @constant {string} MONGODB_PASSWORD - The password for the MongoDB database
 */
export const MONGODB_PASSWORD = config.database.password;
