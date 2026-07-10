const Category = require('../models/Category');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

/**
 * @desc    Create a category (helper/admin API)
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
        data: null
      });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
        data: null
      });
    }

    const category = await Category.create({ name, description });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  getCategories,
  createCategory
};
