import { AuthorizationError } from '@/helpers/errors'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

function authDirective(
  directiveName: string,
  getUserFn: (token: string) => { hasRole: (role: string) => boolean }
) {
  const typeDirectiveArgumentMaps: Record<string, any> = {}
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(
          requires: UserRoleEnum = Admin,
        ) on OBJECT | FIELD_DEFINITION
     
        enum UserRoleEnum {
          Admin
          User
        }`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(schema, type, directiveName)?.[0]
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective
          }
          return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName]
          if (authDirective) {
            const { requires } = authDirective

            if (requires) {
              const { resolve = defaultFieldResolver } = fieldConfig

              fieldConfig.resolve = function (source, args, context, info) {
                const user = getUserFn(context.token)

                if (!user.hasRole(requires)) {
                  throw new AuthorizationError('not authorized')
                }

                return resolve(source, args, context, info)
              }
              return fieldConfig
            }
          }
        }
      })
  }
}

export default authDirective
