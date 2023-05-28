const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();
//Getting the create   project ejs page 
router.get('/create/:id',productController.renderCreate);
//Creating the project
router.post('/create', productController.createProduct);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
