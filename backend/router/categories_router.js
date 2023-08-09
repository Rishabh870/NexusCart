const express = require("express");
const router = express.Router();
const { CategoryModel } = require("../models/category_model");

// Endpoint to add categories via POST request
router.post("/add", async (req, res) => {
  try {
    const categoriesToAdd = req.body; // Array of category objects
    console.log(req.body); // Log the received request body

    const addedCategories = [];

    // Loop through each category object to add to the database
    for (const categoryData of categoriesToAdd) {
      const { name } = categoryData; // Extract the category name from the object

      // Check if the category already exists in the database
      const existingCategory = await CategoryModel.findOne({ name });
      if (existingCategory) {
        console.log(`Category '${name}' already exists. Skipping...`);
        continue; // Skip to the next iteration if category exists
      }

      // If the category does not exist, create and add it to the database
      const category = await CategoryModel.create({ name });
      addedCategories.push(category);
    }

    // Respond with the added categories and a 201 status code
    res.status(201).json(addedCategories);
  } catch (error) {
    console.log(error); // Log any errors that occur
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a 500 status code and an error message
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
