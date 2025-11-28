/**
 * Response utility functions
 * Standardized API responses
 */

class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(Array.isArray(data) && { count: data.length })
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, error = null) {
    const response = {
      success: false,
      message
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error.message;
      response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
  }

  static notFound(res, resource = 'Resource') {
    return this.error(res, `${resource} not found`, 404);
  }

  static badRequest(res, message = 'Bad request') {
    return this.error(res, message, 400);
  }

  static created(res, data, message = 'Created successfully') {
    return this.success(res, data, message, 201);
  }
}

module.exports = ApiResponse;



