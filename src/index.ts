import app from 'server'
import http from 'http'
import cors from '@koa/cors'
import dotenv from 'dotenv'
import { NODE_PORT } from './config'

import { ApolloServer } from '@apollo/server'
import typeDefs from './graphql/typeDefs'
import resolvers from './graphql/resolvers'
import { koaMiddleware } from '@as-integrations/koa'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

dotenv.config()

const EXTERNAL_ENDPOINT = String(process.env.GRAPHQL_URL)

async function server({ typeDefs, resolvers }: any) {
  const httpServer = http.createServer()

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true
  })

  await apolloServer.start()

  httpServer.on('request', app.callback())

  app.use(
    koaMiddleware(apolloServer, {
      context: async ({ ctx }) => ({ token: ctx.headers.token })
    })
  )

  await new Promise((resolve: any) =>
    httpServer.listen({ port: NODE_PORT }, resolve)
  )

  console.log(`🚀 Server ready at ${EXTERNAL_ENDPOINT}`)

  return { apolloServer, app }
}

server({ typeDefs, resolvers }).then(({ app }) => {
  app.use(
    cors({
      origin: '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
      exposeHeaders: ['X-Request-Id']
    })
  )
})

export default app
