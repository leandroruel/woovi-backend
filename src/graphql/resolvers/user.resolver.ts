import User from "@/models/User";
import { getUserWithAccount, me, createUser, updateUser, userByEmailOrTaxId } from "@/user";
import { loginUser, logoutUser } from "@/auth";

const userResolver = {
  Query: {
    async users() {
      return await User.find();
    },
    async user(_: any, { id }: any) {
      return await getUserWithAccount(id);
    },
    async userByEmailOrTaxId(_: any, { query }: any) {
      return await userByEmailOrTaxId(query);
    },
    async me(_: any, args: any, ctx: any) {
      return await me(ctx.token);
    },
  },
  Mutation: {
    async createUser(_: any, args: any, ctx: any) {
      return await createUser(args);
    },
    async updateUser(_: any, args: any) {
      return await updateUser(args);
    },
    async deleteUser(_: any, { id }: any) {
      return await User.findByIdAndDelete(id);
    },
    async login(_: any, args: any, ctx: any) {
      return await loginUser(args);
    },
    async logout(_: any, args: any, ctx: any) {
      const { token } = ctx;
      const tokenString = token.split(" ")[1];

      return await logoutUser(tokenString);
    },
  },
  User: {
    taxId: (user: InstanceType<typeof User>) => user.tax_id,
  },
};

export default userResolver;
