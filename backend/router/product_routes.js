const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  verifyTokenAdmin,
  verifyTokenAuth,
} = require('../middleware/verifyToken');
const ProductModel = mongoose.model('ProductModel');

router.post('/addproduct', verifyTokenAdmin, (req, res) => {
  const newProduct = new ProductModel(req.body);

  newProduct
    .save()
    .then((newProduct) => {
      res.status(201).json({ result: 'Product added successfully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// router.get('/allproducts', (req, res) => {
//   ProductModel.find()
//     .then((products) => {
//       res.status(200).json(products);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });

router.get('/product/:id', (req, res) => {
  const productId = req.params.id;

  // Find the product by ID and handle the response
  ProductModel.findById(productId)
    .then((product) => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// router.get('/search', async (req, res) => {
//   const searchQuery = req.query.searchQuery;
//   const filters = req.query.filters;

//   try {
//     let query = {
//       $text: { $search: `"${searchQuery}"` },
//     };

//     // Apply filters to the search query if filters are provided
//     if (filters) {
//       const parsedFilters = JSON.parse(filters);
//       Object.keys(parsedFilters).forEach((filterKey) => {
//         query[filterKey] = { $in: parsedFilters[filterKey] };
//       });
//     }

//     // Perform the search logic based on the search query and filters
//     const products = await ProductModel.find(query);

//     res.status(200).json(products);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get('/search', async (req, res) => {
//   const searchQuery = req.query.searchQuery;
//   const categories = req.query.category;
//   const brands = req.query.brand;

//   console.log(searchQuery, categories, brands);

//   try {
//     let query = {};

//     if (searchQuery) {
//       query.$text = { $search: searchQuery };
//     }

//     if (brands) {
//       query.brandName = { $in: brands.map((brand) => new RegExp(brand, 'i')) };
//     }
//     if (categories) {
//       query.category = {
//         $in: categories.map((category) => new RegExp(category, 'i')),
//       };
//     }
//     const products = await ProductModel.find(query);
//     res.status(200).json(products);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/products', async (req, res) => {
  const searchQuery = req.query.searchQuery;
  const categories = req.query.category;
  const brands = req.query.brand;

  console.log(searchQuery, categories, brands);

  try {
    let query = {};

    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    if (brands) {
      query.brandName = { $in: brands.map((brand) => new RegExp(brand, 'i')) };
    }

    if (categories) {
      query.category = {
        $in: categories.map((category) => new RegExp(category, 'i')),
      };
    }

    let products;

    if (Object.keys(query).length === 0) {
      // If no query parameters, return all products
      products = await ProductModel.find();
    } else {
      // Otherwise, perform the search with filters
      products = await ProductModel.find(query);
    }

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update the review number of the product using productId
router.put('/updatereview/:id', async (req, res) => {
  const productId = req.params.id;
  const newReview = req.body.review; // Assuming the new review number is passed in the request body
  console.log(newReview);
  try {
    // Find the product by ID and update the review number
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { review: newReview },
      { new: true }
    );

    if (product) {
      res.status(200).json({ message: 'Product review updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
