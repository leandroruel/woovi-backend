import { getTransactionsByUserId } from "@/services/transaction.service";

const transationResolver = {
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

export default transationResolver;
