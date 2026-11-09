// Channel art for Tiny Fix: reuses the film's characters, adds the villain gang.
const SKIN_ELF = '#E9C9A0';
function sunburst(w, h, cx, cy) {
  g.fillStyle = C.yellow; g.fillRect(0, 0, w, h); g.save(); g.translate(cx, cy); g.fillStyle = '#F7B500';
  for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 3000, i * .5236 + .1, i * .5236 + .3618); g.closePath(); g.fill(); }
  g.restore();
}
function at(x, y, s, fn) { g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round'; g.lineJoin = 'round'; fn(); g.restore(); }
function wk(o) { worker(Object.assign({ x: 0, y: 0, lean: 0 }, o)); }
function sockElf(f) {
  g.save(); g.translate(-f * 15, -44); g.rotate(-f * .5);
  g.fillStyle = '#F4F4F0'; rr(-7, -4, 14, 34, 6); g.fill(); rr(-7, 20, 24, 13, 6); g.fill();
  g.fillStyle = C.red; g.fillRect(-7, 2, 14, 5); g.fillRect(-7, 12, 14, 5); rr(8, 20, 9, 13, 5); g.fill(); g.restore();
  g.strokeStyle = '#2E6B3F'; g.lineWidth = 8; line(-5, -22, -6, -5); line(5, -22, 6, -5);
  g.fillStyle = '#7A3E1D'; for (const sx of [-6, 6]) { g.beginPath(); g.ellipse(sx + f * 3, -3, 9, 4.5, 0, 0, 6.2832); g.fill(); circle(sx + f * 12, -7, 2.6); }
  g.fillStyle = '#7B4BB7'; rr(-12, -48, 24, 28, 7); g.fill(); g.fillStyle = '#F2C94C'; g.fillRect(-12, -27, 24, 4);
  g.strokeStyle = '#7B4BB7'; g.lineWidth = 7; line(-f * 9, -42, -f * 14, -50); line(f * 9, -42, f * 17, -30);
  g.fillStyle = SKIN_ELF; circle(-f * 14, -50, 4.4); circle(f * 17, -30, 4.4);
  for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 8, -63); g.lineTo(sd * 23, -67); g.lineTo(sd * 10, -53); g.closePath(); g.fill(); }
  circle(0, -58, 11.5);
  g.fillStyle = C.ink; circle(f * 5, -59, 1.9); g.strokeStyle = C.ink; g.lineWidth = 1.8; line(f * 1, -64.5, f * 8.5, -62.5);
  g.beginPath(); g.arc(f * 4, -55.5, 5, f > 0 ? .1 : .94, f > 0 ? 2.2 : 3.04); g.stroke();
  g.fillStyle = '#3FA35B'; g.beginPath(); g.moveTo(-13, -63); g.lineTo(13, -63); g.quadraticCurveTo(6, -88, -f * 14, -96); g.quadraticCurveTo(-6, -80, -13, -63); g.fill();
  g.fillStyle = '#F4F4F0'; circle(-f * 14, -96, 4.5); rr(-14, -67, 28, 6, 3); g.fill();
}
function dripImp() {
  g.strokeStyle = '#2C7FB5'; g.lineWidth = 5; line(-8, -8, -10, 0); line(8, -8, 10, 0); line(-24, -30, -35, -42); line(24, -30, 35, -22);
  g.fillStyle = '#4FB3E8'; g.beginPath(); g.moveTo(0, -86); g.bezierCurveTo(4, -64, 27, -52, 27, -30); g.arc(0, -30, 27, 0, Math.PI); g.bezierCurveTo(-27, -52, -4, -64, 0, -86); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 4; g.beginPath(); g.arc(0, -30, 20, 3.5, 4.3); g.stroke();
  for (const sx of [-9, 9]) { g.fillStyle = '#fff'; circle(sx, -36, 7); g.fillStyle = C.ink; circle(sx + 1, -35, 3); }
  g.strokeStyle = C.ink; g.lineWidth = 2.6; line(-18, -48, -4, -43); line(18, -48, 4, -43);
  g.fillStyle = C.ink; g.beginPath(); g.arc(0, -23, 10, 0, Math.PI); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.fillRect(-6, -23, 5, 4); g.fillRect(1, -23, 5, 4);
}
function gremlin() {
  g.fillStyle = '#8E3F16'; circle(-10, -2, 6); circle(10, -2, 6);
  g.fillStyle = '#C7622B'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 18, -38); g.lineTo(sd * 37, -66); g.lineTo(sd * 6, -48); g.closePath(); g.fill(); }
  g.strokeStyle = '#C7622B'; g.lineWidth = 6; line(-22, -24, -32, -14); line(22, -24, 32, -34);
  circle(0, -26, 24); g.fillStyle = '#E08B4E'; g.beginPath(); g.ellipse(0, -18, 14, 11, 0, 0, 6.2832); g.fill();
  for (const sx of [-9, 9]) { g.fillStyle = '#FFE27A'; circle(sx, -34, 7); g.fillStyle = C.ink; g.beginPath(); g.ellipse(sx, -34, 2, 5, 0, 0, 6.2832); g.fill(); }
  g.fillStyle = C.ink; g.beginPath(); g.ellipse(0, -17, 10, 5, 0, 0, 6.2832); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(-8, -18); g.lineTo(-5, -15); g.lineTo(-2, -18); g.lineTo(1, -15); g.lineTo(4, -18); g.lineTo(7, -15); g.stroke();
  g.lineWidth = 2.5; line(40, -62, 48, -68); line(43, -54, 53, -55); line(40, -46, 48, -42);
}
function ghost() {
  g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3.5;
  g.beginPath(); g.moveTo(28, -46); g.lineTo(50, -46); g.arc(50, -52, 6, Math.PI / 2, -Math.PI, true); g.stroke(); line(28, -34, 44, -34);
  g.fillStyle = '#EEF6F7'; g.strokeStyle = '#A9C6CC'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-22, -18); g.lineTo(-22, -58); g.arc(0, -58, 22, Math.PI, 0); g.lineTo(22, -18); g.quadraticCurveTo(14, -6, 7, -18); g.quadraticCurveTo(0, -6, -7, -18); g.quadraticCurveTo(-14, -6, -22, -18); g.fill(); g.stroke();
  g.fillStyle = C.ink; for (const sx of [-4, 12]) { g.beginPath(); g.ellipse(sx, -58, 3.2, 5, 0, 0, 6.2832); g.fill(); }
  g.beginPath(); g.ellipse(6, -44, 4, 5, 0, 0, 6.2832); g.fill();
}
const BEA = { hat: '#2F6DB5', shirt: '#D9534F', skin: '#F0C7A0' }, LOU = { hat: '#F2792B', shirt: '#3A7CA5', skin: '#B9794F' }, SAL = { hat: C.yellow, shirt: '#4E8F4A', skin: '#7A4E32' };

