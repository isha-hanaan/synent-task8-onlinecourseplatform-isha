const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a lesson title']
        },

        module: {
            type: mongoose.Schema.ObjectId,
            ref: 'Module',
            required: true
        },

        videoUrl: {
            type: String,
            required: [true, 'Please add a video URL']
        },

        duration: {
            type: Number,
            default: 0
        },

        order: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Lesson', LessonSchema);