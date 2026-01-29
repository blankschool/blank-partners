
# Stat Cards Design Consistency Plan

## Issue
The Team and Clients pages use outdated stat card styling with small sans-serif numbers (`text-2xl font-semibold`), while the Healthscore page uses the refined Giga AI design with large serif numbers (`font-serif text-6xl`).

---

## Files to Modify

### 1. src/pages/Clients.tsx
**Current (lines 104-127):**
- Labels: `text-sm text-muted-foreground`
- Numbers: `text-2xl font-semibold`
- Padding: `p-4`
- No descriptions

**Updated to match Healthscore:**
- Labels: `text-[10px] font-medium uppercase tracking-widest text-muted-foreground`
- Numbers: `font-serif text-5xl font-normal tracking-tight`
- Color-specific numbers for status (success for Active, warning for Pending)
- Padding: `p-6`
- Add muted description text

### 2. src/pages/Team.tsx
**Current (lines 118-153):**
- Same old styling as Clients
- 4 stats in a row (may need layout adjustment)

**Updated to match Healthscore:**
- Labels: `text-[10px] font-medium uppercase tracking-widest text-muted-foreground`
- Numbers: `font-serif text-5xl font-normal tracking-tight`
- Color-specific numbers (success for Online, accent-orange for Completion Rate)
- Padding: `p-6`
- Add muted description text

---

## Specific Changes

### Clients Page Stats (3 cards)
```text
Card 1: Total Clients
- Label: "TOTAL CLIENTS" (uppercase, tiny, tracking-widest)
- Number: "5" (serif, text-5xl, foreground color)
- Description: "Registered in system"

Card 2: Active
- Label: "ACTIVE" 
- Number: "3" (serif, text-5xl, text-success color)
- Description: "Currently active clients"

Card 3: Pending Onboarding
- Label: "PENDING ONBOARDING"
- Number: "1" (serif, text-5xl, text-warning color)
- Description: "Awaiting setup"
```

### Team Page Stats (4 cards)
```text
Card 1: Team Members
- Label: "TEAM MEMBERS"
- Number: "5" (serif, text-5xl, foreground)
- Description: "Total headcount"

Card 2: Online Now
- Label: "ONLINE NOW"
- Number: "3" (serif, text-5xl, text-success)
- Description: "Currently available"

Card 3: Total Tasks
- Label: "TOTAL TASKS"
- Number: "117" (serif, text-5xl, foreground)
- Description: "Assigned this period"

Card 4: Completion Rate
- Label: "COMPLETION RATE"
- Number: "85%" (serif, text-5xl, text-accent-orange)
- Description: "Tasks completed"
```

---

## Visual Comparison

| Property | Current | Updated |
|----------|---------|---------|
| Number font | Sans-serif, semibold | DM Serif Display, normal |
| Number size | text-2xl (~24px) | text-5xl (~48px) |
| Label style | text-sm | text-[10px] uppercase tracking-widest |
| Card padding | p-4 | p-6 |
| Descriptions | None | Added below numbers |

---

## Implementation Summary

Both pages will receive updated stat card markup to match the Healthscore page pattern, ensuring visual consistency across the entire ERP panel with the refined Giga AI design system.
