const models = require("../models/models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await models.User.find();
    res.status(200).json(users);
  } catch (e) {
    console.log(`Error reading all users: ${e}`);
    res.status(404).end();
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await models.User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    console.log(`Error reading user: ${e}`);
    res.status(404).end();
  }
};

exports.createUser = async (req, res) => {
  try {
    // TODO validation on request body
    const user = await models.User.create(req.body);
    res.status(201).set("Location", `${user.id}`).end();
  } catch (e) {
    res.status(404).end();
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await models.User.findByIdAndDelete(id);

    res.status(204).end();
  } catch (e) {
    console.log(`Error deleting user: ${e}`);
    res.status(404).end();
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    await models.User.findByIdAndUpdate(id, body);
    res.status(200).end();
  } catch (e) {
    console.log(`Error updating user: ${e}`);
    res.status(404).end();
  }
};
