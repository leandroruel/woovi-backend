import { transferAmount } from "@/services/account.service";
import { validateTransfer } from "@/validators/account";
import { GraphQLError } from "graphql";
/**
 * Transfer amount between accounts
 * @param args {MutationTransferAmountArgs} Transfer amount arguments
 * @returns {Promise} Transfer amount
 */
export const transfer = async (args) => {
    const { error } = await validateTransfer.validateAsync(args, {
        abortEarly: false,
    });
    if (error)
        throw new GraphQLError(error);
    return await transferAmount(args);
};
export default { transfer };
