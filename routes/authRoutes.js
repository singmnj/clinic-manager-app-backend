const express = require('express');
const authController = require('../controllers/authController');

var authRouter = express.Router();

authRouter.post('/api/auth/login', authController.login);
authRouter.post('/api/auth/register', authController.register);
authRouter.post('/api/auth/user', authController.getUser);

module.exports = authRouter;