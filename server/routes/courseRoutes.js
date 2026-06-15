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

const moduleRouter = require('./moduleRoutes');
router.use('/:courseId/modules', moduleRouter);

router.route('/')
    .get(optionalProtect, getCourses)
    .post(protect, authorize('admin'), createCourse);

router.route('/:id')
    .get(optionalProtect, getCourse)
    .put(protect, authorize('admin'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;