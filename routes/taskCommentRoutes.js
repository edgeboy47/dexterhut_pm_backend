const express = require("express");
const taskCommentController = require("../controllers/taskCommentController");
const router = express.Router();

// Get all comments for task
router.get(
  "/projects/:projectID/tasks/:taskID/comments",
  taskCommentController.getTaskComments
);

// Post new comment to task
router.post(
  "/projects/:projectID/tasks/:taskID/comments",
  taskCommentController.addTaskComment
);

// Delete comment from task
router.delete(
  "/projects/:projectID/tasks/:taskID/comments/:commentID",
  taskCommentController.deleteTaskComment
);

module.exports = router;
