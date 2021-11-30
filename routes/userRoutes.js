const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authorization = require("../middleware/authorization");
// eslint-disable-next-line no-unused-vars
const { Roles, Permissions } = require("../utils/constants");

// User routes
// Read all users
router.get("/users/", userController.getAllUsers);

// Read a specific user
router.get(
  "/users/:id",
  authorization({ role: Roles.User }),
  userController.getUser
);

// Create a new user
router.post("/users", userController.createUser);

// Delete a user
router.delete("/users/:id", userController.deleteUser);

// Update a user document
router.put("/users/:id", userController.updateUser);

module.exports = router;
