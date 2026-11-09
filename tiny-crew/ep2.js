// Episode 2: The Sock Heist. Loads after film.js and reuses its helpers (worker, cap, txt, kf, ...).
const E = { wall: '#D8CFE6', wallD: '#C6BBD8', base: '#F5F2EC', floor: '#B98552', floorD: '#99683A', body: '#F4F2EC', panel: '#E1DED6', ring: '#B8BEC4', ringD: '#8A939B', drum: '#2E323B', drumB: '#434957', towel: '#5B8FD9', towelD: '#3F6FB8', elfT: '#7B4BB7', elfH: '#3FA35B', elfS: '#E9C9A0', red: '#E5432E', blue: '#3E7BD9' };
const DCX = 460, DCY = 880, PILE = 1060, BAG = { x: 335, y: 930, w: 250, h: 130 };
window.SCENES = [['ep2-s1', 0, 267], ['ep2-s2', 267, 303], ['ep2-s3', 303, 735]];
function at2(x, y, s, fn) { g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round'; g.lineJoin = 'round'; fn(); g.restore(); }
function pth(keys, t) {
  if (t < keys[0][0] || t > keys[keys.length - 1][0]) return null;
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i], u = (t - a[0]) / ((b[0] - a[0]) || 1); return { x: lerp(a[1], b[1], u), y: lerp(a[2], b[2], u), dx: b[1] - a[1], mv: b[1] !== a[1] || b[2] !== a[2], climb: a[1] === b[1] && a[2] !== b[2] }; }
  return null;
}
const A1 = [[3.0, 985, 1560], [4.4, 722, 1560], [4.5, 705, 1560], [5.6, 705, 1140], [6.0, 668, 1072], [6.3, 560, 1060], [7.1, 560, 1060], [7.5, 668, 1072], [7.7, 705, 1140], [8.3, 705, 1560], [8.4, 722, 1560], [8.85, 985, 1560]];
const B1 = [[3.3, 985, 1560], [4.7, 722, 1560], [4.8, 705, 1560], [5.9, 705, 1140], [6.3, 668, 1072], [6.55, 612, 1060], [7.0, 612, 1060], [7.25, 668, 1072], [7.45, 705, 1140], [8.05, 705, 1560], [8.15, 722, 1560], [8.6, 985, 1560]];
const A2 = [[13.6, 985, 1560], [14.3, 722, 1560], [14.4, 705, 1560], [14.95, 705, 1140], [15.15, 668, 1072], [15.3, 606, 1060], [16.9, 606, 1060], [17.15, 668, 1072], [17.3, 705, 1140], [17.8, 705, 1560], [17.9, 722, 1560], [18.3, 985, 1560]];
const B2 = [[13.8, 985, 1560], [14.5, 722, 1560], [14.6, 705, 1560], [15.15, 705, 1140], [15.35, 668, 1072], [15.5, 612, 1060], [15.8, 556, 930], [16.9, 556, 930], [17.1, 622, 1060], [17.3, 668, 1072], [17.45, 705, 1140], [17.95, 705, 1560], [18.05, 722, 1560], [18.45, 985, 1560]];

