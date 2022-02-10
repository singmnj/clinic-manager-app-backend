const express = require('express');
const registerController = require('../controllers/registerController');

var router = express.Router();

router.post('/api/auth/register', registerController.register);

module.exports = router;