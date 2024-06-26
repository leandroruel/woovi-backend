const graphqlToMongoEnumMapping: { [key: string]: { [key: string]: string } } =
	{
		TransactionType: {
			DEPOSIT: "deposit",
			WITHDRAW: "withdraw",
			TRANSFER: "transfer",
		},
		TransactionState: {
			PENDING: "pending",
			DONE: "done",
		},
	};

const mongoToGraphqlEnumMapping: { [key: string]: { [key: string]: string } } =
	{
		TransactionType: {
			deposit: "DEPOSIT",
			withdraw: "WITHDRAW",
			transfer: "TRANSFER",
		},
		TransactionState: {
			pending: "PENDING",
			done: "DONE",
		},
	};

function mapGraphqlToMongoEnum(
	type: "TransactionType" | "TransactionState",
	value: string,
): string {
	return graphqlToMongoEnumMapping[type][value];
}

function mapMongoToGraphqlEnum(
	type: "TransactionType" | "TransactionState",
	value: string,
): string {
	return mongoToGraphqlEnumMapping[type][value];
}

export { mapGraphqlToMongoEnum, mapMongoToGraphqlEnum };
