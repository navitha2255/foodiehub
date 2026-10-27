const { sequelize, Food, Category } = require('../models');

const run = async () => {
  try {
    const foods = await Food.findAll({
      limit: 3,
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    });
    console.log(JSON.stringify(foods, null, 2));

    const pizza = await Category.findOne({
      where: { name: 'Pizza' },
      include: [{ model: Food, as: 'foods', attributes: ['name', 'price'] }],
    });
    console.log(`\n${pizza.name} has ${pizza.foods.length} foods`);
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
};

run();