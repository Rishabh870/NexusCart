const express = require('express');
const router = express.Router();
const { verifyTokenAuth } = require('../middleware/verifyToken');
const AddressModel = require('../models/address_model');

// Add or update address
router.post('/addaddress/:userId', verifyTokenAuth, (req, res) => {
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

  const newAddress = {
    fullName,
    mobileNumber,
    pincode,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
  };

  const userId = req.user.id;

  AddressModel.findOne({ userId })
    .then((address) => {
      if (address) {
        // Address exists for the user, update the address
        address.set(newAddress);

        address
          .save()
          .then(() => {
            res.status(200).json({ result: 'Address updated successfully' });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
          });
      } else {
        // Address doesn't exist for the user, create a new address
        newAddress.userId = userId;

        AddressModel.create(newAddress)
          .then(() => {
            res.status(201).json({ result: 'Address added successfully' });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get address
router.get('/address/:userId', verifyTokenAuth, (req, res) => {
  const userId = req.user.id;

  AddressModel.findOne({ userId })
    .then((address) => {
      if (!address) {
        res.status(404).json({ message: 'Address not found' });
      } else {
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

        const deliveryTo = `${fullName}, ${mobileNumber}`;
        const deliveryAddress = `${addressLine1}, ${addressLine2}, ${landmark}, ${city},${state}, ${pincode}`;

        res.status(200).json({
          deliveryTo,
          deliveryAddress,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
