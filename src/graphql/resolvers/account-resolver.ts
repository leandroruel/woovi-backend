import accountController from "@/controllers/account.controller";
import Account from "@/models/Account";
import type Transaction from "@/models/Transaction";

const accountResolver = {
	Query: {
		async account(_: any, { id }: any) {
			return await Account.find(id);
		},
	},
	Mutation: {
		async transferAmount(_: any, args: any) {
			return await accountController.transfer(args);
		},
	},
};

export default accountResolver;
