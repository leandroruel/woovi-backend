import { mergeResolvers } from '@graphql-tools/merge'
import userResolver from './user-resolver'

const resolvers = [
  userResolver
  // authResolver,
  // bankResolver
]

export default mergeResolvers(resolvers)
