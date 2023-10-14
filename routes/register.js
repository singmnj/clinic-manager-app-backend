const express = require('express');
const registerController = require('../controllers/registerController');

const router = express.Router();

router.post('/api/auth/register', registerController.register);

module.exports = router;