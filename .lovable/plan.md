

# Create My Profile Page for Logged-In User

## Overview

Build a new "Profile" page at `/profile` where the logged-in user can view and edit their own profile information including photo, name, position, and team.

---

## Features

The profile page will allow users to:
1. View their profile information (photo, name, email, position, team)
2. Upload/change their profile photo
3. Edit their name, position, and team
4. View their role (read-only, admin status is shown but not editable by the user)

---

## Database Changes

### Storage Bucket for Avatars

Create a new storage bucket for user avatars:

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- RLS policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy: Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Update Profiles RLS

Add a policy allowing users to update their own profile:

```sql
-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

---

## New Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Profile.tsx` | Profile page for the logged-in user |
| `src/hooks/useCurrentProfile.tsx` | Hook to fetch and update current user's profile |
| `src/components/profile/ProfileHeader.tsx` | Header section with avatar and basic info |
| `src/components/profile/ProfileForm.tsx` | Form to edit profile details |
| `src/components/profile/AvatarUpload.tsx` | Component for uploading/changing avatar |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/profile` route |
| `src/components/layout/AppHeader.tsx` | Make user avatar/name clickable to go to profile |
| `src/components/layout/AppSidebar.tsx` | Add Profile link or make user section clickable |

---

## Page Layout

```text
+-------------------------------------------------------+
| TEAM MANAGEMENT (dot + label)                         |
| My Profile (serif title)                              |
| Manage your personal information and preferences      |
+-------------------------------------------------------+

+-------------------------------------------------------+
| PROFILE DETAILS                                       |
| +---------------------------------------------------+ |
| |  [Avatar]  Upload Photo                           | |
| |  (click to change)                                | |
| +---------------------------------------------------+ |
|                                                       |
| Full Name: [________________]                         |
|                                                       |
| Email: pedro@blankschool.com.br (read-only)          |
|                                                       |
| Position: [Dropdown________▼]                        |
|                                                       |
| Team: [Dropdown________▼]                            |
|                                                       |
| Role: [User badge] (read-only)                       |
|                                                       |
|                              [Cancel] [Save Changes] |
+-------------------------------------------------------+
```

---

## Implementation Details

### useCurrentProfile Hook

```typescript
// Fetches the current user's profile
// Provides mutation for updating profile
// Provides mutation for uploading avatar
interface UseCurrentProfileReturn {
  profile: Profile | null;
  positions: Position[];
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: UpdateOwnProfileData) => void;
  uploadAvatar: (file: File) => Promise<string>;
  isUpdating: boolean;
}
```

### Avatar Upload Flow

1. User clicks on avatar or "Upload Photo" button
2. File picker opens (accept images only, max 2MB)
3. Image is uploaded to `avatars/{user_id}/avatar.{ext}`
4. Profile is updated with new `avatar_url`
5. Avatar displays in real-time

### Form Validation

- Full name: Required, max 100 characters
- Position: Optional, select from positions table
- Team: Optional, select from predefined teams
- Email and role: Displayed but not editable

---

## Navigation Access Points

Users can access their profile from:
1. **Header**: Click on avatar/name in top-right corner
2. **Sidebar**: Click on avatar/name in footer
3. **Direct URL**: `/profile`

---

## Design Patterns

Following the established template:
- Orange accent dot + uppercase label for sections
- Serif font for titles
- `rounded-2xl` cards with `bg-card border border-border shadow-sm`
- Icon containers with `bg-secondary rounded-2xl`
- Consistent spacing and typography

---

## Summary

| Component | Count |
|-----------|-------|
| Database migrations | 1 (storage bucket + RLS policies) |
| New pages | 1 (Profile.tsx) |
| New components | 3 (ProfileHeader, ProfileForm, AvatarUpload) |
| New hooks | 1 (useCurrentProfile) |
| Modified files | 3 (App.tsx, AppHeader.tsx, AppSidebar.tsx) |

