const Product = require('../models/Product');


//Rendring the creating page for product
const renderCreate = (req, res) => {
  const { id } = req.params;
  console.log(id);
  const projectId = id;
  res.render('create-product', { projectId });
}

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const products = await Product.find({ project: projectId });
    // Render the view template
    res.status(200).render('list-of-products', { products, projectId });
  } catch (error) {
    console.error('Error getting products', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
//Get the lon and lat as a JSON , to call via AJAx from front
const getLonLat = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const products = await Product.find({ project: projectId });
    // Render the view template
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error getting products', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}


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
    const { orientation, inclination, area, longitude, latitude, status, projectId } = req.body;
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
    try {
      const products = await Product.find({ project: projectId });
      // Render the view template
      res.status(200).render('list-of-products', { products, projectId });
    } catch (error) {
      console.error('Error getting products', error);
      res.status(500).json({ error: 'An error occurred' });
    }

  } catch (error) {
    console.error('Error creating product', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};


//Render update product
const renderUpdate = async (req, res) => {
  const { id, projectId } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.render('edit-product', { id, projectId, product });
}

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId } = req.params;
    const { orientation, inclination, area, longitude, latitude, status } = req.body;


    const product = await Product.findByIdAndUpdate(
      id,
      { orientation, inclination, area, longitude, latitude, status },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    //Fetching all the new changes and rendering the new list of products
    try {

      const products = await Product.find({ project: projectId });
      // Render the view template
      res.status(200).render('list-of-products', { products, projectId });
    } catch (error) {
      console.error('Error getting products', error);
      res.status(500).json({ error: 'An error occurred' });
    }

  } catch (error) {
    console.error('Error updating product', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

//Sending the lon and Lat to the front for a single product 

const getDataLonLat = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const products = await Product.find({ project: projectId });
    // Render the view template
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error getting products', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    //Fetching all the new changes and rendering the new list of products
    try {

      const products = await Product.find({ project: projectId });
      // Render the view template
      res.status(200).render('list-of-products', { products, projectId });
    } catch (error) {
      console.error('Error getting products', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  } catch (error) {
    console.error('Error deleting product', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
//Render update product
const renderDelete = async (req, res) => {
  const { id, projectId } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.render('delete-product', { id, projectId, product });
}

//Rendering report ejs
const renderReport = async (req, res) => {
  const { id, projectId } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  //Fetching the last 24 hours in form of cron Job 
  res.render('report-product', { id, projectId, product });
}
//MAin function for calculating the report between two periods

const reportProduct =  (req,res)=>{
  const{startDate,endDate , orientation, inclination, area, longitude, latitude, status} =req.body;
  console.log(startDate ,endDate,orientation, inclination, area, longitude, latitude, status);

//TODO 
//1-Check the start date matches the start date or creation date of product 
//2-Calcultion of the energy between 2 periods for each day
//3-Send an email
//4- Making the status of the product inactive 
//5-Re rendering the products page  OOOORRR  maybe rendering a new page 


}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderCreate,
  getLonLat,
  renderUpdate,
  getDataLonLat,
  renderDelete,
  renderReport,
  reportProduct

};