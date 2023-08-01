const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyTokenAuth } = require('../middleware/verifyToken');
const OrderModel = mongoose.model('OrderModel');
router.post('/addorder/:userId', verifyTokenAuth, (req, res) => {
  const { userId, cartProduct, formattedTotalPrice, deliveryData } = req.body;
  const delivery = 'No';
  const paid = 'No';
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
      })),
    },
  ];
  // Validate that userId and orders are present in the request body
  if (!userId || !orders || !Array.isArray(orders)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

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
            res.status(500).json({ error: 'Internal server error' });
          });
      } else {
        // Order doesn't exist for the user, create a new order with the provided orders
        const newOrder = new OrderModel({
          userId,
          orders,
        });

        console.log(newOrder.orders[0]);

        newOrder
          .save()
          .then((savedOrder) => {
            res.status(201).json({
              orders: savedOrder.orders[savedOrder.orders.length - 1],
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error x' });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/orders/:userId', verifyTokenAuth, (req, res) => {
  const userId = req.params.userId;

  OrderModel.findOne({ userId })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'No orders found' });
      }

      const orders = order.orders;
      res.status(200).json(orders);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// PUT /order/editorder/:orderId
router.put('/editorder/:orderId/:userId', verifyTokenAuth, (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.params.userId;
  console.log(orderId, userId);
  const paid = 'Yes';

  // Find the order with the specified orderId and update the delivery and paid fields
  // Find the main order by its userId
  OrderModel.findOne({ userId })
    .populate('orders.products.productId')
    .then((mainOrder) => {
      if (!mainOrder) {
        return res.status(404).json({ error: 'Main order not found' });
      }

      // Find the order with the specific orderId in the orders array
      const order = mainOrder.orders.find((o) => o._id.toString() === orderId);
      // console.log(order);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      console.log(order);
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
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get an order by orderId
router.get('/getorder/:orderId/:userId', verifyTokenAuth, (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.params.userId;
  // console.log(userId, orderId);
  // Find the main order by its userId
  OrderModel.findOne({ userId })
    .populate('orders.products.productId')
    .then((mainOrder) => {
      if (!mainOrder) {
        return res.status(404).json({ error: 'Main order not found' });
      }

      // Find the order with the specific orderId in the orders array
      const order = mainOrder.orders.find((o) => o._id.toString() === orderId);
      // console.log(order);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(200).json(order);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
