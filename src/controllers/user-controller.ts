import User from '@/models/User'
import { encryptPassword } from '@/helpers/password'
import { Types } from 'mongoose'
import UsersValidate from '@/validators/user-schema'
import { GraphQLError } from 'graphql'

/**
 *  Create a new user
 * @param ctx
 * @returns
 */
export const create = async (body: any) => {
  try {
    const newUser = User.create({
      name: body.name,
      password: await encryptPassword(body.password),
      email: body.email,
      gender: body.gender,
      role: new Types.ObjectId(body.role),
      birthdate: body.birthdate,
      tax_id: body.tax_id
    })

    return newUser
  } catch (error) {
    return new GraphQLError(error as string)
  }
}

export default { create }
