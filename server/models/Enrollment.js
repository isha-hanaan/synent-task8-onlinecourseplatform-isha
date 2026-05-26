const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    // Progress Tracking
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // Array of Lesson IDs the student finished
    progressPercent: { type: Number, default: 0 }, // Dynamically calculated (completedLessons / totalLessons * 100)

    // Razorpay Payment Details
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amountPaid: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);