import { Account, CreateAccountPayload } from '@/generated/graphql'
import AccountModel from '@/models/Account'

/**
 * Create a new account
 * @param args {CreateAccountPayload} - Account data payload
 * @returns {Promise<Account>} - Account object
 */
export const createAccount = async (
  args: CreateAccountPayload
): Promise<Account> => {
  const account = await AccountModel.create(args)
  return {
    ...account.toJSON(),
    userId: account.userId.toString() // Convert ObjectId to string
  }
}

/**
 *  Generate a random account number
 * @returns {string} - Account number
 * @example
 * generateAccountNumber() // 1234567890
 */
export const generateAccountNumber = (): string => {
  const accountNumber = Math.floor(Math.random() * 900000) + 100000
  const checksum = calculateChecksum(accountNumber)
  return `${accountNumber}${checksum}`
}

const calculateChecksum = (accountNumber: number): number => {
  const sum = Array.from(String(accountNumber), Number)
    .reverse()
    .map((digit, index) => digit * (index % 2 === 0 ? 1 : 2))
    .map((value) => (value > 9 ? value - 9 : value))
    .reduce((acc, curr) => acc + curr, 0)
  return Math.ceil(sum / 10) * 10 - sum
}
