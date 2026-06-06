const express = require('express');
const { body, validationResult } = require('express-validator');
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

// Validation Rules Array
const signupValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Interceptor Middleware: Halts execution if validation rules above fail
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// Fixed: Linearly apply the checks followed by the verification interceptor
router.post('/register', signupValidation, validateRequest, register);

router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/me', protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/admin', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Welcome Admin' });
});

module.exports = router;