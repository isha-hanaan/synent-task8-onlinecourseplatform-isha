/* server/routes/authRoutes.js */

const express = require('express');
const { body, validationResult } = require('express-validator');
const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    getAllUsers
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

const signupValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail()
];

const resetPasswordValidation = [
    body('password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

router.post('/register', signupValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, validateRequest, resetPassword);
router.get('/verify/:token', verifyEmail);

router.get('/me', protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/admin', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Welcome Admin' });
});

router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;