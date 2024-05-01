import { verifyToken } from './jwt'

/**
 * Get user from token inside a context
 * @param token {string} - Token to verify
 * @returns {object} - User object
 */
export const getUser = (token: string) => {
  if (!token) return { hasRole: () => false }

  const roles = ['User', 'Admin']
  const decodedToken = verifyToken(token.replace('Bearer ', '')) as any

  return {
    hasRole: (role: string) => {
      const tokenIndex = roles.indexOf(decodedToken.role)
      const roleIndex = roles.indexOf(role)
      return roleIndex >= 0 && tokenIndex >= roleIndex
    }
  }
}
