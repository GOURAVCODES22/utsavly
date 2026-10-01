(function(){
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getCards=()=>{try{return Array.isArray(cards)?cards:[]}catch(_){return[]}};
const getCats=()=>{try{return Array.isArray(categories)?categories:[]}catch(_){return[]}};
const photo=c=>c&&c[7]&&c[7].img?c[7]:null;
const meta=cat=>getCats().find(x=>x[3]===cat);
const cardAt=i=>getCards()[Number(i)];

/* Add the opening choices discussed for UTSAVLY without removing the existing library. */
try{
  const additions=[
    ['nature','Nature Cinematic','Wind & Leaves','🍃','Leaves sweep across the screen on a soft cinematic wind reveal.','nature'],
    ['nature','Nature Cinematic','Petal Bloom','🌸','Petals close over the screen, bloom, then drift away to reveal the invitation.','nature'],
    ['nature','Nature Cinematic','Fire / Spark Reveal','🔥','Warm sparks rise from darkness and burn away into the invitation.','nature'],
    ['royal','Royal Cinematic','Royal Mirror','🪞','A gilded mirror assembles, catches light and opens into the invitation.','royal'],
    ['festival','Festival / Spiritual','Diya Reveal','🪔','A single diya ignites, its glow expanding until the invitation appears.','festival'],
    ['festival','Festival / Spiritual','Floral Temple Reveal','🌺','A floral temple arch grows from both sides and opens onto the celebration.','festival'],
    ['festival','Festival / Spiritual','Arch Reveal','🛕','A ceremonial arch forms in gold and opens into the invitation.','festival'],
    ['festival','Festival / Spiritual','Celebration Burst','🎊','A restrained celebration burst expands and clears into the first scene.','festival']
  ];
  if(Array.isArray(universalOpeningSets)) additions.forEach(a=>{if(!universalOpeningSets.some(x=>x[2]===a[2]))universalOpeningSets.push(a)});
}catch(_){ }

function openingList(cat){try{return getOpeningLibrary(cat)}catch(_){return (typeof openingSets!=='undefined'&&openingSets[cat])||[]}}

function cardVisual(c){
  const p=photo(c);
  if(p){
    return `<div class="lux2Visual photoVisual"><img src="${esc(p.img)}" alt="${esc(c[1])}" loading="lazy" decoding="async"><span class="lux2Shade"></span><span class="lux2Badge">${esc(c[5]||'FREE')}</span><span class="lux2Mark">✦</span></div>`;
  }
  const x=c[6], pal=x&&x.p;
  const bg=pal?`linear-gradient(145deg,${esc(pal[0])},${esc(pal[1])})`:'linear-gradient(145deg,#242018,#090a09)';
  return `<div class="lux2Visual templateVisual" style="background:${bg};color:${esc(x&&pal?pal[2]:'#f5e8cf')}"><span class="lux2TemplateIcon">${esc(c[3]||'✦')}</span><strong>${esc(c[1])}</strong><small>${esc(c[4]||'Luxury invitation')}</small><i>${esc(c[0])}</i></div>`;
}
function cardHTML(c){
  const i=getCards().indexOf(c), m=meta(c[0]);
  return `<article class="lux2Card" data-card-index="${i}">${cardVisual(c)}<div class="lux2Info"><div><span class="lux2Cat">${m?esc(m[0])+' ':''}${esc(c[0])}</span><h3>${esc(c[1])}</h3></div><button type="button" class="lux2Select selectCard">Customize <b>→</b></button></div></article>`;
}

function renderLuxuryGrid(){
  const host=$('#cardGrid'); if(!host)return;
  let cat; try{cat=activeCategory}catch(_){cat='Wedding'}
  const list=getCards().filter(c=>c[0]===cat);
  host.innerHTML=`<div class="lux2GridHead"><div><span>CURATED COLLECTION</span><h3>${esc(meta(cat)?.[1]||cat)}</h3><p>${esc(meta(cat)?.[2]||'Choose a design, then make it yours.')}</p></div><b>${list.length} designs</b></div><div class="lux2Grid">${list.map(cardHTML).join('')}</div>`;
}

function rebuildCollections(){
  const old=$('#lux2Collections'); if(old)old.remove();
  const oldHub=$('#hub'); if(oldHub)oldHub.remove();
  const host=document.querySelector('.showcase'); if(!host)return;
  const wanted=['Wedding','Anniversary','Birthday','Baby','Muslim','Hindu','Sikh','Mehndi','Jagran','Festival','Music'];
  const sec=document.createElement('section');sec.id='lux2Collections';sec.className='lux2Collections';
  let html=`<div class="lux2Head"><span>EXPLORE COLLECTIONS</span><h2>Find the invitation that<br><em>feels like you.</em></h2><p>Curated cards in compact rails. Swipe on mobile or explore the complete collection.</p></div>`;
  wanted.forEach(cat=>{
    const list=getCards().filter(c=>c[0]===cat).slice(0,4);if(!list.length)return;
    const m=meta(cat);
    html+=`<section class="lux2Category" data-cat="${esc(cat)}"><div class="lux2CatHead"><div><strong>${m?esc(m[0])+' ':''}${esc(cat)}</strong><small>${m?esc(m[2]):'Curated invitation collection'}</small></div><button type="button" class="lux2ViewAll" data-cat="${esc(cat)}">View all <b>→</b></button></div><div class="lux2Rail">${list.map(cardHTML).join('')}</div></section>`;
  });
  sec.innerHTML=html;host.after(sec);
}

function exactSelect(c){
  if(!c)return;
  try{selectedCard=c;activeCategory=c[0]}catch(_){ }
  try{window.__UTSAVLY_SELECTED_CARD__=c}catch(_){ }
  const p=photo(c);
  try{
    const OCC={Birthday:'Birthday Celebration',Anniversary:'Anniversary Celebration',Muslim:'Eid Mubarak',Baby:'Baby Shower',Hindu:'Shubh Utsav',Festival:'Festival Celebration',Music:'Sangeet Night',Wedding:'Wedding Celebration'};
    const o=$('#occasion'); if(o&&(!o.value||Object.values(OCC).includes(o.value)))o.value=OCC[c[0]]||o.value;
    if(p&&p.fx&&$('#revealEffect'))$('#revealEffect').value=p.fx;
    const n=$('#names'),cn=$('#customNames'); if(n&&cn&&n.value&&!/Janu/.test(n.value)){cn.value=n.value;cn.dispatchEvent(new Event('input',{bubbles:true}))}
  }catch(_){ }
  try{
    const list=openingList(c[0]);
    const recommended=p&&p.o?list.find(o=>o[0]===p.o):null;
    if(recommended)selectedOpening=recommended;
    else if(!selectedOpening||!list.some(o=>o[0]===selectedOpening[0]))selectedOpening=list[0];
  }catch(_){ }
  try{renderFilters()}catch(_){ }
  try{renderCards()}catch(_){ }
  try{renderOpenings()}catch(_){ }
  openCustomizer();
}

function decorateCustomizer(c){
  const p=photo(c),L=$('#liveCard');if(!L||!p)return;
  const apply=()=>{
    L.classList.add('lux2LivePhoto');
    const img=`url(\"${String(p.img).replace(/\"/g,'%22')}\")`;
    if(L.style.backgroundImage!==img)L.style.setProperty('background-image',img,'important');
    if(L.style.backgroundSize!=='cover')L.style.setProperty('background-size','cover','important');
    const pos=`${p.x||50}% ${p.y||50}%`; if(L.style.backgroundPosition!==pos)L.style.setProperty('background-position',pos,'important');
    L.style.setProperty('--lux2Tint',typeof selectedColor!=='undefined'?selectedColor:'#B68B48');
    L.dataset.photoCard='1';
  };
  apply();
  if(L.__luxObs)L.__luxObs.disconnect();
  const ob=new MutationObserver(()=>{if(!L.dataset.luxRestoring){L.dataset.luxRestoring='1';apply();queueMicrotask(()=>delete L.dataset.luxRestoring)}});
  ob.observe(L,{attributes:true,attributeFilter:['style']});L.__luxObs=ob;
}

function patchCustomizer(){
  if(typeof openCustomizer!=='function'||openCustomizer.__lux2)return;
  const old=openCustomizer;
  function wrapped(){const r=old.apply(this,arguments);const c=window.__UTSAVLY_SELECTED_CARD__||(()=>{try{return selectedCard}catch(_){return null}})();setTimeout(()=>decorateCustomizer(c),0);return r}
  wrapped.__lux2=true;openCustomizer=wrapped;
}

function patchCinematic(){
  if(typeof openCinematic!=='function'||openCinematic.__lux2)return;
  const old=openCinematic;
  function wrapped(d){
    let c=window.__UTSAVLY_SELECTED_CARD__||(()=>{try{return selectedCard}catch(_){return null}})();
    if(!c&&d){c=getCards().find(x=>x[0]===d.category&&x[1]===d.card)}
    const data=Object.assign({},d||{});
    if(c){data.category=c[0];data.card=c[1];window.__UTSAVLY_SELECTED_CARD__=c;try{selectedCard=c;activeCategory=c[0]}catch(_){} }
    try{const list=openingList(data.category);const op=list.find(x=>x[0]===data.opening);if(op)data.opening=op[0];}catch(_){ }
    return old.call(this,data);
  }
  wrapped.__lux2=true;openCinematic=wrapped;
}

function bind(){
  try{if(!localStorage.getItem('utsavly-theme')){document.documentElement.classList.add('dark');document.body.classList.add('dark');}}catch(_){}
  patchCustomizer();patchCinematic();
  /* Authoritative card selection in capture phase: older delegated handlers cannot reset it. */
  document.addEventListener('click',e=>{
    const b=e.target.closest('.lux2Card .selectCard');
    if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();exactSelect(cardAt(b.closest('[data-card-index]').dataset.cardIndex));return;}
    const v=e.target.closest('.lux2ViewAll');
    if(v){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{activeCategory=v.dataset.cat}catch(_){}try{renderFilters();renderCards();renderOpenings()}catch(_){}document.querySelector('.collection')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  },true);
  const originalRender=typeof renderCards==='function'?renderCards:null;
  if(originalRender&&!originalRender.__lux2){
    const wrapped=()=>{const r=originalRender.apply(this,arguments);renderLuxuryGrid();return r};wrapped.__lux2=true;renderCards=wrapped;
  }
  /* Replace selection function after designer/cinema wrappers are loaded. */
  selectCard=exactSelect;
  rebuildCollections();renderLuxuryGrid();
  setTimeout(()=>{patchCustomizer();patchCinematic();rebuildCollections();renderLuxuryGrid();},120);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
