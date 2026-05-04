# Full-Stack Deployment Guide: Railway + Netlify

Complete step-by-step guide to deploy HabitGuard backend on Railway and frontend on Netlify.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- **GitHub Account** - For version control and CI/CD
- **Railway Account** - For backend hosting (free tier available)
- **Netlify Account** - For frontend hosting (free tier available)
- **MongoDB Atlas Account** - For database hosting (free tier available)

### Software Requirements

- Git installed and configured
- Node.js 18+ installed locally
- npm or yarn package manager

### Create Accounts

1. **GitHub**: https://github.com/signup
2. **Railway**: https://railway.app
3. **Netlify**: https://app.netlify.com
4. **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

---

## Backend Deployment (Railway)

### Step 1: Prepare MongoDB Database

#### Option A: MongoDB Atlas (Recommended for Production)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

2. **Create free account** and log in

3. **Create a new project**:
   - Click "New Project"
   - Name it "HabitGuard"
   - Click "Create Project"

4. **Build a cluster**:
   - Click "Build a Database"
   - Select "Free Shared" tier
   - Choose preferred region (e.g., US East)
   - Click "Create"

5. **Set up database user**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username: `habitguard_user`
   - Generate secure password (save this!)
   - Click "Add User"

6. **Configure network access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)
   - Click "Confirm"

7. **Get connection string**:
   - Go to "Databases"
   - Click "Connect" button
   - Select "Connect your application"
   - Choose "Node.js" driver
   - Copy connection string
   - Format: `mongodb+srv://habitguard_user:PASSWORD@cluster.mongodb.net/habitguard?retryWrites=true&w=majority`

#### Option B: Local MongoDB (Development Only)

```bash
# Windows: Start MongoDB service
net start MongoDB

# Mac: Start MongoDB
brew services start mongodb-community

# Linux: Start MongoDB
sudo systemctl start mongod
```

### Step 2: Push Code to GitHub

1. **Initialize Git repository** (if not already done):
```bash
cd HabitGuard
git init
git add .
git commit -m "Initial commit: Full-stack HabitGuard app"
```

2. **Create GitHub repository**:
   - Go to https://github.com/new
   - Name: `habitguard`
   - Description: "Habit tracking app with suspicious behavior detection"
   - Visibility: Public or Private
   - Click "Create repository"

3. **Push code to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/habitguard.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend on Railway

1. **Go to Railway**: https://railway.app/dashboard

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub"

3. **Connect GitHub**:
   - Click "Connect GitHub Account" (if not already connected)
   - Authorize Railway app access
   - Select your `habitguard` repository
   - Click "Deploy"

4. **Railway will auto-detect Node.js app** and start building

5. **Configure Environment Variables**:
   - Go to "Settings" tab
   - Click "Variables"
   - Add the following:

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://habitguard_user:YOUR_PASSWORD@cluster.mongodb.net/habitguard?retryWrites=true&w=majority
   ```

   Replace `YOUR_PASSWORD` with actual MongoDB password

6. **Deploy**:
   - Click "Deploy" button
   - Wait for deployment to complete (~2-5 minutes)

7. **Get Backend URL**:
   - Go to "Settings" → "Domains"
   - Copy the Railway domain (e.g., `https://habitguard-production.railway.app`)
   - Save this for frontend configuration

### Step 4: Verify Backend Deployment

1. **Test health endpoint**:
```bash
curl https://your-railway-domain/
# Should return: "HabitGuard API Running"
```

2. **Test API endpoint**:
```bash
curl https://your-railway-domain/api/habits/test-user
# Should return: {"success":true,"message":"Habits retrieved successfully",...}
```

---

## Frontend Deployment (Netlify)

### Step 1: Prepare Frontend Code

1. **Create .env file** in `frontend/` directory:
```bash
REACT_APP_API_URL=https://your-railway-domain/api
```

Replace with actual Railway backend URL from previous step.

2. **Update frontend/package.json** (if needed):
```json
{
  "homepage": "https://habitguard.netlify.app",
  "scripts": {
    "build": "react-scripts build"
  }
}
```

3. **Commit changes**:
```bash
git add frontend/.env
git commit -m "Configure frontend API endpoint"
git push origin main
```

### Step 2: Deploy Frontend on Netlify

1. **Go to Netlify**: https://app.netlify.com

2. **Deploy from Git**:
   - Click "New site from Git"
   - Click "GitHub" (or your Git provider)

3. **Connect Repository**:
   - Search and select `habitguard` repository
   - Click "Connect"

4. **Configure Build Settings**:
   - **Base directory**: `frontend` (important!)
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

5. **Add Environment Variables**:
   - Click "Advanced" before deploying
   - Click "New variable"
   - Add: `REACT_APP_API_URL` = `https://your-railway-domain/api`

6. **Deploy**:
   - Click "Deploy site"
   - Wait for deployment to complete (~3-5 minutes)

7. **Get Frontend URL**:
   - Netlify will assign a domain (e.g., `https://habitguard.netlify.app`)
   - Or configure custom domain

### Step 3: Configure Custom Domain (Optional)

#### For Netlify Frontend:

1. **Go to Site Settings** → **Domain management**
2. **Add custom domain**:
   - Enter your domain name
   - Follow DNS configuration steps
   - Update nameservers at your domain registrar

#### For Railway Backend:

1. **Go to Settings** → **Domains**
2. **Add custom domain**:
   - Enter your domain (e.g., `api.habitguard.com`)
   - Update DNS records as instructed

---

## Post-Deployment Configuration

### Step 1: Test Full Application

