const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/about', (req, res) => {
    res.render('about')
})
router.get('/dashboard', authController.dashboard);




module.exports = router;