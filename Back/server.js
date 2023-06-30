const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

//Routes 
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');
const projectRoutes = require('./routes/projectRoutes');
const productRoutes = require('./routes/productRoutes');


//connectionDB 
const { connectionDB } = require('../Back/db/config');
connectionDB();

//Middleware set up 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public'));

//Setting up the template engine
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views'));

//Session Set-up
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));



//Routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/products', productRoutes);

app.all('*', (req, res, next) => {
    //Error object indicating that the route is not found
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

//Middleware for handling unkown routes 
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render('404');
    } else {

        res.status(500).render('500');
    }
});

app.listen(port, () => {
    console.log('Server up and running on port ' + port
    );
})

