const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is authenticated, proceed to the next middleware/controller
    } else {
        res.render('403');
    }
};

module.exports = isAuthenticated;
