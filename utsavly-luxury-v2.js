(function(){
'use strict';
/*
 UTSAVLY LUXURY V2 — full late-loaded controller.
 Keeps existing app.js/designer.js/cinema.js and replaces only the visible
 collection/selection layer plus the cinematic opening choreography.
*/
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeCards=()=>{try{return Array.isArray(cards)?cards:[]}catch(e){return[]}};
const photo=c=>c&&c[7]&&c[7].img?c[7]:null;
const cats=()=>{try{return Array.isArray(categories)?categories:[]}catch(e){return[]}};
const wanted=['Wedding','Anniversary','Birthday','Baby','Muslim','Hindu','Sikh','Mehndi','Jagran','Festival','Music'];

const OPENINGS=[
 ['velvet-curtains','Velvet Curtains','Royal Cinematic','🎭','Deep velvet curtains close the stage, then glide apart to reveal the invitation.'],
 ['ocean-wave','Ocean Wave Reveal','Nature Cinematic','🌊','Cinematic waves rise over the invitation and pull back into the horizon.'],
 ['clouds-parting','Clouds Parting Reveal','Nature Cinematic','☁️','Soft clouds cover the stage, then part from the centre.'],
 ['rain-curtain','Rain Reveal','Nature Cinematic','🌧️','A rain curtain falls across the stage, then clears into the invitation.'],
 ['snow-frost','Snow Reveal','Nature Cinematic','❄️','Frost and snow drift across the frame before dissolving away.'],
 ['petal-bloom','Petal Bloom','Nature Cinematic','🌸','Petals bloom from the centre and sweep outward to uncover the card.'],
 ['wind-leaves','Wind & Leaves','Nature Cinematic','🍃','Leaves sweep across the frame on a cinematic gust of wind.'],
 ['galaxy-stars','Galaxy / Stars','Nature Cinematic','🌌','A star field gathers into a glowing galaxy and fades into the invitation.'],
 ['lightning','Lightning Reveal','Nature Cinematic','⚡','A dark sky flashes with lightning, then the invitation emerges from the glow.'],
 ['fire-spark','Fire / Spark Reveal','Nature Cinematic','🔥','Warm sparks rise through darkness and burn away into the invitation.'],
 ['palace-doors','Palace Doors','Royal Cinematic','👑','Two grand palace doors open inward to reveal the celebration.'],
 ['velvet-curtains','Velvet Curtains','Royal Cinematic','🎭','Heavy velvet curtains part slowly with a theatrical reveal.'],
 ['royal-ribbon','Royal Ribbon','Royal Cinematic','🎀','A satin ribbon unwraps across the frame and releases the invitation.'],
 ['royal-gate','Royal Gate','Royal Cinematic','🏰','A ceremonial gate opens from both sides with a warm royal glow.'],
 ['royal-mirror','Royal Mirror','Royal Cinematic','🪞','A gilded mirror assembles, catches the light, and opens into the card.'],
 ['luxury-letter','Luxury Letter','Classic','💌','A luxury envelope unfolds and the invitation rises from within.'],
 ['scroll-open','Scroll','Classic','📜','A parchment scroll rolls open from both sides to reveal the details.'],
 ['gift-box','Gift Box','Classic','🎁','A premium gift box opens with a soft glow and reveals the invitation.'],
 ['golden-spotlight','Golden Spotlight','Classic','✨','A single golden spotlight expands until the invitation is fully revealed.'],
 ['diya-reveal','Diya Reveal','Festival / Spiritual','🪔','A diya lights, its glow expands, and the invitation appears in the warmth.'],
 ['floral-temple','Floral Temple Reveal','Festival / Spiritual','🌺','A floral temple arch grows from both sides and opens onto the celebration.'],
 ['arch-reveal','Arch Reveal','Festival / Spiritual','🛕','A ceremonial arch forms in gold and opens into the invitation.'],
 ['celebration-burst','Celebration Burst','Festival / Spiritual','🎊','A restrained burst of celebration clears into the first invitation scene.']
];

const EFFECTS=[
 ['flowers','Flower Rain','🌸'],['snow','Snowfall','❄️'],['rain','Rainfall','🌧️'],
 ['fire','Fire Sparks','🔥'],['lightning','Lightning','⚡'],['none','Quiet Transition','✦']
];

function openingById(id){return OPENINGS.find(x=>x[0]===id)||OPENINGS[0]}
function categoryMeta(cat){return cats().find(x=>x[3]===cat)}
function mapOldOpening(id){
 const m={'arch-glow':'arch-reveal','wax-pull':'luxury-letter','lake-castle':'ocean-wave','mirror-crown':'royal-mirror','bell-split':'palace-doors','envelope':'luxury-letter'};
 return m[id]||id;
}
function cardPhoto(c){
 const p=photo(c);
 return p ? `<div class="luxCardVisual"><img src="${esc(p.img)}" alt="${esc(c[1])}" loading="lazy" decoding="async"><span class="luxShade"></span><span class="luxBadge">${esc(c[5]||'CURATED')}</span></div>` :
 `<div class="luxCardVisual luxGenerated" style="${generatedStyle(c)}"><span>${esc(c[3]||'✦')}</span><strong>${esc(c[1])}</strong><small>${esc(c[4]||'Luxury invitation')}</small></div>`;
}
function generatedStyle(c){
 try{const p=c[6]&&c[6].p;if(p)return `background:linear-gradient(145deg,${p[0]},${p[1]});color:${p[2]||'#f7ead3'}`;}catch(e){}
 return 'background:linear-gradient(145deg,#211b14,#090a09);color:#f7ead3';
}
function cardHTML(c){
 const i=safeCards().indexOf(c), m=categoryMeta(c[0]);
 return `<article class="luxCard" data-card-index="${i}">
   ${cardPhoto(c)}
   <div class="luxCardInfo"><div class="luxMeta">${esc(c[0])}</div><h3>${esc(c[1])}</h3>
   <button type="button" class="luxSelect">Select & Customize <span>→</span></button></div>
 </article>`;
}
function collectionCards(cat){
 const all=safeCards().filter(c=>c[0]===cat);
 const photos=all.filter(c=>photo(c));
 const rest=all.filter(c=>!photo(c));
 return [...photos,...rest];
}
function renderHome(){
 const showcase=$('.showcase'); if(!showcase)return;
 $('#lux2Collections')?.remove(); $('#hub')?.remove();
 const sec=document.createElement('section'); sec.id='lux2Collections'; sec.className='luxCollections';
 let html=`<div class="luxHeroHead"><span>UTSAVLY · LUXURY COLLECTIONS</span><h2>Invitations made to<br><em>feel unforgettable.</em></h2><p>Choose a card, customise it, then build a cinematic reveal.</p></div>`;
 wanted.forEach(cat=>{
   const list=collectionCards(cat).slice(0,4); if(!list.length)return;
   const m=categoryMeta(cat);
   html+=`<section class="luxCollection" data-category="${esc(cat)}">
    <div class="luxCollectionHead"><div><span>${m?esc(m[0]):'✦'} ${esc(cat)}</span><small>${m?esc(m[2]):'Curated collection'}</small></div>
    <button type="button" class="luxViewAll" data-view="${esc(cat)}">View all <b>→</b></button></div>
    <div class="luxRail">${list.map(cardHTML).join('')}</div>
   </section>`;
 });
 sec.innerHTML=html; showcase.after(sec);
}
function renderAll(cat){
 try{activeCategory=cat;renderFilters();renderCards();}catch(e){}
 const host=$('#cardGrid'); if(!host)return;
 const list=collectionCards(cat);
 host.innerHTML=`<div class="luxAllHead"><div><span>FULL COLLECTION</span><h3>${esc(cat)}</h3><p>Swipe on mobile or explore the complete collection.</p></div><b>${list.length} DESIGNS</b></div><div class="luxAllGrid">${list.map(cardHTML).join('')}</div>`;
 document.querySelector('.collection')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function selectExact(c){
 if(!c)return;
 try{selectedCard=c;activeCategory=c[0]}catch(e){}
 window.__UTSAVLY_SELECTED_CARD__=c;
 const p=photo(c);
 try{
   const op=mapOldOpening(p&&p.o);
   const found=openingById(op);
   selectedOpening=[found[0],found[1],found[2],found[3],found[4],found[2].toLowerCase().includes('nature')?'nature':found[2].toLowerCase().includes('royal')?'royal':found[2].toLowerCase().includes('classic')?'classic':'festival'];
   if($('#revealEffect')&&p&&p.fx)$('#revealEffect').value=p.fx;
 }catch(e){}
 try{renderOpenings()}catch(e){}
 try{openCustomizer()}catch(e){}
 setTimeout(()=>applySelectedPhoto(c),20);
}
function applySelectedPhoto(c){
 const p=photo(c), live=$('#liveCard'); if(!p||!live)return;
 live.style.setProperty('background-image',`url("${p.img}")`,'important');
 live.style.setProperty('background-size','cover','important');
 live.style.setProperty('background-position',`${p.x||50}% ${p.y||50}%`,'important');
 live.classList.add('luxLivePhoto');
}
function patchCustomizer(){
 if(typeof openCustomizer!=='function'||openCustomizer.__luxFinal)return;
 const old=openCustomizer;
 function wrapped(){
   const r=old.apply(this,arguments);
   const c=window.__UTSAVLY_SELECTED_CARD__;
   setTimeout(()=>{if(c)applySelectedPhoto(c);renderLuxuryOpenings();},30);
   return r;
 }
 wrapped.__luxFinal=true; openCustomizer=wrapped;
}
function renderLuxuryOpenings(){
 const host=$('#openings'); if(!host)return;
 const selected=(()=>{try{return selectedOpening?.[0]}catch(e){return''}})();
 let last='';
 host.innerHTML=OPENINGS.map((o,i)=>{
   const group=o[2];
   const head=group!==last?(last=group,`<div class="luxOpeningGroup"><b>${esc(group)}</b><small>Choose the opening choreography. Every style has its own animation.</small></div>`):'';
   return head+`<article class="luxOpening ${selected===o[0]?'isSelected':''}" data-open-id="${o[0]}">
    <div class="luxOpeningVisual opening-preview-${o[0]}"><span>${o[3]}</span><b>Janu <em>♡</em> Janvi</b></div>
    <div class="luxOpeningInfo"><div><strong>${esc(o[1])}</strong><small>${esc(o[4])}</small></div><button type="button" class="luxChoose">${selected===o[0]?'Selected ✓':'Choose'}</button></div>
   </article>`;
 }).join('');
 $$('#openings .luxChoose').forEach(b=>b.addEventListener('click',()=>{
   const id=b.closest('.luxOpening').dataset.openId, o=openingById(id);
   selectedOpening=[o[0],o[1],o[2],o[3],o[4],o[2].toLowerCase().includes('nature')?'nature':o[2].toLowerCase().includes('royal')?'royal':o[2].toLowerCase().includes('classic')?'classic':'festival'];
   try{track('opening_selected',{opening:o[1],category:activeCategory})}catch(e){}
   renderLuxuryOpenings();
 }));
}
function patchCinematic(){
 if(typeof openCinematic!=='function'||openCinematic.__luxFinal)return;
 const old=openCinematic;
 function wrapped(d){
   const c=window.__UTSAVLY_SELECTED_CARD__||selectedCard;
   const data=Object.assign({},d||{});
   if(c){data.category=c[0];data.card=c[1]}
   try{data.opening=selectedOpening?.[0]||data.opening}catch(e){}
   const result=old.call(this,data);
   setTimeout(()=>enhanceCinema(data,c),25);
   return result;
 }
 wrapped.__luxFinal=true; openCinematic=wrapped;
}
function buildOpeningMarkup(id){
 const label=openingById(id);
 return `<div class="luxChoreo luxChoreo-${esc(id)}" aria-hidden="true">
   <div class="choreoBg"></div><div class="choreoA"></div><div class="choreoB"></div><div class="choreoC"></div>
   <div class="choreoIcon">${label[3]}</div><div class="choreoLabel">${esc(label[1])}</div>
 </div>`;
}
function enhanceCinema(data,c){
 const root=$('.cinemaExperience'); if(!root)return;
 const stage=$('.openingStage',root), first=$('.scene-opening',root);
 if(!stage||!first)return;
 const opening=mapOldOpening(data.opening||selectedOpening?.[0]||'luxury-letter');
 root.dataset.luxuryOpening=opening;
 stage.className=`openingStage opening-stage-${esc(opening)} luxStage`;
 stage.innerHTML=buildOpeningMarkup(opening);
 const next=first.querySelector('.sceneNext');
 if(next){
   next.disabled=true; next.classList.add('luxLockedNext'); next.style.pointerEvents='none'; next.style.opacity='.25';
   setTimeout(()=>{
     next.disabled=false; next.classList.remove('luxLockedNext'); next.style.pointerEvents='auto'; next.style.opacity='1';
     first.classList.add('luxOpeningDone');
     const extra=first.querySelector('.sceneExtra'); if(extra)extra.textContent='Opening complete · Tap to reveal the date';
   },4200);
 }
 root.classList.add('luxCinemaReady');
 // Make the exact selected photo visible as the invitation motif on later scenes.
 const p=photo(c);
 if(p){
   root.style.setProperty('--luxCardImage',`url("${p.img}")`);
   root.dataset.selectedPhoto=p.img;
 }
}
function bind(){
 document.documentElement.classList.add('luxMode');
 patchCustomizer(); patchCinematic();
 document.addEventListener('click',e=>{
   const select=e.target.closest('.luxCard .luxSelect');
   if(select){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const c=safeCards()[Number(select.closest('.luxCard').dataset.cardIndex)];selectExact(c);return;}
   const all=e.target.closest('.luxViewAll');
   if(all){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();renderAll(all.dataset.view);return;}
 },true);
 try{selectCard=selectExact}catch(e){}
 renderHome();
 renderLuxuryOpenings();
 setTimeout(()=>{patchCustomizer();patchCinematic();renderHome();renderLuxuryOpenings()},180);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
