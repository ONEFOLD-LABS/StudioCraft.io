import { SITE, icon, kicker, textLink, codeBox } from '../layout.mjs';

export const meta = {
  path: 'mcp/',
  active: 'mcp',
  title: 'AI Agents & MCP – StudioCraft',
  description: 'StudioCraft ships an MCP server for AI agents: create projects, import audio, place notes and render mixdowns – headless or in the running app.',
};

const TOOLS = [
  ['inspect_project', 'Whole project: tempo, time signature, locators, markers, tracks with events'],
  ['get_notes', 'Notes of a MIDI part'],
  ['new_project · open_project · save_project', 'Create, open and save project files'],
  ['import_audio · import_midi', 'Audio file onto a track, standard MIDI file as MIDI tracks'],
  ['export_mixdown · export_midi', 'Locator range as 24-bit WAV, FLAC or AIFF; MIDI file'],
  ['add_track · set_track', 'Add a track; name, fader, pan, mute, solo'],
  ['create_part · add_notes', 'Create a MIDI part, add or replace notes'],
  ['move_event · split_event · delete_events', 'Move, copy, split and delete events'],
  ['set_tempo · add_marker · set_locators', 'Tempo and time signature, markers, locators'],
  ['undo · redo', 'History – every edit is one undo step'],
  ['transport', 'Only with --connect: play, stop, set cursor'],
  ['ui_screenshot · ui_inspect · ui_click', 'Only with --connect: view the window, read and click controls'],
];

export function body(base) {
  return `
<section class="page-hero">
  <div class="wrap">
    ${kicker('AI agents &amp; MCP')}
    <h1>Let an AI agent produce with you.</h1>
    <p class="lead"><code>studiocraft-cli mcp</code> exposes StudioCraft through the Model Context Protocol. Agents such as Claude Code, Claude Desktop, Codex or Cursor create projects, edit them, save them and render mixdowns.</p>
    <div class="hero-actions">
      <a class="btn btn-wine btn-lg" href="#setup"><span>Set up</span>${icon.arrow()}</a>
      <a class="btn btn-ghost btn-lg" href="${SITE.mcpDoc}" rel="noopener"><span>Full documentation</span>${icon.external()}</a>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="section-head">
      ${kicker('Two modes')}
      <h2 class="h2">Headless or in the running app.</h2>
      <p class="lead">In both cases the tools run through the same code as the app: undo history, import, saving and mixdown behave exactly the same.</p>
    </div>
    <div class="two-cards">
      <article class="card mode-card">
        <p class="label">headless · default</p>
        <h3>A project without a window</h3>
        <p>The server keeps its own project window in memory – without a screen and without an audio device. Ideal for scripts and automation.</p>
        ${codeBox('Terminal', 'studiocraft-cli mcp \\\n  --automation-read-root ~/Music/Samples \\\n  --automation-write-root ~/Music/Projects')}
      </article>
      <article class="card mode-card">
        <p class="label">--connect</p>
        <h3>The agent works in your app</h3>
        <p>The app opens a local control channel with its own token. You see every change immediately and can undo it with Ctrl+Z.</p>
        ${codeBox('Two terminals', 'studiocraft --control 7850\nstudiocraft-cli mcp --connect 7850 \\\n  --automation-read-root ~/Music/Projects \\\n  --automation-write-root ~/Music/Projects')}
      </article>
    </div>
  </div>
</section>

<section class="section" id="setup">
  <div class="wrap split">
    <div>
      ${kicker('Setup')}
      <h2 class="h2">Connected in a minute.</h2>
      <p class="lead">Register the MCP server in your client once – done. Errors and notices go to stderr; stdout carries protocol messages only.</p>
      ${textLink(SITE.mcpDoc, 'More clients and options', 'ext')}
    </div>
    <div>
      ${codeBox('Claude Code', 'claude mcp add studiocraft -- /path/to/studiocraft-cli mcp \\\n  --automation-read-root /work/project \\\n  --automation-write-root /work/project')}
      ${codeBox('.mcp.json / claude_desktop_config.json', '{"mcpServers": {"studiocraft": {\n  "command": "/path/to/studiocraft-cli",\n  "args": ["mcp",\n    "--automation-read-root", "/work/project",\n    "--automation-write-root", "/work/project"]}}}')}
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="section-head">
      ${kicker('Tools')}
      <h2 class="h2">What an agent can do.</h2>
      <p class="lead">Positions count like the ruler (<code>5.1.1.0</code> = bar 5), 960 ticks per quarter note. Errors come back as a tool result, never as a crash.</p>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Tool</th><th>Purpose</th></tr></thead>
        <tbody>${TOOLS.map(([t, d]) => `<tr><td><code>${t}</code></td><td>${d}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      ${kicker('Security')}
      <h2 class="h2">The agent stays in its folders.</h2>
      <p class="lead">The server only starts with defined read and write folders. Every path is checked before anything is opened or saved.</p>
      <ul class="checks">
        <li>${icon.check()}<span><code>--automation-read-root</code>: reading is allowed here</span></li>
        <li>${icon.check()}<span><code>--automation-write-root</code>: writing is allowed here</span></li>
        <li>${icon.check()}<span>Control channel on 127.0.0.1 only, with a new token on every start</span></li>
        <li>${icon.check()}<span>An unknown flag is an error – never an open server</span></li>
      </ul>
    </div>
    <div class="notice">
      <div>
        <strong>Limits of this version</strong>
        <p style="margin-top:8px">Headless mode loads no plugins and has no playback or recording; the mixdown renders without plugins. Key presses, dragging and scrolling are still missing, as are mixer routing, sends, inserts and automation as tools. Details in the <a href="${SITE.mcpDoc}" rel="noopener">MCP documentation</a>.</p>
      </div>
    </div>
  </div>
</section>`;
}
