const Project = require('../models/Project');

//Rendering the Project's creation from 
const renderForm = (req, res) => {
    res.render('create-project')
}

// Create a new project
const createProject = async (req, res) => {
    const userId = req.session.userId;
    console.log(req.body.name, req.body.description, userId);
    try {
        const { title, description } = req.body;
        const createdBy = userId;

        const project = new Project({
            title: title,
            description: description,
            createdBy: createdBy
        });

        await project.save();

        //res.status(201).json({ message: 'Project created successfully', project });
        res.render('project', { user: userId });
    } catch (error) {
        console.error('Error creating project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const userId = req.session.userId;
        const projects = await Project.find({ createdBy: userId }).populate('createdBy', 'name');

        res.render('list-of-projects', { projects });
    } catch (error) {
        console.error('Error getting projects', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


// Get a project by ID
const getProjectById = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.createdBy.toString() !== userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.status(200).render('details-project',{project});
    } catch (error) {
        console.error('Error getting project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

//Rendering the update page for project 

const renderUpdate = (req, res) => {
    const id = req.params.id;
    res.render('edit-project', { id })
};

// Update a project by ID
const updateProject = async (req, res) => {


    try {
        const userId = req.session.userId;
        const { id } = req.params;
        const { title, description } = req.body;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the user ID matches the project's creator
        if (project.createdBy.toString() !== userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Update the project
        project.title = title;
        project.description = description;
        const updatedProject = await project.save();

        res.status(200).render('project', { user: userId });
    } catch (error) {
        console.error('Error updating project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

//Rendering the delete confirmation page 
const renderDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.render('delete-project', { project })
    } catch (error) {
        console.error('Error getting project', error);
        res.status(500).json({ error: 'An error occurred' });
    }

};
// Delete a project by ID
const deleteProject = async (req, res) => {
    try {


        const userId = req.session.userId;
        const { id } = req.params;
        const { title, description } = req.body;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the user ID matches the project's creator
        if (project.createdBy.toString() !== userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).render('project', { user: userId });
    } catch (error) {
        console.error('Error deleting project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    renderForm,
    renderUpdate,
    renderDelete
};
