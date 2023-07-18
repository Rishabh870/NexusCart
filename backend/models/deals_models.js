const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  redirect: {
    type: String,
    required: true,
  },
});

mongoose.model('DealModel', dealSchema);
