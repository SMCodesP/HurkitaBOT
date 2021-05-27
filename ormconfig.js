module.exports = {
  type: 'postgres',
  url: 'postgres://iwdpaoqhcfcxkt:5466660f028bfb0332c29050611ddc7657f65e57534c8a9e2ee4eb3dc8680db6@ec2-107-21-10-179.compute-1.amazonaws.com:5432/df0la40itcogiq',
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.{ts,js}'],
  migrations: ['src/migration/**/*.{ts,js}'],
  subscribers: ['src/subscriber/**/*.{ts,js}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
  ssl: true,
  cache: { duration: 60000 },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
}
