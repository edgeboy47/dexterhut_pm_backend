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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connection established."))
  .catch((err) => console.log(`Error establishing DB connection: ${err}`));

// TODO: Create basic CRUD routes
// TODO: Setup basic user auth and account creation
// TODO: Enable compression of responses

// Routes, to be moved to a separate file later on
app.get("/", (req, res) => {
  res.status(200);
});

// User routes
// Read all users
app.get("/users", async (req, res) => {
  try {
    const users = await models.User.find();
    res.status(200).json(users);
  } catch (e) {
    console.log(`Error reading all users: ${e}`);
    res.status(404).end();
  }
});

// Read a specific user
app.get("/users/:id", async (req, res) => {
  try {
    const user = await models.User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    console.log(`Error reading user: ${e}`);
    res.status(404).end();
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    // TODO validation on request body
    const user = await models.User.create(req.body);
    res.status(201).set("Location", `${user.id}`).end();
  } catch (e) {
    res.status(404).end();
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await models.User.findByIdAndDelete(id);

    res.status(204).end();
  } catch (e) {
    console.log(`Error deleting user: ${e}`);
    res.status(404).end();
  }
});

// Update a user document
app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    await models.User.findByIdAndUpdate(id, body);
    res.status(200).end();
  } catch (e) {
    console.log(`Error updating user: ${e}`);
    res.status(404).end();
  }
});

// Task Routes

// Get all tasks for user
app.get("/users/:id/tasks", async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await models.User.findById(userID);

    const tasksList = user.tasksList;

    const tasks = await Promise.all(
      tasksList.map(async (task) => {
        return await models.Task.findById(task);
      })
    );

    res.status(200).json(tasks);
  } catch (e) {
    console.log(`Error fetching user's tasks: ${e}`);
    res.status(404).end();
  }
});

// Get all tasks in project
app.get("/projects/:id/tasks", async (req, res) => {
  try {
    const project = models.Project.findById(req.params.id);

    const tasksList = project.tasks;

    const tasks = await Promise.all(
      tasksList.map(async (task) => {
        return await models.Task.findById(task);
      })
    );

    res.status(200).json(tasks);
  } catch (e) {
    console.log(`Error getting tasks in project: ${e}`);
    res.status(404).end();
  }
});

// Create task
app.post("/tasks", async (req, res) => {
  try {
    const task = await models.Task.create(req.body);
    res.status(201).set("Location", `${task.id}`).end();
  } catch (e) {
    console.log(`Error creating task: ${e}`);
    res.status(503).send();
  }
});

// Add task reference to user doc
app.put("/users/:id/tasks/:taskID", async (req, res) => {
  try {
    const user = models.User.findById(req.params.id);
    user.tasksList.push(req.params.taskID);
    user.save();

    res.status(200).end();
  } catch (e) {
    console.log(`Error adding task reference to user document: ${e}`);
    res.status(400).end();
  }
});

app.put("/projects/:id/tasks/:taskID", async (req, res) => {
  try {
    const project = models.Project.findById(req.params.id);

    project.tasks.push(req.params.taskID);
    project.save();

    res.status(200).end();
  } catch (e) {
    console.log(`Error adding task reference to project document: ${e}`);
    res.status(400).end();
  }
});

// Update task by id
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTask = req.body;

    await models.Task.findByIdAndUpdate(id, updatedTask);
    res.status(204).send();
  } catch (e) {
    console.log(`Error updating task: ${e}`);
    res.status(404).send();
  }
});

// Delete task by id
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await models.Task.findByIdAndDelete(id);
    res.status(204).end();
  } catch (e) {
    console.log(`Error deleting task: ${e}`);
    res.status(404).end();
  }
});

// Project Routes
// Read all user's projects
app.get("/users/:id/projects", async (req, res) => {
  try {
    const user = await models.User.findById(req.params.id);

    const projects = await Promise.all(
      user.projectsList.map(async (project) => {
        return await models.Project.findById(project);
      })
    );

    res.status(200).json(projects);
  } catch (e) {
    console.log(`Error getting projects for user: ${e}`);
    res.status(404).end();
  }
});

// Create new project
app.post("/projects", async (req, res) => {
  try {
    const project = await models.Project.create(req.body);

    res.status(201).set("Location", `${project.id}`).end();
  } catch (e) {
    console.log(`Error creating project: ${e}`);
    res.status(503).send();
  }
});

// Add project reference to user doc
app.put("/users/:id/projects/:projectID", async (req, res) => {
  try {
    const user = await models.User.findById(req.params.id);

    user.projectsList.push(req.params.projectID);
    user.save();
    res.status(200).end();
  } catch (e) {
    console.log(`Error adding project to user document: ${e}`);
    res.status(400).end();
  }
});

// Add user reference to project doc
app.put("/projects/:id/members/:userID", async (req, res) => {
  try {
    const project = await models.Project.findById(req.params.id);

    if (project.members.includes(req.params.userID) === false) {
      project.members.push(req.params.userID);
      project.save();

      res.status(200).end();
    } else {
      res.status(204).end();
    }
  } catch (e) {
    console.log(`Error adding user reference to project document: ${e}`);
    res.status(404).end();
  }
});

// Update Project by id
app.put("/projects/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProject = req.body;

    await models.Project.findByIdAndUpdate(id, updatedProject);
    res.status(204).send();
  } catch (e) {
    console.log(`Error updating project: ${e}`);
    res.status(404).send();
  }
});

// Delete Project by id
app.delete("/projects/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await models.Project.findByIdAndDelete(id);

    res.status(204).send();
  } catch (e) {
    console.log(`Error deleting project: ${e}`);
    res.status(404).send();
  }
});
