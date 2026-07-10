const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

// Public route for placing orders (Client)
router.post('/', createOrder);

// Admin protected routes
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
