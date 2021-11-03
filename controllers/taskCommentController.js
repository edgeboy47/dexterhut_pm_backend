const mongoose = require("mongoose");
const models = require("../models/models");

exports.getTaskComments = async (req, res) => {
  try {
    const projectID = req.params.projectID;
    const taskID = req.params.taskID;
    const project = await models.Project.findById(projectID);

    if (project.tasks.includes(taskID)) {
      const task = await models.Task.findById(taskID);

      res.status(200).json(task.comments);
    } else {
      console.log("Task does not exist in given project");
      res.status(404).end();
    }
  } catch (e) {
    console.log(`Error getting task comments: ${e}`);
    res.status(404).end();
  }
};

exports.deleteTaskComment = async (req, res) => {
  try {
    const projectID = req.params.projectID;
    const taskID = req.params.taskID;
    const commentID = req.params.commentID;

    const project = await models.Project.findById(projectID);
    if (project.tasks.includes(taskID)) {
      const task = await models.Task.findById(taskID);

      if (
        task.comments.findIndex((comment) => comment.id === commentID) !== -1
      ) {
        await task.comments.id(commentID).remove();
        await task.save();
        res.status(204).end();
      } else {
        console.log("Task does not contain comment");
        res.status(404).end();
      }
    } else {
      console.log("Task does not exist in given project");
      res.status(404).end();
    }
  } catch (e) {
    console.log(`Error deleting task comment: ${e}`);
    res.status(404).end();
  }
};

exports.addTaskComment = async (req, res) => {
  try {
    // TODO testing
    const projectID = req.params.projectID;

    const taskID = req.params.taskID;
    const project = await models.Project.findById(projectID);

    if (project.tasks.includes(taskID)) {
      const task = await models.Task.findById(taskID);
      const comment = req.body;
      const newId = new mongoose.Types.ObjectId();
      // Generates commentID here instead of client side
      comment._id = newId;

      await task.comments.push(comment);
      await task.save();
      res.status(201).set("Location", `${comment._id}`).end();
    } else {
      res.status(404).end();
      console.log("Task does not exist in given project");
    }
  } catch (e) {
    console.log(`Error adding task comment: ${e}`);
    res.status(404).end();
  }
};

// exports.updateTaskComment = async (req, res) => {};
