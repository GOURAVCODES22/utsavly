/* UTSAVLY scroll-driven premium cards (5). Lightweight: one engine, per-card data. */
(function(){'use strict';
var P=window.UtsavlyPlayer,B='sc/';
var e=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var sm=function(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function hx(c){return [parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)]}
function cl(a,p){if(p<=a[0][0])return a[0][1];for(var i=1;i<a.length;i++)if(p<=a[i][0]){var t=sm((p-a[i-1][0])/(a[i][0]-a[i-1][0])),x=hx(a[i-1][1]),y=hx(a[i][1]);return 'rgb('+[0,1,2].map(function(k){return Math.round(x[k]+(y[k]-x[k])*t)}).join(',')+')'}return a[a.length-1][1]}
function kf(k,p){var R={o:1,x:0,y:0,s:1,r:0};if(!k)return R;var a,b,i;
 if(p<=k[0][0])return mix(R,k[0][1],k[0][1]);
 for(i=1;i<k.length;i++)if(p<=k[i][0]){a=k[i-1];b=k[i];return mix(R,a[1],b[1],sm((p-a[0])/(b[0]-a[0])))}
 return mix(R,k[k.length-1][1],k[k.length-1][1])}
function mix(R,a,b,t){t=t||0;for(var n in R){var u=a[n]==null?R[n]:a[n],v=b[n]==null?u:b[n];R[n]=u+(v-u)*t}return R}
function dt(d){if(!d)return '';try{return new Date(d+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}catch(x){return d}}
function tm(t){if(!t)return '';var m=t.split(':'),h=+m[0];return (h%12||12)+':'+m[1]+' '+(h>=12?'PM':'AM')}
/* layer: [img,x,y,w,z,opts]  text: [y,p0,p1,p2,p3,fn,cls]  keyframe props: o,x,y,s,r (x,y in % of stage) */
var C={
1:{n:'Royal Arch Scroll',pg:7,m:'m_sitar.mp3',tc:'#6b4a1f',bg:[[0,'#f6dccd'],[.3,'#f6dccd'],[.4,'#d3e8dc'],[.6,'#d3e8dc'],[.7,'#ddd5ee'],[1,'#ebdcea']],petal:['#e8809a','#f4b6c6','#d94f77'],beats:[.3,.6,.8],
 amb:[['amb_birds.mp3',.25],['amb_water.mp3',.22]],
 L:[['a_ground',50,82,100,2,{h:13}],
 ['a_hawa',50,44,96,1,{f:'saturate(.6)',k:[[0,{o:.5}],[.27,{o:.5}],[.35,{o:0}]]}],
 ['a_palace',50,44,98,1,{f:'saturate(.6)',k:[[.27,{o:0}],[.37,{o:.5}],[.57,{o:.5}],[.65,{o:0}]]}],
 ['a_gopuram',50,43,70,1,{f:'saturate(.6)',k:[[.57,{o:0}],[.67,{o:.5}],[1,{o:.5}]]}],
 ['a_arch',50,47,92,5,{k:[[0,{s:.95,o:0}],[.06,{s:1,o:1}]]}],
 ['a_rail',50,89,100,6,{h:4.5}],['a_water',50,94.6,100,6,{h:6.4}],
 ['a_ele',50,79.5,34,7,{bob:[.35,.9],k:[[.08,{x:-72,o:1}],[.42,{x:72}],[.43,{o:0}]]}],
 ['a_ele',50,82,27,7,{fx:1,bob:[.3,1.1],k:[[.18,{x:72,o:1}],[.52,{x:-72}],[.53,{o:0}]]}],
 ['a_duck',50,94.6,11,7,{bob:[.25,1.6],k:[[.25,{x:-60,o:1}],[.75,{x:60}],[.76,{o:0}]]}],
 ['a_ptail',87,73,26,7,{sw:[3,5,'bottom left'],k:[[.25,{o:0}],[.38,{o:1}]]}],
 ['a_peacock',82,78.5,24,7,{k:[[.25,{o:0,y:3}],[.38,{o:1,y:0}]]}],
 ['a_couple',50,70,40,7,{k:[[.7,{o:0,y:4,s:.94}],[.84,{o:1,y:0,s:1}]]}],
 ['a_rose1',15,17,34,8,{sw:[2,5,'top left'],par:.6}],['a_rose2',86,13,34,8,{fx:1,sw:[2,6,'top right'],par:.6}],
 ['a_rose2',5,50,18,8,{sw:[3,7,'left center'],par:1}],
 ['a_lantern',22,9.5,6,9,{sw:[6,4,'top center'],par:.4}],
 ['a_blossom',78,19,46,9,{sw:[2,6,'top right'],k:[[.8,{o:0,y:-14}],[.94,{o:1,y:0}]]}]],
 T:[[34,.02,.08,.26,.32,function(d){return '<small>'+e(d.occ)+'</small><i>Together with their families</i>'}],
 [38,.36,.42,.58,.64,function(d){return '<i data-sc="m">'+(d.msg?e(d.msg):'Join us in celebrating<br>a beautiful beginning')+'</i>'}],
 [31,.76,.88,2,2,function(d){return '<small>'+e(d.occ)+'</small><b data-sc="n">'+e(d.names)+'</b><span data-sc="d">'+e(d.dt)+(d.tm?' · '+e(d.tm):'')+'</span><em data-sc="v">'+e(d.venue)+'</em>'}]]},
2:{n:'Haldi Splash Scroll',pg:8,m:'m_sitar.mp3',tc:'#0f5c52',bg:[[0,'#f3ead3'],[1,'#f3e3a8']],petal:['#f7b500','#ff8a00','#ffd23f'],beats:[.38,.7],
 L:[['b_s1',50,50,100,1,{k:[[.36,{o:1}],[.46,{o:0}]]}],
 ['b_s2',50,50,100,1,{k:[[.34,{o:0}],[.46,{o:1}],[.66,{o:1}],[.76,{o:0}]]}],
 ['b_s3',50,50,100,1,{k:[[.64,{o:0}],[.76,{o:1}]]}],
 ['b_curtain',50,28,90,3,{op:'top',k:[[0,{y:-60}],[.12,{y:0}],[.26,{y:0,o:1}],[.34,{y:-8,o:0}]]}],
 ['b_atv',50,66,60,4,{bob:[.25,.7],k:[[0,{x:70,o:0}],[.08,{x:55,o:1}],[.2,{x:0}],[.34,{x:-4,o:1}],[.4,{x:-70,o:0}]]}],
 ['b_haldi',50,68,50,4,{bob:[.2,1],k:[[.44,{o:0,y:6}],[.56,{o:1,y:0}],[.68,{o:1}],[.74,{o:0,y:-4}]]}],
 ['b_curtain',50,28,90,3,{k:[[.42,{y:-60,o:0}],[.5,{y:-30,o:1}],[.58,{y:0}],[.66,{y:0,o:1}],[.72,{y:-8,o:0}]]}],
 ['b_bunting',50,9,100,9,{h:20,op:'top',sw:[.4,4,'top center'],k:[[0,{o:1}],[.3,{o:1}],[.4,{o:0}],[.72,{o:0}],[.8,{o:1}]]}],
 ['b_smv',50,50,150,10,{k:[[.33,{o:0,s:.9}],[.4,{o:.95,s:1.2}],[.47,{o:0,s:1.45}]]}],
 ['b_smy',50,50,150,10,{k:[[.64,{o:0,s:.9}],[.71,{o:.95,s:1.2}],[.79,{o:0,s:1.45}]]}]],
 T:[[18,.03,.1,.3,.35,function(d){return '<b data-sc="n">'+e(d.names)+'</b><i>are bringing the madness</i>'}],
 [16,.5,.58,.68,.72,function(d){return '<small>Join us for</small><b>'+e(d.occ)+'</b>'}],
 [17,.8,.88,2,2,function(d){return '<small>You are on the guest list</small><b data-sc="d">'+e(d.dt)+'</b><span>'+e(d.tm?d.tm+' onwards':'')+'</span><em data-sc="v">'+e(d.venue)+'</em>'}]]},
3:{n:'Palace Doors Parade',pg:9,m:'m_royal.mp3',tc:'#6b4420',bg:[[0,'#2a1a0e'],[1,'#2a1a0e']],petal:['#f2c4a0','#e8a0a0','#ffe3b0'],beats:[.12,.28,.42,.56,.7,.84],
 L:[['c_hall',50,50,100,1],
 ['c_haldi',50,50,100,2,{k:[[.1,{o:0}],[.16,{o:1}],[.26,{o:1}],[.3,{o:0}]]}],
 ['c_mehndi',50,50,100,2,{k:[[.26,{o:0}],[.32,{o:1}],[.4,{o:1}],[.44,{o:0}]]}],
 ['c_sangeet',50,50,100,2,{k:[[.4,{o:0}],[.46,{o:1}],[.54,{o:1}],[.58,{o:0}]]}],
 ['c_baraat',50,50,100,2,{k:[[.54,{o:0}],[.6,{o:1}],[.68,{o:1}],[.72,{o:0}]]}],
 ['c_vows',50,50,100,2,{k:[[.68,{o:0}],[.74,{o:1}],[.82,{o:1}],[.86,{o:0}]]}],
 ['c_final',50,50,100,2,{k:[[.82,{o:0}],[.88,{o:1}]]}],
 ['c_board',50,39,74,4,{k:[[.08,{o:0,s:.94}],[.16,{o:1,s:1}]]}],
 ['a_lantern',9,10,6,6,{sw:[5,4,'top center'],k:[[.06,{o:0}],[.16,{o:1}]]}],['a_lantern',91,10,6,6,{sw:[5,4.6,'top center'],k:[[.06,{o:0}],[.16,{o:1}]]}],
 ['c_doors',50,50,100,8,{cl:'l',k:[[0,{x:0}],[.07,{x:0}],[.14,{x:-62,o:1}],[.15,{o:0}]]}],
 ['c_doors',50,50,100,8,{cl:'r',k:[[0,{x:0}],[.07,{x:0}],[.14,{x:62,o:1}],[.15,{o:0}]]}]],
 T:[[7,0,.02,.06,.1,function(d){return '<small>'+e(d.occ)+'</small>'}],
 [34,.14,.2,.26,.3,function(d){return '<small>Haldi</small><i>Let the turmeric bless the couple</i>'}],
 [34,.3,.34,.4,.44,function(d){return '<small>Mehndi</small><i>Colours of joy and henna</i>'}],
 [34,.44,.48,.54,.58,function(d){return '<small>Sangeet</small><i>A night of music and dance</i>'}],
 [34,.58,.62,.68,.72,function(d){return '<small>Baraat</small><i>The procession of joy</i>'}],
 [34,.72,.76,.82,.86,function(d){return '<small>Wedding Vows</small><i>Two hearts, one promise</i>'}],
 [31,.88,.94,2,2,function(d){return '<small>'+e(d.occ)+'</small><b data-sc="n">'+e(d.names)+'</b><span data-sc="d">'+e(d.dt)+(d.tm?' · '+e(d.tm):'')+'</span><em data-sc="v">'+e(d.venue)+'</em>'}]]},
4:{n:'Grand Staircase Romance',pg:6,m:'m_piano.mp3',tc:'#8b1e4a',bg:[[0,'#f6e6d6'],[1,'#f6e6d6']],petal:['#f6a8c0','#ffd0dc','#fff'],beats:[.25,.5],ray:1,
 L:[['d_stairs',50,50,104,1,{k:[[0,{s:1.12}],[.35,{s:1}]]}],
 ['d_urn',20,94,34,5,{k:[[.1,{o:0,y:4}],[.3,{o:1,y:0}]]}],
 ['d_couple',50,68,66,4,{bob:[.12,2.5],k:[[.28,{o:0,y:5,x:4}],[.5,{o:1,y:0,x:0}]]}],
 ['d_leaf',93,70,42,6,{mk:'linear-gradient(to right,transparent 0,#000 32%)',sw:[1.6,5,'bottom right']}],['d_leaf',7,94,36,6,{fx:1,mk:'linear-gradient(to right,transparent 0,#000 32%)',sw:[1.6,6,'bottom left']}],
 ['d_gar1',24,40,52,8,{k:[[0,{x:0}],[.2,{x:-30,o:1}],[.3,{x:-34,o:0}]]}],
 ['d_gar2',76,40,52,8,{k:[[0,{x:0}],[.2,{x:30,o:1}],[.3,{x:34,o:0}]]}]],
 veil:1,
 T:[[8,.5,.6,2,2,function(d){return '<b data-sc="n">'+e(d.names)+'</b><i>And so, their forever begins…</i>'}],
 [20,.64,.74,2,2,function(d){return '<span data-sc="d">'+e(d.dt)+'</span><span>'+e(d.tm)+'</span><em data-sc="v">'+e(d.venue)+'</em>'}],
 [32,.78,.88,2,2,function(d){return '<i data-sc="m">'+(d.msg?e(d.msg):'An evening of love,<br>laughter &amp; happily ever after')+'</i>'}]]},
5:{n:'Jharokha Story Scroll',pg:11,m:'m_royal.mp3',tc:'#9a4a2a',bg:[[0,'#e9a98c'],[.25,'#e9a98c'],[.32,'#f4e6d4'],[1,'#f4e6d4']],petal:['#f08a24','#ffb347','#e65100'],beats:[.12,.3,.52,.76,.9],
 L:[['e_hero',50,50,100,1,{k:[[.1,{s:1,o:1}],[.28,{s:1.25,o:1}],[.33,{o:0}]]}],
 ['e_fan',50,95,64,3,{k:[[.1,{o:1}],[.2,{o:0}]]}],
 ['e_paper',50,50,100,1,{k:[[.26,{o:0}],[.34,{o:.3}]]}],
 ['e_ganesh',50,15,80,3,{k:[[.3,{o:0,y:-3}],[.4,{o:1,y:0}],[.5,{o:1}],[.55,{o:0}]]}],
 ['e_sprig',10,12,26,5,{k:[[.3,{o:0}],[.4,{o:.9}]],sw:[1.5,5,'top left']}],['e_sprig',90,92,26,5,{fx:1,k:[[.3,{o:0}],[.4,{o:.9}]],sw:[1.5,6,'bottom right']}],
 ['e_couple',50,66,46,4,{k:[[.74,{o:0,y:5}],[.82,{o:1,y:0}],[.9,{o:1}],[.94,{o:0}]]}],
 ['b_bunting',50,8,100,9,{h:18,op:'top',sw:[.4,4,'top center'],k:[[.88,{o:0}],[.94,{o:1}]]}],
 ['e_curtain',50,50,100,10,{cl:'l',k:[[0,{x:0}],[.05,{x:0}],[.12,{x:-62}],[.13,{o:0}]]}],
 ['e_curtain',50,50,100,10,{cl:'r',k:[[0,{x:0}],[.05,{x:0}],[.12,{x:62}],[.13,{o:0}]]}]],
 T:[[76,.1,.16,.24,.3,function(d){return '<b data-sc="n">'+e(d.names)+'</b><span id="cd5"></span>'}],
 [34,.34,.4,.5,.55,function(d){return '<small>With the blessings of the divine</small><b data-sc="n">'+e(d.names)+'</b><i>and the love of our families</i>'}],
 [18,.54,.6,.74,.78,function(d){return '<small>Our Events</small>'}],
 [30,.56,.62,.74,.78,function(d){return '<div class="scev"><p>💍</p><strong>Sagan</strong><em>Blessings &amp; rings</em></div>'}],
 [46,.6,.66,.74,.78,function(d){return '<div class="scev"><p>🪔</p><strong>Shaadi</strong><em>'+e(d.dt)+(d.tm?' · '+e(d.tm):'')+'</em></div>'}],
 [62,.64,.7,.74,.78,function(d){return '<div class="scev"><p>🥂</p><strong>Reception</strong><em>An evening of celebration</em></div>'}],
 [34,.8,.86,.88,.9,function(d){return '<small>Our Story</small><i>'+(d.msg?e(d.msg):'Two hearts, one beautiful journey')+'</i>'}],
 [32,.92,.97,2,2,function(d){return '<small>You are invited</small><b>Will you <u>join us?</u></b><span data-sc="d">'+e(d.dt)+'</span><em data-sc="v">'+e(d.venue)+'</em><a class="rs" target="_blank" href="https://www.google.com/maps/search/'+encodeURIComponent(d.venue||'')+'">View venue ↗</a>'}]]}
};
/* ---------- registration + free/premium ---------- */
var T0={1:['Wedding','Royal arch · elephants, peacock & palaces'],2:['Mehndi','Haldi splash · colour smoke & flower curtains'],3:['Wedding','Golden doors open · every wedding event'],4:['Wedding','Staircase romance · sheer curtains & petals'],5:['Wedding','Jharokha story · full wedding website scroll']};
function register(){try{if(typeof cards==='undefined')return;
 for(var i=1;i<=5;i++){if(cards.some(function(c){return c[1]===C[i].n}))continue;
  cards.push([T0[i][0],C[i].n,'theme-ivory','✦',T0[i][1],'PREMIUM',null,{img:B+'t'+i+'.webp',x:50,y:86,w:78,ink:'#fff',o:'velvet-curtains',fx:'flowers',t:C[i].n.replace(' Scroll','')}])}
 if(typeof renderCards==='function')renderCards()}catch(x){}}
/* ---------- engine ---------- */
var css='.scx{position:fixed;inset:0;z-index:2147483000;background:#000;overflow:hidden;font-family:Inter,system-ui,sans-serif}.scx *{box-sizing:border-box}.scv{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2}.scs{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);overflow:hidden}.scs img{position:absolute;display:block;pointer-events:none;user-select:none;will-change:transform,opacity}.scs canvas,.scs .fxo{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.scp{z-index:1;position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}.scp.sn{scroll-snap-type:y mandatory}.scp i.k{display:block;height:100vh;scroll-snap-align:start}.scp.lock{overflow:hidden}.sct{position:absolute;left:50%;width:78%;padding:1.6em 0;background:radial-gradient(closest-side,rgba(255,251,242,.7),rgba(255,251,242,.35) 60%,rgba(255,251,242,0));transform:translateX(-50%);text-align:center;color:var(--tc);opacity:0;will-change:opacity,transform;line-height:1.25;text-shadow:0 0 .5em rgba(255,250,235,.9),0 0 1.2em rgba(255,250,235,.6)}.sct small{display:block;font:600 2.3em/1.3 Inter,system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;opacity:.85;margin-bottom:.5em}.sct b{display:block;font:400 9.5em/1.05 var(--ff),"Great Vibes",cursive;background:linear-gradient(100deg,var(--tc) 28%,#c8923a 50%,var(--tc) 72%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-shadow:none;animation:scsh 4.5s linear infinite}@keyframes scsh{to{background-position:-250% 0}}.sct i{display:block;font:italic 400 3.4em/1.5 "Cormorant Garamond",Georgia,serif;margin-top:.5em}.sct span,.sct em{display:block;font:500 3em/1.5 "Cormorant Garamond",Georgia,serif;font-style:normal;margin-top:.3em}.sct em{font-weight:700;letter-spacing:.08em}.sct u{text-decoration:none;color:#c0553a}.sct .scev{background:rgba(255,250,242,.9);border:1px solid rgba(154,74,42,.35);border-radius:1.6em;padding:1.1em .6em;box-shadow:0 .4em 1.4em rgba(120,60,30,.18)}.sct .scev p{margin:0;font:400 4em/1 sans-serif}.sct .scev strong{display:block;font:700 4.4em/1.3 Inter,sans-serif;color:var(--tc);letter-spacing:.04em}.sct .scev em{font:italic 400 3.2em/1.4 "Cormorant Garamond",Georgia,serif;color:#5a3a22}.sct a.rs{pointer-events:auto;display:inline-block;margin-top:1.4em;padding:.7em 1.6em;border-radius:2em;background:var(--tc);color:#fff;font:600 2.6em Inter,sans-serif;text-decoration:none}#cd5{display:block;font:600 3em/1.4 Inter,sans-serif;letter-spacing:.12em;margin-top:.4em;color:#fff;text-shadow:0 0 .4em rgba(0,0,0,.4)}.scb{position:absolute;z-index:5;top:max(12px,env(safe-area-inset-top));display:flex;gap:8px;left:12px;right:12px;justify-content:space-between;pointer-events:none}.scb button{pointer-events:auto;border:0;border-radius:99px;min-width:40px;height:40px;padding:0 14px;background:rgba(20,12,6,.55);color:#f6e3b4;font:600 13px Inter,sans-serif;backdrop-filter:blur(8px);cursor:pointer}.scb div{display:flex;gap:8px}.sch{position:absolute;z-index:5;left:0;right:0;bottom:max(22px,env(safe-area-inset-bottom));text-align:center;color:#fff;font:600 12px Inter,sans-serif;letter-spacing:.2em;text-transform:uppercase;text-shadow:0 1px 8px rgba(0,0,0,.6);pointer-events:none;transition:opacity .5s;animation:schb 1.6s ease-in-out infinite}@keyframes schb{50%{transform:translateY(-7px)}}.scg{position:absolute;z-index:5;right:3px;top:20%;height:60%;width:3px;border-radius:3px;background:rgba(255,255,255,.2);pointer-events:none}.scg i{display:block;width:100%;background:linear-gradient(#ffe9a8,#c8923a);border-radius:3px;height:0}.scy{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:radial-gradient(circle at 50% 40%,#3a2410,#0b0603);color:#f6e3b4;text-align:center;padding:30px;transition:opacity .9s}.scy b{font:400 44px/1.1 var(--ff),"Great Vibes",cursive;background:linear-gradient(100deg,#f6e3b4 30%,#fff 50%,#f6e3b4 70%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:scsh 4s linear infinite}.scy small{letter-spacing:.35em;text-transform:uppercase;font:600 11px Inter,sans-serif;opacity:.8}.scy button{border:1px solid #d9b46a;background:transparent;color:#f6e3b4;border-radius:99px;padding:13px 30px;font:600 13px Inter,sans-serif;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}.scyo{opacity:0;pointer-events:none}';
var cur=null;
function open(d,id){if(cur)cur.close();var c=C[id];if(!c)return false;
 var D={names:d.names||'Janu & Janvi',occ:d.occasion||'You are invited',dt:dt(d.date)||'Your Special Date',tm:tm(d.time),venue:d.venue||'',msg:d.message||''};
 if(!document.getElementById('scxcss')){var s=document.createElement('style');s.id='scxcss';s.textContent=css;document.head.appendChild(s)}
 var R=document.createElement('div');R.className='scx';R.style.setProperty('--tc',d.fontColor||c.tc);R.style.setProperty('--ff',"'"+(d.font||'Great Vibes')+"'");
 R.innerHTML='<div class="scp lock"></div><div class="scv"><div class="scs"></div></div><div class="scb"><button data-a="x" aria-label="Close">✕</button><div><button data-a="m">Free scroll</button><button data-a="s">♪</button></div></div><div class="sch">Scroll ↓ · Swipe up</div><div class="scg"><i></i></div><div class="scy"><small>'+e(D.occ)+'</small><b>'+e(D.names)+'</b><button>Tap to open ✦</button></div>';
 document.body.appendChild(R);
 var S=R.querySelector('.scs'),SP=R.querySelector('.scp'),HINT=R.querySelector('.sch'),G=R.querySelector('.scg i'),VEIL=R.querySelector('.scy');
 for(var i=0;i<c.pg;i++){var k=document.createElement('i');k.className='k';SP.appendChild(k)}
 var bgc=document.createElement('div');bgc.style.cssText='position:absolute;inset:0';S.appendChild(bgc);
 var els=[],W=0,H=0,ptr={x:0,y:0},stat={};
 c.L.forEach(function(L){var im=new Image(),o=L[5]||{};im.decoding='async';im.src=B+L[0]+'.webp';im.draggable=false;
  var st=im.style;st.left=L[1]+'%';st.top=L[2]+'%';st.zIndex=L[4];st.width=L[3]+'%';st.opacity=0;
  if(o.h){st.height=o.h+'%';st.objectFit='cover';st.objectPosition='50% '+(o.op==='top'?'0%':'50%')}else if(o.op==='top'){st.objectPosition='50% 0'}
  if(o.cl)st.clipPath=o.cl==='l'?'inset(0 50% 0 0)':'inset(0 0 0 50%)';
  if(o.f)st.filter=o.f;if(o.mk){st.webkitMaskImage=st.maskImage=o.mk}
  S.appendChild(im);els.push({im:im,o:o,L:L})});
 var tx=[];c.T.forEach(function(T){var t=document.createElement('div');t.className='sct';t.style.top=T[0]+'%';t.innerHTML=T[5](D);t.style.zIndex=30;S.appendChild(t);tx.push({el:t,T:T})});
 if(c.ray){var rr=document.createElement('div');rr.className='fxo';rr.style.cssText='z-index:25;mix-blend-mode:soft-light;background:repeating-conic-gradient(from 200deg at 12% -5%,rgba(255,240,200,.55) 0 3deg,transparent 3deg 11deg);opacity:.5';S.appendChild(rr)}
 if(d.scratch&&window.UtsavlyScratch&&UtsavlyScratch.any(d.scratch)){setTimeout(function(){var sc=d.scratch,K={n:'names',d:'date',v:'venue',m:'message'};[].forEach.call(S.querySelectorAll('[data-sc]'),function(el){if(sc[K[el.dataset.sc]]){var b=el.getBoundingClientRect();var par=el.parentElement;el.style.position='relative';UtsavlyScratch.coverEls([el],{foil:sc.foil})}});UtsavlyScratch.secret(R,sc,10)},400)}
 var vg=document.createElement('div');vg.className='fxo';vg.style.cssText='z-index:26;background:radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(30,12,0,.28) 100%)';S.appendChild(vg);
 var cv=document.createElement('canvas');cv.style.zIndex=28;S.appendChild(cv);var cx=cv.getContext('2d');
 var pa=[],sp=[];
 function size(){var vw=innerWidth,vh=innerHeight;H=Math.max(vh,vw*16/9);W=H*9/16;S.style.width=W+'px';S.style.height=H+'px';S.style.fontSize=(W/100)+'px';cv.width=W*Math.min(devicePixelRatio||1,1.5)|0;cv.height=H*Math.min(devicePixelRatio||1,1.5)|0}
 size();addEventListener('resize',size);
 var n=innerWidth<700?16:26;
 for(i=0;i<n;i++)pa.push({x:Math.random(),y:Math.random(),v:.04+Math.random()*.08,r:Math.random()*6,w:.4+Math.random()*.5,s:.012+Math.random()*.014,c:c.petal[i%c.petal.length]});
 for(i=0;i<(innerWidth<700?24:40);i++)sp.push({x:Math.random(),y:Math.random(),t:Math.random()*6,s:.003+Math.random()*.005,l:0});
 var trail=[],cp=0,tg=0,vel=0,last=0,raf=0,t0=performance.now(),mode='free',snd=true,started=false,audios=[],beat=-1,dead=false;
 function trailAdd(x,y){var r=S.getBoundingClientRect();trail.push({x:(x-r.left)/r.width,y:(y-r.top)/r.height,l:1})}
 R.addEventListener('pointermove',function(ev){ptr.x=(ev.clientX/innerWidth-.5)*2;ptr.y=(ev.clientY/innerHeight-.5)*2;if(ev.pressure>0||ev.pointerType==='mouse'){trailAdd(ev.clientX,ev.clientY)}},{passive:true});
 R.addEventListener('touchmove',function(ev){var t=ev.touches[0];if(t){trailAdd(t.clientX,t.clientY)}},{passive:true});
 function onori(ev){if(ev.gamma!=null){ptr.x=Math.max(-1,Math.min(1,ev.gamma/25));ptr.y=Math.max(-1,Math.min(1,(ev.beta-50)/25))}}
 addEventListener('deviceorientation',onori);
 function star(x,y,r,a){cx.globalAlpha=a;cx.beginPath();cx.moveTo(x,y-r);cx.quadraticCurveTo(x,y,x+r,y);cx.quadraticCurveTo(x,y,x,y+r);cx.quadraticCurveTo(x,y,x-r,y);cx.quadraticCurveTo(x,y,x,y-r);cx.fill()}
 function frame(now){if(dead)return;raf=requestAnimationFrame(frame);var dtm=Math.min(.05,(now-last)/1000||.016);last=now;var t=(now-t0)/1000;
  var mx=SP.scrollHeight-SP.clientHeight;tg=mx>0?SP.scrollTop/mx:0;var pp=cp;cp+=(tg-cp)*Math.min(1,dtm*7);vel=vel*.9+Math.abs(cp-pp)*60;var p=cp;
  bgc.style.background=cl(c.bg,p);
  for(var i=0;i<els.length;i++){var E=els[i],o=E.o,K=kf(o.k,p),sy=0,rot=K.r,sc=K.s;
   if(o.bob)sy=Math.sin(t*6.283/o.bob[1])*o.bob[0];if(o.sw&&o.sw[0])rot+=Math.sin(t*6.283/o.sw[1])*o.sw[0];
   if(o.sw&&o.sw[2])E.im.style.transformOrigin=o.sw[2];
   var px=o.par?ptr.x*o.par*1.2:0,py=o.par?ptr.y*o.par*.8:0;
   E.im.style.opacity=K.o;
   E.im.style.transform='translate(-50%,-50%) translate('+((K.x+px)*W/100).toFixed(1)+'px,'+((K.y+sy+py)*H/100).toFixed(1)+'px) rotate('+rot.toFixed(2)+'deg) scale('+(o.fx?-sc:sc)+','+sc+')'}
  for(i=0;i<tx.length;i++){var T=tx[i].T,a=0;if(p>=T[1]){a=p<T[2]?sm((p-T[1])/(T[2]-T[1])):(T[4]>1||p<T[3])?1:p<T[4]?1-sm((p-T[3])/(T[4]-T[3])):0}var ts=tx[i].el.style;ts.opacity=a;ts.transform='translateX(-50%) translateY('+((1-a)*1.6).toFixed(2)+'em)'}
  var cd=S.querySelector('#cd5');if(cd&&d.date){var df=new Date(d.date+'T'+(d.time||'00:00')+':00')-Date.now();if(df>0){var dd=Math.floor(df/864e5),hh=Math.floor(df/36e5)%24,mm=Math.floor(df/6e4)%60;cd.textContent=dd+'d : '+hh+'h : '+mm+'m'}else cd.textContent='Today ✦'}
  HINT.style.opacity=p>.02?0:1;G.style.height=(p*100)+'%';
  var bi=-1;for(i=0;i<c.beats.length;i++)if(p>c.beats[i])bi=i;if(bi!==beat){if(beat!==-1&&navigator.vibrate)try{navigator.vibrate(14)}catch(x){}beat=bi}
  if(c.amb&&started&&snd)c.amb.forEach(function(A,j){var a=audios[j+1];if(!a)return;var v=j===0?(p<.5?.22:.1):(p>.3&&p<.8?.3:.08);a.volume=Math.max(0,Math.min(1,v*(snd?1:0)))});
  cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);var k=cv.width,hh2=cv.height,sv=1+Math.min(4,vel*4);
  for(i=0;i<pa.length;i++){var q=pa[i];q.y+=q.v*dtm*sv;q.x+=Math.sin(t*q.w+q.r)*.03*dtm;q.r+=dtm*1.5;if(q.y>1.05){q.y=-.05;q.x=Math.random()}
   cx.globalAlpha=.78;cx.fillStyle=q.c;cx.save();cx.translate(q.x*k,q.y*hh2);cx.rotate(q.r);cx.scale(1,.55+.45*Math.sin(q.r*1.7));cx.beginPath();cx.ellipse(0,0,q.s*k,q.s*k*.62,0,0,6.283);cx.fill();cx.restore()}
  cx.fillStyle='#ffe9a8';
  for(i=0;i<sp.length;i++){var s=sp[i];s.t+=dtm*(1+vel*2);s.y-=s.s*dtm*(1+vel*4);if(s.y<-.02){s.y=1.02;s.x=Math.random()}var tw=.5+.5*Math.sin(s.t*3);star(s.x*k,s.y*hh2,(1.6+tw*3.2)*k/360,.25+tw*.7)}
  cx.fillStyle='#fff6cf';for(i=trail.length-1;i>=0;i--){var r=trail[i];r.l-=dtm*1.6;if(r.l<=0){trail.splice(i,1);continue}star(r.x*k,r.y*hh2+(1-r.l)*8,(2+r.l*6)*k/360,r.l)}
  cx.globalAlpha=1}
 function play(){started=true;SP.classList.remove('lock');VEIL.classList.add('scyo');setTimeout(function(){VEIL.remove()},1000);
  var url=d.musicUrl||(d.music==='upload'?d.audioUrl:''),none=d.music==='none';
  if(!none){var m=new Audio(url||(B+c.m));m.loop=true;m.volume=.7;audios[0]=m;if(url&&d.trimStart)try{m.currentTime=+d.trimStart}catch(x){}
   if(url&&d.trimEnd)m.addEventListener('timeupdate',function(){if(m.currentTime>=+d.trimEnd)m.currentTime=+d.trimStart||0});m.play().catch(function(){})}
  if(c.amb&&!none)c.amb.forEach(function(A,j){var a=new Audio(B+A[0]);a.loop=true;a.volume=0;audios[j+1]=a;a.play().catch(function(){})})}
 function setSnd(v){snd=v;audios.forEach(function(a,j){if(a){a.muted=!v}});R.querySelector('[data-a=s]').style.opacity=v?1:.5}
 R.addEventListener('click',function(ev){var a=ev.target.closest('[data-a]'),v=ev.target.closest('.scy button');
  if(v){play();return}if(!a)return;var z=a.dataset.a;
  if(z==='x')close();else if(z==='s')setSnd(!snd);else if(z==='m'){mode=mode==='free'?'snap':'free';SP.classList.toggle('sn',mode==='snap');a.textContent=mode==='free'?'Free scroll':'Swipe'}});
 function close(){dead=true;cancelAnimationFrame(raf);removeEventListener('resize',size);removeEventListener('deviceorientation',onori);audios.forEach(function(a){if(a){a.pause();a.src=''}});R.remove();cur=null}
 cur={close:close};raf=requestAnimationFrame(frame);return true}
function wrap(){if(!P||P.__sc)return;P.__sc=1;var o=P.open;P.open=function(d,opt){var m=d&&d.art&&d.art.img&&String(d.art.img).match(/sc\/t(\d)\.webp/);if(m&&!(opt&&opt.openingOnly)&&C[m[1]]){return open(d,+m[1])}return o.apply(this,arguments)}}
wrap();register();
setTimeout(function(){wrap();register()},700);setTimeout(register,1800);
window.UtsavlyScrollCards={open:open,cards:C};
})();
