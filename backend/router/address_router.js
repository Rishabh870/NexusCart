// Import necessary modules and dependencies
const express = require("express");
const router = express.Router();
const { verifyTokenAuth } = require("../middleware/verifyToken");
const AddressModel = require("../models/address_model");

// Route to add or update a user's address
router.post("/addaddress/:userId", verifyTokenAuth, async (req, res) => {
  try {
    // Destructure address information from the request body
    const {
      fullName,
      mobileNumber,
      pincode,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
    } = req.body;

    // Get the user ID from the authenticated user's request
    const userId = req.user.userId;
    // console.log(userId); // Log the user ID

    // Check if the address already exists for the user
    const existingAddress = await AddressModel.findOne({ userId });

    if (existingAddress) {
      // Update the existing address
      const updatedAddress = await AddressModel.findByIdAndUpdate(
        existingAddress._id,
        {
          fullName,
          mobileNumber,
          pincode,
          addressLine1,
          addressLine2,
          landmark,
          city,
          state,
        },
        { new: true } // Return the updated document
      );

      // Send response for address update
      res.json({
        message: "Address updated successfully",
        address: updatedAddress,
      });
    } else {
      // Create a new address if it doesn't exist
      const newAddress = new AddressModel({
        userId: userId,
        fullName,
        mobileNumber,
        pincode,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
      });

      // Save the new address to the database
      const savedAddress = await newAddress.save();

      // Send response for new address creation
      res.json({
        message: "Address added successfully",
        address: savedAddress,
      });
    }
  } catch (error) {
    console.error(error); // Log any errors
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
});

// Route to get address details for a user
router.get("/address/:userId", verifyTokenAuth, (req, res) => {
  // Extract the user ID from the authenticated request
  const userId = req.user.userId;

  // Find the address associated with the user ID
  AddressModel.findOne({ userId })
    .then((address) => {
      // If address not found, return a 404 response
      if (!address) {
        res.status(404).json({ message: "Address not found" });
      } else {
        // Extract address details
        const {
          addressLine1,
          addressLine2,
          city,
          fullName,
          landmark,
          mobileNumber,
          pincode,
          state,
        } = address;

        // Create formatted strings for delivery information
        const deliveryTo = `${fullName}, ${mobileNumber}`;
        const deliveryAddress = `${addressLine1}, ${addressLine2}, ${landmark}, ${city}, ${state}, ${pincode}`;

        // Return delivery details in a JSON response
        res.status(200).json({
          deliveryTo,
          deliveryAddress,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      // Handle server error with a 500 response
      res.status(500).json({ error: "Internal server error" });
    });
});

// Export the router for use in other parts of the application
module.exports = router;
