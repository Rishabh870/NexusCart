const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "UserModel",
  },
  products: [
    {
      productId: {
        type: ObjectId,
        ref: "ProductModel",
      },
      quantity: {
        type: Number,
      },
      selectedSize: {
        type: String,
      },
    },
  ],
});

mongoose.model("CartModel", cartSchema);
