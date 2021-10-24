const express = require("express");
const models = require("../models/models");
const projectController = require('../controllers/projectController');
const router = express.Router();

// Read all user's projects
router.get("/users/:id/projects", projectController.getProjectsForUser);

// Create new project
router.post("/projects", projectController.createProject);

// TODO: Combine these functions
// Add project reference to user doc
router.put("/users/:id/projects/:projectID", async (req, res) => {
  try {
    const user = await models.User.findById(req.params.id);

    user.projectsList.push(req.params.projectID);
    user.save();
    res.status(200).end();
  } catch (e) {
    console.log(`Error adding project to user document: ${e}`);
    res.status(400).end();
  }
});

// Add user reference to project doc
router.put("/projects/:id/members/:userID", async (req, res) => {
  try {
    const project = await models.Project.findById(req.params.id);

    if (project.members.includes(req.params.userID) === false) {
      project.members.push(req.params.userID);
      project.save();

      res.status(200).end();
    } else {
      res.status(204).end();
    }
  } catch (e) {
    console.log(`Error adding user reference to project document: ${e}`);
    res.status(404).end();
  }
});

// Update Project by id
router.put("/projects/:id", projectController.updateProject);

// Delete Project by id
router.delete("/projects/:id", projectController.deleteProject);

module.exports = router;
