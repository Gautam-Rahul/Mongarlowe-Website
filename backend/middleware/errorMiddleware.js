// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Sometimes the status code might be 200 even though it's an error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set the status code
  res.status(statusCode);
  
  // Send the error response
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler }; 