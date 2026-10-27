const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const required = (label) => ({ notEmpty: { msg: `${label} is required` } });

const Address = sequelize.define(
  'Address',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fullName: { type: DataTypes.STRING(100), allowNull: false, validate: required('Full name') },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: { is: { args: /^[0-9+\-\s]{7,15}$/, msg: 'Enter a valid phone number' } },
    },
    addressLine: { type: DataTypes.STRING(255), allowNull: false, validate: required('Address') },
    city: { type: DataTypes.STRING(80), allowNull: false, validate: required('City') },
    state: { type: DataTypes.STRING(80), allowNull: false, validate: required('State') },
    postalCode: { type: DataTypes.STRING(10), allowNull: false, validate: required('Postal code') },
  },
  { tableName: 'addresses' }
);

module.exports = Address;