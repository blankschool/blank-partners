

# Fix OTP Login - Enable 6-Digit Code for Email

## Problem Identified
Supabase's `signInWithOtp` for email sends a **magic link** (clickable URL) by default, not a 6-digit code. The auth logs confirm:
- Successful login at 02:58:05 was via clicking the magic link (GET /verify, status 303)
- Error "token has expired or is invalid" occurred when manually entering the token

## Solution
Configure Supabase to send 6-digit codes instead of magic links for email authentication.

---

## Implementation Steps

### 1. Update Supabase Email Template (Dashboard Action - Required)

You must modify the "Magic Link" email template in Supabase Dashboard:

**Path:** Authentication > Email Templates > Magic Link

**Replace the template with this:**
```html
<h2>Your verification code</h2>

<p>Enter the following code to sign in:</p>

<h1 style="font-size: 32px; letter-spacing: 4px; font-family: monospace;">{{ .Token }}</h1>

<p>This code will expire in 1 hour.</p>

<p>If you didn't request this code, you can safely ignore this email.</p>
```

This template uses `{{ .Token }}` which is the 6-digit OTP code that Supabase generates automatically.

### 2. No Code Changes Required

The current implementation in `src/hooks/useAuth.tsx` and `src/pages/Auth.tsx` is correct:
- `signInWithOtp(email)` correctly sends the OTP request
- `verifyOtp(email, token)` with `type: "email"` correctly verifies the 6-digit code

The code is already set up to handle 6-digit codes - only the Supabase email template needs to be updated.

---

## Why This Works

Supabase always generates both:
1. A **magic link** URL with a token hash
2. A **6-digit numeric code** (`{{ .Token }}`)

The default email template only shows the magic link. By updating the template to show `{{ .Token }}`, users will receive the 6-digit code they can manually enter.

---

## Post-Implementation Verification

After updating the email template:
1. Go to the Auth page and enter your email
2. Check your email - you should now see a 6-digit code
3. Enter the code in the OTP input fields
4. You should be signed in successfully

---

## Summary

| Component | Status | Action Required |
|-----------|--------|-----------------|
| `src/hooks/useAuth.tsx` | Correct | None |
| `src/pages/Auth.tsx` | Correct | None |
| Supabase Email Template | Needs Update | Update "Magic Link" template in Dashboard |

