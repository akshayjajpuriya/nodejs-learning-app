const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Get token from the request header
    const token = req.header('x-auth-token');

    // 2. If no token, deny access
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. If token exists, verify it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Add the user payload to the request
        next(); // Pass control to the next function (the route)
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};