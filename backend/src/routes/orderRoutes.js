const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders); // must come BEFORE '/:id'
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;