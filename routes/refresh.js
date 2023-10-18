const express = require("express");
const refreshTokenController = require("../controllers/refreshTokenController");

const router = express.Router();

router.get("/api/auth/refresh", refreshTokenController.handleRefreshToken);

module.exports = router;
