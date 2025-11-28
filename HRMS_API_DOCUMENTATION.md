# HRMS + Job Portal API Documentation

A complete backend system for HRMS (Human Resource Management System) and Job Portal built with Node.js, Express.js, MySQL, and Socket.io.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (RBAC)
- **Job Management**: Create, view, and manage job postings
- **Application System**: Users can apply to jobs, HR can track applications
- **Resume Management**: HR can upload and manage resumes
- **Real-time Updates**: Socket.io integration for instant notifications
- **File Upload**: Multer-based file handling for resume uploads
- **Analytics Dashboard**: HR dashboard with comprehensive statistics

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database (local or Railway)
- npm or yarn

## 🛠 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   MYSQL_URL=mysql://user:password@host:port/database
   # Or use individual variables:
   # DB_HOST=hostname
   # DB_PORT=3306
   # DB_USER=username
   # DB_PASSWORD=password
   # DB_NAME=database
   JWT_SECRET=your-secret-key
   PORT=3000
   ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & error handling
│   ├── services/         # Business logic
│   ├── sockets/          # Socket.io handlers
│   └── utils/            # Utilities (multer config, etc.)
├── config/
│   └── database.js       # Database configuration
├── uploads/
│   └── resumes/          # Uploaded resume files
├── scripts/
│   └── init-database.js  # Database initialization
└── server.js             # Main server file
```

## 🔐 Authentication

### Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "hr@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "HR Manager",
      "email": "hr@example.com",
      "role": "HR"
    }
  }
}
```

### Register (Optional - for testing)
**POST** `/api/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

## 👔 HR APIs

All HR endpoints require authentication token in header:
```
Authorization: Bearer <token>
```

### Create Job
**POST** `/api/jobs`

Request body:
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for an experienced software engineer...",
  "salary": "$80,000 - $120,000",
  "location": "Remote"
}
```

### Mark Job as Expired
**PATCH** `/api/jobs/:id/expire`

### Upload Resumes
**POST** `/api/resumes/upload`

- Content-Type: `multipart/form-data`
- Field name: `resumes` (array of files)
- Optional field: `jobId`

Request:
```
Form Data:
  resumes: [file1.pdf, file2.pdf, ...]
  jobId: 1 (optional)
```

Response:
```json
{
  "success": true,
  "message": "Processed 3 file(s)",
  "data": {
    "uploaded": [
      {
        "id": 1,
        "filename": "resume1.pdf",
        "filePath": "uploads/resumes/resume1-1234567890.pdf",
        "status": "uploaded"
      }
    ],
    "failed": []
  }
}
```

### Get All Resumes
**GET** `/api/resumes`

### Get Dashboard Analytics
**GET** `/api/dashboard`

Response:
```json
{
  "success": true,
  "message": "Dashboard analytics retrieved successfully",
  "data": {
    "totalJobs": 15,
    "totalActiveJobs": 12,
    "totalExpired": 3,
    "totalApplications": 45,
    "totalResumesUploaded": 20,
    "uploadedResumes": 18,
    "failedResumes": 2
  }
}
```

### Get HR's Jobs
**GET** `/api/jobs/hr/my-jobs`

## 👤 User APIs

All User endpoints require authentication token in header:
```
Authorization: Bearer <token>
```

### Get Active Jobs
**GET** `/api/jobs`

Returns all active (non-expired) jobs.

### Apply for Job
**POST** `/api/jobs/:id/apply`

Applies the authenticated user to the specified job.

## 🔔 Real-Time Events (Socket.io)

### Connection
Connect to Socket.io server with authentication:
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events Emitted by Server

1. **new-application** (to HR users)
   ```json
   {
     "applicationId": 1,
     "jobId": 5,
     "jobTitle": "Senior Developer",
     "userId": 3,
     "message": "New application received for job: Senior Developer"
   }
   ```

2. **job-expired** (to all users)
   ```json
   {
     "jobId": 5,
     "jobTitle": "Senior Developer",
     "message": "Job \"Senior Developer\" has been marked as expired"
   }
   ```

### Events You Can Emit

- **ping**: Test connection
  ```javascript
  socket.emit('ping');
  ```

## 📊 Database Schema

### Users
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR - bcrypt hashed)
- `role` (VARCHAR: 'HR' | 'USER')
- `created_at` (TIMESTAMP)

### Jobs
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `salary` (VARCHAR)
- `location` (VARCHAR)
- `expiry_status` (VARCHAR: 'active' | 'expired')
- `posted_by` (INTEGER, FK to users)
- `created_at` (TIMESTAMP)

### Applications
- `id` (SERIAL PRIMARY KEY)
- `job_id` (INTEGER, FK to jobs)
- `user_id` (INTEGER, FK to users)
- `status` (VARCHAR: 'pending' | 'accepted' | 'rejected')
- `created_at` (TIMESTAMP)
- UNIQUE(job_id, user_id)

### Resumes
- `id` (SERIAL PRIMARY KEY)
- `job_id` (INTEGER, FK to jobs, nullable)
- `hr_id` (INTEGER, FK to users)
- `filename` (VARCHAR)
- `file_path` (VARCHAR)
- `status` (VARCHAR: 'uploaded' | 'failed')
- `created_at` (TIMESTAMP)

## 🔒 Role-Based Access Control

### HR Role
- Can create jobs
- Can mark jobs as expired
- Can upload resumes
- Can view dashboard analytics
- Can view all their jobs

### USER Role
- Can view active jobs
- Can apply to jobs

## 📝 Sample Users (Created by init-db script)

- **HR**: `hr@example.com` / `password123`
- **USER**: `user@example.com` / `password123`

⚠️ **Change these passwords in production!**

## 🧪 Testing with cURL

### Login as HR
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"password123"}'
```

### Create Job (use token from login)
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Full Stack Developer",
    "description": "Looking for experienced developer",
    "salary": "$70,000 - $100,000",
    "location": "San Francisco, CA"
  }'
```

### Get Active Jobs
```bash
curl http://localhost:3000/api/jobs
```

### Apply for Job (as USER)
```bash
curl -X POST http://localhost:3000/api/jobs/1/apply \
  -H "Authorization: Bearer USER_TOKEN"
```

## 🚢 Railway Deployment

1. Create a MySQL service on Railway
2. Add environment variables:
   - `DATABASE_URL` (auto-provided by Railway)
   - `JWT_SECRET` (set your own)
   - `PORT` (Railway sets this automatically)
   - `NODE_ENV=production`
3. Deploy your code
4. Run database initialization:
   ```bash
   npm run init-db
   ```

## 🐛 Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 📦 Dependencies

- **express**: Web framework
- **mysql2**: MySQL client
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **multer**: File upload handling
- **socket.io**: Real-time communication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

## 🔧 Development

- **Auto-reload**: Uses nodemon in dev mode
- **File uploads**: Stored in `uploads/resumes/`
- **Logging**: Console logs for debugging
- **Error stack**: Shown in development, hidden in production

## 📄 License

ISC

