/* server/server.js */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

const app = express();

// Initialize Database Connection Instance
connectDB();

// Global Cross-Origin & Data Parsing Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());


// --- RESTFUL API APPLICATION GATEWAY MOUNTINGS ---

app.use('/api/auth', authRoutes);

// FIXED: courseRoutes now cleanly handles all nested forwarding chains internally
// (/api/courses, /api/courses/:courseId/modules, and /api/courses/:courseId/modules/:moduleId/lessons)
app.use('/api/courses', courseRoutes);

app.use('/api/enrollments', enrollmentRoutes);

app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);

// Global Interceptor: Must remain at the absolute bottom to register runtime catches!
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});