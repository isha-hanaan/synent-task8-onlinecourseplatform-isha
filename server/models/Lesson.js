/* server/models/Lesson.js */

const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a lesson title']
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String,
        required: [true, 'Please add a video URL']
    },
    module: {
        type: mongoose.Schema.ObjectId,
        ref: 'Module',
        required: true
    },
    duration: {
        type: String,
        default: "0:00"
    },
    order: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

// FIXED: Compound index to optimize module lookups and sequential lesson ordering instantly
LessonSchema.index({ module: 1, order: 1 });

module.exports = mongoose.model('Lesson', LessonSchema);