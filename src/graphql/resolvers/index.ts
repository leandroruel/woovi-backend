import { mergeResolvers } from '@graphql-tools/merge'
import { resolvers as scalarResolvers } from 'graphql-scalars'
import transationResolver from './transaction.resolver'
import userResolver from './user-resolver'

const resolvers = [userResolver, transationResolver, scalarResolvers]

export default mergeResolvers(resolvers)
