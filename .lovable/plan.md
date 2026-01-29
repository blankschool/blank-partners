
# Replace Mock Clients with Real Database Data

## Problem

The Clients page (`/clients`) currently displays hardcoded mock data (5 fake clients like "Acme Corporation"). The real clients from the CSV (54 total) are already stored in the `clients` table but aren't being displayed.

## Database Summary

The database contains:
- **54 clients** in the `clients` table
- **124 client-team member assignments** in `team_member_clients`
- Each client has between 1-4 team members assigned

## Solution

1. Create a dedicated `useClients` hook to fetch clients from Supabase
2. Include the count of team members assigned to each client
3. Update the Clients page to use real data instead of mock data
4. Simplify the UI since the current schema doesn't include email, phone, status, or platforms

## Implementation

### Phase 1: Create useClients Hook

**File: `src/hooks/useClients.tsx`**

```typescript
interface ClientWithStats {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  members: { id: string; full_name: string }[];
}

// Hook will:
// 1. Fetch all clients from the clients table
// 2. Fetch team_member_clients with team member names
// 3. Merge to get member count and names per client
```

### Phase 2: Update Clients Page

**File: `src/pages/Clients.tsx`**

Changes:
- Remove hardcoded `clientsData` array
- Import and use the new `useClients` hook
- Add loading and error states
- Display real clients with:
  - Client name
  - Avatar initials generated from name
  - Number of team members assigned
  - List of team member names
- Remove status/email/phone/platforms (not in schema)
- Translate UI to Portuguese for consistency

## UI Changes

| Current (Mock) | New (Real) |
|----------------|------------|
| 5 fake clients | 54 real clients from CSV |
| Email, phone shown | Team members shown |
| Status badges | Member count |
| Platforms list | Team member names |
| English labels | Portuguese labels |

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/hooks/useClients.tsx` | Create - new hook for fetching clients |
| `src/pages/Clients.tsx` | Modify - use real data, update UI |

## Data Display

For each client:
```text
+------------------------------------------+
| [AV]  Client Name          3 membros     |
|       João, Maria, Pedro                 |
|                           [...]          |
+------------------------------------------+
```

Stats cards will show:
- Total de Clientes: 54
- (Since we don't have status, other stat cards can show member distribution)
