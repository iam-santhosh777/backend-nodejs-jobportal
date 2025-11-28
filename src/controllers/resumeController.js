const Resume = require('../models/Resume');
const path = require('path');

class ResumeController {
  // HR: Upload multiple resumes
  async uploadResumes(req, res, next) {
    try {
      const hrId = req.user.id;
      const { jobId } = req.body; // Optional jobId
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedResumes = [];
      const failedResumes = [];

      // Process each file
      for (const file of files) {
        try {
          // Handle both disk storage (file.path) and memory storage (file.buffer)
          // In serverless (Vercel), files are in memory, so we use a placeholder path
          const filePath = file.path || `memory://${Date.now()}-${file.originalname}`;
          
          const resume = await Resume.create({
            jobId: jobId || null,
            hrId,
            filename: file.originalname,
            filePath: filePath,
            status: 'uploaded'
          });

          uploadedResumes.push({
            id: resume.id,
            filename: resume.filename,
            filePath: resume.file_path,
            status: resume.status
          });
        } catch (error) {
          // If DB insert fails, mark file as failed
          failedResumes.push({
            filename: file.originalname,
            error: error.message
          });
        }
      }

      const response = {
        success: true,
        message: `Processed ${files.length} file(s)`,
        data: {
          uploaded: uploadedResumes,
          failed: failedResumes
        }
      };

      // If there are failures, return 207 (Multi-Status) or 200 with failed list
      const statusCode = failedResumes.length > 0 ? 207 : 200;
      
      res.status(statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  // HR: Get all resumes
  async getResumes(req, res, next) {
    try {
      const hrId = req.user.id;
      const resumes = await Resume.findByHR(hrId);

      res.status(200).json({
        success: true,
        message: 'Resumes retrieved successfully',
        data: resumes,
        count: resumes.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResumeController();

