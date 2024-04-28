import { CreateUserPayload, MutationLoginArgs } from '@/generated/graphql'
import { INVALID_PASSWORD } from '@/helpers/constants'
import { signToken } from '@/helpers/jwt'
import { verifyPassword } from '@/helpers/password'
import User from '@/models/User'

/**
 * Check if email exists on database
 * @param email {string} - email to check
 * @returns {Promise<Boolean | null>}
 * @example await emailExists('jhon.doe@company.com')
 */
export const emailExists = async (email: string): Promise<Boolean> =>
  Boolean(await User.exists({ email }))

/**
 * Check if document exists on database
 * @param taxId {string} - tax id to check
 * @returns {Promise<Boolean | null>}
 * @example await documentExists('1234567890')
 */
export const documentExists = async (taxId: string): Promise<Boolean> =>
  Boolean(await User.exists({ tax_id: taxId }))

/**
 * Create a new user
 * @param body {Object} - user data
 * @returns
 */
export const createUser = async (body: CreateUserPayload) => {
  const user = await User.create({ ...body, tax_id: body.taxId })
  return user
}

export const loginUser = async (args: MutationLoginArgs) => {
  const { email, password } = args

  const user = await User.findOne({ email })

  if (user) {
    const isValidPassword = await verifyPassword(user.password, password)

    if (!isValidPassword) {
      throw new Error(INVALID_PASSWORD)
    }

    return {
      token: signToken({ userId: user.id }),
      user
    }
  }
}
