const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    photoURL: String,
    projectURL: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    members: [mongoose.Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
