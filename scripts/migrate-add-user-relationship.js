/**
 * Migration Script: Add User-Course Relationship
 * This script adds user_id foreign key to courses table and creates enrollment table
 * 
 * Usage: node scripts/migrate-add-user-relationship.js
 */

const { pool } = require('../config/database');

async function migrateDatabase() {
  let connection;
  
  try {
    connection = await pool.getConnection();
    console.log('✅ Connected to database');

    // Check if user_id column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'courses' 
      AND COLUMN_NAME = 'user_id'
    `);

    if (columns.length === 0) {
      // Add user_id foreign key to courses table
      console.log('📝 Adding user_id column to courses table...');
      await connection.execute(`
        ALTER TABLE courses 
        ADD COLUMN user_id INT,
        ADD CONSTRAINT fk_course_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE SET NULL
      `);
      console.log('✅ user_id column added to courses table!');
    } else {
      console.log('ℹ️  user_id column already exists in courses table');
    }

    // Create enrollment table for many-to-many relationship
    const createEnrollmentTableSQL = `
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_enrollment (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `;

    await connection.execute(createEnrollmentTableSQL);
    console.log('✅ Enrollments table created successfully!');

    console.log('\n🎉 Migration complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    console.error('\n💡 If you see errors:');
    console.error('   1. Make sure users and courses tables exist');
    console.error('   2. Check your database connection');
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Run migration
migrateDatabase();




