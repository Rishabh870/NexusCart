const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { verifyTokenAuth } = require("../middleware/verifyToken");
const ReviewModel = mongoose.model("ReviewModel");
const ProductModel = mongoose.model("ProductModel");
const UserModel = mongoose.model("UserModel");

// Add a new review for a product
router.post("/addreview/:productId", async (req, res) => {
  try {
    const { stars, review, userId } = req.body;
    const productId = req.params.productId;

    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const reviewToAdd = { stars, review, userId };
    await ReviewModel.updateOne(
      { productId },
      { $push: { reviews: reviewToAdd } },
      { upsert: true } // Create the document if it doesn't exist
    );

    // Calculate average rating and update the ProductModel
    const updatedReviews = await ReviewModel.findOne({ productId }).lean();
    const totalReviews = updatedReviews.reviews.length;
    const totalStars = updatedReviews.reviews.reduce(
      (acc, review) => acc + review.stars,
      0
    );
    const averageRating = totalStars / totalReviews;

    await ProductModel.findByIdAndUpdate(productId, {
      averageRating: averageRating.toFixed(1),
      total: totalReviews,
    });

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all reviews for a product
router.get("/getreviews/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const reviews = await ReviewModel.find({ productId: productId })
      .populate("reviews.userId", "fullName")
      .select("reviews");

    console.log(reviews);

    res.status(200).json(reviews[0].reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
