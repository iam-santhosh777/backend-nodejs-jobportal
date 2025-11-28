/**
 * Error Handler Middleware
 * Centralized error handling
 */

const ApiResponse = require('../utils/response');

class ErrorHandler {
  /**
   * Handle errors
   */
  handle(err, req, res, next) {
    console.error('Error:', err);

    // Database errors
    if (err.code === 'ER_DUP_ENTRY') {
      return ApiResponse.badRequest(res, 'Duplicate entry. This record already exists.');
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return ApiResponse.badRequest(res, 'Referenced record does not exist.');
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
      return ApiResponse.error(res, 'Invalid field in query', 400, err);
    }

    // Validation errors
    if (err.message.includes('required')) {
      return ApiResponse.badRequest(res, err.message);
    }

    if (err.message.includes('not found')) {
      return ApiResponse.notFound(res, err.message.split(' not found')[0]);
    }

    if (err.message.includes('already exists')) {
      return ApiResponse.badRequest(res, err.message);
    }

    // Default error
    return ApiResponse.error(res, err.message || 'Internal server error', 500, err);
  }

  /**
   * Handle 404 errors
   */
  notFound(req, res, next) {
    return ApiResponse.notFound(res, 'Route');
  }
}

module.exports = new ErrorHandler();


