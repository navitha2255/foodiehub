    const { Op } = require('sequelize');
const { sequelize, Order, OrderItem, Food, Address,Cart, CartItem    } = require('../models');
const AppError = require('../utils/AppError');

const MAX_QUANTITY = 20;
const CANCELLABLE_STATUSES = ['Pending', 'Confirmed'];

const orderInclude = [
  {
    model: OrderItem,
    as: 'items',
    include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'imageUrl'] }],
  },
  { model: Address, as: 'address' },
];

const createOrder = async (req, res, next) => {
  try {
    const { addressId, items } = req.body ?? {};

    if (!Number.isInteger(addressId) || addressId < 1) {
      throw new AppError('A valid addressId is required', 400);
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      throw new AppError('items must be a list of 1 to 50 foods', 400);
    }

    // Validate each item and merge duplicates of the same food
    const wanted = new Map();
    for (const item of items) {
      const foodId = item?.foodId;
      const quantity = item?.quantity;
      if (!Number.isInteger(foodId) || foodId < 1) {
        throw new AppError('Each item needs a valid foodId', 400);
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new AppError('Each item needs a quantity of 1 or more', 400);
      }
      wanted.set(foodId, (wanted.get(foodId) || 0) + quantity);
    }
    for (const quantity of wanted.values()) {
      if (quantity > MAX_QUANTITY) {
        throw new AppError(`You can order at most ${MAX_QUANTITY} of one item`, 400);
      }
    }

    // The address must belong to the logged-in user
    const address = await Address.findOne({ where: { id: addressId, userId: req.user.id } });
    if (!address) throw new AppError('Address not found', 404);

    // Prices come from the database, never from the request
    const foods = await Food.findAll({ where: { id: { [Op.in]: [...wanted.keys()] } } });
    if (foods.length !== wanted.size) throw new AppError('One or more foods do not exist', 404);

    const unavailable = foods.filter((f) => !f.isAvailable);
    if (unavailable.length > 0) {
      throw new AppError(`Not available: ${unavailable.map((f) => f.name).join(', ')}`, 400);
    }

    // Work in paise (integers) to avoid decimal rounding errors
    let totalPaise = 0;
    const lines = foods.map((food) => {
      const quantity = wanted.get(food.id);
      const pricePaise = Math.round(Number(food.price) * 100);
      totalPaise += pricePaise * quantity;
      return { foodId: food.id, quantity, price: pricePaise / 100 };
    });

    // Order and items are saved together, or not at all
    const orderId = await sequelize.transaction(async (t) => {
      const order = await Order.create(
        { userId: req.user.id, addressId, totalAmount: totalPaise / 100, status: 'Pending' },
        { transaction: t }
      );
           await OrderItem.bulkCreate(
        lines.map((line) => ({ ...line, orderId: order.id })),
        { transaction: t, validate: true }
      );

      // Remove only the ordered foods from this user's cart, in the same transaction
      const cart = await Cart.findOne({ where: { userId: req.user.id }, transaction: t });
      if (cart) {
        await CartItem.destroy({
          where: { cartId: cart.id, foodId: { [Op.in]: lines.map((l) => l.foodId) } },
          transaction: t,
        });
      }

      return order.id;
    });

    const order = await Order.findByPk(orderId, { include: orderInclude });
    res.status(201).json({ success: true, message: 'Order placed', data: order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: orderInclude,
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.userId = req.user.id;

    const order = await Order.findOne({ where, include: orderInclude });
    // Same 404 whether it doesn't exist or belongs to someone else
    if (!order) throw new AppError('Order not found', 404);

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) throw new AppError('Order not found', 404);

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new AppError(`An order that is ${order.status} cannot be cancelled`, 400);
    }

    await order.update({ status: 'Cancelled' });
    const updated = await Order.findByPk(order.id, { include: orderInclude });
    res.json({ success: true, message: 'Order cancelled', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder };