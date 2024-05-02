import {
  CreateUserPayload,
  MutationLoginArgs,
  UpdateUserPayload
} from '@/generated/graphql'
import { INVALID_PASSWORD, USER_NOT_FOUND } from '@/helpers/constants'
import { signToken } from '@/helpers/jwt'
import { verifyPassword } from '@/helpers/password'
import UserModel from '@/models/User'
import { GraphQLError } from 'graphql'

/**
 * Check if email exists on database
 * @param email {string} - email to check
 * @returns {Promise<Boolean | null>}
 * @example await emailExists('jhon.doe@company.com')
 */
export const emailExists = async (email: string): Promise<Boolean> =>
  Boolean(await UserModel.exists({ email }))

/**
 * Check if document exists on database
 * @param taxId {string} - tax id to check
 * @returns {Promise<Boolean | null>}
 * @example await documentExists('1234567890')
 */
export const documentExists = async (taxId: string): Promise<Boolean> =>
  Boolean(await UserModel.exists({ tax_id: taxId }))

/**
 * Create a new user
 * @param body {Object} - user data
 * @returns
 */
export const createUser = async (body: CreateUserPayload) =>
  await UserModel.create({ ...body, tax_id: body.taxId })

/**
 *
 * @param id {string} - user id
 * @param input {Object} - user data
 * @returns {Promise<Object>}
 */
export const updateUser = async (
  id: string,
  input: UpdateUserPayload
): Promise<object | null> =>
  await UserModel.findByIdAndUpdate(
    id,
    { ...input, tax_id: input.taxId },
    {
      new: true
    }
  )

/**
 *  Authenticates a user and return a JWT Token
 * @param args {MutationLoginArgs} - user data
 * @returns {Promise<Object>} - token and user data
 */
export const loginUser = async (args: MutationLoginArgs): Promise<Object> => {
  const { email, password } = args

  const user = await UserModel.findOne({ email })

  if (!user)
    throw new GraphQLError(USER_NOT_FOUND, {
      extensions: { code: 'USER_NOT_FOUND' }
    })

  const isValidPassword = await verifyPassword(password, user.password)

  if (!isValidPassword) {
    throw new GraphQLError(INVALID_PASSWORD, {
      extensions: { code: 'INVALID_PASSWORD' }
    })
  }

  const token = signToken({ userId: user.id }) || ''

  return {
    token,
    user
  }
}
