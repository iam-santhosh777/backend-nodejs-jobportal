# Railway Deployment Guide

## 🚀 Why Railway?

- ✅ Already using Railway for MySQL
- ✅ Supports Socket.io (real-time features work!)
- ✅ Persistent file storage
- ✅ Traditional Node.js server (no serverless limitations)
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS

## 📋 Prerequisites

1. Railway account (you already have one)
2. GitHub repository with your code
3. Railway MySQL service (already set up)

## 🛠️ Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login to your account

2. **Create New Service**
   - Click "New Project" (or add to existing project)
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js

3. **Link MySQL Database**
   - In your new service, click "Variables" tab
   - Click "New Variable"
   - Select "Reference Variable"
   - Choose your MySQL service
   - Select `DATABASE_URL` or `MYSQL_URL`
   - This will auto-populate your database connection

4. **Add Environment Variables**
   - `JWT_SECRET` - Set a strong secret key
   - `NODE_ENV=production`
   - `CLIENT_URL` - Your frontend URL (for CORS)
   - `PORT` - Railway sets this automatically (optional)

5. **Deploy**
   - Railway will automatically build and deploy
   - Watch the build logs
   - Your app will be live at: `https://your-app-name.up.railway.app`

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```
   - Select your project
   - Link to existing MySQL service

4. **Add Environment Variables**
   ```bash
   railway variables set JWT_SECRET=your-secret-key
   railway variables set NODE_ENV=production
   railway variables set CLIENT_URL=https://your-frontend-url.com
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## 🔧 Post-Deployment Steps

### 1. Initialize Database

After first deployment, run the database initialization:

**Via Railway Dashboard:**
- Go to your service → "Deployments" tab
- Click on the latest deployment
- Open "Shell" or "Logs"
- Run: `npm run init-db`

**Via Railway CLI:**
```bash
railway run npm run init-db
```

### 2. Verify Deployment

- Check health endpoint: `https://your-app.up.railway.app/api/health`
- Test login: `POST https://your-app.up.railway.app/api/auth/login`

## 📝 Environment Variables Checklist

Make sure these are set in Railway:

```
✅ DATABASE_URL or MYSQL_URL (from MySQL service)
✅ JWT_SECRET (set your own strong secret)
✅ NODE_ENV=production
✅ CLIENT_URL (your frontend URL for CORS)
✅ PORT (auto-set by Railway, but can override)
```

## 🗂️ File Storage

Railway provides persistent storage, so file uploads will work correctly:
- Files stored in `/uploads/resumes/` will persist
- No need for cloud storage (unlike Vercel)

## 🔔 Socket.io

Socket.io works perfectly on Railway! Your real-time features will function normally.

## 📊 Monitoring

- View logs in Railway Dashboard → Your Service → "Logs"
- Monitor deployments in "Deployments" tab
- Check metrics in "Metrics" tab

## 🔄 Continuous Deployment

Railway automatically deploys when you push to your GitHub repository's main branch.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly linked from MySQL service
- Check MySQL service is running
- Ensure database exists

### Build Failures
- Check `package.json` has correct start script
- Verify all dependencies are in `dependencies` (not `devDependencies`)
- Check build logs for errors

### Port Issues
- Railway sets `PORT` automatically
- Don't hardcode port 3000
- Use `process.env.PORT || 3000` (already done in server.js)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway service created
- [ ] MySQL database linked
- [ ] Environment variables set
- [ ] Service deployed successfully
- [ ] Database initialized (`npm run init-db`)
- [ ] Health check passes
- [ ] API endpoints tested
- [ ] Socket.io connection tested (if using frontend)

## 🎉 You're Live!

Your backend is now deployed at: `https://your-app-name.up.railway.app`

Update your frontend to use this URL instead of `localhost:3000`.

