import UserController from '@/controllers/user.controller'
import User from '@/models/User'

import { GraphQLError } from 'graphql'

const userResolver = {
  Query: {
    async users() {
      return await User.find()
    },
    async user(_: any, { id }: any) {
      return await User.findById(id)
    }
  },
  Mutation: {
    async createUser(_: any, args: any, ctx: any) {
      try {
        return await UserController.create(args)
      } catch (error: any) {
        throw new GraphQLError(error)
      }
    },
    async updateUser(_: any, args: any) {
      return await UserController.update(args)
    },
    async deleteUser(_: any, { id }: any) {
      return await User.findByIdAndDelete(id)
    },
    async login(_: any, args: any, ctx: any) {
      return await UserController.login(args)
    }
  },
  User: {
    taxId: (user: InstanceType<typeof User>) => user.tax_id
  }
}

export default userResolver
