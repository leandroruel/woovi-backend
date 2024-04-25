import { CreateUserPayload } from '@/generated/graphql'
import User from '@/models/User'

/**
 * Check if email exists on database
 * @param email {string} - email to check
 * @returns {Promise<Boolean | null>}
 * @example await emailExists('jhon.doe@company.com')
 */
export const emailExists = async (email: string): Promise<Boolean | null> =>
  await User.findOne({ email })

/**
 * Create a new user
 * @param body {Object} - user data
 * @returns
 */
export const createUser = async (body: CreateUserPayload) => {
  const user = await User.create({ ...body, tax_id: body.taxId })
  return user
}
