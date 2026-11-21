# StudioCraft – Website

Static website for StudioCraft (home, features, audio engine, AI & MCP, download), in the app's own
design: colours from `crates/ui/src/theme.rs`, app icon from `assets/app-icon/`, Ubuntu font, texts
based on the README, `docs/spec.md`, `docs/mcp.md` and `docs/plattformen.md`.

- `cargo run` builds the finished site into `dist/` (a small generator in `src/main.rs`, Rust
  standard library only). `cargo test` checks that every placeholder resolves and internal links
  exist. The site ships no JavaScript.
- Texts live in `site/pages/*.html`, the frame of every page in `site/layout.html` and
  `site/cta.html`, colours and spacing in `site/styles.css`, icons in `site/icons.txt`.
  Placeholders such as `{{base}}`, `{{site.repo}}`, `{{icon:check}}` and
  `{{screen:mixer|Description}}` are listed at the top of `src/main.rs`.
- **Screenshots** of the real app live in `site/screens/` (`project-window.png`, `mixer.png`,
  `key-editor.png`, the last one showing the piano roll). Replace a file to update the picture; the
  build reads its size.
- Repository address, version and donation link: `site/site.txt`.
- Fonts: Ubuntu and Ubuntu Mono in `site/fonts/` (Ubuntu Font Licence 1.0, text alongside).
- Publishing: under *Settings → Pages → Source* choose "GitHub Actions"; the workflow in
  `.github/workflows/pages.yml` builds and publishes the site on every push to `main`.
