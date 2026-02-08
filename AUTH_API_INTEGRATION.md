# Authentication API Integration

This document describes the authentication API integration with the backend.

## API Base URL

```
https://ielts-backend-production-64dd.up.railway.app/api
```

Configured in `.env`:
```bash
VITE_API_BASE_URL=https://ielts-backend-production-64dd.up.railway.app/api
```

## API Response Format

All API responses follow the standard format:

```typescript
{
  success: boolean
  statusCode: number
  message: string
  data: T // Generic response data
  error: null | {
    code: string
    details: string
  }
  meta: {
    timestamp: string
    path: string
  }
}
```

## Authentication Endpoints

### 1. Register User
**POST** `/api/v1/auth/register`

**Request:**
```typescript
{
  phone_number: string  // e.g., "998901234567"
  fullName: string      // e.g., "John Doe"
  password: string      // e.g., "password123"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
```

**Note:** After registration, the API returns a verification `code` that needs to be passed to the OTP verification screen.

### 2. Login User
**POST** `/api/v1/auth/login`

**Request:**
```typescript
{
  phone_number: string  // e.g., "998901234567"
  password: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
```

**Note:** Login returns tokens directly (no OTP verification required).

### 3. Verify OTP (SMS)
**POST** `/api/v1/auth/sms/verify-otp`

**Request:**
```typescript
{
  otp: string     // e.g., "111111"
  code: string    // Verification code from registration response
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
```

### 4. Resend OTP (SMS)
**POST** `/api/v1/auth/sms/resend-otp`

**Request:**
```typescript
{
  code: string  // Verification code from previous request
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    code: string
    expiresAt?: string
  }
}
```

### 5. Logout
**POST** `/api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  success: true,
  message: string
}
```

### 6. Refresh Tokens
**POST** `/api/v1/auth/refresh`

**Request:**
```typescript
{
  refresh_token: string
}
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  success: true,
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
```

### 7. Forgot Password
**POST** `/api/v1/auth/password/forgot`

**Request:**
```typescript
{
  email: string  // e.g., "doston1@gmail.com"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    code: string
    expiresAt?: string
  }
}
```

### 8. Reset Password
**POST** `/api/v1/auth/password/reset`

**Request:**
```typescript
{
  otp: string         // e.g., "111111"
  code: string        // Reset code from forgot password
  newPassword: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
```

## User Type

```typescript
interface User {
  id: string
  fullName: string
  phone_number: string
  email?: string
  roles?: string[]
  permissions?: string[]
}
```

## Implementation Details

### Token Storage
- **Access Token**: Stored in `localStorage` as `auth_token`
- **Refresh Token**: Stored in `localStorage` as `auth_refresh_token`
- **User Data**: Stored in `localStorage` as `auth_user`

### Axios Interceptors

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` header to requests

**Response Interceptor:**
- Unwraps API response (returns `response.data` directly)
- Handles 401 errors by clearing auth and redirecting to login
- Global error logging

### Authentication Flow

#### Registration Flow:
1. User fills signup form (fullName, phone, password)
2. Frontend calls `POST /api/v1/auth/register`
3. Backend returns `code` for verification
4. User is redirected to OTP screen with `phone` and `code` in query params
5. User enters OTP received via SMS
6. Frontend calls `POST /api/v1/auth/sms/verify-otp` with `otp` and `code`
7. Backend returns tokens and user data
8. User is authenticated and redirected to home

#### Login Flow:
1. User fills login form (phone, password)
2. Frontend calls `POST /api/v1/auth/login`
3. Backend returns tokens and user data directly
4. User is authenticated and redirected to home

## Error Handling

All API errors are handled in `authService.ts`:
- Errors are extracted from response and shown via `showToast`
- Errors are re-thrown for component-level handling
- Network errors are logged to console

## Files Modified

- `src/types/auth.ts` - Updated to match API schema
- `src/services/authService.ts` - Updated API calls
- `src/stores/useAuthStore.ts` - Updated auth store logic
- `src/views/auth/SignUpView.vue` - Changed to use `fullName` instead of `firstName`/`lastName`
- `src/views/auth/SignInView.vue` - Navigate to home instead of OTP
- `src/views/auth/OtpView.vue` - Updated to use `code` and `otp` parameters
- `src/locales/en/auth.json` - Updated translation keys

## Testing

To test the integration:

1. **Sign Up:**
   - Navigate to `/auth/signup`
   - Enter full name, phone (e.g., 998901234567), and password
   - Submit form
   - You should be redirected to OTP screen
   - Enter OTP code received via SMS
   - You should be authenticated and redirected to home

2. **Sign In:**
   - Navigate to `/auth/signin`
   - Enter phone and password
   - Submit form
   - You should be authenticated and redirected to home

3. **Logout:**
   - Click logout button in settings
   - Tokens should be cleared and you should be redirected to signin

## Notes

- Phone numbers must be in format `998XXXXXXXXX` (12 digits)
- Passwords must be at least 8 characters
- OTP codes are 6 digits
- The default test OTP is `111111` (check with backend team)
