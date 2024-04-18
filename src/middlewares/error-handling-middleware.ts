import { errorHandling } from '@/helpers/errors'
import { Context, Next } from 'koa'

export const errorHandlingMiddleware = async (ctx: Context, next: Next) => {
  try {
    ctx.body = await next()
  } catch (err: any) {
    const errorObject = errorHandling(err)
    ctx.status = errorObject.statusCode || 500
    ctx.body = errorObject
  }
}
