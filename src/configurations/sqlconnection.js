require('dotenv').config()
const Sequelize = require("sequelize");
module.exports = new Sequelize(process.env.SQL_DB_NAME, process.env.SQL_USER_NAME, process.env.SQL_DB_PASSWORD, {
  host: process.env.SQL_HOST,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});