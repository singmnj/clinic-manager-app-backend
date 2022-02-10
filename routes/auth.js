const express = require('express');
const authController = require('../controllers/authController');

var router = express.Router();

router.post('/api/auth/login', authController.handleLogin);

module.exports = router;