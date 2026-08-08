# Spreadsheet data

Source spreadsheet: https://docs.google.com/spreadsheets/d/1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA/edit

1. Keep `products.xlsx` in this folder when refreshing from Google Sheets (full rebuild).
2. **Incremental import (all tabs):** `npm run merge:spreadsheet`
3. **Latest Finds only:** `npm run merge:latest-finds`

`merge:spreadsheet` fetches each category tab live, validates rows (URL, image, name), skips duplicates by affiliate link, and appends only new products to `src/data/products.json`.

Supported formats for full rebuild: `.xlsx`, `.xls`
