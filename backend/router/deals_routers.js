const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyTokenAdmin } = require('../middleware/verifyToken');
const DealModel = mongoose.model('DealModel');

// Add a deal
router.post('/adddeals', verifyTokenAdmin, (req, res) => {
  const deals = req.body;

  DealModel.insertMany(deals)
    .then(() => {
      res.status(201).json({ result: 'Deals added successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get all deals
router.get('/alldeals', (req, res) => {
  DealModel.find()
    .then((deals) => {
      res.status(200).json({ deals });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Delete a deal
router.delete('/deletedeals/:id', verifyTokenAdmin, (req, res) => {
  const dealId = req.params.id;

  DealModel.deleteOne({ _id: dealId })
    .then(() => {
      res.status(200).json({ result: 'Deal deleted successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
