const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const { verifyTokenAuth } = require("../middleware/verifyToken");
const CartModel = mongoose.model("CartModel");
const ProductModel = mongoose.model("ProductModel");

// Route to add products to a user's cart
router.post("/addcart/:userId", verifyTokenAuth, async (req, res) => {
  const { products } = req.body;
  const userId = req.params.userId;
  // console.log(req.user); // Log the authenticated user

  // Find the cart for the specified user
  CartModel.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        // If the cart doesn't exist for the user, create a new cart and add the product
        const newCart = new CartModel({ userId, ...req.body });

        newCart
          .save()
          .then(() => {
            // Find the added product and send it as a response
            ProductModel.findById(`${req.body.products[0].productId}`)
              .then((product) => {
                res.status(201).json({
                  products: { ...product._doc, ...req.body.products[0] },
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: "Internal Server Error z" });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error z" });
          });
      } else {
        // If the cart exists for the user, push the new product to the products array
        cart.products.push(...products);
        cart
          .save()
          .then(() => {
            // Find the added product and send it along with cart information as a response
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
                res.status(500).json({ error: "Internal server error" });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error y" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error x" });
    });
});

// Route to retrieve products from the cart for a specific user
router.get("/products/:userId", verifyTokenAuth, async (req, res) => {
  // Extract the user ID from the authenticated request
  const userId = req.user.userId;
  try {
    // Find the cart associated with the user
    const cart = await CartModel.findOne({ userId });
    // console.log(userId);

    // If cart doesn't exist, return a 404 error
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Extract the products array from the cart
    const cartProducts = cart.products;

    // Retrieve details for each product in the cart
    const productDetails = await Promise.all(
      cartProducts.map(async (product) => {
        // Extract product information from the cart
        const { productId, selectedSize, quantity } = product;

        // Find product details using the product ID
        const productData = await ProductModel.findOne({ _id: productId });

        // If product doesn't exist, return null
        if (!productData) {
          return null;
        }

        // Extract necessary details from the product and add cart ID
        const { _id } = product;
        return { ...productData._doc, selectedSize, quantity, cartId: _id };
      })
    );

    // Calculate the total price of all products in the cart
    const totalPrice = productDetails.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    // Respond with product details and total price
    res.status(200).json({ products: productDetails, totalPrice });
  } catch (err) {
    // Handle errors and send a 500 error response
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a product in the user's cart
router.put(
  "/products/:userId/:productId",
  verifyTokenAuth, // Middleware to verify token and authentication
  async (req, res) => {
    const { productId } = req.params; // Get productId from URL params
    const { quantity, selectedSize } = req.body; // Extract quantity and selectedSize from request body
    // console.log(req.body); // Log the request body for debugging

    try {
      const userId = req.user.userId; // Get userId from authenticated user
      const cart = await CartModel.findOne({ userId }); // Find the cart associated with the user

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" }); // Respond with error if cart is not found
      }

      // Find the product in the cart based on productId
      const product = cart.products.find(
        (product) => product._id.toString() === productId
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found in cart" }); // Respond with error if product is not found in the cart
      }

      // Update product quantity and selected size
      product.quantity = quantity;
      product.selectedSize = selectedSize;

      await cart.save(); // Save the updated cart

      // Respond with success message and the updated product
      res
        .status(200)
        .json({ message: "Cart item updated successfully", product });
    } catch (error) {
      console.log(error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error" }); // Respond with internal server error
    }
  }
);

// Route to delete a item from a user's cart
router.delete("/products/:userId/:id", verifyTokenAuth, async (req, res) => {
  // Extract the cart item ID and user ID from the request parameters
  const { id, userId } = req.params;

  try {
    // Find the cart associated with the user
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      // If cart does not exist for the user, return a 404 error
      return res.status(404).json({ error: "Cart not found" });
    }

    // Get the array of products in the cart
    const cartProducts = cart.products;

    // Find the index of the cart item with the provided ID
    const itemIndex = cartProducts.findIndex((product) => {
      return product._id.toString() === id;
    });

    if (itemIndex === -1) {
      // If cart item with the provided ID does not exist, return a 404 error
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Remove the cart item from the cart products array
    cartProducts.splice(itemIndex, 1);

    // Save the updated cart after removing the item
    await cart.save();

    // Respond with a success message
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (err) {
    // Handle any errors that occur during the process
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete all products from a user's cart
router.delete("/products/:userId", verifyTokenAuth, async (req, res) => {
  const userId = req.user.userId; // Get the user ID from the authenticated user

  try {
    // Find the cart associated with the user ID
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      // If cart doesn't exist for the user, return a 404 response
      return res.status(404).json({ error: "Cart not found" });
    }

    // Clear the products array in the cart
    cart.products = [];

    // Save the updated cart with empty products array
    await cart.save();

    // Respond with a success message
    res.status(200).json({ message: "All products deleted from cart" });
  } catch (err) {
    // If an error occurs, log it and return a 500 response
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
