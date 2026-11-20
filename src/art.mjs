// Illustrations of the StudioCraft user interface, drawn as SVG with the app's own dark theme
// tokens (crates/ui/src/theme.rs). They stand in for real screenshots until those are added:
// drop a PNG with the same name into src/screens/ and it will be used instead (see README).

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const T = {
  window: '#1e1e1e', panel: '#2a2a2a', panel2: '#323232', toolbar: '#242424', border: '#121212',
  borderLight: '#454545', text: '#d8d8d8', dim: '#9a9a9a', accent: '#c8466a', brandLight: '#d9587a',
  brandDark: '#8e1f3c', accentDark: '#9e2343', button: '#3c3c3c', ruler: '#2e2e2e', rulerText: '#b4b4b4',
  lane: '#262626', laneAlt: '#2a2a2a', grid: '#363636', bar: '#474747', playhead: '#f2e8ea',
  rec: '#f0452e', solo: '#dec434', mute: '#e89428', monitor: '#46aa5a', counterBg: '#0c0c0c',
  counterText: '#ef9fb4', mGreen: '#3cc850', mYellow: '#e6d23c', mRed: '#f0452e', fader: '#0c0c0c',
  strip: '#303030', keyWhite: '#e4e4e4', keyBlack: '#1c1c1c', keyRow: '#5a2a38',
};
const FONT = `font-family="Ubuntu, 'Segoe UI', Roboto, sans-serif"`;
const MONO = `font-family="'Ubuntu Mono', 'DejaVu Sans Mono', monospace"`;

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const TRACKS = [
  { name: 'Drums', color: '#d9587a', kind: 'audio' },
  { name: 'Bass', color: '#e0a33a', kind: 'audio' },
  { name: 'Guitar', color: '#7fb069', kind: 'audio' },
  { name: 'Vocals', color: '#5aa0d8', kind: 'audio' },
  { name: 'Synth Pad', color: '#9b7ad8', kind: 'midi' },
  { name: 'Reverb (FX)', color: '#8f97a8', kind: 'fx' },
];
const MENUS = ['File', 'Edit', 'Project', 'Audio', 'MIDI', 'Media', 'Transport', 'Studio', 'Window', 'Help'];

function mark(x, y, r) {
  // small version of the app mark: wine disc with a fading wave cut out
  let d = '';
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const px = x - r * 0.75 + t * r * 1.5;
    const py = y - Math.sin(t * Math.PI * 5) * r * 0.5 * (1 - t);
    d += `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${T.accentDark}"/><path d="${d}" fill="none" stroke="${T.toolbar}" stroke-width="${r * 0.18}" stroke-linecap="round"/>`;
}

function waveform(x, y, w, h, seed, color = 'rgba(10,10,10,.75)') {
  const r = rng(seed);
  let top = '', bottom = '';
  const n = Math.max(8, Math.floor(w / 3));
  let env = 0.5;
  for (let i = 0; i <= n; i++) {
    env = Math.min(1, Math.max(0.12, env + (r() - 0.5) * 0.35));
    const a = env * (0.55 + r() * 0.45) * h * 0.46;
    const px = x + (i / n) * w;
    top += `${i ? 'L' : 'M'}${px.toFixed(1)} ${(y + h / 2 - a).toFixed(1)} `;
    bottom = `L${px.toFixed(1)} ${(y + h / 2 + a).toFixed(1)} ` + bottom;
  }
  return `<path d="${top}${bottom}Z" fill="${color}"/>`;
}

function midiNotes(x, y, w, h, seed) {
  const r = rng(seed);
  let s = '';
  let px = x + 4;
  while (px < x + w - 20) {
    const len = 14 + Math.floor(r() * 3) * 14;
    const py = y + 6 + Math.floor(r() * 6) * ((h - 16) / 6);
    s += `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${len}" height="4" rx="1" fill="rgba(10,10,10,.8)"/>`;
    px += len + 4;
  }
  return s;
}

