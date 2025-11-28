const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const upload = require('../utils/multerConfig');

// HR: Upload multiple resumes
router.post(
  '/upload',
  verifyToken,
  authorizeRole('HR'),
  upload.array('resumes', 10), // Max 10 files
  resumeController.uploadResumes.bind(resumeController)
);

// HR: Get all resumes
router.get(
  '/',
  verifyToken,
  authorizeRole('HR'),
  resumeController.getResumes.bind(resumeController)
);

module.exports = router;

