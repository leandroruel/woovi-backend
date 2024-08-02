import accountController from "@/controllers/account.controller";
import Account from "@/models/Account";

const accountResolver = {
  Query: {
    async account(_: any, { id }: any) {
      return await Account.find(id);
    },
    async accountByUserId(_: any, { userId }: any) {
      return await Account.findOne({ userId });
    },
  },
  Mutation: {
    async transferAmount(_: any, args: any) {
      return await accountController.transfer(args);
    },
  },
};

export default accountResolver;
