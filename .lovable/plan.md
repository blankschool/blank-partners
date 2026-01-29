
# Sign-In Page Implementation Plan

## Overview
Create a dedicated sign-in page (`/auth`) that follows the existing monochromatic, glassmorphism design aesthetic. The page will feature SSO-only authentication (no email/password signup option) using Supabase Auth.

---

## Design Specifications

### Visual Elements
- Full-page centered layout with gradient background
- Glassmorphism card container with backdrop blur and semi-transparent background
- "B" logo icon with gradient matching the sidebar branding
- Serif typography for headings (DM Serif Display)
- Sans-serif typography for body text (Inter)
- Pill-shaped buttons with subtle hover animations
- Large border radius (rounded-2xl) consistent with existing components

### Color Palette
- Monochromatic black/white scheme
- Uses existing CSS variables (--foreground, --background, --card, etc.)
- Subtle accent dot indicator matching Dashboard style

---

## Implementation Steps

### 1. Create Auth Page Component
**File:** `src/pages/Auth.tsx`

- Full-height centered layout with gradient background
- Glassmorphism sign-in card containing:
  - Brand logo ("B" with gradient) and app name "Blank"
  - "Agency ERP" subtitle
  - Welcome heading with serif font
  - Brief description text
  - SSO sign-in button (Google initially, extensible for others)
  - Footer with support/help text
- Loading state handling during authentication
- Error handling with toast notifications
- Redirect to Dashboard on successful authentication

### 2. Create Auth Context/Hook
**File:** `src/hooks/useAuth.tsx`

- Authentication state management using Supabase
- Session persistence with proper initialization order
- Methods: `signInWithGoogle()`, `signOut()`
- Proper `onAuthStateChange` listener setup
- Automatic redirect handling for authenticated users

### 3. Update App Router
**File:** `src/App.tsx`

- Add `/auth` route for the sign-in page
- Implement protected route wrapper for authenticated pages
- Redirect unauthenticated users to `/auth`
- Redirect authenticated users away from `/auth` to Dashboard

### 4. Add Sign-Out Functionality
**File:** `src/components/layout/AppSidebar.tsx`

- Add user avatar/info in footer when logged in
- Add sign-out button with proper styling

---

## Technical Details

### SSO Implementation
```text
+------------------+     +------------------+     +------------------+
|   Auth Page      | --> |  Supabase Auth   | --> |    Dashboard     |
|   (SSO Button)   |     |  (Google OAuth)  |     |  (Protected)     |
+------------------+     +------------------+     +------------------+
```

### Authentication Flow
1. User visits any protected route
2. If not authenticated, redirect to `/auth`
3. User clicks "Sign in with Google" button
4. Supabase handles OAuth flow with Google
5. On success, user is redirected to Dashboard
6. Session is persisted in localStorage

### Key Security Considerations
- Proper `emailRedirectTo` configuration for OAuth callbacks
- Session state managed via `onAuthStateChange` listener
- No sensitive data logged to console
- Protected routes check authentication before rendering

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/Auth.tsx` | Create | Sign-in page component |
| `src/hooks/useAuth.tsx` | Create | Authentication hook/context |
| `src/components/ProtectedRoute.tsx` | Create | Route guard component |
| `src/App.tsx` | Modify | Add auth route and protected routes |
| `src/components/layout/AppSidebar.tsx` | Modify | Add sign-out button |

---

## Post-Implementation Notes

After implementation, you will need to configure Google OAuth in your Supabase dashboard:
1. Go to Authentication > Providers > Google
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Secret)
4. Ensure the redirect URL matches your Supabase callback URL

You may also want to:
- Disable "Confirm email" in Supabase settings for faster testing
- Add the preview URL to allowed redirect URLs in Supabase
