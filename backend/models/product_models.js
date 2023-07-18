const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  img: {
    type: Array,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
  category: {
    type: Array,
    required: true,
  },
  review: {
    type: Number,
    default: 0,
    required: true,
  },
});

// Add text indexes for specific fields
productSchema.index({
  productName: 'text',
  brandName: 'text',
  category: 'text',
  price: 'text',
});
mongoose.model('ProductModel', productSchema);
