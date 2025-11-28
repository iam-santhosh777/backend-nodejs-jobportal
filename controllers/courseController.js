/**
 * Course Controller
 * Handles HTTP requests for courses
 */

const courseService = require('../services/courseService');
const ApiResponse = require('../utils/response');

class CourseController {
  /**
   * Get all courses
   */
  async getAllCourses(req, res, next) {
    try {
      const courses = await courseService.getAllCourses();
      return ApiResponse.success(res, courses);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course by ID
   */
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await courseService.getCourseById(id);
      return ApiResponse.success(res, course);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get courses by user
   */
  async getCoursesByUser(req, res, next) {
    try {
      const { identifier } = req.params;
      const { by } = req.query;
      const courses = await courseService.getCoursesByUser(identifier, by);
      return ApiResponse.success(res, courses);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new course
   */
  async createCourse(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body);
      return ApiResponse.created(res, course, 'Course created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update course
   */
  async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const course = await courseService.updateCourse(id, req.body);
      return ApiResponse.success(res, course, 'Course updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete course
   */
  async deleteCourse(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id);
      return ApiResponse.success(res, null, 'Course deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Enroll user in a course
   */
  async enrollUser(req, res, next) {
    try {
      const { courseId } = req.params;
      const { user_email, user_id } = req.body;
      
      if (!user_email && !user_id) {
        return ApiResponse.badRequest(res, 'Either user_email or user_id is required');
      }

      const identifier = user_email || user_id;
      const by = user_email ? 'email' : 'id';
      
      await courseService.enrollUser(courseId, identifier, by);
      return ApiResponse.created(res, null, 'User enrolled in course successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user enrollments
   */
  async getUserEnrollments(req, res, next) {
    try {
      const { identifier } = req.params;
      const { by } = req.query;
      const enrollments = await courseService.getUserEnrollments(identifier, by);
      return ApiResponse.success(res, enrollments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unenroll user from a course
   */
  async unenrollUser(req, res, next) {
    try {
      const { courseId } = req.params;
      const { user_email, user_id } = req.body;
      
      if (!user_email && !user_id) {
        return ApiResponse.badRequest(res, 'Either user_email or user_id is required');
      }

      const identifier = user_email || user_id;
      const by = user_email ? 'email' : 'id';
      
      await courseService.unenrollUser(courseId, identifier, by);
      return ApiResponse.success(res, null, 'User unenrolled from course successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();


