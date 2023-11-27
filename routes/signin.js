// routes/signin.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route đến trang đăng nhập
router.get('/signin', authController.showSignInForm);

// Xử lý đăng nhập khi submit form
router.post('/signin', authController.signIn);

module.exports = router;