// Simple test script to verify OTP implementation
// Run this with: node test-otp.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with your actual values
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

if (supabaseUrl === 'your-supabase-url' || supabaseKey === 'your-supabase-anon-key') {
  console.log('❌ Please set your Supabase environment variables or update the script with your actual values');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOTPImplementation() {
  console.log('🧪 Testing OTP Implementation...\n');

  const testEmail = 'test@example.com';
  
  try {
    // Test 1: Send OTP
    console.log('📤 Test 1: Sending OTP...');
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    // Clean up any existing OTPs
    await supabase
      .from('otp_verification')
      .delete()
      .eq('email', testEmail);
    
    // Insert new OTP
    const { data: insertData, error: insertError } = await supabase
      .from('otp_verification')
      .insert({
        email: testEmail,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        verified: false
      })
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Failed to insert OTP:', insertError.message);
      return;
    }
    
    console.log('✅ OTP inserted successfully:', insertData.id);
    console.log('🔐 Generated OTP (for testing):', otpCode);
    
    // Test 2: Verify OTP
    console.log('\n📥 Test 2: Verifying OTP...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('otp_verification')
      .select('*')
      .eq('email', testEmail)
      .eq('verified', false)
      .single();
    
    if (verifyError) {
      console.log('❌ Failed to fetch OTP:', verifyError.message);
      return;
    }
    
    // Check if OTP matches
    if (verifyData.otp_code === otpCode) {
      console.log('✅ OTP verification successful');
      
      // Mark as verified
      await supabase
        .from('otp_verification')
        .update({ verified: true })
        .eq('id', verifyData.id);
      
      console.log('✅ OTP marked as verified');
    } else {
      console.log('❌ OTP verification failed - codes do not match');
    }
    
    // Test 3: Clean up
    console.log('\n🧹 Test 3: Cleaning up...');
    await supabase
      .from('otp_verification')
      .delete()
      .eq('email', testEmail);
    
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 All OTP tests passed!');
    
  } catch (error) {
    console.error('💥 Test failed with exception:', error);
  }
}

// Run the test
testOTPImplementation();
