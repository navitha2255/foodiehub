const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    foodId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: { args: [1], msg: 'Quantity must be at least 1' } },
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: 'order_items' }
);

module.exports = OrderItem;