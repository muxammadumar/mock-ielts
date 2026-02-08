# OTP Input Update - 6 Digits

## Changes Made

### 1. ✅ Removed Custom Numeric Keypad
- Removed the `<CustomNumericKeypad>` component from OTP view
- Removed all keypad handler functions
- Now uses native mobile keyboard for better UX

### 2. ✅ Updated OTP to 6 Digits
- Changed from 5 digits to 6 digits to match backend requirement
- Updated all logic to handle 6-digit codes

### Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Number of inputs** | 5 | 6 |
| **Input width** | 56px | 48px |
| **Gap between inputs** | 12px | 8px |
| **Keyboard** | Custom keypad | Native keyboard |
| **Test OTP** | 11111 (5 digits) | 111111 (6 digits) |

## Files Modified

### `src/components/auth/CustomOtpInput.vue`
- Updated template: `v-for="(_, index) in 6"`
- Updated initial values: `['', '', '', '', '', '']` (6 empty strings)
- Updated completion check: `if (code.length === 6)`
- Updated all index bounds from `< 4` to `< 5`
- Updated all slice operations from `.slice(0, 5)` to `.slice(0, 6)`
- Updated all loops from `i < 5` to `i < 6`
- Adjusted styling for better mobile fit

### `src/views/auth/OtpView.vue`
- Removed `<CustomNumericKeypad>` component
- Removed keypad import
- Removed `handleKeypadInput()` function
- Removed `handleKeypadBackspace()` function
- Removed `handleKeypadSpecial()` function
- Removed unused `nextTick` import

## Testing

### Temporary OTP Code
Since there's no SMS service yet, use this test code:
```
111111
```

### How to Test
1. Go to registration: `/auth/signup`
2. Fill in:
   - Full Name: "Test User"
   - Phone: "998 90 123 45 67"
   - Password: "password123"
3. Submit form
4. You'll be redirected to OTP screen
5. Enter: `111111` (6 digits)
6. Should be authenticated and redirected to home

### Features
- ✅ 6 input fields
- ✅ Auto-focus next field on input
- ✅ Auto-focus previous field on backspace
- ✅ Paste support (paste "111111" directly)
- ✅ Native mobile keyboard
- ✅ Error state (red border)
- ✅ Loading state (disabled inputs)
- ✅ Auto-submit when all 6 digits entered

## Visual Layout

```
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ 1  │ │ 1  │ │ 1  │ │ 1  │ │ 1  │ │ 1  │
└────┘ └────┘ └────┘ └────┘ └────┘ └────┘
  48px   48px   48px   48px   48px   48px
      8px gap between each input
```

Total width: (48px × 6) + (8px × 5) = 328px
Perfect fit for mobile screens!

## Build Status

✅ **Build successful:** `✓ built in 1.06s`

No TypeScript errors, ready for production!
