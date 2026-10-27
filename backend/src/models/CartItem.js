const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define(
  'CartItem',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    cartId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    foodId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      validate: { min: { args: [1], msg: 'Quantity must be at least 1' } },
    },
  },
  {
    tableName: 'cart_items',
    indexes: [{ unique: true, fields: ['cartId', 'foodId'] }],
  }
);

module.exports = CartItem;