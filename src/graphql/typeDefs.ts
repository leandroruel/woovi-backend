import { path } from '@/helpers/file'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

const typesArray = loadFilesSync(path.join('/app/src', 'graphql/**/*.graphql'))

export default mergeTypeDefs(typesArray)
