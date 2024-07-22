import type {
  Account,
  CreateAccountPayload,
  CreateTransactionPayload,
  MutationTransferAmountArgs,
} from "@/generated/graphql";
import { TransactionType, TransactionState } from "@/generated/graphql";
import {
  INSUFFICIENT_BALANCE,
  SENDER_RECEIVER_NOT_FOUND,
  TRANSACTION_BEING_PROCESSED,
} from "@/helpers/constants";
import AccountModel from "@/models/Account";
import { GraphQLError } from "graphql";
import { createTransaction, getTransaction } from "./transaction.service";

/**
 * Create a new account
 * @param args {CreateAccountPayload} - Account data payload
 * @returns {Promise<Account>} - Account object
 */
export const createAccount = async (
  args: CreateAccountPayload,
): Promise<Account> => {
  const account = await AccountModel.create(args);
  return {
    ...account.toJSON(),
    userId: account.userId.toString(),
  };
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
 * Create or return an existing transaction
 * @param transactionData {CreateTransactionPayload} - Transaction data payload
 * @returns {Promise<Transaction>} - Transaction object
 */
const findOrCreateTransaction = async (
  transactionData: CreateTransactionPayload,
) => {
  const { senderId, receiverId, idempotencyId, value } = transactionData;
  const existingTransaction = await getTransaction(idempotencyId);

  if (existingTransaction) {
    if (existingTransaction.state === TransactionState.Done) {
      return existingTransaction;
    }

    throw new GraphQLError(TRANSACTION_BEING_PROCESSED);
  }

  const newTransaction = createTransaction({
    ...transactionData,
    state: TransactionState.Done,
  });

  // atualiza o saldo das contas
  await updateAccountBalance(senderId, receiverId, value);

  return await newTransaction;
};

/**
 * Update the balance of the sender and receiver accounts
 * @param senderId {string} the sender id
 * @param receiverId {string} the receiver id
 * @param amount {number} the amount to transfer
 */
const updateAccountBalance = async (
  senderId: string,
  receiverId: string,
  amount: number,
) => {
  const senderAccount = await AccountModel.findOne({
    userId: senderId,
  });

  const receiverAccount = await AccountModel.findOne({
    userId: receiverId,
  });

  if (!senderAccount || !receiverAccount) {
    throw new GraphQLError(SENDER_RECEIVER_NOT_FOUND);
  }

  if (senderAccount.balance < amount) {
    throw new GraphQLError(INSUFFICIENT_BALANCE);
  }

  senderAccount.balance -= amount;
  receiverAccount.balance += amount;

  await senderAccount.save();
  await receiverAccount.save();
};

/**
 * Transfer amount between accounts using idempotency key
 * source: https://stackoverflow.com/questions/71262703/implementing-idempotency-keys
 * @param data
 */
export const transferAmount = async (data: MutationTransferAmountArgs) => {
  const {
    transferAmountPayload: { senderId, receiverId, amount, idempotencyId },
  } = data;

  const transactionData: CreateTransactionPayload = {
    idempotencyId,
    senderId,
    receiverId,
    value: amount,
    type: TransactionType.Transfer,
    state: TransactionState.Pending,
    description: "Transfer between users",
  };

  try {
    return await findOrCreateTransaction(transactionData);
  } catch (error: any) {
    throw new GraphQLError(error.message || error);
  }
};
