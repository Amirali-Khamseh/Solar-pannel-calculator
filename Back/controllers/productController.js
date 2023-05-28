const Product = require('../models/Product');


//Rendring the creating page for product
const renderCreate = (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.render('create-product', { id });
}

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product by ID', error);
    res.status(500).render('500')
  }
}

// Create a new product
const createProduct = async (req, res) => {

  try {
    const {  orientation, inclination, area, longitude, latitude, status, projectId } = req.body;
    const product = new Product({
   
      orientation,
      inclination,
      area,
      longitude,
      latitude,
      status,
      project: projectId,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { powerPeak, orientation, inclination, area, longitude, latitude, status } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { powerPeak, orientation, inclination, area, longitude, latitude, status },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderCreate
};