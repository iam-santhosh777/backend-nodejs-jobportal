/**
 * User Routes
 * Thin route layer that delegates to controllers
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validation = require('../middleware/validation');

// GET all users
router.get('/', userController.getAllUsers.bind(userController));

// GET user by ID
router.get('/:id', validation.validateId, userController.getUserById.bind(userController));

// CREATE new user
router.post(
  '/',
  validation.validateRequired(['name', 'email']),
  validation.validateEmail,
  userController.createUser.bind(userController)
);

// UPDATE user
router.put(
  '/:id',
  validation.validateId,
  validation.validateEmail,
  userController.updateUser.bind(userController)
);

// DELETE user
router.delete('/:id', validation.validateId, userController.deleteUser.bind(userController));

module.exports = router;
