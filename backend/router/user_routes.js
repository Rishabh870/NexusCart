const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { verifyTokenAuth, verifyTokenAdmin } = require('../middleware/verifyToken');
const UserModel = mongoose.model('UserModel');
const CartModel = mongoose.model('CartModel');

router.post('/signup', (req, res) => {
  const { fullName, email, mobileNumber, password, isAdmin } = req.body;
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (userInDB) {
        return res.status(409).json({ error: 'User Already Exist' });
      }
      bcryptjs
        .hash(password, 16)
        .then((hashedPassword) => {
          const user = new UserModel({
            fullName,
            email,
            mobileNumber,
            password: hashedPassword,
            isAdmin,
          });
          user
            .save()
            .then((newUser) => {
              const token = jwt.sign(
                { userId: user._id, isAdmin: user.isAdmin },
                JWT_SECRET // Replace JWT_SECRET with your own secret key for signing the token
              );

              const cart = new CartModel({ userId: newUser._id, products: [] });
              cart
                .save()
                .then(() => {
                  // Create the user object with the user details
                  const userObject = {
                    _id: newUser._id,
                    name: newUser.fullName,
                    email: newUser.email,
                    mobileNumber: newUser.mobileNumber,
                    isAdmin: newUser.isAdmin,
                    token: token,
                  };

                  // Send the response with the user details
                  return res.status(201).json({
                    result: 'User Signed up Successfully!',
                    ...userObject,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ error: 'Internal Server Error' });
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(404).json({ error: 'User not found' });
      }

      bcryptjs
        .compare(password, userInDB.password)
        .then((isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              { userId: userInDB._id, isAdmin: userInDB.isAdmin },
              JWT_SECRET
            );
            const { password, ...userDetails } = userInDB._doc;
            res
              .status(200)
              .json({ message: 'Login successful', ...userDetails, token });
          } else {
            res.status(401).json({ error: 'Invalid password' });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    });
});

// GET route to retrieve user data by userId
router.get('/:userId', verifyTokenAuth, (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// PUT route to update user data by userId
router.put('/:userId',verifyTokenAdmin, async (req, res) => {
  const { userId } = req.params;
  const { data } = req.body;

  // If a new password is provided, encrypt it before saving
  if (data.password) {
    const hashedPassword = await bcryptjs.hash(data.password, 16);
    data.password = hashedPassword;
  }

  console.log(data);
  UserModel.findByIdAndUpdate(userId, data, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// DELETE route to delete a user
router.delete('/users/:userId', verifyTokenAdmin, (req, res) => {
  const userId = req.params.userId;

  UserModel.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    });
});

// GET route to retrieve all users
router.get('/users/all', verifyTokenAdmin, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
