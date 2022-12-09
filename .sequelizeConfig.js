require('dotenv-flow').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: 0,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: 1,
  },
};
