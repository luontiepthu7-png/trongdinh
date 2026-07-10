const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * @desc    Get all products (Paginated & Filtered by Category)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const categoryId = req.query.categoryId;

    let query = {};
    if (categoryId) {
      query.category = categoryId;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const productQuery = Product.findById(req.params.id);
    let product;
    if (productQuery && typeof productQuery.populate === 'function') {
      product = await productQuery.populate('category', 'name');
    } else {
      product = await productQuery;
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found (Invalid ID format)',
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

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, stock, categoryId } = req.body;

    // Validate fields
    if (!name || !description || price === undefined || !imageUrl || stock === undefined || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, imageUrl, stock, categoryId',
        data: null
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Category ID. Category does not exist.',
        data: null
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      stock,
      category: categoryId
    });

    const productQuery = Product.findById(product._id);
    let populatedProduct;
    if (productQuery && typeof productQuery.populate === 'function') {
      populatedProduct = await productQuery.populate('category', 'name');
    } else {
      populatedProduct = await productQuery;
    }

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, stock, categoryId } = req.body;

    // Find product
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    // If categoryId is changing, verify it exists
    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Category ID. Category does not exist.',
          data: null
        });
      }
      product.category = categoryId;
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    const productQuery = Product.findById(product._id);
    let populatedProduct;
    if (productQuery && typeof productQuery.populate === 'function') {
      populatedProduct = await productQuery.populate('category', 'name');
    } else {
      populatedProduct = await productQuery;
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found (Invalid ID format)',
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

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found (Invalid ID format)',
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
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
