const express = require("express");
const mongoose = require("mongoose");
const models = require("./models/models");

require("dotenv").config();

const app = express();

// Middleware Setup
app.use(express.json());

// Running server
app.listen(process.env.PORT, () =>
  console.log(`Express server running on port ${process.env.PORT}`)
);

// TODO: Setup Mongoose
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connection established."))
  .catch((err) => console.log(`Error establishing DB connection: ${err}`));

// TODO: Create basic CRUD routes
// TODO: Setup basic user auth and account creation

// Routes, to be moved to a separate file later on
app.get("/", (req, res) => {
  res.status(200);
});

// Read all users
app.get("/users", async (req, res) => {
  try {
    // TODO: check if document exists first
    const users = await models.User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(403).send(e);
  }
});

// Read a specific user
app.get("/users/:id", async (req, res) => {
  try {
    // TODO: check if document exists first
    const user = await models.User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    console.log(`Error reading user: ${e}`);
    res.status(404).send()
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    // TODO validation on request body
    await models.User.create(req.body);
    res.status(200).send();
  } catch (e) {
    // TODO: correct http error code
    res.status(400).send();
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    // TODO check if document with id exists before attempting deletion
    // TODO Possibly switch to findByIDandDelete
    models.User.deleteOne({ _id: req.params.id }, (err) => {
      if (err) throw err;
    });
    res.status(200).send();
  } catch (e) {
    console.log(`Error deleting user: ${e}`);
  }
});

// Update a user document
app.put("/users/:id", async (req, res) => {
  try {
    // TODO: Check if document exists before updating
    // TODO: Possibly switch to findByIDandUpdate
    models.User.updateOne({ _id: req.params.id }, req.body, (err) => {
      if (err) throw err;
    });
    res.status(200).send()
  } catch (e) {
    console.log(`Error updating user: ${e}`);
    res.status(404).send();
  }
});
