const { Cart, CartItem, Food } = require('../models');
const AppError = require('../utils/AppError');

const MAX_QUANTITY = 20;

// Builds the cart the frontend needs. Prices always come from the database.
const getCartData = async (userId) => {
  const [cart] = await Cart.findOrCreate({ where: { userId } });
  const rows = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      { model: Food, as: 'food', attributes: ['id', 'name', 'price', 'imageUrl', 'isAvailable'] },
    ],
    order: [['id', 'ASC']],
  });

  let subtotalPaise = 0;
  let totalItems = 0;
  const items = rows.map((row) => {
    subtotalPaise += Math.round(Number(row.food.price) * 100) * row.quantity;
    totalItems += row.quantity;
    return {
      id: row.id,
      foodId: row.foodId,
      quantity: row.quantity,
      food: {
        id: row.food.id,
        name: row.food.name,
        price: Number(row.food.price),
        imageUrl: row.food.imageUrl,
        isAvailable: row.food.isAvailable,
      },
    };
  });

  return { id: cart.id, items, totalItems, subtotal: subtotalPaise / 100 };
};

// Finds a cart item only if it belongs to this user's cart
const findOwnItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) return null;
  return CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
};

const validQuantity = (q) => Number.isInteger(q) && q >= 1 && q <= MAX_QUANTITY;

const getCart = async (req, res, next) => {
  try {
    res.json({ success: true, data: await getCartData(req.user.id) });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { foodId, quantity = 1 } = req.body ?? {};

    if (!Number.isInteger(foodId) || foodId < 1) throw new AppError('A valid foodId is required', 400);
    if (!validQuantity(quantity)) {
      throw new AppError(`Quantity must be a whole number from 1 to ${MAX_QUANTITY}`, 400);
    }

    const food = await Food.findByPk(foodId);
    if (!food) throw new AppError('Food not found', 404);
    if (!food.isAvailable) throw new AppError(`${food.name} is not available right now`, 400);

    const [cart] = await Cart.findOrCreate({ where: { userId: req.user.id } });
    const existing = await CartItem.findOne({ where: { cartId: cart.id, foodId } });

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > MAX_QUANTITY) {
        throw new AppError(`You can add at most ${MAX_QUANTITY} of one item`, 400);
      }
      await existing.update({ quantity: newQuantity });
    } else {
      await CartItem.create({ cartId: cart.id, foodId, quantity });
    }

    res.status(201).json({ success: true, data: await getCartData(req.user.id) });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body ?? {};
    if (!validQuantity(quantity)) {
      throw new AppError(`Quantity must be a whole number from 1 to ${MAX_QUANTITY}`, 400);
    }

    const item = await findOwnItem(req.user.id, req.params.id);
    if (!item) throw new AppError('Cart item not found', 404);

    await item.update({ quantity });
    res.json({ success: true, data: await getCartData(req.user.id) });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const item = await findOwnItem(req.user.id, req.params.id);
    if (!item) throw new AppError('Cart item not found', 404);

    await item.destroy();
    res.json({ success: true, data: await getCartData(req.user.id) });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({ success: true, data: await getCartData(req.user.id) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };