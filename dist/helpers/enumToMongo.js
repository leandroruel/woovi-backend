const graphqlToMongoEnumMapping = {
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
const mongoToGraphqlEnumMapping = {
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
function mapGraphqlToMongoEnum(type, value) {
    return graphqlToMongoEnumMapping[type][value];
}
function mapMongoToGraphqlEnum(type, value) {
    return mongoToGraphqlEnumMapping[type][value];
}
export { mapGraphqlToMongoEnum, mapMongoToGraphqlEnum };
