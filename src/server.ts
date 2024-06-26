import Koa from 'koa'
import { koaBody } from 'koa-body'
import logger from 'koa-logger'

import Mongoose, { ConnectOptions } from 'mongoose'
import { MONGODB_PASSWORD, MONGODB_URL, MONGODB_USERNAME } from './config'
import router from './routes'

const app = new Koa()

// Middlewares
app.use(logger())

// Database
const mongooseOptions: ConnectOptions = {
  user: MONGODB_USERNAME,
  pass: MONGODB_PASSWORD,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000
}

Mongoose.connect(MONGODB_URL, mongooseOptions)

Mongoose.connection.on('error', (error) => {
  console.log('Error connecting to database', error)
})

// Body parser
app.use(koaBody({ multipart: true }))

// Routes
app.use(router.routes())
app.use(router.allowedMethods())

export default app
