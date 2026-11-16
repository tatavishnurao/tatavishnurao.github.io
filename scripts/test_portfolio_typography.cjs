// Run with PLAYWRIGHT_MODULE, CHROMIUM_PATH and optionally PORTFOLIO_URL/CAPTURE_DIR.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.PORTFOLIO_URL||'http://localhost:8017',out=process.env.CAPTURE_DIR||'/tmp/portfolio-typography';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});const errors=[],results=[];fs.mkdirSync(out,{recursive:true});
try{for(const [width,height,touch,zoom] of [[1440,1000,false,1],[1024,600,false,1],[844,390,true,1],[390,844,true,1],[320,640,true,1],[720,500,false,2]]){
const context=await browser.newContext({viewport:{width,height},hasTouch:touch,deviceScaleFactor:zoom});const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto(base);await page.waitForFunction(()=>!!window.Timely);await page.evaluate(()=>command('motion off'));
for(const route of ['about','projects','tailbench','ctxd','dubpatch','signalflow','glyph','latent']){
await page.evaluate(id=>select(id),route);await page.evaluate(()=>finishTyping());
assert.equal(await page.locator('html').getAttribute('data-typography'),'reading');
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route}: page overflow at ${width}`);
assert(await page.locator('#content').evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${route}: reading overflow at ${width}`);
const metrics=await page.evaluate(()=>{const roles={title:'h1',lead:'.lead',body:'.bio',scope:'.scope',tags:'.project-stack,.tags',caption:'.gallery-bottom',prompt:'.prompt',breadcrumb:'.tab-title',indexTitle:'.page-directory strong'};return Object.fromEntries(Object.entries(roles).map(([k,s])=>{const e=document.querySelector('#content '+s);if(!e)return[k,null];const c=getComputedStyle(e);return[k,{size:parseFloat(c.fontSize),weight:c.fontWeight,lineHeight:parseFloat(c.lineHeight),width:e.getBoundingClientRect().width}]}))});
assert.equal(metrics.title.size,width<=899||touch&&width<=1080?28:34);assert.equal(metrics.title.weight,'500');assert.equal(metrics.lead.size,18);assert.equal(metrics.lead.weight,'500');
for(const role of ['body','scope'])if(metrics[role]){assert.equal(metrics[role].size,16);assert.equal(metrics[role].lineHeight,25.6)}
for(const role of ['tags','caption','prompt','breadcrumb'])if(metrics[role])assert.equal(metrics[role].size,14);
if(width===1440&&metrics.body)assert(metrics.body.width<=16*.61*73,'Prose measure exceeds 73ch');
for(const theme of ['blackmoney','solitude','paper']){
 await page.evaluate(t=>setTheme(t),theme);
 const failures=await page.evaluate(()=>{const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=canvas.height=1;const rgb=s=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=s;ctx.fillRect(0,0,1,1);return Array.from(ctx.getImageData(0,0,1,1).data).slice(0,3)};const luminance=a=>a.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);return [...document.querySelectorAll('#content *, .terminal-dock *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&e.getClientRects().length&&!e.closest('.sr,svg,canvas,[aria-hidden=true]')).flatMap(e=>{const c=getComputedStyle(e);let ancestor=e,layers=[];while(ancestor){layers.push(getComputedStyle(ancestor).backgroundColor);ancestor=ancestor.parentElement}const bg=layers.reverse().reduce((back,color)=>{const values=color.match(/[\d.]+/g).map(Number),alpha=values.length>3?values[3]:1;return values.slice(0,3).map((v,i)=>v*alpha+back[i]*(1-alpha))},[255,255,255]),a=luminance(rgb(c.color)),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return parseFloat(c.fontSize)<14||ratio<4.5?[{text:e.textContent.slice(0,60),size:c.fontSize,ratio}]:[]})});
 assert.deepEqual(failures,[],`${route} ${theme} ${width}: small or low-contrast text`);
}
await page.evaluate(()=>setTheme('blackmoney'));
if(['about','tailbench'].includes(route)){
 await page.screenshot({path:`${out}/after-${route}-${width}${zoom===2?'-zoom200':''}.png`,fullPage:width<720});
 if(width===1440){await page.locator('#content').evaluate((e,route)=>{const target=e.querySelector(route==='about'?'.prompt':'.scope');e.scrollTop=target.offsetTop-e.offsetTop-10},route);await page.screenshot({path:`${out}/after-${route}-details.png`});}
}
if(['tailbench','ctxd'].includes(route)){
 await page.locator('[data-inspect]').click();assert(await page.locator('#media-dialog').evaluate(e=>e.open));
 await page.locator('#media-image').evaluate(e=>e.decode());assert.equal(await page.locator('#media-image').evaluate(e=>getComputedStyle(e).objectFit),'contain');const ratio=await page.locator('#content .gallery-image').evaluate(e=>e.getBoundingClientRect().width/e.getBoundingClientRect().height-e.naturalWidth/e.naturalHeight);assert(Math.abs(ratio)<.02);
 await page.locator('#media-zoom').click();assert.equal(await page.locator('#media-zoom').getAttribute('aria-pressed'),'true');await page.locator('#media-close').click();
}
results.push({width,height,touch,zoom,route,metrics});
}
// Explicitly verify scoped styles are removed when navigating away.
await page.evaluate(()=>select('nvidia-architectures'));assert.equal(await page.locator('html').getAttribute('data-typography'),'');assert.equal(await page.locator('.blog-body').evaluate(e=>getComputedStyle(e).fontSize),'16px');
await context.close();}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify({passed:results.length,errors,output:out}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
