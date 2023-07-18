const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const verifyToken = (req, res, next) => {
  const authorization = req.headers.token;
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(404).json('Not Valid Token');
      }
      req.user = user;

      next();
    });
  } else {
    return res.status(401).json('You Are Not Authorize');
  }
};
const verifyTokenAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userId === req.params.userId || req.user.isAdmin) {
      // if (req.user.userId === req.params.userId) {
      next();
    } else {
      return res.status(401).json('You Are Not Allowed');
    }
  });
};
const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(401).json('You Are Not Allowed');
    }
  });
};

module.exports = { verifyToken, verifyTokenAdmin, verifyTokenAuth };
