# Quick Start Guide - HRMS + Job Portal

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env` file:
```env
MYSQL_URL=mysql://user:password@host:port/database
# Or use individual variables:
# DB_HOST=hostname
# DB_PORT=3306
# DB_USER=username
# DB_PASSWORD=password
# DB_NAME=database
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

### Step 3: Initialize Database
```bash
npm run init-db
```

This will create:
- All required tables (users, jobs, applications, resumes)
- Sample users:
  - **HR**: `hr@example.com` / `password123`
  - **USER**: `user@example.com` / `password123`

### Step 4: Start the Server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 🧪 Quick Test

### 1. Login as HR
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"password123"}'
```

Copy the `token` from response.

### 2. Create a Job
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Software Engineer",
    "description": "We are hiring!",
    "salary": "$80,000",
    "location": "Remote"
  }'
```

### 3. View Active Jobs
```bash
curl http://localhost:3000/api/jobs
```

### 4. Login as User and Apply
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Apply (use token from login)
curl -X POST http://localhost:3000/api/jobs/1/apply \
  -H "Authorization: Bearer USER_TOKEN_HERE"
```

## 📡 Socket.io Testing

Connect with authentication:
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('new-application', (data) => {
  console.log('New application:', data);
});

socket.on('job-expired', (data) => {
  console.log('Job expired:', data);
});
```

## 📚 Full Documentation

See `HRMS_API_DOCUMENTATION.md` for complete API documentation.

## 🐛 Troubleshooting

### Database Connection Failed
- Check your `DATABASE_URL` in `.env`
- Ensure MySQL is running
- Verify database credentials

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 3000

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## ✅ Next Steps

1. Change default passwords
2. Set a strong `JWT_SECRET`
3. Configure CORS for your frontend
4. Set up production environment variables
5. Deploy to Railway!

