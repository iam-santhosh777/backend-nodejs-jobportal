/**
 * Enrollment Repository
 * Data access layer for enrollments
 */

const { pool } = require('../config/database');

class EnrollmentRepository {
  /**
   * Find enrollment by user ID and course ID
   */
  async findByUserAndCourse(userId, courseId) {
    const [rows] = await pool.execute(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    return rows[0] || null;
  }

  /**
   * Find all enrollments for a user
   */
  async findByUserId(userId) {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        e.enrolled_at,
        u.id as instructor_id,
        u.name as instructor_name,
        u.email as instructor_email
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `, [userId]);
    return rows;
  }

  /**
   * Create a new enrollment
   */
  async create(userId, courseId) {
    const [result] = await pool.execute(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [userId, courseId]
    );
    return this.findByUserAndCourse(userId, courseId);
  }

  /**
   * Delete enrollment
   */
  async delete(userId, courseId) {
    await pool.execute(
      'DELETE FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    return true;
  }

  /**
   * Check if enrollment exists
   */
  async exists(userId, courseId) {
    const enrollment = await this.findByUserAndCourse(userId, courseId);
    return enrollment !== null;
  }
}

module.exports = new EnrollmentRepository();




