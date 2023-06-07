const Product = require('../models/Product');
require('dotenv').config();


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
    const { powerPeak, orientation, inclination, area, longitude, latitude, status, projectId } = req.body;
    const product = new Product({

      orientation,
      inclination,
      area,
      longitude,
      latitude,
      status,
      powerPeak,
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
    const { powerPeak, orientation, inclination, area, longitude, latitude, status } = req.body;


    const product = await Product.findByIdAndUpdate(
      id,
      { orientation, inclination, area, longitude, latitude, status, powerPeak },
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

const reportProduct = async (req, res) => {
  const { startDate, endDate, orientation, inclination, area, longitude, latitude, status, powerPeak } = req.body;
  console.log(startDate, endDate, orientation, inclination, area, longitude, latitude, status, powerPeak);

  //Api call to get the weather data within 2 periods 
  const orientationMap = {
    S: 0.75,  // Example value for south-facing orientation
    N: 0.25,  // Example value for north-facing orientation
    W: 0.5,   // Example value for west-facing orientation
    E: 1.0    // Example value for east-facing orientation
  };

  const data = await fetch(`https://api.weatherbit.io/v2.0/history/daily?lat=${latitude}&lon=${longitude}&start_date=${startDate}&end_date=${endDate}&key=${process.env.API_KEY}`);
  //https://api.weatherbit.io/v2.0/history/daily?lat=51.163&lon=10.448&start_date=2023-05-01&end_date=2023-05-010&key=d69863dbe8604734946b674ef99b16e2
  //https://api.weatherbit.io/v2.0/history/energy?lat=${latitude}&lon=${longitude}&start_date=${startDate}&end_date=${endDate}&tp=daily&key=${process.env.API_KEY}
  const dataJSON = await data.json();

  let result = [];

  for (let item in dataJSON.data) {

    //Object to be send as a report 
    let dailyEnergy = {};
    //Setting up the date property of an Object 
    dailyEnergy.date = dataJSON.data[item].datetime;
    // Replace 'orientation' with the actual orientation value for each day
    let orientationFactor = orientationMap[orientation];

    let totalElectricity = area *
      powerPeak *
      dataJSON.data[item].max_uv *
      (inclination / 100) *
      dataJSON.data[item].solar_rad *
      orientationFactor *
      0.002;
    dailyEnergy.electricity = totalElectricity;

    result.push(dailyEnergy);
  }

  console.log(result);
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