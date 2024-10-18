import type { MutationLoginArgs } from "@/generated/graphql";
import { INVALID_PASSWORD, USER_NOT_FOUND } from "@/helpers/constants";
import { signToken } from "@/helpers/jwt";
import { verifyPassword } from "@/helpers/password";
import User from "@/models/User";
import { GraphQLError } from "graphql";
import { decodeToken, JWT_EXPIRES_IN } from "@/helpers/jwt";
import Token from "@/models/Token";

/**
 *  Authenticates a user and return a JWT Token
 * @param args {MutationLoginArgs} - user data
 * @returns {Promise<any>} - token and user data
 */
export const loginUser = async (args: MutationLoginArgs): Promise<any> => {
  const {
    input: { email, password },
  } = args;

  const user = await User.findOne({ email });

  if (!user)
    throw new GraphQLError(USER_NOT_FOUND, {
      extensions: { code: "USER_NOT_FOUND" },
    });

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    throw new GraphQLError(INVALID_PASSWORD, {
      extensions: { code: "INVALID_PASSWORD" },
    });
  }

  const token = signToken({ userId: user.id, role: user.role }) || "";

  return {
    token,
  };
};

/**
 * Logout a user and revoke the token
 * @param token {string} - token to revoke
 * @returns {boolean} - true if token was revoked
 */
export const logoutUser = async (token: string) => {
  if (!token) return false;

  return await revokeToken(token);
};

/**
 * Check if token exists
 * @param token {string} - Token
 * @returns {Promise<Boolean>} - True if exists, false otherwise
 */
export const tokenExists = async (token: string): Promise<boolean> =>
  Boolean(await Token.exists({ token }));

/**
 *  Revoke a token
 * @param token
 * @returns
 */
export const revokeToken = async (token: string) => {
  if (!token) return false;

  const existingToken = await tokenExists(token);

  if (existingToken) return true;

  const decodedToken = decodeToken(token) || { exp: JWT_EXPIRES_IN };

  const expiresAt = new Date(decodedToken.exp * 1000);

  const blackListed = new Token({ token, expiresAt });

  if (blackListed.isNew) {
    await blackListed.save();

    return true;
  }

  return false;
};
