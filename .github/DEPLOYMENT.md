# Deployment Guide: GitHub to Vercel

This document explains how to deploy the HomeCare Portal to Vercel via GitHub integration.

## Overview

The HomeCare Portal is automatically deployed to Vercel whenever changes are pushed to the `main` branch on GitHub. Vercel monitors the repository and triggers a new deployment on each push.

**Production URLs:**
- Main: https://homecare-app-omega.vercel.app
- Custom Domain: https://homecare.abrins.com

**Repository:**
- GitHub: https://github.com/Braham27/homecare-portal
- Branch: `main` (auto-deploys)

---

## Prerequisites

1. **GitHub Account** - Access to the repository
2. **Vercel Account** - Project connected to GitHub
3. **Git Installed** - On your local machine
4. **Environment Variables** - Configured in Vercel dashboard

---

## Deployment Process

### 1. Make Your Changes Locally

```bash
cd C:\wamp64\www\homeCare\homecare-app

# Make your code changes
# Test locally with:
npm run dev
```

### 2. Test Before Deploying

Always test your changes locally before pushing:

```bash
# Run type checking
npm run type-check

# Run build to catch errors
npm run build

# Test the production build
npm run start
```

### 3. Commit Your Changes

```bash
# Stage all changes
git add -A

# Check what will be committed
git status

# Commit with a descriptive message
git commit -m "Your descriptive commit message"
```

**Example commit messages:**
- `fix: resolve clock-in GPS tracking issue`
- `feat: add employee detail page with certifications`
- `docs: update deployment instructions`

### 4. Push to GitHub

```bash
# Push to main branch (triggers Vercel deployment)
git push origin main
```

### 5. Monitor Deployment

**Option A: Vercel Dashboard**
1. Go to https://vercel.com/homecares-projects-c9481da2/homecare-app
2. Click on "Deployments" tab
3. Watch the latest deployment progress

**Option B: GitHub Actions**
- Vercel will comment on commits with deployment status
- Check the repository's commit page for deployment links

**Typical Deployment Time:** 2-4 minutes

### 6. Verify Deployment

Once deployed, test the changes:

```bash
# Visit production URL
https://homecare-app-omega.vercel.app

# Or custom domain
https://homecare.abrins.com
```

**Quick verification checklist:**
- [ ] Homepage loads without errors
- [ ] Login functionality works
- [ ] New features are visible
- [ ] No console errors in browser DevTools
- [ ] Database connections working (check API endpoints)

---

## Environment Variables

### Required Variables

Vercel needs these environment variables (configured in Vercel dashboard):

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://homecare-app-omega.vercel.app
NEXTAUTH_SECRET=your-secret-key
```

### Adding/Updating Environment Variables

1. Go to Vercel dashboard: https://vercel.com/homecares-projects-c9481da2/homecare-app
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add or update variables
5. **Important:** Redeploy after changing env vars

To redeploy after env variable changes:
```bash
# Trigger redeploy by pushing empty commit
git commit --allow-empty -m "chore: redeploy for env var updates"
git push origin main
```

### Syncing Environment Variables Locally

To pull production environment variables to local `.env.local`:

```bash
vercel env pull .env.local
```

---

## Database Migrations

When deploying schema changes:

### 1. Update Prisma Schema

```bash
# Edit prisma/schema.prisma
# Then generate Prisma client locally
npx prisma generate
```

### 2. Create and Push Migration

```bash
# Create migration file
npx prisma migrate dev --name your_migration_name

