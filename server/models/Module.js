/* server/models/Module.js */

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
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

ModuleSchema.index({ course: 1, order: 1 });

ModuleSchema.virtual('lessons', {
    ref: 'Lesson',          
    localField: '_id',     
    foreignField: 'module', 
    justOne: false
});

module.exports = mongoose.model('Module', ModuleSchema);