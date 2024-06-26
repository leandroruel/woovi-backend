import type { MutationTransferAmountArgs } from "@/generated/graphql";
import { transferAmount } from "@/services/account.service";

export const transfer = async (data: MutationTransferAmountArgs) => {
	console.log(data);

	const result = await transferAmount(data);

	return result;
};

export default { transfer };
