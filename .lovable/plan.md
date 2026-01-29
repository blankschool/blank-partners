

# Google Sheets Integration for Contents Dashboard

## Overview

Connect your public Google Sheets spreadsheet to the Contents page, displaying a content dashboard with:
- Stage-based summary panel at the top
- Day-by-day calendar view to track content
- Multi-filter system (Social Media, Client, Stage, Period)

---

## Your Content Stages (from spreadsheet)

Based on your workflow, I'll implement these stages with appropriate colors:

| Category | Stage | Color |
|----------|-------|-------|
| **A fazer (To do)** | Backlog | Gray |
| | Rascunho | Orange |
| **Em andamento (In progress)** | Escrita | Orange |
| | Aprovacao escrita | Blue |
| | Em briefing | Blue |
| | Ajustes Escrita | Orange |
| | Gravacao de video | Pink |
| | Gravacao de audio | Orange |
| | Edicao de video | Purple |
| | Criacao Design | Orange |
| | Aprovacao post | Blue |
| | Ajustes edicao de video | Orange |
| | Ajustes criacao design | Orange |
| **Final** | Pronto para postar | Green/Yellow |
| | Publicado | Green (with checkmark) |
| | Cancelado | Red (with X) |

**Social Media Platforms:** Instagram, LinkedIn, YouTube, TikTok

---

## Setup Requirement

You'll need to publish your Google Sheet to the web:
1. Open your Google Sheet
2. Go to **File > Share > Publish to web**
3. Select the sheet/tab you want to publish
4. Choose **CSV** format
5. Click **Publish** and copy the URL

---

## Architecture

```text
Google Sheets (CSV) --> Edge Function (fetch & parse) --> React Query --> Contents Page
```

The edge function will:
1. Fetch the published CSV from Google Sheets
2. Parse it into structured JSON
3. Return the data to the frontend

---

## New Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/fetch-sheets-content/index.ts` | Edge function to fetch and parse Google Sheets |
| `src/hooks/useGoogleSheetsContent.tsx` | Hook to fetch content from edge function |
| `src/components/contents/StageStatsPanel.tsx` | Top panel showing content count per stage |
| `src/components/contents/ContentCalendar.tsx` | Day-by-day calendar view |
| `src/components/contents/ContentFilters.tsx` | Filter controls (SM, Client, Stage, Period) |
| `src/components/contents/ContentCard.tsx` | Individual content item card |
| `src/lib/contentStages.ts` | Stage definitions with colors and icons |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Contents.tsx` | Complete redesign with new components |

---

## Page Layout Design

```text
+------------------------------------------------------------------+
| CONTENT MANAGEMENT                                                |
| Contents (serif title)                                            |
| Manage and track all your client content across platforms         |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| STAGE OVERVIEW (Stats Panel)                                      |
| +--------+ +--------+ +--------+ +--------+ +--------+ +--------+ |
| |   3    | |   5    | |   2    | |   8    | |   4    | |  12    | |
| |Backlog | |Escrita | |Aprovac.| |Edicao  | |Pronto  | |Publicad| |
| +--------+ +--------+ +--------+ +--------+ +--------+ +--------+ |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| FILTERS                                                           |
| [All SM ▼] [All Clients ▼] [All Stages ▼] [📅 Period: This Month]|
| [Search contents...]                          [Grid] [List] [Cal] |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| CALENDAR VIEW (When calendar mode selected)                       |
| < January 2026 >                                                  |
| Mon   Tue   Wed   Thu   Fri   Sat   Sun                          |
| +---+ +---+ +---+ +---+ +---+ +---+ +---+                         |
| |   | | 1 | | 2 | | 3 | | 4 | | 5 | | 6 |                         |
| |   | |●●●| |●● | |●  | |●●●| |   | |   |                         |
| +---+ +---+ +---+ +---+ +---+ +---+ +---+                         |
|                                                                   |
| ● = Content scheduled (colored by stage/platform)                 |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| CONTENT LIST (When list/grid mode selected)                       |
| [Content cards showing: title, client, platform, stage, date]     |
+------------------------------------------------------------------+
```

---

## Data Schema

Content item from Google Sheets:

```typescript
interface ContentItem {
  id: string;           // Content Client ID
  status: string;       // Stage (e.g., "Escrita", "Publicado")
  date: string;         // Data column (scheduled/publish date)
  format: string;       // Format type
  url: string;          // Content URL
  socialMedia: string;  // SM column (Instagram, LinkedIn, etc.)
  client?: string;      // Extracted from ID if available
}
```

---

## Edge Function: fetch-sheets-content

```typescript
// Fetches CSV from published Google Sheet
// Parses into structured JSON
// Handles column mapping:
//   - Content Client ID -> id, client
//   - Status -> status
//   - Data -> date
//   - Format -> format
//   - URL -> url
//   - SM -> socialMedia
```

The Sheet URL will be stored as a Supabase secret: `GOOGLE_SHEETS_URL`

---

## Stage Stats Panel

Horizontal scroll of mini stat cards showing:
- Count per stage
- Color-coded badges matching your workflow
- Click to filter by that stage

---

## Content Calendar Component

Features:
- Monthly view with navigation (previous/next month)
- Each day cell shows content dots/badges
- Color indicates stage or platform
- Click on a day to see detailed content list
- Hover shows content count tooltip

---

## Filter System

| Filter | Options |
|--------|---------|
| Social Media | All, Instagram, LinkedIn, YouTube, TikTok |
| Client | Dynamic list from data |
| Stage | All stages from your workflow |
| Period | This Week, This Month, Custom Range |

---

## Implementation Summary

| Component | Count |
|-----------|-------|
| Edge functions | 1 (fetch-sheets-content) |
| New secrets | 1 (GOOGLE_SHEETS_URL) |
| New components | 5 |
| New hooks | 1 |
| New utility files | 1 |
| Modified files | 1 |

---

## Next Steps After Implementation

1. You'll need to publish your Google Sheet and provide the CSV URL
2. I'll add the URL as a secret in Supabase
3. The Contents page will automatically sync with your spreadsheet

