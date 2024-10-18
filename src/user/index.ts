import { createAccount, generateAccountNumber } from "@/account";
import type {
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
  QueryUserByEmailOrTaxIdArgs,
  UpdateUserPayload,
} from "@/generated/graphql";
import {
  DOCUMENT_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
} from "@/helpers/constants";
import { decodeToken, signToken } from "@/helpers/jwt";
import { encryptPassword } from "@/helpers/password";
import UserModel from "@/models/User";
import {
  validateUserCreate,
  validateUserUpdate,
} from "@/validators/user-schema";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
export const createUser = async (args: MutationCreateUserArgs) => {
  const { password, taxId, ...rest } = args.user;

  const { error } = await validateUserCreate.validateAsync(args, {
    abortEarly: false,
  });

  if (error) throw new GraphQLError(error);

  if (await emailExists(args.user.email))
    throw new GraphQLError("Email already exists", {
      extensions: { code: EMAIL_ALREADY_EXISTS },
    });

  if (await documentExists(args.user.taxId))
    throw new GraphQLError("Document already exists", {
      extensions: { code: DOCUMENT_ALREADY_EXISTS },
    });

  const encryptedPassword = String(await encryptPassword(password));

  const { _id, ...user } = await UserModel.create({
    ...rest,
    password: encryptedPassword,
    tax_id: taxId,
  });

  // Cria uma conta para o usuario novo
  await createAccount({
    userId: String(_id),
    balance: 100,
    idempotencyId: uuidv4(),
    accountNumber: generateAccountNumber(),
  });

  return {
    id: _id,
    ...user,
  };
};

/**
 *
 * @param id {string} - user id
 * @param input {Object} - user data
 * @returns {Promise<Object>}
 */
export const updateUser = async (
  args: MutationUpdateUserArgs
): Promise<object | null> => {
  const {
    id,
    user: { password, ...rest },
  } = args;

  const { error } = await validateUserUpdate.validateAsync(
    { user: rest },
    {
      abortEarly: false,
    }
  );

  if (error) throw new GraphQLError(error);

  if (args.user.email && (await emailExists(args.user.email)))
    throw new GraphQLError(EMAIL_ALREADY_EXISTS);

  if (args.user.taxId && (await documentExists(args.user.taxId)))
    throw new GraphQLError(DOCUMENT_ALREADY_EXISTS);

  if (password) {
    const encryptedPassword = String(await encryptPassword(password));

    const user = await UserModel.findByIdAndUpdate(
      id,
      { ...rest, password: encryptedPassword },
      {
        new: true,
      }
    );

    return { ...user, password: encryptedPassword };
  }

  const user = await UserModel.findByIdAndUpdate(id, rest);

  if (!user) return null;

  return user;
};

/**
 *  Find a user by email or tax id
 * @param searchString {string} - search string
 * @returns {Promise<Object>} - user data
 */
export const userByEmailOrTaxId = async (
  searchString: QueryUserByEmailOrTaxIdArgs
) => {
  const filter = {
    $or: [
      { email: { $regex: searchString, $options: "i" } },
      { tax_id: { $regex: searchString, $options: "i" } },
    ],
  };

  return await UserModel.findOne(filter);
};

/**
 * Get and returns a user with account info
 * @param userId {string} - The user id
 * @returns
 */
export const getUserWithAccount = async (userId: string) => {
  const userAggregate = await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "accounts",
        localField: "_id",
        foreignField: "userId",
        as: "account_info",
      },
    },
    {
      $unwind: { path: "$account_info", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        id: "$_id",
        name: 1,
        email: 1,
        tax_id: 1,
        gender: 1,
        birthdate: 1,
        createdAt: 1,
        updatedAt: 1,
        balance: "$account_info.balance",
        accountNumber: "$account_info.accountNumber",
      },
    },
  ]);

  return userAggregate[0] || null;
};

/**
 * Returns a user based in a auth token
 * @param token {string} - The authentication token
 * @returns {Promise{IUser}}
 */
export const me = async (token: string) => {
  const decodedToken = decodeToken(token);
  const userId = decodedToken?.userId;

  if (userId) {
    const user = await getUserWithAccount(userId);
    return user;
  }

  return null;
};
