import { getTransactionsByUserId } from "@/transaction"

const transactionResolver = {
  Query: {
    transactionByUserId: async (
      _: any,
      { userId, offset, limit }: any,
      context: any
    ) => {
      return await getTransactionsByUserId(userId, offset, limit);
    },
  },
  Mutation: {
    createTransaction: async (_: any, args: any, context: any) => {
      // code...
    },
  },
};

export default transactionResolver;
