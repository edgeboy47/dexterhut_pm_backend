const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User routes
// Read all users
router.get("/users/", userController.getAllUsers);

// Read a specific user
router.get("/users/:id", userController.getUser);

// Create a new user
router.post("/users", userController.createUser);

// Delete a user
router.delete("/users/:id", userController.deleteUser);

// Update a user document
router.put("/users/:id", userController.updateUser);

module.exports = router;
