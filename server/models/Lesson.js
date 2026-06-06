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

module.exports = mongoose.model('Lesson', LessonSchema);