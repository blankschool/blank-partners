

# Fix OTP Length Mismatch - 8 Digits in Email vs 6 in App

## Problem Identified

The Supabase project is configured to send **8-digit OTP codes** via email, but the application's UI only accepts **6 digits**. This mismatch causes all verification attempts to fail.

Looking at the auth logs, the verification request shows:
```json
{"token":"202800","type":"magiclink"}  // 6 digits entered
{"token":"280036","type":"magiclink"}  // 6 digits entered
```

But the email is sending 8-digit codes, so the user can only enter the first 6 digits, which doesn't match the full token.

---

## Solution Options

### Option A: Change Supabase to Send 6-Digit Codes (Recommended)

**Dashboard Action Required:**

1. Go to [Authentication > Providers > Email](https://supabase.com/dashboard/project/okrxrccvvztawynoavqd/auth/providers?provider=Email)
2. Find the **"OTP Length"** setting
3. Change it from **8** to **6**
4. Save the configuration

This is the simpler fix and requires no code changes.

---

### Option B: Update App to Accept 8-Digit Codes

If you prefer to keep 8-digit codes for security, update the UI:

**Files to Modify:**

| File | Changes |
|------|---------|
| `src/pages/Auth.tsx` | Change `maxLength={6}` to `maxLength={8}`, add 2 more `InputOTPSlot` components, update validation from `otp.length !== 6` to `otp.length !== 8`, update text from "6-digit code" to "8-digit code" |

**Specific Changes in `src/pages/Auth.tsx`:**

1. **Line 49**: Change `if (otp.length !== 6)` to `if (otp.length !== 8)`
2. **Line 173**: Change "We sent a 6-digit code to" to "We sent an 8-digit code to"
3. **Lines 180-194**: Update InputOTP:
   - Change `maxLength={6}` to `maxLength={8}`
   - Add two more InputOTPSlot components (index 6 and 7)
4. **Line 198**: Change `otp.length !== 6` to `otp.length !== 8`

---

## Recommended Approach

**Option A is recommended** because:
- No code changes required
- 6-digit codes are standard for OTP (used by Google, Microsoft, etc.)
- Faster to implement

---

## Verification Steps

After applying either fix:
1. Go to the Auth page and enter your email
2. Click "Send Code"
3. Check your email for the code (verify it matches the expected length)
4. Enter the complete code in the OTP input fields
5. You should now be signed in successfully

---

## Summary

| Issue | Root Cause | Fix |
|-------|------------|-----|
| OTP code length mismatch | Supabase sends 8 digits, app expects 6 | Either change Supabase setting to 6, OR update app UI to accept 8 |

