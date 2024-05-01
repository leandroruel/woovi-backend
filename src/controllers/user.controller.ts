import {
  MutationCreateUserArgs,
  MutationLoginArgs,
  MutationUpdateUserArgs
} from '@/generated/graphql'
import {
  DOCUMENT_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS
} from '@/helpers/constants'
import { signToken } from '@/helpers/jwt'
import { encryptPassword } from '@/helpers/password'
import {
  createAccount,
  generateAccountNumber
} from '@/services/account.service'
import {
  createUser,
  documentExists,
  emailExists,
  loginUser,
  updateUser
} from '@/services/user.service'
import { validateUserCreate } from '@/validators/user-schema'
import { GraphQLError } from 'graphql'
import { v4 as uuidv4 } from 'uuid'

/**
 *  Create a new user
 * @param ctx
 * @returns
 */
export const create = async (args: MutationCreateUserArgs) => {
  const { password, ...rest } = args.user

  const { error } = await validateUserCreate.validateAsync(args, {
    abortEarly: false
  })

  if (error) throw new GraphQLError(error)

  if (await emailExists(args.user.email))
    throw new GraphQLError(EMAIL_ALREADY_EXISTS)

  if (await documentExists(args.user.taxId))
    throw new GraphQLError(DOCUMENT_ALREADY_EXISTS)

  const encryptedPassword = String(await encryptPassword(password))

  const user = await createUser({ ...rest, password: encryptedPassword })

  await createAccount({
    userId: user.id,
    balance: 100,
    idempotencyId: uuidv4(),
    accountNumber: generateAccountNumber()
  })

  const token = signToken({ userId: user.id })

  return {
    token,
    user
  }
}

export const login = async (args: MutationLoginArgs) => {
  const { email, password } = args
  console.log(args)
  return await loginUser({ email, password })
}

export const update = async (args: MutationUpdateUserArgs) => {
  const {
    id,
    user: { password, ...rest }
  } = args

  // const { error } = await validateUserUpdate.validateAsync(args, {
  //   abortEarly: false
  // })

  // if (error) throw new GraphQLError(error)

  // if (args.user.email && (await emailExists(args.user.email)))
  //   throw new GraphQLError(EMAIL_ALREADY_EXISTS)

  // if (args.user.taxId && (await documentExists(args.user.taxId)))
  //   throw new GraphQLError(DOCUMENT_ALREADY_EXISTS)

  if (password) {
    // Criptografar a senha
    const encryptedPassword = String(await encryptPassword(password))
    // Atualizar os campos, incluindo a senha criptografada
    const user = await updateUser(id, { ...rest, password: encryptedPassword })
    return { ...user, password: encryptedPassword }
  }

  const user = await updateUser(id, rest)

  if (!user) return null

  return user
}

export default { create, update, login }
