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
  verifyTokenAdmin,
  upload.array("myImages", 4),
  (req, res) => {
    // Assuming your product model is imported as ProductModel
    const newProduct = new ProductModel(req.body);
    console.log(req.body);

    // If there are uploaded files, you can access them through req.files array
    if (req.files) {
      const images = req.files.map((file) => file.destination + file.filename);
      newProduct.img = images; // Assuming you have an "images" field in your product schema to store the image paths
    }

    newProduct
      .save()
      .then((newProduct) => {
        res.status(201).json({ result: "Product added successfully" });
      })
      .catch((error) => {
        console.log(error);
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
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("/products", async (req, res) => {
  const searchQuery = req.query.searchQuery;
  const categories = req.query.category;
  const brands = req.query.brand;

  try {
    let query = {};

    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    if (brands) {
      query.brandName = { $in: brands.map((brand) => new RegExp(brand, "i")) };
    }

    if (categories) {
      query.category = {
        $in: categories.map((category) => new RegExp(category, "i")),
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update the review number of the product using productId
router.put("/updatereview/:id", async (req, res) => {
  const productId = req.params.id;
  const totalReview = req.body.total; // Assuming the new review number is passed in the request body
  const averageRating = req.body.averageRating; // Assuming the new review number is passed in the request body
  console.log(totalReview, averageRating);
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
      res.status(404).json({ message: "Product not found" });
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
        return res.status(404).json({ message: "Product not found" });
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
    console.log(req.body);
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
        return res.status(404).json({ message: "Product not found" });
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
