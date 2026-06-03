const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes'); // Imported explicitly here

require('dotenv').config();

const app = express();

connectDB();

// Middleware
app.use(cors({
    origin: '*', // Allows your frontend to connect without CORS blocking
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Course Routes Mounting
app.use('/api/courses', require('./routes/courseRoutes'));

// Payment and Enrollment Routes Mounting
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));