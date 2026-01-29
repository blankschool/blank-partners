
# Group Content Stages into Macro Categories

## Overview

The StageStatsPanel currently displays 15+ individual stages, making the layout cluttered. This plan groups them into 6 macro categories for the stats panel while preserving the detailed stages for filtering and badges.

## New Stage Groups

| Group | Label | Included Stages | Color Theme |
|-------|-------|-----------------|-------------|
| 1 | Escrevendo | backlog, rascunho, escrita, aprovacao escrita, em briefing, ajustes escrita | Orange |
| 2 | Criação | gravacao de video, gravacao de audio, edicao de video, criacao design, ajustes edicao de video, ajustes criacao design | Purple |
| 3 | Aprovação | aprovacao post | Blue |
| 4 | Pronto para postar | pronto para postar | Yellow |
| 5 | Publicado | publicado | Green |
| 6 | Cancelado | cancelado | Red |

## Implementation

### File 1: `src/lib/contentStages.ts`

Add a new interface and array for stage groups:

```text
export interface StageGroup {
  key: string;
  label: string;
  stages: string[];  // Keys of CONTENT_STAGES that belong to this group
  color: string;
  bgColor: string;
  borderColor: string;
}

export const STAGE_GROUPS: StageGroup[] = [
  {
    key: 'escrevendo',
    label: 'Escrevendo',
    stages: ['backlog', 'rascunho', 'escrita', 'aprovacao escrita', 'em briefing', 'ajustes escrita'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  },
  {
    key: 'criacao',
    label: 'Criação',
    stages: ['gravacao de video', 'gravacao de audio', 'edicao de video', 'criacao design', 'ajustes edicao de video', 'ajustes criacao design'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    key: 'aprovacao',
    label: 'Aprovação',
    stages: ['aprovacao post'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    key: 'pronto',
    label: 'Pronto para postar',
    stages: ['pronto para postar'],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  {
    key: 'publicado',
    label: 'Publicado',
    stages: ['publicado'],
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  {
    key: 'cancelado',
    label: 'Cancelado',
    stages: ['cancelado'],
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  }
];
```

Add a helper function to find which group a status belongs to:

```text
export function getStageGroup(status: string): StageGroup | undefined {
  const normalizedStatus = normalizeStatus(status);
  return STAGE_GROUPS.find(group => group.stages.includes(normalizedStatus));
}
```

### File 2: `src/components/contents/StageStatsPanel.tsx`

Update to use STAGE_GROUPS instead of individual stages:

- Import `STAGE_GROUPS` instead of `CONTENT_STAGES`
- Count items per group by checking if normalized status is in the group's stages array
- Update the selected state to track group keys instead of stage keys
- Display 6 group buttons instead of 15+ stage buttons

### File 3: `src/pages/Contents.tsx`

Update filtering logic to work with groups:

- When a group is selected from the panel, filter items where the normalized status is in the group's stages array
- The dropdown filter still uses individual stages for granular filtering
- Add a new state or modify existing to handle group-based filtering

## Visual Comparison

```text
BEFORE (15+ buttons, horizontal scroll needed):
+-------+-------+-------+-------+-------+-------+-------+-------+...
| Todos |Backlog|Rascunho|Escrita|Aprov. |Gravação|Edição |Design|
|  142  |   5   |   3    |   8   | escr. | vídeo  | vídeo |      |
+-------+-------+-------+-------+-------+-------+-------+-------+...

AFTER (7 buttons, fits on screen):
+-------+----------+--------+----------+--------+----------+----------+
| Todos |Escrevendo| Criação| Aprovação| Pronto | Publicado| Cancelado|
|  142  |    32    |   18   |    4     |   12   |    68    |    8     |
+-------+----------+--------+----------+--------+----------+----------+
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/contentStages.ts` | Add `StageGroup` interface, `STAGE_GROUPS` array, and `getStageGroup()` helper |
| `src/components/contents/StageStatsPanel.tsx` | Update to display and count by groups instead of individual stages |
| `src/pages/Contents.tsx` | Update filtering logic to handle group selections |

## What Stays the Same

- **ContentFilters dropdown**: Still shows all 15 individual stages for detailed filtering
- **ContentCard badges**: Still show the specific stage label (e.g., "Edição de vídeo")
- **DayContentDialog**: Still shows specific stage badges
- **CONTENT_STAGES array**: Unchanged, still used for individual stage styling

## Expected Result

1. StageStatsPanel shows 7 buttons (Todos + 6 groups) instead of 15+
2. Clicking a group filters to show all items in that group's stages
3. Group counts aggregate all underlying stages correctly
4. Dropdown filter still allows selection of specific stages
5. No horizontal scroll needed on most screens
