import bcrypt from 'bcrypt'

export const encryptPassword = (password: string, length: number = 10) =>
  bcrypt.hash(password, length)
