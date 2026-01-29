
# Create Users Management Page

## Overview

Build a new "Users" page at `/users` where administrators can view and manage user profiles with Name, Email, Position, and Team fields. This requires database tables with proper security (RLS), admin role management, and a new UI page.

---

## Database Architecture

### Tables to Create

```text
+-------------------+     +-------------------+     +-------------------+
|   user_roles      |     |    profiles       |     |    positions      |
+-------------------+     +-------------------+     +-------------------+
| id (uuid, PK)     |     | id (uuid, PK)     |     | id (uuid, PK)     |
| user_id (FK)      |     | user_id (FK)      |     | name (text)       |
| role (app_role)   |     | full_name (text)  |     | created_at        |
| created_at        |     | email (text)      |     +-------------------+
+-------------------+     | position_id (FK)  |
                          | team (team_type)  |
                          | avatar_url (text) |
                          | created_at        |
                          | updated_at        |
                          +-------------------+
```

### Enums

1. **app_role**: `'admin'`, `'user'`
2. **team_type**: `'Creative'`, `'Marketing'`, `'Client Services'`, `'Operations'`

### Security Functions

- `has_role(user_id, role)`: Security definer function to check user roles (prevents RLS recursion)
- `is_admin()`: Convenience function to check if current user is admin

### RLS Policies

| Table | Operation | Policy |
|-------|-----------|--------|
| profiles | SELECT | Authenticated users can view all profiles |
| profiles | INSERT/UPDATE/DELETE | Admins only |
| user_roles | SELECT | Users can see their own roles |
| user_roles | INSERT/UPDATE/DELETE | Admins only |
| positions | SELECT | All authenticated users |
| positions | INSERT/UPDATE/DELETE | Admins only |

### Automatic Profile Creation

A database trigger will automatically create a profile when a new user signs up, using the email from `auth.users`.

---

## Implementation Steps

### Step 1: Database Migration

Create all tables, enums, functions, triggers, and RLS policies:

1. Create `app_role` enum with values `'admin'`, `'user'`
2. Create `team_type` enum with predefined teams
3. Create `user_roles` table with unique constraint on (user_id, role)
4. Create `profiles` table with position and team references
5. Create `positions` table with seed data
6. Create `has_role()` security definer function
7. Create `is_admin()` helper function
8. Create trigger to auto-create profiles on signup
9. Enable RLS and add policies to all tables

### Step 2: Create Positions Seed Data

Insert predefined positions:
- Content Manager
- Social Media Specialist
- Graphic Designer
- Video Editor
- Account Manager
- Project Manager
- Creative Director

### Step 3: New Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Users.tsx` | Main Users management page |
| `src/hooks/useUsers.tsx` | Hook for fetching/managing users |
| `src/hooks/useCurrentUserRole.tsx` | Hook for checking current user's role |
| `src/components/users/UserCard.tsx` | User card component |
| `src/components/users/AddUserDialog.tsx` | Dialog for adding new users |
| `src/components/users/EditUserDialog.tsx` | Dialog for editing users |

### Step 4: Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/users` route |
| `src/components/layout/AppSidebar.tsx` | Add Users navigation item |

---

## Page Features

### Users Page Layout

1. **Header Section**
   - Page title "Users"
   - Search input for filtering users
   - "Add User" button (visible only to admins)

2. **Stats Summary** (4 cards)
   - Total Users
   - Admins count
   - By team breakdown (optional)
   - Recently added

3. **Users Grid**
   - User cards displaying:
     - Avatar with initials
     - Full name
     - Email
     - Position badge
     - Team badge
     - Admin badge (if applicable)
     - Edit/Delete buttons (admin only)

### Add User Flow (Admin Only)

1. Admin clicks "Add User"
2. Dialog opens with form fields:
   - Full Name (text input)
   - Email (text input, must match an existing auth user)
   - Position (dropdown from positions table)
   - Team (dropdown from predefined teams)
3. Submit creates/updates the profile

### Edit User Flow (Admin Only)

1. Admin clicks edit on a user card
2. Dialog opens with pre-filled fields
3. Admin can modify Name, Position, Team
4. Email is read-only (tied to auth)

---

## Technical Details

### TypeScript Types

```typescript
interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  position_id: string | null;
  team: 'Creative' | 'Marketing' | 'Client Services' | 'Operations' | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  positions?: { name: string };
  user_roles?: { role: 'admin' | 'user' }[];
}

interface Position {
  id: string;
  name: string;
}
```

### Queries

```typescript
// Fetch all profiles with positions and roles
const { data } = await supabase
  .from('profiles')
  .select(`
    *,
    positions (name),
    user_roles (role)
  `)
  .order('full_name');

// Check if current user is admin
const { data } = await supabase
  .rpc('is_admin');
```

---

## Admin Setup Note

After implementation, you'll need to manually assign the first admin role in the Supabase Dashboard:

1. Go to Table Editor > user_roles
2. Insert a new row with:
   - `user_id`: Your user's ID (from auth.users)
   - `role`: `admin`

This bootstraps the first admin who can then manage other users through the UI.

---

## Summary

| Component | Count |
|-----------|-------|
| New database tables | 3 (profiles, user_roles, positions) |
| New enums | 2 (app_role, team_type) |
| New functions | 2 (has_role, is_admin) |
| New triggers | 1 (auto-create profile) |
| RLS policies | 8 (multiple per table) |
| New pages | 1 (Users.tsx) |
| New components | 3 (UserCard, AddUserDialog, EditUserDialog) |
| New hooks | 2 (useUsers, useCurrentUserRole) |
| Modified files | 2 (App.tsx, AppSidebar.tsx) |
