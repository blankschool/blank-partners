

# Show Content Cards in Calendar Days

## Problem

The current calendar displays only colored dots at the bottom of each day cell with a "+47" style count. Users cannot see what content is scheduled without hovering (tooltip) or clicking (dialog). This makes it hard to quickly scan and understand the calendar at a glance.

## Solution

Replace the dots with mini content cards showing:
- Client name (truncated)
- Stage badge with color

Show 2-3 items per day cell with a "+X more" indicator for additional items.

## Visual Comparison

```text
BEFORE (dots only):
+------------------+
| 15               |
|                  |
|                  |
|   ●●●● +47       |
+------------------+

AFTER (mini cards):
+------------------+
| 15               |
| [Rony Meisler]   |
| [Cliente ABC]    |
| +45 mais...      |
+------------------+
```

## Implementation Details

### File: `src/components/contents/ContentCalendar.tsx`

**Changes to day cell content area (lines 150-170):**

Replace the dots-only display with mini content preview cards:

```text
{/* Content preview - show up to 2 items */}
{dayItems.length > 0 && (
  <div className="absolute bottom-1 left-1 right-1 space-y-0.5 overflow-hidden">
    {dayItems.slice(0, 2).map((item, idx) => {
      const stageConfig = getStageConfig(item.status);
      return (
        <div
          key={idx}
          className={cn(
            "text-[9px] px-1 py-0.5 rounded truncate",
            stageConfig?.bgColor || 'bg-muted',
            stageConfig?.color || 'text-muted-foreground'
          )}
        >
          {item.client || 'Sem cliente'}
        </div>
      );
    })}
    {dayItems.length > 2 && (
      <span className="text-[9px] text-muted-foreground block text-center">
        +{dayItems.length - 2} mais
      </span>
    )}
  </div>
)}
```

**Adjust cell height to accommodate cards:**

Update the button className from `aspect-[4/3]` to a slightly taller ratio or minimum height to fit the content cards:

```text
// Before
"aspect-[4/3] p-1 rounded-lg..."

// After  
"min-h-[80px] p-1 rounded-lg..."
```

**Position day number properly:**

Keep the day number in the top-left, but ensure there's enough space below for the content cards.

## Styling Details

| Element | Current | Updated |
|---------|---------|---------|
| Day cell height | `aspect-[4/3]` | `min-h-[80px]` or `aspect-[3/4]` |
| Content display | 4 colored dots + count | 2 mini cards with client name |
| Card style | N/A | Small rounded pill with stage color |
| Overflow indicator | `+{n}` small text | `+{n} mais` centered |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/ContentCalendar.tsx` | Replace dots with mini content cards, adjust cell dimensions |

## Expected Result

1. Each calendar day shows up to 2 content items with client names
2. Items are color-coded by their stage (using stage background colors)
3. Days with more than 2 items show a "+X mais" indicator
4. Clicking a day still opens the full dialog with all items
5. Calendar remains scannable but now shows meaningful content previews

