import { describe, it, expect, beforeEach, vi } from "vitest";
import { transferAmount } from "@/services/account.service";
import AccountModel from "@/models/Account";
import { createTransaction } from "@/services/transaction.service";
import { TransactionType, TransactionState } from "@/generated/graphql";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";
import {
	INSUFFICIENT_BALANCE,
	SENDER_RECEIVER_NOT_FOUND,
	TRANSACTION_ALREADY_EXISTS,
} from "@/helpers/constants";

vi.mock("@/models/Account");
vi.mock("@/services/transaction.service");
vi.mock("uuid", async () => {
	const originalUuid = await vi.importActual<typeof import("uuid")>("uuid");
	return {
		...originalUuid,
		v4: vi.fn(),
		default: vi.fn(),
	};
});

// biome-ignore lint/style/useConst: <explanation>
let initialSenderBalance = 500;
// biome-ignore lint/style/useConst: <explanation>
let initialReceiverBalance = 200;

const senderId = "sender-id";
const receiverId = "receiver-id";
const amount = 100;
const idempotencyId = "idempotency-id";

const senderAccount = {
	userId: senderId,
	balance: initialSenderBalance,
	save: vi.fn(),
};

const receiverAccount = {
	userId: receiverId,
	balance: initialReceiverBalance,
	save: vi.fn(),
};

const transaction = {
	idempotencyId,
	senderId,
	receiverId,
	value: amount,
	type: TransactionType.Transfer,
	state: TransactionState.Done,
	description: "Transfer between users",
};



describe("transferAmount", () => {
	beforeEach(() => {
		vi.clearAllMocks();

	});

	it("should transfer amount between accounts successfully", async () => {
		vi.spyOn(AccountModel, "findOne")
			.mockResolvedValueOnce(senderAccount)
			.mockResolvedValueOnce(receiverAccount);
		(uuidv4 as any).mockReturnValue(idempotencyId);
		(createTransaction as any).mockResolvedValue(transaction);

		const result = await transferAmount({
			transferAmountPayload: {
				senderId,
				receiverId,
				amount,
				idempotencyId
			},
		});

		expect(AccountModel.findOne).toHaveBeenCalledWith({ userId: senderId });
		expect(AccountModel.findOne).toHaveBeenCalledWith({ userId: receiverId });
		expect(senderAccount.balance).toBe(400); // 500 - 100
		expect(receiverAccount.balance).toBe(300); // 200 + 100
		expect(senderAccount.save).toHaveBeenCalled();
		expect(receiverAccount.save).toHaveBeenCalled();
		expect(createTransaction).toHaveBeenCalledWith({
			idempotencyId,
			senderId,
			receiverId,
			value: amount,
			type: TransactionType.Transfer,
			state: TransactionState.Done,
			description: "Transfer between users",
		});
		expect(result).toEqual(transaction);
	});

	it("should throw an error if sender or receiver not found", async () => {
		vi.spyOn(AccountModel, "findOne").mockResolvedValueOnce(null);

		await expect(
			transferAmount({
				transferAmountPayload: {
					senderId,
					receiverId,
					amount,
					idempotencyId
				},
			}),
		).rejects.toThrow(new GraphQLError(SENDER_RECEIVER_NOT_FOUND));
	});

	it("should throw an error if sender has insufficient balance", async () => {
		const lowBalanceSender = { ...senderAccount, balance: 50 };
		vi.spyOn(AccountModel, "findOne")
			.mockResolvedValueOnce(lowBalanceSender)
			.mockResolvedValueOnce(receiverAccount);

		await expect(
			transferAmount({
				transferAmountPayload: {
					senderId,
					receiverId,
					amount,
					idempotencyId
				},
			}),
		).rejects.toThrow(new GraphQLError(INSUFFICIENT_BALANCE));
	});

	it("should throw an error if transaction already exists", async () => {
		const error: any = new Error();
		error.code = 11000;

		vi.spyOn(AccountModel, "findOne")
			.mockResolvedValueOnce(senderAccount)
			.mockResolvedValueOnce(receiverAccount);
		(uuidv4 as any).mockReturnValue(idempotencyId);
		(createTransaction as any).mockRejectedValueOnce(error);

		await expect(
			transferAmount({
				transferAmountPayload: {
					senderId,
					receiverId,
					amount,
					idempotencyId
				},
			}),
		).rejects.toThrow(new GraphQLError(TRANSACTION_ALREADY_EXISTS));
	});

	it("should throw a generic error if any other error occurs", async () => {
		const error = new Error("Generic error");
		vi.spyOn(AccountModel, "findOne")
			.mockResolvedValueOnce(senderAccount)
			.mockResolvedValueOnce(receiverAccount);
		(uuidv4 as any).mockReturnValue(idempotencyId);
		(createTransaction as any).mockRejectedValueOnce(error);

		await expect(
			transferAmount({
				transferAmountPayload: {
					senderId,
					receiverId,
					amount,
					idempotencyId
				},
			}),
		).rejects.toThrow(new GraphQLError("Generic error"));
	});

    // needs to fix
    it.skip("should perform idempotent transfer amount", async () => {
        vi.spyOn(AccountModel, "findOne")
			.mockResolvedValueOnce(senderAccount)
			.mockResolvedValueOnce(receiverAccount);

        (uuidv4 as any).mockReturnValue(idempotencyId);

		const transferData = {
			transferAmountPayload: {
				senderId,
				receiverId,
				amount: 200,
				idempotencyId
			},
		};

        console.log(transferData)

		const firstTransfer = await transferAmount(transferData);
		const secondTransfer = await transferAmount(transferData);

		expect(firstTransfer).toEqual(secondTransfer);

		expect(AccountModel.findOne).toHaveBeenCalledTimes(4);
		expect(senderAccount.save).toHaveBeenCalledTimes(1);
		expect(receiverAccount.save).toHaveBeenCalledTimes(1);

		expect(createTransaction).toHaveBeenCalledTimes(1);

		expect(senderAccount.balance).toBe(initialSenderBalance - 200);
		expect(receiverAccount.balance).toBe(initialReceiverBalance + 200);
	});
});
