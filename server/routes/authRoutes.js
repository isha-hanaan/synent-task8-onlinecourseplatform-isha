const express = require('express');
const { body } = require('express-validator');
const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const {
    protect,
    authorize
} = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Define validations cleanly in a clean array outside the route handler
const signupValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// 2. Use the ES6 spread operator (...) to feed them into Express linearly
router.post('/register', ...signupValidation, register);

router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/me', protect, (req, res) => {
    res.json({ user: req.user });
});

router.get('/admin', protect, authorize('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

module.exports = router;