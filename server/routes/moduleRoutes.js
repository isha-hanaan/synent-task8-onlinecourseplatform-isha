const express = require('express');
const {
    getModulesByCourse,
    createModule
} = require('../controllers/moduleController');

const {
    protect,
    authorize
} = require('../middleware/authMiddleware');

const router = express.Router();

// Public route
router.get('/:courseId', getModulesByCourse);

// Admin only
router.post(
    '/',
    protect,
    authorize('admin'),
    createModule
);

module.exports = router;