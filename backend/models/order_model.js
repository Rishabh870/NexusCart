const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
  },
  orders: [
    {
      date: {
        type: Date,
        default: Date.now,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      paid: {
        type: String,
        default: 'No',
        required: true,
      },
      delivery: {
        type: String,
        default: 'No',
        required: true,
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductModel',
          },
          selectedSize: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      address: {
        deliveryTo: {
          type: String,
          required: true,
        },
        deliveryAddress: {
          type: String,
          required: true,
        },
      },
    },
  ],
});

const OrderModel = mongoose.model('OrderModel', orderSchema);

module.exports = OrderModel;
