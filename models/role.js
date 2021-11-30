const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

// TODO Method to check if role has specified permission
roleSchema.methods.hasPermission = async function (permission) {
  const rolePermissions = await mongoose
    .model("Permission")
    .find()
    .where("_id")
    .in(this.permissions)
    .exec();
  
  return rolePermissions.some((rolePermission) => rolePermission.name === permission);
};

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