function drawIcon() {
  cv.width = 800; cv.height = 800; sunburst(800, 800, 400, 430);
  const cg = g.createLinearGradient(0, 656, 0, 800); cg.addColorStop(0, C.cab); cg.addColorStop(1, C.cabD); g.fillStyle = cg; g.fillRect(0, 656, 800, 144); g.fillStyle = '#3E8E8A'; g.fillRect(0, 656, 800, 144);
  g.fillStyle = C.wood; g.fillRect(0, 606, 800, 52); g.fillStyle = C.woodL; g.fillRect(0, 606, 800, 10); g.fillStyle = C.woodD; g.fillRect(0, 648, 800, 10);
  at(232, 610, 4.2, () => wk(Object.assign({ face: 1, hands: [[-13, -24], [13, -32]], clip: true }, BEA)));
  at(568, 610, 4.2, () => wk(Object.assign({ face: -1, hands: [[-16, -72], [13, -24]] }, SAL)));
  at(400, 610, 4.6, () => wk(Object.assign({ face: 1, hands: [[-15, -28], [15, -28]] }, LOU)));
  clog(400, 748, 1.9, .3, 'angry');
}
function drawBanner() {
  cv.width = 2560; cv.height = 1440; g.save(); g.scale(2, 2);
  wall();
  g.save(); g.translate(-80, -100); faucet(); g.fillStyle = '#A9D6EA'; g.beginPath(); g.ellipse(460, 372, 7, 11, 0, 0, 6.2832); g.fill(); g.restore();
  const cg = g.createLinearGradient(0, 478, 0, 720); cg.addColorStop(0, C.cab); cg.addColorStop(1, C.cabD); g.fillStyle = cg; g.fillRect(0, 478, 1280, 242);
  g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 3; for (let x = 60; x < 1280; x += 170) line(x, 480, x, 720);
  g.save(); g.beginPath(); g.rect(0, 0, 1280, 452); g.clip(); clog(402, 450 - 62, 1.08, .3, 'angry'); g.restore();
  g.fillStyle = C.wood; g.fillRect(0, 450, 1280, 28); g.fillStyle = C.woodL; g.fillRect(0, 450, 1280, 6); g.fillStyle = C.woodD; g.fillRect(0, 472, 1280, 6);
  g.save(); g.translate(150, -450); cup(); g.restore();
  at(268, 438, 1.25, ghost); at(328, 450, 1.3, dripImp); at(480, 450, 1.5, () => sockElf(1)); at(548, 450, 1.25, gremlin);
  g.save(); g.translate(841, 450 - 150); g.scale(.224, .224); g.translate(-460, 0); tool(0, 0); g.restore();
  at(785, 450, 1.5, () => wk(Object.assign({ face: -1, hands: [[-13, -32], [13, -24]], clip: false }, BEA)));
  at(875, 450, 1.6, () => wk(Object.assign({ face: -1, hands: [[-22, -44], [14, -26]] }, LOU)));
  at(965, 450, 1.5, () => wk(Object.assign({ face: -1, hands: [[-16, -72], [13, -24]] }, SAL)));
  g.restore();
  const vg = g.createRadialGradient(1280, 720, 900, 1280, 720, 1700); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,5,.3)'); g.fillStyle = vg; g.fillRect(0, 0, 2560, 1440);
}
