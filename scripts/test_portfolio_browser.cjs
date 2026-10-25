// Optional browser regression: PLAYWRIGHT_MODULE=/path/to/playwright node scripts/test_portfolio_browser.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true, args: ['--no-sandbox'],
  });
  const errors = [], results = [];
  try {
    for (const width of [320, 390, 768, 1024, 1280]) {
      for (const landscape of [false, true]) {
        for (const coarse of [false, true]) {
          const height = landscape ? Math.round(width * .65) : Math.round(width * 1.5);
          const context = await browser.newContext({ viewport: { width, height }, hasTouch: coarse, deviceScaleFactor: 2 });
          const page = await context.newPage();
          page.on('pageerror', e => errors.push(String(e)));
          page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
          page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
          await page.goto(base);
          await page.waitForFunction(() => !!window.Timely);
          assert.equal(await page.locator('.site-nav a').count(), 6);
          assert.equal(await page.evaluate(() => matchMedia('(pointer:coarse)').matches), coarse);
          for (const route of ['projects', 'tailbench', 'ctxd', 'dubpatch', 'signalflow', 'glyph', 'latent', 'blogs', 'nvidia-architectures', 'contact', 'resume']) {
            await page.evaluate(id => { location.hash = id; }, route);
            await page.waitForFunction(id => document.querySelector('#status-view').textContent.toLowerCase().includes(id === 'nvidia-architectures' ? 'nvidia' : id === 'ctxd' ? 'ctxd' : id === 'glyph' ? 'glyph' : id === 'signalflow' ? 'signalflow' : id), route);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `Horizontal overflow ${width}x${height} coarse=${coarse} #${route}`);
            assert.equal(await page.locator('#content').isVisible(), true);
            if (['blogs', 'nvidia-architectures'].includes(route)) {
              assert.equal(await page.locator('#timely-companion').getAttribute('data-still'), 'true');
            }
            if (['tailbench', 'ctxd', 'dubpatch', 'signalflow', 'glyph', 'latent'].includes(route)) {
              await page.locator('[data-inspect]').first().click();
              assert.equal(await page.locator('#media-dialog').evaluate(d => d.open), true);
              await page.locator('#media-close').click();
            }
          }
          await page.locator('#nav-socials').click();
          await page.waitForURL('**/#contact');
          assert.equal(await page.locator('#nav-socials').getAttribute('aria-current'), 'page');
          assert.ok(await page.locator('#content a[href="mailto:tatavishnurao@gmail.com"]').count());
          // Keyboard project navigation and the terminal stay operational.
          await page.locator('#nav-projects').focus();
          await page.keyboard.press('Enter');
          await page.waitForURL('**/#projects');
          await page.evaluate(() => { document.querySelector('#command-input').value = 'cd ctxd'; document.querySelector('#command-form').requestSubmit(); });
          await page.waitForURL('**/#ctxd');
          // All navigation surfaces share the same ordered project records.
          await page.goto(`${base}/#tailbench`);
          await page.waitForFunction(() => !!window.Timely);
          assert.equal(await page.locator('#content h1').textContent(), 'tailbench');
          assert.equal(await page.locator('#project-count').textContent(), '6 projects');
          assert.deepEqual(await page.evaluate(() => PROJECTS.map(p => p.id)), ['tailbench', 'ctxd', 'dubpatch', 'signalflow', 'glyph', 'latent']);
          for (const cmd of ['tailbench', 'cd ~/Projects/tailbench', '#tailbench']) {
            await page.evaluate(cmd => command(cmd), cmd);
            assert.equal(await page.locator('#content h1').textContent(), 'tailbench');
          }
          await page.evaluate(() => { document.querySelector('#command-input').value = 'cd tail'; completeCommand(); });
          assert.equal(await page.locator('#command-input').inputValue(), 'cd tailbench');
          await page.evaluate(() => command('ls projects'));
          assert.equal(await page.locator('#command-results [data-route]').count(), 6);
          const diagram = page.locator('#content .gallery-image');
          await diagram.evaluate(img => img.decode());
          assert.equal(await diagram.evaluate(img => img.naturalWidth > 0 && img.alt.includes('internal comparison')), true);
          await page.locator('[data-inspect="tailbench"]').click();
          await page.locator('#media-image').evaluate(img => img.decode());
          await page.locator('#media-zoom').click();
          assert.equal(await page.locator('#media-zoom').getAttribute('aria-pressed'), 'true');
          assert.equal(await page.locator('#media-image').evaluate(img => img.getBoundingClientRect().width >= 960), true);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
          await page.locator('#media-viewport').evaluate(el => { el.scrollLeft = 200; });
          if (width <= 768) assert.ok(await page.locator('#media-viewport').evaluate(el => el.scrollLeft > 0));
          await page.locator('#media-zoom').click();
          assert.equal(await page.locator('#media-zoom').getAttribute('aria-pressed'), 'false');
          assert.equal(await page.locator('[data-timely-page="tailbench"]').count(), 1);
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#media-dialog').evaluate(d => d.open), false);
          await page.evaluate(() => select('projects'));
          assert.equal(await page.locator('#content [data-route="tailbench"]').count(), 1);
          await page.locator('#content [data-route="tailbench"]').click();
          await page.waitForURL('**/#tailbench');
          await page.locator('#wheel [data-view="tailbench"]').focus();
          await page.keyboard.press('ArrowRight');
          await page.waitForURL('**/#ctxd');
          if (width <= 768) {
            await page.locator('#mobile-prev').click();
            await page.waitForURL('**/#tailbench');
          }
          results.push({ width, height, coarse, routes: 11 });
          await context.close();
        }
      }
    }
    const context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(base);
    await page.waitForFunction(() => !!window.Timely);
    await page.waitForTimeout(2300);
    // The companion's data-derived directory also opens the new project.
    await page.locator('#timely-actor').click();
    await page.locator('[data-timely-page="tailbench"]').evaluate(button => button.click());
    await page.waitForURL('**/#tailbench');
    await page.evaluate(() => Timely.close(false));
    // Actual activation, real browser timers (not mocked).
    await page.locator('#timely-actor').click();
    assert.equal(await page.locator('#timely-dialog').isVisible(), true);
    await page.waitForTimeout(1550);
    assert.equal(await page.locator('#timely-dialog').isVisible(), true);
    await page.waitForTimeout(400);
    assert.equal(await page.locator('#timely-dialog').isVisible(), false);
    await page.waitForTimeout(2000);
    assert.equal(await page.locator('#timely-dialog').isVisible(), false);
    await page.locator('#timely-actor').press('Enter');
    assert.equal(await page.locator('#timely-dialog').isVisible(), true);
    await page.evaluate(() => { Timely.close(false); document.activeElement.blur(); });
    await page.mouse.move(640, 450);
    const effects = await page.evaluate(() => {
      const seen = [], allowed = new Set(['luminous-bridge','wireframe-hourglass','particle-vortex','spiral-singularity','bipolar-jets','stellar-nebula']);
      for (let i = 0; i < 100; i++) {
        if (!Timely.popIn('test')) throw Error('Entrance unavailable');
        const current = document.querySelector('#timely-companion').dataset.manifest;
        if (!allowed.has(current) || current === seen.at(-1)) throw Error('Invalid/repeated manifestation');
        seen.push(current);
      }
      return [...new Set(seen)];
    });
    assert.equal(effects.length, 6);
    await page.locator('#motion-button').click();
    assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
    assert.equal(await page.locator('#timely-companion').getAttribute('data-still'), 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('#motion-button').disabled);
    assert.equal(await page.locator('#motion-button').isDisabled(), true);
    assert.equal(await page.evaluate(() => Timely.popIn('test')), false);
    // Legacy redirects and original PDF bytes are exercised over HTTP.
    for (const [path, hash] of [['projects/', '#projects'], ['research/', '#research'], ['writing/', '#blogs'], ['projects/realkv-serve/', '#projects'], ['projects/sochdb/', '#projects']]) {
      await page.goto(`${base}/${path}`);
      await page.waitForURL(`**/${hash}`);
    }
    const pdf = await context.request.get(`${base}/assets/resume.pdf`);
    assert.equal(pdf.status(), 200);
    assert.ok((await pdf.body()).subarray(0, 5).equals(Buffer.from('%PDF-')));
    const note = await context.request.get(`${base}/content/notes/real-time-log-mel-rust.md`);
    assert.equal(note.status(), 200);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ status: 'PASS', viewports: results, effects, consoleErrors: errors, dialogue: 'open at 1550ms, closed by 1950ms, activation required', pending: ['physical-device visual review', 'actual hidden-tab lifecycle', 'drag/swipe gesture review'] }, null, 2));
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
