export default (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Server error";
    res.status(statusCode).json({ message, stack: err.stack });
};