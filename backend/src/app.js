const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const foodRoutes = require('./routes/foodRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Food E-Commerce API is running');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is healthy',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;