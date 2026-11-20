import { SITE, links, icon, kicker, textLink, codeBox } from '../layout.mjs';
import { screen, appFrame, projectWindow, mixerWindow, keyEditor } from '../art.mjs';

export const meta = {
  path: '',
  active: '',
  title: 'StudioCraft – Audio Workstation in Rust',
  description: 'StudioCraft is a free, cross-platform audio workstation written in Rust: record, arrange and mix music on Linux, Windows and macOS.',
};

const ic = (body) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const FEATURES = [
  [ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11"/>'), 'Project window', 'Inspector, track list, event display and a lower zone with mixer, key editor and sample editor. Tools sit on keys 1–0.'],
  [ic('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3" fill="currentColor"/>'), 'Recording', 'Audio and MIDI with cycle takes, punch in/out, count-in, take lanes and comping.'],
  [ic('<path d="M6 4v16M12 4v16M18 4v16"/><rect x="4" y="12" width="4" height="3" rx="1"/><rect x="10" y="7" width="4" height="3" rx="1"/><rect x="16" y="14" width="4" height="3" rx="1"/>'), 'Mixer', 'Channel strips with input stage, pre-filters, EQ, pre- and post-fader inserts, sends, solo modes and peak hold.'],
  [ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v8M11 5v8M15 5v8M19 5v8"/>'), 'Editors', 'Key editor, quantize, sample editor, plus fade and crossfade editors.'],
  [ic('<path d="M3 17c3 0 4-10 7-10s3 6 5 6 2-4 6-4"/>'), 'Automation', 'Read and write, tempo track and time signatures, plugin delay compensation.'],
  [ic('<path d="M9 3v4M15 3v4"/><rect x="5" y="7" width="14" height="8" rx="2"/><path d="M12 15v6"/>'), 'Plugins: CLAP &amp; LV2', 'Instruments and effects, with their state saved in the project. Scanning runs in separate processes and blocks crashing plugins.'],
  [ic('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>'), 'Export', 'Render in place, freeze tracks, stem export and audio mixdown to WAV, FLAC or AIFF.'],
  [ic('<path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6"/>'), 'Open project format', 'Project folders in an open JSON format, with autosave and crash recovery.'],
  [ic('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>'), 'Dark &amp; light', 'Dark and light appearance in wine red, switchable under View → Appearance.'],
];

export function body(base) {
  const L = links(base);
  return `
<section class="hero">
  <div class="wrap">
    <img class="hero-icon" src="${base}assets/brand/icon.svg" width="104" height="104" alt="StudioCraft icon">
    <div class="badge-row">
      <span class="badge"><span class="dot"></span>Version ${SITE.version}</span>
      <span class="badge">Open source · MIT / Apache 2.0</span>
      <span class="badge">Written in Rust</span>
    </div>
    <h1>Record, <em>arrange and mix music.</em></h1>
    <p class="lead">StudioCraft is a cross-platform audio workstation written in Rust. A familiar DAW workflow – free and open source.</p>
    <div class="hero-actions">
      <a class="btn btn-wine btn-lg" href="${L.download}">${icon.download()}<span>Download for free</span></a>
      <a class="btn btn-ghost btn-lg" href="${SITE.repo}" rel="noopener">${icon.github()}<span>View on GitHub</span></a>
    </div>
    <p class="hero-note">Linux · Windows · macOS — interface currently in German</p>
    <div class="hero-shot">${appFrame(screen(base, 'project-window', () => projectWindow({ seed: 7 }), 'The StudioCraft project window'))}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head center">
      ${kicker('Features')}
      <h2 class="h2">Everything a song needs.</h2>
      <p class="lead">From the first track to the finished mixdown – in one project window that feels like a studio.</p>
    </div>
    <div class="feature-grid">
      ${FEATURES.map(([i, h, p]) => `<article class="card"><div class="card-icon">${i}</div><h3>${h}</h3><p>${p}</p></article>`).join('')}
    </div>
    <div class="center" style="margin-top:40px">${textLink(L.features, 'All features in detail')}</div>
  </div>
</section>

<section class="section tint">
  <div class="wrap split">
    <div>
      ${kicker('Mixer')}
      <h2 class="h2">Mix like on a console.</h2>
      <p class="lead">Every track gets a full channel strip. Saved mixer views and input and output busses keep even large projects clear.</p>
      <ul class="checks">
        <li>${icon.check()}<span>Input stage, pre-filter and EQ on every channel</span></li>
        <li>${icon.check()}<span>Pre- and post-fader inserts, sends</span></li>
        <li>${icon.check()}<span>Solo modes, peak hold and level meters</span></li>
        <li>${icon.check()}<span>Mixer in the lower zone or as its own window (F3)</span></li>
      </ul>
      ${textLink(`${L.features}#mixer`, 'More about the mixer')}
    </div>
    <div>${appFrame(screen(base, 'mixer', () => mixerWindow({ seed: 3 }), 'The StudioCraft mixer'))}</div>
  </div>
</section>

<section class="section">
  <div class="wrap split rev">
    <div>
      ${kicker('Editors')}
      <h2 class="h2">Notes, takes and fades under control.</h2>
      <p class="lead">In the key editor you edit MIDI note by note and quantize to the grid. Takes from cycle recordings land in their own lanes and become the best version through comping.</p>
      ${textLink(`${L.features}#editors`, 'See the editors')}
    </div>
    <div>${appFrame(screen(base, 'key-editor', () => keyEditor({ seed: 11 }), 'The StudioCraft key editor'))}</div>
  </div>
  <div class="wrap">
    <div class="counter-strip">
      <div class="counter"><b>8</b><span>Track types: audio, instrument, MIDI, group, FX, folder, marker, tempo</span></div>
      <div class="counter"><b>2</b><span>Plugin formats: CLAP and LV2</span></div>
      <div class="counter"><b>3</b><span>Export formats: WAV, FLAC, AIFF</span></div>
      <div class="counter"><b>${SITE.version}</b><span>current version</span></div>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap split">
    <div>
      ${kicker('AI agents')}
      <h2 class="h2">An AI agent as your studio assistant.</h2>
      <p class="lead">Through the built-in MCP server, agents such as Claude Code, Codex or Cursor create projects, import audio, place notes and render the mixdown – headless or in the running app.</p>
      ${textLink(L.mcp, 'How the MCP server works')}
    </div>
    <div>
      ${codeBox('Terminal', 'studiocraft-cli mcp \\\n  --automation-read-root ~/Music/Samples \\\n  --automation-write-root ~/Music/Projects')}
      ${codeBox('Control the running app', 'studiocraft --control 7850\nstudiocraft-cli mcp --connect 7850')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head center">
      ${kicker('Platforms')}
      <h2 class="h2">Runs wherever you make music.</h2>
      <p class="lead">Linux is the daily working platform. Windows and macOS packages are built in CI, more systems are on the way.</p>
    </div>
    <div class="platforms">
      <div class="platform"><h3>Linux</h3><p>AppImage, deb, rpm, tar.gz · PipeWire, ALSA</p><span class="state">used daily</span></div>
      <div class="platform"><h3>Windows</h3><p>MSI and portable zip · WASAPI</p><span class="state">packages from CI</span></div>
      <div class="platform"><h3>macOS</h3><p>Universal DMG · CoreAudio</p><span class="state">packages from CI</span></div>
      <div class="platform"><h3>FreeBSD</h3><p>tar.gz and pkg</p><span class="state wip">in progress</span></div>
      <div class="platform"><h3>Web</h3><p>WASM build · Web Audio</p><span class="state wip">in progress</span></div>
    </div>
    <div class="center" style="margin-top:40px">${textLink(L.engine, 'Audio engine and platforms')}</div>
  </div>
</section>

<div class="wrap"><div class="wave-divider" aria-hidden="true"></div></div>

<section class="section" style="padding-top:64px">
  <div class="wrap split">
    <div>
      ${kicker('Open source')}
      <h2 class="h2">Built clean-room.</h2>
      <p class="lead">StudioCraft is an independent, private project. Its workflow is described in its own specification; code, graphics and text do not come from other products.</p>
      <ul class="checks">
        <li>${icon.check()}<span>Pure Rust with egui – no Electron, no Tauri</span></li>
        <li>${icon.check()}<span>Licence: MIT or Apache 2.0, at your choice</span></li>
        <li>${icon.check()}<span>Changes reach <code>main</code> only through pull requests</span></li>
      </ul>
    </div>
    <div class="card">
      <h3>Get involved</h3>
      <p>Report bugs, share ideas or contribute code yourself: everything happens in the open on GitHub. If you work with AI agents, you will find dedicated notes in <code>AGENTS.md</code>.</p>
      <div class="hero-actions" style="justify-content:flex-start;margin-top:22px">
        <a class="btn btn-ghost" href="${SITE.issues}" rel="noopener"><span>Issues</span>${icon.external()}</a>
        <a class="btn btn-ghost" href="${SITE.contributing}" rel="noopener"><span>Contribute</span>${icon.external()}</a>
      </div>
    </div>
  </div>
</section>`;
}
