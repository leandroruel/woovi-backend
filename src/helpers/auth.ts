import { decodeToken, verifyToken } from './jwt'

/**
 * Get user from token inside a context
 * @param token {string} - Token to verify
 * @returns {object} - User object
 */
export const getUser = (token: string) => {
  if (!token) return { hasRole: () => false }
  const roles = ['User', 'Admin']
  const decodedToken = decodeToken(token)
  const verifiedToken = verifyToken(
    token.replace('Bearer ', ''),
    decodedToken?.aud,
    decodedToken?.userId
  ) as any

  return {
    hasRole: (role: string) => {
      const tokenIndex = roles.indexOf(verifiedToken.role)
      const roleIndex = roles.indexOf(role)
      return roleIndex >= 0 && tokenIndex >= roleIndex
    }
  }
}