/** The StudioCraft project window: title bar, toolbar with counter, inspector, track list, events, mixer. */
export function projectWindow({ lowerZone = true, seed = 7 } = {}) {
  const W = 1600, H = 900;
  let s = `<rect width="${W}" height="${H}" fill="${T.window}"/>`;
  // title bar + menus
  s += `<rect width="${W}" height="34" fill="${T.toolbar}"/>${mark(20, 17, 10)}`;
  let mx = 44;
  for (const m of MENUS) {
    s += `<text x="${mx}" y="22" fill="${T.text}" font-size="13" ${FONT}>${m}</text>`;
    mx += m.length * 7.4 + 18;
  }
  s += `<text x="${W - 300}" y="22" fill="${T.dim}" font-size="13" ${FONT}>Demo-Song – StudioCraft</text>`;
  s += `<rect x="0" y="34" width="${W}" height="1" fill="${T.border}"/>`;
  // toolbar
  s += `<rect y="35" width="${W}" height="46" fill="${T.toolbar}"/>`;
  for (let i = 0; i < 10; i++) {
    s += `<rect x="${14 + i * 34}" y="45" width="28" height="26" rx="3" fill="${i === 0 ? T.accentDark : T.button}"/>`;
    s += `<text x="${28 + i * 34}" y="63" fill="${i === 0 ? '#fff' : T.dim}" font-size="11" text-anchor="middle" ${FONT}>${(i + 1) % 10}</text>`;
  }
  // transport
  const tx = 640;
  s += `<rect x="${tx}" y="43" width="300" height="30" rx="4" fill="${T.counterBg}"/>`;
  s += `<text x="${tx + 150}" y="65" fill="${T.counterText}" font-size="20" text-anchor="middle" ${MONO}>0009. 02. 01. 000</text>`;
  const btn = (x, c, shape) => `<rect x="${x}" y="45" width="30" height="26" rx="3" fill="${T.button}"/>${shape(x + 15, 58, c)}`;
  s += btn(tx - 140, T.text, (x, y, c) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${c}"/>`);
  s += btn(tx - 104, T.text, (x, y, c) => `<path d="M${x - 4} ${y - 6} L${x + 6} ${y} L${x - 4} ${y + 6}Z" fill="${c}"/>`);
  s += btn(tx - 68, T.rec, (x, y, c) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`);
  s += `<rect x="${tx - 34}" y="45" width="30" height="26" rx="3" fill="${T.accentDark}"/><text x="${tx - 19}" y="63" fill="#fff" font-size="11" text-anchor="middle" ${FONT}>⟲</text>`;
  s += `<text x="${tx + 320}" y="56" fill="${T.dim}" font-size="11" ${FONT}>Tempo</text><text x="${tx + 320}" y="71" fill="${T.text}" font-size="14" ${MONO}>120.000</text>`;
  s += `<text x="${tx + 400}" y="56" fill="${T.dim}" font-size="11" ${FONT}>Signature</text><text x="${tx + 400}" y="71" fill="${T.text}" font-size="14" ${MONO}>4/4</text>`;
  s += `<rect x="${W - 210}" y="49" width="190" height="18" rx="2" fill="${T.panel}"/>`;
  for (let i = 0; i < 2; i++) s += `<rect x="${W - 206}" y="${52 + i * 7}" width="${120 + i * 30}" height="4" fill="${i ? T.mYellow : T.mGreen}"/>`;
  s += `<rect y="81" width="${W}" height="1" fill="${T.border}"/>`;

  const top = 82;
  const bottom = lowerZone ? 600 : H - 26;
  // inspector
  const insW = 230;
  s += `<rect x="0" y="${top}" width="${insW}" height="${bottom - top}" fill="${T.panel}"/>`;
  s += `<rect x="0" y="${top}" width="${insW}" height="28" fill="${T.panel2}"/><text x="12" y="${top + 19}" fill="${T.text}" font-size="13" font-weight="500" ${FONT}>Vocals</text>`;
  const insRows = ['Input: Mono 1', 'Output: Stereo Out', 'Inserts', 'Equalizer', 'Sends', 'Channel'];
  insRows.forEach((t, i) => {
    const y = top + 44 + i * 38;
    s += `<rect x="8" y="${y}" width="${insW - 16}" height="30" rx="3" fill="${i < 2 ? T.lane : T.panel2}"/>`;
    s += `<text x="18" y="${y + 20}" fill="${i < 2 ? T.text : T.dim}" font-size="12" ${FONT}>${i < 2 ? '' : '▸ '}${t}</text>`;
  });
  s += `<rect x="${insW / 2 - 4}" y="${top + 290}" width="8" height="${bottom - top - 320}" rx="3" fill="${T.fader}"/>`;
  s += `<rect x="${insW / 2 - 18}" y="${top + 360}" width="36" height="18" rx="3" fill="${T.button}" stroke="${T.borderLight}"/>`;
  // track list
  const tlX = insW + 1, tlW = 270, rowH = Math.min(78, (bottom - top - 30) / TRACKS.length);
  s += `<rect x="${tlX}" y="${top}" width="${tlW}" height="${bottom - top}" fill="${T.panel}"/>`;
  s += `<rect x="${tlX}" y="${top}" width="${tlW}" height="30" fill="${T.ruler}"/>`;
  TRACKS.forEach((t, i) => {
    const y = top + 30 + i * rowH;
    const sel = i === 3;
    s += `<rect x="${tlX}" y="${y}" width="${tlW}" height="${rowH - 1}" fill="${sel ? '#383838' : T.panel}"/>`;
    s += `<rect x="${tlX}" y="${y}" width="6" height="${rowH - 1}" fill="${t.color}"/>`;
    s += `<text x="${tlX + 18}" y="${y + 24}" fill="${T.text}" font-size="13" ${FONT}>${t.name}</text>`;
    const bx = tlX + tlW - 104;
    [['M', i === 5 ? T.mute : T.button], ['S', i === 1 ? T.solo : T.button], ['R', sel ? T.rec : T.button], ['◉', i === 3 ? T.monitor : T.button]].forEach(([l, c], k) => {
      s += `<rect x="${bx + k * 24}" y="${y + 10}" width="20" height="20" rx="3" fill="${c}"/><text x="${bx + k * 24 + 10}" y="${y + 24}" fill="${c === T.button ? T.dim : '#111'}" font-size="11" text-anchor="middle" ${FONT}>${l}</text>`;
    });
    s += `<rect x="${tlX + 18}" y="${y + rowH - 20}" width="140" height="4" rx="2" fill="${T.fader}"/><rect x="${tlX + 18}" y="${y + rowH - 20}" width="${80 + i * 9}" height="4" rx="2" fill="${T.mGreen}" opacity=".8"/>`;
  });
  // ruler + events
  const evX = tlX + tlW + 1, evW = W - evX, barW = 92;
  s += `<rect x="${evX}" y="${top}" width="${evW}" height="30" fill="${T.ruler}"/>`;
  s += `<rect x="${evX + barW * 4}" y="${top}" width="${barW * 8}" height="12" fill="rgba(200,70,106,.25)"/>`;
  for (let b = 0; b * barW < evW; b++) {
    const x = evX + b * barW;
    s += `<line x1="${x}" y1="${top + 14}" x2="${x}" y2="${top + 30}" stroke="#626262"/><text x="${x + 4}" y="${top + 26}" fill="${T.rulerText}" font-size="11" ${FONT}>${b + 1}</text>`;
  }
  TRACKS.forEach((t, i) => {
    const y = top + 30 + i * rowH;
    s += `<rect x="${evX}" y="${y}" width="${evW}" height="${rowH - 1}" fill="${i % 2 ? T.laneAlt : T.lane}"/>`;
  });
  for (let b = 0; b * barW < evW; b++) {
    s += `<line x1="${evX + b * barW}" y1="${top + 30}" x2="${evX + b * barW}" y2="${bottom}" stroke="${T.bar}"/>`;
    for (let q = 1; q < 4; q++) s += `<line x1="${evX + b * barW + q * barW / 4}" y1="${top + 30}" x2="${evX + b * barW + q * barW / 4}" y2="${bottom}" stroke="${T.grid}"/>`;
  }
  const r = rng(seed);
  TRACKS.forEach((t, i) => {
    if (t.kind === 'fx') return;
    const y = top + 30 + i * rowH + 3;
    const h = rowH - 7;
    let b = i === 3 ? 4 : i === 4 ? 2 : 0;
    while (b < 12) {
      const len = t.kind === 'midi' ? 4 : 2 + Math.floor(r() * 3) * 2;
      const x = evX + b * barW + 1, w = Math.min(len * barW - 2, evW - (x - evX) - 2);
      if (w < 20) break;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${t.color}"/>`;
      s += `<rect x="${x}" y="${y}" width="${w}" height="13" rx="3" fill="rgba(0,0,0,.18)"/><text x="${x + 5}" y="${y + 10}" fill="#0a0a0a" font-size="9.5" ${FONT}>${t.name}${t.kind === 'midi' ? '' : '_' + (b + 1)}</text>`;
      s += t.kind === 'midi' ? midiNotes(x, y + 14, w, h - 16, seed + b) : waveform(x + 2, y + 14, w - 4, h - 16, seed * 31 + i * 7 + b);
      b += len + (r() < 0.25 ? 1 : 0);
    }
  });
  const ph = evX + barW * 8.4;
  s += `<line x1="${ph}" y1="${top}" x2="${ph}" y2="${bottom}" stroke="${T.playhead}" stroke-width="2"/>`;
  // lower zone: mixer
  if (lowerZone) {
    s += `<rect y="${bottom}" width="${W}" height="1" fill="${T.border}"/><rect y="${bottom + 1}" width="${W}" height="${H - bottom - 27}" fill="${T.window}"/>`;
    s += `<rect y="${bottom + 1}" width="${W}" height="26" fill="${T.toolbar}"/>`;
    ['Mixer', 'Key Editor', 'Sample Editor'].forEach((t, k) => {
      s += `<rect x="${10 + k * 110}" y="${bottom + 4}" width="100" height="20" rx="3" fill="${k === 0 ? T.accentDark : T.button}"/><text x="${60 + k * 110}" y="${bottom + 18}" fill="${k === 0 ? '#fff' : T.dim}" font-size="11" text-anchor="middle" ${FONT}>${t}</text>`;
    });
    s += mixerStrips(10, bottom + 34, H - bottom - 66, 15, seed);
  }
  // status line
  s += `<rect y="${H - 26}" width="${W}" height="26" fill="${T.toolbar}"/><text x="12" y="${H - 9}" fill="${T.dim}" font-size="11" ${FONT}>48 kHz · 24 bit · PipeWire · Latency 5.3 ms · Project saved</text>`;
  return wrapSvg(W, H, s, 'StudioCraft project window with tracks, events and mixer');
}

