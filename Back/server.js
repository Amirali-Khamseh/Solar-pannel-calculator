const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = process.env.PORT || 3000;
const { connectionDB } = require('../Back/db/config')

//connectionDB 
connectionDB();

//middleware set up 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello')
})
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log('Server up and running on port ' + port
    );
})

