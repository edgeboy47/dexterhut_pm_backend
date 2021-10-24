const models = require('../models/models');

exports.getProjectsForUser = async (req, res) => {
    try {
        const user = await models.User.findById(req.params.id);
  
        const projects = await Promise.all(
            user.projectsList.map(async (project) => {
                return await models.Project.findById(project);
            })
        );
  
        res.status(200).json(projects);
    } catch (e) {
        console.log(`Error getting projects for user: ${e}`);
        res.status(404).end();
    }
};

exports.createProject = async (req, res) => {
    try {
        const project = await models.Project.create(req.body);
  
        res.status(201).set("Location", `${project.id}`).end();
    } catch (e) {
        console.log(`Error creating project: ${e}`);
        res.status(503).send();
    }
};

exports.updateProject = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedProject = req.body;
  
        await models.Project.findByIdAndUpdate(id, updatedProject);
        res.status(204).send();
    } catch (e) {
        console.log(`Error updating project: ${e}`);
        res.status(404).send();
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
  
        await models.Project.findByIdAndDelete(id);
  
        res.status(204).send();
    } catch (e) {
        console.log(`Error deleting project: ${e}`);
        res.status(404).send();
    }
};