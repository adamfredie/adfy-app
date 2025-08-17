# Vercel Deployment Guide for ADFY App

## Overview
This guide explains how to properly configure your ADFY app for deployment on Vercel with Supabase authentication working correctly.

## Environment Variables Setup

### 1. Vercel Environment Variables
Set these in your Vercel project dashboard under Settings > Environment Variables:

#### Production Environment:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=https://your-production-domain.com/
```

#### Preview Environment (for PR deployments):
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_VERCEL_URL=your-preview-url.vercel.app
```

### 2. Local Development
Create a `.env.local` file in your project root:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Configuration

### 1. Auth Settings
In your Supabase dashboard, go to Authentication > URL Configuration and add these redirect URLs:

```
# Local development
http://localhost:3000/**

# Vercel preview deployments (replace with your team slug)
https://*-your-team-slug.vercel.app/**

# Your production domain
https://your-production-domain.com/**
```

### 2. Site URL
In Supabase Authentication > Settings, set:
- **Site URL**: `https://your-production-domain.com` (or your Vercel app URL)

## How the Auth Flow Works

### 1. Signup Process
1. User signs up with email/password
2. Supabase sends verification email with `redirectTo` parameter
3. `redirectTo` is set to `{getURL()}/auth/callback` which resolves to:
   - Local: `http://localhost:3000/auth/callback`
   - Vercel: `https://your-app.vercel.app/auth/callback`

### 2. Email Verification
1. User clicks verification link in email
2. Supabase redirects to your app with auth tokens in URL
3. AuthContext detects the callback and processes the session
4. User is automatically signed in and redirected appropriately

### 3. Session Restoration
- After verification, the session is automatically restored
- User profile is fetched
- App determines whether to show onboarding or dashboard

## Code Changes Made

### 1. `getURL()` Helper Function
- Automatically detects environment (local, Vercel preview, production)
- Returns correct URL for auth redirects
- Handles both `VITE_VERCEL_URL` and `VITE_SITE_URL`

### 2. Enhanced Signup Function
- Includes `emailRedirectTo` parameter with correct URL
- Ensures verification emails redirect to the right place

### 3. Auth Callback Detection
- Automatically detects when user returns from email verification
- Processes the auth callback and restores session
- Cleans up URL parameters

## Testing the Deployment

### 1. Local Testing
```bash
npm run dev
# Test signup and verification flow
```

### 2. Vercel Preview Testing
1. Push changes to a feature branch
2. Vercel creates a preview deployment
3. Test the auth flow on the preview URL
4. Verify redirects work correctly

### 3. Production Testing
1. Deploy to main branch
2. Test complete auth flow on production domain
3. Verify email verification redirects work

## Troubleshooting

### Common Issues

#### 1. "Invalid redirect URL" Error
- Check Supabase Auth settings for correct redirect URLs
- Ensure `VITE_SITE_URL` is set correctly in Vercel
- Verify no trailing slashes in redirect URLs

#### 2. User Redirected to Signup After Verification
- Check if `VITE_VERCEL_URL` is set for preview deployments
- Verify Supabase client configuration
- Check browser console for auth errors

#### 3. Session Not Restored After Verification
- Ensure `detectSessionInUrl: true` is set in Supabase client
- Check if auth callback detection is working
- Verify environment variables are loaded correctly

### Debug Steps
1. Check browser console for auth-related logs
2. Verify environment variables in Vercel dashboard
3. Test Supabase connection using the diagnostic functions
4. Check Supabase Auth logs for failed redirects

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use Vercel's environment variable system
- Rotate Supabase keys regularly

### 2. Redirect URLs
- Only allow necessary redirect URLs in Supabase
- Use HTTPS for all production URLs
- Validate redirect URLs on the server side

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check Supabase Auth logs
4. Verify environment variable configuration
