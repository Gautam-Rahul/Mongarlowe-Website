const Product = require('../models/productModel');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const count = await Product.countDocuments({ ...keyword, ...category });
    const products = await Product.find({ ...keyword, ...category })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
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
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({
        success: true,
        product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      discountedPrice,
      images,
      category,
      quantity,
      featured,
      origin,
      qualities,
      is_new
    } = req.body;

    // Log the full request body for debugging
    console.log('Create product request body:', req.body);

    const product = new Product({
      name,
      description,
      price,
      discountedPrice: discountedPrice || 0,
      images: images || [],
      category,
      quantity,
      featured: featured || false,
      origin: origin || '',
      qualities: qualities || [],
      is_new: is_new || false,
      createdBy: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      product: createdProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountedPrice,
      images,
      category,
      quantity,
      inStock,
      featured,
      origin,
      qualities,
      is_new
    } = req.body;

    // Log the full request body for debugging
    console.log('Update product request body:', req.body);

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountedPrice = discountedPrice !== undefined ? discountedPrice : product.discountedPrice;
      product.images = images || product.images;
      product.category = category || product.category;
      product.quantity = quantity !== undefined ? quantity : product.quantity;
      product.inStock = inStock !== undefined ? inStock : product.inStock;
      product.featured = featured !== undefined ? featured : product.featured;
      product.origin = origin !== undefined ? origin : product.origin;
      product.qualities = qualities !== undefined ? qualities : product.qualities;
      product.is_new = is_new !== undefined ? is_new : product.is_new;

      const updatedProduct = await product.save();
      res.json({
        success: true,
        product: updatedProduct,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({
        success: true,
        message: 'Product removed',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const products = await Product.find({ featured: true })
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
}; 