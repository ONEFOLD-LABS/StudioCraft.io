import { SITE, kicker, textLink, codeBox } from '../layout.mjs';

export const meta = {
  path: 'engine/',
  active: 'engine',
  title: 'Audio Engine & Platforms – StudioCraft',
  description: 'The StudioCraft real-time audio engine: audio hosts per system, plugin hosting for CLAP and LV2, and its building blocks in Rust.',
};

export function body(base) {
  const hosts = [
    ['Linux', 'PipeWire (default), ALSA; JACK with <code>--features jack</code>'],
    ['Windows', 'WASAPI (shared mode); ASIO only in your own build with <code>--features asio</code>'],
    ['macOS', 'CoreAudio; JACK with <code>--features jack</code>'],
    ['FreeBSD', 'ALSA via OSS; PipeWire and JACK as features'],
    ['Web', 'Web Audio, selected automatically'],
  ];
  const parts = [
    ['apps/studiocraft', 'Desktop app (eframe/egui)'],
    ['apps/studiocraft-cli', 'Command line for tests and scripts, with MCP server'],
    ['crates/project', 'Project model, edits, tempo map, versioned file format'],
    ['crates/engine', 'Real-time audio: transport, mixing and routing, recording, MIDI, export'],
    ['crates/plugin-host', 'Plugin hosting for CLAP and LV2'],
    ['crates/graph', 'Signal graph helpers'],
    ['crates/ui', 'Project window, mixer, editors, menus, theme, settings'],
    ['crates/automation', 'MCP server for AI agents'],
  ];
  return `
<section class="page-hero">
  <div class="wrap">
    ${kicker('Audio engine')}
    <h1>Real-time audio, Rust all the way through.</h1>
    <p class="lead">Transport, mixing, routing, recording, MIDI and export run in a dedicated engine. It talks to your computer's audio system and hosts your plugins.</p>
    <nav class="jump" aria-label="Sections"><a href="#hosts">Audio hosts</a><a href="#plugins">Plugins</a><a href="#architecture">Architecture</a><a href="#build">Build it yourself</a></nav>
  </div>
</section>

<section class="section tint" id="hosts">
  <div class="wrap split">
    <div>
      ${kicker('Audio hosts')}
      <h2 class="h2">The right audio system for each platform.</h2>
      <p class="lead">Choose the host with <code>--audio-host &lt;name&gt;</code>. <code>studiocraft --list-hosts</code> shows what is included in a given build.</p>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>System</th><th>Audio hosts</th></tr></thead>
        <tbody>${hosts.map(([s, h]) => `<tr><th scope="row">${s}</th><td>${h}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section" id="plugins">
  <div class="wrap">
    <div class="section-head">
      ${kicker('Plugins')}
      <h2 class="h2">CLAP and LV2 – hosted reliably.</h2>
    </div>
    <div class="feature-grid">
      <article class="card"><h3>Instruments &amp; effects</h3><p>CLAP instruments and inserts as well as LV2 plugins with parameter controls. Each plugin's state is saved with the project.</p></article>
      <article class="card"><h3>Scanning in child processes</h3><p>The plugin scan runs in separate processes. If a plugin crashes during the scan, it is blocked – StudioCraft keeps running.</p></article>
      <article class="card"><h3>Plugin windows</h3><p>Plugin interfaces float as their own windows everywhere; on X11 they can be embedded. VST3 and AU are still open.</p></article>
    </div>
  </div>
</section>

<section class="section tint" id="architecture">
  <div class="wrap">
    <div class="section-head">
      ${kicker('Architecture')}
      <h2 class="h2">Clearly separated building blocks.</h2>
      <p class="lead">Rust only, no Electron or Tauri. The interface uses egui/eframe, audio input and output go through cpal.</p>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Path</th><th>Purpose</th></tr></thead>
        <tbody>${parts.map(([p, d]) => `<tr><td><code>${p}</code></td><td>${d}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section" id="build">
  <div class="wrap split">
    <div>
      ${kicker('Build it yourself')}
      <h2 class="h2">Start from source.</h2>
      <p class="lead">Requires Rust 1.85 or newer. On Linux you also need the ALSA and PipeWire development files and <code>clang</code>.</p>
      ${textLink(SITE.platformDoc, 'Platforms and packages in detail', 'ext')}
    </div>
    <div>
      ${codeBox('Build and run', 'cargo build --release\ncargo run --release -p studiocraft')}
      ${codeBox('Open audio files directly', 'cargo run --release -p studiocraft -- a.wav b.wav')}
      ${codeBox('Same checks as CI', 'cargo xtask ci')}
    </div>
  </div>
</section>`;
}
