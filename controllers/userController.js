/**
 * User Controller
 * Handles HTTP requests for users
 */

const userService = require('../services/userService');
const ApiResponse = require('../utils/response');

class UserController {
  /**
   * Get all users
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return ApiResponse.success(res, users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      return ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new user
   */
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return ApiResponse.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);
      return ApiResponse.success(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      return ApiResponse.success(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();




