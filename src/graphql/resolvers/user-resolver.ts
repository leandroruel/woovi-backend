import UserController from "@/controllers/user.controller";
import User from "@/models/User";
import { getUserWithAccount } from "@/services/user.service";

const userResolver = {
  Query: {
    async users() {
      return await User.find();
    },
    async user(_: any, { id }: any) {
      return await getUserWithAccount(id);
    },
    async userByEmailOrTaxId(_: any, { query }: any) {
      return await UserController.searchUserByEmailOrTaxId(query);
    },
  },
  Mutation: {
    async createUser(_: any, args: any, ctx: any) {
      return await UserController.create(args);
    },
    async updateUser(_: any, args: any) {
      return await UserController.update(args);
    },
    async deleteUser(_: any, { id }: any) {
      return await User.findByIdAndDelete(id);
    },
    async login(_: any, args: any, ctx: any) {
      return await UserController.login(args);
    },
    async logout(_: any, args: any, ctx: any) {
      const { token } = ctx;
      const tokenString = token.split(" ")[1];

      return await UserController.logout(tokenString);
    },
  },
  User: {
    taxId: (user: InstanceType<typeof User>) => user.tax_id,
  },
};

export default userResolver;