function mixerStrips(x0, y0, h, n, seed, wide = false) {
  const r = rng(seed + 99);
  const names = ['Drums', 'Bass', 'Guitar', 'Vocals', 'Pad', 'Reverb', 'Delay', 'Kick', 'Snare', 'HiHat', 'Keys', 'Choir', 'Lead', 'Bus A', 'Stereo Out'];
  const cols = ['#d9587a', '#e0a33a', '#7fb069', '#5aa0d8', '#9b7ad8', '#8f97a8', '#8f97a8', '#d9587a', '#d9587a', '#d9587a', '#e0a33a', '#5aa0d8', '#9b7ad8', '#7fa37a', '#c8466a'];
  const sw = wide ? 96 : 92, gap = wide ? 8 : 12;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (sw + gap);
    const master = i === n - 1;
    s += `<rect x="${x}" y="${y0}" width="${sw}" height="${h}" rx="4" fill="${master ? '#352a2e' : T.strip}"/>`;
    s += `<rect x="${x}" y="${y0}" width="${sw}" height="5" rx="2" fill="${cols[i % cols.length]}"/>`;
    // knobs (EQ / pan)
    const ky = y0 + 26;
    for (let k = 0; k < (wide ? 3 : 1); k++) {
      const cx = x + sw / 2 + (wide ? (k - 1) * 28 : 0), cy = ky + (wide ? 0 : 0);
      const ang = -2.2 + r() * 4.4;
      s += `<circle cx="${cx}" cy="${cy}" r="10" fill="${T.button}" stroke="${T.borderLight}"/><line x1="${cx}" y1="${cy}" x2="${(cx + Math.sin(ang) * 9).toFixed(1)}" y2="${(cy - Math.cos(ang) * 9).toFixed(1)}" stroke="${T.accent}" stroke-width="2" stroke-linecap="round"/>`;
    }
    if (wide) {
      for (let k = 0; k < 4; k++) s += `<rect x="${x + 8}" y="${y0 + 46 + k * 18}" width="${sw - 16}" height="14" rx="2" fill="${k < 2 ? '#3a2f33' : T.lane}"/><text x="${x + 13}" y="${y0 + 56 + k * 18}" fill="${k < 2 ? T.text : '#5a5a5a'}" font-size="9" ${FONT}>${k === 0 ? 'EQ' : k === 1 ? 'Compressor' : '–'}</text>`;
    }
    const fTop = y0 + (wide ? 130 : 48), fH = h - (wide ? 190 : 100);
    // meter
    const lvl = 0.35 + r() * 0.55;
    const mx = x + sw - 26;
    s += `<rect x="${mx}" y="${fTop}" width="12" height="${fH}" fill="${T.fader}"/>`;
    const filled = fH * lvl;
    const g = Math.min(filled, fH * 0.7), yv = Math.min(Math.max(filled - g, 0), fH * 0.2), rd = Math.max(filled - g - yv, 0);
    s += `<rect x="${mx + 1}" y="${fTop + fH - g}" width="10" height="${g}" fill="${T.mGreen}"/>`;
    if (yv) s += `<rect x="${mx + 1}" y="${fTop + fH - g - yv}" width="10" height="${yv}" fill="${T.mYellow}"/>`;
    if (rd) s += `<rect x="${mx + 1}" y="${fTop + fH - g - yv - rd}" width="10" height="${rd}" fill="${T.mRed}"/>`;
    // fader
    const fx = x + 26;
    s += `<rect x="${fx - 3}" y="${fTop}" width="6" height="${fH}" rx="3" fill="${T.fader}"/>`;
    const capY = fTop + fH * (0.2 + r() * 0.4);
    s += `<rect x="${fx - 14}" y="${capY}" width="28" height="16" rx="3" fill="#5a5a5a" stroke="#777"/><line x1="${fx - 10}" y1="${capY + 8}" x2="${fx + 10}" y2="${capY + 8}" stroke="#ddd"/>`;
    // buttons + name
    const by = y0 + h - 44;
    [['M', T.button], ['S', i === 3 ? T.solo : T.button]].forEach(([l, c], k) => {
      s += `<rect x="${x + 8 + k * 26}" y="${by}" width="22" height="16" rx="2" fill="${c}"/><text x="${x + 19 + k * 26}" y="${by + 12}" fill="${c === T.button ? T.dim : '#111'}" font-size="10" text-anchor="middle" ${FONT}>${l}</text>`;
    });
    s += `<rect x="${x + 4}" y="${y0 + h - 22}" width="${sw - 8}" height="18" rx="2" fill="${T.lane}"/><text x="${x + sw / 2}" y="${y0 + h - 9}" fill="${T.text}" font-size="11" text-anchor="middle" ${FONT}>${master ? 'Stereo Out' : names[i % names.length]}</text>`;
  }
  return s;
}

