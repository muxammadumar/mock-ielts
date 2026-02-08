#!/usr/bin/env node

const API_BASE_URL = 'https://ielts-backend-production-64dd.up.railway.app/api'

const testUser = {
  phone_number: '998901234567',
  password: 'TestPassword123!',
}

async function testLogin() {
  console.log('\n🔐 Testing Login Flow...\n')
  console.log('Phone:', testUser.phone_number)
  console.log('Password:', testUser.password)

  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: testUser.phone_number,
        password: testUser.password,
      }),
    })

    const data = await response.json()

    console.log('\nResponse Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))

    if (response.ok && data.success) {
      console.log('\n✅ Login successful!')
      console.log('Access Token:', data.data?.accessToken?.substring(0, 30) + '...')
      console.log('User:', data.data?.user?.fullName)
    } else {
      console.log('\n❌ Login failed:', data.message)
    }
  } catch (error) {
    console.log('\n❌ Error:', error.message)
  }
}

testLogin()
