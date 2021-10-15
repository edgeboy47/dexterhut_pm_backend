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
    tasks: [mongoose.Schema.Types.ObjectId],
    members: [mongoose.Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