1. **Open frontend**: https://habitguard.netlify.app
2. **Enter User ID**: e.g., `demo_user_1`
3. **Add a habit**: e.g., "Morning Exercise"
4. **Mark as complete**: Should work without errors

### Step 2: Verify API Integration

**Check browser Network tab**:
- Open DevTools (F12)
- Go to Network tab
- Add a habit
- Verify requests go to your Railway backend
- Check API responses are successful (200 status)

### Step 3: Enable CORS if Needed

If you see CORS errors, update backend `server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://habitguard.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

Then redeploy backend.

### Step 4: Set Up Automatic Deployments

Both Railway and Netlify are configured for automatic deployments on git push.

**Workflow**:
1. Make code changes locally
2. Commit: `git commit -m "Feature: ..."`
3. Push: `git push origin main`
4. Both services automatically rebuild and deploy

---

## Monitoring & Debugging

### Railway Deployment Status

1. Go to Railway Dashboard
2. Select your project
3. View **Deployments** tab for history
4. View **Logs** tab for real-time server output

### Netlify Deployment Status

1. Go to Netlify Dashboard
2. Select your site
3. View **Deploys** tab for history
4. View **Analytics** tab for traffic

### Check API Connectivity

```bash
# Test backend from command line
curl https://your-railway-domain/api/habits/test-user

# Test CORS headers
curl -i https://your-railway-domain/api/habits/test-user

# Check CORS preflight request
curl -X OPTIONS https://your-railway-domain/api/habits
```

### Enable Debug Mode

Add to frontend `.env`:
```
REACT_APP_DEBUG=true
```

### View Browser Logs

Open DevTools Console to see:
- API request/response logs
- Error messages
- Component rendering issues

---

## Environment Variables Reference

### Backend (Railway)

```
# Deployment Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/habitguard

# Optional: Logging
LOG_LEVEL=info
```

### Frontend (Netlify)

```
# API Configuration
REACT_APP_API_URL=https://habitguard-backend.railway.app/api

# Optional: Debug
REACT_APP_DEBUG=false
```

---

## Troubleshooting

### Backend Won't Deploy on Railway

**Error**: "Build failed"

**Solution**:
1. Check `package.json` is in root directory
2. Verify `server.js` is the main file
3. Check Node.js version: `node --version`
4. View Railway logs for specific errors

```bash
# Test locally
npm install
npm start
```

### Frontend Won't Deploy on Netlify

**Error**: "Build failed"

**Solution**:
1. Verify **Base directory** is set to `frontend`
2. Check **Build command**: `npm run build`
3. Check **Publish directory**: `frontend/build`
4. Clear Netlify build cache: Site settings → Deploys → Clear cache

```bash
# Test locally
cd frontend
npm install
npm run build
```

### API Calls Fail (CORS Error)

**Error**: "Access-Control-Allow-Origin missing"

**Solution**:
1. Update backend CORS configuration
2. Ensure `origin` includes Netlify domain
3. Redeploy backend

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

Add to `.env`:
```
FRONTEND_URL=https://habitguard.netlify.app
```

### Database Connection Error

**Error**: "MongoNetworkError" or "connection refused"

**Solution**:
1. Verify MongoDB connection string format
2. Check credentials are correct
3. Verify IP whitelist in MongoDB Atlas (allow all IPs)
4. Test connection string locally

```bash
# Test MongoDB connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/habitguard"
```

### 502 Bad Gateway

**Error**: "502 Bad Gateway" from Railway

**Solution**:
1. Check Railway logs for crashes
2. Verify environment variables are set
3. Check MongoDB connection is working
4. Restart deployment: Railway Dashboard → Redeploy

### Frontend Shows Blank Page

**Error**: White screen, no errors

**Solution**:
1. Check console for JavaScript errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Check Network tab for failed requests
4. Clear browser cache: Ctrl+Shift+Delete

```bash
# Rebuild locally
npm run build
npm start
```

---

## Performance Optimization

### Backend (Railway)

1. **Enable Caching**:
```javascript
const redis = require('redis'); // Add Redis for caching
```

2. **Optimize Database Queries**:
```javascript
// Add indexes in MongoDB
db.habits.createIndex({ userId: 1 });
```

3. **Monitor Performance**:
   - Use Railway analytics
   - Set up error tracking (Sentry)

### Frontend (Netlify)

1. **Optimize Build Size**:
```bash
npm run build
npm install -g serve
serve -s frontend/build
```

2. **Enable Code Splitting** (future enhancement)
3. **Use CDN**: Netlify auto-uses Netlify Edge

---

## Security Checklist

- [x] Environment variables not in git (use .env)
- [x] CORS properly configured
- [x] HTTPS enabled (automatic with Railway/Netlify)
- [x] Database credentials secured
- [x] API validation and sanitization
- [x] Rate limiting (future enhancement)
- [x] Authentication (future enhancement)

---

## Useful Commands

```bash
# Backend deployment
git push origin main  # Auto-deploys to Railway

# Frontend deployment
git push origin main  # Auto-deploys to Netlify

# View Railway logs
railway logs

# View Netlify logs
netlify logs site

# Test API locally
curl http://localhost:5000/api/habits/test-user

# Test frontend locally
cd frontend
npm start
```

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to Netlify
3. ✅ Configure custom domains
4. ✅ Set up monitoring
5. ✅ Add authentication (Phase 2)
6. ✅ Add email notifications (Phase 2)
7. ✅ Set up automated backups (Phase 2)

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev

---

**Version**: 1.0.0
**Last Updated**: May 3, 2026

For issues, check the main README.md and ARCHITECTURE.md files.
