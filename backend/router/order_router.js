const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyTokenAuth } = require('../middleware/verifyToken');
const OrderModel = mongoose.model('OrderModel');
router.post('/addorder/:userId', verifyTokenAuth, (req, res) => {
  const { userId, orders } = req.body;

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
            res.status(201).json({ result: 'Orders added successfully' });
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
          .then(() => {
            res.status(201).json({ result: 'Order added successfully' });
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

module.exports = router;
