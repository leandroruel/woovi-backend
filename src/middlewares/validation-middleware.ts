import Joi, { Schema, ValidationResult } from 'joi'
import { BadRequest } from '@/helpers/errors'
import { Middleware } from 'koa'

interface ValidationObject {
  headers?: Schema
  params?: Schema
  query?: any
  body?: any
}

const validateObject = (
  object: any = {},
  label: string,
  schema?: Schema,
  options?: Joi.ValidationOptions
): void => {
  if (schema) {
    schema = Joi.isSchema(schema) ? schema : Joi.object(schema)
    const { error }: ValidationResult = schema.validate(object, options)
    if (error) {
      throw new Error(`Invalid ${label} - ${error.message}`)
    }
  }
}

export const validationMiddleware =
  (validationObj: ValidationObject): Middleware =>
  (ctx, next) => {
    try {
      validateObject(ctx.headers, 'Headers', validationObj.headers, {
        allowUnknown: true
      })
      validateObject(ctx.params, 'URL Parameters', validationObj.params)
      validateObject(ctx.query, 'URL Query', validationObj.query)

      if (ctx.request.body) {
        validateObject(ctx.request.body, 'Request Body', validationObj.body)
      }

      return next()
    } catch (err: any) {
      throw BadRequest(err.message)
    }
  }
