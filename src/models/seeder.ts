import { Seeder } from 'mongo-seeding'
import path from 'path'

import { MONGODB_URL } from '@/config/database'

const seed = async () => {
  const seeder = new Seeder({
    database: `${MONGODB_URL}`
  })

  const seedPath = path.resolve('src/models/seeds')

  const collectionsWithPromise = seeder.readCollectionsFromPath(seedPath)

  const collections = await Promise.all(
    collectionsWithPromise.map(async ({ documents, ...collection }) => {
      const data = await Promise.all(documents.map((doc) => doc))

      return { ...collection, documents: data }
    })
  )

  try {
    await seeder.import(collections)
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

seed()
