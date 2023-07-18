// routes/brandRoutes.js
const express = require('express');
const router = express.Router();
const { BrandModel } = require('../models/brand_model');

// Add multiple brands
router.post('/add', async (req, res) => {
  try {
    const brandsToAdd = req.body; // Array of brand objects

    // Filter out duplicates before inserting
    const uniqueBrands = [];
    for (const brand of brandsToAdd) {
      const existingBrand = await BrandModel.findOne({ name: brand.name });
      if (!existingBrand) {
        uniqueBrands.push(brand);
      }
    }

    // Using insertMany to add all unique brands at once
    const addedBrands = await BrandModel.insertMany(uniqueBrands);

    res.status(201).json(addedBrands);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all brands
router.get('/brands', async (req, res) => {
  try {
    const brands = await BrandModel.find();
    res.status(200).json(brands);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
