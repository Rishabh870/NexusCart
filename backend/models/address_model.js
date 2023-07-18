const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const AddressModel = mongoose.model('Address', addressSchema);

module.exports = AddressModel;
