/* server/middleware/authMiddleware.js */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Enforce strictly protected route operations (Verify Token Required)
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'User reference not found' });
        }

        if (!req.user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};

// Optional authorization interceptor: extracts profile data if token is provided, otherwise skips safely
const optionalProtect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token exists, they are a guest. Advance cleanly without applying req.user context.
        if (!token) {
            return next();
        }

        // FIXED: If a token exists, explicitly enforce valid signing states rather than swallowing verification errors
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userObj = await User.findById(decoded.id).select('-password');

        if (userObj && userObj.isVerified) {
            req.user = userObj; // Bind data profile if validated successfully
        }

        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

// Authorize contextual role validations
const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: `Role '${req.user.role}' is not allowed to access this action` });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
};

module.exports = {
    protect,
    optionalProtect,
    authorize
};