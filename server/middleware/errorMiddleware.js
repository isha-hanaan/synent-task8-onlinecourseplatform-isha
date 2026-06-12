/* server/middleware/errorMiddleware.js */

const errorHandler = (err, req, res, next) => {
    console.error('🔴 Express Operational Intercept Error Stack:', err);

    // FIXED: Guard against modifying response pipelines after headers have already streamed out
    if (res.headersSent) {
        return next(err);
    }

    let errorResponse = {
        message: err.message || 'Something went wrong inside the server application layer',
        statusCode: err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)
    };

    // Mongoose Bad ObjectId Format Validation Check (CastError)
    if (err.name === 'CastError') {
        errorResponse.message = `Resource not found with data identity id: ${err.value}`;
        errorResponse.statusCode = 404;
    }

    // Mongoose Duplicate Field Key Errors (MongoServerError code 11000)
    if (err.code === 11000) {
        errorResponse.message = 'Duplicate field value entered into database unique constraint indexing record.';
        errorResponse.statusCode = 400;
    }

    // Mongoose Model Validation Failure Chains
    if (err.name === 'ValidationError') {
        errorResponse.message = Object.values(err.errors).map(val => val.message).join(', ');
        errorResponse.statusCode = 400;
    }

    res.status(errorResponse.statusCode).json({
        success: false,
        message: errorResponse.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;