const express = require('express');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');
const app = express();
const port = process.env.PORT || 3000;
const { connectionDB } = require('../Back/db/config');

//connectionDB 
connectionDB();

//Middleware set up 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public')); // Serve static files from the "public" folder

//Setting up the template engine
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views'));


//Routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log('Server up and running on port ' + port
    );
})

