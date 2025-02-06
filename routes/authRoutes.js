const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Routes for user registration and login
router.post('/register', register);
router.post('/login', login);

module.exports = router;