/** A larger mixer view (Mixer-Fenster, F3). */
export function mixerWindow({ seed = 3 } = {}) {
  const W = 1600, H = 900;
  let s = `<rect width="${W}" height="${H}" fill="${T.window}"/><rect width="${W}" height="34" fill="${T.toolbar}"/>${mark(20, 17, 10)}`;
  s += `<text x="44" y="22" fill="${T.text}" font-size="13" ${FONT}>Mixer – Demo-Song</text>`;
  ['All', 'Audio', 'Instruments', 'Groups', 'FX', 'Busses'].forEach((t, k) => {
    s += `<rect x="${W - 560 + k * 90}" y="7" width="84" height="20" rx="3" fill="${k === 0 ? T.accentDark : T.button}"/><text x="${W - 518 + k * 90}" y="21" fill="${k === 0 ? '#fff' : T.dim}" font-size="11" text-anchor="middle" ${FONT}>${t}</text>`;
  });
  s += mixerStrips(16, 48, H - 64, 15, seed, true);
  return wrapSvg(W, H, s, 'StudioCraft mixer with channel strips, level meters and faders');
}

/** Key editor with piano keys and notes. */
export function keyEditor({ seed = 11 } = {}) {
  const W = 1600, H = 900;
  let s = `<rect width="${W}" height="${H}" fill="${T.window}"/><rect width="${W}" height="34" fill="${T.toolbar}"/>${mark(20, 17, 10)}`;
  s += `<text x="44" y="22" fill="${T.text}" font-size="13" ${FONT}>Key Editor – Synth Pad</text>`;
  s += `<rect y="34" width="${W}" height="40" fill="${T.toolbar}"/>`;
  ['Quantize: 1/16', 'Length: 1/8', 'Grid: Bar'].forEach((t, k) => {
    s += `<rect x="${12 + k * 170}" y="42" width="160" height="24" rx="3" fill="${T.button}"/><text x="${22 + k * 170}" y="58" fill="${T.text}" font-size="12" ${FONT}>${t}</text>`;
  });
  const keyW = 90, top = 104, rows = 30, rowH = (H - top - 160) / rows;
  s += `<rect y="74" width="${W}" height="30" fill="${T.ruler}"/>`;
  const barW = 180;
  for (let b = 0; keyW + b * barW < W; b++) s += `<text x="${keyW + b * barW + 5}" y="94" fill="${T.rulerText}" font-size="11" ${FONT}>${b + 9}</text>`;
  const black = [1, 3, 6, 8, 10];
  for (let i = 0; i < rows; i++) {
    const y = top + i * rowH, isBlack = black.includes((rows - i) % 12);
    s += `<rect x="${keyW}" y="${y}" width="${W - keyW}" height="${rowH}" fill="${isBlack ? T.lane : T.laneAlt}"/>`;
    s += `<rect x="0" y="${y}" width="${keyW}" height="${rowH}" fill="${isBlack ? T.keyBlack : T.keyWhite}" stroke="#949494" stroke-width=".5"/>`;
    if ((rows - i) % 12 === 0) s += `<text x="${keyW - 26}" y="${y + rowH - 3}" fill="#333" font-size="10" ${FONT}>C${3 + Math.floor((rows - i) / 12)}</text>`;
  }
  for (let b = 0; keyW + b * barW < W; b++) {
    s += `<line x1="${keyW + b * barW}" y1="${top}" x2="${keyW + b * barW}" y2="${top + rows * rowH}" stroke="${T.bar}"/>`;
    for (let q = 1; q < 4; q++) s += `<line x1="${keyW + b * barW + q * barW / 4}" y1="${top}" x2="${keyW + b * barW + q * barW / 4}" y2="${top + rows * rowH}" stroke="${T.grid}"/>`;
  }
  const r = rng(seed);
  let x = keyW + 4;
  while (x < W - 80) {
    const len = barW / 4 * (1 + Math.floor(r() * 4));
    const chord = [0, 4, 7].map((d) => d + Math.floor(r() * 3));
    const base = 6 + Math.floor(r() * 12);
    chord.forEach((d, k) => {
      const row = base + d;
      const sel = x > 700 && x < 1000;
      s += `<rect x="${x.toFixed(1)}" y="${(top + row * rowH + 1).toFixed(1)}" width="${(len - 4).toFixed(1)}" height="${(rowH - 2).toFixed(1)}" rx="2" fill="${sel ? '#ffffff' : T.accent}" stroke="#2a0d16"/>`;
      if (k === 0) s += '';
    });
    x += len;
  }
  // velocity lane
  const vy = H - 140;
  s += `<rect y="${vy}" width="${W}" height="140" fill="${T.panel}"/><text x="12" y="${vy + 22}" fill="${T.dim}" font-size="12" ${FONT}>Velocity</text>`;
  const r2 = rng(seed + 5);
  for (let vx = keyW + 8; vx < W - 20; vx += 45) {
    const v = 30 + r2() * 90;
    s += `<rect x="${vx}" y="${vy + 130 - v}" width="6" height="${v}" fill="${T.accent}"/>`;
  }
  return wrapSvg(W, H, s, 'StudioCraft key editor with keyboard, notes and velocities');
}

function wrapSvg(W, H, body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${body}</svg>`;
}

/* ---------- registry: written as files by build.mjs ---------- */
const here = dirname(fileURLToPath(import.meta.url));
export const artFiles = new Map();

/**
 * Picture of the app. If src/screens/<key>.png (a real screenshot) exists, that is used;
 * otherwise the SVG drawing is written to assets/screens/<key>.svg.
 */
export function screen(base, key, draw, alt) {
  const png = join(here, 'screens', `${key}.png`);
  if (existsSync(png)) {
    artFiles.set(`${key}.png`, { copy: png });
    return `<img class="screen-img" src="${base}assets/screens/${key}.png" alt="${alt}" width="1600" height="900" loading="lazy" decoding="async">`;
  }
  artFiles.set(`${key}.svg`, { svg: draw() });
  return `<img class="screen-img" src="${base}assets/screens/${key}.svg" alt="${alt}" width="1600" height="900" loading="lazy" decoding="async">`;
}

/** A window frame around a picture of the app. */
export const appFrame = (inner, caption = '') => `
<figure class="app-frame">
  <div class="app-frame-bar"><span></span><span></span><span></span></div>
  ${inner}
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;
