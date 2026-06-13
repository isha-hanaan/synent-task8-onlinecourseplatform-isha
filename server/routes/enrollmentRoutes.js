/* server/routes/enrollmentRoutes.js */

const express = require('express');
const {
    createOrder,
    verifyPayment,
    getUserEnrollments,
    markLessonComplete,
    getAllEnrollments
} = require('../controllers/enrollmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getUserEnrollments);

router.route('/admin')
    .get(authorize('admin'), getAllEnrollments);

router.route('/order')
    .post(createOrder);

router.route('/verify')
    .post(verifyPayment);

router.route('/lesson-complete')
    .post(markLessonComplete);

module.exports = router;