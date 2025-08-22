#!/usr/bin/env node

/**
 * Test script to verify Supabase auth configuration
 * Run this with: node scripts/test-auth-config.js
 */

console.log('🧪 Testing Supabase Auth Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('VITE_SITE_URL:', process.env.VITE_SITE_URL ? '✅ Set' : '❌ Missing');
console.log('VITE_VERCEL_URL:', process.env.VITE_VERCEL_URL ? '✅ Set' : '❌ Missing');

// Check if we're in a Vercel environment
console.log('\n🌐 Environment Detection:');
console.log('VERCEL:', process.env.VERCEL ? '✅ Yes' : '❌ No');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'Not set');
console.log('VERCEL_URL:', process.env.VERCEL_URL || 'Not set');

// Simulate the getURL function logic
console.log('\n🔗 URL Resolution Test:');
let resolvedURL = 'http://localhost:3000'; // default

if (process.env.VITE_VERCEL_URL) {
  resolvedURL = `https://${process.env.VITE_VERCEL_URL}`;
  console.log('Using VITE_VERCEL_URL:', resolvedURL);
} else if (process.env.VITE_SITE_URL) {
  resolvedURL = process.env.VITE_SITE_URL;
  console.log('Using VITE_SITE_URL:', resolvedURL);
} else if (process.env.VERCEL_URL) {
  resolvedURL = `https://${process.env.VERCEL_URL}`;
  console.log('Using VERCEL_URL:', resolvedURL);
} else {
  console.log('Using default localhost URL:', resolvedURL);
}

// Test redirect URL construction
const redirectTo = `${resolvedURL}/auth/callback`;
console.log('\n🎯 Redirect URL Test:');
console.log('Base URL:', resolvedURL);
console.log('Redirect URL:', redirectTo);

// Check for common issues
console.log('\n⚠️  Common Issues Check:');
if (resolvedURL.includes('localhost') && process.env.VERCEL) {
  console.log('❌ Warning: Using localhost URL in Vercel environment');
} else {
  console.log('✅ URL resolution looks correct');
}

if (redirectTo.includes('http://') && !redirectTo.includes('localhost')) {
  console.log('❌ Warning: Using HTTP for production URL');
} else {
  console.log('✅ Protocol looks correct');
}

console.log('\n📝 Next Steps:');
console.log('1. Set environment variables in Vercel dashboard');
console.log('2. Update Supabase Auth redirect URLs');
console.log('3. Test the auth flow on your deployed app');
console.log('4. Check browser console for auth-related logs');

console.log('\n✨ Configuration test complete!');
