
# Fix SM Filter and Content Display on Contents Page

## Problem Analysis

### Issue 1: SM Filter Not Working
The "SM" filter dropdown is configured to filter by social media **platforms** (Instagram, LinkedIn, YouTube, TikTok), but the actual data in the `socialMedia` field contains **person names** - the social media managers/assignees responsible for the content (e.g., "Henrique Portella").

This is a data mapping mismatch - the filter needs to be updated to filter by person instead of platform.

### Issue 2: Content ID Displayed Instead of Client Name
Currently the `ContentCard` shows `item.id` (a Notion UUID like "2eed77361cee80569c3ad1ca63ef3df7") as the main title. The user wants to see the **client name** as the primary identifier.

## Changes Required

### 1. ContentFilters.tsx - Change SM Filter to Filter by Person

| Current | Updated |
|---------|---------|
| Platform dropdown with predefined options | Dynamic person dropdown populated from data |
| Filter label "Todas SM" | "Todos responsáveis" |
| `selectedPlatform` prop | `selectedPerson` prop (or repurpose the same) |

**Changes:**
- Rename the platform filter to "Responsável" (Person in charge)
- Populate options dynamically from unique `socialMedia` values in the data
- Update filter logic to match person names exactly

### 2. Contents.tsx - Add Persons Extraction and Update Filter Logic

| Current | Updated |
|---------|---------|
| `selectedPlatform` filters by platform key | Filters by exact person name |
| No persons extraction | Extract unique `socialMedia` values |

**Changes:**
- Add `persons` extraction similar to `clients`
- Pass `persons` to `ContentFilters`
- Update filter logic to compare against person names

### 3. ContentCard.tsx - Show Client Name Instead of ID

| Current | Updated |
|---------|---------|
| Title: `{item.id || "Sem título"}` | Title: `{item.client || "Sem título"}` |
| Shows client separately below | Optionally show format or status |

**Changes:**
- Grid view: Display `item.client` as the title
- List view: Display `item.client` as the title
- Calendar tooltips: Display `item.client` instead of `item.id`

### 4. ContentCalendar.tsx - Update Tooltips

| Current | Updated |
|---------|---------|
| Shows `item.id` in tooltip | Shows `item.client` |

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Contents.tsx` | Extract persons, update filter prop names, adjust filter logic |
| `src/components/contents/ContentFilters.tsx` | Change platform filter to person filter with dynamic options |
| `src/components/contents/ContentCard.tsx` | Display `client` as title instead of `id` |
| `src/components/contents/ContentCalendar.tsx` | Show `client` in tooltips |

## Technical Details

```text
Contents.tsx:
+------------------------------------------+
| Add: persons = unique socialMedia values |
| Rename: selectedPlatform -> selectedPerson|
| Filter: exact match on socialMedia       |
+------------------------------------------+

ContentFilters.tsx:
+------------------------------------------+
| Props: add persons: string[]             |
| Label: "Responsável" / "Todos resp."     |
| Options: dynamic from persons array      |
+------------------------------------------+

ContentCard.tsx:
+------------------------------------------+
| Grid title: item.client                  |
| List title: item.client                  |
| Remove duplicate client display below    |
+------------------------------------------+

ContentCalendar.tsx:
+------------------------------------------+
| Tooltip text: item.client                |
+------------------------------------------+
```

## Expected Result
- The SM filter shows actual person names from the data and filters correctly
- Content cards display the client name as the main title
- Calendar tooltips show client names
- Filter functionality works as expected for filtering by responsible person
