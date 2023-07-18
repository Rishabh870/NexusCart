const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductModel',
    required: true,
  },
  reviews: [
    {
      stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
    },
  ],
});

const ReviewModel = mongoose.model('ReviewModel', reviewSchema);

module.exports = ReviewModel;
