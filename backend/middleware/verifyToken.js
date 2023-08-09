// Import required modules
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Middleware to verify the token in the request headers
const verifyToken = (req, res, next) => {
  // Extract token from the 'token' header
  const authorization = req.headers.token;
  if (authorization) {
    // Split the 'Bearer <token>' format to get just the token
    const token = authorization.split(" ")[1];
    // Log the authorization token for debugging purposes
    console.log(`Auth ${authorization}`);

    // Verify the token using the secret key
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        // If token verification fails, respond with an error
        return res.status(404).json("Not Valid Token");
      }
      // Attach the verified user information to the request object
      req.user = user;

      // Move to the next middleware
      next();
    });
  } else {
    // If token is missing, respond with an unauthorized status
    return res.status(401).json("You Are Not Authorized");
  }
};

// Middleware to verify token and user ID for authorization
const verifyTokenAuth = (req, res, next) => {
  // Call the verifyToken middleware to check the token first
  verifyToken(req, res, () => {
    // Check if the authenticated user matches the requested user ID or is an admin
    if (req.user.userId === req.params.userId || req.user.isAdmin) {
      // If authorized, move to the next middleware
      next();
    } else {
      // If not authorized, respond with an error
      return res.status(401).json("You Are Not Allowed");
    }
  });
};

// Middleware to verify token and admin status for authorization
const verifyTokenAdmin = (req, res, next) => {
  // Call the verifyToken middleware to check the token first
  verifyToken(req, res, () => {
    // Check if the authenticated user is an admin
    if (req.user.isAdmin) {
      // If authorized as an admin, move to the next middleware
      next();
    } else {
      // If not authorized as an admin, respond with an error
      return res.status(401).json("You Are Not Allowed");
    }
  });
};

// Export the middleware functions
module.exports = { verifyToken, verifyTokenAdmin, verifyTokenAuth };
