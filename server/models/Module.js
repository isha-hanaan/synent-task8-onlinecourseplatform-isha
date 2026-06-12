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
        // FIXED: Explicitly allow virtual fields to show up when converting documents to JSON or Objects
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// FIXED: Compound index to optimize course-wide module filtering and ordering performance
ModuleSchema.index({ course: 1, order: 1 });

// FIXED: Virtual populate relationship to link down to children lessons automatically without manual DB lookups
ModuleSchema.virtual('lessons', {
    ref: 'Lesson',          // The model to look into
    localField: '_id',     // The field on this Module schema
    foreignField: 'module', // The field on the Lesson schema that points to the Module
    justOne: false
});

module.exports = mongoose.model('Module', ModuleSchema);