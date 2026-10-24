/* UTSAVLY v3 — floral hero, compact category lines, openings line. Loaded last. */
(function(){
'use strict';
var P=window.UtsavlyPlayer,ST=window.UtsavlyStudio;
var $=function(s,r){return (r||document).querySelector(s)};
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

/* ---------- default theme = dark ---------- */
try{if(!localStorage.getItem('utsavly-theme')&&typeof setTheme==='function')setTheme('dark')}catch(e){}

/* ---------- floral hero ---------- */
var SLIDES=[
 {c:'s-roses',img:'images/fl-roses.webp',L:['right bottom',1],R:['right bottom',0]},
 {c:'s-pink',img:'images/fl-pink.webp',L:['left bottom',0],R:['left bottom',1]},
 {c:'s-blossom',img:'images/fl-blossom.webp',L:['left bottom',0],R:['right bottom',0]},
 {c:'s-blue',img:'images/fl-blue.webp',L:['right bottom',1],R:['right bottom',0]}
];
function buildHero(){
  var hero=$('.hero');if(!hero||$('.vfl',hero))return;
  var wrap=document.createElement('div');wrap.className='vfl';wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML='<div class="vfl-dust"></div>'+SLIDES.map(function(s,i){
    var side=function(cls,d){return '<i class="'+cls+(d[1]?' flip':'')+'" style="background-image:url('+s.img+');background-position:'+d[0]+'"></i>'};
    return '<div class="vfl-slide '+s.c+(i?'':' on')+'">'+side('l',s.L)+side('r',s.R)+'</div>';
  }).join('');
  hero.insertBefore(wrap,hero.firstChild);
  var dots=document.createElement('div');dots.className='vdots';
  dots.innerHTML=SLIDES.map(function(s,i){return '<button aria-label="Flower design '+(i+1)+'" class="'+(i?'':'on')+'"></button>'}).join('');
  hero.appendChild(dots);
  var cur=0,slides=wrap.querySelectorAll('.vfl-slide'),db=dots.querySelectorAll('button'),t=null;
  function go(n){slides[cur].classList.remove('on');db[cur].classList.remove('on');cur=(n+SLIDES.length)%SLIDES.length;slides[cur].classList.add('on');db[cur].classList.add('on')}
  function run(){clearInterval(t);t=setInterval(function(){if(!document.hidden)go(cur+1)},6500)}
  dots.onclick=function(e){var b=e.target.closest('button');if(!b)return;go([].indexOf.call(db,b));run()};
  run();
}

/* ---------- compact card lines ---------- */
function allCards(){try{return cards}catch(e){return []}}
function isPrem(c){return String(c[5]||'').toUpperCase().indexOf('PREM')===0}
var KEEP_TPL=['Temple Bell Gold','Royal Archway'];
var ORDER=['Wedding','Diwali','Hindu','Muslim','Sikh','Birthday','Anniversary','Baby','Mehndi','Music','Festival','Jagran','Christian','Christmas','Corporate'];
function meta(cat){try{var m=categories.find(function(x){return x[3]===cat||x[1]===cat});return m}catch(e){return null}}
var EMOJI={Diwali:'🪔',Wedding:'💍',Hindu:'🪔',Muslim:'🌙',Sikh:'🙏',Birthday:'🎂',Anniversary:'💞',Baby:'👶',Mehndi:'🌿',Music:'🎶',Festival:'🎆',Jagran:'🔔',Christian:'⛪',Christmas:'🎄',Corporate:'💼'};
/* own image loader: native lazy-loading is unreliable inside sideways rails */
var IO=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var im=en.target;IO.unobserve(im);var s=im.getAttribute('data-src');if(s&&!im.src)im.src=s}})},{rootMargin:'300px 700px 300px 700px'}):null;
function lazyWatch(im){if(IO)IO.observe(im);else im.src=im.getAttribute('data-src')}
function preloadAll(){var q=[].slice.call(document.querySelectorAll('.v3Rail img[data-src]')),i=0;(function step(){var n=0;while(i<q.length&&n<10){var im=q[i++];if(!im.src){im.src=im.getAttribute('data-src');n++}}if(i<q.length)setTimeout(step,220)})()}
function loadAllVisibleSoon(){setTimeout(preloadAll,500);setTimeout(function(){[].forEach.call(document.querySelectorAll('.v3Rail img[data-src]'),function(im){if(!im.src){var r=im.getBoundingClientRect();if(r.top<innerHeight*3&&r.bottom>-innerHeight)im.src=im.getAttribute('data-src')}})},1800)}
function cardEl(c,idx){
  var b=document.createElement('button');b.type='button';b.className='v3Card';b.dataset.i=idx;b.setAttribute('aria-label','Select '+c[1]);
  var art=document.createElement('span');art.className='v3Art';
  var x=c[7];
  if(x&&x.img){var im=new Image();im.decoding='async';im.alt='';im.setAttribute('data-src',x.img.replace(/images\/([^\/]+)$/,'images/t/$1'));im.setAttribute('data-full',x.img);im.onerror=function(){if(im.dataset.full&&im.src.indexOf('/t/')>-1)im.src=im.dataset.full};art.appendChild(im);lazyWatch(im)}
  else if(ST&&ST.artFromCard&&P){
    var el=P.buildCard({art:ST.artFromCard(c),font:'Great Vibes'});
    el.__zone.innerHTML='<h2 class="upz-names" style="--nfs:15em">Janu &amp; Janvi</h2>';
    art.appendChild(el);
  }
  var bd=document.createElement('em');bd.className='v3Badge'+(isPrem(c)?'':' free');bd.textContent=isPrem(c)?'PREMIUM':'FREE';bd.style.fontStyle='normal';art.appendChild(bd);
  b.appendChild(art);
  var n=document.createElement('b');n.textContent=c[1];b.appendChild(n);
  return b;
}
function rowEl(id,title,list,cls){
  var s=document.createElement('section');s.className='v3Row '+(cls||'');s.id='row-'+id;
  s.innerHTML='<div class="v3RowHead"><b>'+esc(title)+'</b><small>'+list.length+' DESIGNS · SWIPE →</small></div>';
  var rail=document.createElement('div');rail.className='v3Rail';
  list.forEach(function(it){rail.appendChild(cardEl(it.c,it.i))});
  s.appendChild(rail);return s;
}
function buildCards(){
  var host=$('.showcase');if(!host)return;
  var old=document.getElementById('v3Cards');if(old)old.remove();
  var all=allCards().map(function(c,i){return {c:c,i:i}}).filter(function(it){return it.c[7]||KEEP_TPL.indexOf(it.c[1])>-1});
  var by={};all.forEach(function(it){(by[it.c[0]]=by[it.c[0]]||[]).push(it)});
  var cats=ORDER.filter(function(k){return by[k]}).concat(Object.keys(by).filter(function(k){return ORDER.indexOf(k)<0}));
  var prem=all.filter(function(it){return isPrem(it.c)&&it.c[7]}); // most luxurious photo cards
  var sec=document.createElement('section');sec.id='v3Cards';
  sec.innerHTML='<div class="v3Head"><p class="eyebrow">02 / CARD COLLECTIONS</p><h2>Pick a card. <em>Make it yours.</em></h2><p>Swipe each line sideways. Premium shows the most luxurious designs; the rest are free.</p></div>';
  var chips=document.createElement('div');chips.className='v3Chips';
  var chipDefs=[{id:'premium',t:'👑 Premium'}].concat(cats.map(function(k){return {id:k,t:(EMOJI[k]||'✦')+' '+k}})).concat([{id:'openings',t:'🎭 Openings'}]);
  chips.innerHTML=chipDefs.map(function(d,i){return '<button data-id="'+esc(d.id)+'" class="'+(i?'':'on')+'">'+esc(d.t)+'</button>'}).join('');
  sec.appendChild(chips);
  if(prem.length)sec.appendChild(rowEl('premium','👑 Premium',prem,'prem'));
  cats.forEach(function(k){
    var l=by[k].slice().sort(function(a,b){return (isPrem(b.c)?1:0)-(isPrem(a.c)?1:0)});
    sec.appendChild(rowEl(k,(EMOJI[k]||'✦')+' '+k,l));
  });
  // openings line
  var op=document.createElement('section');op.className='v3Row openings';op.id='row-openings';
  op.innerHTML='<div class="v3RowHead"><b>🎭 How your invitation opens</b><small>'+P.OPENINGS.length+' OPENINGS · TAP TO PREVIEW</small></div>';
  var rail=document.createElement('div');rail.className='v3Rail';
  P.OPENINGS.forEach(function(o){
    var b=document.createElement('button');b.type='button';b.className='v3Card';b.dataset.op=o.id;b.setAttribute('aria-label','Preview '+o.name);
    b.innerHTML='<span class="v3Tile" style="background:linear-gradient(135deg,'+o.tile[0]+','+o.tile[1]+')">'+o.icon+'<i class="v3Play">▶</i></span><b>'+esc(o.name)+'</b><small>'+esc(P.GROUPS[o.group]||'').replace(/^[^ ]+ /,'').toUpperCase()+'</small>';
    rail.appendChild(b);
  });
  op.appendChild(rail);
  var note=document.createElement('p');note.className='v3Note';note.textContent='Pick your opening after you choose a card — every card works with every opening.';op.appendChild(note);
  sec.appendChild(op);
  host.after(sec);

  // interactions
  sec.addEventListener('click',function(e){
    var ch=e.target.closest('.v3Chips button');
    if(ch){var row=document.getElementById('row-'+ch.dataset.id);if(row)row.scrollIntoView({behavior:'smooth',block:'start'});return}
    var oc=e.target.closest('[data-op]');
    if(oc){previewOpening(oc.dataset.op);return}
    var cd=e.target.closest('.v3Card[data-i]');
    if(cd){var c=allCards()[+cd.dataset.i];if(!c)return;window.__UTSAVLY_SELECTED_CARD__=c;try{selectedCard=c;activeCategory=c[0]}catch(x){}try{track('card_selected',{card:c[1],category:c[0]})}catch(x){}
      if(ST&&ST.open)ST.open();else if(typeof openCustomizer==='function')openCustomizer()}
  });
  // active chip follows scroll
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var id=en.target.id.replace('row-','');[].forEach.call(chips.children,function(b){b.classList.toggle('on',b.dataset.id===id)});var on=chips.querySelector('.on');if(on&&on.scrollIntoView)chips.scrollTo({left:on.offsetLeft-30,behavior:'smooth'})}})},{rootMargin:'-130px 0px -65% 0px'});
    sec.querySelectorAll('.v3Row').forEach(function(r){io.observe(r)});
  }
}
function previewOpening(id){
  var c=(ST&&ST.defaultCard)?ST.defaultCard('Wedding'):null;
  P.open({art:(ST&&ST.artFromCard)?ST.artFromCard(c):{},names:'Janu & Janvi',occasion:'Wedding Celebration',date:'2027-04-18',time:'19:00',venue:'Your venue',opening:id,font:'Great Vibes',music:'none',site:location.origin+'/'},{openingOnly:true,autoOpen:false});
}

/* old drawer: jump to the matching line */
document.addEventListener('click',function(e){
  if(e.target.closest('#catList .cat,#catList button,#catList [data-cat]')){
    setTimeout(function(){try{var row=document.getElementById('row-'+activeCategory);if(row)row.scrollIntoView({behavior:'smooth',block:'start'})}catch(x){}},380);
  }
},true);

function init(){buildHero();buildCards();loadAllVisibleSoon()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){init();setTimeout(init,450)});else{init();setTimeout(init,450)}
})();
