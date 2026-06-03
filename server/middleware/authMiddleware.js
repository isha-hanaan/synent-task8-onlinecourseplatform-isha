const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!req.user.isVerified) {
            return res.status(401).json({
                message: 'Please verify your email first'
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};

// Authorize roles - check if user has required role
const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: `Role '${req.user.role}' is not allowed` });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
};

module.exports = {
    protect,
    authorize
};