import type {
  CreateAccountPayload,
  MutationTransferAmountArgs,
} from "@/generated/graphql";
import { TransactionType, TransactionState } from "@/generated/graphql";
import {
  INSUFFICIENT_BALANCE,
  SENDER_RECEIVER_NOT_FOUND,
} from "@/helpers/constants";
import Account, { type IAccount } from "@/models/Account";
import { GraphQLError } from "graphql";
import { createTransaction, getTransaction } from "@/transaction";

/**
 * Create a new account
 * @param args {CreateAccountPayload} - Account data payload
 * @returns {Promise<Account>} - Account object
 */
export const createAccount = async (
  args: CreateAccountPayload
): Promise<IAccount> => {
  try {
    const { idempotencyId } = args;
    const existingAccount = await Account.findOne({
      idempotencyId,
    });

    if (existingAccount) return existingAccount;

    return await Account.create(args);
  } catch (error: any) {
    throw new GraphQLError(error.message || "Failed to create account.");
  }
};

/**
 *  Generate a random account number
 * @returns {string} - Account number
 * @example
 * generateAccountNumber() // 1234567890
 */
export const generateAccountNumber = (): string => {
  const accountNumber = Math.floor(Math.random() * 900000) + 100000;
  const checksum = calculateChecksum(accountNumber);
  return `${accountNumber}${checksum}`;
};

/**
 *  Calculate the checksum for an account number
 * @param {number} accountNumber
 * @returns {number} - Checksum
 */
const calculateChecksum = (accountNumber: number): number => {
  const sum = Array.from(String(accountNumber), Number)
    .reverse()
    .map((digit, index) => digit * (index % 2 === 0 ? 1 : 2))
    .map((value) => (value > 9 ? value - 9 : value))
    .reduce((acc, curr) => acc + curr, 0);
  return Math.ceil(sum / 10) * 10 - sum;
};

/**
 * Transfer amount between accounts using idempotency key
 * @param {MutationTransferAmountArgs} data - Transfer amount data
 */
export const transferAmount = async (data: MutationTransferAmountArgs) => {
  const {
    transferAmountPayload: { senderId, receiverId, amount, idempotencyId },
  } = data;

  try {
    const existingTransaction = await getTransaction(idempotencyId);

    if (existingTransaction) {
      return {
        success: true,
        message: "Transaction already processed",
        idempotencyId,
      };
    }

    const senderAccount = await Account.findOne({
      userId: senderId,
    });

    const receiverAccount = await Account.findOne({
      userId: receiverId,
    });

    if (!senderAccount || !receiverAccount) {
      throw new GraphQLError(SENDER_RECEIVER_NOT_FOUND);
    }

    if (senderAccount.balance < amount) {
      throw new GraphQLError(INSUFFICIENT_BALANCE);
    }

    await senderAccount.updateOne({ $inc: { balance: -amount } });
    await receiverAccount.updateOne({ $inc: { balance: amount } });

    const newTransaction = await createTransaction({
      idempotencyId,
      senderId,
      receiverId,
      amount,
      type: TransactionType.Transfer,
      state: TransactionState.Done,
      description: "Transfer between users",
    });

    return {
      success: true,
      message: "Amount transferred successfully",
      idempotencyId: newTransaction.idempotencyId,
    };
  } catch (error: any) {
    throw new GraphQLError(error.message || "Failed to transfer amount.");
  }
};

/**
 * Get a account by userid
 * @param userId {string} the user id
 * @returns {Account} the account of the user
 */
export const accountByUserId = async (userId: string) =>
  await Account.findOne({ userId });
