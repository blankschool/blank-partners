

# Update Google Sheets URL Secret

## Overview
Update the `GOOGLE_SHEETS_URL` Supabase secret with the correct CSV export URL provided by the user.

## Changes Required

| Component | Action |
|-----------|--------|
| `GOOGLE_SHEETS_URL` secret | Update to CSV format URL |

## New Secret Value
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQkr0h2ejrWd_kK71GjUJmEJvK9EeFGEnQp6SNqbffKS2xqazypcbmEioQ7YKQYG5SD_YQpbbi-2B4o/pub?gid=0&single=true&output=csv
```

## No Code Changes Needed
The edge function and frontend components are already correctly implemented. Only the secret value needs to be updated.

## Expected Result
After updating the secret, the Contents page will:
1. Successfully fetch CSV data from Google Sheets
2. Display the stage stats panel with content counts
3. Show content items in grid, list, or calendar view
4. Enable filtering by platform, client, stage, and date period

