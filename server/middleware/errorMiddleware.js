const errorHandler = (err, req, res, next) => {
    console.error('🔴 Express Operational Intercept Error Stack:', err);

    if (res.headersSent) {
        return next(err);
    }

    let errorResponse = {
        message: err.message || 'Something went wrong inside the server application layer',
        statusCode: err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)
    };

    if (err.name === 'CastError') {
        errorResponse.message = `Resource not found with data identity id: ${err.value}`;
        errorResponse.statusCode = 404;
    }

    if (err.code === 11000) {
        errorResponse.message = 'Duplicate field value entered into database unique constraint indexing record.';
        errorResponse.statusCode = 400;
    }

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