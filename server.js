const express = require('express');
const http = require('http');
const cors = require('cors');
const { testConnection } = require('./config/database');
const errorHandler = require('./src/middleware/errorHandler');
const initializeSocket = require('./src/sockets/socketHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const jobRoutes = require('./src/routes/jobs');
const resumeRoutes = require('./src/routes/resumes');
const dashboardRoutes = require('./src/routes/dashboard');
const applicationRoutes = require('./src/routes/applications');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket handler
initializeSocket(io);

// Make io available to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/applications', applicationRoutes);
// Alias for stats (some UIs might call /api/stats)
app.use('/api/stats', dashboardRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'HRMS + Job Portal API is running!',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      jobs: {
        getActive: 'GET /api/jobs',
        create: 'POST /api/jobs (HR only)',
        expire: 'PATCH /api/jobs/:id/expire (HR only)',
        apply: 'POST /api/jobs/:id/apply (USER only)',
        getHRJobs: 'GET /api/jobs/hr/my-jobs (HR only)'
      },
      resumes: {
        upload: 'POST /api/resumes/upload (HR only)',
        getAll: 'GET /api/resumes (HR only)'
      },
      dashboard: {
        analytics: 'GET /api/dashboard (HR only)',
        stats: 'GET /api/stats (HR only, alias for /api/dashboard)'
      },
      applications: {
        hrAll: 'GET /api/applications/hr/all (HR only)',
        jobApplications: 'GET /api/applications/job/:jobId (HR only)',
        userApplications: 'GET /api/applications/my-applications (USER only)'
      },
      health: 'GET /api/health'
    }
  });
});

// Health check with DB connection test
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'OK',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    socket: 'Active'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler.notFound);
app.use(errorHandler.handle);

// Start server
server.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io is ready for real-time connections`);
  await testConnection();
});
