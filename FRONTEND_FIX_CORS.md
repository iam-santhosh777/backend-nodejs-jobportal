# Fix: CORS Error - Frontend Trying to Connect to Localhost

## 🐛 The Problem

Your frontend is deployed on Vercel (`https://frontend-reactjs-jobportal-fni2umwwn.vercel.app`) but it's still trying to connect to `http://localhost:3000` instead of your Railway backend.

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/login' 
from origin 'https://frontend-reactjs-jobportal-fni2umwwn.vercel.app' 
has been blocked by CORS policy
```

## ✅ The Solution

Your frontend needs to use your **Railway backend URL** in production, not `localhost:3000`.

## 🔧 Steps to Fix

### Step 1: Get Your Railway Backend URL

1. Go to Railway Dashboard: https://railway.app
2. Click on your backend service
3. Go to **Settings** → **Domains**
4. Copy your Railway URL: `https://your-app-name.up.railway.app`

### Step 2: Update Frontend Environment Variables

In your **frontend project**, update your environment variables:

**`.env.production`** (for Vercel production):
```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

**`.env.development`** (for local development):
```env
VITE_API_URL=http://localhost:3000
```

### Step 3: Update Frontend API Configuration

Make sure your frontend code uses the environment variable:

**Example (Vite/React):**
```javascript
// src/config/api.js or src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default API_URL;
```

**Example (Create React App):**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default API_URL;
```

### Step 4: Update All API Calls

Make sure all your API calls use the environment variable:

```javascript
// ❌ WRONG - Hardcoded localhost
const response = await fetch('http://localhost:3000/api/auth/login', {...});

// ✅ CORRECT - Use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const response = await fetch(`${API_URL}/api/auth/login`, {...});
```

### Step 5: Update Socket.io Connection

```javascript
// ❌ WRONG
const socket = io('http://localhost:3000', {...});

// ✅ CORRECT
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const socket = io(API_URL, {...});
```

### Step 6: Redeploy Frontend to Vercel

After updating the environment variables:

1. **Commit and push** your changes to GitHub
2. Vercel will **automatically redeploy**
3. Or manually trigger deployment in Vercel Dashboard

### Step 7: Set Environment Variables in Vercel

In **Vercel Dashboard** → Your Frontend Project → Settings → Environment Variables:

Add:
```
VITE_API_URL=https://your-railway-backend.up.railway.app
```

Make sure to:
- Select **Production** environment
- Optionally add for **Preview** and **Development** too

## 📋 Quick Checklist

- [ ] Got Railway backend URL
- [ ] Updated `.env.production` with Railway URL
- [ ] Updated all API calls to use environment variable
- [ ] Updated Socket.io connection to use environment variable
- [ ] Set `VITE_API_URL` in Vercel environment variables
- [ ] Redeployed frontend to Vercel
- [ ] Tested the connection

## 🧪 Test After Fix

After redeploying, test from your Vercel frontend:

```javascript
// In browser console on your Vercel frontend
fetch('https://your-railway-backend.up.railway.app/api/health')
  .then(res => res.json())
  .then(data => console.log('Backend connected:', data));
```

## 💡 Why This Happened

- **Localhost** (`http://localhost:3000`) only works when:
  - Your frontend is running locally
  - Your backend is running locally
  - Both are on the same machine

- **In production** (Vercel frontend):
  - Frontend is on Vercel's servers
  - `localhost` refers to Vercel's servers, not your machine
  - You need the **public Railway URL** instead

## 🎯 Summary

**Change this:**
```javascript
// ❌ Production frontend trying to use localhost
const API_URL = 'http://localhost:3000';
```

**To this:**
```javascript
// ✅ Use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

And set `VITE_API_URL=https://your-railway-backend.up.railway.app` in Vercel!


