const W = 1080, H = 1920, cv = document.getElementById('c'), g = cv.getContext('2d');
const DISP = '"Bowlby One", Impact, sans-serif', BODY = '"Nunito", "DejaVu Sans", sans-serif';
const C = { tile: '#BCD3C4', tile2: '#C9DDCF', grout: '#A0BBAA', wood: '#C98B4E', woodL: '#DDA668', woodD: '#9C6532',
  cab: '#3A2D29', cabD: '#221917', porc: '#F6F2E8', porcD: '#CFC8B8', pipe: '#E6E0D2', pipeD: '#8C8676', air: '#51463F',
  murk: '#93AC92', murkD: '#6A8571', clean: '#BFE6F2', ink: '#1D1A16', yellow: '#FFC629', red: '#E5432E', rope: '#D9B678' };

function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const outBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function kf(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i], u = ease((t - a[0]) / (b[0] - a[0])); return a.slice(1).map((v, j) => lerp(v, b[j + 1], u)); }
  return keys[keys.length - 1].slice(1);
}
function rot(x, y, a) { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; }
function line(x1, y1, x2, y2) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
function circle(x, y, r) { g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
function rr(x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function txt(s, x, y, size, fill, font = DISP, maxW = 940) {
  g.font = `${size}px ${font}`; const w = g.measureText(s).width; if (w > maxW) { size *= maxW / w; g.font = `${size}px ${font}`; }
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.strokeStyle = C.ink; g.lineWidth = size * .26; g.strokeText(s, x, y); g.fillStyle = fill; g.fillText(s, x, y);
}
function cap(t, a, b, lines, y, size, col) {
  if (t < a || t > b) return; const s = outBack(seg(t, a, a + .22)) * (1 - seg(t, b - .12, b));
  g.save(); g.translate(540, y); g.rotate(-.035); g.scale(s, s);
  lines.forEach((ln, i) => txt(ln, 0, i * size * 1.12, size, Array.isArray(col) ? col[i] : col)); g.restore();
}

// ---------- static geometry
function bowlPath() { g.moveTo(100, 900); g.bezierCurveTo(100, 1150, 250, 1250, 405, 1250); g.lineTo(515, 1250); g.bezierCurveTo(670, 1250, 820, 1150, 820, 900); }
function pipePath() { g.moveTo(460, 1236); g.lineTo(460, 1640); g.arc(560, 1640, 100, Math.PI, 0, true); g.lineTo(660, 1570); g.quadraticCurveTo(660, 1500, 730, 1500); g.lineTo(1400, 1500); }

function wall() {
  g.fillStyle = C.tile; g.fillRect(-300, -300, 1700, 1210);
  for (let r = -4; r < 15; r++) for (let c = -3; c < 10; c++) {
    const x = c * 150 + (r & 1 ? 75 : 0), y = r * 60;
    g.fillStyle = ((r * 7 + c * 3) % 5 === 0) ? C.tile2 : C.tile; g.fillRect(x + 2, y + 2, 146, 56);
    g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(x + 2, y + 2, 146, 5);
  }
  g.strokeStyle = C.grout; g.lineWidth = 4;
  for (let r = -4; r < 16; r++) line(-300, r * 60, 1400, r * 60);
  const lg = g.createLinearGradient(1080, 0, 200, 900); lg.addColorStop(0, 'rgba(255,240,200,.38)'); lg.addColorStop(.6, 'rgba(255,240,200,0)');
  g.fillStyle = lg; g.fillRect(-300, -300, 1700, 1210);
}
function cabinet() {
  const cg = g.createLinearGradient(0, 956, 0, 1920); cg.addColorStop(0, C.cab); cg.addColorStop(1, C.cabD);
  g.fillStyle = cg; g.fillRect(-300, 950, 1700, 1300);
  g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 3; for (let x = -200; x < 1400; x += 170) line(x, 956, x, 2200);
  g.fillStyle = '#4A3932'; g.fillRect(-300, 1800, 1700, 400); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(-300, 1800, 1700, 6);
}
function pipe(t) {
  g.lineJoin = 'round'; g.lineCap = 'butt';
  g.beginPath(); pipePath(); g.strokeStyle = C.pipeD; g.lineWidth = 128; g.stroke();
  g.beginPath(); pipePath(); g.strokeStyle = C.pipe; g.lineWidth = 118; g.stroke();
  g.beginPath(); pipePath(); g.strokeStyle = C.air; g.lineWidth = 98; g.stroke();
  // trap water
  g.beginPath(); g.moveTo(460, 1600); g.lineTo(460, 1640); g.arc(560, 1640, 100, Math.PI, 0, true); g.lineTo(660, 1600);
  g.strokeStyle = t > 16.4 ? '#7FB4C6' : C.murkD; g.stroke();
  if (t < 15.6) { g.strokeStyle = C.murkD; line(460, 1236, 460, 1400); }
  if (t > 15.6 && t < 21.9) {
    const a = Math.min(seg(t, 15.6, 15.9), 1 - seg(t, 21.4, 21.9));
    g.globalAlpha = a; g.beginPath(); pipePath(); g.strokeStyle = '#7FB4C6'; g.lineWidth = 98; g.stroke();
    g.beginPath(); pipePath(); g.strokeStyle = C.clean; g.lineWidth = 14; g.setLineDash([46, 60]); g.lineDashOffset = -t * 700; g.stroke();
    g.setLineDash([]); g.globalAlpha = 1;
  }
  g.fillStyle = C.pipe; g.strokeStyle = C.pipeD; g.lineWidth = 4;
  rr(392, 1274, 136, 30, 7); g.fill(); g.stroke(); rr(392, 1566, 136, 30, 7); g.fill(); g.stroke(); rr(592, 1562, 136, 30, 7); g.fill(); g.stroke();
}
function bowl(t) {
  g.lineCap = 'butt';
  g.beginPath(); bowlPath(); g.strokeStyle = C.porcD; g.lineWidth = 38; g.stroke();
  g.beginPath(); bowlPath(); g.strokeStyle = C.porc; g.lineWidth = 30; g.stroke();
  const bg = g.createLinearGradient(0, 900, 0, 1250); bg.addColorStop(0, '#FCFAF4'); bg.addColorStop(1, '#E7E1D4');
  g.beginPath(); bowlPath(); g.closePath(); g.fillStyle = bg; g.fill();
  g.fillStyle = t < 15.6 ? C.murkD : C.air; g.fillRect(411, 1234, 98, 40);
  g.fillStyle = '#A9B4BA'; rr(396, 1243, 15, 12, 3); g.fill(); rr(509, 1243, 15, 12, 3); g.fill();
}
function water(t, wl) {
  if (wl > 1258) return;
  g.save(); g.beginPath(); bowlPath(); g.closePath(); g.clip();
  g.beginPath(); g.moveTo(60, wl); for (let x = 60; x <= 860; x += 20) g.lineTo(x, wl + 2.5 * Math.sin(x * .05 + t * 3));
  g.lineTo(860, 1300); g.lineTo(60, 1300); g.closePath();
  const wg = g.createLinearGradient(0, wl, 0, 1260); wg.addColorStop(0, C.murk); wg.addColorStop(1, C.murkD);
  g.globalAlpha = .86; g.fillStyle = wg; g.fill(); g.globalAlpha = 1;
  g.beginPath(); for (let x = 60; x <= 860; x += 20) g.lineTo(x, wl + 2.5 * Math.sin(x * .05 + t * 3));
  g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = 'rgba(70,80,50,.5)';
  [[170, 6, 5], [230, 3, 3], [560, 5, 6], [640, 2, 4], [720, 6, 3]].forEach(([x, dy, r]) => circle(x + 4 * Math.sin(t + x), wl + dy + 4, r));
  g.restore();
}
function counter() {
  for (const [x, w] of [[-300, 400], [820, 580]]) {
    g.fillStyle = C.wood; g.fillRect(x, 900, w, 56); g.fillStyle = C.woodL; g.fillRect(x, 900, w, 9); g.fillStyle = C.woodD; g.fillRect(x, 946, w, 10);
  }
  g.fillStyle = C.porc; rr(82, 890, 40, 16, 8); g.fill(); rr(798, 890, 40, 16, 8); g.fill();
}
function cup() {
  g.save(); g.translate(1024, 800); g.rotate(-.1);
  g.fillStyle = '#F4F4F0'; rr(-8, -330, 16, 340, 8); g.fill();
  g.fillStyle = '#F08A5D'; rr(-8, -150, 16, 90, 4); g.fill();
  g.fillStyle = '#8CCBEA'; rr(-34, -328, 28, 74, 6); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; for (let i = 0; i < 6; i++) line(-32, -318 + i * 11, -8, -318 + i * 11);
  g.restore();
  g.fillStyle = '#3E8E8A'; rr(978, 772, 90, 128, 10); g.fill();
  g.fillStyle = 'rgba(255,255,255,.25)'; rr(988, 782, 12, 104, 6); g.fill();
}
function faucet() {
  g.lineCap = 'butt'; g.lineJoin = 'round';
  const p = () => { g.beginPath(); g.moveTo(-40, 240); g.lineTo(396, 240); g.quadraticCurveTo(460, 240, 460, 304); g.lineTo(460, 326); };
  p(); g.strokeStyle = '#5E6A71'; g.lineWidth = 66; g.stroke();
  const fg = g.createLinearGradient(0, 208, 0, 272); fg.addColorStop(0, '#F3F7F9'); fg.addColorStop(.5, '#C4CED3'); fg.addColorStop(1, '#8F9CA3');
  p(); g.strokeStyle = fg; g.lineWidth = 56; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 6; g.lineCap = 'round'; line(20, 222, 380, 222);
  g.fillStyle = '#5E6A71'; rr(424, 322, 72, 18, 5); g.fill(); g.fillStyle = '#C4CED3'; rr(428, 324, 64, 12, 4); g.fill();
  g.fillStyle = '#5E6A71'; rr(-20, 180, 44, 120, 10); g.fill(); g.fillStyle = '#B4BFC5'; rr(-16, 184, 34, 112, 8); g.fill();
  g.fillStyle = '#5E6A71'; rr(150, 150, 36, 66, 8); g.fill(); g.fillStyle = '#C4CED3'; rr(154, 154, 28, 60, 6); g.fill();
  g.fillStyle = '#5E6A71'; rr(108, 128, 120, 30, 15); g.fill(); g.fillStyle = '#E3EAED'; rr(112, 132, 112, 22, 11); g.fill();
}

// ---------- characters
function clampHand(sx, sy, h) { const dx = h[0] - sx, dy = h[1] - sy, d = Math.hypot(dx, dy), m = 27; return d > m ? [sx + dx / d * m, sy + dy / d * m] : h; }
function handsOf(o) { return [clampHand(-9, -42, o.hands[0]), clampHand(9, -42, o.hands[1])]; }
function worker(o) {
  const f = o.face || 1, sp = o.split || 0; g.save(); g.translate(o.x, o.y - (o.jump || 0)); g.rotate(o.lean || 0); g.lineCap = 'round';
  g.strokeStyle = '#34425F'; g.lineWidth = 8.5; line(-5, -22, -6 - sp, -4); line(5, -22, 6 + sp, -4);
  g.fillStyle = '#5B3A24'; rr(-6 - sp - (f < 0 ? 8 : 5), -7, 15, 8, 3); g.fill(); rr(6 + sp - (f < 0 ? 9 : 6), -7, 15, 8, 3); g.fill();
  g.fillStyle = o.shirt; rr(-11.5, -48, 23, 28, 7); g.fill();
  g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(-11.5, -37, 23, 3.5);
  g.fillStyle = '#4A3220'; g.fillRect(-11.5, -25, 23, 5.5); rr(-f * 9 - 4, -25, 8, 10, 2); g.fill();
  g.fillStyle = o.skin; circle(0, -58, 11.5);
  g.fillStyle = C.ink; circle(f * 5, -59, 1.9);
  if (o.mouth === 'o') circle(f * 6, -52.5, 2.8); else { g.strokeStyle = C.ink; g.lineWidth = 1.6; g.beginPath(); g.arc(f * 5, -54.5, 3.4, .2, 2.6); g.stroke(); }
  g.fillStyle = o.hat; g.beginPath(); g.arc(0, -61, 13, Math.PI, 0); g.closePath(); g.fill(); rr(f > 0 ? -14 : -20, -63, 34, 5, 2.5); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2.2; g.beginPath(); g.arc(0, -61, 9, 3.6, 4.6); g.stroke();
  if (o.lamp != null) { g.fillStyle = o.lamp ? '#FFF6B0' : '#6B7378'; rr(f * 10 - 4, -70, 8, 7, 2); g.fill(); }
  const hs = handsOf(o);
  [[-9, -42], [9, -42]].forEach((s, i) => { g.strokeStyle = o.shirt; g.lineWidth = 7; line(s[0], s[1], hs[i][0], hs[i][1]); g.fillStyle = o.skin; circle(hs[i][0], hs[i][1], 4.4); });
  if (o.clip) { g.save(); g.translate(hs[1][0] + 3, hs[1][1] - 4); g.rotate(.15); g.fillStyle = '#8A5A33'; rr(-7, -10, 15, 19, 2); g.fill(); g.fillStyle = '#fff'; g.fillRect(-5, -6, 11, 13); g.restore(); }
  g.restore();
}

// ---------- the hairball
const hr = rng(11);
const strands = Array.from({ length: 90 }, () => { const p = () => [(hr() * 2 - 1) * 44, (hr() * 2 - 1) * 56]; return { a: p(), b: p(), c: p(), d: p(), w: 1.2 + hr() * 2.2, col: ['#2A1D16', '#3C2A1E', '#1C1512', '#4A3626', '#5F4A36'][hr() * 5 | 0] }; });
const tails = Array.from({ length: 7 }, (_, i) => ({ x: -34 + i * 11 + hr() * 6, len: 50 + hr() * 90, ph: hr() * 6 }));
const gunk = Array.from({ length: 9 }, () => ({ x: (hr() * 2 - 1) * 34, y: (hr() * 2 - 1) * 46, r: 5 + hr() * 9 }));
function clog(cx, cy, s, t, mood) {
  g.save(); g.translate(cx, cy); g.scale(s, s); g.rotate(.05 * Math.sin(t * 5)); g.lineCap = 'round';
  tails.forEach(k => { g.strokeStyle = '#2A1D16'; g.lineWidth = 2; g.beginPath(); g.moveTo(k.x, 40); g.quadraticCurveTo(k.x + 14 * Math.sin(t * 3 + k.ph), 40 + k.len * .5, k.x + 8 * Math.sin(t * 2.2 + k.ph), 40 + k.len); g.stroke(); });
  g.fillStyle = '#2F221A'; g.beginPath(); g.ellipse(0, 0, 45, 57, 0, 0, 6.2832); g.fill();
  g.fillStyle = 'rgba(122,134,78,.85)'; gunk.forEach(k => circle(k.x, k.y, k.r));
  strands.forEach(k => { g.strokeStyle = k.col; g.lineWidth = k.w; g.beginPath(); g.moveTo(k.a[0], k.a[1]); g.bezierCurveTo(k.b[0], k.b[1], k.c[0], k.c[1], k.d[0], k.d[1]); g.stroke(); });
  for (const sx of [-15, 15]) {
    if (mood === 'sleep') { g.strokeStyle = '#E9E2D2'; g.lineWidth = 2.6; g.beginPath(); g.arc(sx, -10, 7, .3, 2.84); g.stroke(); continue; }
    g.fillStyle = '#F4EFE2'; circle(sx, -10, 9);
    if (mood === 'dizzy') { g.strokeStyle = C.ink; g.lineWidth = 2.6; line(sx - 4, -14, sx + 4, -6); line(sx + 4, -14, sx - 4, -6); }
    else { g.fillStyle = C.ink; circle(sx + 1.5 * Math.sin(t * 9), -9, 3.8); g.strokeStyle = '#150F0C'; g.lineWidth = 4; line(sx - Math.sign(sx) * 10, -24, sx + Math.sign(sx) * -1 + Math.sign(sx) * 9 * -1 + Math.sign(sx) * 10, -17); }
  }
  g.restore();
}
function tool(ty, tw) {
  const O = '#F47B20', OD = '#B9530E', Y = '#FFD23F', WAND = '#F2A23A', FUZZ = '#F9CF86';
  g.lineCap = 'round'; g.lineJoin = 'round';
  // fuzzy flexible wand
  g.strokeStyle = FUZZ; g.lineWidth = 2.4;
  for (let i = 0; i < 56; i++) { const y = ty + 112 + i * 10; line(460 - 11, y - 4, 460 + 11, y + 4); line(460 - 11, y + 4, 460 + 11, y - 4); }
  g.strokeStyle = OD; g.lineWidth = 13; line(460, ty + 100, 460, ty + 668);
  g.strokeStyle = WAND; g.lineWidth = 9; line(460, ty + 100, 460, ty + 668);
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2.5; line(458, ty + 104, 458, ty + 664);
  // handle (turns with the twist)
  const c = Math.cos(tw), kx = (c >= 0 ? 1 : -1) * Math.max(.3, Math.abs(c));
  g.save(); g.translate(460, ty); g.scale(kx, 1);
  const hp = () => { g.beginPath(); g.moveTo(0, 62); g.lineTo(0, 18); g.lineTo(44, -18); };
  hp(); g.strokeStyle = OD; g.lineWidth = 36; g.stroke();
  hp(); g.strokeStyle = O; g.lineWidth = 29; g.stroke();
  g.strokeStyle = OD; g.lineWidth = 3.5; g.lineCap = 'butt';
  for (let i = 0; i < 4; i++) { const u = .25 + i * .2, x = 44 * u, y = 18 - 36 * u; line(x - 9, y - 11, x + 9, y + 11); }
  g.lineCap = 'round'; g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 4; line(-8, 24, -8, 54);
  g.fillStyle = OD; rr(-22, 54, 44, 56, 9); g.fill();
  g.fillStyle = Y; rr(-19, 57, 38, 50, 7); g.fill();
  g.fillStyle = 'rgba(255,255,255,.5)'; rr(-13, 61, 7, 42, 3.5); g.fill();
  g.restore();
  g.strokeStyle = '#6F7A80'; g.lineWidth = 4; g.beginPath(); g.arc(460, ty + 2, 8, 0, 6.2832); g.stroke();
}
function toolOld(ty, tw) {
  g.lineCap = 'round';
  g.strokeStyle = '#6F7A80'; g.lineWidth = 12; line(460, ty + 100, 460, ty + 668);
  g.strokeStyle = '#EEF2F4'; g.lineWidth = 7; line(460, ty + 100, 460, ty + 668);
  g.strokeStyle = '#6F7A80'; g.lineWidth = 3.2;
  for (let i = 0; i < 20; i++) { const y = ty + 660 - i * 12, s = ((i & 1) ? 1 : -1) * (Math.cos(tw) >= 0 ? 1 : -1); line(460, y, 460 + s * 12, y - 8); }
  const k = .4 + .6 * Math.abs(Math.cos(tw));
  g.fillStyle = '#B5301F'; rr(460 - 23, ty + 28, 46, 84, 13); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; for (let i = 0; i < 4; i++) line(446, ty + 58 + i * 12, 474, ty + 58 + i * 12);
  g.fillStyle = C.red; rr(460 - 66 * k, ty + 8, 132 * k, 36, 16); g.fill();
  g.fillStyle = 'rgba(255,255,255,.35)'; rr(460 - 52 * k, ty + 13, 104 * k, 7, 3.5); g.fill();
  g.strokeStyle = '#6F7A80'; g.lineWidth = 4; g.beginPath(); g.arc(460, ty + 2, 8, 0, 6.2832); g.stroke();
}

// ---------- floaters that ride the drain
const PP = (() => { const p = []; for (let y = 1240; y <= 1640; y += 10) p.push([460, y]); for (let a = Math.PI; a >= 0; a -= .1) p.push([560 + 100 * Math.cos(a), 1640 + 100 * Math.sin(a)]); for (let y = 1640; y >= 1570; y -= 10) p.push([660, y]); for (let u = 0; u <= 1.001; u += .1) { const v = 1 - u; p.push([v * v * 660 + 2 * v * u * 660 + u * u * 730, v * v * 1570 + 2 * v * u * 1500 + u * u * 1500]); } for (let x = 740; x <= 1200; x += 10) p.push([x, 1500]); const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return { p, L, len: L[L.length - 1] }; })();
function pathAt(d) { const { p, L } = PP; let i = 1; while (i < L.length - 1 && L[i] < d) i++; const u = clamp((d - L[i - 1]) / (L[i] - L[i - 1] || 1)); return [lerp(p[i - 1][0], p[i][0], u), lerp(p[i - 1][1], p[i][1], u)]; }
const ITEMS = [{ k: 'paste', x: 530, o: 0 }, { k: 'glob', x: 600, o: 1 }, { k: 'bubble', x: 670, o: 2 }, { k: 'bead', x: 235, o: 3 }, { k: 'fuzz', x: 745, o: 4 }, { k: 'nail', x: 170, o: 5 }];
function face(mood, col) {
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2; g.lineCap = 'round';
  if (mood === 'bored') { circle(-5, -2, 2); circle(5, -2, 2); line(-8, -5.5, -2, -5); line(2, -5, 8, -5.5); line(-3, 6, 3, 6); }
  else if (mood === 'shock') { g.strokeStyle = C.ink; g.lineWidth = 1; for (const sx of [-5, 5]) { g.fillStyle = '#fff'; circle(sx, -3, 4.2); g.stroke(); g.fillStyle = C.ink; circle(sx, -3, 2); } g.fillStyle = col; circle(0, 6, 3.2); }
  else { for (const sx of [-5, 5]) { g.beginPath(); g.arc(sx, -2, 3, Math.PI, 0); g.stroke(); } g.fillStyle = col === C.ink ? '#7A1F1F' : '#FF8A7A'; g.beginPath(); g.arc(0, 3, 5.5, 0, Math.PI); g.closePath(); g.fill(); }
}
function item(k, x, y, r, mood, sc) {
  g.save(); g.translate(x, y); g.rotate(r); g.scale(sc, sc); g.lineCap = 'round'; let col = C.ink;
  if (k === 'paste') { g.fillStyle = '#FDFDFB'; g.strokeStyle = '#8FA9A3'; g.lineWidth = 2; circle(9, -12, 9); g.stroke(); circle(0, 0, 17); g.stroke(); circle(9, -12, 8); g.strokeStyle = '#3EC1B0'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 12, 2.2, 3.6); g.stroke(); g.beginPath(); g.arc(0, 0, 12, 5.6, 6.6); g.stroke(); }
  else if (k === 'glob') { g.fillStyle = '#8DB33A'; g.beginPath(); g.ellipse(0, 0, 20, 16, 0, 0, 6.2832); g.fill(); circle(-12, 12, 6); circle(11, 13, 4.5); circle(14, -9, 5); g.fillStyle = 'rgba(255,255,255,.35)'; circle(-8, -8, 4); }
  else if (k === 'bubble') { g.fillStyle = 'rgba(205,236,255,.5)'; circle(0, 0, 18); g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.stroke(); g.beginPath(); g.arc(0, 0, 13, 3.5, 4.5); g.stroke(); }
  else if (k === 'bead') { g.fillStyle = '#2C5DB0'; circle(0, 0, 16); g.fillStyle = '#3E7BD9'; circle(0, 0, 13.5); g.fillStyle = 'rgba(255,255,255,.45)'; circle(-6, -8, 3.5); col = '#fff'; }
  else if (k === 'fuzz') { g.strokeStyle = '#2A1D16'; g.lineWidth = 2; for (let i = 0; i < 14; i++) { const a = i * .449; line(0, 0, 21 * Math.cos(a), 21 * Math.sin(a)); } g.fillStyle = '#3C2A1E'; circle(0, 0, 15); col = '#F4EFE2'; }
  else { g.strokeStyle = '#B9AC7C'; g.lineWidth = 14; g.beginPath(); g.arc(0, -4, 17, .35, 2.79); g.stroke(); g.strokeStyle = '#EFE5BF'; g.lineWidth = 11; g.beginPath(); g.arc(0, -4, 17, .35, 2.79); g.stroke(); g.translate(0, 12.5); g.scale(.62, .62); }
  face(mood, col); g.restore();
}
const BW = (() => { const a = []; for (let i = 0; i <= 200; i++) { const u = i / 200, v = 1 - u; a.push([v * v * v * 900 + 3 * v * v * u * 1150 + 3 * v * u * u * 1250 + u * u * u * 1250, v * v * v * 100 + 3 * v * v * u * 100 + 3 * v * u * u * 250 + u * u * u * 405]); } return a; })();
function halfW(y) { for (const [by, bx] of BW) if (by >= y) return 460 - bx; return 55; }
function wlAt(t) { return lerp(1040, 1264, Math.pow(seg(t, 15.6, 19), 1.5)); }
const HOME = { paste: [560, 70], glob: [620, 140], bubble: [690, 28], bead: [300, 120], fuzz: [715, 55], nail: [190, 40] };
function itemState(it, i, t, wl) {
  const ts = 15.9 + it.o * .5, [hx, hd] = HOME[it.k];
  let y = Math.min(Math.max(1040 + hd + 13 * Math.sin(t * .7 + i * 1.3), wl + 24), 1236);
  const lim = Math.max(0, halfW(y + 20) - 28); let x = clamp(hx + 24 * Math.sin(t * .45 + i * 2.1), 460 - lim, 460 + lim);
  let r = .25 * Math.sin(t * .9 + i), mood = t < 15.6 ? 'bored' : 'shock', sc = 1, gone = false;
  if (t >= ts + .35) { const d = (t - ts - .35) / 2.6 * PP.len; gone = d > PP.len; [x, y] = pathAt(Math.min(d, PP.len)); mood = 'whee'; r = .35 * Math.sin(t * 6 + i); sc = 1.3; }
  else if (t >= ts) { const u = ease((t - ts) / .35); x = lerp(x, 460, u); y = lerp(y, 1240, u); r = u * 3; sc = 1 + .3 * u; }
  return { x, y, r, mood, sc, gone };
}
function drawItems(t, wl) { ITEMS.forEach((it, i) => { const q = itemState(it, i, t, wl); if (!q.gone) item(it.k, q.x, q.y, q.r, q.mood, q.sc); }); }
function drawItemsOld(t, wl) {
  const shrink = lerp(1, .18, seg(wl, 1040, 1250));
  ITEMS.forEach((it, i) => {
    const ts = 15.85 + it.o * .22, fx = 460 + (it.x - 460) * shrink, fy = wl - 5 + 3 * Math.sin(t * 2.3 + i * 1.7);
    let x = fx, y = fy, r = .12 * Math.sin(t * 1.6 + i), mood = t < 15.6 ? 'bored' : 'shock', sc = 1;
    if (t >= ts + .3) { const d = (t - ts - .3) / 1.15 * PP.len; if (d > PP.len) return; [x, y] = pathAt(d); mood = 'whee'; r = .5 * Math.sin(t * 12 + i); sc = 1.3; }
    else if (t >= ts) { const u = ease((t - ts) / .3); x = lerp(fx, 460, u); y = lerp(fy, 1240, u); r = u * 3; sc = 1 + .3 * u; }
    item(it.k, x, y, r, mood, sc);
  });
}

// ---------- overlays
const cr = rng(5);
const confetti = Array.from({ length: 80 }, () => ({ x: cr() * 1080, y: -80 - cr() * 900, v: 520 + cr() * 420, ph: cr() * 6, w: 14 + cr() * 14, col: [C.yellow, C.red, '#3E8E8A', '#fff', '#F08A5D'][cr() * 5 | 0] }));
function card(t) {
  const u = t - 9.5;
  g.fillStyle = C.yellow; g.fillRect(0, 0, W, H);
  g.save(); g.translate(540, 1000); g.rotate(u * .25); g.fillStyle = '#F7B500';
  for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1700, i * .5236, i * .5236 + .2618); g.closePath(); g.fill(); }
  g.restore();
  const s = outBack(seg(u, 0, .28));
  g.save(); g.translate(540, 1180); g.rotate(.5 + .04 * Math.sin(u * 9)); g.scale(1.9 * s, 1.9 * s); g.translate(-460, -335);
  g.save(); g.translate(8, 10); g.globalAlpha = .18; tool(0, 0); g.restore(); tool(0, 0); g.restore();
  g.save(); g.translate(540, 300); g.rotate(-.04); g.scale(s, s); txt('THE $20', 0, 0, 170, '#fff'); txt('FIX', 0, 210, 250, C.red); g.restore();
  const s2 = outBack(seg(u, .2, .45));
  g.save(); g.translate(720, 1570); g.rotate(-.04); g.scale(s2, s2); g.fillStyle = C.ink; rr(-290, -52, 580, 104, 52); g.fill();
  g.font = `800 52px ${BODY}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('hair-clog drain tool', 0, 3); g.restore();
}

// ---------- main
function draw(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  if (t >= 9.5 && t < 10.5) { card(t); return; }
  let [cx, cy, s] = t < 9.5
    ? kf([[0, 540, 960, 1], [3.2, 540, 990, 1.12], [4, 380, 965, 2.3], [4.8, 380, 965, 2.3], [5.6, 460, 1390, 2.3], [6.2, 460, 1390, 2.4], [6.9, 380, 965, 2.4], [9.5, 375, 960, 2.55]], t)
    : kf([[10.5, 540, 835, 1.15], [11.2, 540, 835, 1.15], [13.5, 520, 1150, 1.5], [14.6, 520, 1200, 1.6], [16.2, 500, 1300, 1.6], [19.4, 540, 1010, 1.1], [25.5, 540, 1010, 1.15]], t);
  { const w = ease(seg(t, 16.2, 16.7)) * (1 - ease(seg(t, 18.2, 19))); if (w > 0) { const q = itemState(ITEMS[0], 0, t, wlAt(t)); cx = lerp(cx, q.x, w); cy = lerp(cy, q.y, w); s = lerp(s, 2.6, w); } }
  cx = clamp(cx, 540 / s, 1080 - 540 / s); cy = clamp(cy, 960 / s, 2100 - 960 / s);
  g.translate(540, 960); g.scale(s, s); g.translate(-cx, -cy);

  // state
  const wl = wlAt(t);
  const floating = wl - 10 < 1213;
  const R = { x: 360, top: Math.min(wl - 10 + (floating ? 3 * Math.sin(2.1 * t) : 0), 1213), tilt: 0 };
  R.tilt = (floating ? .03 * Math.sin(1.7 * t) : .08) + (t >= 7.7 && t < 8.5 ? .07 * seg(t, 7.7, 8.5) : 0) + (t >= 8.5 && t < 9.5 ? .13 * Math.exp(-3 * (t - 8.5)) * Math.sin(14 * (t - 8.5)) : 0);
  const raftW = (x, y) => { const [a, b] = rot(x, y, R.tilt); return [R.x + a, R.top + b]; };
  const cheer = t > 16.9, hop = ph => cheer ? 18 * Math.abs(Math.sin((t - 16.9) * 6 + ph)) : 0;
  const up = [[-17, -80], [17, -80]];
  const toolOn = t >= 10.5;
  let [ty] = kf([[10.5, 380], [11.2, 380], [13.5, 800], [14.6, 800], [16.6, 380]], t);
  const twisting = t > 13.5 && t < 14.6; if (twisting) ty += 5 * Math.sin(t * 40);
  const tw = twisting ? (t - 13.5) * 14 : 0;

  // crew
  const lou = { x: 55, y: 0, face: 1, hat: '#F2792B', shirt: '#3A7CA5', skin: '#B9794F', lean: 0, hands: [[-13, -24], [13, -24]], lamp: false };
  if (t < 9.5) {
    lou.lean = kf([[4, 0], [4.3, .4], [6.9, .4], [7.05, -.3], [7.35, 0], [7.6, .3], [7.75, .1], [8.5, -.55]], t)[0];
    if (t > 8.5) lou.lean = lerp(-.55, -1.5, Math.pow(seg(t, 8.5, 8.72), 2));
    lou.lamp = t > 4.3 && t < 7;
    if (t > 4.2 && t < 6.9) lou.hands = [[-6, -19], [11, -19]];
    if (t >= 6.9 && t < 7.4) { lou.hands = [[-18, -62], [18, -62]]; lou.mouth = 'o'; }
    if (t >= 7.45 && t < 7.75) lou.hands = [[16, -22], [22, -20]];
    if (t >= 7.75 && t < 8.5) lou.hands = [[14, -34], [20, -32]];
    if (t >= 8.5) { lou.hands = [[-20, -60], [20, -62]]; lou.mouth = 'o'; lou.split = 5; }
  } else {
    lou.hands = [[20, -34], [26, -30]];
    if (t > 15.6 && !cheer) { lou.lean = -.25 * seg(t, 15.6, 15.9); lou.hands = [[4, -52], [12, -52]]; lou.mouth = 'o'; }
    if (cheer) { lou.hands = up; lou.jump = hop(0); }
  }
  const bea = { x: -52, y: 0, face: 1, hat: '#2F6DB5', shirt: '#D9534F', skin: '#F0C7A0', lean: 0, hands: [[-13, -24], [13, -32]], clip: true };
  if (t > 8.55 && t < 9.5) { bea.jump = 22 * Math.sin(Math.PI * seg(t, 8.55, 8.95)); bea.hands = [[-22, -60], [22, -60]]; bea.mouth = 'o'; bea.clip = false; }
  if (t >= 10.5 && t < 16.9) { bea.hands = [[-13, -24], [16, -68]]; bea.clip = false; }
  if (cheer) { bea.hands = up; bea.jump = hop(1.2); bea.clip = false; }
  const crank = ty * .06, drum = [872, 858], knob = [drum[0] + 19 * Math.cos(crank), drum[1] + 19 * Math.sin(crank)];
  const sal = { x: 935, y: 900, face: -1, hat: C.yellow, shirt: '#4E8F4A', skin: '#7A4E32', lean: 0, hands: [[-13, -24], [13, -24]] };
  if (t < 3.2) sal.hands = [[-13, -24], [16, -70 + 5 * Math.sin(t * 12)]];
  if (toolOn && !cheer) { sal.hands = [[knob[0] - 935, knob[1] - 900], [knob[0] - 935 + 4, knob[1] - 900 + 3]]; sal.lean = -.12; }
  if (cheer) { sal.hands = up; sal.jump = hop(2.3); }
  const louPt = (hx, hy) => { const [a, b] = rot(hx, hy, lou.lean); return raftW(lou.x + a, b - (lou.jump || 0)); };

  // world
  wall(); cabinet(); pipe(t); bowl(t);
  g.save(); g.translate(R.x, R.top); g.rotate(R.tilt);
  g.fillStyle = '#F3BFCF'; rr(-80, 0, 160, 34, 12); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; rr(-70, 4, 140, 6, 3); g.fill();
  g.fillStyle = 'rgba(170,90,120,.5)'; g.font = `900 15px ${BODY}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('S O A P', 0, 21);
  worker(bea); worker(lou); g.restore();
  water(t, wl);

  // headlamp beam
  if (lou.lamp) {
    const [hx, hy] = louPt(12, -64), a = seg(t, 4.3, 4.45) * .5;
    const bgd = g.createLinearGradient(hx, hy, 460, 1420); bgd.addColorStop(0, `rgba(255,244,160,${a})`); bgd.addColorStop(1, 'rgba(255,244,160,.12)');
    g.fillStyle = bgd; g.beginPath(); g.moveTo(hx, hy); g.lineTo(412, 1250); g.lineTo(412, 1470); g.lineTo(508, 1470); g.lineTo(508, 1250); g.closePath(); g.fill();
  }
  // loose strand Lou pulls on
  if (t < 8.7) {
    const hw = handsOf(lou)[1], hand = louPt(hw[0], hw[1]);
    const free = [448 + 5 * Math.sin(t * 2), wl - 3], att = ease(seg(t, 7.45, 7.7));
    const end = [lerp(free[0], hand[0], att), lerp(free[1], hand[1], att)], taut = seg(t, 7.7, 8.4), vib = taut * 3 * Math.sin(t * 70);
    g.strokeStyle = '#2A1D16'; g.lineWidth = 3; g.lineCap = 'round';
    if (t < 8.5) { g.beginPath(); g.moveTo(455, 1392); g.bezierCurveTo(lerp(490, 453, taut) + vib, 1290, lerp(425, 448, taut) - vib, 1150, end[0], end[1]); g.stroke(); }
    else { const u = seg(t, 8.5, 8.7); line(455, 1392, 455, lerp(1150, 1392, u)); line(hand[0], hand[1], hand[0] + 6, hand[1] + 26); }
  }
  // hairball + tool
  const cyc = t < 14.6 ? 1440 + (twisting ? 4 * Math.sin(t * 40) : 0) : ty + 640;
  const mood = t < 5.7 ? 'sleep' : t < 14.6 ? 'angry' : 'dizzy';
  const sway = t > 16.6 ? .03 * Math.sin(3 * (t - 16.6)) * seg(t, 16.6, 17.2) : 0;
  if (t > 5.2 && t < 7) { const gl = g.createRadialGradient(460, 1430, 10, 460, 1430, 120); gl.addColorStop(0, 'rgba(255,244,160,.35)'); gl.addColorStop(1, 'rgba(255,244,160,0)'); g.fillStyle = gl; g.fillRect(340, 1310, 240, 240); }
  g.save(); g.translate(460, 362); g.rotate(sway); g.translate(-460, -362);
  if (toolOn) tool(ty, tw);
  clog(460, cyc, 1 + .45 * seg(1250 - cyc, 0, 110), t, mood);
  if (t > 15.9 && t < 26) { g.strokeStyle = 'rgba(120,150,60,.75)'; g.lineWidth = 4; g.lineCap = 'round'; for (let i = -1; i <= 1; i++) { g.beginPath(); for (let k = 0; k <= 8; k++) { const y = cyc - 95 - k * 9; g.lineTo(460 + i * 34 + 7 * Math.sin(k * .9 + t * 6 + i), y); } g.stroke(); } }
  g.restore();
  // swirl while draining
  if (t > 15.7 && t < 19.1) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3; for (let i = 0; i < 3; i++) { const a0 = t * 9 + i * 2.1; g.beginPath(); g.ellipse(460, Math.min(wl + 4, 1250), 30 + i * 22, 5 + i * 3, 0, a0, a0 + 1.8); g.stroke(); } }

  drawItems(t, wl);
  counter(); cup();
  if (toolOn) {
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [c, w] of [['#6E5630', 6], [C.rope, 3.4]]) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(drum[0], drum[1]); g.lineTo(471, 356); g.lineTo(460, 374); const tp = rot(0, ty + 2 - 362, sway); g.lineTo(460 + tp[0], 362 + tp[1]); g.stroke(); }
    g.strokeStyle = '#59636B'; g.lineWidth = 7; line(848, 900, drum[0], drum[1]); line(896, 900, drum[0], drum[1]);
    g.fillStyle = '#8A949A'; circle(drum[0], drum[1], 17); g.fillStyle = C.rope; circle(drum[0], drum[1], 11);
    g.strokeStyle = '#3A4248'; g.lineWidth = 5; line(drum[0], drum[1], knob[0], knob[1]); g.fillStyle = C.red; circle(knob[0], knob[1], 5);
  }
  worker(sal);
  faucet();
  if (toolOn) { g.strokeStyle = '#3A4248'; g.lineWidth = 4; line(460, 338, 460, 352); g.fillStyle = '#59636B'; circle(460, 362, 13); g.fillStyle = '#C4CED3'; circle(460, 362, 5); }
  // drip
  if (t < 9.5) {
    const p = (t + .5) % 1.6; g.fillStyle = '#A9D6EA';
    if (p < .6) circle(460, 342 + 4 * p, 2 + 7 * p / .6);
    else if (p < 1.1) { const u = (p - .6) / .5, y = 348 + (wl - 348) * u * u; g.beginPath(); g.ellipse(460, y, 7, 11, 0, 0, 6.2832); g.fill(); }
    else { const u = (p - 1.1) / .5; g.strokeStyle = `rgba(255,255,255,${.8 * (1 - u)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(460, wl, 12 + 46 * u, 3 + 7 * u, 0, 0, 6.2832); g.stroke(); }
  }
  // splash when Lou lands
  if (t > 8.7 && t < 9.3) { const u = (t - 8.7) / .6; g.fillStyle = '#C5D8C4'; for (let i = 0; i < 10; i++) { const side = i & 1 ? 1 : -1, vx = side * (30 + i * 9), x = R.x + side * 84 + vx * u, y = wl - (150 + i * 14) * u + 330 * u * u; circle(x, y, 5 * (1 - u) + 1.5); } }
  // "!" and stars
  if (t > 6.92 && t < 7.4) { const [hx, hy] = louPt(0, -92); g.save(); g.translate(hx, hy); g.scale(outBack(seg(t, 6.92, 7.05)), outBack(seg(t, 6.92, 7.05))); txt('!', 0, 0, 44, C.yellow); g.restore(); }
  if (t > 8.8 && t < 9.5) { const [hx, hy] = louPt(0, -62); g.fillStyle = C.yellow; for (let i = 0; i < 3; i++) { const a = t * 7 + i * 2.094; circle(hx + 22 * Math.cos(a), hy - 22 + 7 * Math.sin(a), 4.5); } }
  // sparkle on the clear drain
  if (t > 19.2) { const k = .6 + .4 * Math.sin(t * 8); g.fillStyle = '#fff'; for (const [x, y, r] of [[520, 1225, 13], [395, 1205, 9]]) { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * .7854, rad = (i & 1 ? r * .3 : r) * k; g.lineTo(x + rad * Math.cos(a), y + rad * Math.sin(a)); } g.closePath(); g.fill(); } }

  // ---------- screen space
  g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createRadialGradient(540, 960, 600, 540, 960, 1150); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,5,.34)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  if (t > 19.2) confetti.forEach(k => { const y = k.y + k.v * (t - 19.2); if (y < -40 || y > H + 40) return; g.save(); g.translate(k.x + 40 * Math.sin(t * 2 + k.ph), y); g.rotate(t * 5 + k.ph); g.fillStyle = k.col; g.fillRect(-k.w / 2, -5, k.w, 10 * Math.cos(t * 7 + k.ph)); g.restore(); });
  cap(t, .3, 2.95, ['TINY CREW', 'vs. THE HAIRBALL'], 520, 132, ['#fff', C.yellow]);
  cap(t, 4.2, 6.6, ["SINK WON'T DRAIN?"], 400, 84, '#fff');
  cap(t, 7.6, 9.45, ["IT'S HAIR.", "IT'S ALWAYS HAIR."], 360, 84, ['#fff', C.yellow]);
  cap(t, 11.3, 13.35, ['LOWER IT IN…'], 400, 88, '#fff');
  cap(t, 13.5, 14.55, ['TWIST…'], 400, 96, '#fff');
  cap(t, 14.8, 16.6, ['…AND PULL!'], 400, 104, C.yellow);
  cap(t, 16.7, 18.3, ['WHEEE!'], 330, 130, C.yellow);
  cap(t, 19.3, 21.4, ['TEN SECONDS.', 'NO CHEMICALS.'], 380, 88, ['#fff', C.yellow]);
  if (t > 21.6) {
    const u = outBack(seg(t, 21.6, 21.9));
    g.save(); g.translate(540, 1400); g.scale(u, u); g.rotate(-.02);
    g.fillStyle = 'rgba(29,26,22,.94)'; rr(-450, -120, 900, 240, 36); g.fill(); g.strokeStyle = C.yellow; g.lineWidth = 6; rr(-436, -106, 872, 212, 26); g.stroke();
    txt('REAL FIX', 0, -44, 100, C.yellow); txt('LINK IN BIO', -40, 54, 70, '#fff', DISP, 700);
    const by = 54 + 9 * Math.sin(t * 7); g.fillStyle = C.yellow; g.beginPath(); g.moveTo(290, by - 30); g.lineTo(330, by - 30); g.lineTo(330, by); g.lineTo(352, by); g.lineTo(310, by + 34); g.lineTo(268, by); g.lineTo(290, by); g.closePath(); g.fill();
    g.restore();
    g.globalAlpha = seg(t, 21.9, 22.2); g.font = `800 38px ${BODY}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.strokeStyle = C.ink; g.lineWidth = 8;
    g.strokeText('#affiliate  ·  AI-made animation', 540, 1566); g.fillStyle = '#fff'; g.fillText('#affiliate  ·  AI-made animation', 540, 1566); g.globalAlpha = 1;
  }
}
window.draw = draw;
