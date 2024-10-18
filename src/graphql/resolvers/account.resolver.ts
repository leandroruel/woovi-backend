import Account from "@/models/Account";
import { transferAmount, accountByUserId } from "@/account";

const accountResolver = {
  Query: {
    async account(_: any, { id }: any) {
      return await Account.find(id);
    },
    async accountByUserId(_: any, { userId }: any) {
      return await accountByUserId(userId);
    },
  },
  Mutation: {
    async transferAmount(_: any, args: any) {
      return await transferAmount(args);
    },
  },
};

export default accountResolver;
