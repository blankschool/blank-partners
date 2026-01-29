

# Fix Team Members Self-Join Query Error

## Problem

The error message is:
```
Could not find a relationship between 'team_members' and 'team_members' in the schema cache
```

This happens because PostgREST (Supabase's API layer) has difficulty with self-referencing foreign keys when using the `table!foreign_key_name` syntax. The query on line 58 tries to join `team_members` to itself via the `leader_id` column:

```typescript
.select(`
  *,
  leader:team_members!team_members_leader_id_fkey(full_name)
`)
```

PostgREST's schema cache doesn't properly recognize this self-referential relationship pattern.

## Solution

Instead of trying to use PostgREST's relationship syntax for the self-join, we should:
1. Fetch all team members without the leader join
2. Build the leader lookup in JavaScript by matching `leader_id` to member `id`

This approach is more reliable for self-referencing tables and avoids the PostgREST schema cache limitation.

## Implementation

### File: `src/hooks/useTeamMembers.tsx`

**Change the query to remove the self-join (lines 54-60):**

```typescript
// Before (causes error):
const { data: membersData, error: membersError } = await supabase
  .from("team_members")
  .select(`
    *,
    leader:team_members!team_members_leader_id_fkey(full_name)
  `)
  .order("full_name");

// After (works correctly):
const { data: membersData, error: membersError } = await supabase
  .from("team_members")
  .select("*")
  .order("full_name");
```

**Build the leader lookup in JavaScript (update lines 84-95):**

```typescript
// Create a map for leader lookup
const leaderMap = new Map<string, string>();
membersData.forEach((member) => {
  leaderMap.set(member.id, member.full_name);
});

// Merge clients and leader into team members
return membersData.map((member) => {
  const leaderName = member.leader_id ? leaderMap.get(member.leader_id) : null;

  return {
    ...member,
    leader: leaderName ? { full_name: leaderName } : null,
    clients: clientsMap.get(member.id) || [],
  };
}) as TeamMember[];
```

## How It Works

| Step | Action |
|------|--------|
| 1 | Fetch all team members (simple SELECT *) |
| 2 | Create a Map of member.id -> member.full_name |
| 3 | For each member, look up their leader's name using leader_id |
| 4 | Return the enriched data with leader info attached |

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useTeamMembers.tsx` | Remove PostgREST self-join, add JavaScript leader lookup |

