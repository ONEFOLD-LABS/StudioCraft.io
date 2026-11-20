import { SITE, links, icon, kicker, textLink, codeBox } from '../layout.mjs';

export const meta = {
  path: 'download/',
  active: 'download',
  title: 'Download StudioCraft',
  description: 'Download StudioCraft for Linux, Windows, macOS, FreeBSD and the web – every package of the current version.',
  cta: false,
};

const PKGS = [
  ['linux', 'Linux', 'x86_64', 'Desktop packages', 'AppImage, deb, rpm, Flatpak, Arch (pkg.tar.zst) and tar.gz', ''],
  ['linux', 'Linux', 'aarch64', 'Desktop packages', 'AppImage, deb, rpm, Flatpak, Arch and tar.gz for ARM machines', ''],
  ['linux', 'Linux', 'riscv64', 'Desktop packages', 'deb, rpm and tar.gz', ''],
  ['windows', 'Windows', 'x64', 'Installer &amp; portable', 'MSI installer for all users and portable zip', ''],
  ['windows', 'Windows', 'arm64', 'Installer &amp; portable', 'MSI installer and portable zip for Windows on ARM', ''],
  ['macos', 'macOS', 'Universal', 'Disk image', 'DMG for Intel and Apple Silicon (macOS 11 or later), command line as zip', ''],
  ['freebsd', 'FreeBSD', 'x86_64 · aarch64', 'Packages', 'tar.gz and pkg', 'wip'],
  ['web', 'Web', 'wasm32', 'Browser build', 'zip with the WASM build', 'wip'],
];

export function body(base) {
  const L = links(base);
  return `
<section class="page-hero">
  <div class="wrap">
    ${kicker('Download')}
    <h1>Download StudioCraft.</h1>
    <p class="lead">Every package of the current version is on GitHub. Each release includes a <code>SHA256SUMS.txt</code> to verify the files.</p>
    <div class="dl-main">
      <a class="btn btn-wine btn-lg" href="${SITE.latest}" rel="noopener">${icon.download()}<span>Latest version ${SITE.version}</span></a>
      <a class="btn btn-ghost btn-lg" href="${SITE.releases}" rel="noopener"><span>All releases</span>${icon.external()}</a>
    </div>
    <p class="dl-meta">Early development: Linux is used daily; Windows and macOS packages are built in CI and have not yet been tested by hand.</p>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="section-head">
      ${kicker('Packages')}
      <h2 class="h2">Choose your system.</h2>
    </div>
    <div class="filters" role="group" aria-label="Filter by platform">
      <button class="filter-btn" type="button" data-filter="all" aria-pressed="true">All</button>
      <button class="filter-btn" type="button" data-filter="linux" aria-pressed="false">Linux</button>
      <button class="filter-btn" type="button" data-filter="windows" aria-pressed="false">Windows</button>
      <button class="filter-btn" type="button" data-filter="macos" aria-pressed="false">macOS</button>
      <button class="filter-btn" type="button" data-filter="freebsd" aria-pressed="false">FreeBSD</button>
      <button class="filter-btn" type="button" data-filter="web" aria-pressed="false">Web</button>
    </div>
    <div class="pkg-grid">
      ${PKGS.map(([k, os, arch, title, desc, state]) => `
      <article class="pkg" data-platform="${k}">
        <div class="pkg-head"><span class="os">${os}</span><span class="arch">${arch}</span></div>
        <h3>${title}</h3>
        <p>${desc}</p>
        ${state === 'wip'
          ? `<a class="btn btn-ghost" href="${SITE.platformDoc}" rel="noopener"><span>In progress – see status</span>${icon.external()}</a>`
          : `<a class="btn btn-wine" href="${SITE.latest}" rel="noopener">${icon.download()}<span>Go to release</span></a>`}
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      ${kicker('Installation')}
      <h2 class="h2">Good to know.</h2>
      <ul class="checks">
        <li>${icon.check()}<span>deb and rpm register <code>.studiocraft</code> projects and recommend <code>lilv</code> for LV2 plugins.</span></li>
        <li>${icon.check()}<span>The Windows MSI adds a Start menu entry and opens WAV, FLAC, AIFF and MP3 via “Open with”.</span></li>
        <li>${icon.check()}<span>On macOS, drag the app from the DMG into “Applications”.</span></li>
        <li>${icon.check()}<span>The Flatpak finds plugins from the Flathub Linux audio extensions.</span></li>
      </ul>
    </div>
    <div>
      <div class="notice"><div><strong>Code signing</strong><p style="margin-top:8px">Windows and macOS packages will be signed (macOS also notarized) once the certificates are in place. Until then they are unsigned or ad-hoc signed – verify the files with <code>SHA256SUMS.txt</code>.</p></div></div>
      ${codeBox('Checksum on Linux and macOS', 'sha256sum -c SHA256SUMS.txt --ignore-missing')}
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap split">
    <div>
      ${kicker('From source')}
      <h2 class="h2">Build it yourself.</h2>
      <p class="lead">With Rust 1.85 or newer. On Linux you also need the ALSA and PipeWire development files and <code>clang</code>.</p>
      ${textLink(L.engine + '#build', 'More about the audio engine')}
    </div>
    <div>
      ${codeBox('Terminal', `git clone ${SITE.repo}.git\ncd StudioCraft\ncargo build --release\ncargo run --release -p studiocraft`)}
    </div>
  </div>
</section>`;
}
