const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a module title']
        },
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course',
            required: true
        },
        order: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Module', ModuleSchema);