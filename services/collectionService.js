/**
 * Job Collection Service
 * Business logic for job collections
 * Collections are used by HR to organize jobs - users apply to jobs directly
 */

const collectionRepository = require('../repositories/collectionRepository');
const userIdentifier = require('../utils/userIdentifier');

class CollectionService {
  /**
   * Get all job collections
   */
  async getAllCollections() {
    return await collectionRepository.findAll();
  }

  /**
   * Get job collection by ID
   */
  async getCollectionById(id) {
    const collection = await collectionRepository.findById(id);
    if (!collection) {
      throw new Error('Job collection not found');
    }
    return collection;
  }

  /**
   * Get job collections by user identifier (email or ID)
   */
  async getCollectionsByUser(identifier, by = null) {
    const userId = await userIdentifier.resolveUserId(identifier, by);
    return await collectionRepository.findByUserId(userId);
  }

  /**
   * Create a new job collection
   */
  async createCollection(collectionData) {
    const { name, description, user_email, user_id } = collectionData;

    // Validate required fields
    if (!name || !description) {
      throw new Error('Name and description are required');
    }

    // Resolve user ID if email is provided
    let resolvedUserId = user_id;
    if (user_email && !user_id) {
      resolvedUserId = await userIdentifier.resolveUserId(user_email, 'email');
    }

    return await collectionRepository.create({
      name,
      description,
      user_id: resolvedUserId || null
    });
  }

  /**
   * Update job collection
   */
  async updateCollection(id, collectionData) {
    const collection = await collectionRepository.findById(id);
    if (!collection) {
      throw new Error('Job collection not found');
    }

    return await collectionRepository.update(id, {
      name: collectionData.name || collection.name,
      description: collectionData.description || collection.description,
      user_id: collectionData.user_id || collection.user_id
    });
  }

  /**
   * Delete job collection
   */
  async deleteCollection(id) {
    const collection = await collectionRepository.findById(id);
    if (!collection) {
      throw new Error('Job collection not found');
    }

    await collectionRepository.delete(id);
    return true;
  }
}

module.exports = new CollectionService();

