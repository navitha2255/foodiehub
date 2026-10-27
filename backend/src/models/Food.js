const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Food = sequelize.define(
  'Food',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: { msg: 'Food name is required' } },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0.01], msg: 'Price must be greater than 0' } },
    },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 4.0,
      validate: { min: 0, max: 5 },
    },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: 'foods' }
);

module.exports = Food;