// models/BrandModel.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = { BrandModel };
