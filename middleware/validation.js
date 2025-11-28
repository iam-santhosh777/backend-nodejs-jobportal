/**
 * Validation Middleware
 * Request validation helpers
 */

const ApiResponse = require('../utils/response');

class Validation {
  /**
   * Validate required fields
   */
  validateRequired(fields) {
    return (req, res, next) => {
      const missing = fields.filter(field => !req.body[field]);
      
      if (missing.length > 0) {
        return ApiResponse.badRequest(
          res,
          `Missing required fields: ${missing.join(', ')}`
        );
      }
      
      next();
    };
  }

  /**
   * Validate email format
   */
  validateEmail(req, res, next) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (req.body.email && !emailRegex.test(req.body.email)) {
      return ApiResponse.badRequest(res, 'Invalid email format');
    }
    
    next();
  }

  /**
   * Validate ID parameter
   */
  validateId(req, res, next) {
    const { id, courseId } = req.params;
    const identifier = id || courseId;
    
    if (!identifier || isNaN(parseInt(identifier))) {
      return ApiResponse.badRequest(res, 'Invalid ID parameter');
    }
    
    next();
  }
}

module.exports = new Validation();

