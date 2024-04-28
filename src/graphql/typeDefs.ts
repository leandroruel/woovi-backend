import { path } from '@/helpers/file'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { typeDefs as scalarTypeDefs } from 'graphql-scalars'

const typesArray = loadFilesSync(path.join('/app/src', 'graphql/**/*.graphql'))
const types = [scalarTypeDefs, ...typesArray]

export default mergeTypeDefs(types)
