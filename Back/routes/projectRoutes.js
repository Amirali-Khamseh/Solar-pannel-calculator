const express = require('express');
const projectController = require('../controllers/projectController');
const isAuthenticated = require('../middlewares/auth');

const router = express.Router();
//Retrieve
router.get('/create', isAuthenticated, projectController.renderForm);
router.get('/', isAuthenticated, projectController.getAllProjects);
//Create
router.post('/', isAuthenticated, projectController.createProject);
//Update
router.post('/update/:id', isAuthenticated, projectController.updateProject);
router.get('/update/:id', isAuthenticated, projectController.renderUpdate);
//Delete
router.get('/delete/:id', isAuthenticated, projectController.renderDelete);
router.post('/delete/:id', isAuthenticated, projectController.deleteProject);
//Details
router.get('/details/:id', isAuthenticated, projectController.getProjectById);
module.exports = router;
