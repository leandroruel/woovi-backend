import { MutationCreateUserArgs } from '@/generated/graphql'
import { EMAIL_ALREADY_EXISTS } from '@/helpers/constants'
import { encryptPassword } from '@/helpers/password'
import { createUser, emailExists } from '@/services/user.service'
import UsersValidate from '@/validators/user-schema'
import { GraphQLError } from 'graphql'

/**
 *  Create a new user
 * @param ctx
 * @returns
 */
export const create = async (args: MutationCreateUserArgs) => {
  // validation
  const { error } = await UsersValidate.validateAsync(args, {
    abortEarly: false
  })

  if (error) {
    throw new GraphQLError(error)
  }

  if (await emailExists(args.user.email))
    throw new GraphQLError(EMAIL_ALREADY_EXISTS)

  const encryptedPassword = String(await encryptPassword(args.user.password))

  return await createUser({
    name: args.user.name,
    password: encryptedPassword,
    email: args.user.email,
    gender: args.user.gender,
    role: args.user.role,
    birthdate: args.user.birthdate,
    taxId: args.user.taxId
  })
}

export default { create }
