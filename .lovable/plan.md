

# Update Google Sheets URL Secret

## Issue
The current `GOOGLE_SHEETS_URL` secret contains an HTML format URL (`pubhtml`) instead of CSV format. This causes the edge function to fail when trying to parse the spreadsheet data.

## Solution
Update the `GOOGLE_SHEETS_URL` Supabase secret with the correct CSV export URL.

## Correct URL
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQkr0h2ejrWd_kK71GjUJmEJvK9EeFGEnQp6SNqbffKS2xqazypcbmEioQ7YKQYG5SD_YQpbbi-2B4o/pub?gid=0&single=true&output=csv
```

## Changes Required

| Component | Action |
|-----------|--------|
| `GOOGLE_SHEETS_URL` secret | Update value to CSV format URL |

## Technical Details
- The edge function `fetch-sheets-content` fetches the URL and parses CSV data
- HTML format cannot be parsed as CSV, causing parse errors
- Adding `output=csv` to the URL returns proper CSV data that the edge function can process

## No Code Changes Needed
The edge function and frontend components are already correctly implemented. Only the secret value needs to be updated.

## Expected Result
After updating the secret, the Contents page will:
1. Successfully fetch CSV data from Google Sheets
2. Display the stage stats panel with content counts
3. Show content items in grid, list, or calendar view
4. Enable filtering by platform, client, stage, and date period

