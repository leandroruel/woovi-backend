const transationResolver = {
    Query: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        transactions: async (_, args, context) => {
            const { dataSources } = context;
            return dataSources.transactionAPI.getTransactions();
        },
    },
    Mutation: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        createTransaction: async (_, args, context) => {
            const { dataSources } = context;
            return dataSources.transactionAPI.createTransaction(args);
        },
    },
};
export default transationResolver;
