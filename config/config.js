
const env = process.env;
const host = env.USE_DOCKER == 1 ? env.DB_DOCKER_HOST: env.DB_HOST
const port = env.USE_DOCKER == 1 ? env.MYSQL_LOCAL_PORT : env.DB_PORT
const x = {
  development: {
    username:  env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port:3306,
    host,
    dialect: env.DB_DIALECT,
    logging: false
  },
  production: {
    username: env.HEROKU_USER,
    password: env.HEROKU_PASSWORD,
    database: env.HEROKU_DB,
    port,
    host: env.HEROKU_HOST,
    dialect: env.DB_DIALECT,
    logging: false

  },
};
module.exports = x;