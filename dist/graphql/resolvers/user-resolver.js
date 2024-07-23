import UserController from '@/controllers/user.controller';
import User from '@/models/User';
import { GraphQLError } from 'graphql';
const userResolver = {
    Query: {
        async users() {
            return await User.find();
        },
        async user(_, { id }) {
            return await User.findById(id);
        }
    },
    Mutation: {
        async createUser(_, args, ctx) {
            try {
                return await UserController.create(args);
            }
            catch (error) {
                throw new GraphQLError(error);
            }
        },
        async updateUser(_, args) {
            return await UserController.update(args);
        },
        async deleteUser(_, { id }) {
            return await User.findByIdAndDelete(id);
        },
        async login(_, args, ctx) {
            return await UserController.login(args);
        },
        async logout(_, args, ctx) {
            const { token } = ctx;
            const tokenString = token.split(' ')[1];
            return await UserController.logout(tokenString);
        }
    },
    User: {
        taxId: (user) => user.tax_id
    }
};
export default userResolver;
