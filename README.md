# StudioCraft – Website

Static website for StudioCraft (home, features, audio engine, AI & MCP, download), in the app's own
design: colours from `crates/ui/src/theme.rs`, app icon from `assets/app-icon/`, Ubuntu font, texts
based on the README, `docs/spec.md`, `docs/mcp.md` and `docs/plattformen.md`.

- `npm install` and `npm run build` produce the finished site in `dist/`.
- Texts live in `src/pages/*.mjs`, colours and spacing in `src/styles.css`.
- **Real screenshots:** put PNG files (16:9) with these names into `src/screens/`:
  `project-window.png`, `mixer.png`, `key-editor.png`. On the next build they automatically replace
  the drawn views.
- Repository address and version: `SITE` in `src/layout.mjs`.
- Publishing: under *Settings → Pages → Source* choose "GitHub Actions"; the workflow in
  `.github/workflows/pages.yml` builds and publishes the site on every push to `main`.
