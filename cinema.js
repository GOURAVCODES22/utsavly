(function(){
const $=s=>document.querySelector(s),lum=h=>{const n=parseInt(h.slice(1),16);return ((n>>16)*299+((n>>8)&255)*587+(n&255)*114)/1000};
// ---- studio additions: more effects, song link, trim ----
const re=$('#revealEffect');if(re)re.insertAdjacentHTML('afterbegin','<option value="lights">✨ Golden Lights</option><option value="stars">⭐ Twinkling Stars</option><option value="hearts">💗 Floating Hearts</option><option value="confetti">🎊 Confetti</option>');
const mc=$('#musicChoice');
if(mc)mc.closest('label').insertAdjacentHTML('afterend','<label>Song link (any direct .mp3 URL — works on shared links)<input id="musicUrl" placeholder="https://…/song.mp3"></label><div class="trimRow"><label>Song starts at (sec)<input id="trimStart" type="number" min="0" value="0"></label><label>Song ends at (sec, blank = full)<input id="trimEnd" type="number" min="0" placeholder="full"></label></div><div class="trimTimeline" id="trimTimeline"><div class="trimTrack"></div><div class="trimFill"></div><input id="trimStartRange" type="range" min="0" max="100" step="0.1" value="0" aria-label="Song start"><input id="trimEndRange" type="range" min="0" max="100" step="0.1" value="100" aria-label="Song end"></div><div class="trimTimes"><span id="trimStartLabel">0:00</span><button type="button" class="btn soft" id="trimPreview">▶ Preview selected part</button><span id="trimEndLabel">Full</span></div><div class="audioNote" id="musicInfo">Choose/upload a song, then drag the two handles like a music clip selector — only the selected part plays.</div>');
const mf=$('#musicFile');
const msr=$('#trimStartRange'),mer=$('#trimEndRange'),mst=$('#trimStart'),met=$('#trimEnd'),msl=$('#trimStartLabel'),mel=$('#trimEndLabel'),mp=$('#trimPreview');
let trimDuration=0,trimPreviewAudio=null;
const fmt=t=>{t=Math.max(0,Number(t)||0);const m=Math.floor(t/60),sec=Math.floor(t%60);return m+':'+String(sec).padStart(2,'0')};
const updateTrimUI=()=>{if(!msr||!mer)return;let a=Number(msr.value)||0,b=Number(mer.value)||100;if(b<=a){if(document.activeElement===msr)a=Math.max(0,b-0.1);else b=Math.min(100,a+0.1);msr.value=a;mer.value=b}const st=trimDuration?a/100*trimDuration:0,en=trimDuration?b/100*trimDuration:0;if(mst)mst.value=st?st.toFixed(1):0;if(met)met.value=en?en.toFixed(1):'';if(msl)msl.textContent=fmt(st);if(mel)mel.textContent=trimDuration?fmt(en):'Full';const fill=document.querySelector('.trimFill');if(fill){fill.style.left=a+'%';fill.style.width=(b-a)+'%'}};
const setTrimDuration=dur=>{trimDuration=Math.max(0,Number(dur)||0);if(msr)msr.max=100;if(mer)mer.max=100;if(met&&trimDuration&&!Number(met.value))met.value=trimDuration.toFixed(1);updateTrimUI()};
if(msr)msr.oninput=updateTrimUI;if(mer)mer.oninput=updateTrimUI;if(mst)mst.oninput=()=>{if(trimDuration){msr.value=Math.max(0,Math.min(100,(Number(mst.value)||0)/trimDuration*100));updateTrimUI()}};if(met)met.oninput=()=>{if(trimDuration){mer.value=Math.max(0,Math.min(100,(Number(met.value)||trimDuration)/trimDuration*100));updateTrimUI()}};updateTrimUI();
if(mf)mf.onchange=()=>{const f=mf.files&&mf.files[0];if(!f)return;if(f.size>30*1048576){alert('Please choose a song up to 30 MB.');mf.value='';return}
 selectedAudioUrl=URL.createObjectURL(f);selectedMusic='upload';mc.value='upload';const a=new Audio(selectedAudioUrl);a.onloadedmetadata=()=>{setTrimDuration(a.duration);$('#musicInfo').textContent=f.name+' · '+Math.round(a.duration)+' sec — drag the handles to choose the exact clip.'}};
const mu=$('#musicUrl');if(mu)mu.onchange=()=>{const u=mu.value.trim();if(!u)return;const a=new Audio(u);a.onloadedmetadata=()=>{setTrimDuration(a.duration);$('#musicInfo').textContent='Linked song · '+Math.round(a.duration)+' sec — choose the exact start/end clip.'};a.onerror=()=>{$('#musicInfo').textContent='Could not read duration from that URL. The song can still be used if the server allows playback.'}};
if(mp)mp.onclick=()=>{const u=(mu&&mu.value.trim())||(selectedMusic==='upload'?selectedAudioUrl:'');if(!u){$('#musicInfo').textContent='Choose/upload a song first.';return}const st=Number(mst&&mst.value)||0,en=Number(met&&met.value)||0;if(trimPreviewAudio){try{trimPreviewAudio.pause()}catch(e){}}trimPreviewAudio=new Audio(u);trimPreviewAudio.currentTime=st;trimPreviewAudio.volume=.8;trimPreviewAudio.ontimeupdate=()=>{if(en>st&&trimPreviewAudio.currentTime>=en){trimPreviewAudio.pause();trimPreviewAudio.currentTime=st}};trimPreviewAudio.play().catch(()=>{$('#musicInfo').textContent='Tap again after choosing the song to preview it.'})};
const gd=getData;const gd2=()=>getData();getData=function(){const d=gd();d.musicUrl=($('#musicUrl')||{}).value||'';d.trimStart=+($('#trimStart')||{}).value||0;d.trimEnd=+($('#trimEnd')||{}).value||0;return d};
const OCC={Birthday:'Birthday Celebration',Anniversary:'Anniversary Celebration',Muslim:'Eid Mubarak',Baby:'Baby Shower',Hindu:'Shubh Utsav',Festival:'Festival Celebration',Music:'Sangeet Night',Wedding:'Wedding Celebration'};
const sc=selectCard;
selectCard=function(c){sc.apply(this,arguments);{const o=$('#occasion');if(o&&c&&(!o.value||Object.values(OCC).includes(o.value)))o.value=OCC[c[0]]||o.value}const x=c&&c[7];if(x){selectedOpening=(openingSets[c[0]]||[]).find(o=>o[0]===x.o)||[x.o,x.o,'',''];if(re)re.value=x.fx;try{renderOpenings()}catch(e){}}
 {const n=$('#names'),cn=$('#customNames');if(n&&cn&&n.value&&!/Janu/.test(n.value)){cn.value=n.value;cn.dispatchEvent(new Event('input',{bubbles:true}))}}
 if(x){setTimeout(()=>{const L=$('#liveCard');if(L)L.style.cssText+=`;background:url(${x.img}) center/cover;color:${x.ink}`},80)}};

// ---- copy link + download invitation ----
const pd=$('#publishDemo');
if(pd)pd.insertAdjacentHTML('afterend','<div class="shareRow"><button type="button" id="copyLink" class="btn soft">📋 Copy Link</button><button type="button" id="dlInvite" class="btn primary">⬇ Download Invitation</button></div><p class="audioNote" id="shareNote">Copy the link to share it with anyone, or download one file that plays on any phone — even offline.</p>');
const note=t=>{const n=$('#shareNote');if(n)n.textContent=t};
if($('#copyLink'))$('#copyLink').onclick=async()=>{if(!($('#generatedLink')||{}).value)pd.click();await new Promise(r=>setTimeout(r,250));const v=($('#generatedLink')||{}).value;if(!v){note('Please fill the details first.');return}
 try{await navigator.clipboard.writeText(v)}catch(e){const i=$('#generatedLink');i.select();document.execCommand('copy')}note('Link copied ✓ — paste it in WhatsApp or anywhere.')};
const b64=async u=>{const bl=await (await fetch(u)).blob();return new Promise(ok=>{const f=new FileReader();f.onload=()=>ok(f.result);f.readAsDataURL(bl)})};
if($('#dlInvite'))$('#dlInvite').onclick=async()=>{try{note('Preparing your file…');const d=gd2(),c=cards.find(x=>x[1]===d.card&&x[0]===d.category)||selectedCard,card=JSON.parse(JSON.stringify(c));
 if(card[7])card[7].img=await b64(card[7].img);const au=(d.music==='upload'&&selectedAudioUrl)?await b64(selectedAudioUrl):'';
 const css=await (await fetch('cinema.css')).text(),js=await (await fetch('cinema.js')).text(),J=x=>JSON.stringify(x).replace(/</g,'\\u003c');
 const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${String(d.names).replace(/</g,'')} — Invitation</title><link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@500;600&family=DM+Sans:wght@500;600&display=swap" rel="stylesheet"><style>body{margin:0;background:#000}.cxX{display:none}${css}</style></head><body><script>var cards=[${J(card)}],activeCategory=${J(d.category)},selectedCard=cards[0],selectedAudioUrl='',selectedMusic='',selectedFont='',openingSets={},musicAudio=null,musicCtx=null,musicTimer=null;function getData(){return {}}function selectCard(){}function renderOpenings(){}
${dateText.toString()}
${stopInvitationMusic.toString()}
${playInvitationMusic.toString()}<\/script><script>${js}<\/script><script>var DATA=${J(Object.assign({},d,{audioUrl:au}))};addEventListener('load',function(){openCinematic(DATA)});addEventListener('click',function(){var e=document.querySelector('.cx');if(e&&e.classList.contains('s5'))setTimeout(function(){openCinematic(DATA)},0)});<\/script></body></html>`;
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=((d.names||'invitation').replace(/[^\w]+/g,'-').toLowerCase()||'invitation')+'-invitation.html';document.body.appendChild(a);a.click();a.remove();note('Downloaded ✓ — send this file on WhatsApp; it opens in any phone browser.')}catch(e){note('Download failed — please use Copy Link.')}};
// ---- particle engine ----
let cv,cx2,W,H,P=[],fx='flowers',N=90,raf,burst=0,T0=0;
const RISE={fire:1,lights:1,hearts:1,stars:1};
const spawn=first=>{const p={x:Math.random()*W,s:3+Math.random()*7,ph:Math.random()*9,vx:(Math.random()-.5)*.6,r:Math.random()*6,vr:(Math.random()-.5)*.06,a:.3+Math.random()*.6,c:['#ffc2d4','#ff8fb1','#fff0f5','#ffd3a8'][Math.random()*4|0]};
 p.y=first?Math.random()*H:(RISE[fx]?H+10:-10);p.vy=RISE[fx]?-(.6+Math.random()*1.4):(fx==='rain'?9+Math.random()*5:1+Math.random()*2);
 if(fx==='lights'){p.vy*=.3;p.s=2+Math.random()*5}if(fx==='stars'){p.y=Math.random()*H;p.vy=0;p.vx=0}if(fx==='confetti')p.c=['#ff4d8d','#ffd24d','#4dd2ff','#8dff6a','#c06bff'][Math.random()*5|0];return p};
const D={flowers:p=>{cx2.save();cx2.translate(p.x,p.y);cx2.rotate(p.r);cx2.fillStyle=p.c;cx2.beginPath();cx2.ellipse(0,0,p.s,p.s*.55,0,0,6.3);cx2.fill();cx2.restore()},
 snow:p=>{cx2.fillStyle='rgba(255,255,255,.9)';cx2.beginPath();cx2.arc(p.x,p.y,p.s*.5,0,6.3);cx2.fill()},
 rain:p=>{cx2.strokeStyle='rgba(210,225,255,.6)';cx2.beginPath();cx2.moveTo(p.x,p.y);cx2.lineTo(p.x-2,p.y+p.s*3);cx2.stroke()},
 fire:p=>{cx2.fillStyle=`rgba(255,${120+p.s*10|0},30,${p.a})`;cx2.beginPath();cx2.arc(p.x,p.y,p.s*.4,0,6.3);cx2.fill()},
 lights:p=>{const g=cx2.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*2.4);g.addColorStop(0,`rgba(255,228,150,${p.a*.8})`);g.addColorStop(1,'rgba(255,228,150,0)');cx2.fillStyle=g;cx2.fillRect(p.x-p.s*2.4,p.y-p.s*2.4,p.s*4.8,p.s*4.8)},
 hearts:p=>{cx2.font=p.s*3+'px serif';cx2.fillStyle=`rgba(255,90,140,${p.a})`;cx2.fillText('♥',p.x,p.y)},
 stars:p=>{cx2.font=p.s*3+'px serif';cx2.fillStyle=`rgba(255,235,160,${.5+.5*Math.sin(T0*.003+p.ph)})`;cx2.fillText('✦',p.x,p.y)},
 confetti:p=>{cx2.save();cx2.translate(p.x,p.y);cx2.rotate(p.r);cx2.fillStyle=p.c;cx2.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx2.restore()}};
D.lightning=D.none=()=>{};
function loop(t){T0=t;cx2.clearRect(0,0,W,H);const want=N+(burst>0?120:0);while(P.length<want&&fx!=='none'&&fx!=='lightning')P.push(spawn(false));
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.x+=p.vx+Math.sin(t*.001+p.ph)*.4;p.y+=p.vy;p.r+=p.vr;(D[fx]||D.flowers)(p);if(p.y>H+20||p.y<-30||P.length>want&&Math.random()<.02)P.splice(i,1)}
 if(burst>0)burst--;if(fx==='lightning'&&Math.random()<.012){const e=document.querySelector('.cx');e.classList.add('flash');setTimeout(()=>e.classList.remove('flash'),130)}raf=requestAnimationFrame(loop)}
// ---- cinematic player ----
// ---- cinematic player ----
// Main app already has the chapter-based cinematic engine in app.js.  Keep it and
// enhance it here.  The legacy .cx player remains only for downloaded standalone invitations.
const __appOpenCinematic=typeof openCinematic==='function'?openCinematic:null;
if(__appOpenCinematic){
  const __baseOpenCinematic=__appOpenCinematic;
  const __basePlayInvitationMusic=typeof playInvitationMusic==='function'?playInvitationMusic:null;
  if(__basePlayInvitationMusic){
    playInvitationMusic=function(kind,url){
      const trim=window.__utsavlyTrim||{};
      if((kind==='upload'||trim.url)&&trim.url){
        stopInvitationMusic();
        musicAudio=new Audio(trim.url); musicAudio.volume=.78; musicAudio.preload='auto';
        const start=Math.max(0,Number(trim.start)||0), end=Math.max(0,Number(trim.end)||0);
        let ready=false;
        musicAudio.addEventListener('loadedmetadata',()=>{
          ready=true;
          try{musicAudio.currentTime=Math.min(start,Math.max(0,musicAudio.duration-.05));}catch(e){}
          musicAudio.play().catch(()=>{});
        },{once:true});
        musicAudio.addEventListener('timeupdate',()=>{
          if(end>start&&ready&&musicAudio.currentTime>=end){
            try{musicAudio.currentTime=start;musicAudio.play().catch(()=>{});}catch(e){}
          }
        });
        return;
      }
      return __basePlayInvitationMusic(kind,url);
    };
  }
  openCinematic=function(d){
    d=Object.assign({},d||{});
    const cat=d.category||activeCategory||'Wedding';
    const exact=cards.find(c=>c[0]===cat&&c[1]===d.card)||selectedCard||cards.find(c=>c[0]===cat)||cards[0];
    if(exact){d.category=exact[0];d.card=exact[1];}
    const trimStart=Math.max(0,Number(d.trimStart)||0),trimEnd=Math.max(0,Number(d.trimEnd)||0);
    const trimUrl=d.musicUrl||(d.music==='upload'?(d.audioUrl||selectedAudioUrl):'');
    window.__utsavlyTrim={start:trimStart,end:trimEnd,url:trimUrl};
    __baseOpenCinematic(d);
    const root=document.querySelector('.cinemaExperience');
    if(!root)return;
    const photo=exact&&exact[7]&&exact[7].img?exact[7].img:'';
    if(photo){root.dataset.photo='1';root.style.setProperty('--cinema-photo',`url("${String(photo).replace(/"/g,'%22')}")`);}
    root.dataset.opening=String(d.opening||root.dataset.opening||'envelope');
    const stage=root.querySelector('.openingStage');
    if(stage){
      stage.dataset.opening=root.dataset.opening;
      stage.setAttribute('aria-label',(d.opening||'Cinematic opening')+' opening');
    }
    // The app's first scene starts immediately; add the selected choreography layer
    // before its one-second reveal timer completes.
    const opening=root.dataset.opening;
    const layer=document.createElement('div');layer.className='cinematicChoreo';layer.dataset.opening=opening;layer.setAttribute('aria-hidden','true');
    layer.innerHTML='<span class="choreoA"></span><span class="choreoB"></span><span class="choreoC"></span><span class="choreoIcon"></span>';
    const first=root.querySelector('.scene-opening');
    if(first){first.appendChild(layer);first.classList.add('choreo-'+opening.replace(/[^a-z0-9-]/gi,'-'));}
  };
}else{
  openCinematic=function(d){d=d||{};document.querySelectorAll('.cx').forEach(e=>e.remove());
   const cat=d.category||activeCategory,c=cards.find(x=>x[1]===d.card&&x[0]===cat)||cards.find(x=>x[1]===d.card)||selectedCard||cards[0],ph=c&&c[7],pal=c&&c[6]&&c[6].p;
   const ink=ph?ph.ink:(pal?pal[2]:'#fff0d0'),z=ph?[ph.x,ph.y,ph.w]:[50,50,80],light=lum(ink)>150;
   const bg=ph?`url(${ph.img})`:(pal?`linear-gradient(165deg,${pal[0]},${pal[1]})`:'linear-gradient(165deg,#2a1a0a,#050403)');
   const style={'wax-pull':'lift','lake-castle':'lift','arch-glow':'iris','mirror-crown':'iris'}[d.opening||(ph&&ph.o)]||'split';
   fx=d.revealEffect||(ph&&ph.fx)||'flowers';N={soft:45,cinematic:90,intense:170}[d.effectIntensity]||90;
   const g=d.font&&/^[A-Za-z' ]+$/.test(d.font)?`'${d.font}',`:'';
   const names=(d.names||'Janu & Janvi').split('').map((ch,i)=>`<span style="animation-delay:${i*70}ms">${ch===' '?'&nbsp;':ch.replace(/&/,'&amp;')}</span>`).join('');
   const el=document.createElement('div');el.className=`cx s0 ${style}`;
   el.style.cssText=`--ink:${ink};--zx:${z[0]}%;--zy:${z[1]}%;--zw:${z[2]}%;--plate:${light?'rgba(0,0,0,.42)':'rgba(255,255,255,.55)'}`;
   el.innerHTML=`<div class="cxBg" style="background-image:${bg}"></div><canvas class="cxFx"></canvas><div class="cxLight"></div><div class="cxVeil"><i class="vl"></i><i class="vr"></i></div>
   <div class="cxZone"><div class="cxT" style="font-family:${g}'Great Vibes',cursive"><p class="cxE">${(d.occasion||'You are invited').replace(/</g,'&lt;')}</p><h2 class="cxN">${names}</h2><p class="cxD">${dateText(d.date)||'Save the date'}${d.time?' · '+d.time:''}</p><p class="cxM">${(d.venue||'').replace(/</g,'&lt;')}</p><p class="cxG">${(d.message||'We cannot wait to celebrate with you.').replace(/</g,'&lt;')}</p></div></div>
   <button class="cxX" aria-label="Close">✕</button><button class="cxS" aria-label="Sound">♪</button><div class="cxHint">Tap to open ✦</div>`;
   document.body.appendChild(el);cv=el.querySelector('canvas');cx2=cv.getContext('2d');W=cv.width=innerWidth;H=cv.height=innerHeight;P=[];burst=0;
   let s=0,timer,swiped=0;
   const next=()=>{if(s>=5)return;s++;el.className=el.className.replace(/\bs\d\b/,'s'+s);clearTimeout(timer);
    if(s===1){for(let i=0;i<N;i++)P.push(spawn(true));cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);burst=140;el.querySelector('.cxHint').textContent='Swipe up ↑';
     const u=d.musicUrl||(d.music==='upload'?(d.audioUrl||selectedAudioUrl):'');
     if(u){stopInvitationMusic();const a=new Audio(u),st=d.trimStart||0,en=d.trimEnd||0;a.currentTime=st;a.volume=.85;a.ontimeupdate=()=>{if(en&&a.currentTime>=en)a.currentTime=st};a.onended=()=>{a.currentTime=st;a.play()};musicAudio=a;a.play().catch(()=>{})}else playInvitationMusic(d.music||'royal');}
    if(s>=2)burst=s===2?220:120;{const L=el.querySelector('.cxLight');L.classList.remove('pulse');void L.offsetWidth;L.classList.add('pulse')}if(s<5)timer=setTimeout(next,s===1?4300:3600)};
   el.addEventListener('click',e=>{if(e.target.closest('.cxX,.cxS'))return;if(swiped){swiped=0;return}next()});
   let y0;el.addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});el.addEventListener('touchend',e=>{if(y0-e.changedTouches[0].clientY>50){swiped=1;next()}},{passive:true});
   el.querySelector('.cxX').onclick=()=>{clearTimeout(timer);cancelAnimationFrame(raf);stopInvitationMusic();el.remove()};
   el.querySelector('.cxS').onclick=e=>{e.stopPropagation();if(musicAudio){musicAudio.paused?musicAudio.play():musicAudio.pause()}else if(musicCtx){musicCtx.state==='running'?musicCtx.suspend():musicCtx.resume()}};
  };
}
})();
