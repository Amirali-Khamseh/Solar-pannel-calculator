const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

//Getting the create   project ejs page 
router.get('/create/:id', productController.renderCreate);

//Creating the project
router.post('/create', productController.createProduct);

//Getting all of the products of a specific project 
router.get('/all/:projectId', productController.getAllProducts);

//Getting Lon and lat via Json for front and map update 
router.get('/map/:projectId', productController.getLonLat);


//Updating the specifc product based on its projectId and its own _id
router.post('/update/:projectId/:id', productController.updateProduct);

//Rendring the edit ejs for product 
router.get('/:projectId/:id', productController.renderUpdate);

//Getting one product based on its Id and pass it to front for creating the map with lon and lat 
router.get('/update/:projectId/:id', productController.getDataLonLat);


router.delete('/:id', productController.deleteProduct);

router.get('/:id', productController.getProductById);
module.exports = router;
