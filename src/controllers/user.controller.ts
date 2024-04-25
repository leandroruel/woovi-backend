import User from '@/models/User'
import { encryptPassword } from '@/helpers/password'
import { Types } from 'mongoose'
import { GraphQLError } from 'graphql'
import { emailExists, createUser } from '@/services/user.service'
import UsersValidate from '@/validators/user-schema'
import { EMAIL_ALREADY_EXISTS } from '@/helpers/constants'

/**
 *  Create a new user
 * @param ctx
 * @returns
 */
export const create = async (body: any) => {
  // validation
  const { error } = await UsersValidate.validateAsync(body, {
    abortEarly: false
  })

  if (error) {
    throw new GraphQLError(error)
  }

  if (await emailExists(body.user.email)) {
    throw new GraphQLError(EMAIL_ALREADY_EXISTS, {
      extensions: { code: 404, stacktrace: null }
    })
  }

  const encryptedPassword = String(await encryptPassword(body.user.password))

  return await createUser({
    name: body.user.name,
    password: encryptedPassword,
    email: body.user.email,
    gender: body.user.gender,
    role: body.user.role,
    birthdate: body.user.birthdate,
    taxId: body.user.taxId
  })
}

export default { create }
