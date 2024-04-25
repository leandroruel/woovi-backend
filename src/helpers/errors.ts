import { ExecutionResult, GraphQLError, GraphQLErrorOptions } from 'graphql'
import { MongooseError } from 'mongoose'

interface Error {
  errorCode?: any
  code?: number
  keyPattern?: any
  originalError?: { message: string }
  statusCode?: number
  status?: number
  message?: string
}

export const NotFound = (
  message = 'The requested resource could not be found'
) => ({
  name: 'NotFound',
  message,
  statusCode: 404,
  errorCode: 404
})

export const BadRequest = (message = 'The json data is malformed') => ({
  name: 'BadRequest',
  message,
  statusCode: 400,
  errorCode: 400
})

export const InternalServerError = (
  message = 'The API did something wrong'
) => ({
  name: 'InternalServerError',
  message,
  statusCode: 500,
  errorCode: 500
})

export const Unauthorized = (message = 'Incorrect username or password') => ({
  name: 'Unauthorized',
  message,
  statusCode: 401,
  errorCode: 401
})

export const Deleted = (message = 'Successfully deleted') => ({
  name: 'Deleted',
  message,
  deleted: true,
  statusCode: 200,
  errorCode: 200
})

export const Forbidden = (message = 'Request unavailable', body = {}) => ({
  name: 'Forbidden',
  message,
  body,
  statusCode: 403,
  errorCode: 403
})

export const getErrorByStatusCode = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return NotFound
    case 400:
      return BadRequest
    case 500:
    default:
      return InternalServerError
    case 401:
      return Unauthorized
  }
}

export const errorHandling = (err: Error) => {
  console.log('BAD REQUEST ERROR CODE', err.code, err.errorCode)
  if (err.errorCode) {
    return err
  }

  if (err.code === 11000) {
    return {
      type: 'DuplicateKey',
      data: {
        columns: Object.keys(err.keyPattern),
        err: err.toString()
      },
      statusCode: 400
    }
  }

  if (err.originalError) {
    return Unauthorized(err.originalError.message)
  }

  const errorLib = getErrorByStatusCode(err.statusCode || err.status || 500)

  return errorLib(err.message || err.toString())
}

export const formatGraphQLError = (error: GraphQLError) => {
  if (error && error.name === 'MongoServerError') {
    const errorMessage = error.message || 'Sorry, something went wrong'
    throw new GraphQLError(errorMessage, error)
  }

  throw new GraphQLError(error.message, error)
}
