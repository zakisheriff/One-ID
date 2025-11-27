# Deployment Guide - Imposter

Complete guide to deploy Imposter to production using Vercel (frontend) and Railway (backend).

## Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Railway Account** - Sign up at [railway.app](https://railway.app)

## Part 1: Deploy Backend to Railway

### Step 1: Create New Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select the `Imposter` repository

### Step 2: Configure Service

Railway will auto-detect your Node.js app. Configure:

- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 3: Add Environment Variables

Go to "Variables" tab and add:

```
NODE_ENV=production
PORT=3000
```

**Optional** (for real services):
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
STRIPE_SECRET_KEY=sk_live_your_key
```

### Step 4: Deploy

1. Railway will automatically deploy
2. Wait for deployment (2-3 minutes)
3. Go to "Settings" → "Generate Domain"
4. Copy your backend URL: `https://your-app.up.railway.app`

## Part 2: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### Step 2: Configure Project

- **Framework Preset:** Vite
- **Root Directory:** Leave as `./`
- **Build Command:** `cd client && npm install && npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables

Click "Environment Variables":

```
VITE_API_URL=https://your-app.up.railway.app/api
```

Replace with your actual Railway backend URL from Part 1.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

## Part 3: Update Backend CORS

### Step 1: Update Environment Variable

1. Go back to Railway Dashboard
2. Open your project
3. Go to "Variables" tab
4. Add new variable:

```
FRONTEND_URL=https://your-app.vercel.app
```

Replace with your actual Vercel URL from Part 2.

### Step 2: Redeploy

Railway will automatically redeploy when you add the variable.

## Part 4: Verify Deployment

### Test Checklist

1. ✅ Visit your Vercel URL - frontend loads
2. ✅ Generate temporary email - API works
3. ✅ Send test email to generated address
4. ✅ Check if email appears (wait 5-10 seconds)
5. ✅ Generate phone number - works
6. ✅ Generate virtual card - works
7. ✅ Test mobile navigation - responsive
8. ✅ Test panic button - clears data

## Troubleshooting

### Frontend can't connect to backend

**Problem:** CORS errors in browser console

**Solution:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Verify `FRONTEND_URL` in Railway environment variables
3. Make sure both URLs are correct (no trailing slashes)
4. Redeploy both services

### Backend is not responding

**Problem:** 502 Bad Gateway or timeout errors

**Solution:**
1. Check Railway logs for errors
2. Verify environment variables are set correctly
3. Make sure PORT is set to 3000
4. Check if service is running in Railway dashboard

### Emails not appearing

**Problem:** Generated email but no messages show up

**Solution:**
1. Wait 5-10 seconds for polling
2. Check browser console for errors
3. Verify Mail.tm service is working
4. Try sending another test email

### Build fails on Vercel

**Problem:** Build command fails

**Solution:**
1. Check build logs for specific error
2. Verify `package.json` scripts are correct
3. Make sure all dependencies are in `package.json`
4. Try building locally: `cd client && npm run build`

## Custom Domain (Optional)

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Railway

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records as instructed

## Monitoring

### Railway Logs

- View real-time logs in Railway Dashboard
- Monitor for errors and performance issues
- Set up log alerts if needed

### Vercel Analytics

- Enable analytics in Project Settings
- View traffic and performance metrics

## Updating Your App

### Push to GitHub

```bash
git add .
git commit -m "Update message"
git push origin main
```

Both Vercel and Railway will automatically redeploy on push to `main` branch.

## Cost Breakdown

### Railway
- **Trial:** $5 credit (no card required initially)
- **Hobby Plan:** $5/month after trial
- **Pro Plan:** $20/month for production apps
- No cold starts, always-on service

### Vercel
- **Free Tier:** Unlimited deployments, 100GB bandwidth/month
- **Pro:** $20/month - More bandwidth, better support

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Issues:** Create issue on GitHub repository

## Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)

## Part 1: Deploy Backend to Render

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `Imposter` repository

### Step 2: Configure Service

- **Name:** `imposter-backend` (or your choice)
- **Region:** Oregon (or closest to you)
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Runtime:** Node
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`
- **Instance Type:** Free

### Step 3: Add Environment Variables

Click "Advanced" → "Add Environment Variable":

```
NODE_ENV=production
PORT=3000
```

**Optional** (for real services):
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
STRIPE_SECRET_KEY=sk_live_your_key
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Copy your backend URL: `https://imposter-backend-xxxx.onrender.com`

## Part 2: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### Step 2: Configure Project

- **Framework Preset:** Vite
- **Root Directory:** Leave as `./`
- **Build Command:** `cd client && npm install && npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables

Click "Environment Variables":

```
VITE_API_URL=https://imposter-backend-xxxx.onrender.com/api
```

Replace `xxxx` with your actual Render backend URL from Part 1.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

## Part 3: Update Backend CORS

### Step 1: Update Environment Variable

1. Go back to Render Dashboard
2. Open your `imposter-backend` service
3. Go to "Environment" tab
4. Add new environment variable:

```
FRONTEND_URL=https://your-app.vercel.app
```

Replace with your actual Vercel URL from Part 2.

### Step 2: Redeploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait for redeployment

## Part 4: Verify Deployment

### Test Checklist

1. ✅ Visit your Vercel URL - frontend loads
2. ✅ Generate temporary email - API works
3. ✅ Send test email to generated address
4. ✅ Check if email appears (wait 5-10 seconds)
5. ✅ Generate phone number - works
6. ✅ Generate virtual card - works
7. ✅ Test mobile navigation - responsive
8. ✅ Test panic button - clears data

## Troubleshooting

### Frontend can't connect to backend

**Problem:** CORS errors in browser console

**Solution:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Verify `FRONTEND_URL` in Render environment variables
3. Make sure both URLs are correct (no trailing slashes)
4. Redeploy both services

### Backend is slow to respond

**Problem:** First request takes 30+ seconds

**Solution:** This is normal for Render free tier (cold starts). Upgrade to paid tier ($7/month) for always-on service.

### Emails not appearing

**Problem:** Generated email but no messages show up

**Solution:**
1. Wait 5-10 seconds for polling
2. Check browser console for errors
3. Verify Mail.tm service is working
4. Try sending another test email

### Build fails on Vercel

**Problem:** Build command fails

**Solution:**
1. Check build logs for specific error
2. Verify `package.json` scripts are correct
3. Make sure all dependencies are in `package.json`
4. Try building locally: `cd client && npm run build`

## Custom Domain (Optional)

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render

1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

## Monitoring

### Render Logs

- View real-time logs in Render Dashboard → Logs
- Monitor for errors and performance issues

### Vercel Analytics

- Enable analytics in Project Settings
- View traffic and performance metrics

## Updating Your App

### Push to GitHub

```bash
git add .
git commit -m "Update message"
git push origin main
```

Both Vercel and Render will automatically redeploy on push to `main` branch.

## Cost Breakdown

### Free Tier
- **Vercel:** Unlimited deployments, 100GB bandwidth/month
- **Render:** 750 hours/month, sleeps after 15min inactivity

### Paid Options
- **Render Pro:** $7/month - Always on, no cold starts
- **Vercel Pro:** $20/month - More bandwidth, better support

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Issues:** Create issue on GitHub repository
