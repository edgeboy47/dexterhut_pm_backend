const express = require("express");
const models = require("../models/models");
const taskController = require("../controllers/taskController");
const router = express.Router();

// Get all tasks for user
router.get("/users/:id/tasks", taskController.getTasksForUser);

// Get all tasks in project
router.get("/projects/:id/tasks", taskController.getTasksForProject);

// Create task
// router.post("/tasks", taskController.createTask);

// TODO: Create routes for tasks in project, "/projects/:id/tasks"
router.post("/projects/:id/tasks", taskController.createTask);

router.put("/projects/:id/tasks/:taskID", taskController.updateTask);

router.delete("/projects/:id/tasks/:taskID", taskController.deleteTask);

// TODO: Combine these functions
// Add task reference to user doc
router.put("/users/:id/tasks/:taskID", async (req, res) => {
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

router.put("/projects/:id/tasks/:taskID", async (req, res) => {
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
// router.put("/tasks/:id", taskController.updateTask);

// Delete task by id
router.delete("/tasks/:id", taskController.deleteTask);

// Add user to task
router.post("/tasks/:id/users/:userID", taskController.addUserToTask);

module.exports = router;
