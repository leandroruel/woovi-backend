import type { MutationTransferAmountArgs } from "@/generated/graphql";
import { transferAmount } from "@/services/account.service";
import { validateTransfer } from "@/validators/account";
import { GraphQLError } from "graphql";

export const transfer = async (args: MutationTransferAmountArgs) => {
  const { error } = await validateTransfer.validateAsync(args, {
    abortEarly: false,
  });

  if (error) throw new GraphQLError(error);

  const result = await transferAmount(args);

  return result;
};

export default { transfer };
