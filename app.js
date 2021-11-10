const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskCommentRoutes = require("./routes/taskCommentRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

// Middleware Setup
app.use(express.json());

// Running server
app.listen(process.env.PORT, () =>
  console.log(
    `Express server running on port ${process.env.PORT}`
  )
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connection established."))
  .catch((err) => console.log(`Error establishing DB connection: ${err}`));

// TODO: Setup basic user auth and account creation
// TODO: Enable compression of responses

// User Routes
app.use(userRoutes);

// Task Routes
app.use(taskRoutes);

// Project Routes
app.use(projectRoutes);

// TaskComment Routes
app.use(taskCommentRoutes);

// Authentication Routes
app.use(authRoutes);
