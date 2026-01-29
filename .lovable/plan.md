

# Email OTP Authentication Implementation Plan

## Overview
Replace the current Google OAuth SSO with Supabase's Email OTP (One-Time Password) authentication. Users will enter their email address, receive a 6-digit verification code from Supabase, and enter that code to sign in.

---

## Authentication Flow

```text
+------------------+     +------------------+     +------------------+     +------------------+
|   Enter Email    | --> |  Supabase sends  | --> |   Enter 6-digit  | --> |    Dashboard     |
|   (Auth Page)    |     |   OTP to email   |     |   code (verify)  |     |   (Protected)    |
+------------------+     +------------------+     +------------------+     +------------------+
```

---

## Changes Required

### 1. Update Auth Page (`src/pages/Auth.tsx`)
**Two-step flow:**

**Step 1 - Email Entry:**
- Email input field with monochromatic styling
- "Send Code" button
- Loading state while sending

**Step 2 - Code Verification:**
- Display which email the code was sent to
- 6-digit OTP input using the existing `InputOTP` component
- "Verify" button to complete sign-in
- "Resend code" and "Use different email" options

### 2. Update Auth Hook (`src/hooks/useAuth.tsx`)
Replace Google OAuth methods with:

| Method | Purpose |
|--------|---------|
| `signInWithOtp(email)` | Send 6-digit code to email |
| `verifyOtp(email, token)` | Verify code and complete sign-in |
| `signOut()` | Sign out (unchanged) |

### 3. Design Consistency
- Same glassmorphism card design
- Same monochromatic color scheme
- Same typography (serif headings, sans-serif body)
- Pill-shaped inputs and buttons with rounded-full styling

---

## Technical Implementation

### Supabase OTP Methods
```typescript
// Send OTP to email
await supabase.auth.signInWithOtp({
  email: userEmail,
  options: {
    shouldCreateUser: false, // No signup - login only
  }
});

// Verify OTP code
await supabase.auth.verifyOtp({
  email: userEmail,
  token: sixDigitCode,
  type: 'email'
});
```

### State Management
- `step`: 'email' | 'verify' - tracks which form to show
- `email`: string - stores email for verification step
- `otp`: string - the 6-digit code entered by user
- `isLoading`: boolean - loading states for API calls

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Auth.tsx` | Replace Google button with email/OTP two-step flow |
| `src/hooks/useAuth.tsx` | Replace `signInWithGoogle` with `signInWithOtp` and `verifyOtp` |

---

## Post-Implementation Notes

Since `shouldCreateUser: false` is set, only existing users in Supabase Auth can sign in. New users must be added manually via the Supabase dashboard (Authentication > Users > Add user).

