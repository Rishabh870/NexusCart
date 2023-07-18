const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'UserModel',
  },
  products: [
    {
      productId: {
        type: ObjectId,
        ref: 'ProductModel',
      },
      quantity: {
        type: Number,
        required: true,
      },
      selectedSize: {
        type: String,
        required: true,
      },
    },
  ],
});

mongoose.model('CartModel', cartSchema);
