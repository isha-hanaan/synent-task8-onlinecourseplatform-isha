const express = require('express');
const {
    getModulesByCourse,
    createModule
} = require('../controllers/moduleController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route (access controlled inside controller based on student enrollment status)
router.get('/:courseId', protect, getModulesByCourse);

// Admin management operations
router.post('/', protect, authorize('admin'), createModule);

module.exports = router;