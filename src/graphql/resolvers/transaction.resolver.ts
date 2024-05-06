const transationResolver = {
  Query: {
    transactions: async (_: any, args: any, context: any) => {
      const { dataSources } = context
      return dataSources.transactionAPI.getTransactions()
    }
  },
  Mutation: {
    createTransaction: async (_: any, args: any, context: any) => {
      const { dataSources } = context
      return dataSources.transactionAPI.createTransaction(args)
    }
  }
}

export default transationResolver
