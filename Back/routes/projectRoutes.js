const express = require('express');
const projectController = require('../controllers/projectController');
const isAuthenticated = require('../middlewares/auth');

const router = express.Router();

router.get('/create', isAuthenticated, projectController.renderForm);
router.get('/', isAuthenticated, projectController.getAllProjects);
router.get('/:id', isAuthenticated, projectController.getProjectById);
router.post('/', isAuthenticated, projectController.createProject);
router.post('/update/:id', isAuthenticated, projectController.updateProject);
router.get('/update/:id', isAuthenticated, projectController.renderUpdate);
router.get('/delete/:id', isAuthenticated, projectController.renderDelete);
router.post('/delete/:id', isAuthenticated, projectController.deleteProject);

module.exports = router;
