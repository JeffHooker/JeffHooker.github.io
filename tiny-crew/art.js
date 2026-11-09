const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const dir = __dirname, out = process.argv[2];
(async () => {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + dir + '/film.html'); await p.addScriptTag({ path: path.join(dir, 'art-draw.js') });
  for (const [fn, name] of [['drawIcon', 'tiny-fix-icon-art.png'], ['drawBanner', 'tiny-fix-banner-art.png']]) {
    const d = await p.evaluate(f => { window.eval(f + '()'); return cv.toDataURL('image/png'); }, fn);
    fs.writeFileSync(path.join(out, name), Buffer.from(d.slice(22), 'base64'));
  }
  await br.close();
})();
