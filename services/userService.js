/**
 * User Service
 * Business logic for users
 */

const userRepository = require('../repositories/userRepository');

class UserService {
  /**
   * Get all users
   */
  async getAllUsers() {
    return await userRepository.findAll();
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    const { name, email, age } = userData;

    // Validate required fields
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return await userRepository.create({ name, email, age });
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If email is being updated, check for duplicates
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new Error('User with this email already exists');
      }
    }

    // Merge with existing data
    const updatedData = {
      name: userData.name || existingUser.name,
      email: userData.email || existingUser.email,
      age: userData.age !== undefined ? userData.age : existingUser.age
    };

    return await userRepository.update(id, updatedData);
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await userRepository.delete(id);
    return true;
  }
}

module.exports = new UserService();




