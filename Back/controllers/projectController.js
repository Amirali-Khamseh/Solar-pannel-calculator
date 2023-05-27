const Project = require('../models/Project');

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error getting projects', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Get project by ID
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error getting project by ID', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Create a new project
const createProject = async (req, res) => {
    try {
        const { name } = req.body;
        const project = new Project({ name });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Update project by ID
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const project = await Project.findByIdAndUpdate(id, { name }, { new: true });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error updating project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Delete project by ID
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(204).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
