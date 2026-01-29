

# Fix Day Content Dialog Display Issues

## Problem Analysis

Based on the screenshot and data review, I found several issues with the popup:

### Issue 1: Title Capitalization
The date "8 De Janeiro De 2026" incorrectly capitalizes "De" - should be "8 de janeiro de 2026"

**Cause**: The `capitalize` CSS class capitalizes the first letter of each word, but Portuguese date format requires lowercase prepositions.

### Issue 2: Stage Badges Not Showing
Content cards are missing stage badges because the status values from the API include emoji prefixes:
- API returns: `"✅ Publicado"`, `"📝 Escrita"`, `"🔴 Cancelado"`
- Code expects: `"publicado"`, `"escrita"`, `"cancelado"`

**Cause**: The `getStageConfig()` function does a lowercase comparison but doesn't strip emoji prefixes.

### Issue 3: Empty/Sparse Cards
Cards appear empty because:
- Most items have empty `format` field
- Stage badges are not rendering (issue 2)
- Vertical layout creates excessive whitespace

## Solution

### 1. Fix Title Capitalization
Remove the `capitalize` class from the DialogTitle - the `format()` function from date-fns already produces the correct lowercase format.

### 2. Fix Status Matching
Update `getStageConfig()` to strip emoji prefixes and handle variations:
```text
"✅ Publicado" → normalize to → "publicado"
"📝 Escrita" → normalize to → "escrita"
```

### 3. Improve Card Layout
Make the card layout more compact and always show useful information:
- Horizontal layout with client name + stage badge on same row
- Show format inline if available
- Reduce padding for denser display

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/DayContentDialog.tsx` | Remove `capitalize` class, improve card layout |
| `src/lib/contentStages.ts` | Update `getStageConfig()` to strip emojis and special characters |

## Technical Details

### contentStages.ts - getStageConfig Function

```text
Current:
  const normalizedStatus = status.toLowerCase().trim();
  return CONTENT_STAGES.find(stage => stage.key === normalizedStatus);

Updated:
  // Strip emojis and special characters, then normalize
  const cleanedStatus = status
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replace(/[^\w\sáàâãéèêíïóôõöúçñ]/gi, '') // Keep only letters/numbers
    .toLowerCase()
    .trim();
  return CONTENT_STAGES.find(stage => stage.key === cleanedStatus);
```

### DayContentDialog.tsx - Layout Changes

```text
Before:
  <DialogTitle className="capitalize">{formattedDate}</DialogTitle>
  ...
  <div className="flex flex-col gap-2 p-3 ...">
    <div className="font-medium">{client}</div>
    <div className="flex items-center gap-2">
      {stageBadge}
      {format}
      {link}
    </div>
  </div>

After:
  <DialogTitle className="font-serif">{formattedDate}</DialogTitle>
  ...
  <div className="flex items-center justify-between gap-3 p-3 ...">
    <div className="flex items-center gap-2 min-w-0">
      <span className="font-medium truncate">{client}</span>
      {stageBadge}
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {format}
      {link}
    </div>
  </div>
```

## Visual Before/After

```text
BEFORE (current):
+------------------------------------+
| Rony Meisler                       |
|                                    |
|                            [link]  |
+------------------------------------+

AFTER (fixed):
+------------------------------------+
| Rony Meisler  [Publicado]   [link] |
+------------------------------------+
```

## Expected Result

1. Date title displays as "8 de janeiro de 2026" (proper Portuguese)
2. Stage badges appear with correct colors (Publicado = green, Backlog = gray, etc.)
3. Compact single-row layout with client + stage + format + link
4. Reduced card height for better information density

