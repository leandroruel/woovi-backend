import { mergeResolvers } from '@graphql-tools/merge'
import { resolvers as scalarResolvers } from 'graphql-scalars'
import userResolver from './user-resolver'

const resolvers = [userResolver, scalarResolvers]

export default mergeResolvers(resolvers)
