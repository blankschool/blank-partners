

# Team Data Structure Implementation

## Overview

You've provided a CSV with 39 team members containing rich information. The current database schema needs to be extended to accommodate all this data.

## CSV Data Analysis

| CSV Column | Portuguese | Example Data |
|------------|------------|--------------|
| Nome | Name | Paulo Gomes |
| Email | Email | paulo@blankschool.com.br |
| Data de Nascimento | Birth Date | 07/06/2001 |
| Início em Blank | Start Date | 13/01/2025 |
| Área | Department | Social Media, Criação, Operações, Diretoria, Comercial |
| Cargo | Position | Líder de Social Media, Designer, Editor de Vídeos |
| Senioridade | Seniority | Sênior, Pleno, Júnior |
| Líder | Leader | Micael Crasto |
| Squad | Squad | 1, 2, 3, etc. (some have multiple: "1 e 3") |
| Cliente 1-11 | Clients | Up to 11 assigned clients per person |

### Unique Departments Found
- Social Media
- Criação (Creative)
- Operações (Operations)
- Diretoria (Management/Board)
- Comercial (Sales)

### Unique Positions Found
- Fundador, Coordenador de Social Media, Coordenador de Criação, Coordenador de Operações
- Líder de Social Media, Líder de Design
- Social Media, Designer, Editor de Vídeos
- Estrategista, Account Manager, Vendedor, Analista de Tecnologia, Estagiário

### Unique Clients Found
~50+ unique clients across all team members

---

## Database Schema Changes

### 1. Update `team_type` Enum
Add new department values:
```sql
ALTER TYPE team_type ADD VALUE 'Diretoria';
ALTER TYPE team_type ADD VALUE 'Comercial';
-- Rename existing values to Portuguese:
-- Creative -> Criação, Operations -> Operações
```

### 2. Create `seniority_level` Enum
```sql
CREATE TYPE seniority_level AS ENUM ('Júnior', 'Pleno', 'Sênior');
```

### 3. Create `team_members` Table
Store the extended team member data (separate from auth profiles):
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  birth_date DATE,
  start_date DATE,
  area team_type,
  position TEXT,
  seniority seniority_level,
  leader_id UUID REFERENCES team_members(id),
  squad TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. Create `clients` Table
Store unique clients that can be assigned to team members:
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5. Create `team_member_clients` Junction Table
Many-to-many relationship between team members and clients:
```sql
CREATE TABLE team_member_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_member_id, client_id)
);
```

---

## Implementation Steps

### Phase 1: Database Migration
1. Update `team_type` enum with new values
2. Create `seniority_level` enum
3. Create `team_members` table with RLS policies
4. Create `clients` table with RLS policies
5. Create `team_member_clients` junction table with RLS policies

### Phase 2: Data Import Hook
Create `useTeamMembers` hook to:
- Fetch team members with their clients and leader info
- Support CRUD operations
- Handle filtering and searching

### Phase 3: Update Team Page
1. Replace hardcoded `teamData` with database-fetched data
2. Display: name, email, area, position, seniority, leader, squad, clients
3. Add filters by area, seniority, leader
4. Show team statistics based on real data

### Phase 4: Data Seeding
Create an edge function or migration to import the CSV data into the new tables

---

## Technical Details

### RLS Policies

```sql
-- team_members: authenticated users can view all, admins can modify
-- clients: authenticated users can view all, admins can modify
-- team_member_clients: authenticated users can view all, admins can modify
```

### Team Page Component Updates

```text
src/pages/Team.tsx
├── Fetch from useTeamMembers hook
├── Display stats: Total members, By area, By seniority
├── Filter by: Area, Seniority, Leader, Squad
├── Search by: Name, Email, Client
└── Card shows: Name, Email, Area, Position, Seniority, Squad, Clients
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/*` | Create | Database schema changes |
| `src/hooks/useTeamMembers.tsx` | Create | Hook for team member data |
| `src/pages/Team.tsx` | Modify | Use real data from database |
| `src/components/team/TeamMemberCard.tsx` | Create | Reusable member card component |
| `src/components/team/TeamFilters.tsx` | Create | Filter controls for team page |

---

## Questions Before Proceeding

Do you want me to proceed with this full implementation, or would you prefer a simpler approach that just:
1. Extends the existing `profiles` table with the new fields
2. Skips the separate `team_members` table
3. Stores clients as a simple text array instead of a separate table

The full approach is more scalable and allows for proper client management, but requires more database tables.

