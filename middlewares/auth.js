const jwt = require('jsonwebtoken');


const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticate;

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
