import { type CreateTransactionPayload } from "@/generated/graphql";
import Transaction from "@/models/Transaction";
import { GraphQLError } from "graphql";

/**
 *  Get all transactions
 * @returns {Promise<any>} - List of all transactions
 */
export const getAllTransactions = async () =>
  await Transaction.where({
    state: "done",
  });

/**
 *  Get all transactions by user id
 * @param {string} userId - User id
 * @param {number} offset - Offset
 * @param {number} limit - Limit
 * @returns {Promise<any>} - List of all transactions
 */
export const getTransactionsByUserId = async (
  userId: string,
  offset: number,
  limit: number
) =>
  await Transaction.find({ $or: [{ fromUser: userId }, { toUser: userId }] })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("fromUser")
    .populate("toUser");

/**
 * Check if transaction exists
 * @param idempotencyId {string} - Idempotency key
 * @returns {Promise<Boolean>} - True if exists, false otherwise
 */
export const transactionExists = async (
  idempotencyId: string
): Promise<boolean> => Boolean(await Transaction.exists({ idempotencyId }));

/**
 *  Get transaction by idempotency key
 * @param idempotencyId {string} - Idempotency key
 * @returns {Promise<any>} - Account object
 */
export const getTransaction = async (idempotencyId: string) =>
  await Transaction.findOne({ idempotencyId });

/**
 * Create a new transaction
 * @param {CreateTransactionPayload} data - Transaction data
 * @returns {Promise<any>} - Transaction object
 */
export const createTransaction = async (data: CreateTransactionPayload) => {
  try {
    return await Transaction.create(data);
  } catch (error: any) {
    throw new GraphQLError(error);
  }
};
