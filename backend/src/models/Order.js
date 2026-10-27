const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { ORDER_STATUSES } = require('../utils/constants');

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    addressId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM(...ORDER_STATUSES),
      allowNull: false,
      defaultValue: 'Pending',
    },
  },
  { tableName: 'orders' }
);

module.exports = Order;