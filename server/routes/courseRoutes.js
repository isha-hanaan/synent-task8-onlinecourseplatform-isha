/* server/routes/courseRoutes.js */

const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');

const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// FIXED: Forward nested curriculum sub-resource endpoints cleanly down the tree
// This intercepts requests to /api/courses/:courseId/modules and passes them straight to moduleRoutes
const moduleRouter = require('./moduleRoutes');
router.use('/:courseId/modules', moduleRouter);


// --- CORE COURSE RESOURCE MAPPINGS ---

router.route('/')
    .get(optionalProtect, getCourses)
    .post(protect, authorize('admin'), createCourse);

router.route('/:id')
    .get(optionalProtect, getCourse)
    .put(protect, authorize('admin'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;