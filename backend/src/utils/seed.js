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
  {
name: 'Idli with Sambar',
category: 'South Indian',
price: 79,
rating: 4.5,
description: 'Soft steamed idlis served with hot sambar and coconut chutney.',
imageUrl: img('photo-1589301760014-d929f3979dbc')
},
{
name: 'Masala Dosa',
category: 'South Indian',
price: 99,
rating: 4.6,
description: 'Crispy dosa filled with spiced potato masala and served with chutneys.',
imageUrl: img('photo-1668236543090-82eba5ee5976')
},
{
name: 'Pesarattu',
category: 'Telugu Specials',
price: 89,
rating: 4.5,
description: 'Traditional Andhra green gram dosa served with ginger chutney.',
imageUrl: img('photo-1630383249896-424e482df921')
},
{
name: 'Punugulu',
category: 'Telugu Snacks',
price: 69,
rating: 4.4,
description: 'Crispy golden Andhra fritters made from fermented dosa batter.',
imageUrl: img('photo-1601050690597-df0568f70950')
},
{
name: 'Andhra Upma',
category: 'South Indian',
price: 69,
rating: 4.2,
description: 'Savory semolina cooked with green chilies, curry leaves and spices.',
imageUrl: img('photo-1601050690117-94f5f6fa8bd7')
},

// Andhra and Telangana Rice Dishes
{
name: 'Andhra Chicken Pulusu',
category: 'Andhra Specials',
price: 279,
rating: 4.7,
description: 'Spicy Andhra-style chicken curry with a rich, tangy gravy.',
imageUrl: img('photo-1603894584373-5ac82b2ae398')
},
{
name: 'Gongura Chicken',
category: 'Andhra Specials',
price: 299,
rating: 4.8,
description: 'Authentic Andhra chicken cooked with tangy gongura leaves and spices.',
imageUrl: img('photo-1603894584373-5ac82b2ae398')
},
{
name: 'Gongura Pachadi Rice',
category: 'Andhra Specials',
price: 149,
rating: 4.6,
description: 'Steamed rice mixed with tangy gongura chutney and traditional tempering.',
imageUrl: img('photo-1516684732162-798a0062be99')
},
{
name: 'Andhra Veg Meals',
category: 'Andhra Meals',
price: 179,
rating: 4.5,
description: 'Traditional rice meal served with pappu, vegetable curry, rasam, sambar and pickle.',
imageUrl: img('photo-1546833999-b9f581a1996d')
},
{
name: 'Andhra Non-Veg Meals',
category: 'Andhra Meals',
price: 299,
rating: 4.8,
description: 'A hearty Andhra meal with rice, chicken curry, pappu, rasam and spicy accompaniments.',
imageUrl: img('photo-1546833999-b9f581a1996d')
},
{
name: 'Gutti Vankaya Curry',
category: 'Andhra Specials',
price: 189,
rating: 4.6,
description: 'Andhra-style stuffed brinjals simmered in a flavorful peanut and sesame gravy.',
imageUrl: img('photo-1547592180-85f173990554')
},
{
name: 'Tomato Pappu',
category: 'Telugu Specials',
price: 129,
rating: 4.4,
description: 'Comforting Andhra lentils cooked with tomatoes, green chilies and a garlic tempering.',
imageUrl: img('photo-1547592180-85f173990554')
},
{
name: 'Mamidikaya Pappu',
category: 'Telugu Specials',
price: 139,
rating: 4.5,
description: 'Traditional raw mango dal with a delicious balance of tanginess and spice.',
imageUrl: img('photo-1547592180-85f173990554')
},
{
name: 'Royyala Iguru',
category: 'Andhra Specials',
price: 329,
rating: 4.7,
description: 'Andhra-style prawns cooked in a thick, spicy onion and tomato masala.',
imageUrl: img('photo-1565680018434-b513d5e5fd47')
},

