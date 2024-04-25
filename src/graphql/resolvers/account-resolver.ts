import Account from '@/models/Account'

const accountResolver = {
  Query: {
    async account(_: any, { id }: any) {
      return await Account.find(id)
    }
  },
  Mutation: {
    async deposit(_, { amount }) {
      return await Account.deposit(amount)
    }
  }
}

export default accountResolver
