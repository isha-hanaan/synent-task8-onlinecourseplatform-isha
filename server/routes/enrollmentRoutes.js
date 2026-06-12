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

// Enforce global authentication verification barrier across all endpoints
router.use(protect);


// --- CORE LEDGER DISCOVERY TRACKS ---

router.route('/')
    .get(getUserEnrollments);

router.route('/admin')
    .get(authorize('admin'), getAllEnrollments);


// --- TRANSACTIONS & BILLING (RAZORPAY GATEWAYS) ---

router.route('/order')
    .post(createOrder);

router.route('/verify')
    .post(verifyPayment);


// --- POST-ENROLLMENT PROGRESS MANIFESTS ---

router.route('/lesson-complete')
    .post(markLessonComplete);

router.route('/:enrollmentId/lessons/:lessonId/complete')
    .post(markLessonComplete);

module.exports = router;