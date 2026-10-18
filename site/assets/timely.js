'use strict';
// All answers and destinations are local portfolio content. No remote model calls.
(()=>{
 const root=document.getElementById('timely-companion');if(!root)return;
 const el=id=>document.getElementById(id),actor=el('timely-actor'),dialog=el('timely-dialog'),greeting=el('timely-greeting');
 const inlineSlot=el('timely-inline-slot'),overlayParent=root.parentNode;
 const guide={x:0,y:0,open:false,hidden:readPref('timely-hidden')==='yes',roam:readPref('timely-roam')!=='off',moving:false,drag:null,suppressClick:false,hover:false,focus:false,frame:0,timer:0,poseTimer:0,greetingTimer:0,dialogTimer:0,dialogueDismissed:false,lastFrame:0,flight:null,tour:-1,ownNavigation:false,initialized:false,turns:0,mood:'happy',moodTimer:0,lifeTimer:0,followTimer:0,follow:false,sleeping:false,lastActivity:Date.now(),lastHint:0,lifeTurn:0,playTurn:0,visited:new Set()};
 const compact=()=>window.matchMedia('(max-width:720px), (pointer:coarse) and (max-width:1080px)').matches;
 const reading=()=>document.documentElement.dataset.layout==='blog';
 const BLOG_NOTICE='Focus on the blog. Let me know if you need anything.';
 const motion=()=>effectiveMotion()&&!document.hidden&&!reading()&&!guide.docked;
 const viewport=()=>{const v=window.visualViewport;return {w:v?.width||window.innerWidth,h:v?.height||window.innerHeight,left:v?.offsetLeft||0,top:v?.offsetTop||0};};
 const size=()=>reading()?(compact()?{w:56,h:65}:{w:72,h:84}):compact()?{w:82,h:96}:{w:116,h:135};
 // Golden-section edge anchors and landing centers: approximately 38.2% / 61.8%.
 const GOLDEN=1/((1+Math.sqrt(5))/2),GOLDEN_POINTS=[1-GOLDEN,GOLDEN];
 guide.lastPage=state.active;guide.lastEntry=Number.parseInt(readPref('timely-entry'),10);
 const material=el('timely-material');let materialContext=null,materialColors=null,activeMaterial='',portalTurn=1,materialCompact=false;
 const manifestations=['luminous-bridge','wireframe-hourglass','particle-vortex','spiral-singularity','bipolar-jets','stellar-nebula'];
 let lastManifestation=readPref('timely-manifestation')||'';
 try{materialContext=material?.getContext?.('2d')||null;}catch{}
 const glyphs='.:+*#01/\\',characterPoints=[];
 const limbs=[[65,119,61,146],[61,146,45,156],[96,118,101,145],[101,145,115,157],[34,80,21,95],[21,95,13,90],[126,76,144,63],[144,63,146,44],[146,54,139,46]];
 const distanceToSegment=(x,y,line)=>{const [ax,ay,bx,by]=line,dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-ax-t*dx,y-ay-t*dy);};
 // Sample the clock's outline and face into a small, deterministic glyph field.
 for(let y=8;y<164;y+=7)for(let x=5;x<156;x+=5){
  const ring=Math.abs(Math.hypot(x-80,y-73)-49)<3,eyes=[64,95].some(cx=>((x-cx)/7)**2+((y-68)/10)**2<1),smile=x>=66&&x<=94&&Math.abs(y-(88+7*(1-((x-80)/14)**2)))<3,limb=limbs.some(line=>distanceToSegment(x,y,line)<2.7);
  if(ring||eyes||smile||limb)characterPoints.push({x,y,seed:((x*71+y*137)%997)/997,bright:eyes||smile});
 }
 function syncPalette(){const style=getComputedStyle(root);materialColors={fg:style.getPropertyValue('--fg').trim(),green:style.getPropertyValue('--green').trim(),bg:style.getPropertyValue('--bg').trim()};}
 function beginMaterial(){
  if(!materialContext)return;
  const choices=manifestations.filter(name=>name!==lastManifestation);
  activeMaterial=choices[Math.floor(Math.random()*choices.length)];lastManifestation=activeMaterial;
  savePref('timely-manifestation',activeMaterial);portalTurn=guide.lastEntry%2?-1:1;
  materialCompact=compact();
  const dpr=Math.min(window.devicePixelRatio||1,materialCompact?1.5:2);material.width=160*dpr;material.height=186*dpr;materialContext.setTransform(dpr,0,0,dpr,0,0);
  syncPalette();root.dataset.manifest=activeMaterial;drawMaterial(0);
 }
 function endMaterial(){activeMaterial='';root.dataset.manifest='none';root.style.setProperty('--timely-vector-opacity','1');root.style.setProperty('--timely-material-opacity','0');root.style.setProperty('--timely-emerge-y','0px');root.style.setProperty('--timely-emerge-scale','1');materialContext?.clearRect(0,0,160,186);}
 // Six reference-inspired portals share the existing clipped canvas and entrance clock.
 function drawPortal(ctx,t,aperture){
  if(aperture<=0)return;
  const tau=Math.PI*2,cx=80,cy=115,spin=t*portalTurn*2.7,steps=materialCompact?32:64;
  const stroke=(points,color,alpha,width=.6)=>{
   ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
   ctx.strokeStyle=color;ctx.globalAlpha=alpha*aperture;ctx.lineWidth=width;ctx.stroke();
  };
  const ring=(rx,ry,y,phase=0)=>Array.from({length:steps+1},(_,i)=>{
   const a=i/steps*tau+phase;return {x:cx+Math.cos(a)*rx*aperture,y:cy+(y+Math.sin(a)*ry)*aperture};
  });
  if(activeMaterial==='luminous-bridge'||activeMaterial==='wireframe-hourglass'){
   const luminous=activeMaterial==='luminous-bridge';
   // Symmetric flared mouths join at a narrow rotating throat.
   const point=(v,a)=>{const r=12+51*Math.pow(Math.abs(v),1.8);return {x:cx+Math.cos(a)*r*aperture,y:cy+(v*45+Math.sin(a)*r*.19)*aperture};};
   for(let layer=0;layer<=20;layer++){
    const v=layer/10-1,r=12+51*Math.pow(Math.abs(v),1.8);
    stroke(ring(r,r*.19,v*45),luminous?(layer%4?'#f7a65e':'#cba1e7'):materialColors.fg,luminous?.45:.46,layer%5===0?.9:.45);
   }
   for(let arm=0;arm<24;arm++){
    const a=arm/24*tau+spin;
    stroke(Array.from({length:41},(_,i)=>point(i/20-1,a)),luminous?(arm%3?'#e69b72':'#ae74c8'):materialColors.fg,luminous?.5:.48,arm%4===0?.85:.45);
   }
   if(luminous){
    // Warm throat and drifting sparks, with restrained purple at the mouths.
    for(let i=0;i<110;i++){
     const v=((i*43%109)/109)*2-1,a=i*2.39996+spin,p=point(v,a);
     ctx.fillStyle=i%3?'#ffc78d':'#b388d0';ctx.globalAlpha=aperture*(.18+.45*(1-Math.abs(v)));
     ctx.fillRect(p.x,p.y,i%7===0?1.7:.8,.9);
    }
    for(let halo=6;halo>0;halo--){ctx.fillStyle='#ffbd78';ctx.globalAlpha=aperture*.09;ctx.fillRect(cx-15*aperture,cy-halo*aperture,30*aperture,halo*2*aperture);}
    stroke(ring(14,3,0),'#fff0cf',.95,1.8);
   }else{
    // The reference's red equator and blue/green axial orbits.
    stroke(ring(17,4,0),'#df806f',.9,1);
    for(const [k,color] of [[0,'#78b8c8'],[1,'#b8bd82'],[2,'#a594c6']]){
     const angle=spin+k*tau/3;
     const points=Array.from({length:steps+1},(_,i)=>{const a=i/steps*tau;return {x:cx+Math.cos(a)*16*Math.cos(angle)*aperture,y:cy+Math.sin(a)*30*aperture};});
     stroke(points,color,.8,.8);
    }
   }
  }else if(activeMaterial==='particle-vortex'){
   // A dark lens surrounded by asymmetric, orbiting monochrome filaments.
   for(let strand=0;strand<(materialCompact?23:37);strand++){
    const points=Array.from({length:70},(_,i)=>{
     const a=i/69*tau+spin+strand*.073,r=22+strand*1.05+Math.sin(a*2+strand*.3)*4;
     return {x:cx+(Math.cos(a)*r+Math.sin(a)*8)*aperture,y:cy+(Math.sin(a)*r*.5+Math.cos(a)*r*.18)*aperture};
    });
    stroke(points,materialColors.fg,.07+(strand%5)*.025,.4);
   }
   for(let i=0;i<(materialCompact?230:390);i++){
    const seed=(i*137%997)/997,a=i*2.39996+spin*(.4+seed),r=21+seed*43;
    const x=cx+(Math.cos(a)*r+Math.sin(a)*8)*aperture,y=cy+(Math.sin(a)*r*.5+Math.cos(a)*r*.18)*aperture;
    ctx.fillStyle=materialColors.fg;ctx.globalAlpha=aperture*(.15+.65*(1-seed))*(Math.cos(a)>.1?1:.4);
    ctx.fillRect(x,y,i%13===0?1.3:.65,.65);
   }
   ctx.beginPath();ctx.ellipse(cx,cy,18*aperture,16*aperture,-.25,0,tau);ctx.fillStyle=materialColors.bg||'#080b09';ctx.globalAlpha=aperture;ctx.fill();
   stroke(ring(20,11,0),materialColors.fg,.45,.7);
  }else if(activeMaterial==='spiral-singularity'){
   // Luminous curved trajectories fall toward the black central aperture.
   const count=materialCompact?62:100;
   for(let arm=0;arm<count;arm++){
    const points=Array.from({length:steps+1},(_,i)=>{
     const q=i/steps,r=14+q*53,a=arm/count*tau+spin+(1-q)*2.8;
     return {x:cx+Math.cos(a)*r*aperture,y:cy+Math.sin(a)*r*.77*aperture};
    });
    stroke(points,materialColors.fg,arm%5===0?.66:.27,arm%6===0?.8:.4);
    const q=(arm*.618+t*.7)%1,r=16+q*49,a=arm/count*tau+spin+(1-q)*2.8;
    ctx.fillStyle=materialColors.fg;ctx.globalAlpha=aperture*.85;
    ctx.fillRect(cx+Math.cos(a)*r*aperture,cy+Math.sin(a)*r*.77*aperture,1.1,1.1);
   }
   for(let halo=0;halo<5;halo++)stroke(ring(14+halo*.9,14+halo*.9,0),materialColors.fg,.2-halo*.025,.8);
   ctx.beginPath();ctx.arc(cx,cy,13*aperture,0,tau);ctx.globalAlpha=aperture;ctx.fillStyle=materialColors.bg;ctx.fill();
  }else if(activeMaterial==='bipolar-jets'){
   // Opposed pink plasma lobes, orange shock fronts, and a blue dust envelope.
   for(let i=0;i<(materialCompact?110:190);i++){
    const a=i*2.39996+spin*.16,r=25+(i*41%97)/97*38;
    ctx.fillStyle='#659fc4';ctx.globalAlpha=aperture*(.08+(i%7)*.025);
    ctx.fillRect(cx+Math.cos(a)*r*aperture,cy+Math.sin(a)*r*.74*aperture,1.4,1.4);
   }
   for(const side of [-1,1]){
    for(let layer=0;layer<(materialCompact?12:20);layer++){
     const points=Array.from({length:steps+1},(_,i)=>{
      const a=i/steps*tau,bulge=1+Math.sin(a*5+spin*2+layer)*.07;
      const u=(1+Math.cos(a))*.5,w=Math.sin(a)*(10+layer*.58)*bulge;
      return {x:cx+side*(6+u*43+w*.46)*aperture,y:cy+side*(-3-u*32+w)*aperture};
     });
     stroke(points,layer%4===0?'#ffae54':'#dc829f',layer%4===0?.65:.18,layer%4===0?.9:.6);
    }
    const beam=Array.from({length:33},(_,i)=>{const q=i/32;return {x:cx+side*q*42*aperture,y:cy-side*(q*31+Math.sin(q*9-spin*3)*q*2)*aperture};});
    stroke(beam,'#f4acbd',.75,1.5);
   }
   stroke(ring(4,4,0),'#ffe2a8',.95,2);
  }else if(activeMaterial==='stellar-nebula'){
   // A translucent blue outer halo encloses an irregular bright stellar shell.
   const glow=ctx.createRadialGradient(cx,cy,4,cx,cy,65*aperture+4);
   glow.addColorStop(0,'rgba(113,179,232,.22)');glow.addColorStop(.65,'rgba(69,119,185,.12)');glow.addColorStop(1,'rgba(69,119,185,0)');
   ctx.fillStyle=glow;ctx.globalAlpha=aperture;ctx.fillRect(8,45,144,138);
   for(let shell=0;shell<(materialCompact?18:30);shell++){
    const outer=shell%3===0,r=outer?47+shell*.4:24+shell*.25;
    const points=Array.from({length:steps+1},(_,i)=>{
     const a=i/steps*tau,wobble=1+.06*Math.sin(a*7+spin+shell*.7)+.035*Math.cos(a*11-spin),x=Math.cos(a)*r*wobble,y=Math.sin(a)*r*.77*wobble;
     return {x:cx+(x*.88-y*.48)*aperture,y:cy+(x*.48+y*.88)*aperture};
    });
    stroke(points,outer?'#568bd1':'#a0cced',outer?.09:.27,outer?.6:.85);
   }
   for(let i=0;i<(materialCompact?85:150);i++){
    const a=i*2.39996+spin*.25,r=23+(i*17%31)/31*8;
    ctx.fillStyle='#b4d9f2';ctx.globalAlpha=aperture*(.16+(i%5)*.075);
    ctx.fillRect(cx+Math.cos(a)*r*aperture,cy+Math.sin(a)*r*.85*aperture,.9,.9);
   }
   stroke(ring(3,3,0),'#ffcb7c',.95,1.5);
   stroke([{x:cx-5*aperture,y:cy},{x:cx+5*aperture,y:cy}],'#ffe4ba',.85,.7);
   stroke([{x:cx,y:cy-5*aperture},{x:cx,y:cy+5*aperture}],'#ffe4ba',.85,.7);
  }
  ctx.globalAlpha=1;
 }
 function drawMaterial(t){
  if(!materialContext||!activeMaterial)return;
  const ctx=materialContext,unit=n=>Math.max(0,Math.min(1,n)),solid=unit((t-.72)/.23),opening=unit(t/.19),closing=1-unit((t-.69)/.29),aperture=opening*closing,cx=80,cy=115,tau=Math.PI*2;
  ctx.clearRect(0,0,160,186);ctx.font='8px ui-monospace,monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  root.style.setProperty('--timely-vector-opacity',solid.toFixed(3));root.style.setProperty('--timely-material-opacity',(1-solid).toFixed(3));
  root.style.setProperty('--timely-emerge-y',((1-solid)*14).toFixed(2)+'px');root.style.setProperty('--timely-emerge-scale',(.82+solid*.18).toFixed(3));
  drawPortal(ctx,t,aperture);
  ctx.font='8px ui-monospace,monospace';
  // Staggered glyphs rise from the same throat, spiral upward, then become the clock.
  for(const p of characterPoints){
   const progress=unit((t-.23-p.seed*.10)/.49);if(progress<=0)continue;
   const pointAt=q=>{const ease=q*q*(3-2*q),orbit=Math.sin(Math.PI*q)*(10+p.seed*15),angle=p.seed*tau+portalTurn*q*tau*1.6;
    return {x:cx+(p.x-cx)*ease+Math.cos(angle)*orbit,y:cy+(p.y-cy)*ease+Math.sin(angle)*orbit*.32};};
   const point=pointAt(progress),glyph=progress>.94?(p.bright?'0':'#'):glyphs[(Math.floor(p.seed*glyphs.length)+Math.floor(t*24))%glyphs.length];
   ctx.fillStyle=p.bright?materialColors.green:materialColors.fg;
   if(progress<.94)for(let tail=3;tail>0;tail--){const q=progress-tail*.04;if(q<=0)continue;const trail=pointAt(q);ctx.globalAlpha=(1-progress)*(.20/tail);ctx.fillText(glyph,trail.x,trail.y);}
   ctx.globalAlpha=(.55+p.seed*.4)*unit(progress*9);ctx.fillText(glyph,point.x,point.y);
  }
  ctx.globalAlpha=1;
 }
 const clamp=(n,min,max)=>Math.max(min,Math.min(n,Math.max(min,max)));
 const CLEARANCE=20;
 // Narrow screens reserve real document space for the existing character and canvas.
 // Reparent the whole companion to preserve its styles, events and single identity.
 function syncMount(){
  const use=compact()&&Boolean(overlayParent?.append&&inlineSlot?.append);
  if(Boolean(guide.inline)===use)return;
  guide.inline=use;root.dataset.inline=String(use);inlineSlot.hidden=!use;
  (use?inlineSlot:overlayParent).append(root);
  actor.setAttribute('aria-label',use?'Miss Minutes — tap to open the portfolio guide.':'Miss Minutes — open portfolio guide. Drag to move; arrow keys reposition; Home returns to the corner.');
 }
 function safety(){
  syncMount();
  if(guide.inline){
   const v=viewport(),s=size(),slot=inlineSlot.getBoundingClientRect(),valid=[slot.left,slot.top,slot.width,slot.height].every(Number.isFinite)&&slot.width>=s.w+CLEARANCE*2&&slot.height>=s.h+CLEARANCE*2;
   const x=slot.left+CLEARANCE,y=slot.top+CLEARANCE;
   return {v,s,inline:true,slot,zones:valid?[{id:'inline',minX:x,maxX:x,minY:y,maxY:y}]:[],left:slot.left,right:slot.right};
  }
  const v=viewport(),s=size(),rects=Array.from(document.querySelectorAll('.frame > .header,.frame > .stage,.frame > .statusbar,.frame > .session-strip,.frame > .bottom,.frame > .storage-note,.frame > .theme-popover,#timely-notice-slot,#spine,.skip:focus')).map(node=>node.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0&&Number.isFinite(r.left)&&Number.isFinite(r.right));
  if(!rects.length)return {v,s,zones:[],left:v.left,right:v.left+v.w};
  const left=Math.min(...rects.map(r=>r.left))-12,right=Math.max(...rects.map(r=>r.right))+12;
  const rails=[{id:'left',left:v.left+8,right:Math.min(left,v.left+v.w-8)},{id:'right',left:Math.max(right,v.left+8),right:v.left+v.w-8}];
  const zones=rails.map(r=>({...r,minX:r.left+CLEARANCE,maxX:r.right-s.w-CLEARANCE,minY:v.top+8+CLEARANCE,maxY:v.top+v.h-s.h-8-CLEARANCE})).filter(r=>r.maxX>=r.minX&&r.maxY>=r.minY);
  return {v,s,zones,left,right};
 }
 function project(x,y,geometry=safety(),onlyZone=''){
  const choices=geometry.zones.filter(z=>!onlyZone||z.id===onlyZone).map(z=>({x:clamp(x,z.minX,z.maxX),y:clamp(y,z.minY,z.maxY),zone:z.id}));
  return choices.sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0]||null;
 }
 function clearAt(x,y,geometry=safety()){
  if(geometry.inline){const {slot,s}=geometry;return geometry.zones.length>0&&x-CLEARANCE>=slot.left-.1&&x+s.w+CLEARANCE<=slot.right+.1&&y-CLEARANCE>=slot.top-.1&&y+s.h+CLEARANCE<=slot.bottom+.1;}
  const {v,s,left,right}=geometry,a={left:Math.max(v.left,x-CLEARANCE),right:Math.min(v.left+v.w,x+s.w+CLEARANCE),top:Math.max(v.top,y-CLEARANCE),bottom:Math.min(v.top+v.h,y+s.h+CLEARANCE)};
  return a.right<=a.left||a.bottom<=a.top||a.right<=left||a.left>=right;
 }
 function docked(value){
  guide.docked=value;root.dataset.docked=String(value);actor.hidden=guide.hidden||value;el('timely-restore').hidden=!guide.hidden&&!value;
  if(value){root.dataset.still='true';clearTimeout(guide.timer);clearTimeout(guide.lifeTimer);clearTimeout(guide.followTimer);guide.followTimer=0;guide.follow=false;}
 }
 function bounded(x,y){const v=viewport(),s=size();return project(x,y)||{x:clamp(x,v.left+8,v.left+v.w-s.w-8),y:clamp(y,v.top+8,v.top+v.h-s.h-8)};}
 function home(){const v=viewport(),s=size();return bounded(v.left+v.w-s.w-(compact()?12:25),v.top+(compact()?(reading()?10:108):80));}
 function place(x,y,inside=true){
  const geometry=safety(),p=inside?project(x,y,geometry):{x,y};
  if(!geometry.zones.length||!p){docked(true);return false;}
  if(!clearAt(p.x,p.y,geometry))return false;
  docked(false);guide.x=p.x;guide.y=p.y;actor.style.transform=guide.inline?'translate3d(0,0,0)':`translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0)`;positionGreeting();return true;
 }
 function entrancePoints(){
  const geometry=safety(),{v,s,zones}=geometry,points=[];if(!zones.length)return points;
  if(geometry.inline){const z=zones[0],anchor={x:z.minX,y:z.minY};return [{index:8,side:'inline',ratio:GOLDEN,from:anchor,peek:anchor,to:anchor,zone:'inline'}];}
  for(const side of ['left','right','top','bottom'])for(const ratio of GOLDEN_POINTS){
   const horizontal=side==='left'||side==='right',index=GOLDEN_POINTS.indexOf(ratio),zone=horizontal?zones.find(z=>z.id===side):zones[index%zones.length];if(!zone)continue;
   const cx=zone.minX+(zone.maxX-zone.minX)*ratio,cy=clamp(v.top+v.h*ratio-s.h/2,zone.minY,zone.maxY);
   const target={x:horizontal?(zone.minX+zone.maxX)/2:cx,y:horizontal?cy:clamp(v.top+v.h*(side==='top'?GOLDEN_POINTS[0]:GOLDEN_POINTS[1])-s.h/2,zone.minY,zone.maxY)};
   const from=side==='left'?{x:v.left-s.w-24,y:cy}:side==='right'?{x:v.left+v.w+24,y:cy}:side==='top'?{x:cx,y:v.top-s.h-24}:{x:cx,y:v.top+v.h+24};
   const peek=side==='left'?{x:v.left-s.w*.48,y:cy}:side==='right'?{x:v.left+v.w-s.w*.52,y:cy}:side==='top'?{x:cx,y:v.top-s.h*.45}:{x:cx,y:v.top+v.h-s.h*.55};
   points.push({index:['left','right','top','bottom'].indexOf(side)*2+index,side,ratio,from,peek,to:target,zone:zone.id});
  }
  return points;
 }
 function popFrame(time){
  guide.frame=0;const f=guide.flight;if(!f||f.kind!=='entrance')return;
  if(!motion()||guide.hidden||guide.open||guide.drag||el('media-dialog').open)return cancelFlight();
  if(f.start===null)f.start=time;if(time-guide.lastFrame<32){guide.frame=requestAnimationFrame(popFrame);return;}
  guide.lastFrame=time;const t=clamp((time-f.start)/f.duration,0,1);
  let placed;
  if(f.manifestation){root.dataset.arrival='portal';placed=place(f.to.x,f.to.y,false);}
  else if(t<.4){const u=clamp(t/.27,0,1),ease=1-Math.pow(1-u,3);root.dataset.arrival='peek';placed=place(f.from.x+(f.peek.x-f.from.x)*ease,f.from.y+(f.peek.y-f.from.y)*ease,false);}
  else{const u=clamp((t-.4)/.6,0,1),ease=1-Math.pow(1-u,3);root.dataset.arrival='pop';placed=place(f.peek.x+(f.to.x-f.peek.x)*ease,f.peek.y+(f.to.y-f.peek.y)*ease,false);}
  if(!placed)return cancelFlight();
  drawMaterial(t);
  if(t<1)guide.frame=requestAnimationFrame(popFrame);else{
   endMaterial();guide.flight=null;guide.moving=false;root.dataset.arrival='none';place(f.to.x,f.to.y);mood(state.active==='nvidia-architectures'?'focused':'happy',1800);pose('landing',850);
   if(f.reason==='reload')hint('Got a minute? Pick a project, or click me for a shortcut.',true);schedule();lifeSchedule();
  }
 }
 function popIn(reason='page',zone='',landing=null){
  if(!motion()||guide.hidden||guide.open||guide.drag||guide.follow||guide.hover||guide.focus||el('media-dialog').open)return false;
  cancelFlight();clearTimeout(guide.timer);clearTimeout(guide.lifeTimer);clearTimeout(guide.followTimer);guide.followTimer=0;greeting.hidden=true;
  const points=entrancePoints().filter(p=>!zone||p.zone===zone);if(!points.length){place(guide.x,guide.y);return false;}
  const previous=points.find(p=>p.index===guide.lastEntry),different=points.filter(p=>p.side!==previous?.side),pool=different.length?different:points,point=pool[Math.floor(Math.random()*pool.length)];
  guide.lastEntry=point.index;savePref('timely-entry',String(point.index));guide.sleeping=false;guide.moving=true;guide.lastFrame=-Infinity;
  guide.flight={...point,to:landing||point.to,kind:'entrance',reason,start:null,duration:materialContext?2100:1450,manifestation:Boolean(materialContext)};root.dataset.entrySide=point.side;root.dataset.arrival='peek';root.style.setProperty('--timely-entry-turn',(({left:14,right:-14,top:170,bottom:-5})[point.side]||0)+'deg');root.style.setProperty('--timely-lean','0deg');
  mood('curious');pose(materialContext?'materializing':'flying');beginMaterial();if(materialContext)root.dataset.arrival='portal';const origin=materialContext?guide.flight.to:point.from;if(!place(origin.x,origin.y,false)){cancelFlight();return false;}guide.frame=requestAnimationFrame(popFrame);return true;
 }
 function pose(name,duration=0){clearTimeout(guide.poseTimer);root.dataset.pose=motion()?name:'idle';if(duration&&motion())guide.poseTimer=setTimeout(()=>{root.dataset.pose=guide.sleeping?'sleep':'idle';},duration);}
 function mood(name,duration=0){
  if(reading())name='focused';
  if(!['happy','curious','thinking','surprised','focused','sleepy','cheeky','excited'].includes(name))name='happy';
  clearTimeout(guide.moodTimer);guide.mood=name;root.dataset.emotion=name;
  if(duration&&motion())guide.moodTimer=setTimeout(()=>mood(state.active==='nvidia-architectures'?'focused':'happy'),duration);
 }
 function hint(text,force=false){
  if(guide.open||guide.hidden||document.hidden||(!force&&guide.dialogueDismissed)||(!force&&(state.active==='nvidia-architectures'||Date.now()-guide.lastHint<22000)))return;
  guide.lastHint=Date.now();greeting.textContent=text;greeting.hidden=false;positionGreeting();clearTimeout(guide.greetingTimer);guide.greetingTimer=setTimeout(()=>{greeting.hidden=true;guide.dialogueDismissed=true;},text===BLOG_NOTICE?6500:5000);
 }
 function lifeSchedule(){
  clearTimeout(guide.lifeTimer);
  if(motion()&&!guide.hidden&&!guide.open)guide.lifeTimer=setTimeout(lifeTick,7000+Math.random()*5000);
 }
 function activity(){
  if(reading())return;
  guide.lastActivity=Date.now();
  if(guide.sleeping){guide.sleeping=false;mood('surprised',1700);pose('wake',1000);schedule();}
 }
 function lifeTick(){
  if(!motion()||guide.hidden||guide.open)return;
  if(!guide.follow&&!guide.drag&&!guide.hover&&!guide.focus&&!el('media-dialog').open){
   if(Date.now()-guide.lastActivity>45000){clearTimeout(guide.timer);cancelFlight();guide.sleeping=true;mood('sleepy');pose('sleep');}
   else if(!guide.moving){
    const gestures=['curious','stretch','wink','peek'],gesture=gestures[guide.lifeTurn++%gestures.length];
    mood(gesture==='curious'||gesture==='peek'?'curious':'cheeky',2600);pose(gesture,2300);
   }
  }
  lifeSchedule();
 }
 function cancelFlight(){const entry=guide.flight?.kind==='entrance'?guide.flight:null;cancelAnimationFrame(guide.frame);guide.frame=0;guide.flight=null;guide.moving=false;root.dataset.arrival='none';endMaterial();if(entry)place(entry.to.x,entry.to.y);pose('idle');}
 function canRoam(){return !guide.inline&&motion()&&guide.roam&&!guide.follow&&!guide.sleeping&&!guide.open&&!guide.hidden&&!guide.drag&&!guide.hover&&!guide.focus&&!el('media-dialog').open;}
 function schedule(){clearTimeout(guide.timer);if(canRoam())guide.timer=setTimeout(()=>wander(),compact()?17000:13000);}
 function flightFrame(time){
  guide.frame=0;if(!guide.flight||!motion()||guide.hidden||guide.open)return cancelFlight();
  const f=guide.flight;if(f.start===null)f.start=time;
  if(time-guide.lastFrame<32){guide.frame=requestAnimationFrame(flightFrame);return;}
  guide.lastFrame=time;const t=clamp((time-f.start)/f.duration,0,1),ease=guide.follow?1-Math.pow(1-t,3):t*t*(3-2*t);
  if(!place(f.from.x+(f.to.x-f.from.x)*ease,f.from.y+(f.to.y-f.from.y)*ease-Math.sin(t*Math.PI)*f.arc))return cancelFlight();
  if(t<1)guide.frame=requestAnimationFrame(flightFrame);else{guide.moving=false;guide.flight=null;pose('landing',850);mood('happy',1800);schedule();lifeSchedule();}
 }
 function flyTo(x,y){
  if(reading()||guide.inline)return;
  cancelFlight();clearTimeout(guide.timer);const geometry=safety(),p=project(x,y,geometry);if(!p){place(x,y);syncMotion();return;}
  const current=project(guide.x,guide.y,geometry);if(current&&current.zone!==p.zone){if(guide.follow){const same=project(x,y,geometry,current.zone);if(same){x=same.x;y=same.y;return flyTo(x,y);}}if(!popIn('travel',p.zone,p))place(p.x,p.y);return;}
  if(!motion()||guide.open||guide.hidden){place(p.x,p.y);schedule();return;}
  guide.sleeping=false;guide.moving=true;guide.lastFrame=-Infinity;const direction=p.x-guide.x;root.style.setProperty('--timely-lean',clamp(direction/25,-13,13)+'deg');
  guide.flight={from:{x:guide.x,y:guide.y},to:p,start:null,duration:clamp(Math.hypot(p.x-guide.x,p.y-guide.y)*2.1,guide.follow?700:1200,guide.follow?1300:2800),arc:Math.min(guide.follow?8:85,Math.abs(direction)*.17)};mood(guide.follow?'curious':'excited');pose('flying');guide.frame=requestAnimationFrame(flightFrame);
 }
 function wander(){
  if(!canRoam())return schedule();
  const v=viewport(),s=size(),left=v.left+12,right=v.left+v.w-s.w-12,top=v.top+(compact()?108:85),bottom=v.top+v.h-s.h-24;
  // Travel stays in the margins; switching rails uses a fresh edge entrance.
  const points=[{x:right,y:bottom},{x:left,y:bottom},{x:left,y:top},{x:right,y:top}];
  const target=points[guide.turns++%points.length];greeting.hidden=true;flyTo(target.x,target.y);
 }
 function setFollow(enabled){
  guide.follow=Boolean(enabled)&&effectiveMotion()&&!reading()&&!guide.docked&&!guide.inline;clearTimeout(guide.followTimer);guide.followTimer=0;cancelFlight();activity();
  el('timely-follow').textContent=guide.follow?'Follow: on':'Follow: off';el('timely-follow').setAttribute('aria-pressed',String(guide.follow));
  if(guide.follow){mood('curious');clearTimeout(guide.timer);}else schedule();
 }
 function followPoint(event){
  if(!guide.follow||!motion()||guide.open||guide.hidden||guide.drag||guide.hover||guide.focus||el('media-dialog').open)return;
  const v=viewport(),s=size(),x=event.clientX+(event.clientX>v.left+v.w/2?-s.w-60:65),y=event.clientY-s.h-35;
  guide.followTarget={x,y};if(guide.followTimer)return;guide.followTimer=setTimeout(()=>{
   guide.followTimer=0;
   if(!guide.follow||!motion()||guide.open||guide.hidden||guide.drag||guide.hover||guide.focus||el('media-dialog').open)return;
   const target=guide.followTarget;if(Math.hypot(target.x-guide.x,target.y-guide.y)>32)flyTo(target.x,target.y);
  },130);
 }
 function play(requested=''){
  if(reading())return speak(BLOG_NOTICE);
  activity();setFollow(false);close(false);actor.blur();guide.focus=false;guide.hover=false;cancelFlight();clearTimeout(guide.timer);clearTimeout(guide.lifeTimer);
  const tricks=[['hop','excited','Okay. One tiny victory hop.'],['spin','cheeky','A little spin between timelines.'],['dance','excited','A systems break. Strictly for morale.'],['wink','cheeky','You saw nothing. Back to the portfolio?']],trick=tricks.find(t=>t[0]===requested)||tricks[guide.playTurn++%tricks.length];
  root.style.setProperty('--timely-hop',Math.min(28,Math.max(0,guide.y-viewport().top-8))+'px');
  mood(trick[1],3000);pose(trick[0],2300);hint(motion()?trick[2]:'Quiet mode. Still curious, just keeping still.',true);schedule();lifeSchedule();
 }
 function positionGreeting(){/* Notices live in a reserved flow row, never over text. */}
 function positionDialog(){
  if(!guide.open)return;const v=viewport(),width=Math.min(compact()?380:360,v.w-24);dialog.style.width=width+'px';dialog.style.maxHeight=Math.max(160,v.h-24)+'px';
  let left=guide.x-width-12;if(left<v.left+12)left=guide.x+size().w+12;
  if(compact())left=v.left+v.w-width-12;
  dialog.style.left=clamp(left,v.left+12,v.left+v.w-width-12)+'px';
  const anchor=guide.docked?el('timely-restore').getBoundingClientRect():null;if(anchor)dialog.style.left=clamp(anchor.right-width,v.left+12,v.left+v.w-width-12)+'px';
  const desired=anchor?anchor.bottom+8:compact()?v.top+Math.min(84,v.h*.12):guide.y;
  dialog.style.top=clamp(desired,v.top+12,v.top+v.h-Math.min(dialog.offsetHeight||480,v.h-24)-12)+'px';
 }
 function speak(text,author='timely'){
  const p=document.createElement('p');p.className='timely-message';p.dataset.author=author;const label=document.createElement('span');label.textContent=author==='you'?'you ›':'miss minutes ›';p.append(label,document.createTextNode(text));el('timely-messages').append(p);
  while(el('timely-messages').children.length>8)el('timely-messages').firstElementChild.remove();
  const scroll=el('timely-scroll');scroll.scrollTop=scroll.scrollHeight;
  if(author==='timely'){if(guide.mood!=='focused')mood('happy');pose('speaking',clamp(text.length*23,1200,4200));}positionDialog();
 }
 function open(focus=true){
  activity();guide.hidden=false;guide.open=true;cancelFlight();place(guide.x,guide.y);clearTimeout(guide.timer);clearTimeout(guide.lifeTimer);clearTimeout(guide.followTimer);guide.followTimer=0;clearTimeout(guide.greetingTimer);greeting.hidden=true;dialog.hidden=false;actor.hidden=Boolean(guide.docked);el('timely-restore').hidden=!guide.docked;savePref('timely-hidden','no');actor.setAttribute('aria-expanded','true');el('timely-restore').setAttribute('aria-expanded','true');root.dataset.open='true';positionDialog();mood('happy');pose('wave',1700);syncMotion();
  // A fresh 1.75-second deadline for each explicit opening, independent of motion.
  clearTimeout(guide.dialogTimer);
  guide.dialogTimer=setTimeout(()=>close(dialog.contains(document.activeElement)),1750);
  if(focus)el('timely-input').focus({preventScroll:true});
 }
 function close(restore=true){clearTimeout(guide.dialogTimer);guide.dialogTimer=0;clearTimeout(guide.greetingTimer);greeting.hidden=true;guide.dialogueDismissed=true;guide.open=false;dialog.hidden=true;actor.setAttribute('aria-expanded','false');el('timely-restore').setAttribute('aria-expanded','false');root.dataset.open='false';if(restore)(guide.docked||guide.hidden?el('timely-restore'):actor).focus({preventScroll:true});schedule();lifeSchedule();}
 function hide(){setFollow(false);close(false);guide.hidden=true;cancelFlight();clearTimeout(guide.timer);clearTimeout(guide.lifeTimer);clearTimeout(guide.moodTimer);clearTimeout(guide.followTimer);clearTimeout(guide.greetingTimer);actor.hidden=true;greeting.hidden=true;el('timely-restore').hidden=false;savePref('timely-hidden','yes');el('timely-restore').focus({preventScroll:true});}
 function dock(){setFollow(false);cancelFlight();const p=home();if(guide.open)place(p.x,p.y);else flyTo(p.x,p.y);positionDialog();}
 const names=()=>Object.fromEntries(VIEWS.map(v=>[v.id,v.id==='about'?'About Vishnu':v.id==='blogs'?'Blogs':v.id==='nvidia-architectures'?NVIDIA_ARTICLE.title:PROJECTS.find(p=>p.id===v.id)?.title||v.title.replace(/\/$/,'')]));
 function buildDirectory(){el('timely-pages').innerHTML=VIEWS.map(v=>`<button type="button" data-timely-page="${escape(v.id)}" aria-current="${state.active===v.id?'page':'false'}"><span>${escape(names()[v.id])}</span><span aria-hidden="true">↗</span></button>`).join('');}
 function describe(id){
  const p=PROJECTS.find(p=>p.id===id);if(p)return p.title+'. '+p.lead;
  const descriptions={about:'Meet Vishnu Rao: Research + Product, based in India. Explore his systems work, research, or writing.',projects:`Here are all ${PROJECTS.length} selected projects. Open one for its scope, diagram and repository.`,blogs:'The Blogs page is open. Choose “Every NVIDIA Architecture Explained” to read the full article.', 'nvidia-architectures':'The NVIDIA article is open with its figures, code, contents menu and original X link. Close this dialogue when you want to read.',research:'Research brings together the attention study, technical report and experiment links.',stack:'This page lists the tools and systems covered in the portfolio.',education:'B.Tech in Computer Science and Engineering at Anurag University, 2023–2027.',resume:'The résumé page is open. Its “open résumé PDF” link opens the existing document.',contact:'The Contact page has Vishnu’s GitHub, LinkedIn, X and email links.',help:'The terminal help page lists every command and destination. You can navigate here by clicking or typing.'};
  return descriptions[id]||'This portfolio page is ready.';
 }
 function navigate(id,announce=true){if(!VIEWS.some(v=>v.id===id))return false;activity();guide.ownNavigation=true;select(id);guide.ownNavigation=false;if(announce&&!reading())speak(describe(id));mood(id==='nvidia-architectures'?'focused':'excited',2500);pose('point',1300);buildDirectory();return true;}
 const tour=[{id:'about',text:'Start here: Vishnu Rao — Research + Product. His focus includes GPU systems, LLM inference and distributed systems.'},{id:'projects',text:'This is the selected-work directory. Each project has its own page, repository link and diagram.'},{id:'latent',text:'LatentPagedAttention-rs explores paged latent-cache attention and memory–compute trade-offs. The project page states its evidence and limitations.'},{id:'nvidia-architectures',text:'This is the full NVIDIA architecture article. Its contents menu lets you jump between sections.'},{id:'contact',text:'You’ve reached Contact. Follow the profile links or send Vishnu an email. You can now explore at your own pace.'}];
 function renderTour(){el('timely-tour').hidden=guide.tour<0;if(guide.tour>=0){el('timely-tour-label').textContent=`Tour ${guide.tour+1} / ${tour.length}`;el('timely-tour-back').disabled=guide.tour===0;el('timely-tour-next').textContent=guide.tour===tour.length-1?'Finish ✓':'Next →';}}
 function tourStep(index){guide.tour=clamp(index,0,tour.length-1);open(false);navigate(tour[guide.tour].id,false);speak(tour[guide.tour].text);renderTour();}
 function reply(raw){
  const text=String(raw||'').trim();if(!text)return;speak(text,'you');const key=text.toLowerCase();
  activity();
  const trick=key.match(/\b(dance|flip|trick|play|spin|hop|wink)\b/);
  if(trick){if(reading())return speak(BLOG_NOTICE);speak('You asked for it. Watch this!');return play(trick[1]==='flip'?'spin':trick[1]);}
  if(/\bfollow\b/.test(key)){if(!motion())return speak(reading()?BLOG_NOTICE:'Motion is paused, so I’m keeping still. The navigation shortcuts still work.');speak('I’ll follow along the margins and keep your content clear. Open my dialogue to pause me, or drag me to stop following.');setFollow(true);close(false);actor.blur();guide.focus=false;guide.hover=false;return hint('Lead the way. I’ll stay in the margins.',true);}
  if(/\b(how are you|how do you feel)\b/.test(key)){speak('A little curious, a little mischievous. Plenty of time for a good systems project.');mood('cheeky',2600);return pose('wink',1800);}
  if(/\b(thank you|thanks|good job)\b/.test(key)){speak('Anytime. That is rather the point of being a clock.');mood('excited',2200);return pose('happy',1800);}
  if(/^(hi|hello|hey)[!. ]*$/.test(key))return speak('Hi! I’m Miss Minutes. I can take you to any portfolio page. Try “show projects”, “read the blog”, “resume”, or “contact”.');
  if(/\btour\b/.test(key))return tourStep(0);
  if(/^(help|what can you do)[?.! ]*$/.test(key))return speak('Choose Projects, Research, Blogs, Résumé, Contact, or About. Open “All sections” for every page, or type a destination.');
  if(/\b(dock|come home)\b/.test(key)){dock();return speak('Back at my home position. You can drag me along the clear margins whenever you like.');}
  if(/\b(time|clock)\b/.test(key)&&!resolvePage(text))return speak('Tell me which section you want: projects, research, blogs, résumé, or contact.');
  let id=resolvePage(text.replace(/^(?:cd|open|go to|show me|show)\s+/i,''));
  if(!id){const matches=[[/\b(nvidia|architecture)\b/,'nvidia-architectures'],[/\b(blog|blogs|writing|article)\b/,'blogs'],[/\b(resume|résumé|cv)\b/,'resume'],[/\b(contact|email|reach|hire)\b/,'contact'],[/\b(research|paper|report)\b/,'research'],[/\b(education|university)\b/,'education'],[/\b(stack|skills|tools)\b/,'stack'],[/\b(projects?|gpu|work)\b/,'projects'],[/\b(about|who|vishnu)\b/,'about']];id=matches.find(([pattern])=>pattern.test(key))?.[1];}
  if(id){guide.tour=-1;renderTour();return navigate(id);}
  if(/^(theme|motion|tree)\b/.test(key)){command(text);syncMotion();return speak(el('command-output').textContent);}
  speak('That shortcut escaped me. Try a project name, “blog”, “research”, “resume”, or “contact”. Every destination is listed below.');mood('curious',2400);pose('curious',1800);
 }
 function syncMotion(){
  const wasReading=root.dataset.reading==='true',quiet=reading();root.dataset.reading=String(quiet);root.dataset.suspended=String(document.hidden);if(wasReading&&!quiet)place(guide.x,guide.y);root.dataset.still=String(!effectiveMotion()||quiet||guide.docked);
  const parked=quiet||guide.docked,travelParked=parked||guide.inline;el('timely-roam').textContent=travelParked?'Roam: paused':guide.roam?'Roam: on':'Roam: off';el('timely-roam').setAttribute('aria-pressed',String(guide.roam));el('timely-roam').disabled=travelParked;
  el('timely-pause').textContent=quiet?'Reading mode':guide.docked?'Docked guide':effectiveMotion()?'Pause motion':'Motion paused';el('timely-pause').disabled=reduced.matches||parked;
  el('timely-follow').disabled=!effectiveMotion()||travelParked;el('timely-play').disabled=parked;el('timely-fly').disabled=travelParked;el('timely-home').disabled=travelParked;
  if(!motion()){cancelFlight();clearTimeout(guide.lifeTimer);clearTimeout(guide.moodTimer);clearTimeout(guide.followTimer);if(guide.follow)setFollow(false);guide.sleeping=false;mood('happy');el('timely-gaze').setAttribute('transform','translate(0 0)');}else lifeSchedule();schedule();
 }
 function enterBlog(announce=true){
  syncMotion();if(announce)clearTimeout(guide.greetingTimer);guide.drag=null;guide.sleeping=false;const p=home();place(p.x,p.y);mood('focused');pose('idle');
  if(guide.open)close(false);
  if(announce){speak(BLOG_NOTICE);hint(BLOG_NOTICE,true);}
 }
 function onBlogLinkClick(event){
  const target=event.target?.closest?.('a,button');if(!target)return;
  const destination=target.dataset?.timelyPage||target.dataset?.route||target.dataset?.view||target.dataset?.command||'',href=target.getAttribute?.('href')||'';
  const route=destination?resolvePage(destination):href.startsWith('#')?resolvePage(href.slice(1)):null;
  if(['blogs','nvidia-architectures'].includes(route)||(reading()&&target.closest('.longform-blog,.blog-list-page,.blog-nav'))){
   // Capture before route handlers, including same-page links and active tours.
   guide.tour=-1;renderTour();close(false);greeting.hidden=true;clearTimeout(guide.greetingTimer);
  }
 }
 document.addEventListener('click',onBlogLinkClick,true);
 function onNavigate(id){
  if(!guide.initialized)return;activity();buildDirectory();if(!guide.ownNavigation&&guide.tour>=0){guide.tour=-1;renderTour();}
  if(reading()){const changed=id!==guide.lastPage;guide.lastPage=id;guide.visited.add(id);enterBlog(changed);positionDialog();return;}
  if(guide.open&&!guide.ownNavigation)speak(describe(id));
  const first=!guide.visited.has(id);guide.visited.add(id);mood(id==='nvidia-architectures'?'focused':id==='research'?'thinking':'excited',2800);if(!guide.moving)pose(id==='nvidia-architectures'?'reading':'point',1800);
  if(first&&!guide.ownNavigation){const lines={about:'Welcome to the notebook. Which thread shall we follow?',projects:'Pick a project. I know the shortcuts.',latent:'Memory versus compute. This one has experiments.',blogs:'A little GPU reading? Right this way.',research:'Follow the evidence. That’s the interesting part.',resume:'The résumé is ready when you are.',contact:'And this is where introductions happen.'};if(lines[id])hint(lines[id]);}
  const changed=id!==guide.lastPage;guide.lastPage=id;place(guide.x,guide.y);syncMotion();positionDialog();if(changed)popIn('page');schedule();lifeSchedule();
 }
 actor.addEventListener('click',()=>{if(guide.suppressClick){guide.suppressClick=false;return;}guide.open?close():open();});
 actor.addEventListener('pointerdown',event=>{if(reading()||guide.inline||(event.button!==0&&event.button!==undefined))return;activity();if(guide.follow)setFollow(false);cancelFlight();clearTimeout(guide.timer);guide.drag={id:event.pointerId,x:event.clientX,y:event.clientY,startX:guide.x,startY:guide.y,moved:false};actor.setPointerCapture?.(event.pointerId);});
 actor.addEventListener('pointermove',event=>{const d=guide.drag;if(!d||d.id!==event.pointerId)return;const dx=event.clientX-d.x,dy=event.clientY-d.y;if(Math.hypot(dx,dy)>5)d.moved=true;if(d.moved){mood('surprised');pose('dragging');greeting.hidden=true;place(d.startX+dx,d.startY+dy);positionDialog();}});
 function release(event){if(!guide.drag)return;guide.suppressClick=guide.drag.moved;const moved=guide.drag.moved;guide.drag=null;actor.releasePointerCapture?.(event.pointerId);mood(moved?'surprised':'happy',1600);pose(moved?'landing':'wave',1100);schedule();lifeSchedule();}
 actor.addEventListener('pointerup',release);actor.addEventListener('pointercancel',event=>{release(event);guide.suppressClick=false;});
 actor.addEventListener('pointerenter',()=>{activity();guide.hover=true;cancelFlight();clearTimeout(guide.timer);mood('curious',2200);pose('curious',1600);});
 actor.addEventListener('pointerleave',()=>{guide.hover=false;schedule();lifeSchedule();});
 actor.addEventListener('focus',()=>{guide.focus=true;cancelFlight();clearTimeout(guide.timer);});actor.addEventListener('blur',()=>{guide.focus=false;schedule();});
 actor.addEventListener('keydown',event=>{if(reading())return;const delta={ArrowLeft:[-24,0],ArrowRight:[24,0],ArrowUp:[0,-24],ArrowDown:[0,24]}[event.key];if(delta){event.preventDefault();cancelFlight();place(guide.x+delta[0],guide.y+delta[1]);positionDialog();}if(event.key==='Home'){event.preventDefault();dock();}});
 el('timely-close').addEventListener('click',()=>close());greeting.addEventListener('click',()=>open());
 el('timely-restore').addEventListener('click',()=>{guide.hidden=false;savePref('timely-hidden','no');dock();open();});
 el('timely-hide').addEventListener('click',hide);
 el('timely-play').addEventListener('click',play);
 el('timely-follow').addEventListener('click',()=>{const enabled=!guide.follow;setFollow(enabled);if(enabled){close(false);actor.blur();guide.focus=false;guide.hover=false;hint('Lead the way. I’ll stay in the margins.',true);}else speak('I’ll stay on my own path. Call me whenever you need a shortcut.');});
 el('timely-roam').addEventListener('click',()=>{guide.roam=!guide.roam;savePref('timely-roam',guide.roam?'on':'off');syncMotion();speak(guide.roam?'I’ll roam again after you close this dialogue.':'I’ll stop wandering between page changes. Drag me or use Come home whenever you like.');});
 el('timely-home').addEventListener('click',()=>{dock();speak('Home again. Close the dialogue to watch me roam, or drag me along the margins.');});
 el('timely-fly').addEventListener('click',()=>{close(false);actor.blur();guide.focus=false;guide.hover=false;const v=viewport(),s=size();flyTo(v.left+v.w*.42-s.w/2,v.top+v.h*.42-s.h/2);});
 el('timely-pause').addEventListener('click',()=>{state.motion=!state.motion;savePref('motion',state.motion?'on':'off');renderMotion();syncMotion();});
 el('timely-start-tour').addEventListener('click',()=>tourStep(0));
 el('timely-tour-back').addEventListener('click',()=>tourStep(guide.tour-1));
 el('timely-tour-next').addEventListener('click',()=>{if(guide.tour===tour.length-1){guide.tour=-1;renderTour();speak('Tour complete. Pick another page, or close the dialogue and explore.');mood('excited',2400);pose('happy',1800);}else tourStep(guide.tour+1);});
 el('timely-tour-exit').addEventListener('click',()=>{guide.tour=-1;renderTour();speak('Tour ended. Where would you like to go?');});
 dialog.addEventListener('click',event=>{const button=event.target.closest('[data-timely-page]');if(button){guide.tour=-1;renderTour();navigate(button.dataset.timelyPage);}});
 el('timely-form').addEventListener('submit',event=>{event.preventDefault();reply(el('timely-input').value);el('timely-input').value='';el('timely-input').focus({preventScroll:true});});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&guide.open&&!el('media-dialog').open){event.preventDefault();event.stopImmediatePropagation();close();}},true);
 window.addEventListener('pointermove',event=>{if(!motion()||guide.hidden)return;activity();const dx=clamp((event.clientX-guide.x-size().w/2)/80,-1,1)*3.9,dy=clamp((event.clientY-guide.y-size().h/2)/100,-1,1)*2.9;el('timely-gaze').setAttribute('transform',`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);if(event.pointerType!=='touch')followPoint(event);},{passive:true});
 window.addEventListener('pointerdown',event=>{activity();if(!root.contains(event.target))followPoint(event);},{passive:true});
 document.addEventListener('keydown',()=>activity(),{passive:true});
 document.addEventListener('scroll',()=>{if(guide.inline){place(guide.x,guide.y);positionDialog();}activity();if(!guide.open&&!guide.moving&&!guide.hidden&&motion()&&Date.now()-(guide.lastScroll||0)>2500){guide.lastScroll=Date.now();mood('focused',1800);pose('reading',1500);}}, {capture:true,passive:true});
 el('timely-input').addEventListener('input',()=>{activity();mood('thinking',2200);pose('curious',1500);});
 function resized(){cancelFlight();place(guide.x,guide.y);syncMotion();positionDialog();schedule();}
 window.addEventListener('resize',resized);window.visualViewport?.addEventListener('resize',resized);window.visualViewport?.addEventListener('scroll',resized);
 document.addEventListener('focusin',event=>{if(event.target?.closest?.('.skip'))resized();});
 document.addEventListener('visibilitychange',syncMotion);
 el('media-dialog').addEventListener('close',()=>{schedule();lifeSchedule();});
 if(window.ResizeObserver){const observer=new window.ResizeObserver(()=>{
  const geometry=safety(),f=guide.flight;
  if(guide.docked){if(geometry.zones.length)resized();return;}
  if(!geometry.zones.length||!clearAt(guide.x,guide.y,geometry)||(f&&[f.from,f.peek,f.to].filter(Boolean).some(p=>!clearAt(p.x,p.y,geometry))))resized();
 });for(const node of document.querySelectorAll('.frame,.header,.stage,#timely-inline-slot'))observer.observe(node);}
 window.Timely={open,close,flyTo,dock,hide,reply,navigate,tourStep,syncMotion,syncPalette,onNavigate,bounded,play,setFollow,popIn,entrancePoints,safety,clearAt,getState:()=>({x:guide.x,y:guide.y,open:guide.open,roam:guide.roam,hidden:guide.hidden,docked:Boolean(guide.docked),inline:Boolean(guide.inline),moving:guide.moving,tour:guide.tour,mood:guide.mood,following:guide.follow,sleeping:guide.sleeping,entrySide:root.dataset.entrySide,entryIndex:guide.lastEntry})};
 const initial=home();place(initial.x,initial.y);actor.hidden=guide.hidden||guide.docked;el('timely-restore').hidden=!guide.hidden&&!guide.docked;buildDirectory();syncMotion();guide.initialized=true;
 if(reading())enterBlog(true);else{
 speak(readPref('timely-met')==='yes'?'Explore projects, research, and writing. Choose a section or type a destination.':'Explore projects, research, and writing. Choose a section or type a destination.');
 guide.visited.add(state.active);lifeSchedule();
 if(!guide.hidden&&readPref('timely-met')!=='yes'){
  greeting.hidden=false;savePref('timely-met','yes');
  if(!motion())pose('idle');
  guide.greetingTimer=setTimeout(()=>{greeting.hidden=true;guide.dialogueDismissed=true;},5000);
 }
 popIn('reload');
 }
})();
