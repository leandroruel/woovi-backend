import { decodeToken, JWT_EXPIRES_IN } from "@/helpers/jwt";
import Token from "@/models/Token";
/**
 * Check if token exists
 * @param token {string} - Token
 * @returns {Promise<Boolean>} - True if exists, false otherwise
 */
export const tokenExists = async (token) => Boolean(await Token.exists({ token }));
/**
 *  Revoke a token
 * @param token
 * @returns
 */
export const revokeToken = async (token) => {
    const existingToken = await tokenExists(token);
    if (existingToken)
        return true;
    const decodedToken = decodeToken(token) || { exp: JWT_EXPIRES_IN };
    const expiresAt = new Date(decodedToken.exp * 1000);
    const blackListed = new Token({ token, expiresAt });
    if (blackListed.isNew) {
        await blackListed.save();
        return true;
    }
    return false;
};
