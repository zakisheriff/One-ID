# One ID - Deployment Guide (Vercel + Supabase)

Complete step-by-step guide to deploy One ID to production.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase account (sign up at [supabase.com](https://supabase.com))
- Domain DNS access (for `oneid.theoneatom.com`)

---

## Part 1: Setup Supabase Database

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in details:
   - **Name**: One ID
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project" (takes ~2 minutes)

### Step 2: Run Database Migrations

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" (bottom right)
6. Verify: You should see "Success. No rows returned"

### Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Part 2: Deploy to Vercel

### Step 1: Push Code to GitHub

```bash
cd /Users/afraasheriff/Desktop/Projects_List/One-ID

# Add all changes
git add .

# Commit
git commit -m "Deploy to Vercel with Supabase integration"

# Push to GitHub
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`

### Step 3: Add Environment Variables

Click "Environment Variables" and add:

**Backend Variables** (for API functions):
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
CRON_SECRET=your-random-secret-here
```

**Frontend Variables** (for client):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

> **Tip**: Generate a random CRON_SECRET using: `openssl rand -hex 32`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (~2-3 minutes)
3. Copy your deployment URL: `https://one-id-xxxx.vercel.app`

---

## Part 3: Configure Custom Domain

### Step 1: Add Domain in Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Click "Add"
3. Enter: `oneid.theoneatom.com`
4. Click "Add"

### Step 2: Update DNS Records

Vercel will show you the required DNS configuration. You need to add a CNAME record:

1. Go to your DNS provider (where `theoneatom.com` is hosted)
2. Add a new CNAME record:
   - **Name/Host**: `oneid`
   - **Value/Target**: `cname.vercel-dns.com`
   - **TTL**: 3600 (or Auto)
3. Save the record

### Step 3: Wait for SSL Certificate

1. DNS propagation takes 5-60 minutes
2. Vercel will automatically issue an SSL certificate
3. Once ready, `oneid.theoneatom.com` will be live with HTTPS

---

## Part 4: Verify Deployment

### Test Checklist

1. **Visit Site**: Go to `https://oneid.theoneatom.com`
   - ✅ Site loads
   - ✅ UI looks correct

2. **Test Email**:
   - ✅ Click "Generate Email"
   - ✅ Email address is created
   - ✅ Send test email to the address
   - ✅ Click "Sync" button
   - ✅ Email appears in inbox

3. **Test Phone**:
   - ✅ Click "Generate Phone Number"
   - ✅ Number is created
   - ✅ Wait 20-40 seconds for simulated SMS

4. **Test Card**:
   - ✅ Click "Generate Card"
   - ✅ Card details appear
   - ✅ Try lock/unlock
   - ✅ Wait for simulated transaction

5. **Test Settings**:
   - ✅ Go to Settings
   - ✅ Click "Clear All Data"
   - ✅ Verify data is cleared

---

## Part 5: Enable Automatic Cleanup (Optional)

The cron job is already configured in `vercel.json` to run every 6 hours.

### Verify Cron Job

1. In Vercel project, go to **Settings** → **Cron Jobs**
2. You should see: `/api/cleanup` running every 6 hours
3. This automatically deletes expired emails, SMS, and cards

---

## Troubleshooting

### Issue: "Failed to generate email address"

**Solution**: Check Vercel function logs:
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `/api/email`
3. Check logs for errors
4. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

### Issue: "Database error" or "relation does not exist"

**Solution**: Database schema not created
1. Go to Supabase SQL Editor
2. Re-run `supabase-schema.sql`
3. Check for any errors in the output

### Issue: Custom domain not working

**Solution**: DNS not configured correctly
1. Verify CNAME record: `oneid` → `cname.vercel-dns.com`
2. Wait up to 1 hour for DNS propagation
3. Check DNS: `dig oneid.theoneatom.com`

### Issue: Emails not syncing

**Solution**: Mail.tm API issue
1. Check browser console for errors
2. Try generating a new email address
3. Verify Mail.tm is working: https://mail.tm

---

## Monitoring

### Vercel Analytics

1. Go to Vercel Dashboard → Your Project → Analytics
2. View traffic, performance, and errors

### Supabase Logs

1. Go to Supabase Dashboard → Logs
2. View database queries and errors

---

## Cost Breakdown

### Free Tier (Recommended for Testing)

- **Vercel**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domains included
  
- **Supabase**:
  - 500MB database
  - 2GB bandwidth/month
  - 50,000 monthly active users

### Paid Tier (For Production)

- **Vercel Pro**: $20/month
  - More bandwidth
  - Better support
  
- **Supabase Pro**: $25/month
  - 8GB database
  - 50GB bandwidth
  - Daily backups

---

## Next Steps

1. ✅ Test all features thoroughly
2. ✅ Monitor for errors in first 24 hours
3. ✅ Share with users: `https://oneid.theoneatom.com`
4. ✅ Set up monitoring/alerts
5. ✅ Consider upgrading to paid tier for production use

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Issues**: Create issue on GitHub repository

---

## Environment Variables Reference

Save this for future reference:

```bash
# Vercel Environment Variables

# Backend (API Functions)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
CRON_SECRET=your-random-secret

# Frontend (Client)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

🎉 **Deployment Complete!** Your One ID app is now live at `https://oneid.theoneatom.com`
