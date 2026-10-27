const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Food = require('./Food');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Address = require('./Address');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart', onDelete: 'CASCADE' });

Food.hasMany(CartItem, { foreignKey: 'foodId', as: 'cartItems', onDelete: 'CASCADE' });
CartItem.belongsTo(Food, { foreignKey: 'foodId', as: 'food', onDelete: 'CASCADE' });

Category.hasMany(Food, { foreignKey: 'categoryId', as: 'foods', onDelete: 'RESTRICT' });
Food.belongsTo(Category, { foreignKey: 'categoryId', as: 'category', onDelete: 'RESTRICT' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'RESTRICT' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'RESTRICT' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order', onDelete: 'CASCADE' });

Food.hasMany(OrderItem, { foreignKey: 'foodId', as: 'orderItems', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Food, { foreignKey: 'foodId', as: 'food', onDelete: 'RESTRICT' });

User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

Address.hasMany(Order, { foreignKey: 'addressId', as: 'orders', onDelete: 'RESTRICT' });
Order.belongsTo(Address, { foreignKey: 'addressId', as: 'address', onDelete: 'RESTRICT' });

module.exports = {
  sequelize,
  User,
  Category,
  Food,
  Cart,
  CartItem,
  Address,
  Order,
  OrderItem,
};