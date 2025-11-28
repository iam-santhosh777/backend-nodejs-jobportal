/**
 * Job Collection Controller
 * Handles HTTP requests for job collections
 * HR can create and manage job collections for organization purposes
 */

const collectionService = require('../services/collectionService');
const ApiResponse = require('../utils/response');

class CollectionController {
  /**
   * Get all job collections
   */
  async getAllCollections(req, res, next) {
    try {
      const collections = await collectionService.getAllCollections();
      return ApiResponse.success(res, collections);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get job collection by ID
   */
  async getCollectionById(req, res, next) {
    try {
      const { id } = req.params;
      const collection = await collectionService.getCollectionById(id);
      return ApiResponse.success(res, collection);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get job collections by user (HR who created them)
   */
  async getCollectionsByUser(req, res, next) {
    try {
      const { identifier } = req.params;
      const { by } = req.query;
      const collections = await collectionService.getCollectionsByUser(identifier, by);
      return ApiResponse.success(res, collections);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new job collection (HR only)
   */
  async createCollection(req, res, next) {
    try {
      const collection = await collectionService.createCollection(req.body);
      return ApiResponse.created(res, collection, 'Job collection created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update job collection (HR only)
   */
  async updateCollection(req, res, next) {
    try {
      const { id } = req.params;
      const collection = await collectionService.updateCollection(id, req.body);
      return ApiResponse.success(res, collection, 'Job collection updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete job collection (HR only)
   */
  async deleteCollection(req, res, next) {
    try {
      await collectionService.deleteCollection(req.params.id);
      return ApiResponse.success(res, null, 'Job collection deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CollectionController();

