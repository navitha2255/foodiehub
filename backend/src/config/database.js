require('dotenv').config();
const path = require('path');
const { Sequelize } = require('sequelize');

// The database is one file inside the backend folder
const storage = path.resolve(__dirname, '../../', process.env.DB_STORAGE || 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
});

module.exports = sequelize;