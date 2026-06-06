/**
 * Optional Global Express Async Error Interceptor Wrapper
 * Wraps async controller methods to automatically pass unhandled rejections down to your errorMiddleware.
 * * Usage example if you ever want to ditch try/catch blocks:
 * const getCourses = asyncHandler(async (req, res, next) => { ... });
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;