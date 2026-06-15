const crypto = require('crypto');
const Razorpay = require('razorpay');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const existingEnrollment = await Enrollment.findOne({
            user: req.user.id,
            course: courseId
        });

        if (existingEnrollment && existingEnrollment.status === 'completed') {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const PAYMENT_MODE = process.env.PAYMENT_MODE || "mock";
        let order;

        if (PAYMENT_MODE === "mock") {
            order = {
                id: "order_mock_" + crypto.randomBytes(6).toString('hex'),
                currency: "INR",
                amount: course.price * 100
            };
        }
        else {
            if (!razorpay) {
                return res.status(500).json({ message: 'Razorpay instances are unconfigured. Use mock mode.' });
            }
            const options = {
                amount: Math.round(course.price * 100),
                currency: 'INR',
                receipt: `receipt_${courseId.substring(0, 5)}`
            };
            order = await razorpay.orders.create(options);
        }

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
            amount: order.amount,
            mode: PAYMENT_MODE
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            isMockSandboxSuccess
        } = req.body;

        const PAYMENT_MODE = process.env.PAYMENT_MODE || "mock";
        let isSignatureValid = false;

        if (PAYMENT_MODE === "mock" || isMockSandboxSuccess) {
            isSignatureValid = true;
        }
        else if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

            isSignatureValid = expectedSignature === razorpay_signature;
        }

        if (!isSignatureValid) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const enrollment = await Enrollment.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment order record missing"
            });
        }

        enrollment.status = "completed";
        enrollment.razorpayPaymentId = razorpay_payment_id || "mock_payment_" + crypto.randomBytes(4).toString('hex');
        await enrollment.save();

        const user = await User.findById(enrollment.user);
        const course = await Course.findById(enrollment.course);

        if (user && course) {
            await sendEmail({
                email: user.email,
                subject: "Course Enrollment Successful",
                message: `Hello ${user.name},\n\nCongratulations! Your enrollment has been confirmed.\n\nCourse: ${course.title}\n\nYou can now access the course from your dashboard.\n\nHappy Learning!\nZenithAcad Team`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully. Course unlocked!"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            user: req.user.id,
            status: 'completed'
        }).populate('course');

        const enrollmentData = await Promise.all(enrollments.map(async (enrollment) => {
            if (!enrollment.course) return null;

            const modules = await Module.find({ course: enrollment.course._id }).select('_id');
            const moduleIds = modules.map(m => m._id);

            const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });

            const completedCount = enrollment.completedLessons?.length || 0;
            const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            return {
                ...enrollment.toObject(),
                totalLessons,
                completedCount,
                progressPercentage
            };
        }));

        res.status(200).json({
            success: true,
            count: enrollmentData.filter(item => item !== null).length,
            data: enrollmentData.filter(item => item !== null)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;

        const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId, status: 'completed' });
        if (!enrollment) {
            return res.status(403).json({ message: 'Access denied. You must be enrolled in this course.' });
        }

        if (
            !enrollment.completedLessons.some(
                lesson => lesson.toString() === lessonId
            )
        ) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
        }

        res.status(200).json({ success: true, completedLessons: enrollment.completedLessons });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('user', 'name email')
            .populate('course', 'title price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            enrollments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getUserEnrollments,
    markLessonComplete,
    getAllEnrollments
};