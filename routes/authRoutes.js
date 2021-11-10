const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// User login
router.post("/login", authController.login);

// User registration
router.post("/register", authController.register);

// test user authorization and protected routes
// TODO: remove when done testing
// router.get("/protected", authController.protected);

module.exports = router;
