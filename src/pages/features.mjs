import { SITE, kicker, textLink } from '../layout.mjs';
import { screen, appFrame, projectWindow, mixerWindow, keyEditor } from '../art.mjs';

export const meta = {
  path: 'features/',
  active: 'features',
  title: 'Features – StudioCraft',
  description: 'Project window, track types, recording, editors, mixer, automation, plugins and export: an overview of every StudioCraft feature.',
};

const pills = (items) => `<ul class="pill-list">${items.map((t) => `<li>${t}</li>`).join('')}</ul>`;

export function body(base) {
  const tools = [
    ['1', 'Object selection', 'Select, move and resize events'],
    ['2', 'Range selection', 'Time range across several tracks'],
    ['3', 'Split', 'Split an event at the position'],
    ['4', 'Glue', 'Join an event with the next one'],
    ['5', 'Erase', 'Delete events'],
    ['6', 'Zoom', 'Zoom in and out'],
    ['7', 'Mute', 'Mute or unmute events'],
    ['8', 'Draw', 'Create parts and notes'],
    ['9', 'Play', 'Listen from a position, scrub'],
    ['0', 'Time warp', 'Drag beats onto the grid'],
  ];
  return `
<section class="page-hero">
  <div class="wrap">
    ${kicker('Features')}
    <h1>A complete studio in one window.</h1>
    <p class="lead">StudioCraft follows a proven DAW workflow: create tracks, record, edit, mix and export. Here is everything that already works today.</p>
    <nav class="jump" aria-label="Sections">
      <a href="#project-window">Project window</a><a href="#tracks">Tracks</a><a href="#recording">Recording</a><a href="#editors">Editors</a><a href="#mixer">Mixer</a><a href="#automation">Automation</a><a href="#plugins">Plugins</a><a href="#export">Export</a><a href="#projects">Projects</a>
    </nav>
  </div>
</section>

<section class="wrap" aria-label="Features in detail">
  <div class="detail" id="project-window">
    <div><span class="num">01</span><h2>Project window</h2></div>
    <div class="body">
      <p>On the left, the inspector with the settings of the selected track; next to it the track list and the event display with ruler. At the bottom, the lower zone with mixer, key editor and sample editor. Transport bar with F2, mixer window with F3.</p>
      <p>Exactly one tool is active; the number keys select it directly:</p>
      <div class="table-wrap" style="margin-top:20px">
        <table>
          <thead><tr><th>Key</th><th>Tool</th><th>Used for</th></tr></thead>
          <tbody>${tools.map(([k, t, d]) => `<tr><th scope="row"><code>${k}</code></th><td>${t}</td><td>${d}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      ${appFrame(screen(base, 'project-window', () => projectWindow({ seed: 7 }), 'The StudioCraft project window'), 'Project window with inspector, track list, event display and mixer in the lower zone')}
    </div>
  </div>

  <div class="detail" id="tracks">
    <div><span class="num">02</span><h2>Track types</h2></div>
    <div class="body">
      <p>Every track has a type and its own colour, which new events and the mixer channel inherit. The track header shows mute, solo, record enable, monitor and automation at a glance.</p>
      ${pills(['Audio', 'Instrument', 'MIDI', 'Group', 'FX channel', 'Folder', 'Marker', 'Tempo &amp; time signature'])}
    </div>
  </div>

  <div class="detail" id="recording">
    <div><span class="num">03</span><h2>Recording</h2></div>
    <div class="body">
      <p>Audio and MIDI are recorded straight into the tracks. In cycle mode, several takes stack on top of each other, and you assemble the best version from them by comping.</p>
      ${pills(['Cycle takes', 'Punch in / punch out', 'Count-in', 'Take lanes', 'Comping', 'MIDI recording'])}
    </div>
  </div>

  <div class="detail" id="editors">
    <div><span class="num">04</span><h2>Editors</h2></div>
    <div class="body">
      <p>The key editor shows MIDI notes on a keyboard with velocities below. Quantize aligns notes to the grid, the sample editor works directly on the waveform, and fade and crossfade editors shape transitions.</p>
      ${pills(['Key editor', 'Quantize', 'Sample editor', 'Fade editor', 'Crossfade editor', 'List editor'])}
      ${appFrame(screen(base, 'key-editor', () => keyEditor({ seed: 11 }), 'The StudioCraft key editor'), 'Key editor with keyboard, notes and velocities')}
    </div>
  </div>

  <div class="detail" id="mixer">
    <div><span class="num">05</span><h2>Mixer</h2></div>
    <div class="body">
      <p>Every channel has an input stage, pre-filters, EQ, pre- and post-fader inserts and sends. Solo modes, peak hold, saved mixer views and input and output busses round off the mixer.</p>
      ${pills(['Input stage', 'Pre-filter', 'EQ', 'Inserts pre/post', 'Sends', 'Solo modes', 'Peak hold', 'Mixer views', 'Busses'])}
      ${appFrame(screen(base, 'mixer', () => mixerWindow({ seed: 3 }), 'The StudioCraft mixer'), 'Mixer window with channel strips and level meters')}
    </div>
  </div>

  <div class="detail" id="automation">
    <div><span class="num">06</span><h2>Automation &amp; tempo</h2></div>
    <div class="body">
      <p>Parameters can be read and written as curves. The tempo track supports fixed and variable tempos as well as time signature changes. Plugin delay compensation keeps every track in time.</p>
      ${pills(['Automation read/write', 'Tempo track', 'Time signatures', 'Delay compensation'])}
    </div>
  </div>

  <div class="detail" id="plugins">
    <div><span class="num">07</span><h2>Plugins</h2></div>
    <div class="body">
      <p>StudioCraft loads instruments and effects in CLAP and LV2 format. Their state is saved with the project. The plugin scan runs in separate processes: if a plugin crashes, it is blocked instead of taking the program down with it.</p>
      ${pills(['CLAP', 'LV2', 'Instruments', 'Effects', 'safe plugin scan'])}
      <p class="small" style="margin-top:14px">LV2 requires <code>lilv</code> to be installed; without lilv, LV2 plugins are simply not offered.</p>
    </div>
  </div>

  <div class="detail" id="export">
    <div><span class="num">08</span><h2>Export</h2></div>
    <div class="body">
      <p>Render tracks in place, freeze them, export stems or save the whole song as a mixdown.</p>
      ${pills(['Render in place', 'Freeze track', 'Stem export', 'WAV', 'FLAC', 'AIFF', 'MIDI export'])}
    </div>
  </div>

  <div class="detail" id="projects">
    <div><span class="num">09</span><h2>Projects</h2></div>
    <div class="body">
      <p>A project is a folder containing a <code>.studiocraft</code> file in an open JSON format plus the audio files. Autosave and crash recovery protect your work. Dark and light appearance can be switched.</p>
      ${pills(['open JSON format', 'autosave', 'crash recovery', 'dark &amp; light theme'])}
      <div style="margin-top:24px">${textLink(SITE.spec, 'Full specification of the workflow', 'ext')}</div>
    </div>
  </div>
</section>`;
}
