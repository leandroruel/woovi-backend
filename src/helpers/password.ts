import argon2 from "argon2";

export const encryptPassword = async (
  password: string,
  options?: any,
): Promise<Buffer> => await argon2.hash(password, options);

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => await argon2.verify(hash, password);

export default { encryptPassword, verifyPassword };
