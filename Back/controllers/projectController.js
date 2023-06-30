const Project = require('../models/Project');
const Product = require('../models/Product');
const DailyReport = require('../models/DailyReport');

//Rendering the Project's creation from 
const renderForm = (req, res) => {
    res.render('create-project')
}

// Create a new project
const createProject = async (req, res) => {
    const userId = req.session.userId;
    //console.log(req.body.name, req.body.description, userId);
    try {
        const { title, description } = req.body;
        const createdBy = userId;

        const project = new Project({
            title: title,
            description: description,
            createdBy: createdBy
        });

        await project.save();
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
        res.status(500).render('500');
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
        res.status(200).render('details-project', { project });
    } catch (error) {
        console.error('Error getting project', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

//Rendering the update page for project 

const renderUpdate = async (req, res) => {
    const id = req.params.id;
    const project = await Project.findById({ _id: id })

    res.render('edit-project', { id, project })
};

// Update a project by ID
const updateProject = async (req, res) => {


    try {
        const userId = req.session.userId;
        const { id } = req.params;
        const { title, description } = req.body;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).render('400');
        }

        // Check if the user ID matches the project's creator
        if (project.createdBy.toString() !== userId) {
            return res.status(401).render('403');
        }

        // Update the project
        project.title = title;
        project.description = description;
        const updatedProject = await project.save();

        res.status(200).render('project', { user: userId });
    } catch (error) {
        console.error('Error updating project', error);
        res.status(500).render('500');
    }
};

//Rendering the delete confirmation page 
const renderDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).render('400');
        }
        res.render('delete-project', { project })
    } catch (error) {
        console.error('Error getting project', error);
        res.status(500).render('500');
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
            return res.status(404).render('400');
        }

        // Check if the user ID matches the project's creator
        if (project.createdBy.toString() !== userId) {
            return res.status(401).render('403');
        }

        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).render('400');
        }
        res.status(200).render('project', { user: userId });
    } catch (error) {
        console.error('Error deleting project', error);
        res.status(500).render('500');
    }
};
//Electricity Generated Summ for all products 
const projectOutPut = async (req, res) => {
    try {

        const projectId = req.params.id;

        const products = await Product.find({ project: projectId, status: 'active' });

        if (!products) {
            return res.status(404).json({ message: 'No products found for the given project ID' });
        }
        let electricitySum = 0;
        for (const product of products) {
            const dailyReports = await DailyReport.find({ product: product._id });

            for (const dailyReport of dailyReports) {
                electricitySum += dailyReport.electricityGenerated;
            }
        }
        res.json({ electricitySum });


    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    renderForm,
    renderUpdate,
    renderDelete,
    projectOutPut,

};
