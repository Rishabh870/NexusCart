const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  verifyTokenAuth,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const OrderModel = mongoose.model("OrderModel");

// Route to add an order for a specific user
router.post("/addorder/:userId", verifyTokenAuth, (req, res) => {
  // Extract data from the request body
  const { userId, cartProduct, formattedTotalPrice, deliveryData } = req.body;
  const delivery = "No";
  const paid = "No";
  // console.log(cartProduct);

  // Create an array of orders containing the provided data
  const orders = [
    {
      delivery,
      paid,
      total: formattedTotalPrice,
      address: deliveryData,
      products: cartProduct.map((product) => ({
        productId: product._id,
        selectedSize: product.selectedSize,
        quantity: product.quantity,
        price: product.price,
      })),
    },
  ];

  // Validate that userId and orders are present in the request body
  if (!userId || !orders || !Array.isArray(orders)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // Find the existing order for the user or create a new one
  OrderModel.findOne({ userId })
    .then((order) => {
      if (order) {
        // Order exists for the user, add new orders to the array
        order.orders.push(...orders);

        order
          .save()
          .then(() => {
            res.status(201).json({
              orders: order.orders[order.orders.length - 1],
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
          });
      } else {
        // Order doesn't exist for the user, create a new order with the provided orders
        const newOrder = new OrderModel({
          userId,
          orders,
        });

        // console.log(newOrder.orders[0]);

        newOrder
          .save()
          .then((savedOrder) => {
            res.status(201).json({
              orders: savedOrder.orders[savedOrder.orders.length - 1],
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "Internal server error x" });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Route to get orders for a specific user
router.get("/orders/:userId", verifyTokenAuth, (req, res) => {
  const userId = req.params.userId;

  // Find the order for the user
  OrderModel.findOne({ userId })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "No orders found" });
      }

      const orders = order.orders;
      res.status(200).json(orders);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// PUT /order/editorder/:orderId
router.put("/editorder/:orderId/:userId", verifyTokenAuth, (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.params.userId;
  // console.log(orderId, userId);
  const paid = "Yes";

  // Find the main order by its userId
  OrderModel.findOne({ userId })
    .populate("orders.products.productId")
    .then((mainOrder) => {
      if (!mainOrder) {
        return res.status(404).json({ error: "Main order not found" });
      }

      // Find the order with the specific orderId in the orders array
      const order = mainOrder.orders.find((o) => o._id.toString() === orderId);
      // console.log(order);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      order.paid = paid;
      // Save the main order with the updated 'paid' field
      mainOrder
        .save()
        .then(() => {
          res.status(200).json({
            mainOrder,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Get an order by orderId
router.get("/getorder/:orderId/:userId", verifyTokenAuth, (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.params.userId;
  // console.log(userId, orderId);
  // Find the main order by its userId
  OrderModel.findOne({ userId })
    .populate("orders.products.productId")
    .then((mainOrder) => {
      if (!mainOrder) {
        return res.status(404).json({ error: "Main order not found" });
      }

      // Find the order with the specific orderId in the orders array
      const order = mainOrder.orders.find((o) => o._id.toString() === orderId);
      // console.log(order);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(order);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("/all", verifyTokenAuth, (req, res) => {
  OrderModel.find({})
    .populate({ path: "orders.products.productId", model: "ProductModel" })
    .then((orders) => {
      // Extract the 'orders' array from each document and merge them into a single array
      const allOrders = orders.reduce((accumulator, currentOrder) => {
        accumulator.push(...currentOrder.orders);
        return accumulator;
      }, []);

      res.status(200).json(allOrders);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.delete("/delete/:orderId/:userId", verifyTokenAuth, async (req, res) => {
  const { orderId, userId } = req.params; // Get the order ID and user ID from the request parameters

  try {
    // Find the user's order using the userId
    const order = await OrderModel.findOne({ userId });

    if (!order) {
      // Order does not exist for the user
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the index of the order with the provided ID in the "orders" array
    const orderIndex = order.orders.findIndex((orderItem) => {
      return orderItem._id.toString() === orderId;
    });

    if (orderIndex === -1) {
      // Order with the provided ID does not exist
      return res.status(404).json({ message: "Order not found" });
    }

    // Remove the order from the "orders" array
    order.orders.splice(orderIndex, 1);

    // Save the updated order
    await order.save();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/orders", verifyTokenAuth, async (req, res) => {
  try {
    // Fetch all orders from the "orders" collection
    const orders = await OrderModel.find().populate("userId");

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
