//For hashing the password
const bcrypt = require('bcrypt');
//User model , to interact with the database
const User = require('../models/User');


//Registering user into the system , with applied validation for existing users
signup = async (req, res) => {

    try {
        const { email, password, name } = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(401).render('used-email');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email,
            password: hashedPassword,
            name
        });

        await user.save();

        res.status(200).render('signin');
    } catch (error) {
        //console.error('Error signing up', error);
        res.status(500).render('500');
    }
};
//Loggin in user based on their password
signin = async (req, res) => {

    try {
        const { email, password } = req.body;
        //Getting the user who has been registered with the email coming from request body
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

//Dashboard
const dashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findOne({ _id: userId });
        // console.log(user, userId);
        res.status(200).render('project', { user });
    } catch (error) {
        console.error('Not authorized', error);
        res.status(403).render('403');
    }
}


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
        //console.error('Error updating user', error);
        res.status(500).render('500');
    }
};




// Update user by ID POST 
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const updatedFields = {};
    try {
        let user = await User.findById(id);
        updatedFields.name = name;
        updatedFields.email = email;
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        }
        const update = await User.findByIdAndUpdate(id, updatedFields, { new: true });
        res.render('project', { user });


    } catch (err) {
        console.log(err);
    }

};


//deleteUserGet to preview data before completely deleting
const deleteUserGet = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.render('500');
        }
        res.status(200).render('user-delete', { user });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).render('500');
    }
};
// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.redirect('/');
        } else {
            res.redirect('/');
        }

    } catch (error) {
        // console.error('Error deleting user', error);
        res.status(500).render('500');
    }
};


module.exports =
    { signin, signup, updateUser, deleteUser, updateUserGet, deleteUserGet, dashboard };