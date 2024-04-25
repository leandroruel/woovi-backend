import { mergeResolvers } from '@graphql-tools/merge'
import userResolver from './user-resolver'
import authResolver from './auth-resolver'
import bankResolver from './bank-resolver'

const resolvers = [
  userResolver
  // authResolver,
  // bankResolver
]

export default mergeResolvers(resolvers)
