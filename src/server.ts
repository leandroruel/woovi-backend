import Koa from 'koa'
import logger from 'koa-logger'
import { koaBody } from 'koa-body'
import helmet from 'koa-helmet'
import cors from '@koa/cors'

import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
  sendResult
} from 'graphql-helix'
import Mongoose from 'mongoose'
import { schema } from './graphql/schema'
import router from './routes'
import { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL } from './config'
import { formatGraphQLResult } from '@/helpers/errors'
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware'
import { validationMiddleware } from '@/middlewares/validation-middleware'

const app = new Koa()

// Middlewares
app.use(logger())

// Database
const mongooseOptions = {
  user: MONGODB_USERNAME,
  pass: MONGODB_PASSWORD
}

Mongoose.connect(MONGODB_URL, mongooseOptions)

// app.use(
//   helmet({
//     contentSecurityPolicy: false
//   })
// )

// Body parser
app.use(koaBody({ multipart: true }))

// GraphQL
app.use(async (ctx) => {
  const request: any = {
    body: ctx.request.body,
    headers: ctx.req.headers,
    method: ctx.request.method,
    query: ctx.request.query
  }

  console.log('variables input', request.body)

  if (shouldRenderGraphiQL(request)) {
    ctx.body = renderGraphiQL()
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request)

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema
    })

    ctx.respond = false
    sendResult(result, ctx.res, formatGraphQLResult)
  }
})

app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    exposeHeaders: ['X-Request-Id']
  })
)

app.use((ctx, next) => validationMiddleware(ctx.request.body.query))

app.use(errorHandlingMiddleware)

// Routes
app.use(router.routes())
app.use(router.allowedMethods())

export default app
