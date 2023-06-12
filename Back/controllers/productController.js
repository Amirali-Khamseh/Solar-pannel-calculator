const Product = require('../models/Product');
const nodemailer = require('nodemailer');
const Project = require('../models/Project');
const cron = require('node-cron');
const DailyReport = require('../models/DailyReport');

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

//getting the calculating the report 


// Create a new product
const createProduct = async (req, res) => {
  const orientationMap = {
    S: 0.75,  // Example value for south-facing orientation
    N: 0.25,  // Example value for north-facing orientation
    W: 0.5,   // Example value for west-facing orientation
    E: 1.0    // Example value for east-facing orientation
  };
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
    const savedProduct = await product.save();
    // console.log('id' + savedProduct._id);
    //activating cron job 

    const creationTime = new Date();
    const creationHour = creationTime.getHours();
    const creationMinute = creationTime.getMinutes();

    const cronExpression = `*/1 * * * *`;


    cron.schedule(cronExpression, async () => {
      const data = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${process.env.API_KEY}`);
      const dataJSON = await data.json();
      console.log(dataJSON.data[0].uv, dataJSON.data[0].solar_rad);
      let dailyEnergy = {};
      const modifiedDate = dataJSON.data[0].datetime.split(':')[0]
      dailyEnergy.date = new Date(modifiedDate);
      let orientationFactor = orientationMap[orientation];
      let totalElectricity =
        area *
          powerPeak *
          dataJSON.data[0].uv === 0 ? 0.01 : dataJSON.data[0].uv *
            (inclination / 100) *
            dataJSON.data[0].solar_rad === 0 ? 0.01 : dataJSON.data[0].solar_rad *
        orientationFactor;
      dailyEnergy.electricity = totalElectricity;

      const dailyReport = new DailyReport({
        date: dailyEnergy.date,
        electricityGenerated: dailyEnergy.electricity,
        product: product._id
      });

      try {
        await dailyReport.save();
      } catch (error) {
        console.log(error);
      }

    });


    const products = await Product.find({ project: projectId });
    res.status(200).render('list-of-products', { products, projectId });
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
  const report = await DailyReport.findOne({ product: id });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.render('report-product', { id, projectId, product, report });
}

//Getting the user who have created the project 
const getCreatedByUser = async (projectId) => {
  try {
    const project = await Project.findById(projectId).populate('createdBy').exec();
    if (!project) {
      console.log('Project not found');
      return;
    }

    const createdByUser = project.createdBy;
    return createdByUser;
  } catch (error) {
    console.error(error);
  }
};
//Send email to the user who has made the product 
const sendMail = (user, result, startDate, endDate) => {
  try {
    // Create a Nodemailer transporter with your email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'amiralikhamseh01@gmail.com',
        pass: process.env.APP_KEY
      }
    });

    // Compose the email
    const mailOptions = {
      from: 'amiralikhamseh01@gmail.com',
      to: user.email,
      subject: `Your report from ${startDate} up to ${endDate}`,
      text: ''
    };

    result.forEach((element, index) => {
      mailOptions.text += `day ${index + 1} |${element.date} |${((element.electricity) / 1000).toFixed(2)} kw \n`;
    });

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
//Making the status inactive 
const inactivatingStatus = async (id) => {
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )
  }
  catch (err) {
    console.log(err);

  }

}
//MAin function for calculating the report between two periods

const reportProduct = async (req, res) => {
  const { id } = req.params;
  const { projectId } = req.params;
  const { startDate, endDate, orientation, inclination, area, longitude, latitude, status, powerPeak } = req.body;
  console.log(startDate, endDate, orientation, inclination, area, longitude, latitude, status, powerPeak, projectId);

  //Api call to get the weather data within 2 periods 
  const orientationMap = {
    S: 0.75,  // Example value for south-facing orientation
    N: 0.25,  // Example value for north-facing orientation
    W: 0.5,   // Example value for west-facing orientation
    E: 1.0    // Example value for east-facing orientation
  };

  const data = await fetch(`https://api.weatherbit.io/v2.0/history/daily?lat=${latitude}&lon=${longitude}&start_date=${startDate}&end_date=${endDate}&key=${process.env.API_KEY}`);

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


  //3-Send an email
  const usertoSend = await getCreatedByUser(projectId);
  sendMail(usertoSend, result, startDate, endDate);
  //4- Making the status of the product inactive
  //inactivatingStatus(id);
  try {
    const products = await Product.find({ project: projectId });
    // Render the view template
    const product = await Product.findById(id);
    const report = await DailyReport.findOne({ product: id });
    res.status(200).render('report-product', {id, projectId, product, report });
  } catch (error) {
    console.error('Error getting products', error);
    res.status(500).json({ error: 'An error occurred' });
  }

}

//History Report 
const historyReport = async (req, res) => {
  const { id } = req.params;
  const { projectId } = req.params;
  const reports = await DailyReport.find({ product: id })
  const usertoSend = await getCreatedByUser(projectId);
  //Sending Email
  try {
    // Create a Nodemailer transporter with your email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'amiralikhamseh01@gmail.com',
        pass: process.env.APP_KEY
      }
    });

    // Compose the email
    const mailOptions = {
      from: 'amiralikhamseh01@gmail.com',
      to: usertoSend.email,
      subject: `Your History until ${new Date().toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })}`,
      text: ''
    };


    reports.forEach((report) => {
      mailOptions.text += `Date: ${report.date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })} | Energy Output: ${report.electricityGenerated} kw \n`;
    });
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (err) {
    console.log(err);
  }


  // Making the status of the product inactive
  inactivatingStatus(id);
  try {
    const products = await Product.find({ project: projectId });
    // Render the view template
    res.status(200).render('list-of-products', { products, projectId });
  } catch (error) {
    console.error('Error getting products', error);
    res.status(500).json({ error: 'An error occurred' });
  }

}

//rendering visual grapghs for read only projects 
const renderGraph = async (req, res) => {
  const { id, projectId } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  //Fetching the last 24 hours in form of cron Job 
  res.render('report-graph', { id, projectId, product });
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
  reportProduct,
  renderGraph,
  historyReport


};