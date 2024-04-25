import dotenv from 'dotenv'
dotenv.config()

/**
 * Base url da api do ConectaGov
 * @description ConectaGov API URL
 * @type {string}
 */
export const CONECTAGOV_API_URL: string =
  process.env.CONECTAGOV_API_URL || 'https://api.conecta.gov.br'

/**
 * Url de autenticação da api do ConectaGov
 * @description ConectaGov OAuth URL
 * @type {string}
 */
export const CONECTAGOV_OAUTH_URL: string = `${CONECTAGOV_API_URL}/oauth2/jwt-token`

/**
 * Client ID da aplicação no ConectaGov
 * @description ConectaGov Client ID
 * @type {string}
 */
export const CONECTAGOV_CLIENT_ID: string =
  process.env.CONECTAGOV_CLIENT_ID || '8ddc46f2-f6a3-4077-9e04-74b55de934a5'

/**
 * Client Secret da aplicação no ConectaGov
 * @description ConectaGov Client Secret
 * @type {string}
 */
export const CONECTAGOV_CLIENT_SECRET: string =
  process.env.CONECTAGOV_CLIENT_SECRET || '06d4aaac-1412-45f6-bd7c-38b2bef0d706'

/**
 *  Valida um CPF usando uma expressão regular
 * @param cpf {string} CPF a ser validado
 * @returns {boolean} Retorna true se o CPF é válido, caso contrário, retorna false
 */
export const isValidCPF = (cpf: string): boolean => {
  const regex = new RegExp('[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}')

  return regex.test(cpf)
}

/**
 * Remove caracteres não numéricos de um CPF
 * @param document {string} CPF a ser formatado
 * @returns {string} Retorna o CPF formatado
 */
export const formatDocument = (document: string): string => {
  return document.replace(/\D/g, '')
}
