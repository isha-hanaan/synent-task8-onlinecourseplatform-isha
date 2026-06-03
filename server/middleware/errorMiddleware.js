const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default to 500 server error
    const status = res.statusCode !== 200 ? res.statusCode : 500;
    const message = err.message || 'Something went wrong';

    res.status(status).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;