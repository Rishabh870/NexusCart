const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  verifyTokenAdmin,
  verifyTokenAuth,
} = require("../middleware/verifyToken");
const ProductModel = mongoose.model("ProductModel");
const upload = require("../multer");

router.post(
  "/addproduct",
  verifyTokenAdmin, // Middleware to verify admin token
  upload.array("myImages", 4), // Multer middleware for handling image uploads
  (req, res) => {
    // Create a new product instance using the request body
    const newProduct = new ProductModel(req.body);

    // Check if there are uploaded files (images)
    if (req.files) {
      // Extract image paths from uploaded files and store in 'images' array
      const images = req.files.map((file) => file.path);
      newProduct.img = images; // Assign image paths to the 'img' field in the product schema
    }

    // Save the new product to the database
    newProduct
      .save()
      .then((newProduct) => {
        res.status(201).json({ result: "Product added successfully" });
      })
      .catch((error) => {
        console.log(error); // Log any errors for debugging
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.post("/imagesupload", upload.array("myImages", 4), (req, res) => {
  // Check if files were uploaded and saved successfully
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No image files uploaded" });
  }

  // The 'req.files' is an array of uploaded files
  const imagePaths = req.files.map((file) => file.path);

  // Send the array of image paths and file names as a response
  res.status(200).json({ imagePaths });
});

router.get("/product/:id", (req, res) => {
  const productId = req.params.id;

  // Find the product by ID and handle the response
  ProductModel.findById(productId)
    .then((product) => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Define a route to handle GET requests for fetching products
router.get("/products", async (req, res) => {
  // Extract query parameters from the request
  const searchQuery = req.query.searchQuery;
  const categories = req.query.category;
  const brands = req.query.brand;

  try {
    // Initialize an empty query object to build the MongoDB query
    let query = {};

    // Check if a search query parameter is provided
    if (searchQuery) {
      // Build a text search query using the provided search query
      query.$text = { $search: searchQuery };
    }

    // Check if brand filter parameters are provided
    if (brands) {
      // Create a regex pattern for each brand and match case-insensitively
      query.brandName = { $in: brands.map((brand) => new RegExp(brand, "i")) };
    }

    // Check if category filter parameters are provided
    if (categories) {
      // Create a regex pattern for each category and match case-insensitively
      query.category = {
        $in: categories.map((category) => new RegExp(category, "i")),
      };
    }

    let products;

    // Check if there are any query parameters
    if (Object.keys(query).length === 0) {
      // If no query parameters, return all products
      products = await ProductModel.find();
    } else {
      // Otherwise, perform the search with filters
      products = await ProductModel.find(query);
    }

    // Respond with the fetched products in JSON format
    res.status(200).json(products);
  } catch (error) {
    // Handle errors by logging them and sending an internal server error response
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update the review number of the product using productId
router.put("/updatereview/:id", async (req, res) => {
  const productId = req.params.id;
  const totalReview = req.body.total; // Assuming the new review number is passed in the request body
  const averageRating = req.body.averageRating; // Assuming the new review number is passed in the request body

  try {
    // Find the product by ID and update the review number
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { total: totalReview, averageRating: averageRating },
      { new: true }
    );

    if (product) {
      res.status(200).json({ message: "Product review updated successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a product by ID
router.delete("/products/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    try {
      // Find the product by its ID and delete it
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/products/:productId",
  verifyTokenAdmin,

  async (req, res) => {
    const productId = req.params.productId;
    const {
      productName,
      brandName,
      img,
      desc,
      price,
      inStock,
      sizes,
      category,
    } = req.body;

    try {
      // Find the product by its ID and update its fields
      const product = await ProductModel.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Update product fields other than images
      product.productName = productName;
      product.brandName = brandName;
      product.desc = desc;
      product.price = price;
      product.img = img;
      product.inStock = inStock;
      product.sizes = sizes;
      product.category = category;

      // If there are uploaded files, update the images field
      if (req.files) {
        const images = req.files.map((file) => file.path);
        product.img = images;
      }

      // Save the updated product
      const updatedProduct = await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
