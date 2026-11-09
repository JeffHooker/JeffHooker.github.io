const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const dir = __dirname, mode = process.argv[2] || 'preview';
const b64 = f => fs.readFileSync(path.join(dir, 'node_modules/@fontsource', f)).toString('base64');
(async () => {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + dir + '/film.html');
  await p.addStyleTag({ content: `@font-face{font-family:"Bowlby One";src:url(data:font/woff2;base64,${b64('bowlby-one/files/bowlby-one-latin-400-normal.woff2')})}
  @font-face{font-family:"Nunito";font-weight:800;src:url(data:font/woff2;base64,${b64('nunito/files/nunito-latin-800-normal.woff2')})}
  @font-face{font-family:"Nunito";font-weight:900;src:url(data:font/woff2;base64,${b64('nunito/files/nunito-latin-900-normal.woff2')})}` });
  await p.evaluate(async () => { await Promise.all([document.fonts.load('40px "Bowlby One"'), document.fonts.load('800 40px "Nunito"'), document.fonts.load('900 40px "Nunito"')]); });
  if (process.env.EP) await p.addScriptTag({ path: path.join(dir, process.env.EP + '.js') });
  if (mode === 'preview') {
    const times = process.argv.slice(3).map(Number);
    const d = await p.evaluate(ts => { const m = document.createElement('canvas'); m.width = 540 * 4; m.height = 960 * Math.ceil(ts.length / 4); const x = m.getContext('2d');
      ts.forEach((t, i) => { draw(t); x.drawImage(cv, (i % 4) * 540, Math.floor(i / 4) * 960, 540, 960); }); return m.toDataURL('image/jpeg', .85); }, times);
    fs.writeFileSync(path.join(dir, 'preview.jpg'), Buffer.from(d.slice(23), 'base64'));
  } else {
    const scenes = (await p.evaluate(() => window.SCENES || null)) || [['s1', 0, 96], ['s2', 96, 285], ['s3', 285, 315], ['s4', 315, 765]];
    const only = process.argv.slice(3);
    for (const [name, a, b] of scenes) {
      if (only.length && !only.includes(name)) continue;
      const tmp = path.join(dir, name + '.tmp.mp4');
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise(r => ff.on('close', r));
      for (let f = a; f < b; f++) {
        const d = await p.evaluate(t => { draw(t); return cv.toDataURL('image/jpeg', .92); }, f / 30);
        if (!ff.stdin.write(Buffer.from(d.slice(23), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      }
      ff.stdin.end(); const code = await done; if (code !== 0) throw new Error('ffmpeg ' + code);
      fs.renameSync(tmp, path.join(dir, name + '.mp4')); console.log(name, 'ok');
    }
  }
  await br.close();
})();
