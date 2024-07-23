import {
  type CreateTransactionPayload,
  TransactionType,
} from "@/generated/graphql";
import Transaction from "@/models/Transaction";
import { GraphQLError } from "graphql";

/**
 * Check if transaction exists
 * @param idempotencyId {string} - Idempotency key
 * @returns {Promise<Boolean>} - True if exists, false otherwise
 */
export const transactionExists = async (
  idempotencyId: string,
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
 * @param data
 * @returns
 */
export const createTransaction = async (data: CreateTransactionPayload) => {
  try {
    const { idempotencyId } = data;

    const existingTransaction = await Transaction.findOne({ idempotencyId });

    if (existingTransaction) return existingTransaction;

    const lastEntry = await Transaction.findOne()
      .sort({ createdAt: -1 })
      .limit(1);
    const lastBalance = lastEntry ? lastEntry.value : 0;

    const newBalance =
      (data.type as TransactionType) === TransactionType.Deposit
        ? lastBalance + data.value
        : lastBalance - data.value;

    const transaction = await Transaction.create({
      ...data,
      type: data.type,
      state: data.state,
      balance: newBalance,
    });

    return transaction;
  } catch (error: any) {
    throw new GraphQLError(error);
  }
};
