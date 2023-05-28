const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.get('/signup', (req, res) => {
    res.render('signUp')
});
router.get('/signin', (req, res) => {
    res.render('signIn')
});
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.post('/update/:id', authController.updateUser);
router.get('/update/:id', authController.updateUserGet);

router.post('/delete/:id', authController.deleteUser);
router.get('/delete/:id', authController.deleteUserGet);

module.exports = router;