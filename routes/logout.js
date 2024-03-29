const express = require("express");
const logoutController = require("../controllers/logoutController");

const router = express.Router();

router.get("/api/auth/logout", logoutController.handleLogout);

module.exports = router;
