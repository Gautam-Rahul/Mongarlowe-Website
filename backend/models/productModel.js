const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
      default: 0,
    },
    discountedPrice: {
      type: Number,
      min: [0, 'Discounted price must be positive'],
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: '',
        },
      },
    ],
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['electronics', 'clothing', 'home', 'books', 'accessories', 'other', 
             'black', 'green', 'white', 'oolong', 'herbal'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide product quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    origin: {
      type: String,
      default: '',
    },
    qualities: {
      type: [String],
      default: [],
    },
    is_new: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for text search on product name and description
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 