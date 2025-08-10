const { default: PG } = require('pg');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'tododb',
  DB_USER = 'postgres',
  DB_PASS = '2303'
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectModule: PG,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
