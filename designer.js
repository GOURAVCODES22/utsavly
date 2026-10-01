
(function(){
  const add=[
    ['Birthday','Powder Blue Butterfly','v25-powderblue','🦋','Torn-paper note, sheer ribbon, butterflies & baby\u2019s-breath','PREMIUM'],
    ['Birthday','Navy Watercolor Ink','v25-navywash','✦','Deep navy wash, gold flecks & fine double border','FREE'],
    ['Birthday','Champagne Candle Glow','v25-champagne','🕯','Ivory cake, gold-leaf edge, fairy lights & silk','PREMIUM'],
    ['Birthday','Rose Gold Balloons','v25-rosegold','🎈','Metallic balloons, blush roses & fine gold frame','FREE'],
    ['Birthday','Royal Cameo Relief','v25-cameo','👑','Embossed cameo oval, pearls, ribbon & gilded filigree','PREMIUM'],
    ['Birthday','Pink Castle Lake','v25-castle','🏰','Fairytale castle, mirror lake, swans & cherry blossom','PREMIUM'],
    ['Birthday','Gilded Mirror Crown','v25-mirror','👑','Blue-gold baroque frame, crown & floating glitter','PREMIUM'],
    ['Muslim','Hijri Arch Glow','v25-hijri','☾','Lit arch window, crescent moon & mosque at dusk','PREMIUM'],
    ['Muslim','Cream Nikkah Envelope','v25-nikkah','✉','Cream envelope, wax seal & dried baby\u2019s-breath','PREMIUM'],
    ['Wedding','Temple Bell Gold','v25-temple','🔔','Embossed antique gold bell, ruby monogram & diamonds','PREMIUM'],
    ['Wedding','Carved Wooden Door','v25-door','🚪','Jharokha arch door, brass lamps & warm marigold light','PREMIUM'],
    ['Music','Midnight Mandala','v25-mandala','❂','Indigo night, gold mandala & line-art petals','FREE']
  ];
  const open=[
    ['bell-split','Temple Bell Split','Two embossed gold halves part to reveal names in a jewelled glow.','🔔'],
    ['arch-glow','Glowing Arch Window','A light arch fades in; dusk skyline rises behind the moon.','◠'],
    ['wax-pull','Wax Seal Pull','Seal lifts, envelope slides away, the invitation unfolds.','✉'],
    ['lake-castle','Castle Lake Ripple','Ripples spread across the lake as the castle gates welcome guests.','🏰'],
    ['mirror-crown','Crowned Mirror Reveal','A gilded mirror lights up under a floating crown.','👑']
  ];
  const map={Wedding:['bell-split','wax-pull'],Muslim:['arch-glow','wax-pull'],Birthday:['lake-castle','mirror-crown','wax-pull'],Music:['arch-glow']};
  try{
    add.forEach(c=>{if(!cards.some(x=>x[1]===c[1]))cards.push(c)});
    Object.keys(map).forEach(cat=>{
      openingSets[cat]=openingSets[cat]||[];
      map[cat].forEach(k=>{const o=open.find(x=>x[0]===k);if(!openingSets[cat].some(x=>x[0]===k))openingSets[cat].push(o)});
    });
    renderCards();
    if(typeof renderOpenings==='function')try{renderOpenings()}catch(e){}
  }catch(e){console.warn('UTSAVLY V25 registration skipped',e)}
})();


