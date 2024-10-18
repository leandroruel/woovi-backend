import { mergeResolvers } from '@graphql-tools/merge'
import { resolvers as scalarResolvers } from 'graphql-scalars'
import accountResolver from './account.resolver'
import transactionResolver from './transaction.resolver'
import userResolver from './user.resolver'

const resolvers = [
  userResolver,
  accountResolver,
  transactionResolver,
  scalarResolvers
]

export default mergeResolvers(resolvers)
