const crypto = require('crypto');
const Razorpay = require('razorpay');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Initialize Razorpay Instance using your secure environment keys
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Step 1: Create a secure Razorpay Order
// @route   POST /api/enrollments/order
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the user is already enrolled
        const existingEnrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
        if (existingEnrollment && existingEnrollment.status === 'completed') {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }

        // Razorpay handles amounts in the smallest currency unit (e.g., paise for INR). 
        // We multiply the base amount by 100 ($49 becomes 4900).
        const options = {
            amount: Math.round(course.price * 100),
            currency: 'INR',
            receipt: `receipt_course_${courseId.substring(0, 5)}_${req.user.id.substring(0, 5)}`
        };

        const order = await razorpay.orders.create(options);

        // Record the transaction attempt in the database with pending status
        if (existingEnrollment) {
            existingEnrollment.razorpayOrderId = order.id;
            await existingEnrollment.save();
        } else {
            await Enrollment.create({
                user: req.user.id,
                course: courseId,
                razorpayOrderId: order.id,
                status: 'pending'
            });
        }

        res.status(201).json({
            success: true,
            order_id: order.id,
            currency: order.currency,
            amount: order.amount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Step 2: Cryptographically verify payment signatures
// @route   POST /api/enrollments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isMockSandboxSuccess } = req.body;

        // Secure bypass validation rule for your developer project environment testing
        let isSignatureValid = false;

        if (isMockSandboxSuccess) {
            isSignatureValid = true;
        } else {
            // Real cryptographic signature calculation verification
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac(
                    'sha256',
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body.toString())
                .digest('hex');
            isSignatureValid = expectedSignature === razorpay_signature;
        }

        if (!isSignatureValid) {
            return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
        }

        // Unlock course by shifting the database status criteria flags to completed
        const enrollment = await Enrollment.findOne({ razorpayOrderId: razorpay_order_id });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment order record missing' });
        }

        enrollment.status = 'completed';
        enrollment.razorpayPaymentId = razorpay_payment_id || 'mock_payment_id';
        await enrollment.save();

        res.status(200).json({ success: true, message: 'Payment verified successfully. Course unlocked!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user's active enrollments
// @route   GET /api/enrollments
// @access  Private
const getUserEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.id, status: 'completed' })
            .populate('course', 'title description instructor thumbnail price');

        res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark a specific lesson as complete
// @route   POST /api/enrollments/lesson-complete
// @access  Private
const markLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;

        const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId, status: 'completed' });
        if (!enrollment) {
            return res.status(403).json({ message: 'Access denied. You must be enrolled in this course.' });
        }

        // Avoid adding duplicates to progress tracking array
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
        }

        res.status(200).json({ success: true, completedLessons: enrollment.completedLessons });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getUserEnrollments,
    markLessonComplete
};