(function(){
const R=`Wedding|Royal Archway|gate|#5a1420|#240810|#ffe7b0|#e0b25a|Cinzel|❖|Janu & Janvi|Carved palace doors in maroon & antique gold|P
Wedding|Jharokha Blush|arch|#fbe6df|#f1c3b8|#5a2a2a|#c4885a|Allura|❀|Janu & Janvi|Rajasthani arch window in blush & copper|F
Wedding|Ruby Monogram Foil|foil|#f6efe0|#e8d9b8|#6b1020|#b8923a|Bodoni Moda|♛|J & J|Double gold foil border & ruby crest|P
Birthday|Confetti Pop|party|#ffe3f0|#ffd2a8|#7a1f4e|#ff5c8a|DM Serif Display|🎉|Happy Birthday|Playful confetti, bold type & candy colours|F
Birthday|Polaroid Memory|polaroid|#d9e8f5|#bcd3ea|#24405f|#e8b4c0|Parisienne|📷|Happy Birthday|Taped photo frame for your favourite picture|F
Birthday|Pearl Oval Frame|oval|#fdf1e6|#f4d6cc|#7a4a3a|#d4a85a|Great Vibes|♡|Happy Birthday|Beaded oval frame with warm blush glow|P
Muslim|Eid Moonlight|night|#0d1530|#2a2a5a|#f6e7bd|#f3c969|Cormorant SC|☾|Eid Mubarak|Crescent, stars & lantern-light night sky|P
Muslim|Nikah Mehrab|arch|#14352f|#0a1f1c|#f2e3b8|#c9a24e|Marcellus|✦|Nikah Ceremony|Emerald mehrab arch with gold light|P
Muslim|Walima Gold Foil|foil|#fff7ea|#f1e0c0|#2b4a3a|#b8923a|Cormorant SC|❖|Walima|Cream & gold double-foil border|F
Hindu|Diya Glow|diya|#3a1206|#120503|#ffe2a8|#ffb02e|Prata|🪔|Shubh Aarambh|A single flame glowing in the dark|P
Hindu|Rangoli Mandala|mandala|#fff0d6|#ffc78a|#6a1b0a|#d6341c|Playfair Display|✺|Shubh Vivah|Rangoli rings in saffron & vermilion|F
Hindu|Temple Gopuram|gate|#7a2a0e|#2b0e05|#ffe1a6|#f0b44a|Cinzel|ॐ|Griha Pravesh|Temple gateway lit with brass lamps|P
Sikh|Khanda Saffron|khanda|#0f2a6b|#071a45|#fff3d6|#f59e0b|Marcellus|☬|Anand Karaj|Royal blue & kesari bands with khanda|P
Sikh|Phulkari Bloom|mandala|#a31d3a|#5c0e22|#ffe8ec|#ffb703|Playfair Display|❀|Waheguru Ji|Phulkari-style stitched bloom|F
Sikh|Gurpurab Light|diya|#10264f|#061226|#ffeec5|#ffc247|Cormorant SC|☬|Gurpurab|Golden jyot on deep Nanak blue|F
Christian|Stained Glass Arch|arch|#27285f|#7a2f6e|#fff0d6|#f5c451|Cinzel|✝|Holy Matrimony|Jewel-tone arch like a cathedral window|P
Christian|Cathedral Cream|foil|#faf6ee|#e9e0cf|#3b3a4a|#9a8456|Libre Baskerville|✝|Baptism|Quiet cream paper with fine double rule|F
Christian|Dove of Peace|cloud|#dfeaf8|#fdf2f4|#3a4f73|#e9b8c6|Allura|🕊|First Communion|Soft clouds & a white dove|F
Christmas|Winter Wreath|wreath|#0f3b2e|#06201a|#fbf0dc|#d94b4b|Great Vibes|🎄|Merry Christmas|Evergreen ring with red berries|P
Christmas|Starry Noel|night|#101a3a|#243a6e|#fff6dd|#ffd166|Cinzel|★|Season's Greetings|Midnight blue star-lit sky|F
Christmas|Candy Cane Ticket|ticket|#fff3f3|#ffd9d9|#a3121a|#16803c|DM Serif Display|🎁|Christmas Party|Admit-one ticket with perforated edge|F
Baby|Cloud Lullaby|cloud|#e6f1fb|#fdeef3|#4a5f86|#f4b6c8|Parisienne|☁|Baby Shower|Pastel clouds & dreamy script|F
Baby|Little Star|night|#f6e7ff|#cfe0ff|#4a3d78|#ffd166|Allura|★|Twinkle Twinkle|Lavender night with tiny stars|F
Baby|Balloon Pastel|party|#fff3e0|#d9f0ff|#4d5d78|#ff9eb5|DM Serif Display|🎈|Welcome Baby|Pastel balloons & sprinkles|F
Graduation|Scroll Ticket|ticket|#101b3b|#1d3166|#f4e2b0|#d4af37|Bodoni Moda|🎓|Class of 2027|Admit-one ticket in navy & gold|P
Graduation|Navy Monogram|mono|#f5f7fb|#dce3f1|#14224a|#c9a24e|Playfair Display|🎓|Graduation|Giant editorial monogram|F
Graduation|Polaroid Class|polaroid|#fdeedd|#f6c9a8|#3a2a1c|#2f6f6f|Parisienne|📷|We Did It!|Taped photo frame in warm film tones|F
Housewarming|Home Sweet Glow|home|#fff2d9|#f6c98e|#5a3416|#e07a1f|Playfair Display|🏡|Griha Pravesh|House silhouette with a warm window|F
Housewarming|Brass Door Gate|gate|#2f4a3a|#14241c|#f2e2b4|#c9a24e|Cinzel|✦|Welcome Home|Green carved door with brass lamps|P
Housewarming|Botanical Paper|torn|#e8efe2|#cddcc4|#2e4a34|#6b8f5e|Alex Brush|❦|Housewarming|Torn botanical paper & ribbon|F
Mehndi|Henna Mandala|mandala|#fff4e2|#f1c58c|#5a2a0e|#9a4b12|Allura|❂|Mehndi Night|Henna rings in warm sepia|F
Mehndi|Marigold Wreath|wreath|#fff3b0|#ffc94a|#6a3a05|#e8590c|Great Vibes|✿|Haldi|Marigold garland ring|P
Mehndi|Paisley Arch|arch|#1f5a3a|#0d3322|#f6e8c0|#e9b949|Marcellus|❦|Mehndi Sangeet|Green paisley arch with gold edge|F
Music|Qawwali Night|night|#1a0f33|#3b1f5e|#f1dcff|#e0b0ff|Cormorant SC|♪|Qawwali Raat|Violet night with rising sparks|P
Music|Sangeet Disco|party|#1d1043|#6a1b9a|#ffe9ff|#ff4fd8|DM Serif Display|🪩|Sangeet Night|Neon confetti dance-floor mood|P
Music|Gold Vinyl|oval|#16130f|#2f2820|#f1dfae|#d4af37|Bodoni Moda|♫|Live Concert|Vinyl-style oval with gold groove|F
Jagran|Jyot Diya|diya|#2a0d05|#0c0402|#ffd9a0|#ff9f1c|Prata|🪔|Mata Ka Jagran|Divine jyot on a dark altar|P
Jagran|Sherawali Gate|gate|#a3151f|#4a070d|#ffe9b8|#f2b632|Cinzel|ॐ|Jai Mata Di|Red temple gate with golden trim|P
Jagran|Om Mandala|mandala|#fff1d0|#ffc15a|#7a1a05|#c2410c|Playfair Display|ॐ|Satsang|Saffron Om mandala|F
Festival|Diwali Lights|diya|#1b0b3a|#4a1d6e|#ffe9b3|#ffb703|Great Vibes|🪔|Happy Diwali|Rows of lamps on royal purple|P
Festival|Holi Colour Pop|party|#fff0f5|#fff5cc|#6a1b6a|#e91e63|DM Serif Display|🎨|Happy Holi|Colour-burst confetti|F
Festival|Garba Wheel|mandala|#4b0f4e|#a3185f|#ffe8f3|#ffcc33|Marcellus|❂|Navratri Garba|Spinning garba rings in magenta|P
Anniversary|Silver Jubilee Foil|foil|#f4f6fa|#d5dbe6|#2b3447|#8e9bb0|Bodoni Moda|25|25 Years Together|Silver double-foil frame & pearl corners|P
Anniversary|Golden 50th Oval|oval|#fff4d6|#f0cf7a|#5a3c06|#c9a227|Great Vibes|50|Golden Jubilee|Beaded gold oval with warm halo|P
Anniversary|Rose & Ribbon|torn|#fbe3e6|#f3bcc6|#7a2438|#d4607a|Allura|♡|Happy Anniversary|Torn blush paper, roses & satin bow|F
Anniversary|Candlelit Dinner|night|#2a0a14|#5a1428|#ffe3d0|#ff9f6b|Cormorant SC|♡|Our Love Story|Burgundy night with candle glow|P
Anniversary|Love Letter|letter|#f8efe0|#ead7b8|#6b2a2a|#b5443b|Parisienne|✉|Happy Anniversary|Wax-sealed love-letter envelope|F
Corporate|Executive Monogram|mono|#f4f4f2|#dcdcd6|#111827|#b08d3c|Playfair Display|◼|Annual Dinner|Giant letter, razor-thin rule|F
Corporate|Launch Ticket|ticket|#0b1220|#16233f|#e8eefc|#38bdf8|Raleway|🚀|Product Launch|Access pass with cyan edge|P
Corporate|Black Gold Foil|foil|#0c0c0c|#1c1a14|#f0dca0|#c9a24e|Cinzel|✦|Gala Evening|Black card, double gold foil|P`.split('\n');
if(!categories.some(c=>c[3]==='Anniversary'))categories.splice(2,0,['💞','Anniversary','Silver & golden jubilee, milestones & love stories','Anniversary']);
const base=cards.filter(c=>/^v25-/.test(c[2]));
const add=R.map(r=>{const p=r.split('|');return [p[0],p[1],'theme-ivory',p[8],p[10],p[11]==='P'?'PREMIUM':'FREE',{l:p[2],p:[p[3],p[4],p[5],p[6]],f:p[7],t:p[9]}]});
cards.splice(0,cards.length,...base,...add,...(window.PHOTO_CARDS||[]));

const S=(b,p)=>`<svg viewBox="0 0 100 100" fill="currentColor">${b}</svg>`;
const DL={
fl:'<g opacity=".92">'+[0,60,120,180,240,300].map(a=>`<ellipse cx="50" cy="27" rx="12" ry="21" transform="rotate(${a} 50 50)"/>`).join('')+'</g><circle cx="50" cy="50" r="9" fill="#ffe9a8"/><circle cx="50" cy="50" r="4" fill="#c98a1a"/>',
bf:'<path d="M50 50C30 8 4 18 11 44C15 60 38 62 50 50ZM50 50C70 8 96 18 89 44C85 60 62 62 50 50ZM50 50C38 56 22 78 34 88C42 92 50 70 50 50ZM50 50C62 56 78 78 66 88C58 92 50 70 50 50Z" opacity=".9"/><path d="M50 40V70" stroke="#0007" stroke-width="3"/>',
bow:'<path d="M50 50C22 22 2 34 8 56C14 74 40 64 50 50ZM50 50C78 22 98 34 92 56C86 74 60 64 50 50Z"/><path d="M50 50L34 94L46 82ZM50 50L66 94L54 82Z"/><circle cx="50" cy="50" r="8" fill="#fff6"/>',
sp:'<path d="M50 98C48 70 40 40 20 10M48 70C60 55 72 40 82 20M44 50C30 44 18 40 8 30" fill="none" stroke="currentColor" stroke-width="2"/>'+[[20,10],[27,24],[34,38],[82,20],[74,34],[66,48],[8,30],[20,40],[30,46],[14,18],[88,30],[60,60]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.5" fill="#fff" stroke="currentColor"/>`).join(''),
pr:[[8,40],[18,28],[30,20],[44,16],[58,16],[72,20],[84,28],[93,40]].map(([x,y])=>`<circle cx="${x}" cy="${y+30}" r="5.5" fill="#fff" stroke="currentColor" stroke-width="1.5"/>`).join(''),
st:'<path d="M50 0L58 42L100 50L58 58L50 100L42 58L0 50L42 42Z"/>',
lf:'<path d="M50 96C8 70 8 26 50 4C92 26 92 70 50 96Z"/><path d="M50 12V92" stroke="#0005" stroke-width="2"/>',
fil:'<g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 96C4 40 40 4 96 4"/><path d="M4 72C4 44 28 20 56 20"/><path d="M22 96C22 56 56 22 96 22"/><path d="M12 12C28 12 30 30 16 32C6 33 6 18 18 20"/></g><circle cx="12" cy="12" r="4"/><circle cx="52" cy="52" r="3"/>',
hr:'<path d="M50 90C10 60 4 32 24 20C38 12 50 24 50 32C50 24 62 12 76 20C96 32 90 60 50 90Z"/>'
};
const DC={Wedding:['fil','fl','pr','st'],Birthday:['fl','bf','bow','pr','sp'],Anniversary:['fl','hr','bow','pr'],Muslim:['st','fil','lf','pr'],Hindu:['fil','fl','st','lf'],Jagran:['fil','fl','st'],Festival:['st','fl','fil'],Sikh:['fl','fil','st'],Christian:['lf','st','fil','sp'],Christmas:['st','lf','pr'],Baby:['st','bf','fl','sp'],Mehndi:['fl','lf','fil'],Graduation:['st','fil','lf'],Corporate:['st','fil'],Music:['st','fil'],Housewarming:['lf','fl','sp','fil']};
const POS=['p0','p1','p2','p3','p4','p5'];
const decor=(c,k)=>{const L=DC[c[0]]||['st','fil'],n=3+(k%2);return '<div class="dc">'+Array.from({length:n},(_,i)=>{const t=L[(k+i)%L.length];return `<svg class="${POS[(i+k)%4]} d-${t}" viewBox="0 0 100 100" fill="currentColor">${DL[t]}</svg>`}).join('')+'</div>'};
const tt=t=>{const m=t.match(/^(Happy|Merry|Welcome|Shubh|Class of|Our)\s+(.+)/);return m?`<small class="pre">${esc(m[1].toUpperCase())}</small>${esc(m[2])}`:esc(t)};
const art=c=>{if(c[7]){const x=c[7];return `<div class="uc ph${c[5]==='PREMIUM'?' prem':''}" style="background-image:url(${x.img})"><div class="phT" style="left:${x.x}%;top:${x.y}%;width:${x.w}%;color:${x.ink}"><b>${esc(x.t)}</b></div></div>`}const x=c[6];return x?`<div class="uc L-${x.l}${c[5]==='PREMIUM'?' prem':''}" data-m="${esc(x.t[0])}" style="--a:${x.p[0]};--b:${x.p[1]};--i:${x.p[2]};--c:${x.p[3]};--f:'${x.f}'">${decor(c,cards.indexOf(c))}<span class="e">${esc(c[0].toUpperCase())}</span><b class="g">${c[3]}</b><h3 class="t">${tt(x.t)}</h3><p class="s">${esc(c[4])}</p></div>`:`<div class="cardArt ${c[2]}">${decor(c,cards.indexOf(c))}<i>${c[3]}</i><strong>${esc(({Birthday:'Happy Birthday',Muslim:'Eid Mubarak',Wedding:'Janu & Janvi',Music:'Sangeet Night'})[c[0]]||'Celebrate')}</strong><small>${esc(c[1])}</small><em>${esc(c[4])}</em></div>`};
const cardH=c=>`<article class="cardDesign" data-card-index="${cards.indexOf(c)}"><span class="badge">${c[5]}</span>${art(c)}<div class="cardBottom"><b>${esc(c[1])}</b><button class="selectCard">Select &amp; Customize →</button></div></article>`;
renderCards=function(){const g=$('#cardGrid');if(g)g.innerHTML=cards.filter(c=>c[0]===activeCategory).map(cardH).join('')};
const label=()=>{const k=categories.find(c=>c[3]===activeCategory),l=$('#activeCategoryLabel');if(k&&l)l.textContent=k[0]+' '+k[1]};
function go(cat,to){activeCategory=cat;label();renderCards();try{renderOpenings()}catch(e){}chips();(document.querySelector(to||'.collection')).scrollIntoView({behavior:'smooth'})}
// category hub
const hub=document.createElement('section');hub.className='hub';hub.id='hub';
hub.innerHTML='<div class="sectionIntro"><p class="eyebrow">CARD WORLDS</p><h2>Pick a category, <em>then your card.</em></h2></div>'+categories.map(c=>{const l=cards.filter(x=>x[0]===c[3]);return `<div class="hubRow"><div class="hubHead"><div><b>${c[0]} ${esc(c[1])}</b><small>${esc(c[2])}</small></div><button class="btn soft viewAll" data-cat="${c[3]}">View all ${l.length} →</button></div><div class="hubScroll">${l.slice(0,3).map(cardH).join('')}</div></div>`}).join('');
document.querySelector('.showcase').after(hub);
document.addEventListener('click',e=>{const v=e.target.closest('.viewAll'),b=e.target.closest('.selectCard');if(v)go(v.dataset.cat);else if(b){const c=cards[+b.closest('.cardDesign').dataset.cardIndex];if(c)selectCard(c)}});
// openings by category
const oc=document.createElement('div');oc.id='openCats';oc.className='chipsRow';$('#openings').before(oc);
function chips(){oc.innerHTML=categories.map(c=>`<button class="chip${c[3]===activeCategory?' on':''}" data-cat="${c[3]}">${c[0]} ${esc(c[3])}</button>`).join('')}
oc.onclick=e=>{const b=e.target.closest('.chip');if(!b)return;activeCategory=b.dataset.cat;label();renderCards();selectedOpening=(openingSets[activeCategory]||openingSets.Wedding)[0];renderOpenings();chips()};
const extra={Hindu:['arch-glow','bell-split'],Sikh:['bell-split','arch-glow'],Christian:['wax-pull','mirror-crown'],Christmas:['lake-castle','mirror-crown'],Baby:['lake-castle','wax-pull'],Graduation:['mirror-crown','wax-pull'],Housewarming:['wax-pull','bell-split'],Mehndi:['arch-glow','wax-pull'],Jagran:['bell-split','arch-glow'],Festival:['arch-glow','lake-castle'],Corporate:['mirror-crown','bell-split']};
const OP={'bell-split':['bell-split','Temple Bell Split','Two embossed gold halves part to reveal names.','🔔'],'arch-glow':['arch-glow','Glowing Arch Window','A light arch fades in; dusk skyline rises.','◠'],'wax-pull':['wax-pull','Wax Seal Pull','Seal lifts, envelope slides away.','✉'],'lake-castle':['lake-castle','Castle Lake Ripple','Ripples spread as the gates welcome guests.','🏰'],'mirror-crown':['mirror-crown','Crowned Mirror Reveal','A gilded mirror lights up under a crown.','👑']};
extra.Anniversary=['wax-pull','mirror-crown'];
categories.forEach(c=>{const k=c[3];if(!openingSets[k])openingSets[k]=[...openingSets.Wedding.slice(0,3)];(extra[k]||[]).forEach(o=>{if(!openingSets[k].some(x=>x[0]===o))openingSets[k].push(OP[o])})});
const ro=renderOpenings;
renderOpenings=function(){ro.apply(this,arguments);const g=$('#openings');if(!g)return;const k=[...g.children].filter(x=>x.classList.contains('openingCard')||x.querySelector);const hid=k.slice(3);hid.forEach(x=>x.style.display='none');let b=$('#openMore');if(b)b.remove();if(hid.length){b=document.createElement('button');b.id='openMore';b.className='btn soft';b.textContent='View all '+k.length+' openings ↓';b.onclick=()=>{hid.forEach(x=>x.style.display='');b.remove()};g.after(b)}};
// cinema colours follow the selected card
const oci=openCinematic;
openCinematic=function(d){const r=oci.apply(this,arguments);try{const c=cards.find(x=>x[1]===(d&&d.card))||selectedCard,x=c&&c[6],e=document.querySelector('.cinemaExperience');if(x&&e){e.dataset.u=1;['a','b','i','c'].forEach((k,i)=>e.style.setProperty('--u'+k,x.p[i]))}}catch(_){}return r};
label();renderCards();chips();try{renderOpenings()}catch(e){}
})();
