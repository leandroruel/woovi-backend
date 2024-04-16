import User from '@/models/User'

export const userResolver = {
  Query: {
    async users() {
      return await User.find()
    },
    async user(_: any, { id }: any) {
      return await User.findById(id)
    }
  },
  Mutation: {
    async createUser(_: any, { input }: any) {
      console.log('user being created', input)
      return await User.create(input)
    },
    async updateUser(_: any, { id, input }: any) {
      return await User.findByIdAndUpdate(id, input, { new: true })
    },
    async deleteUser(_: any, { id }: any) {
      return await User.findByIdAndDelete(id)
    }
  }
}
