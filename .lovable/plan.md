
# Import Team Data from CSV to Supabase

## Problem

The database tables (`team_members`, `clients`, `team_member_clients`) were created, but no data was imported. The Team page shows "Nenhum membro na equipe ainda" because the tables are empty.

## CSV Data Summary

The CSV contains **39 team members** with:
- Names, emails, birth dates, start dates
- Areas: Social Media, Criacao, Operacoes, Diretoria, Comercial
- Positions, seniority levels (Junior, Pleno, Senior)
- Leaders (self-referencing relationships)
- Up to 11 clients per person (~50 unique clients total)

## Solution

Create an edge function `import-team-data` that:
1. Parses the CSV data
2. Extracts unique clients and inserts them into the `clients` table
3. Inserts team members (without leader_id initially)
4. Updates team members with correct leader_id references
5. Creates client assignments in `team_member_clients`

## Implementation

### Phase 1: Create Edge Function

**File: `supabase/functions/import-team-data/index.ts`**

```typescript
// Edge function that:
// 1. Contains the CSV data as a constant (embedded in code)
// 2. Parses dates in DD/MM/YYYY format
// 3. Handles the two-phase leader resolution
// 4. Creates all client assignments

const teamData = [
  { name: "Paulo Gomes", email: "paulo@blankschool.com.br", ... },
  // All 39 team members
];
```

### Phase 2: Data Processing Logic

```text
Step 1: Extract & Insert Unique Clients
        ├── Parse all Cliente 1-11 columns
        ├── Remove duplicates and empty values
        └── INSERT INTO clients (name) VALUES ...

Step 2: Insert Team Members (First Pass)
        ├── Parse dates (DD/MM/YYYY -> YYYY-MM-DD)
        ├── Map area to team_type enum
        ├── Map seniority to seniority_level enum
        └── INSERT INTO team_members (leader_id = NULL initially)

Step 3: Update Leader References
        ├── Build map: full_name -> id
        ├── For each member with a leader name
        └── UPDATE team_members SET leader_id = <leader_id>

Step 4: Create Client Assignments
        ├── For each team member
        ├── For each of their clients
        └── INSERT INTO team_member_clients (team_member_id, client_id)
```

### Phase 3: Date Parsing

Handle various date formats in the CSV:
- Standard: `07/06/2001` -> `2001-06-07`
- Short year: `15/11/98` -> `1998-11-15`
- Some dates appear swapped (birth date shows future year)

### Phase 4: Special Cases

| Issue | Solution |
|-------|----------|
| Leader = "-" | Set leader_id to NULL |
| Leader = "Pedro Bonzanini" | Look up ID after first pass |
| Squad = "5 e 7" | Store as text (already handled) |
| Empty client columns | Skip during assignment |
| Duplicate clients | Use UPSERT with ON CONFLICT |

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/import-team-data/index.ts` | Edge function with embedded CSV data |

## Execution Flow

After creating the edge function:
1. Deploy the function automatically
2. Call the function once to import data
3. Verify data appears on the Team page

## Technical Details

The edge function will:
- Use the Supabase service role key for admin access
- Handle RLS bypass for bulk inserts
- Return a summary of imported records
- Be idempotent (can be run multiple times safely with UPSERT)
