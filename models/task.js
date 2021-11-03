const mongoose = require("mongoose");
const taskCommentSchema = require("./taskComment");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dueDate: Date,
    description: String,
    isInProgress: Boolean,
    isCompleted: Boolean,
    usersAssigned: [mongoose.Schema.Types.ObjectId],
    comments: [taskCommentSchema],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
