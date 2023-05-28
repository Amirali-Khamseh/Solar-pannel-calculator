const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is authenticated, proceed to the next middleware/controller
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = isAuthenticated;
