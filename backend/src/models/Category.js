const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define(
  'Category',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Category name is required' } },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'categories' }
);

module.exports = Category;