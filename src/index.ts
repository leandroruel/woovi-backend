import app from 'server'
import process from 'process'

import { NODE_PORT } from './config'

let currentApp: any = app

// currentApp.shutdown = () => process.exit()

// process.on('SIGINT', () => currentApp.shutdown())

// process.on('SIGTERM', () => currentApp.shutdown())

currentApp.listen(NODE_PORT, () =>
  console.log(`Listening on port ${NODE_PORT}`)
)

export default app
