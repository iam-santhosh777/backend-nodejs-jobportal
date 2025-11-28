/**
 * Course Service
 * Business logic for courses
 */

const courseRepository = require('../repositories/courseRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');
const userIdentifier = require('../utils/userIdentifier');

class CourseService {
  /**
   * Get all courses
   */
  async getAllCourses() {
    return await courseRepository.findAll();
  }

  /**
   * Get course by ID
   */
  async getCourseById(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  /**
   * Get courses by user identifier (email or ID)
   */
  async getCoursesByUser(identifier, by = null) {
    const userId = await userIdentifier.resolveUserId(identifier, by);
    return await courseRepository.findByUserId(userId);
  }

  /**
   * Create a new course
   */
  async createCourse(courseData) {
    const { name, description, user_email, user_id } = courseData;

    // Validate required fields
    if (!name || !description) {
      throw new Error('Name and description are required');
    }

    // Resolve user ID if email is provided
    let resolvedUserId = user_id;
    if (user_email && !user_id) {
      resolvedUserId = await userIdentifier.resolveUserId(user_email, 'email');
    }

    return await courseRepository.create({
      name,
      description,
      user_id: resolvedUserId || null
    });
  }

  /**
   * Update course
   */
  async updateCourse(id, courseData) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }

    return await courseRepository.update(id, {
      name: courseData.name || course.name,
      description: courseData.description || course.description,
      user_id: courseData.user_id || course.user_id
    });
  }

  /**
   * Delete course
   */
  async deleteCourse(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }

    await courseRepository.delete(id);
    return true;
  }

  /**
   * Enroll user in a course
   */
  async enrollUser(courseId, identifier, by = null) {
    // Validate course exists
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Resolve user ID
    const userId = await userIdentifier.resolveUserId(identifier, by);

    // Check if already enrolled
    const existingEnrollment = await enrollmentRepository.exists(userId, courseId);
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course');
    }

    // Create enrollment
    await enrollmentRepository.create(userId, courseId);
    return true;
  }

  /**
   * Get user enrollments
   */
  async getUserEnrollments(identifier, by = null) {
    const userId = await userIdentifier.resolveUserId(identifier, by);
    return await enrollmentRepository.findByUserId(userId);
  }

  /**
   * Unenroll user from a course
   */
  async unenrollUser(courseId, identifier, by = null) {
    // Validate course exists
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Resolve user ID
    const userId = await userIdentifier.resolveUserId(identifier, by);

    // Check if enrolled
    const enrollment = await enrollmentRepository.exists(userId, courseId);
    if (!enrollment) {
      throw new Error('User is not enrolled in this course');
    }

    await enrollmentRepository.delete(userId, courseId);
    return true;
  }
}

module.exports = new CourseService();


