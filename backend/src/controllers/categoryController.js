const { Category } = require('../models');
const AppError = require('../utils/AppError');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) throw new AppError('Category not found', 404);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategoryById };