import jwt from 'jsonwebtoken'

export const extractExp = (accessToken: string): number => {
  const decodedToken = jwt.decode(accessToken)

  if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.exp) {
    throw new Error('Token inválido ou expirado')
  }

  return decodedToken.exp
}
