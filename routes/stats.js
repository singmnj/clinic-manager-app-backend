const express = require('express');
const statsController = require('../controllers/statsController');

var router = express.Router();

router.get('/api/stats', statsController.getStats);

module.exports = router;