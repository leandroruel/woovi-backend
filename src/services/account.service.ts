import type {
	Account,
	CreateAccountPayload,
	MutationTransferAmountArgs,
} from "@/generated/graphql";
import { TransactionType, TransactionState } from "@/generated/graphql";
import {
	INSUFFICIENT_BALANCE,
	SENDER_RECEIVER_NOT_FOUND,
	TRANSACTION_ALREADY_EXISTS,
	TRANSACTION_BEING_PROCESSED,
} from "@/helpers/constants";
import AccountModel from "@/models/Account";
import { GraphQLError } from "graphql";
import { createTransaction } from "./transaction.service";
import { v4 as uuidv4 } from "uuid";
import { mapGraphqlToMongoEnum } from "@/helpers/enumToMongo";
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
 * source: https://stackoverflow.com/questions/71262703/implementing-idempotency-keys
 * @param data
 */
export const transferAmount = async (data: MutationTransferAmountArgs) => {
	const {
		transferAmountPayload: { senderId, receiverId, amount },
	} = data;

	const idempotencyId = uuidv4();

	try {
		const senderAccount = await AccountModel.findOne({
			userId: senderId,
		});

		const receiverAccount = await AccountModel.findOne({
			userId: receiverId,
		});

		if (!senderAccount || !receiverAccount) {
			throw new GraphQLError(SENDER_RECEIVER_NOT_FOUND);
		}

		console.log("montante", amount);

		if (senderAccount.balance < amount) {
			throw new GraphQLError(INSUFFICIENT_BALANCE);
		}

		senderAccount.balance -= amount;
		receiverAccount.balance += amount;

		await senderAccount.save();
		await receiverAccount.save();

		const transaction = await createTransaction({
			idempotencyId,
			senderId: senderId,
			receiverId: receiverId,
			value: amount,
			type: TransactionType.Transfer,
			state: TransactionState.Done,
			description: "Transfer between users",
		});

		return transaction;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		if (error && error.code === 11000) {
			throw new GraphQLError(TRANSACTION_ALREADY_EXISTS);
		}

		throw new GraphQLError(error.message || error);
	}
};
