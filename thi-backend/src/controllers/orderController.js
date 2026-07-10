const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Create new order (Deduct stock from products)
 * @route   POST /api/orders
 * @access  Public (Client)
 */
const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customerName, customerPhone, customerAddress, and items list',
        data: null
      });
    }

    const productsToUpdate = [];
    const orderItems = [];
    let totalAmount = 0;

    // Phase 1: Validate stock for all products first
    for (const item of items) {
      const productId = item.productId || item.product;
      const quantity = parseInt(item.quantity);

      if (!productId || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID or quantity. Quantity must be greater than 0.',
          data: null
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found`,
          data: null
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm '${product.name}' không đủ số lượng tồn kho (Yêu cầu: ${quantity}, Hiện còn: ${product.stock})`,
          data: null
        });
      }

      productsToUpdate.push({ product, quantity });
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price, // Lock price at purchase time
        quantity
      });

      totalAmount += product.price * quantity;
    }

    // Phase 2: Deduct stock and save products since validation passed
    for (const update of productsToUpdate) {
      update.product.stock -= update.quantity;
      await update.product.save();
    }

    // Phase 3: Create the order
    const order = await Order.create({
      customerName,
      customerPhone,
      customerAddress,
      totalAmount,
      items: orderItems,
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully and stock updated',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

/**
 * @desc    Get all orders (Sorted by newest first)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        data: null
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Logic to restore stock if order is cancelled
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    } 
    // Logic to re-deduct stock if cancelled order is put back to non-cancelled (Optional, but safe)
    else if (order.status === 'Cancelled' && status !== 'Cancelled') {
      // Validate stock first
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product && product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Cannot restore order status. Product '${product.name}' is out of stock (Stock: ${product.stock}).`,
            data: null
          });
        }
      }
      // Re-deduct stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Order not found (Invalid ID format)',
        data: null
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};
