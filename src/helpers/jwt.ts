import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from './errors'
dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 3600

/**
 * Extracts the expiration date from a JWT token
 * @param accessToken JWT token
 * @returns
 */
export const extractExp = (accessToken: string): number => {
  const decodedToken = jwt.decode(accessToken)

  if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.exp) {
    throw new Error('Token inválido ou expirado')
  }

  return decodedToken.exp
}

interface IData {
  [key: string]: any
}

/**
 * Signs a JWT token
 * @param data {IData} Data to be signed
 * @returns {string} JWT token
 */
export const signToken = (data: IData): string | void => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verifies a JWT token
 * @param token
 * @returns
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error: any) {
    throw new AuthenticationError(error.message || error)
  }
}
