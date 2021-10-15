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
  tasksList: [mongoose.Schema.Types.ObjectId],
  projectsList: [mongoose.Schema.Types.ObjectId],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
