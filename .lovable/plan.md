

# Implement Notification Dropdown for Bell Button

## Overview

Transform the notification bell button in the header into a functional dropdown that displays real notifications. The design will follow the reference image style - a clean popover with notification items that have title and description.

---

## Database Changes

Create a `notifications` table to store real notifications:

```sql
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'info',  -- info, success, warning, error
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,  -- Optional link to navigate to
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

---

## New Files

| File | Purpose |
|------|---------|
| `src/components/notifications/NotificationDropdown.tsx` | Popover component with notification list |
| `src/hooks/useNotifications.tsx` | Hook to fetch and manage notifications |

---

## Component Design

The dropdown will follow the reference design with:
- Clean popover with smooth animation
- Notification items with bold title and muted description
- Badge showing unread count (like the current "3")
- Mark as read / mark all as read functionality
- Empty state when no notifications

```text
+----------------------------------+
| NOTIFICATIONS            Mark all read |
+----------------------------------+
| Content Approved               |
| Instagram post for Acme Corp   |
| was approved by client         |
|                          2h ago|
+----------------------------------+
| Deadline Approaching           |
| Facebook campaign for Brand X  |
| is due tomorrow                |
|                          6h ago|
+----------------------------------+
| New Team Member                |
| Sarah Johnson joined the team  |
|                          1d ago|
+----------------------------------+
|        View all notifications        |
+----------------------------------+
```

---

## Implementation Details

### NotificationDropdown Component

```tsx
// Key features:
- Uses Popover from @radix-ui
- Styled to match project's design system (rounded-2xl, bg-card)
- Lists notifications with icon based on type
- Shows relative time (2h ago, 1d ago)
- "Mark all as read" button clears badge
- Click on notification marks it as read
```

### useNotifications Hook

```tsx
interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/layout/AppHeader.tsx` | Replace static bell button with `NotificationDropdown` component |

---

## Styling (Following Design System)

- Popover: `rounded-2xl bg-card border border-border shadow-lg`
- Header: Orange accent dot + uppercase label "NOTIFICATIONS"
- Items: Hover state with subtle background change
- Title: `font-medium text-foreground`
- Description: `text-sm text-muted-foreground`
- Time: `text-xs text-muted-foreground`
- Icons: Colored based on notification type (success, warning, etc.)

---

## Badge Count

The badge will show the actual unread count from the database instead of the hardcoded "3":
- Fetches unread count in real-time
- Updates when notifications are marked as read
- Hides when count is 0

---

## Summary

| Component | Count |
|-----------|-------|
| Database migrations | 1 (notifications table + RLS) |
| New components | 1 (NotificationDropdown) |
| New hooks | 1 (useNotifications) |
| Modified files | 1 (AppHeader.tsx) |

