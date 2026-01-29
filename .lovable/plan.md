
# Enhanced Calendar View with Content Preview and Day Popup

## Overview

This plan adds two features to the calendar view on the Contents page:
1. **Enhanced tooltip preview** showing content name + stage with visual badges
2. **Click-to-open popup** displaying all contents for the selected day in a scrollable dialog

## Current State

- Calendar shows colored dots for each content item
- Simple tooltip with count and client names (first 3)
- `onDayClick` prop exists but is not connected to anything

## Changes Required

### 1. Enhanced Tooltip Preview (ContentCalendar.tsx)

Update the tooltip to show richer content information:

| Current | Updated |
|---------|---------|
| Shows only count + client names | Shows client name + stage badge for each item |
| Plain text display | Colored badges matching stage configuration |
| Limited to 3 items preview | Show 4-5 items with stage indicators |

**Tooltip will display:**
- Total count header
- Each item with: Client name + Stage badge (colored)
- "e mais X..." for overflow

### 2. Day Click Popup (New Component + Integration)

Create a new `DayContentDialog` component that opens when clicking on a calendar day:

**Dialog Features:**
- Header showing the selected date (e.g., "29 de janeiro de 2026")
- Total content count
- Scrollable list of all contents for that day
- Each content shows: Client name, Stage badge, Format, Link to Notion
- Close button

### 3. State Management (Contents.tsx)

Add state to manage the popup:
- `selectedDay: Date | null`
- `selectedDayItems: ContentItem[]`
- Handler for `onDayClick` callback

## Files to Create/Modify

| File | Action | Changes |
|------|--------|---------|
| `src/components/contents/DayContentDialog.tsx` | Create | New dialog component for day content list |
| `src/components/contents/ContentCalendar.tsx` | Modify | Enhanced tooltip with stage badges |
| `src/pages/Contents.tsx` | Modify | Add state and handler for day popup |

## Technical Details

### DayContentDialog.tsx (New Component)

```text
Props:
- open: boolean
- onOpenChange: (open: boolean) => void
- date: Date | null
- items: ContentItem[]

Structure:
+------------------------------------------+
| Dialog                                    |
|   DialogContent                           |
|     DialogHeader                          |
|       DialogTitle: "29 de janeiro de 2026"|
|       DialogDescription: "X conteúdo(s)" |
|     ScrollArea (max-h-96)                 |
|       For each item:                      |
|         - Client name                     |
|         - Stage badge (colored)           |
|         - Format (if exists)              |
|         - External link icon              |
|     DialogFooter: Close button            |
+------------------------------------------+
```

### ContentCalendar.tsx Updates

```text
Enhanced TooltipContent:
- Show each item with colored stage badge
- Client name + stage label on same row
- Better visual hierarchy

Lines 174-190: Update tooltip content structure
```

### Contents.tsx Updates

```text
New state (around line 45):
+ const [selectedDay, setSelectedDay] = useState<Date | null>(null);
+ const [selectedDayItems, setSelectedDayItems] = useState<ContentItem[]>([]);

Handler function:
+ const handleDayClick = (date: Date, items: ContentItem[]) => {
+   setSelectedDay(date);
+   setSelectedDayItems(items);
+ };

Calendar prop (line 196):
- <ContentCalendar items={filteredItems} />
+ <ContentCalendar items={filteredItems} onDayClick={handleDayClick} />

Add dialog component after calendar:
+ <DayContentDialog
+   open={selectedDay !== null}
+   onOpenChange={(open) => !open && setSelectedDay(null)}
+   date={selectedDay}
+   items={selectedDayItems}
+ />
```

## Visual Design

### Enhanced Tooltip
```text
+--------------------------------+
| 5 conteúdo(s)                  |
| Rony Meisler  [Backlog]        |
| João Silva    [Publicado]      |
| Maria Santos  [Escrita]        |
| e mais 2...                    |
+--------------------------------+
```

### Day Content Dialog
```text
+----------------------------------------+
| [X]                                    |
|                                        |
| 29 de janeiro de 2026                  |
| 5 conteúdo(s) agendados                |
|                                        |
| +------------------------------------+ |
| | Rony Meisler                       | |
| | [Backlog]  Carrossel    [link]     | |
| +------------------------------------+ |
| | João Silva                         | |
| | [Publicado]  Reels      [link]     | |
| +------------------------------------+ |
| | ...                                | |
| +------------------------------------+ |
|                                        |
|                        [Fechar]        |
+----------------------------------------+
```

## Expected Result

1. **Hover on calendar day**: Shows enhanced tooltip with client names and colored stage badges
2. **Click on calendar day**: Opens dialog showing all contents for that day with full details
3. **Dialog interaction**: Scrollable content list with links to open each content in Notion
4. **Visual consistency**: Uses existing stage color configuration for badges
