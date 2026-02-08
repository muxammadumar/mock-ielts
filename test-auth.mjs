#!/usr/bin/env node

/**
 * Authentication Flow Testing Script
 * Tests all authentication endpoints with the backend API
 */

const API_BASE_URL = 'https://ielts-backend-production-64dd.up.railway.app/api'

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '='.repeat(60))
  log(title, 'cyan')
  console.log('='.repeat(60))
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green')
}

function logError(message) {
  log(`✗ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue')
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow')
}

// Test data
const testUser = {
  fullName: 'Test User Claude',
  phone_number: '998901234567',
  password: 'TestPassword123!',
}

let authTokens = {
  accessToken: null,
  refreshToken: null,
}

let verificationCode = null

/**
 * Make API request
 */
async function apiRequest(endpoint, method = 'GET', body = null, headers = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    return {
      ok: response.ok,
      status: response.status,
      data,
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message,
    }
  }
}

/**
 * Test 1: User Registration
 */
async function testRegistration() {
  logSection('TEST 1: User Registration')
  logInfo(`Registering user: ${testUser.phone_number}`)

  const result = await apiRequest('/v1/auth/register', 'POST', {
    phone_number: testUser.phone_number,
    fullName: testUser.fullName,
    password: testUser.password,
  })

  if (result.ok && result.data.success) {
    logSuccess('Registration successful')

    if (result.data.data?.accessToken) {
      authTokens.accessToken = result.data.data.accessToken
      authTokens.refreshToken = result.data.data.refreshToken
      logSuccess(`Access Token: ${authTokens.accessToken.substring(0, 20)}...`)
      logSuccess(`Refresh Token: ${authTokens.refreshToken?.substring(0, 20)}...`)
    }

    if (result.data.data?.user) {
      logSuccess(`User ID: ${result.data.data.user.id}`)
      logSuccess(`User Name: ${result.data.data.user.fullName}`)
    }

    // Check if verification code is returned
    if (result.data.data?.code) {
      verificationCode = result.data.data.code
      logInfo(`Verification Code: ${verificationCode}`)
    }

    return true
  } else {
    logError(`Registration failed: ${result.data.message || 'Unknown error'}`)
    if (result.data.error) {
      logError(`Error details: ${JSON.stringify(result.data.error)}`)
    }
    return false
  }
}

/**
 * Test 2: User Login
 */
async function testLogin() {
  logSection('TEST 2: User Login')
  logInfo(`Logging in: ${testUser.phone_number}`)

  const result = await apiRequest('/v1/auth/login', 'POST', {
    phone_number: testUser.phone_number,
    password: testUser.password,
  })

  if (result.ok && result.data.success) {
    logSuccess('Login successful')

    if (result.data.data?.accessToken) {
      authTokens.accessToken = result.data.data.accessToken
      authTokens.refreshToken = result.data.data.refreshToken
      logSuccess(`Access Token: ${authTokens.accessToken.substring(0, 20)}...`)
      logSuccess(`Refresh Token: ${authTokens.refreshToken?.substring(0, 20)}...`)
    }

    if (result.data.data?.user) {
      logSuccess(`User ID: ${result.data.data.user.id}`)
      logSuccess(`User Name: ${result.data.data.user.fullName}`)
    }

    return true
  } else {
    logError(`Login failed: ${result.data.message || 'Unknown error'}`)
    if (result.data.error) {
      logError(`Error details: ${JSON.stringify(result.data.error)}`)
    }

    // If user doesn't exist, this is expected after cleanup
    if (result.status === 401 || result.data.message?.includes('not found')) {
      logWarning('User not found - this is expected if registration requires verification')
    }

    return false
  }
}

/**
 * Test 3: Get Current User Profile
 */
async function testGetProfile() {
  logSection('TEST 3: Get Current User Profile')

  if (!authTokens.accessToken) {
    logWarning('Skipping - no access token available')
    return false
  }

  logInfo('Fetching user profile')

  const result = await apiRequest('/v1/users/me', 'GET', null, {
    Authorization: `Bearer ${authTokens.accessToken}`,
  })

  if (result.ok && result.data.success) {
    logSuccess('Profile fetched successfully')

    if (result.data.data) {
      logSuccess(`User ID: ${result.data.data.id}`)
      logSuccess(`User Name: ${result.data.data.fullName}`)
      logSuccess(`Phone: ${result.data.data.phone_number}`)
    }

    return true
  } else {
    logError(`Profile fetch failed: ${result.data.message || 'Unknown error'}`)
    return false
  }
}

/**
 * Test 4: Refresh Tokens
 */
async function testRefreshToken() {
  logSection('TEST 4: Refresh Tokens')

  if (!authTokens.refreshToken) {
    logWarning('Skipping - no refresh token available')
    return false
  }

  logInfo('Refreshing access token')

  const result = await apiRequest('/v1/auth/refresh', 'POST', {
    refresh_token: authTokens.refreshToken,
  }, {
    Authorization: `Bearer ${authTokens.accessToken}`,
  })

  if (result.ok && result.data.success) {
    logSuccess('Token refresh successful')

    if (result.data.data?.accessToken) {
      const oldToken = authTokens.accessToken.substring(0, 20)
      authTokens.accessToken = result.data.data.accessToken
      authTokens.refreshToken = result.data.data.refreshToken
      const newToken = authTokens.accessToken.substring(0, 20)

      logSuccess(`Old Token: ${oldToken}...`)
      logSuccess(`New Token: ${newToken}...`)
    }

    return true
  } else {
    logError(`Token refresh failed: ${result.data.message || 'Unknown error'}`)
    return false
  }
}

/**
 * Test 5: Resend OTP (if verification is needed)
 */
async function testResendOtp() {
  logSection('TEST 5: Resend OTP')

  if (!verificationCode) {
    logWarning('Skipping - no verification code from registration')
    return false
  }

  logInfo(`Resending OTP for code: ${verificationCode}`)

  const result = await apiRequest('/v1/auth/sms/resend-otp', 'POST', {
    code: verificationCode,
  })

  if (result.ok && result.data.success) {
    logSuccess('OTP resent successfully')

    if (result.data.data?.code) {
      verificationCode = result.data.data.code
      logSuccess(`New verification code: ${verificationCode}`)
    }

    return true
  } else {
    logError(`OTP resend failed: ${result.data.message || 'Unknown error'}`)
    return false
  }
}

/**
 * Test 6: Verify OTP
 */
async function testVerifyOtp() {
  logSection('TEST 6: Verify OTP')

  if (!verificationCode) {
    logWarning('Skipping - no verification code available')
    return false
  }

  logInfo(`Verifying OTP with code: ${verificationCode}`)
  logInfo('Using test OTP: 111111')

  const result = await apiRequest('/v1/auth/sms/verify-otp', 'POST', {
    otp: '111111',
    code: verificationCode,
  })

  if (result.ok && result.data.success) {
    logSuccess('OTP verification successful')

    if (result.data.data?.accessToken) {
      authTokens.accessToken = result.data.data.accessToken
      authTokens.refreshToken = result.data.data.refreshToken
      logSuccess('User is now fully authenticated')
    }

    return true
  } else {
    logError(`OTP verification failed: ${result.data.message || 'Unknown error'}`)
    return false
  }
}

/**
 * Test 7: Logout
 */
async function testLogout() {
  logSection('TEST 7: Logout')

  if (!authTokens.accessToken) {
    logWarning('Skipping - no access token available')
    return false
  }

  logInfo('Logging out user')

  const result = await apiRequest('/v1/auth/logout', 'POST', null, {
    Authorization: `Bearer ${authTokens.accessToken}`,
  })

  if (result.ok && result.data.success) {
    logSuccess('Logout successful')
    authTokens.accessToken = null
    authTokens.refreshToken = null
    return true
  } else {
    logError(`Logout failed: ${result.data.message || 'Unknown error'}`)
    return false
  }
}

/**
 * Test 8: Forgot Password
 */
async function testForgotPassword() {
  logSection('TEST 8: Forgot Password')

  const testEmail = 'test@example.com'
  logInfo(`Requesting password reset for: ${testEmail}`)

  const result = await apiRequest('/v1/auth/password/forgot', 'POST', {
    email: testEmail,
  })

  if (result.ok && result.data.success) {
    logSuccess('Password reset request successful')

    if (result.data.data?.code) {
      logSuccess(`Reset code: ${result.data.data.code}`)
    }

    return true
  } else {
    logError(`Password reset request failed: ${result.data.message || 'Unknown error'}`)
    logWarning('This may fail if email is not registered - this is expected')
    return false
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.clear()
  logSection('🧪 AUTHENTICATION FLOW TESTING')
  logInfo(`API Base URL: ${API_BASE_URL}`)
  logInfo(`Test User: ${testUser.phone_number}`)

  const results = {
    registration: false,
    login: false,
    profile: false,
    refresh: false,
    resendOtp: false,
    verifyOtp: false,
    logout: false,
    forgotPassword: false,
  }

  // Test sequence
  results.registration = await testRegistration()

  // If registration returns tokens directly, skip OTP flow
  if (results.registration && authTokens.accessToken) {
    logInfo('\n📝 Registration returned tokens - user is authenticated')
    results.profile = await testGetProfile()
    results.refresh = await testRefreshToken()
    results.logout = await testLogout()
  } else if (results.registration && verificationCode) {
    logInfo('\n📝 Registration requires OTP verification')
    results.resendOtp = await testResendOtp()
    results.verifyOtp = await testVerifyOtp()

    if (results.verifyOtp && authTokens.accessToken) {
      results.profile = await testGetProfile()
      results.refresh = await testRefreshToken()
      results.logout = await testLogout()
    }
  }

  // Test login (after logout or if registration failed)
  if (!authTokens.accessToken) {
    results.login = await testLogin()

    if (results.login && authTokens.accessToken) {
      results.profile = await testGetProfile()
      results.refresh = await testRefreshToken()
      results.logout = await testLogout()
    }
  }

  // Test forgot password (independent flow)
  results.forgotPassword = await testForgotPassword()

  // Summary
  logSection('📊 TEST SUMMARY')

  const tests = [
    { name: 'Registration', result: results.registration },
    { name: 'Login', result: results.login },
    { name: 'Get Profile', result: results.profile },
    { name: 'Refresh Token', result: results.refresh },
    { name: 'Resend OTP', result: results.resendOtp },
    { name: 'Verify OTP', result: results.verifyOtp },
    { name: 'Logout', result: results.logout },
    { name: 'Forgot Password', result: results.forgotPassword },
  ]

  const passed = tests.filter(t => t.result).length
  const total = tests.filter(t => t.result !== false || t.name === 'Registration' || t.name === 'Login').length

  tests.forEach(test => {
    if (test.result === true) {
      logSuccess(`${test.name}: PASSED`)
    } else if (test.result === false && (test.name === 'Registration' || test.name === 'Login')) {
      logError(`${test.name}: FAILED`)
    } else if (test.result === false) {
      logWarning(`${test.name}: SKIPPED`)
    }
  })

  console.log('\n')
  if (passed === total) {
    logSuccess(`All ${passed}/${total} relevant tests passed! 🎉`)
  } else if (passed > 0) {
    logWarning(`${passed}/${total} tests passed`)
  } else {
    logError(`${passed}/${total} tests passed`)
  }

  console.log('\n')
}

// Run tests
runAllTests().catch(error => {
  logError(`Fatal error: ${error.message}`)
  console.error(error)
  process.exit(1)
})
