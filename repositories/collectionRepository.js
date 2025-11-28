/**
 * Job Collection Repository
 * Data access layer for job collections
 */

const { pool } = require('../config/database');

class CollectionRepository {
  /**
   * Find all job collections with user information
   */
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM collections c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.id DESC
    `);
    return rows;
  }

  /**
   * Find job collection by ID with user information
   */
  async findById(id) {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM collections c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [id]);
    return rows[0] || null;
  }

  /**
   * Find job collections by user ID
   */
  async findByUserId(userId) {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM collections c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.id DESC
    `, [userId]);
    return rows;
  }

  /**
   * Create a new job collection
   */
  async create(collectionData) {
    const { name, description, user_id } = collectionData;
    const [result] = await pool.execute(
      'INSERT INTO collections (name, description, user_id) VALUES (?, ?, ?)',
      [name, description, user_id || null]
    );
    return this.findById(result.insertId);
  }

  /**
   * Update job collection by ID
   */
  async update(id, collectionData) {
    const { name, description, user_id } = collectionData;
    await pool.execute(
      'UPDATE collections SET name = ?, description = ?, user_id = ? WHERE id = ?',
      [name, description, user_id, id]
    );
    return this.findById(id);
  }

  /**
   * Delete job collection by ID
   */
  async delete(id) {
    await pool.execute('DELETE FROM collections WHERE id = ?', [id]);
    return true;
  }

  /**
   * Check if job collection exists by ID
   */
  async exists(id) {
    const collection = await this.findById(id);
    return collection !== null;
  }
}

module.exports = new CollectionRepository();

