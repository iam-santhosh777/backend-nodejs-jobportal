/**
 * User Repository
 * Data access layer for users
 */

const { pool } = require('../config/database');

class UserRepository {
  /**
   * Find all users
   */
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY id DESC');
    return rows;
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  /**
   * Create a new user
   */
  async create(userData) {
    const { name, email, age } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );
    return this.findById(result.insertId);
  }

  /**
   * Update user by ID
   */
  async update(id, userData) {
    const { name, email, age } = userData;
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age, id]
    );
    return this.findById(id);
  }

  /**
   * Delete user by ID
   */
  async delete(id) {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  /**
   * Check if user exists by ID
   */
  async exists(id) {
    const user = await this.findById(id);
    return user !== null;
  }
}

module.exports = new UserRepository();