function elfHat(f) {
  g.fillStyle = E.elfH; g.beginPath(); g.moveTo(-13, -63); g.lineTo(13, -63); g.quadraticCurveTo(6, -88, -f * 14, -96); g.quadraticCurveTo(-6, -80, -13, -63); g.fill();
  g.fillStyle = '#F4F4F0'; circle(-f * 14, -96, 4.5); rr(-14, -67, 28, 6, 3); g.fill();
}
function elf(o) {
  at2(o.x, o.y - (o.jump || 0), 1.25, () => {
    const f = o.f || 1, sw = o.walk ? 5 * Math.sin(o.walk) : 0; g.globalAlpha = o.a == null ? 1 : o.a; g.rotate(o.lean || 0);
    g.strokeStyle = '#2E6B3F'; g.lineWidth = 8; line(-5, -22, -6 - sw, -5); line(5, -22, 6 + sw, -5);
    g.fillStyle = '#7A3E1D'; for (const sx of [-6 - sw, 6 + sw]) { g.beginPath(); g.ellipse(sx + f * 3, -3, 9, 4.5, 0, 0, 6.2832); g.fill(); circle(sx + f * 12, -7, 2.6); }
    g.fillStyle = E.elfT; rr(-12, -48, 24, 28, 7); g.fill(); g.fillStyle = '#F2C94C'; g.fillRect(-12, -27, 24, 4);
    const hs = o.up ? [[-11, -78], [11, -78]] : o.pull ? [[f * 20, -42], [f * 23, -35]] : [[-f * 15, -30 + sw * .6], [f * 16, -30 - sw * .6]];
    g.strokeStyle = E.elfT; g.lineWidth = 7; line(-9, -42, hs[0][0], hs[0][1]); line(9, -42, hs[1][0], hs[1][1]); g.fillStyle = E.elfS; circle(hs[0][0], hs[0][1], 4.4); circle(hs[1][0], hs[1][1], 4.4);
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 8, -63); g.lineTo(sd * 23, -67); g.lineTo(sd * 10, -53); g.closePath(); g.fill(); }
    circle(0, -58, 11.5);
    if (o.shock) { g.fillStyle = '#fff'; circle(f * 5, -59, 4.2); g.fillStyle = C.ink; circle(f * 5, -59, 2); circle(f * 6, -51.5, 2.8); }
    else { g.fillStyle = C.ink; circle(f * 5, -59, 1.9); g.strokeStyle = C.ink; g.lineWidth = 1.8; line(f * 1, -64.5, f * 8.5, -62.5); g.beginPath(); g.arc(f * 4, -55.5, 5, f > 0 ? .1 : .94, f > 0 ? 2.2 : 3.04); g.stroke(); }
    if (!o.nohat) elfHat(f);
  });
}
function sock(o) {
  at2(o.x, o.y, o.s || 1, () => {
    g.rotate(o.r || 0); g.strokeStyle = '#B4AE9F'; g.lineWidth = 2; g.fillStyle = '#F6F4EE';
    rr(-16, -26, 60, 26, 13); g.fill(); g.stroke(); rr(-16, -74, 32, 66, 10); g.fill(); g.stroke(); g.fillRect(-14, -24, 40, 22);
    g.fillStyle = o.col; rr(-16, -74, 32, 12, 6); g.fill(); g.fillRect(-15, -56, 30, 6); g.fillRect(-15, -45, 30, 6); rr(27, -25, 16, 24, 11); g.fill();
    g.translate(0, -22); const m = o.mood; g.fillStyle = C.ink; g.strokeStyle = C.ink; g.lineWidth = 2;
    if (m === 'shock') { for (const sx of [-6, 6]) { g.fillStyle = '#fff'; circle(sx, -5, 4.4); g.lineWidth = 1; g.stroke(); g.fillStyle = C.ink; circle(sx, -5, 2); } circle(0, 6, 3.2); }
    else if (m === 'smug') { for (const sx of [-6, 6]) { g.beginPath(); g.arc(sx, -4, 3, Math.PI, 0); g.stroke(); } g.fillStyle = '#7A1F1F'; g.beginPath(); g.arc(0, 2, 5.5, 0, Math.PI); g.closePath(); g.fill(); }
    else if (m === 'sad') { circle(-6, -5, 2); circle(6, -5, 2); line(-10, -10, -3, -8.5); line(10, -10, 3, -8.5); g.beginPath(); g.arc(0, 9, 5, Math.PI + .5, -.5); g.stroke(); g.fillStyle = '#6FC3F0'; g.beginPath(); g.ellipse(-8, 3 + (o.tear || 0), 2.4, 3.6, 0, 0, 6.2832); g.fill(); }
    else { circle(-6, -5, 2); circle(6, -5, 2); g.beginPath(); g.arc(0, 0, 5.5, .35, 2.79); g.stroke(); }
  });
}
function bag(zip, wob, mood, withRed) {
  const { x, y, w, h } = BAG; g.save(); g.translate(x + w / 2, y + h); g.rotate(wob); g.translate(-(x + w / 2), -(y + h));
  sock({ x: x + 52, y: y + h - 8, s: .95, mood, col: E.blue }); sock({ x: x + 112, y: y + h - 8, s: .95, mood, col: E.blue });
  if (withRed) sock({ x: x + 180, y: y + h - 8, s: .95, mood, col: E.red });
  g.save(); rr(x, y, w, h, 24); g.fillStyle = 'rgba(255,255,255,.34)'; g.fill(); g.clip();
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.3; for (let i = -h; i < w + h; i += 13) { line(x + i, y, x + i + h, y + h); line(x + i + h, y, x + i, y + h); }
  g.restore(); g.strokeStyle = '#ECE9E1'; g.lineWidth = 6; rr(x, y, w, h, 24); g.stroke();
  const tx = x + 18 + (w - 36) * zip, ty = y + 16;
  g.strokeStyle = 'rgba(60,64,72,.35)'; g.lineWidth = 3; g.lineCap = 'round'; line(x + 18, ty, x + w - 18, ty);
  g.strokeStyle = '#6E737C'; g.lineWidth = 7; g.setLineDash([3, 5]); g.lineCap = 'butt'; line(x + 18, ty, tx, ty); g.setLineDash([]);
  g.fillStyle = '#F2C94C'; g.strokeStyle = '#B58E1E'; g.lineWidth = 2; rr(tx - 7, ty - 11, 14, 22, 4); g.fill(); g.stroke(); g.restore();
}
function room(t) {
  g.fillStyle = E.wall; g.fillRect(-200, -200, 1500, 1800); g.strokeStyle = E.wallD; g.lineWidth = 3; for (let x = -150; x < 1300; x += 110) line(x, -200, x, 1500);
  g.fillStyle = E.base; g.fillRect(-200, 1470, 1500, 90); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(-200, 1470, 1500, 6);
  g.fillStyle = '#1B1420'; g.beginPath(); g.moveTo(938, 1560); g.lineTo(938, 1498); g.arc(985, 1498, 47, Math.PI, 0); g.lineTo(1032, 1560); g.closePath(); g.fill();
  g.fillStyle = E.floor; g.fillRect(-200, 1560, 1500, 500); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(-200, 1560, 1500, 7);
  g.strokeStyle = E.floorD; g.lineWidth = 3; for (let y = 1640; y < 2000; y += 80) line(-200, y, 1300, y);
  g.fillStyle = '#C9C5D2'; circle(905, 1549, 12); circle(893, 1553, 8);
}
function dryer(t) {
  g.fillStyle = '#8A8791'; rr(110, 1528, 70, 32, 6); g.fill(); rr(740, 1528, 70, 32, 6); g.fill();
  g.fillStyle = E.body; g.strokeStyle = '#C9C5BA'; g.lineWidth = 4; rr(60, 150, 800, 1385, 34); g.fill(); g.stroke();
  g.fillStyle = E.panel; rr(60, 150, 800, 175, [34, 34, 0, 0]); g.fill(); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(60, 321, 800, 5);
  g.fillStyle = '#20242B'; rr(130, 200, 250, 74, 10); g.fill();
  g.font = `34px ${DISP}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = t < 1.2 && Math.sin(t * 22) < 0 ? '#2B5A3A' : '#6BE38B'; g.fillText('DONE', 255, 240);
  g.fillStyle = '#C9C5BA'; circle(720, 237, 54); g.fillStyle = '#F7F5F0'; circle(720, 237, 46); g.strokeStyle = '#8A8791'; g.lineWidth = 7; g.lineCap = 'round'; line(720, 237, 748, 209);
  for (let i = 0; i < 3; i++) { g.fillStyle = i === 2 ? '#6BE38B' : '#B9B5AA'; circle(470 + i * 52, 237, 11); }
  const rg = g.createLinearGradient(160, 580, 760, 1180); rg.addColorStop(0, '#DDE2E6'); rg.addColorStop(1, E.ringD); g.fillStyle = rg; circle(DCX, DCY, 300);
  g.fillStyle = E.ringD; circle(DCX, DCY, 272); g.fillStyle = E.drum; circle(DCX, DCY, 255);
  g.save(); g.beginPath(); g.arc(DCX, DCY, 255, 0, 6.2832); g.clip(); g.fillStyle = E.drumB; circle(DCX, DCY - 20, 190);
  g.fillStyle = 'rgba(0,0,0,.35)'; for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) circle(DCX - 160 + c * 40 + (r & 1 ? 20 : 0), DCY - 190 + r * 40, 5);
  g.fillStyle = '#596070'; rr(DCX - 18, DCY - 255, 36, 110, 14); g.fill(); g.restore();
}
function pile() {
  g.save(); g.beginPath(); g.arc(DCX, DCY, 255, 0, 6.2832); g.clip();
  g.fillStyle = '#6FA8A0'; g.fillRect(180, PILE + 22, 560, 200);
  for (const [x, w, c] of [[330, 95, '#E8A1B4'], [470, 120, '#6FA8A0'], [600, 90, '#F0CE72'], [250, 70, '#F0CE72'], [400, 80, '#E9E4D8'], [545, 85, '#E8A1B4']]) { g.fillStyle = c; g.beginPath(); g.ellipse(x, PILE + 30, w, 31, 0, 0, 6.2832); g.fill(); }
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 3; g.beginPath(); g.arc(470, PILE + 90, 90, 3.6, 5.4); g.stroke(); g.restore();
}
function towel() {
  const p = () => { g.beginPath(); g.moveTo(585, 1078); g.quadraticCurveTo(660, 1050, 700, 1120); g.lineTo(705, 1535); };
  g.lineCap = 'butt'; g.lineJoin = 'round'; p(); g.strokeStyle = E.towelD; g.lineWidth = 78; g.stroke(); p(); g.strokeStyle = E.towel; g.lineWidth = 70; g.stroke();
  g.fillStyle = '#F4F2EC'; g.fillRect(670, 1470, 70, 12); g.fillRect(670, 1494, 70, 12);
  g.strokeStyle = E.towelD; g.lineWidth = 3; for (let x = 674; x < 740; x += 9) line(x, 1535, x, 1552);
}
function door() {
  g.fillStyle = E.ringD; g.beginPath(); g.ellipse(120, DCY, 46, 300, 0, 0, 6.2832); g.fill();
  g.fillStyle = '#DDE2E6'; g.beginPath(); g.ellipse(114, DCY, 40, 294, 0, 0, 6.2832); g.fill();
  g.fillStyle = 'rgba(150,190,215,.75)'; g.beginPath(); g.ellipse(112, DCY, 27, 240, 0, 0, 6.2832); g.fill();
  g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(104, DCY - 90, 6, 90, 0, 0, 6.2832); g.fill();
}
function crewAt(x, y, s, o) { at2(x, y, s, () => worker(Object.assign({ x: 0, y: 0, lean: 0, hands: [[-13, -24], [13, -24]] }, o))); }
const P_BEA = { hat: '#2F6DB5', shirt: '#D9534F', skin: '#F0C7A0' }, P_LOU = { hat: '#F2792B', shirt: '#3A7CA5', skin: '#B9794F' }, P_SAL = { hat: C.yellow, shirt: '#4E8F4A', skin: '#7A4E32' };
function elfFrom(p, t, extra) { if (!p) return; const o = Object.assign({ x: p.x, y: p.y, f: p.dx < 0 ? -1 : 1, walk: p.mv ? t * 22 : 0, lean: p.climb ? -.25 * (p.dx < 0 ? -1 : 1) : 0, a: clamp((982 - p.x) / 26) }, extra || {}); if (o.a > 0) elf(o); }
function card2(t) {
  const u = t - 8.9; g.fillStyle = C.yellow; g.fillRect(0, 0, W, H);
  g.save(); g.translate(540, 1000); g.rotate(u * .25); g.fillStyle = '#F7B500'; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1700, i * .5236, i * .5236 + .2618); g.closePath(); g.fill(); } g.restore();
  const s = outBack(seg(u, 0, .28));
  g.save(); g.translate(540, 1130); g.rotate(-.06 + .03 * Math.sin(u * 9)); g.scale(3 * s, 3 * s); g.translate(-(BAG.x + BAG.w / 2), -(BAG.y + BAG.h / 2));
  g.fillStyle = 'rgba(0,0,0,.14)'; rr(BAG.x + 5, BAG.y + 8, BAG.w, BAG.h, 24); g.fill(); g.fillStyle = '#FFF7DA'; rr(BAG.x, BAG.y, BAG.w, BAG.h, 24); g.fill(); bag(1, 0, 'happy', true); g.restore();
  g.save(); g.translate(540, 300); g.rotate(-.04); g.scale(s, s); txt('THE FIX:', 0, 0, 150, '#fff'); txt("ZIP 'EM IN", 0, 200, 170, C.red); g.restore();
  const s2 = outBack(seg(u, .2, .45)); g.save(); g.translate(540, 1560); g.rotate(-.03); g.scale(s2, s2); g.fillStyle = C.ink; rr(-300, -52, 600, 104, 52); g.fill();
  g.font = `800 52px ${BODY}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('zip mesh sock bag', 0, 3); g.restore();
}

