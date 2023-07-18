const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

mongoose.model('UserModel', userSchema);
