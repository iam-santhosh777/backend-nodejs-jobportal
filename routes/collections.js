/**
 * Job Collection Routes
 * Thin route layer that delegates to controllers
 * Collections are for HR organization - users apply to jobs directly
 */

const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const validation = require('../middleware/validation');

// GET all job collections
router.get('/', collectionController.getAllCollections.bind(collectionController));

// GET job collection by ID
router.get('/:id', validation.validateId, collectionController.getCollectionById.bind(collectionController));

// GET job collections by user (by email or ID)
router.get('/user/:identifier', collectionController.getCollectionsByUser.bind(collectionController));

// CREATE new job collection
router.post(
  '/',
  validation.validateRequired(['name', 'description']),
  collectionController.createCollection.bind(collectionController)
);

// UPDATE job collection
router.put('/:id', validation.validateId, collectionController.updateCollection.bind(collectionController));

// DELETE job collection
router.delete('/:id', validation.validateId, collectionController.deleteCollection.bind(collectionController));

module.exports = router;

