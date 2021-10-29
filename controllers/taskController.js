const mongoose = require("mongoose");
const models = require("../models/models");

exports.getTasksForUser = async (req, res) => {
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
};

exports.getTasksForProject = async (req, res) => {
  try {
    const project = await models.Project.findById(req.params.id);

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
};

exports.createTask = async (req, res) => {
  try {
    // TODO: Get user id to add task reference, possibly from http headers
    const projectID = req.params.id;
    const task = await new models.Task(req.body);
    const project = await models.Project.findById(projectID);
    const newId = new mongoose.Types.ObjectId();
    // Generates taskID here instead of client side
    await task.set("_id", newId);

    await task.save();
    await project.tasks.push(task.id);
    await project.save();
    res.status(201).set("Location", `${task.id}`).end();
  } catch (e) {
    console.log(`Error creating task: ${e}`);
    res.status(503).send();
  }
};

exports.updateTask = async (req, res) => {
  try {
    const projectID = req.params.id;
    const taskID = req.params.taskID;
    const updatedTask = req.body;

    const project = await models.Project.findById(projectID);

    if (project.tasks.includes(taskID) === true) {
      await models.Task.findByIdAndUpdate(taskID, updatedTask);
      res.status(204).end();
    }
    res.status(404).end();
  } catch (e) {
    console.log(`Error updating task: ${e}`);
    res.status(404).end();
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // TODO: Delete references from project and any users when task is deleted
    const projectID = req.params.id;
    const taskID = req.params.taskID;
    const project = await models.Project.findById(projectID);

    if (project.tasks.includes(taskID)) {
      const task = await models.Task.findById(taskID);
      const userIDs = task.usersAssigned;
      userIDs.forEach((userID) => {
        // TODO: Delete task id from user tasks list
      });

      const filteredTasks = project.tasks.filter(
        (el) => el.equals(taskID) === false
      );

      project.set("tasks", filteredTasks);
      project.save();
      await models.Task.findByIdAndDelete(taskID);

      res.status(204).end();
    }
    res.status(404).end();
  } catch (e) {
    console.log(`Error deleting task: ${e}`);
    res.status(404).end();
  }
};

exports.addUserToTask = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await models.Task.findById(id);

    if (task.usersAssigned.includes(req.params.userID) === false) {
      task.usersAssigned.push(req.params.userID);
      task.save();
      res.status(200).end();
    }
    res.status(204).end();
  } catch (e) {
    console.log(`Error adding user to task: ${e}`);
    res.status(404).send();
  }
};
