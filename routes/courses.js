/**
 * Course Routes
 * Thin route layer that delegates to controllers
 */

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const validation = require('../middleware/validation');

// GET all courses
router.get('/', courseController.getAllCourses.bind(courseController));

// GET course by ID
router.get('/:id', validation.validateId, courseController.getCourseById.bind(courseController));

// GET courses by user (by email or ID)
router.get('/user/:identifier', courseController.getCoursesByUser.bind(courseController));

// GET user enrollments
router.get('/user/:identifier/enrollments', courseController.getUserEnrollments.bind(courseController));

// CREATE new course
router.post(
  '/',
  validation.validateRequired(['name', 'description']),
  courseController.createCourse.bind(courseController)
);

// UPDATE course
router.put('/:id', validation.validateId, courseController.updateCourse.bind(courseController));

// DELETE course
router.delete('/:id', validation.validateId, courseController.deleteCourse.bind(courseController));

// ENROLL user in course
router.post(
  '/:courseId/enroll',
  validation.validateId,
  courseController.enrollUser.bind(courseController)
);

// UNENROLL user from course
router.delete(
  '/:courseId/enroll',
  validation.validateId,
  courseController.unenrollUser.bind(courseController)
);

module.exports = router;
