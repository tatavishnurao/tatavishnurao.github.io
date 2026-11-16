// Targeted browser checks. Set PLAYWRIGHT_MODULE and CHROMIUM_PATH as needed.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.PORTFOLIO_URL || 'http://localhost:8017';
const output = process.env.CAPTURE_DIR || '/tmp/portfolio-review';
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH, args:['--no-sandbox']});
 const errors=[], results=[]; fs.mkdirSync(output,{recursive:true});
 try {
 for(const [width,height,touch] of [[1440,1000,false],[1080,720,false],[1024,600,true],[844,390,true],[844,390,false],[390,844,true],[320,640,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch});
  await context.addInitScript(()=>{localStorage.setItem('vvr-v2-motion','on');localStorage.setItem('vvr-v2-timely-roam','on');});
  const page=await context.newPage(); page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)}); page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  for(const route of ['tailbench','nvidia-architectures','tailbench']){
   await page.goto(`${base}/#${route}`); await page.waitForFunction(()=>!!window.Timely);
   await page.evaluate(()=>finishTyping());
   assert.equal(await page.locator('#spine,#eye,#eye-mobile,#eye-coords,#tree-button').count(),0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert(await page.locator('#timely-actor').isVisible());
   const snapshot=()=>page.evaluate(()=>({transform:document.querySelector('#timely-actor').style.transform,gaze:document.querySelector('#timely-gaze').getAttribute('transform'),moving:Timely.getState().moving,animations:document.querySelector('#timely-companion').getAnimations({subtree:true}).filter(a=>a.playState==='running').length}));
   const before=await snapshot();await page.mouse.move(width/2,height/2);await page.waitForTimeout(2200);assert.deepEqual(await snapshot(),before);assert.equal(before.animations,0);assert.equal(before.moving,false);
   assert.equal(await page.locator('#timely-greeting').isVisible(),false);
   await page.locator('#timely-actor').click();assert.equal(await page.locator('#timely-companion').getAttribute('data-open'),'true');await page.locator('#timely-close').click();
   if(route==='nvidia-architectures'){
    const math=page.locator('.blog-equation math');assert.equal(await math.textContent(),'x=y×z+c');await math.scrollIntoViewIfNeeded();assert(await math.evaluate(e=>getComputedStyle(e).display.includes('math')&&e.getBoundingClientRect().height>0));
    await page.screenshot({path:`${output}/equation-${width}.png`});
    // Check the adjacent code examples survive the content correction.
    assert(await page.locator('.blog-code').count()>0);
   }
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:`${output}/after-${route}-${width}.png`});
   results.push({width,height,touch,route,reading:await page.locator('#content').evaluate(e=>e.getBoundingClientRect().width)});
  }
  // In-page navigation must keep dormancy, as well as hard reloads above.
  await page.locator('#wheel [data-view="tailbench"]').focus();await page.keyboard.press('ArrowRight');await page.waitForURL('**/#ctxd');
  assert.equal(await page.locator('#timely-companion').getAttribute('data-still'),'true');
  await page.evaluate(()=>command('blog'));await page.waitForURL('**/#blogs');
  await page.evaluate(()=>command('cd tailbench'));await page.waitForURL('**/#tailbench');
  assert.equal(await page.locator('#timely-companion').getAttribute('data-still'),'true');
  await context.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(`${output}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({passed:results.length,errors,output}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
