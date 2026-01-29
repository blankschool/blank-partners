

# Fix OTP Login - Correct Token Type

## Problem Identified

After thorough investigation of the auth logs and Supabase documentation, I found the root cause:

**The `verifyOtp` function is using the wrong `type` parameter.**

When calling `signInWithOtp` for an existing user (with `shouldCreateUser: false`), Supabase logs show:
```
"action":"user_recovery_requested"
```

This means Supabase internally treats this as a "recovery" flow, and the generated token is a **magic link/recovery token** - not a standard email OTP token.

The current code uses:
```typescript
type: "email"  // Wrong for this flow
```

But it should use:
```typescript
type: "magiclink"  // Correct for signInWithOtp flow
```

---

## Solution

Update the `verifyOtp` function in `src/hooks/useAuth.tsx` to use `type: "magiclink"` instead of `type: "email"`.

### Current Code (Line 52-58)
```typescript
const verifyOtp = async (email: string, token: string) => {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",  // <-- WRONG
  });
  return { error };
};
```

### Fixed Code
```typescript
const verifyOtp = async (email: string, token: string) => {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "magiclink",  // <-- CORRECT
  });
  return { error };
};
```

---

## Why This Works

According to Supabase documentation and GitHub discussions:

| Token Type | Use Case |
|------------|----------|
| `"email"` | For numeric OTP codes sent during **signup** flow |
| `"magiclink"` | For tokens sent via `signInWithOtp()` for existing users |
| `"recovery"` | For password reset flows |

Since we're using `signInWithOtp` with `shouldCreateUser: false` (login-only for existing users), the correct type is `"magiclink"`.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useAuth.tsx` | Change `type: "email"` to `type: "magiclink"` on line 56 |

---

## Verification Steps

After applying this fix:
1. Go to the Auth page and enter your email
2. Check your email for the 6-digit code (from your updated template)
3. Enter the code in the OTP input fields
4. You should now be signed in successfully

