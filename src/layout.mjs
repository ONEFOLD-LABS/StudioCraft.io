// Shared building blocks for the StudioCraft website.
// All links are relative so the site works on GitHub Pages (also under /<repo>/).

export const SITE = {
  name: 'StudioCraft',
  version: '0.7.0',
  repo: 'https://github.com/ONEFOLD-LABS/StudioCraft',
};
SITE.releases = `${SITE.repo}/releases`;
SITE.latest = `${SITE.repo}/releases/latest`;
SITE.issues = `${SITE.repo}/issues`;
SITE.contributing = `${SITE.repo}/blob/main/CONTRIBUTING.md`;
SITE.spec = `${SITE.repo}/blob/main/docs/spec.md`;
SITE.mcpDoc = `${SITE.repo}/blob/main/docs/mcp.md`;
SITE.platformDoc = `${SITE.repo}/blob/main/docs/plattformen.md`;
SITE.agents = `${SITE.repo}/blob/main/AGENTS.md`;
SITE.notice = `${SITE.repo}/blob/main/NOTICE`;

/* ---------- icons (stroke icons, 24 grid) ---------- */
const svg = (size, body, cls = '') =>
  `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icon = {
  download: (s = 18) => svg(s, '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>'),
  github: (s = 18) => `<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>`,
  arrow: (s = 18) => svg(s, '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>', 'i-arrow'),
  external: (s = 16) => svg(s, '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>', 'i-ext'),
  menu: (s = 22) => svg(s, '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>', 'i-open'),
  close: (s = 22) => svg(s, '<path d="m6 6 12 12"/><path d="M18 6 6 18"/>', 'i-close'),
  check: (s = 16) => svg(s, '<path d="m5 12 5 5L20 7"/>'),
};

/* ---------- StudioCraft app icon from the StudioCraft repository ---------- */
export const logo = (base, size = 34) =>
  `<img class="logo-mark" src="${base}assets/brand/icon-small.svg" width="${size}" height="${size}" alt="">`;

/* ---------- links ---------- */
export function links(base) {
  return {
    home: `${base}`,
    features: `${base}features/`,
    mcp: `${base}mcp/`,
    engine: `${base}engine/`,
    download: `${base}download/`,
  };
}

const ext = (href) => (/^https?:|^mailto:/.test(href) ? ' rel="noopener"' : '');

export function header(base, active) {
  const L = links(base);
  const nav = [
    ['features', 'Features', L.features],
    ['engine', 'Audio engine', L.engine],
    ['mcp', 'AI &amp; MCP', L.mcp],
    ['download', 'Download', L.download],
  ];
  const navLinks = nav
    .map(([k, t, h]) => `<a href="${h}"${k === active ? ' class="is-active" aria-current="page"' : ''}>${t}</a>`)
    .join('');
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${L.home}">${logo(base, 32)}<span>Studio<b>Craft</b></span></a>
    <nav class="main-nav" aria-label="Main navigation">${navLinks}</nav>
    <div class="header-actions">
      <a class="btn btn-ghost btn-sm" href="${SITE.repo}" rel="noopener">${icon.github()}<span>GitHub</span></a>
      <a class="btn btn-wine btn-sm" href="${L.download}">${icon.download()}<span>Download</span></a>
    </div>
    <details class="mobile-nav">
      <summary class="menu-toggle" aria-label="Menu"><span>Menu</span>${icon.menu()}${icon.close()}</summary>
      <nav class="mobile-menu" aria-label="Menu">
        <div class="mobile-links">${navLinks}<a href="${SITE.repo}" rel="noopener">GitHub</a></div>
        <a class="btn btn-wine" href="${L.download}">${icon.download()}<span>Download StudioCraft</span></a>
      </nav>
    </details>
  </div>
</header>`;
}

export function cta(base) {
  const L = links(base);
  return `
<section class="cta">
  <div class="wrap cta-box">
    <img src="${base}assets/brand/icon.svg" width="88" height="88" alt="" class="cta-icon">
    <div class="cta-text">
      <h2>Ready for your first recording?</h2>
      <p>StudioCraft is free, open source and runs on Linux, Windows and macOS.</p>
    </div>
    <div class="cta-actions">
      <a class="btn btn-wine btn-lg" href="${L.download}">${icon.download()}<span>Download</span></a>
      <a class="btn btn-ghost btn-lg" href="${SITE.repo}" rel="noopener">${icon.github()}<span>Source code</span></a>
    </div>
  </div>
</section>`;
}

export function footer(base) {
  const L = links(base);
  const col = (title, items) => `
    <div class="footer-col">
      <h2>${title}</h2>
      <ul>${items.map(([t, h]) => `<li><a href="${h}"${ext(h)}>${t}</a></li>`).join('')}</ul>
    </div>`;
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${L.home}">${logo(base, 30)}<span>Studio<b>Craft</b></span></a>
        <p>Audio workstation in Rust. Record, arrange and mix music.</p>
        <p class="footer-licence">MIT or Apache 2.0 · Version ${SITE.version}</p>
      </div>
      ${col('Program', [['Features', L.features], ['Audio engine', L.engine], ['AI &amp; MCP', L.mcp], ['Download', L.download]])}
      ${col('Documentation', [['Workflow spec', SITE.spec], ['MCP server', SITE.mcpDoc], ['Platforms', SITE.platformDoc], ['Releases', SITE.releases]])}
      ${col('Get involved', [['GitHub', SITE.repo], ['Issues', SITE.issues], ['Contributing', SITE.contributing], ['Notes for AI agents', SITE.agents]])}
    </div>
    <div class="footer-bottom">
      <p>StudioCraft is an independent, private open-source project, developed clean-room.</p>
      <a href="${SITE.notice}" rel="noopener">Licence notices</a>
    </div>
  </div>
</footer>`;
}

export function page({ base, active, title, description, body, cta: withCta = true }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#1e1e1e">
<link rel="icon" href="${base}assets/brand/icon-small.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}assets/brand/icon-256.png">
<link rel="stylesheet" href="${base}assets/styles.css">
</head>
<body>
${header(base, active)}
<main id="main">
${body}
${withCta ? cta(base) : ''}
</main>
${footer(base)}
<script src="${base}assets/site.js" defer></script>
</body>
</html>
`;
}

/* ---------- small helpers ---------- */
export const kicker = (t) => `<p class="kicker">${t}</p>`;
export const textLink = (href, t, kind = 'arrow') =>
  `<a class="text-link" href="${href}"${ext(href)}><span>${t}</span>${kind === 'ext' ? icon.external() : icon.arrow()}</a>`;
export const codeBox = (title, cmd) => `
<div class="code-box">
  <div class="code-head"><span>${title}</span><button class="copy-btn" type="button" data-copy="${cmd.replace(/"/g, '&quot;').replace(/\n/g, '&#10;')}">Copy</button></div>
  <pre><code>${cmd}</code></pre>
</div>`;