# Push to database
npx prisma db push
```

### 3. Deploy to Production

```bash
# Commit migration files
git add prisma/migrations/*
git commit -m "feat: add new database migration"
git push origin main
```

**Note:** Vercel will automatically run `prisma generate` during build. Manual migrations may need to be run on the production database using Vercel CLI or Neon console.

---

## Deployment Workflow Examples

### Example 1: Bug Fix

```bash
# 1. Fix the bug locally
# 2. Test it works
npm run dev

# 3. Build to verify no errors
npm run build

# 4. Commit and push
git add -A
git commit -m "fix: resolve EVV GPS coordinate storage issue"
git push origin main

# 5. Wait 2-3 minutes for Vercel deployment
# 6. Test on production URL
```

### Example 2: New Feature

```bash
# 1. Develop feature on a branch (optional)
git checkout -b feature/employee-certifications

# 2. Make changes and test
# 3. Commit changes
git add -A
git commit -m "feat: add employee certification management"

# 4. Merge to main (or push directly if skipping branch)
git checkout main
git merge feature/employee-certifications

# 5. Push to trigger deployment
git push origin main
```

### Example 3: Emergency Hotfix

```bash
# 1. Make quick fix
# 2. Test minimally but verify it works
npm run build

# 3. Commit and push immediately
git add -A
git commit -m "hotfix: critical auth session timeout fix"
git push origin main

# 4. Monitor deployment closely
# 5. Test production immediately after deploy
```

---

## Rollback Procedure

If a deployment causes issues:

### Option 1: Revert via Vercel Dashboard

1. Go to https://vercel.com/homecares-projects-c9481da2/homecare-app
2. Click "Deployments" tab
3. Find the last working deployment
4. Click "..." menu → "Promote to Production"

### Option 2: Git Revert and Redeploy

```bash
# Find the bad commit
git log --oneline

# Revert the commit (creates new commit)
git revert <commit-hash>

# Push the revert
git push origin main
```

### Option 3: Hard Reset (Use with Caution)

```bash
# Reset to last known good commit
git reset --hard <good-commit-hash>

# Force push (overwrites history)
git push origin main --force
```

⚠️ **Warning:** Force push can cause issues if others are working on the repo.

---

## Troubleshooting

### Build Fails on Vercel

**Check the Vercel logs:**
1. Go to failed deployment in Vercel dashboard
2. Click on the deployment
3. Review "Building" logs for errors

**Common issues:**
- TypeScript errors → Run `npm run build` locally first
- Missing dependencies → Check `package.json`
- Environment variables → Verify all required vars are set in Vercel

### Deployment Succeeds but Site Broken

**Check runtime logs:**
1. Vercel dashboard → Deployment → "Functions" tab
2. Look for runtime errors

**Common issues:**
- Database connection → Verify `DATABASE_URL` in Vercel env vars
- API errors → Check if Prisma client was generated
- Auth issues → Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET`

### Changes Not Appearing

**Possible causes:**
1. **Browser cache** → Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. **Vercel CDN cache** → Wait 5 minutes or purge cache in dashboard
3. **Wrong branch** → Verify you pushed to `main` branch
4. **Deployment still running** → Check Vercel dashboard for status

### Environment Variables Not Working

```bash
# 1. Verify variables in Vercel dashboard
# 2. Redeploy to pick up changes
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

---

## Best Practices

### 1. Always Test Locally First
```bash
npm run build  # Catches build errors before deployment
```

### 2. Use Meaningful Commit Messages
- ✅ Good: `feat: add EVV clock-in GPS tracking`
- ❌ Bad: `update files`

### 3. Check Build Logs
- Review Vercel deployment logs even if successful
- Look for warnings that might cause issues later

### 4. Test Production After Deploy
- Don't assume deployment success = working site
- Test critical paths (login, key features)

### 5. Keep Dependencies Updated
```bash
# Check for outdated packages
npm outdated

# Update carefully
npm update
```

### 6. Monitor Error Tracking
- Set up error monitoring (Sentry, etc.)
- Check for runtime errors after deployment

### 7. Use Preview Deployments
- Push to a feature branch first
- Vercel creates preview URL automatically
- Test on preview before merging to main

---

## Preview Deployments (Feature Branches)

Vercel automatically creates preview deployments for non-main branches:

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and push
git add -A
git commit -m "feat: work in progress"
git push origin feature/new-feature
```

Vercel will comment on the GitHub commit with a preview URL like:
```
https://homecare-app-<unique-id>.vercel.app
```

Test on preview URL, then merge to main when ready:
```bash
git checkout main
git merge feature/new-feature
git push origin main
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Build locally | `npm run build` |
| Run dev server | `npm run dev` |
| Stage all changes | `git add -A` |
| Commit changes | `git commit -m "message"` |
| Push to deploy | `git push origin main` |
| Pull env vars | `vercel env pull .env.local` |
| Prisma generate | `npx prisma generate` |
| Create migration | `npx prisma migrate dev` |
| View deployments | https://vercel.com/homecares-projects-c9481da2/homecare-app |

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma with Vercel**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Repository Issues**: https://github.com/Braham27/homecare-portal/issues

---

## Summary

**Standard Deployment Flow:**
1. Make changes locally
2. Test with `npm run build`
3. Commit: `git commit -m "message"`
4. Push: `git push origin main`
5. Wait 2-3 minutes
6. Verify on https://homecare-app-omega.vercel.app

**Remember:** Every push to `main` deploys to production automatically. Always test before pushing!
