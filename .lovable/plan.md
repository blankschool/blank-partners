

# Fix Stage Filtering and Display for All Stages

## Problem Identified

Three issues are preventing stages like "Gravação de áudio", "Gravação de vídeo", "Edição de vídeo" from appearing correctly:

### Issue 1: Accent Mismatch
- Stage keys in `CONTENT_STAGES` use **unaccented** versions: `"edicao de video"`, `"gravacao de audio"`
- API data returns **accented** versions: `"Edição de vídeo"`, `"Gravação de áudio"`
- The comparison `item.status.toLowerCase().trim() === stage.key` fails because accents are preserved

### Issue 2: Inconsistent Normalization
The `getStageConfig` function was updated to strip emojis, but it still preserves accented characters. Meanwhile, the stage keys are unaccented. This causes a mismatch.

### Issue 3: Filtering Logic Doesn't Use getStageConfig
Two locations use direct string comparison instead of the centralized normalization:
- `StageStatsPanel.tsx` line 16
- `Contents.tsx` line 96

## Solution

### 1. Create a Reusable Status Normalization Function
Add a `normalizeStatus()` function in `contentStages.ts` that:
- Strips emojis
- Removes accents (normalize to ASCII)
- Converts to lowercase
- Trims whitespace

### 2. Update getStageConfig to Use It
The existing function will use the new normalizer.

### 3. Update StageStatsPanel to Use Normalization
Replace direct comparison with normalized comparison.

### 4. Update Contents.tsx Stage Filter
Replace direct comparison with normalized comparison.

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/contentStages.ts` | Add `normalizeStatus()` helper function |
| `src/components/contents/StageStatsPanel.tsx` | Import and use `normalizeStatus()` for counting |
| `src/pages/Contents.tsx` | Import and use `normalizeStatus()` for filtering |

## Technical Details

### contentStages.ts - New Helper Function

```text
export function normalizeStatus(status: string): string {
  return status
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')     // Remove emojis
    .replace(/[^\w\sáàâãéèêíïóôõöúçñ]/gi, '')   // Remove special chars
    .normalize('NFD')                            // Decompose accents
    .replace(/[\u0300-\u036f]/g, '')            // Remove accent marks
    .toLowerCase()
    .trim();
}
```

The key addition is `.normalize('NFD').replace(/[\u0300-\u036f]/g, '')` which:
- `normalize('NFD')` decomposes characters like "é" into "e" + combining accent
- `replace(/[\u0300-\u036f]/g, '')` removes the combining accent marks

Example transformations:
- `"✅ Publicado"` → `"publicado"`
- `"Edição de vídeo"` → `"edicao de video"`
- `"Gravação de áudio"` → `"gravacao de audio"`

### StageStatsPanel.tsx Updates

```text
// Import
import { CONTENT_STAGES, normalizeStatus } from "@/lib/contentStages";

// Line 15-16 change:
// BEFORE:
acc[stage.key] = items.filter(
  item => item.status.toLowerCase().trim() === stage.key
).length;

// AFTER:
acc[stage.key] = items.filter(
  item => normalizeStatus(item.status) === stage.key
).length;
```

### Contents.tsx Updates

```text
// Import
import { normalizeStatus } from "@/lib/contentStages";

// Line 96 change:
// BEFORE:
if (item.status.toLowerCase().trim() !== activeStage) return false;

// AFTER:
if (normalizeStatus(item.status) !== activeStage) return false;
```

## Data Verification

From the API data, these statuses will now match correctly:

| API Status | Normalized | Stage Key | Match? |
|------------|------------|-----------|--------|
| "Edição de vídeo" | "edicao de video" | "edicao de video" | Yes |
| "Gravação de áudio" | "gravacao de audio" | "gravacao de audio" | Yes |
| "Gravação de vídeo" | "gravacao de video" | "gravacao de video" | Yes |
| "✅ Publicado" | "publicado" | "publicado" | Yes |
| "❌ Cancelado" | "cancelado" | "cancelado" | Yes |
| "Criação Design" | "criacao design" | "criacao design" | Yes |
| "Ajustes Escrita" | "ajustes escrita" | "ajustes escrita" | Yes |

## Expected Result

1. All stages will appear correctly in the StageStatsPanel with accurate counts
2. Clicking on stage buttons will filter contents correctly
3. The stage dropdown filter will work for all stages
4. Stage badges will display correctly in calendars and dialogs
5. Previously "invisible" stages (Gravação de áudio, Edição de vídeo, etc.) will now be visible

