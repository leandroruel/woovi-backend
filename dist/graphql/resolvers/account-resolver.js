import accountController from "@/controllers/account.controller";
import Account from "@/models/Account";
const accountResolver = {
    Query: {
        async account(_, { id }) {
            return await Account.find(id);
        },
    },
    Mutation: {
        async transferAmount(_, args) {
            return await accountController.transfer(args);
        },
    },
};
export default accountResolver;
