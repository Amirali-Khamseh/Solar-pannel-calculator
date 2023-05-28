const bcrypt = require('bcrypt');
const User = require('../models/User');
let CurrentUser;


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
        CurrentUser = user;
        req.session.userId = user._id;

        res.status(200).render('project', { user });
    } catch (error) {
        console.error('Error signing in', error);
        res.status(500).render('500');
    }
};

// Update user by ID GET for rendering the update form
const updateUserGet = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).render('update-user.ejs', { user });
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};
// Update user by ID POST 
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const updatedFields = {};

        if (name) {
            updatedFields.name = name;
        }
        if (email) {
            updatedFields.email = email;
        }
        if (password) {
            // Check if the password field has been modified
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).render('update-user');
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                // Rehash the updated password
                const hashedPassword = await bcrypt.hash(password, 10);
                updatedFields.password = hashedPassword;
            }
        }

        const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!user) {
            return res.status(404).render('update-user');
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


//deleteUserGet to preview data before completely deleting
const deleteUserGet = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).render('user-delete', { user });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};
// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


module.exports =
 { signin, signup, updateUser, deleteUser, updateUserGet, deleteUserGet };