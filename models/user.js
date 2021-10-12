const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    default: null,
  },
  tasksList: {
    type: [String],
    default: [],
  },
  projectsList: [String],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
