const { Address } = require('../models');
const AppError = require('../utils/AppError');

const FIELDS = ['fullName', 'phone', 'addressLine', 'city', 'state', 'postalCode'];

// Copies only the allowed fields, so a user can never set userId or id
const pickFields = (body) => {
  const data = {};
  for (const field of FIELDS) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== 'string') throw new AppError(`${field} must be text`, 400);
      data[field] = body[field].trim();
    }
  }
  return data;
};

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const data = pickFields(req.body ?? {});
    const missing = FIELDS.filter((f) => !data[f]);
    if (missing.length > 0) throw new AppError(`Missing fields: ${missing.join(', ')}`, 400);

    const address = await Address.create({ ...data, userId: req.user.id });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!address) throw new AppError('Address not found', 404);

    await address.update(pickFields(req.body ?? {}));
    res.json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!address) throw new AppError('Address not found', 404);

    await address.destroy(); // blocked by the database if an order uses it
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress };