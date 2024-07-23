import argon2 from 'argon2';
export const encryptPassword = async (password, options) => await argon2.hash(password, options);
export const verifyPassword = async (password, hash) => await argon2.verify(hash, password);
export default { encryptPassword, verifyPassword };
