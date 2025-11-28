# Railway Backend URL & Frontend Integration Guide

## 🔗 Getting Your Railway Backend URL

### Method 1: Railway Dashboard

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login to your account

2. **Select Your Backend Service**
   - Click on your deployed backend service

3. **Get the URL**
   - Click on the **"Settings"** tab
   - Scroll to **"Domains"** section
   - You'll see your Railway URL: `https://your-app-name.up.railway.app`
   - Or check the **"Deployments"** tab → Latest deployment → You'll see the URL there

### Method 2: Railway CLI

```bash
railway domain
```

## 🌐 Setting Up Custom Domain (Optional)

1. In Railway Dashboard → Your Service → Settings → Domains
2. Click "Generate Domain" or "Custom Domain"
3. Railway will provide: `https://your-app-name.up.railway.app`
4. For custom domain, add your domain and configure DNS

## 🔧 Frontend Configuration

### Step 1: Update Frontend Environment Variables

Create or update your frontend `.env` file:

```env
# For development
VITE_API_URL=http://localhost:3000
# or
REACT_APP_API_URL=http://localhost:3000

# For production (Railway backend)
VITE_API_URL=https://your-app-name.up.railway.app
# or
REACT_APP_API_URL=https://your-app-name.up.railway.app
```

### Step 2: Update Frontend API Calls

**If using Axios:**
```javascript
// axios.js or api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**If using Fetch:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  return response.json();
};
```

### Step 3: Update Socket.io Connection (Frontend)

```javascript
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');

const socket = io(API_URL, {
  auth: {
    token: token
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to backend');
});

socket.on('new-application', (data) => {
  console.log('New application:', data);
  // Handle new application notification
});

socket.on('job-expired', (data) => {
  console.log('Job expired:', data);
  // Handle job expired notification
});
```

## 🔒 Update CORS in Railway Backend

Make sure your Railway backend allows your frontend domain:

1. **Go to Railway Dashboard** → Your Service → Variables
2. **Add/Update:**
   ```
   CLIENT_URL=https://frontend-reactjs-jobportal-fni2umwwn.vercel.app
   ```
   Or for multiple domains (comma-separated):
   ```
   CLIENT_URL=https://frontend-reactjs-jobportal-fni2umwwn.vercel.app,https://your-other-domain.com
   ```

**Note:** The backend is already configured to allow `https://frontend-reactjs-jobportal-fni2umwwn.vercel.app` by default, but setting `CLIENT_URL` in Railway will override the default and give you more control.

3. **Update server.js CORS** (if needed):
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL?.split(',') || '*',
     credentials: true
   }));
   ```

## 📋 Complete Frontend Setup Example

### React/Vite Example

**`.env.development`:**
```env
VITE_API_URL=http://localhost:3000
```

**`.env.production`:**
```env
VITE_API_URL=https://your-app-name.up.railway.app
```

**`src/config/api.js`:**
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**`src/services/auth.js`:**
```javascript
import axios from 'axios';
import { API_URL } from '../config/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password
  });
  return response.data;
};
```

## ✅ Testing the Connection

### 1. Test Backend Health
```bash
curl https://your-app-name.up.railway.app/api/health
```

### 2. Test Login
```bash
curl -X POST https://your-app-name.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"password123"}'
```

### 3. Test from Frontend
```javascript
// In your frontend console or component
fetch('https://your-app-name.up.railway.app/api/health')
  .then(res => res.json())
  .then(data => console.log('Backend connected:', data));
```

## 🐛 Common Issues & Solutions

### CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:** 
- Add your frontend URL to `CLIENT_URL` in Railway
- Check CORS configuration in `server.js`

### Socket.io Connection Failed
**Problem:** WebSocket connection fails
**Solution:**
- Ensure Railway URL uses HTTPS
- Check Socket.io transport settings
- Verify token is being sent in auth

### 404 Errors
**Problem:** API endpoints return 404
**Solution:**
- Verify Railway deployment is successful
- Check logs in Railway Dashboard
- Ensure routes are correctly configured

### Database Connection Issues
**Problem:** Backend can't connect to MySQL
**Solution:**
- Verify `MYSQL_URL` is linked from MySQL service
- Check MySQL service is running
- Run `npm run init-db` if tables don't exist

## 📝 Quick Checklist

- [ ] Got Railway backend URL
- [ ] Updated frontend `.env` with Railway URL
- [ ] Updated all API calls to use environment variable
- [ ] Updated Socket.io connection URL
- [ ] Set `CLIENT_URL` in Railway for CORS
- [ ] Tested health endpoint
- [ ] Tested login endpoint
- [ ] Verified Socket.io connection
- [ ] Tested file uploads (if applicable)

## 🎉 You're Connected!

Your frontend should now be connected to your Railway backend!

**Backend URL:** `https://your-app-name.up.railway.app`
**Frontend should use:** `https://your-app-name.up.railway.app/api/...`

