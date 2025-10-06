// Global error-handling middleware
// Express recognizes middleware with 4 parameters (err, req, res, next) as error handlers
const errorHandler = (err, req, res, next) => {

    // Log the full error stack to the console for debugging
    console.error(err.stack);
    // Respond to the client with an error message
    // - Use the specific status code if available (err.statusCode)
    // - Otherwise, default to 500 (Internal Server Error)
    // - Use the specific error message if available (err.message)
    // - Otherwise, send a generic "Server Error" message
    res.status(err.statusCode || 500).json({
      message: err.message || 'Server Error',
    });
  };
  
  module.exports = errorHandler;