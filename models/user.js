const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
      default: null,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    tasksList: [mongoose.Schema.Types.ObjectId],
    projectsList: [mongoose.Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

// TODO Method to check if user has specified role or permission(s)
userSchema.methods.hasAccess = async function (options) {
  if (options.permission === undefined && options.role === undefined) {
    console.log("both undefined");
    return false;
  }

  if (options.role) {
    // Check if user has given role
    // This part works
    const userRoles = await mongoose
      .model("Role")
      .find()
      .where("_id")
      .in(this.roles)
      .exec();

    return userRoles.some((userRole) => userRole.name === options.role);
  }

  else if (options.permission) {
    // TODO check if user has permission via their role
    const userRoles = await mongoose
    .model("Role")
    .find()
    .where("_id")
    .in(this.roles)
      .exec();
    

    // return userRoles.some(async function (userRole) {
    //   userRole.hasPermission(options.permission)
    // })

    for (let i = 0; i < userRoles.length; i++) {
      if (await userRoles[i].hasPermission(options.permission)) {
        console.log(`role ${userRoles[i].name} has permission ${options.permission}`)
        return true;
      }
    }
    return false;
  }

  else return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
