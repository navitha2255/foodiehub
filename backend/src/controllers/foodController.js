const { Op } = require('sequelize');
const { Food, Category } = require('../models');
const AppError = require('../utils/AppError');

const SORT_OPTIONS = {
  price_asc: [['price', 'ASC']],
  price_desc: [['price', 'DESC']],
  rating: [['rating', 'DESC']],
  newest: [['createdAt', 'DESC']],
};

const getFoods = async (req, res, next) => {
  try {
    const { search, category, sort, available } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);

    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (available === 'true') where.isAvailable = true;

    const include = [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
        ...(category ? { where: { name: category } } : {}),
      },
    ];

    const { rows, count } = await Food.findAndCountAll({
      where,
      include,
      order: SORT_OPTIONS[sort] || [['id', 'ASC']],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    if (!food) throw new AppError('Food not found', 404);
    res.json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};

const getTopRatedFoods=async(req,res,next)=>{
  try{
    const limit= Math.min(parseInt(req.query.limit , 10) || 5,20);
    const foods= await Food.findAll({
      where:{isAvailable : true},
      order:[['rating','DESC']],
      limit,
      include:[{model:Category , as:'category',attributes:['id','name']}],

    });
    res.json({success:true , data:foods});

  }catch(error){
    next(error)
  }
}

module.exports = { getFoods, getFoodById };