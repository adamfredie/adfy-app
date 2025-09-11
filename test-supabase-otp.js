// Test script for Supabase OTP functionality
// Run this in your browser console to test the new OTP implementation

console.log('🧪 Testing Supabase OTP Implementation...');

// Test 1: Check if Supabase client is available
console.log('📋 Test 1: Supabase Client Check');
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client available');
} else {
  console.log('❌ Supabase client not available');
}

// Test 2: Test OTP sending (replace with your email)
async function testSendOTP() {
  console.log('📋 Test 2: Send OTP Test');
  try {
    const email = 'test@example.com'; // Replace with your test email
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin + '/email-verification'
      }
    });
    
    if (error) {
      console.error('❌ Send OTP failed:', error);
      return false;
    } else {
      console.log('✅ OTP sent successfully');
      return true;
    }
  } catch (err) {
    console.error('💥 Exception sending OTP:', err);
    return false;
  }
}

// Test 3: Test OTP verification (you'll need to get the actual OTP from email)
async function testVerifyOTP(email, otp) {
  console.log('📋 Test 3: Verify OTP Test');
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email'
    });
    
    if (error) {
      console.error('❌ Verify OTP failed:', error);
      return false;
    } else {
      console.log('✅ OTP verified successfully, user:', data.user?.email);
      return true;
    }
  } catch (err) {
    console.error('💥 Exception verifying OTP:', err);
    return false;
  }
}

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.testSendOTP = testSendOTP;
  window.testVerifyOTP = testVerifyOTP;
  console.log('🔧 Test functions available:');
  console.log('  - testSendOTP() - Send OTP to test@example.com');
  console.log('  - testVerifyOTP(email, otp) - Verify OTP code');
}

console.log('✅ OTP test setup complete!');
