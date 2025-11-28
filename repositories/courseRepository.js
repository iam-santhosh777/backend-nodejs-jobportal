/**
 * Course Repository
 * Data access layer for courses
 */

const { pool } = require('../config/database');

class CourseRepository {
  /**
   * Find all courses with user information
   */
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM courses c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.id DESC
    `);
    return rows;
  }

  /**
   * Find course by ID with user information
   */
  async findById(id) {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM courses c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [id]);
    return rows[0] || null;
  }

  /**
   * Find courses by user ID
   */
  async findByUserId(userId) {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM courses c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.id DESC
    `, [userId]);
    return rows;
  }

  /**
   * Create a new course
   */
  async create(courseData) {
    const { name, description, user_id } = courseData;
    const [result] = await pool.execute(
      'INSERT INTO courses (name, description, user_id) VALUES (?, ?, ?)',
      [name, description, user_id || null]
    );
    return this.findById(result.insertId);
  }

  /**
   * Update course by ID
   */
  async update(id, courseData) {
    const { name, description, user_id } = courseData;
    await pool.execute(
      'UPDATE courses SET name = ?, description = ?, user_id = ? WHERE id = ?',
      [name, description, user_id, id]
    );
    return this.findById(id);
  }

  /**
   * Delete course by ID
   */
  async delete(id) {
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    return true;
  }

  /**
   * Check if course exists by ID
   */
  async exists(id) {
    const course = await this.findById(id);
    return course !== null;
  }
}

module.exports = new CourseRepository();



