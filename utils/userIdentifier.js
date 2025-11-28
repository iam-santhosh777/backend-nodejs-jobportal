/**
 * User Identifier Utility
 * Helper functions to resolve user identifiers (email or ID)
 */

const userRepository = require('../repositories/userRepository');

class UserIdentifier {
  /**
   * Resolve user ID from email or ID
   * @param {string|number} identifier - User email or ID
   * @param {string} by - 'email' or 'id' (optional, auto-detected if not provided)
   * @returns {Promise<number>} User ID
   */
  async resolveUserId(identifier, by = null) {
    // Auto-detect if identifier is an email
    if (by === 'email' || (!by && typeof identifier === 'string' && identifier.includes('@'))) {
      const user = await userRepository.findByEmail(identifier);
      if (!user) {
        throw new Error(`User with email ${identifier} not found`);
      }
      return user.id;
    }

    // Assume it's an ID
    const userId = parseInt(identifier);
    if (isNaN(userId)) {
      throw new Error(`Invalid user identifier: ${identifier}`);
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return userId;
  }
}

module.exports = new UserIdentifier();



