import dotenv from "dotenv";

dotenv.config();

/**
 * Application configuration
 * @constant {string} NODE_PORT - The port the application will run on
 */
export const NODE_PORT = process.env.NODE_PORT || 4001;
