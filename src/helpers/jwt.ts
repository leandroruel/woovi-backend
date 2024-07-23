import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "./errors";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 3600000;
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "mybank";

interface TokenPayload {
  userId: string;
  role: string;
  lastActivity?: number;
}

/**
 * Extracts the expiration date from a JWT token
 * @param accessToken JWT token
 * @returns
 */
export const extractExp = (accessToken: string): number => {
  const decodedToken = jwt.decode(accessToken);

  if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.exp) {
    throw new Error("Token inválido ou expirado");
  }

  return decodedToken.exp;
};

/**
 * Signs a JWT token
 * @param data {IData} Data to be signed
 * @returns {string} JWT token
 */
export const signToken = (data: TokenPayload): string | undefined => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
    audience: JWT_AUDIENCE,
    subject: data.userId,
  });
};

/**
 * Verifies a JWT token
 * @param token
 * @returns
 */
export const verifyToken = (
  token: string,
  audience: string,
  subject: string,
) => {
  try {
    return jwt.verify(token, JWT_SECRET, { audience, subject });
  } catch (error: any) {
    throw new AuthenticationError(error.message || error);
  }
};

/**
 * Decodes a JWT token
 * @param token {string} JWT token
 * @returns {object} Decoded token
 */
export const decodeToken = (token: string): Record<string, any> | null => {
  return jwt.decode(token.replace("Bearer ", "")) as jwt.JwtPayload;
};
