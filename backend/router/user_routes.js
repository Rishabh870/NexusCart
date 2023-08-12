const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {
  verifyTokenAuth,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const UserModel = mongoose.model("UserModel");
const CartModel = mongoose.model("CartModel");

router.post("/signup", (req, res) => {
  const { fullName, email, mobileNumber, password, isAdmin } = req.body;
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (userInDB) {
        return res.status(409).json({ error: "User Already Exist" });
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
                    result: "User Signed up Successfully!",
                    ...userObject,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
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

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(404).json({ error: "User not found" });
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
              .json({ message: "Login successful", ...userDetails, token });
          } else {
            res.status(401).json({ error: "Invalid password" });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

// Define the update method
const updatePasswordByEmail = async (email, newPassword) => {
  try {
    const hashedPassword = await bcryptjs.hash(newPassword, 16);
    const updatedUser = await UserModel.findOneAndUpdate(
      { email }, // Find the user by email
      { password: hashedPassword }, // Update the password
      { new: true } // Return the updated user
    );
    return updatedUser;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating password");
  }
};

// Use the updatePasswordByEmail method in your router
router.put("/updatePassword", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  try {
    const updatedUser = await updatePasswordByEmail(email, password);
    if (updatedUser) {
      res.status(200).json("user pass reseted");
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// verification
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testworking760@gmail.com",
    pass: "kmnmhwjcarusalyk",
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const verificationCode = {};

router.post("/send-verification-code", async (req, res) => {
  const { email } = req.body;
  const code = generateOTP();
  verificationCode[email] = code;
  const mailOption = {
    from: "moses87@ethereal.email",
    to: email,
    subject: "Email Verification Code",
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      // console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent" });
    }
  });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  // console.log(email, otp, verificationCode[email]);
  if (verificationCode[email] === parseInt(otp)) {
    res.status(200).json({ message: "OTP verified" });
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
});

// GET route to retrieve user data by userId
router.get("/:userId", verifyTokenAuth, (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// PUT route to update user data by userId
router.put("/:userId", verifyTokenAuth, async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, mobileNumber, password, isAdmin } = req.body;
  // Create an object to store the fields that need to be updated
  const updatedFields = {};

  // If the fields are provided in the request body, add them to the updatedFields object
  if (fullName) {
    updatedFields.fullName = fullName;
  }

  if (email) {
    updatedFields.email = email;
  }

  if (mobileNumber) {
    updatedFields.mobileNumber = mobileNumber;
  }

  // If a new password is provided, encrypt it before saving
  if (password) {
    try {
      const hashedPassword = await bcryptjs.hash(password, 16);
      updatedFields.password = hashedPassword;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error hashing the password" });
    }
  }

  if (isAdmin !== undefined) {
    updatedFields.isAdmin = isAdmin;
  }

  // console.log(updatedFields);

  UserModel.findByIdAndUpdate(userId, updatedFields, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// DELETE route to delete a user
router.delete("/users/:userId", verifyTokenAdmin, (req, res) => {
  const userId = req.params.userId;

  UserModel.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

// GET route to retrieve all users
router.get("/users/all", verifyTokenAdmin, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
