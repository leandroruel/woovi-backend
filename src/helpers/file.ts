import path from "path";
import { fileURLToPath } from "url";

/**
 * get the current file path
 * @type {string} __filename
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * get the current directory path
 * @type {string} __dirname
 */
const __dirname = path.dirname(__filename);

export { __dirname, path };
