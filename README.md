# Wordcraft

A 100-day English vocabulary course with 1,000 unique everyday words and phrases, 300 short lessons, progress tracking, search, and dark mode.

## Run locally

```powershell
node serve-local.mjs
```

Then open `http://127.0.0.1:4173/`.

The local server includes the same clean-route fallback used by GitHub Pages, so URLs such as `/day-1/` also work when refreshed directly.

## Structure

- `dist/index.html` — application shell
- `dist/styles.css` — responsive visual design
- `dist/data.js` — Days 1–20
- `dist/extra-data.js` — Days 21–100 and daily-life simplifications
- `dist/app.js` — navigation, search, progress, and theme behavior
- `404.html` — GitHub Pages fallback for clean URLs
- `serve-local.mjs` — local server with clean-route fallback
