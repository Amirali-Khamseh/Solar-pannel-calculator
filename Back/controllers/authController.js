const bcrypt = require('bcrypt');
const User = require('../models/User');



signup = async (req, res) => {

    try {
        const { email, password, name } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(401).render('400');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email,
            password: hashedPassword,
            name
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up', error);
        res.status(500).render('500');
    }
};

signin = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).render('400');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).render('400');
        }

        res.status(200).render('project', {user});
    } catch (error) {
        console.error('Error signing in', error);
        res.status(500).render('500');
    }
};


module.exports = { signin, signup };