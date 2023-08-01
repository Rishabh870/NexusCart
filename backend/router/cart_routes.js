const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAuth,
} = require('../middleware/verifyToken');
const CartModel = mongoose.model('CartModel');
const ProductModel = mongoose.model('ProductModel');

router.post('/addcart/:userId', verifyTokenAuth, async (req, res) => {
  const { products } = req.body;
  const userId = req.user.userId;
  CartModel.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        // Cart does not exist for the user, create a new cart and add the product
        const newCart = new CartModel({ userId, ...req.body });

        newCart
          .save()
          .then(() => {
            ProductModel.findById(`${req.body.products[0].productId}`)
              .then((product) => {
                res.status(201).json({
                  products: { ...product._doc, ...req.body.products[0] },
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Internal Server Error z' });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error z' });
          });
      } else {
        // Cart exists for the user, push the new product to the products array
        cart.products.push(...products);
        cart
          .save()
          .then(() => {
            ProductModel.findById(`${req.body.products[0].productId}`)
              .then((product) => {
                const cartId = cart.products[cart.products.length - 1]._id;
                res.status(200).json({
                  products: {
                    ...product._doc,
                    ...req.body.products[0],
                    cartId: cartId,
                  },
                });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error y' });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error x' });
    });
});

router.get('/products/:userId', verifyTokenAuth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await CartModel.findOne({ userId });
    console.log(userId);
    if (!cart) {
      // Cart does not exist for the user
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartProducts = cart.products;

    // Extract the product IDs, selectedSize, and quantity from the cart products
    const productDetails = await Promise.all(
      cartProducts.map(async (product) => {
        const { productId, selectedSize, quantity } = product;

        const productData = await ProductModel.findOne({ _id: productId });

        if (!productData) {
          // Product with the provided ID does not exist
          return null;
        }

        const { _id } = product;
        return { ...productData._doc, selectedSize, quantity, cartId: _id };
      })
    );

    // Calculate the total price

    const totalPrice = productDetails.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    res.status(200).json({ products: productDetails, totalPrice });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put(
  '/products/:userId/:productId',
  verifyTokenAuth,
  async (req, res) => {
    const { productId } = req.params;
    const { quantity, selectedSize } = req.body;
    console.log(req.body);

    try {
      const userId = req.user.userId;
      const cart = await CartModel.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const product = cart.products.find(
        (product) => product._id.toString() === productId
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      product.quantity = quantity;
      product.selectedSize = selectedSize;

      await cart.save();

      res
        .status(200)
        .json({ message: 'Cart item updated successfully', product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);
router.delete('/products/:userId/:id', verifyTokenAuth, async (req, res) => {
  const { id, userId } = req.params; // Get the cart item ID and user ID from the request parameters

  try {
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      // Cart does not exist for the user
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartProducts = cart.products;

    // Find the index of the cart item with the provided ID
    const itemIndex = cartProducts.findIndex((product) => {
      return product._id.toString() === id;
    });

    if (itemIndex === -1) {
      // Cart item with the provided ID does not exist
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Remove the cart item from the cart products array
    cartProducts.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/products/:userId', verifyTokenAuth, async (req, res) => {
  const userId = req.user.userId; // Get the user ID from the authenticated user

  try {
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      // Cart does not exist for the user
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear the products array in the cart
    cart.products = [];

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'All products deleted from cart' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
