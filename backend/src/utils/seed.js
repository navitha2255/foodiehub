const { sequelize, User, Category, Food } = require('../models');

const categories = [
  { name: 'Pizza', description: 'Hot, cheesy and freshly baked pizzas' },
  { name: 'Burgers', description: 'Juicy burgers with crispy sides' },
  { name: 'Biryani', description: 'Aromatic rice dishes cooked on dum' },
  { name: 'Chinese', description: 'Noodles, fried rice and Indo-Chinese favourites' },
  { name: 'Desserts', description: 'Sweet treats to finish your meal' },
  { name: 'Beverages', description: 'Cool drinks and shakes' },
];

const img = (id) => `https://images.unsplash.com/${id}?w=600&q=80`;

const foods = [
  { name: 'Margherita Pizza', category: 'Pizza', price: 249, rating: 4.6, description: 'Classic cheese pizza with fresh basil and tomato sauce.', imageUrl: img('photo-1513104890138-7c749659a591') },
  { name: 'Farmhouse Pizza', category: 'Pizza', price: 329, rating: 4.5, description: 'Loaded with capsicum, onion, mushroom and sweet corn.', imageUrl: img('photo-1565299624946-b28f40a0ae38') },
  { name: 'Cheese Burger', category: 'Burgers', price: 179, rating: 4.4, description: 'Juicy grilled patty with melted cheese and crisp lettuce.', imageUrl: img('photo-1568901346375-23c9450c58cd') },
  { name: 'Double Patty Burger', category: 'Burgers', price: 229, rating: 4.3, description: 'Two patties, double cheese and our house sauce.', imageUrl: img('photo-1571091718767-18b5b1457add') },
  { name: 'Chicken Biryani', category: 'Biryani', price: 299, rating: 4.8, description: 'Aromatic basmati rice cooked with tender spiced chicken.', imageUrl: img('photo-1563379091339-03b21ab4a4f8') },
  { name: 'Veg Biryani', category: 'Biryani', price: 229, rating: 4.2, description: 'Fragrant rice with garden vegetables and whole spices.', imageUrl: img('photo-1563379091339-03b21ab4a4f8') },
  { name: 'Veg Hakka Noodles', category: 'Chinese', price: 189, rating: 4.1, description: 'Stir-fried noodles with crunchy vegetables.', imageUrl: img('photo-1585032226651-759b368d7246') },
  { name: 'Chicken Fried Rice', category: 'Chinese', price: 219, rating: 4.3, description: 'Wok-tossed rice with egg, chicken and spring onion.', imageUrl: img('photo-1585032226651-759b368d7246') },
  { name: 'Chocolate Brownie', category: 'Desserts', price: 129, rating: 4.7, description: 'Warm fudgy brownie served with chocolate drizzle.', imageUrl: img('photo-1606313564200-e75d5e30476c') },
  { name: 'Glazed Donuts', category: 'Desserts', price: 99, rating: 4.4, description: 'Soft donuts with sweet glaze.', imageUrl: img('photo-1551024601-bec78aea704b') },
  { name: 'Fresh Lime Soda', category: 'Beverages', price: 69, rating: 4.0, description: 'Chilled lime soda, sweet or salted.', imageUrl: img('photo-1544145945-f90425340c7e') },
  { name: 'Cold Coffee', category: 'Beverages', price: 119, rating: 4.5, description: 'Creamy blended cold coffee with ice.', imageUrl: img('photo-1544145945-f90425340c7e') },
];

const run = async () => {
  try {
    await sequelize.authenticate();

    const categoryIds = {};
    for (const c of categories) {
      const [row] = await Category.findOrCreate({ where: { name: c.name }, defaults: c });
      categoryIds[c.name] = row.id;
    }

    for (const f of foods) {
      const { category, ...data } = f;
      await Food.findOrCreate({
        where: { name: data.name },
        defaults: { ...data, categoryId: categoryIds[category] },
      });
    }

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      if (ADMIN_PASSWORD.length < 8) {
        throw new Error('ADMIN_PASSWORD must be at least 8 characters');
      }
      const [admin, created] = await User.findOrCreate({
        where: { email: ADMIN_EMAIL },
        defaults: { name: ADMIN_NAME || 'Admin', password: ADMIN_PASSWORD, role: 'admin' },
      });
      console.log(created ? `Admin created: ${admin.email}` : `Admin already exists: ${admin.email}`);
    } else {
      console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set. Admin not created.');
    }

    console.log(`Seed complete: ${await Category.count()} categories, ${await Food.count()} foods`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

run();