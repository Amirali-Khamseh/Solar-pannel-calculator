const bcrypt = require('bcrypt');
const User = require('../models/User');



signup = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

signin = async (req, res) => {
    
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Sign in successful' });
    } catch (error) {
        console.error('Error signing in', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


module.exports = { signin, signup };