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
    const task = await models.Task.create(req.body);
    res.status(201).set("Location", `${task.id}`).end();
  } catch (e) {
    console.log(`Error creating task: ${e}`);
    res.status(503).send();
  }
};

exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTask = req.body;

    await models.Task.findByIdAndUpdate(id, updatedTask);
    res.status(204).send();
  } catch (e) {
    console.log(`Error updating task: ${e}`);
    res.status(404).send();
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    await models.Task.findByIdAndDelete(id);
    res.status(204).end();
  } catch (e) {
    console.log(`Error deleting task: ${e}`);
    res.status(404).end();
  }
};
