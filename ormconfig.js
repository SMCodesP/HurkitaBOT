const { config } = require('dotenv')

config()

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [
    process.env.NODE_ENV === 'development'
      ? 'src/entity/**/*.{ts,js}'
      : 'dist/entity/**/*.{ts,js}',
  ],
  migrations: [
    process.env.NODE_ENV === 'development'
      ? 'src/migration/**/*.{ts,js}'
      : 'dist/migration/**/*.{ts,js}',
  ],
  subscribers: [
    process.env.NODE_ENV === 'development'
      ? 'src/subscriber/**/*.{ts,js}'
      : 'dist/subscriber/**/*.{ts,js}',
  ],
  cli: {
    entitiesDir:
      process.env.NODE_ENV === 'development' ? 'src/entity' : 'dist/entity',
    migrationsDir:
      process.env.NODE_ENV === 'development'
        ? 'src/migration'
        : 'dist/migration',
    subscribersDir:
      process.env.NODE_ENV === 'development'
        ? 'src/subscriber'
        : 'dist/subscriber',
  },
  ssl: true,
  cache: { duration: 60000 },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
}
