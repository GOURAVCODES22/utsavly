
(function(){
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let audio=null, audioTimer=null;

  /* ---------- card selection repair ---------- */
  function getCards(){try{return cards}catch(e){return []}}
  function cardAt(el){
    const host=el&&el.closest('.cardDesign');
    if(!host) return null;
    const i=Number(host.dataset.cardIndex);
    const all=getCards();
    return Number.isFinite(i)&&all[i] ? all[i] : null;
  }
  function bindCards(){
    $$('.cardDesign .selectCard').forEach(btn=>{
      btn.onclick=e=>{
        e.preventDefault(); e.stopPropagation();
        const c=cardAt(btn);
        if(c) selectSafe(c);
      };
    });
    $$('.cardDesign').forEach(el=>{
      el.addEventListener('click',e=>{
        if(e.target.closest('.selectCard')) return;
        const c=cardAt(el);
        if(c) el.dataset.boundCard=c[1];
      });
    });
  }
  setTimeout(bindCards,0);
  setTimeout(bindCards,300);

  /* ---------- music controls ---------- */
  function installMusicUI(){
    const choice=$('#musicChoice');
    if(!choice || $('#musicUrl')) return;
    const label=choice.closest('label');
    if(!label) return;
    label.insertAdjacentHTML('afterend',`
      <label>Song / Audio file
        <input id="utsavlySongFile" type="file" accept="audio/*">
      </label>
      <div class="utsTrim">
        <label>Start <input id="utsTrimStart" type="range" min="0" max="300" step=".1" value="0"><output id="utsStartOut">0:00</output></label>
        <label>End <input id="utsTrimEnd" type="range" min="0" max="300" step=".1" value="30"><output id="utsEndOut">0:30</output></label>
      </div>
      <button type="button" class="btn soft" id="utsPreviewSong">▶ Preview selected part</button>
      <p class="audioNote" id="utsMusicInfo">Choose a song, then set the exact start and end points.</p>
    `);
    const file=$('#utsavlySongFile'), st=$('#utsTrimStart'), en=$('#utsTrimEnd'),
      so=$('#utsStartOut'), eo=$('#utsEndOut'), info=$('#utsMusicInfo'), preview=$('#utsPreviewSong');
    const fmt=s=>{s=Math.max(0,Number(s)||0);return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`};
    let localUrl='';
    function sync(){so.textContent=fmt(st.value);eo.textContent=fmt(en.value); if(Number(en.value)<Number(st.value)) en.value=st.value; window.__UTSAVLY_MUSIC={url:localUrl,start:+st.value,end:+en.value};}
    file.onchange=()=>{
      const f=file.files?.[0]; if(!f)return;
      if(f.size>30*1024*1024){alert('Please choose a song up to 30 MB.');file.value='';return}
      if(localUrl)URL.revokeObjectURL(localUrl); localUrl=URL.createObjectURL(f);
      const a=new Audio(localUrl); a.onloadedmetadata=()=>{
        st.max=Math.floor(a.duration); en.max=Math.floor(a.duration); en.value=Math.max(+st.value,Math.floor(a.duration)); sync();
        info.textContent=`${f.name} · ${fmt(a.duration)} — choose your exact start/end.`;
      };
      a.load();
    };
    [st,en].forEach(x=>x.oninput=sync); sync();
    preview.onclick=()=>{
      if(!localUrl)return;
      if(audio){audio.pause();audio=null}
      audio=new Audio(localUrl); audio.currentTime=+st.value; audio.volume=.85;
      const end=+en.value;
      audio.ontimeupdate=()=>{if(end>0 && audio.currentTime>=end){audio.pause();audio.currentTime=+st.value}};
      audio.play().catch(()=>{});
    };
  }
  setTimeout(installMusicUI,0);

  function stopAudio(){if(audio){audio.pause();audio.src='';audio=null}if(audioTimer){clearInterval(audioTimer);audioTimer=null}}

  /* ---------- cinematic engine ---------- */
  const styleMap={
    curtain:'curtain', 'royal-door':'doors', 'fort-gates':'doors', 'temple-doors':'doors',
    'church-doors':'doors', 'door-open':'doors', 'royal-gate':'gate',
    'wax-pull':'letter','letter-reveal':'letter','envelope':'letter',
    'heritage-scroll':'scroll','scroll':'scroll','qawwali-scroll':'scroll',
    'gift-box':'gift','ribbon-box':'ribbon','ribbon':'ribbon',
    'cloud-dream':'clouds','clouds-parting':'clouds','lake-castle':'ocean',
    'ocean-wave':'ocean','snowfall':'snow','snow':'snow','rain':'rain',
    'floral-unfold':'petals','floral-bloom':'petals','garden-bloom':'petals',
    'butterfly-bloom':'butterflies','butterfly-bloom':'butterflies',
    'golden-light':'spotlight','spotlight':'spotlight','spotlight-stage':'spotlight',
    'diya-reveal':'diya','jai-mata-di':'diya','lamp-glow':'diya','golden-aarti':'diya',
    'midnight-stars':'galaxy','moon-reveal':'galaxy','crescent-reveal':'galaxy',
    'lightning':'lightning','lightning-reveal':'lightning',
    'confetti':'confetti','color-splash':'confetti','color-celebration':'confetti',
    'mirror-crown':'mirror','vintage-mirror':'mirror','mirror-reveal':'mirror',
    'bell-split':'doors','arch-glow':'spotlight','heritage-arch':'doors','temple-bell':'doors',
    'lantern-glow':'spotlight','rangoli-form':'petals','moon-reveal':'galaxy','crescent-reveal':'galaxy',
    'rhythm-lines':'confetti','rhythm-reveal':'confetti','dhol-beat':'confetti','color-splash':'confetti',
    'floral-unfold':'petals','marigold-bloom':'petals','marigold-wreath':'petals','henna-draw':'petals',
    'mandala-form':'mirror','griha-pravesh':'doors','watercolor-home':'clouds','cinematic-camera':'spotlight',
    'light-trail':'spotlight','glass-reveal':'mirror','editorial-reveal':'spotlight','architecture':'doors','minimal-focus':'spotlight',
    'dove-reveal':'clouds','wreath-reveal':'petals','ticket-reveal':'scroll',
    'golden-stage':'curtain','gift-box':'gift'
  };

  function findCard(d){
    const all=getCards();
    let sc=null; try{sc=selectedCard}catch(e){}
    return all.find(c=>c[1]===d.card && c[0]===d.category) ||
           all.find(c=>c[1]===d.card) || sc || all[0];
  }
  function photoOf(c){
    const p=c&&c[7];
    return p&&p.img ? p : null;
  }
  function openingOf(d,c){
    const p=photoOf(c);
    let sets={}; let so=null;
    try{sets=openingSets||{}}catch(e){}
    try{so=selectedOpening}catch(e){}
    const set=sets[d.category]||sets[c?.[0]]||[];
    const wanted=d.opening || d.revealEffect || '';
    return set.find(o=>o&&o[0]===wanted) || (p&&set.find(o=>o&&o[0]===p.o)) ||
           (so&&set.find(o=>o&&o[0]===so[0])) || so || set[0] || ['curtain','Velvet Curtain','',''];
  }
  function escAttr(v){return esc(v).replace(/`/g,'&#96;')}

  window.openCinematic=function(d){
    d=d||{};
    stopAudio();
    $$('.utsCinema').forEach(x=>x.remove());

    const c=findCard(d), p=photoOf(c), o=openingOf(d,c);
    const openingId=o?.[0]||p?.o||'curtain';
    const type=styleMap[openingId] || styleMap[d.revealEffect] || styleMap[p?.o] || 'curtain';
    const image=p?.img || '';
    const names=d.names||'Janu ♡ Janvi';
    const occasion=d.occasion||`${c?.[0]||'Wedding'} Celebration`;
    const date=typeof window.dateText==='function'?window.dateText(d.date):(d.date||'Your special date');
    const audioCfg=window.__UTSAVLY_MUSIC||{};
    const songUrl=d.musicUrl || audioCfg.url || (d.music==='upload' ? d.audioUrl : '');
    const start=Number(d.trimStart ?? audioCfg.start ?? 0)||0;
    const end=Number(d.trimEnd ?? audioCfg.end ?? 0)||0;
    const cardBg=p?.img ? `url("${escAttr(p.img)}")` : '';
    const el=document.createElement('section');
    el.className=`utsCinema utsFx-${type}`;
    el.setAttribute('role','dialog');
    el.innerHTML=`
      <div class="utsBack" style="${cardBg?`background-image:${cardBg}`:''}"></div>
      <div class="utsShade"></div>
      <div class="utsOpening">
        <div class="utsCurtain left"></div><div class="utsCurtain right"></div>
        <div class="utsDoor left"></div><div class="utsDoor right"></div>
        <div class="utsRibbon">🎀</div>
        <div class="utsEnvelope"><span>✉</span></div>
        <div class="utsScroll"><i></i></div>
        <div class="utsCloud cloudA"></div><div class="utsCloud cloudB"></div>
        <div class="utsWave"></div>
        <div class="utsMirror">◈</div>
        <div class="utsDiya">🪔</div>
        <div class="utsSpot"></div>
        <div class="utsLightning"></div>
        <div class="utsParticles"></div>
      </div>
      <main class="utsStory">
        <article class="utsScene s0 active"><small>${esc(o?.[1]||'Luxury Opening')}</small><h1>${esc(c?.[1]||'Your Invitation')}</h1><p>Tap to open ✦</p></article>
        <article class="utsScene s1"><small>SAVE THE DATE</small><h1>${esc(date)}</h1><p>${esc(d.time||'A day to remember')}</p></article>
        <article class="utsScene s2"><small>A MOMENT BEFORE THE NAMES</small><h1>${esc(d.revealEffect&&d.revealEffect!=='none'?d.revealEffect.replace(/-/g,' '):'A beautiful reveal')}</h1><p>Your chosen effect plays now</p></article>
        <article class="utsScene s3"><small>${esc(occasion)}</small><h1>${esc(names)}</h1><p>Together with their families</p></article>
        <article class="utsScene s4"><small>A NOTE FROM THE HEART</small><h1>With love,</h1><p>${esc(d.message||'We invite you to celebrate this beautiful beginning with us.')}</p></article>
        <article class="utsScene s5"><small>THE PLACE</small><h1>${esc(d.venue||'Your Venue')}</h1><p>${esc(d.language||'English')}</p></article>
        <article class="utsScene s6"><small>SEE YOU THERE</small><h1>Let the celebration begin.</h1><p>UTSAVLY · Digital Invitation</p></article>
      </main>
      <button class="utsClose" aria-label="Close">×</button>
      <button class="utsSound" aria-label="Sound">♪</button>
      <div class="utsHint">Tap / swipe up to continue</div>
    `;
    document.body.appendChild(el);
    let idx=0, timer=null, touchY=0, started=false;
    const scenes=$$('.utsScene',el);
    const show=n=>{
      idx=Math.max(0,Math.min(scenes.length-1,n));
      scenes.forEach((s,i)=>s.classList.toggle('active',i===idx));
      el.dataset.step=String(idx);
      if(idx===0){el.classList.add('playOpening');}
      if(idx===2){el.classList.remove('playEffect');void el.offsetWidth;el.classList.add('playEffect')}
      if(idx>=1 && !started){started=true;startSong()}
      if(idx===scenes.length-1)el.classList.add('finished'); else el.classList.remove('finished');
    };
    const next=()=>{if(idx<scenes.length-1)show(idx+1)};
    const startSong=()=>{
      const u=songUrl; if(!u){return}
      stopAudio();
      audio=new Audio(u); audio.preload='auto'; audio.volume=.85;
      audio.addEventListener('loadedmetadata',()=>{try{audio.currentTime=Math.min(start,Math.max(0,audio.duration-.05))}catch(e){}});
      audio.addEventListener('timeupdate',()=>{
        if(end>start && audio.currentTime>=end){try{audio.currentTime=start}catch(e){}}
      });
      audio.play().catch(()=>{});
    };
    const close=()=>{clearTimeout(timer);stopAudio();el.remove()};
    el.querySelector('.utsClose').onclick=close;
    el.querySelector('.utsSound').onclick=e=>{e.stopPropagation();if(audio)audio.paused?audio.play().catch(()=>{}):audio.pause()};
    el.addEventListener('click',e=>{
      if(e.target.closest('.utsClose,.utsSound'))return;
      next();
    });
    el.addEventListener('touchstart',e=>{touchY=e.changedTouches[0].clientY},{passive:true});
    el.addEventListener('touchend',e=>{const dy=touchY-e.changedTouches[0].clientY;if(dy>35)next()},{passive:true});
    show(0);
  };


  /* ---------- preserve share + download ---------- */
  function dataNow(){
    try{return getData()}catch(e){
      let d={};
      try{d.category=activeCategory}catch(_){}
      try{d.card=selectedCard?.[1]||''}catch(_){}
      try{d.names=$('#names')?.value||'Janu ♡ Janvi'}catch(_){}
      try{d.occasion=$('#occasion')?.value||'Wedding Celebration'}catch(_){}
      try{d.date=$('#date')?.value||'';d.time=$('#time')?.value||'';d.venue=$('#venue')?.value||'';d.message=$('#message')?.value||'';d.language=$('#language')?.value||'English'}catch(_){}
      try{d.opening=selectedOpening?.[0]||'';d.music=selectedMusic||'';d.audioUrl=selectedAudioUrl||'';d.font=selectedFont||'';d.color=selectedColor||'';d.fontColor=selectedFontColor||''}catch(_){}
      return d;
    }
  }
  function fileAsData(url){return fetch(url).then(r=>r.blob()).then(b=>new Promise(ok=>{const fr=new FileReader();fr.onload=()=>ok(fr.result);fr.readAsDataURL(b)}))}
  function installShare(){
    const pd=$('#publishDemo'); if(!pd || $('#utsCopyLink'))return;
    pd.insertAdjacentHTML('afterend',`
      <div class="shareRow utsShare">
        <button type="button" id="utsCopyLink" class="btn soft">📋 Copy Link</button>
        <button type="button" id="utsDownload" class="btn primary">⬇ Download Invitation</button>
      </div>
      <p class="audioNote" id="utsShareNote">Create the invitation first, then share or download it.</p>
    `);
    const note=t=>{const n=$('#utsShareNote');if(n)n.textContent=t};
    $('#utsCopyLink').onclick=async()=>{
      const input=$('#generatedLink');
      if(!input?.value){try{pd.click()}catch(e){}}
      await new Promise(r=>setTimeout(r,200));
      const v=$('#generatedLink')?.value;
      if(!v){note('Fill the invitation details first.');return}
      try{await navigator.clipboard.writeText(v)}catch(e){input?.select();document.execCommand('copy')}
      note('Link copied ✓');
    };
    $('#utsDownload').onclick=async()=>{
      try{
        note('Preparing your invitation…');
        const d=dataNow();
        let c=findCard(d), card=JSON.parse(JSON.stringify(c||{}));
        if(card[7]?.img)card[7].img=await fileAsData(card[7].img);
        let au=d.audioUrl||'';
        if(au && /^blob:/.test(au))au=await fileAsData(au);
        const css=await fetch('cinema.css').then(r=>r.text()).catch(()=>cinema_css_fallback());
        const js=await fetch('cinema.js').then(r=>r.text()).catch(()=> '');
        const safe=JSON.stringify(Object.assign({},d,{audioUrl:au})).replace(/</g,'\\u003c');
        const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.names||'Invitation')}</title><style>${css}</style></head><body><script>var cards=${JSON.stringify([card]).replace(/</g,'\\u003c')};var selectedCard=cards[0];var activeCategory=${JSON.stringify(d.category||card[0]||'Wedding')};var selectedOpening=null;var openingSets={};var selectedAudioUrl='';var selectedMusic='';var selectedFont='';var selectedColor='';var selectedFontColor='';function dateText(x){return x||'Your special date'}<\/script><script>${js.replace(/<\/script/gi,'<\\\\/script')}<\/script><script>addEventListener('load',function(){openCinematic(${safe})})<\/script></body></html>`;
        const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=((d.names||'invitation').replace(/[^\w]+/g,'-').toLowerCase()||'invitation')+'-invitation.html';document.body.appendChild(a);a.click();a.remove();
        note('Downloaded ✓');
      }catch(e){console.error(e);note('Download failed — use Copy Link.')}
    };
  }
  function cinema_css_fallback(){return ''}
  setTimeout(installShare,0);

  /* ---------- final card renderer / selection repair ---------- */
  function photoCardMarkup(c,i){
    const p=c&&c[7], premium=c&&c[5]==='PREMIUM';
    if(p){
      const x=Number(p.x??50), y=Number(p.y??50);
      return `<div class="uc ph${premium?' prem':''}" data-photo="${escAttr(p.img)}">
        <img class="utsCardImg" src="${escAttr(p.img)}" alt="${escAttr(c[1])}" loading="eager" decoding="async" style="object-position:${x}% ${y}%;">
        <div class="phOverlay"></div><div class="phT" style="color:${escAttr(p.ink||'#fff')};"><b>${esc(p.t||c[1])}</b><small>${esc(c[1])}</small></div>
      </div>`;
    }
    const x=c&&c[6];
    const bg=x?.p?`background:linear-gradient(160deg,${x.p[0]},${x.p[1]});color:${x.p[2]}`:'';
    return `<div class="uc fallbackCard" style="${bg}"><span>${esc(c[3]||'✦')}</span><h3>${esc(c[1])}</h3><small>${esc(c[4]||'Luxury invitation')}</small></div>`;
  }
  function renderCardsSafe(){
    const host=$('#cardGrid'); if(!host)return;
    let cat='Wedding'; try{cat=activeCategory||'Wedding'}catch(e){}
    const all=getCards();
    const list=all.filter(c=>c[0]===cat);
    host.innerHTML=list.map(c=>{
      const i=all.indexOf(c);
      return `<article class="cardDesign utsRealCard" data-card-index="${i}" data-card-id="${escAttr(c[1])}">
        <span class="badge">${esc(c[5]||'FREE')}</span>
        ${photoCardMarkup(c,i)}
        <div class="cardBottom"><b>${esc(c[1])}</b><button type="button" class="selectCard">Select &amp; Customize →</button></div>
      </article>`;
    }).join('');
    bindCards();
  }
  function selectSafe(c){
    if(!c)return;
    try{selectedCard=c;activeCategory=c[0]}catch(e){}
    try{
      const p=c[7], set=(openingSets[c[0]]||openingSets.Wedding||[]);
      selectedOpening=p ? (set.find(o=>o&&o[0]===p.o)||selectedOpening||set[0]) : (selectedOpening||set[0]);
    }catch(e){}
    try{track('card_selected',{card:c[1],category:c[0]})}catch(e){}
    if(typeof openCustomizer==='function')openCustomizer();
  }
  try{selectCard=selectSafe}catch(e){}
  try{renderCards=renderCardsSafe}catch(e){}
  setTimeout(()=>{renderCardsSafe();bindCards()},0);
  setTimeout(()=>{renderCardsSafe();bindCards()},250);
  const grid=$('#cardGrid');
  if(grid){
    const obs=new MutationObserver(()=>bindCards());
    obs.observe(grid,{childList:true,subtree:true});
  }

})();
