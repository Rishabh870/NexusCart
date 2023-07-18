// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { CategoryModel } = require('../models/category_model');

router.post('/add', async (req, res) => {
  try {
    const categoriesToAdd = req.body; // Array of category objects

    const addedCategories = [];

    for (const categoryData of categoriesToAdd) {
      const { name } = categoryData;

      // Check if the category already exists
      const existingCategory = await CategoryModel.findOne({ name });
      if (existingCategory) {
        console.log(`Category '${name}' already exists. Skipping...`);
        continue; // Skip to the next iteration if category exists
      }

      // If the category does not exist, create and add it to the database
      const category = await CategoryModel.create({ name });
      addedCategories.push(category);
    }

    res.status(201).json(addedCategories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