function draw2(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  if (t >= 8.9 && t < 10.1) { card2(t); return; }
  let [cx, cy, s] = t < 8.9
    ? kf([[0, 540, 960, 1], [3.0, 540, 980, 1.06], [4.3, 780, 1400, 1.9], [5.6, 650, 1150, 2.1], [6.3, 505, 1000, 2.35], [7.2, 505, 1000, 2.35], [8.0, 700, 1300, 1.7], [8.9, 800, 1420, 1.7]], t)
    : kf([[10.1, 460, 965, 2.2], [12.5, 460, 965, 2.3], [13.4, 540, 960, 1], [14.4, 640, 1300, 1.5], [15.3, 480, 985, 2.2], [16.5, 470, 985, 2.2], [17.3, 580, 1120, 1.55], [18.6, 490, 1000, 1.65], [21.3, 490, 1000, 1.7], [22.1, 540, 960, 1], [24.5, 540, 975, 1.06]], t);
  cx = clamp(cx, 540 / s, 1080 - 540 / s); cy = clamp(cy, 960 / s, 1920 - 960 / s);
  g.translate(540, 960); g.scale(s, s); g.translate(-cx, -cy);
  const ph2 = t >= 10.1, zip = ease(seg(t, 10.8, 12.3)), tabx = BAG.x + 18 + (BAG.w - 36) * zip;
  const tug = t > 15.4 && t < 16.4, gotcha = t >= 16.4, cheer = t > 17.6, hop = k => cheer ? 16 * Math.abs(Math.sin((t - 17.6) * 6 + k)) : 0;
  const pA = pth(t < 10 ? A1 : A2, t), pB = pth(t < 10 ? B1 : B2, t);

  room(t); dryer(t);
  // crew that rise from behind the laundry pile
  if (ph2) {
    g.save(); g.beginPath(); g.rect(-300, -300, 1700, 300 + PILE + 24); g.clip();
    const sink = t < 12.5 ? 0 : t < 16.4 ? 150 * ease(seg(t, 12.5, 13.1)) : 150 * (1 - outBack(seg(t, 16.4, 16.7)));
    crewAt(316, PILE + sink - hop(0), 1.1, Object.assign({ face: 1, hands: gotcha ? [[-17, -80], [17, -80]] : [[-13, -24], [16, -70 + 4 * Math.sin(t * 10)]], mouth: gotcha && !cheer ? 'o' : undefined }, P_SAL));
    if (t < 13.2) crewAt(620, PILE + sink, 1.1, Object.assign({ face: -1, hands: [[-13, -32], [13, -24]], clip: false }, P_BEA));
    g.restore();
  }
  pile(); towel();
  // socks / bag
  if (!ph2) {
    const scared = t > 5.9 && t < 7.1;
    sock({ x: 440, y: PILE, mood: t < 5.9 ? 'happy' : scared ? 'shock' : 'sad', col: E.red, r: t > 7.1 ? -.12 : .04 * Math.sin(t * 2), tear: t > 7.1 ? ((t - 7.1) * 14) % 16 : 0 });
    let sx = 505, sy = PILE, sr = -.04 * Math.sin(t * 2 + 1), vis = true;
    if (t > 6.5 && pA) { const u = ease(seg(t, 6.5, 7.05)); sx = lerp(505, pA.x - 6, u); sy = lerp(PILE, pA.y - 112 + 3 * Math.sin(t * 22), u); sr = lerp(0, -1.5708, u); }
    if (t > 6.5 && !pA) vis = false;
    if (vis && (!pA || clamp((982 - pA.x) / 26) > 0 || t < 6.5)) sock({ x: sx, y: sy, r: sr, mood: t < 5.9 ? 'happy' : 'shock', col: E.red });
  } else {
    const wob = tug ? .035 * Math.sin(t * 34) : 0;
    bag(zip, wob, tug ? 'smug' : t > 16.4 ? 'smug' : 'happy', true);
    if (t > 16.9) at2(556, BAG.y, 1.25, () => { g.translate(0, 63); g.rotate(.5); elfHat(1); });
    // crew on top of the bag
    if (t < 12.5) crewAt(tabx + 24, BAG.y, 1.1, Object.assign({ face: -1, lean: zip > 0 && zip < 1 ? .22 : 0, hands: [[-24, -34], [-20, -28]] }, P_LOU));
    else if (t < 13.1) { const u = seg(t, 12.5, 13.1); g.globalAlpha = 1 - u; crewAt(tabx + 24 + 30 * u, BAG.y - 40 * Math.sin(Math.PI * u) + 120 * u * u, 1.1, Object.assign({ face: 1 }, P_LOU)); g.globalAlpha = 1; }
    if (gotcha) {
      const u = seg(t, 16.4, 16.68), y = BAG.y + 70 * (1 - u) - 46 * Math.sin(Math.PI * u); g.globalAlpha = clamp(u * 3);
      crewAt(352, y - hop(1.1), 1.1, Object.assign({ face: 1, hands: cheer ? [[-17, -80], [17, -80]] : [[-13, -24], [22, -50]], clip: false }, P_BEA));
      crewAt(418, y - hop(2.2), 1.1, Object.assign({ face: 1, lamp: true, hands: cheer ? [[-17, -80], [17, -80]] : [[-13, -24], [24, -46]] }, P_LOU)); g.globalAlpha = 1;
    }
  }
  // elves
  const jmp = t > 16.4 && t < 16.9 ? 30 * Math.sin(Math.PI * seg(t, 16.4, 16.9)) : 0, sh = t > 16.4 && t < 18.5 || (t > 6.3 && t < 6.5 && false);
  elfFrom(pB, t, ph2 && t > 15.8 && t < 16.4 ? { f: -1, pull: true, lean: .25 + .05 * Math.sin(t * 34) } : ph2 ? { shock: sh, jump: jmp, nohat: t > 16.9, up: jmp > 0 } : (t > 6.55 && t < 7 ? { f: -1 } : null));
  elfFrom(pA, t, ph2 && tug ? { f: -1, pull: true, lean: .28 + .05 * Math.sin(t * 34 + 1) } : ph2 ? { shock: sh, jump: jmp, up: jmp > 0, f: t > 15.3 && t < 16.9 ? -1 : undefined } : (t > 6.5 && t < 8.9 ? { up: true, f: t < 7.1 ? -1 : undefined } : null));
  if (ph2 && t > 15.3 && t < 16.9) ; // (elves hold position; handled above)
  door();
  // eyes in the mouse hole
  if ((t > .8 && t < 3.1) || t > 20.2) { const bl = Math.sin(t * 2.3) > .93 ? .15 : 1; g.fillStyle = '#FFE27A'; for (const [x, y] of [[972, 1512], [990, 1512], [1004, 1532], [1018, 1532]]) { g.beginPath(); g.ellipse(x, y, 3.6, 4.6 * bl, 0, 0, 6.2832); g.fill(); } }
  // night tint
  const night = t < 8.9 ? .3 : Math.min(seg(t, 13.1, 13.6), 1 - seg(t, 18.4, 19)) * .3;
  if (night > 0) { g.fillStyle = `rgba(22,26,70,${night})`; g.fillRect(-300, -300, 1700, 2500); }
  if (gotcha && t < 18.4) { const a = .42 * Math.min(seg(t, 16.4, 16.5), 1 - seg(t, 18, 18.4)); g.fillStyle = `rgba(255,244,160,${a})`; g.beginPath(); g.moveTo(432, BAG.y - 76); g.lineTo(700, BAG.y - 150); g.lineTo(700, PILE + 20); g.closePath(); g.fill(); }
  if (t > 16.4 && t < 16.95) for (const p of [pA, pB]) if (p) { g.save(); g.translate(p.x, p.y - 150 - jmp); g.scale(outBack(seg(t, 16.4, 16.55)), outBack(seg(t, 16.4, 16.55))); txt('!', 0, 0, 44, C.yellow); g.restore(); }
  if (tug) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; for (let i = 0; i < 3; i++) { const a = -0.5 + i * .5 + .2 * Math.sin(t * 20); line(600 + 14 * Math.cos(a), 985 + 14 * Math.sin(a), 600 + 26 * Math.cos(a), 985 + 26 * Math.sin(a)); } }

  // ---------- screen space
  g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createRadialGradient(540, 960, 600, 540, 960, 1150); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,5,.34)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  if (t > 17.8) confetti.forEach(k => { const y = k.y + k.v * (t - 17.8); if (y < -40 || y > H + 40) return; g.save(); g.translate(k.x + 40 * Math.sin(t * 2 + k.ph), y); g.rotate(t * 5 + k.ph); g.fillStyle = k.col; g.fillRect(-k.w / 2, -5, k.w, 10 * Math.cos(t * 7 + k.ph)); g.restore(); });
  cap(t, .3, 2.9, ['TINY FIX', 'THE SOCK HEIST'], 470, 128, ['#fff', C.yellow]);
  cap(t, 4.3, 6.2, ['EVER LOSE', 'ONE SOCK?'], 330, 96, ['#fff', '#fff']);
  cap(t, 7.0, 8.8, ['NOW YOU', 'KNOW WHY.'], 330, 96, ['#fff', C.yellow]);
  cap(t, 10.25, 11.5, ['NEXT LAUNDRY DAY…'], 330, 80, '#fff');
  cap(t, 11.6, 13.0, ["ZIP 'EM IN."], 330, 110, C.yellow);
  cap(t, 13.5, 15.0, ['THAT NIGHT…'], 330, 96, '#fff');
  cap(t, 15.4, 16.35, ['NOPE.'], 330, 120, '#fff');
  cap(t, 16.45, 17.7, ['GOTCHA!'], 330, 140, C.yellow);
  cap(t, 18.0, 19.6, ['PAIRS STAY', 'PAIRS.'], 380, 104, ['#fff', C.yellow]);
  cap(t, 19.75, 21.5, ['REAL TALK: THEY HIDE IN', 'SHEETS & DOOR SEALS.', 'THE BAG STOPS THAT TOO.'], 330, 62, ['#fff', '#fff', C.yellow]);
  if (t > 21.6) {
    const u = outBack(seg(t, 21.6, 21.9));
    g.save(); g.translate(540, 1500); g.scale(u, u); g.rotate(-.02);
    g.fillStyle = 'rgba(29,26,22,.94)'; rr(-450, -120, 900, 240, 36); g.fill(); g.strokeStyle = C.yellow; g.lineWidth = 6; rr(-436, -106, 872, 212, 26); g.stroke();
    txt('REAL FIX', 0, -44, 100, C.yellow); txt('LINK IN BIO', -40, 54, 70, '#fff', DISP, 700);
    const by = 54 + 9 * Math.sin(t * 7); g.fillStyle = C.yellow; g.beginPath(); g.moveTo(290, by - 30); g.lineTo(330, by - 30); g.lineTo(330, by); g.lineTo(352, by); g.lineTo(310, by + 34); g.lineTo(268, by); g.lineTo(290, by); g.closePath(); g.fill();
    g.restore();
    g.globalAlpha = seg(t, 21.9, 22.2); g.font = `800 38px ${BODY}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.strokeStyle = C.ink; g.lineWidth = 8;
    g.strokeText('#affiliate  ·  AI-made animation', 540, 1666); g.fillStyle = '#fff'; g.fillText('#affiliate  ·  AI-made animation', 540, 1666); g.globalAlpha = 1;
  }
}
window.draw = draw2;
