const express = require('express');
const {
    getLessonsByModule,
    createLesson
} = require('../controllers/lessonController');

const {
    protect,
    authorize
} = require('../middleware/authMiddleware');

const router = express.Router();

// Public route
router.get('/:moduleId', getLessonsByModule);

// Admin only
router.post(
    '/',
    protect,
    authorize('admin'),
    createLesson
);

module.exports = router;