// Telangana Traditional Foods
{
name: 'Hyderabadi Dum Biryani',
category: 'Biryani',
price: 299,
rating: 4.9,
description: 'Fragrant basmati rice layered with marinated chicken and aromatic Hyderabadi spices.',
imageUrl: img('photo-1563379091339-03b21ab4a4f8')
},
{
name: 'Telangana Sarva Pindi',
category: 'Telangana Specials',
price: 89,
rating: 4.5,
description: 'Traditional savory rice flour pancake with peanuts, sesame seeds and green chilies.',
imageUrl: img('photo-1601050690597-df0568f70950')
},
{
name: 'Sakinalu',
category: 'Telangana Snacks',
price: 99,
rating: 4.6,
description: 'Crispy traditional Telangana rice flour spirals prepared for festive occasions.',
imageUrl: img('photo-1626777552726-4a6b54c97e46')
},
{
name: 'Jonna Rotte with Pappu',
category: 'Telangana Specials',
price: 149,
rating: 4.4,
description: 'Traditional sorghum flatbread served with homestyle dal and seasonal curry.',
imageUrl: img('photo-1547592180-85f173990554')
},
{
name: 'Kodi Kura',
category: 'Telangana Specials',
price: 279,
rating: 4.7,
description: 'Telangana-style chicken curry cooked with roasted spices and a rich masala.',
imageUrl: img('photo-1603894584373-5ac82b2ae398')
},
{
name: 'Bagara Rice',
category: 'Telangana Specials',
price: 129,
rating: 4.4,
description: 'Fragrant Telangana rice cooked with whole spices, onions and fresh herbs.',
imageUrl: img('photo-1516684732162-798a0062be99')
},
{
name: 'Pachi Pulusu',
category: 'Telangana Specials',
price: 99,
rating: 4.3,
description: 'Traditional Telangana raw tamarind rasam with onions, chilies and aromatic tempering.',
imageUrl: img('photo-1547592180-85f173990554')
},

// Traditional Snacks
{
name: 'Mirchi Bajji',
category: 'Telugu Snacks',
price: 59,
rating: 4.4,
description: 'Andhra-style green chilies dipped in gram flour batter and deep-fried until crispy.',
imageUrl: img('photo-1601050690597-df0568f70950')
},
{
name: 'Punugulu with Peanut Chutney',
category: 'Telugu Snacks',
price: 79,
rating: 4.6,
description: 'Hot and crunchy Andhra fritters served with fresh peanut chutney.',
imageUrl: img('photo-1601050690597-df0568f70950')
},
{
name: 'Garelu',
category: 'Telugu Snacks',
price: 69,
rating: 4.5,
description: 'Crispy traditional urad dal vadas enjoyed with coconut chutney.',
imageUrl: img('photo-1630383249896-424e482df921')
},
{
name: 'Andhra Chicken Fry',
category: 'Andhra Specials',
price: 249,
rating: 4.7,
description: 'Spicy chicken pieces tossed with curry leaves, green chilies and Andhra masala.',
imageUrl: img('photo-1603894584373-5ac82b2ae398')
},

{
name: 'Pootharekulu',
category: 'Traditional Sweets',
price: 149,
rating: 4.7,
description: 'Delicate Andhra paper sweets made with thin rice starch sheets, ghee and sugar.',
imageUrl: img('photo-1606313564200-e75d5e30476c')
},
{
name: 'Ariselu',
category: 'Traditional Sweets',
price: 99,
rating: 4.6,
description: 'Traditional festive rice flour sweets prepared with jaggery and sesame seeds.',
imageUrl: img('photo-1606313564200-e75d5e30476c')
},
{
name: 'Bobbatlu',
category: 'Traditional Sweets',
price: 89,
rating: 4.6,
description: 'Soft Andhra sweet flatbreads stuffed with sweetened lentils and jaggery.',
imageUrl: img('photo-1605197788044-5c4b6e6d3a6c')
},
{
name: 'Qubani Ka Meetha',
category: 'Hyderabadi Desserts',
price: 139,
rating: 4.7,
description: 'Classic Hyderabadi dessert made from slow-cooked dried apricots.',
imageUrl: img('photo-1488477181946-6428a0291777')
},
{
name: 'Double Ka Meetha',
category: 'Hyderabadi Desserts',
price: 129,
rating: 4.6,
description: 'Hyderabadi bread pudding made with fried bread, sweetened milk, nuts and cardamom.',
imageUrl: img('photo-1488477181946-6428a0291777')
},
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
        // Create any category used by a food that is not in the list above
       const extraNames = [...new Set(foods.map((f) => f.category))].filter((n) => !categoryIds[n]);
    for (const name of extraNames) {
      const [row] = await Category.findOrCreate({
        where: { name },
        defaults: { name, description: `${name} dishes` },
      });
      categoryIds[name] = row.id;
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