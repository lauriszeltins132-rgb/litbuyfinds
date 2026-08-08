# Spreadsheet data

Source spreadsheet: https://docs.google.com/spreadsheets/d/1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA/edit

## Manual import

```bash
npm run spreadsheet:sync        # import + manifests + log (recommended)
npm run merge:spreadsheet       # import only
npm run spreadsheet:sync -- --dry-run   # preview pending imports
```

## Automated import

Production sync runs via **GitHub Actions** (`.github/workflows/spreadsheet-sync.yml`) on the 1st of each month, commits to `main`, and triggers a Vercel deploy.

See [docs/SPREADSHEET-SYNC.md](../docs/SPREADSHEET-SYNC.md) for architecture and setup.

Import history: `data/spreadsheet-import-log.json`

## Full rebuild from Excel

1. Place `products.xlsx` in this folder (export from Google Sheets).
2. Run `npm run convert-data`

Supported formats: `.xlsx`, `.xls`
