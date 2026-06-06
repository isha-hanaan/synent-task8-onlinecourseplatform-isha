const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    completedLessons: [{
        type: mongoose.Schema.ObjectId, // Fixed: Cast to valid ObjectId references instead of mixed string types
        ref: 'Lesson'
    }]
}, { timestamps: true });

// Prevent duplicate active enrollments for the same user and course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);