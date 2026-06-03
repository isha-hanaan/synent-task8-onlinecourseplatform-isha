const express = require('express');
const {
    createOrder,
    verifyPayment,
    getUserEnrollments,
    markLessonComplete
} = require('../controllers/enrollmentController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce authentication context parsing on all enrollment interactions
router.use(protect);

router.route('/').get(getUserEnrollments);
router.route('/order').post(createOrder);
router.route('/verify').post(verifyPayment);
router.route('/lesson-complete').post(markLessonComplete);

module.exports = router;