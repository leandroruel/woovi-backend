import type {
  CreateUserPayload,
  MutationLoginArgs,
  UpdateUserPayload,
} from "@/generated/graphql";
import { INVALID_PASSWORD, USER_NOT_FOUND } from "@/helpers/constants";
import { decodeToken, JWT_EXPIRES_IN, signToken } from "@/helpers/jwt";
import { verifyPassword } from "@/helpers/password";
import UserModel from "@/models/User";
import { GraphQLError } from "graphql";
import { JwtPayload } from "jsonwebtoken";
import { revokeToken } from "./token.service";

/**
 * Check if email exists on database
 * @param email {string} - email to check
 * @returns {Promise<Boolean | null>}
 * @example await emailExists('jhon.doe@company.com')
 */
export const emailExists = async (email: string): Promise<boolean> =>
  Boolean(await UserModel.exists({ email }));

/**
 * Check if document exists on database
 * @param taxId {string} - tax id to check
 * @returns {Promise<Boolean | null>}
 * @example await documentExists('1234567890')
 */
export const documentExists = async (taxId: string): Promise<boolean> =>
  Boolean(await UserModel.exists({ tax_id: taxId }));

/**
 * Create a new user
 * @param body {Object} - user data
 * @returns
 */
export const createUser = async (body: CreateUserPayload) =>
  await UserModel.create({ ...body, tax_id: body.taxId });

/**
 *
 * @param id {string} - user id
 * @param input {Object} - user data
 * @returns {Promise<Object>}
 */
export const updateUser = async (
  id: string,
  input: UpdateUserPayload,
): Promise<object | null> =>
  await UserModel.findByIdAndUpdate(
    id,
    { ...input, tax_id: input.taxId },
    {
      new: true,
    },
  );

/**
 *  Authenticates a user and return a JWT Token
 * @param args {MutationLoginArgs} - user data
 * @returns {Promise<any>} - token and user data
 */
export const loginUser = async (args: MutationLoginArgs): Promise<any> => {
  const {
    input: { email, password },
  } = args;

  const user = await UserModel.findOne({ email });

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
    user,
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
