/* UTSAVLY invitation player — self-contained (no dependency on app.js). */
(function(global){
'use strict';
var IG='https://www.instagram.com/codetocreation/';
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

/* ---------- catalogue ---------- */
var GROUPS={cinematic:'🎬 Cinematic · Premium',nature:'🌿 Nature',royal:'👑 Royal',classic:'💌 Classic',spiritual:'🪔 Spiritual / Festival'};
// id, name, group, icon, description, tile colours, total ms
var OPENINGS=[
['ocean-wave','Ocean Wave','nature','🌊','A calm dusk sea swells into a great wave, then slowly pulls back like the tide to reveal your card.',['#2aa0b8','#04304a'],5400],
['clouds-parting','Clouds Parting','nature','☁️','Clouds sweep in from both sides, then part to reveal your card.',['#8fbbe8','#e9f2fb'],3700],
['rain-curtain','Rain','nature','🌧️','A curtain of rain washes down the screen and clears the card.',['#25405a','#0a121b'],3700],
['snow-frost','Snow','nature','❄️','A frosted snowy veil melts away from the card.',['#e6f2fb','#9fbdd2'],3500],
['petal-bloom','Petal Bloom','nature','🌸','A rose blooms from the centre and its petals open the card.',['#f3b6c8','#8e3558'],3700],
['wind-leaves','Wind & Leaves','nature','🍃','A gust of wind blows the leaves away and sweeps the screen clear.',['#5f7d34','#1f3314'],3600],
['galaxy-stars','Galaxy','nature','🌌','You fly through a field of stars into your card.',['#4a3590','#05050f'],3800],
['lightning','Lightning','nature','⚡','A storm flashes three times and the sky breaks open.',['#2a3552','#030407'],3500],
['fire-spark','Fire / Sparks','nature','🔥','A wall of fire sweeps up and burns away to reveal the card.',['#d9480f','#1a0602'],3700],
['velvet-curtains','Velvet Curtains','royal','🎭','Heavy velvet curtains close the stage, then glide apart.',['#9a1d2f','#2a0509'],3500],
['palace-doors','Palace Doors','royal','👑','Carved palace doors swing open with a burst of golden light.',['#b88535','#2b1a08'],3600],
['royal-ribbon','Royal Ribbon','royal','🎀','A golden ribbon unties, falls away and the wrapping parts.',['#a3183b','#3a0a17'],3700],
['royal-gate','Royal Gate','royal','🏰','A grand golden gate slides open.',['#c9a24e','#1d1608'],3900],
['royal-mirror','Royal Mirror','royal','🪞','A gilded mirror shimmers, then you step through it.',['#b8863c','#0d0a07'],3800],
['luxury-letter','Luxury Letter','classic','💌','A lace envelope with a gold wax seal: the seal breaks, the flap opens and your card is drawn out.',['#d9d3cb','#6b6257'],4800],
['card-open','Card Opens','classic','📖','A pearl-white embossed invitation cover swings open like a real wedding card.',['#f3ecdf','#b98643'],3600],
['scroll-open','Scroll','classic','📜','A tied parchment scroll unrolls from the centre.',['#f2e3bd','#7a5a2a'],3500],
['gift-box','Gift Box','classic','🎁','A gift box lid flies off and light spills out.',['#c4415c','#150c10'],3500],
['golden-spotlight','Golden Spotlight','classic','✨','A moving spotlight searches the dark, then floods the card.',['#f0cd88','#050403'],4300],
['diya-reveal','Diya','spiritual','🪔','A diya flame glows and its light expands over the card.',['#ff9f1c','#140703'],3500],
['floral-temple','Floral Temple','spiritual','🌺','A marigold-garlanded temple arch opens onto the card.',['#d9a94a','#380a0c'],3800],
['arch-reveal','Arch','spiritual','🛕','A golden arch rises and opens like a doorway.',['#e2bf6b','#0b2a25'],3700],
['celebration-burst','Celebration Burst','spiritual','🎊','A burst of confetti explodes and clears the screen.',['#ff6bd6','#2a0f45'],3200]
].map(function(o){return {id:o[0],name:o[1],group:o[2],icon:o[3],desc:o[4],tile:o[5],ms:o[6]}});
var EFFECTS=[['flowers','Flower Rain','🌸'],['snow','Snowfall','❄️'],['rain','Rain','🌧️'],['fire','Fire / Sparks','🔥'],['lightning','Lightning','⚡'],['lights','Lights','✨'],['stars','Stars','⭐'],['hearts','Hearts','❤️'],['confetti','Confetti','🎊'],['none','None','—']];
var MUSIC=[['festive','🎉 Celebration'],['birthday_happy','🎂 Happy Birthday'],['birthday_party','🥳 Birthday Party'],['birthday_glow','✨ Birthday Glow'],['birthday_royal','👑 Royal Birthday'],['birthday_sweet','💖 Sweet Birthday'],['birthday_piano','🎹 Birthday Piano'],['royal','👑 Royal Celebration'],['romantic','💕 Romantic'],['celestial','🌙 Celestial'],['none','🔇 No Music']];
function opById(id){for(var i=0;i<OPENINGS.length;i++)if(OPENINGS[i].id===id)return OPENINGS[i];return OPENINGS[9]}

/* ---------- helpers ---------- */
function safeFont(f){return /^[A-Za-z0-9' ]+$/.test(f||'')?f:'Great Vibes'}
function parseDate(s){if(!s)return null;var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)return null;return new Date(+m[1],+m[2]-1,+m[3])}
function fmtDate(s){var d=parseDate(s);if(!d)return null;return {wd:d.toLocaleDateString('en-IN',{weekday:'long'}),day:d.getDate(),mon:d.toLocaleDateString('en-IN',{month:'long'}),yr:d.getFullYear(),long:d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),d:d}}
function fmtTime(t){if(!t)return '';var m=String(t).match(/^(\d{1,2}):(\d{2})/);if(!m)return t;var h=+m[1],ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+m[2]+' '+ap}
function lum(hex){var n=parseInt(String(hex||'#000').replace('#','').padEnd(6,'0').slice(0,6),16);return ((n>>16)*299+((n>>8)&255)*587+(n&255)*114)/1000}
var ratioCache={};
function imgRatio(src,cb){if(ratioCache[src]){cb(ratioCache[src]);return}var im=new Image();im.onload=function(){ratioCache[src]=im.naturalWidth/im.naturalHeight;cb(ratioCache[src])};im.onerror=function(){cb(.5625)};im.src=src}
function words(text,base){var out='',i=0;String(text).split(/(\s+)/).forEach(function(w){if(/^\s+$/.test(w)){out+=' ';return}if(!w)return;out+='<span class="upz-w" style="--d:'+(base+(i++)*190)+'">'+esc(w)+'</span>'});return out}

/* ---------- card rendering (shared by previews, player and downloads) ---------- */
function cardBgHTML(art){
  if(art.img)return '<div class="upc-bg" style="background-image:url(&quot;'+String(art.img).replace(/"/g,'%22')+'&quot;);background-position:50% 50%"></div>';
  if(art.l){var p=art.p||['#222','#000','#fff','#d8b06a'];return '<div class="upc-bg uc L-'+esc(art.l)+'" style="--a:'+esc(p[0])+';--b:'+esc(p[1])+';--i:'+esc(p[2])+';--c:'+esc(p[3])+';--f:\''+esc(art.f||'Cormorant Garamond')+'\'"></div>'}
  if(art.theme)return '<div class="upc-bg cardArt '+esc(art.theme)+'"></div>';
  return '<div class="upc-bg" style="background:linear-gradient(160deg,#2a2218,#0b0907)"></div>';
}
function artInk(art){
  if(art.img||art.ink&&!art.l)return art.ink||'#fff';
  if(art.p)return art.p[2];
  return art.ink||'#2a1d0f';
}
// place text zone (position/width) for a card
function zoneBox(art){
  if(art.img)return {x:art.x||50,y:art.y||50,w:art.w||60};
  return {x:art.l==='ticket'?40:50,y:56,w:60};
}
// Builds the card element. data: {art, color(tint), tintAmt, font, fontColor}
function buildCard(data){
  var art=data.art||{}, z=zoneBox(art), ink=data.fontColor&&data.fontColorUser?data.fontColor:artInk(art);
  var el=document.createElement('div');el.className='upc';
  el.innerHTML=cardBgHTML(art)+'<div class="upc-tint"></div><div class="upc-zone '+(lum(ink)>150?'inkLight':'inkDark')+'"></div>';
  var zone=el.querySelector('.upc-zone');
  zone.style.setProperty('--zx',z.x+'%');zone.style.setProperty('--zy',z.y+'%');zone.style.setProperty('--zw',z.w+'%');
  zone.style.setProperty('--ink',ink);zone.style.setProperty('--nfont',"'"+safeFont(data.font)+"'");
  zone.style.setProperty('--nink',data.fontColorUser?data.fontColor:'inherit');
  var tint=el.querySelector('.upc-tint');
  if(data.color&&data.tintAmt>0){tint.style.background=data.color;tint.style.opacity=Math.min(1,data.tintAmt/100)}else tint.style.display='none';
  el.__zone=zone;el.__art=art;
  return el;
}
function ratioFor(art,cb){if(art.img)imgRatio(art.img,cb);else cb(.75)}

/* fits a zone's content: shrinks --fs until it fits inside the safe height */
function fitZone(zone,stageH){
  zone.style.setProperty('--fs',1);
  var lim=stageH*(zone.__lim||.8),s=1,n=0;
  while(zone.offsetHeight>lim&&s>.3&&n++<30){s-=.04;zone.style.setProperty('--fs',s.toFixed(2))}
}
function blockDate(data){
  var f=fmtDate(data.date),t=fmtTime(data.time);
  if(!f)return '<p class="upz-eyebrow">Save the date</p><p class="upz-big" style="--nfs:11em">'+words('Your special date',0)+'</p>';
  return '<p class="upz-eyebrow">Save the date</p><p class="upz-sub">'+words(f.wd,0)+'</p><p class="upz-big nowrap" style="--nfs:26em">'+words(String(f.day),260)+'</p><p class="upz-big nowrap" style="--nfs:'+Math.min(15,95/Math.max(5,f.mon.length)).toFixed(1)+'em">'+words(f.mon,520)+'</p><p class="upz-big nowrap" style="--nfs:10em;opacity:.9">'+words(String(f.yr),900)+'</p>'+(t?'<div class="upz-rule"></div><p class="upz-line">'+words('at '+t,1200)+'</p>':'');
}
function nameSize(len){return Math.max(8,Math.min(21,200/Math.max(7,len)))}
function photoHTML(data){
  if(!data.photo||data.photoShape==='none')return '';
  return '<img class="upz-photo'+(data.photoShape==='round'?' rnd':'')+'" alt="" src="'+esc(data.photo)+'" style="--pw:'+(+data.photoSize||34)+'">';
}
function blockNames(data,withMsg){
  var n=data.names||'Janu & Janvi';
  return photoHTML(data)+'<p class="upz-eyebrow">'+esc(data.occasion||'You are invited')+'</p><h2 class="upz-names" dir="auto" style="--nfs:'+nameSize(n.length).toFixed(1)+'em">'+words(n,200)+'</h2>'+(withMsg?'':'<div class="upz-rule"></div><p class="upz-line">'+words('Together with their families',900)+'</p>');
}
function blockVenue(data){
  var v=data.venue||'Your venue';
  return '<p class="upz-eyebrow">The venue</p><div class="upz-rule"></div><p class="upz-big" dir="auto" style="--nfs:'+Math.max(7,Math.min(12,150/Math.max(8,v.length))).toFixed(1)+'em">'+words(v,150)+'</p>';
}

/* ---------- music (synth + trimmed audio) ---------- */
var MELODY={ // Happy Birthday to You (public domain), semitone offsets from tonic
  hb:[[0,.5],[0,.5],[2,1],[0,1],[5,1],[4,2],[0,.5],[0,.5],[2,1],[0,1],[7,1],[5,2],[0,.5],[0,.5],[12,1],[9,1],[5,1],[4,1],[2,2],[10,.5],[10,.5],[9,1],[5,1],[7,1],[5,2]]
};
var CHORDS={royal:[[220,277.18,329.63],[196,246.94,293.66],[174.61,220,261.63],[196,246.94,293.66]],romantic:[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]],festive:[[293.66,369.99,440],[329.63,392,493.88],[246.94,293.66,369.99],[293.66,369.99,440]],celestial:[[196,246.94,293.66],[174.61,220,261.63],[164.81,207.65,246.94],[196,246.94,293.66]]};
function Music(){this.audio=null;this.ctx=null;this.timer=null;this.watch=null;this.playing=false;this.muted=false;this.vol=.8}
Music.prototype.play=function(cfg){
  this.stop();cfg=cfg||{};var self=this,kind=cfg.kind||'none',url=cfg.url||'';
  if(url){
    var a=new Audio();a.preload='auto';a.src=url;a.volume=0;this.audio=a;
    var st=Math.max(0,+cfg.start||0),en=Math.max(0,+cfg.end||0);
    var seek=function(){try{if(st>0&&Math.abs(a.currentTime-st)>.3)a.currentTime=st}catch(e){}};
    a.addEventListener('loadedmetadata',seek);a.addEventListener('canplay',seek,{once:true});
    var p=a.play();seek();
    if(p&&p.catch)p.catch(function(){self.playing=false;self.blocked=true});
    this.playing=true;this.blocked=false;
    this.fade(a,this.muted?0:this.vol,600);
    this.watch=setInterval(function(){
      if(!self.audio)return;
      var ct=a.currentTime,limit=en>st?en:(a.duration&&isFinite(a.duration)?a.duration-.05:0);
      if(limit&&ct>=limit-.05&&!self.looping){
        self.looping=true;
        self.fade(a,0,200,function(){try{a.currentTime=st}catch(e){}a.play().catch(function(){});self.fade(a,self.muted?0:self.vol,400);setTimeout(function(){self.looping=false},500)});
      }
    },120);
    return;
  }
  if(!kind||kind==='none')return;
  var AC=global.AudioContext||global.webkitAudioContext;if(!AC)return;
  var ctx=this.ctx=new AC();try{ctx.resume()}catch(e){}
  var master=ctx.createGain();master.gain.value=this.muted?0:.9;this.master=master;
  var comp=ctx.createDynamicsCompressor();master.connect(comp);comp.connect(ctx.destination);
  var tone=function(f,t,d,type,v){var o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05)};
  var isB=/^birthday_/.test(kind),prog=CHORDS[kind]||(isB?CHORDS.festive:CHORDS.royal),n=0;
  var tempo={birthday_happy:.5,birthday_party:.36,birthday_sweet:.46,birthday_glow:.5,birthday_royal:.55,birthday_piano:.5}[kind]||.5;
  var tonic={birthday_happy:261.63,birthday_party:293.66,birthday_sweet:261.63,birthday_royal:246.94,birthday_piano:261.63,birthday_glow:277.18}[kind]||261.63;
  var useMel=isB; var melLen=MELODY.hb.reduce(function(s,x){return s+x[1]},0)*tempo;
  var barLen=3, mi=0;
  var bar=function(){
    var t=ctx.currentTime+.03,c=prog[n++%prog.length];
    var padV=isB?.05:.15;
    c.forEach(function(f){tone(f,t,barLen+.6,'sine',padV);if(!isB)tone(f*2,t,barLen,'triangle',.05)});
    tone(c[0]/2,t,barLen+.8,'sine',isB?.08:.2);
    if(!isB)[0,.6,1.2,1.8,2.4].forEach(function(o,i){tone(c[i%3]*2,t+o,.9,'triangle',.07)});
  };
  var melody=function(){
    var t=ctx.currentTime+.05,tt=0;
    MELODY.hb.forEach(function(nt){var f=tonic*2*Math.pow(2,nt[0]/12),d=nt[1]*tempo;var o=kind==='birthday_piano'?'sine':'triangle';tone(f,t+tt,d*1.7,o,.2);tone(f*2,t+tt,d,'sine',.05);tt+=d});
  };
  bar();self.timer=setInterval(bar,barLen*1000);
  if(useMel){melody();self.mtimer=setInterval(melody,(melLen+1.2)*1000)}
  this.playing=true;
};
Music.prototype.fade=function(a,to,ms,done){
  var from=a.volume,t0=Date.now();clearInterval(a.__f);
  a.__f=setInterval(function(){var k=Math.min(1,(Date.now()-t0)/ms);a.volume=Math.max(0,Math.min(1,from+(to-from)*k));if(k>=1){clearInterval(a.__f);if(done)done()}},40);
};
Music.prototype.setMuted=function(m){this.muted=m;if(this.audio)this.audio.volume=m?0:this.vol;if(this.master)this.master.gain.value=m?0:.9};
Music.prototype.retry=function(){if(this.blocked&&this.audio){var self=this;this.audio.play().then(function(){self.blocked=false;self.playing=true;self.fade(self.audio,self.muted?0:self.vol,500)}).catch(function(){})}if(this.ctx&&this.ctx.state==='suspended'){try{this.ctx.resume()}catch(e){}}};
Music.prototype.stop=function(){
  clearInterval(this.timer);clearInterval(this.mtimer);clearInterval(this.watch);this.timer=this.mtimer=this.watch=null;
  if(this.audio){try{clearInterval(this.audio.__f);this.audio.pause();this.audio.removeAttribute('src');this.audio.load()}catch(e){}this.audio=null}
  if(this.ctx){try{this.ctx.close()}catch(e){}this.ctx=null}
  this.playing=false;this.blocked=false;this.looping=false;
};

/* ---------- effects (layered, sprite based, additive glow) ---------- */
function mkSprite(w,h,fn){var c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
var SPR=null;
function sprites(){
  if(SPR)return SPR;
  var petals=[['#fff1f5','#ee7c9e'],['#ffffff','#f6cdd8'],['#ffa3bb','#b3245c'],['#ffe0b0','#f08a24'],['#fff4d6','#e7b04a']].map(function(p){
    return mkSprite(72,72,function(x,w,h){
      x.translate(w/2,h/2);
      var g=x.createRadialGradient(-4,10,3,0,0,34);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);
      x.fillStyle=g;x.beginPath();x.moveTo(0,-32);x.bezierCurveTo(28,-26,30,12,0,32);x.bezierCurveTo(-30,12,-28,-26,0,-32);x.fill();
      x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1.2;x.beginPath();x.moveTo(0,-26);x.quadraticCurveTo(3,0,0,26);x.stroke();
      x.fillStyle='rgba(120,20,50,.07)';x.beginPath();x.ellipse(0,18,10,12,0,0,6.3);x.fill();
    });
  });
  var dot=mkSprite(64,64,function(x,w){var g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
  var glow=mkSprite(64,64,function(x){var g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,250,220,1)');g.addColorStop(.25,'rgba(255,190,80,.85)');g.addColorStop(.6,'rgba(255,100,20,.28)');g.addColorStop(1,'rgba(255,60,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
  var bokeh=mkSprite(128,128,function(x){var g=x.createRadialGradient(64,64,0,64,64,62);g.addColorStop(0,'rgba(255,236,190,.28)');g.addColorStop(.78,'rgba(255,226,160,.4)');g.addColorStop(.93,'rgba(255,240,200,.85)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.beginPath();x.arc(64,64,62,0,6.3);x.fill()});
  var hearts=['#ff5c85','#e0245e','#ff9ab3','#ffd0dc'].map(function(col){return mkSprite(72,72,function(x){
    x.translate(36,38);var g=x.createRadialGradient(-8,-10,2,0,0,36);g.addColorStop(0,'#fff');g.addColorStop(.25,col);g.addColorStop(1,'rgba(120,0,30,.9)');
    x.fillStyle=g;x.beginPath();x.moveTo(0,28);x.bezierCurveTo(-42,-2,-26,-34,0,-14);x.bezierCurveTo(26,-34,42,-2,0,28);x.fill();
    x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.ellipse(-12,-14,7,4,-.6,0,6.3);x.fill()})});
  var star=mkSprite(64,64,function(x){x.translate(32,32);var g=x.createRadialGradient(0,0,0,0,0,30);g.addColorStop(0,'rgba(255,248,215,1)');g.addColorStop(.2,'rgba(255,236,170,.55)');g.addColorStop(1,'rgba(255,230,150,0)');x.fillStyle=g;x.fillRect(-32,-32,64,64);
    x.fillStyle='#fffbe8';[0,1].forEach(function(i){x.save();x.rotate(i*1.5708);x.beginPath();x.moveTo(0,-30);x.quadraticCurveTo(2,-2,30,0);x.quadraticCurveTo(2,2,0,30);x.quadraticCurveTo(-2,2,-30,0);x.quadraticCurveTo(-2,-2,0,-30);x.fill();x.restore()})});
  SPR={petals:petals,dot:dot,glow:glow,bokeh:bokeh,hearts:hearts,star:star};return SPR;
}
function Effects(canvas,flash){this.cv=canvas;this.fl=flash;this.cx=canvas.getContext('2d');this.P=[];this.R=[];this.raf=0;this.kind='none';this.on=false;this.bolts=[];this.mood=0;this.last=0;this.t=0}
Effects.prototype.resize=function(){var d=Math.min(2,global.devicePixelRatio||1);this.W=global.innerWidth;this.H=global.innerHeight;this.cv.width=this.W*d;this.cv.height=this.H*d;this.cx.setTransform(d,0,0,d,0,0);this.k=Math.max(.8,Math.min(1.5,this.W/390))};
Effects.prototype.mk=function(first){
  var k=this.kind,W=this.W,H=this.H,z=.25+Math.random()*.75,p={z:z,ph:Math.random()*20,r:Math.random()*6.28,vr:(Math.random()-.5)*.05,flip:Math.random()*6.28,vf:.03+Math.random()*.06,a:1,age:0};
  p.x=-W*.1+Math.random()*W*1.2;p.y=first?Math.random()*H:-40-Math.random()*H*.2;p.vx=0;p.vy=0;p.s=10;
  if(k==='flowers'){p.s=(13+24*z)*this.k*.9;p.vy=.55+1.25*z;p.vx=.35+.5*z;p.spr=(Math.random()*5)|0;p.a=.5+.5*z}
  else if(k==='snow'){p.s=(2+10*z*z)*this.k;p.vy=.5+1.5*z;p.vx=-.1+.25*z;p.a=.35+.6*z}
  else if(k==='rain'){p.len=(12+30*z)*this.k;p.vy=15+15*z;p.vx=p.vy*.16;p.a=.2+.5*z;p.w=.6+1.1*z;p.gy=H*(.72+.26*Math.random());p.y=first?Math.random()*p.gy:-p.len-Math.random()*H*.3}
  else if(k==='fire'){p.x=W*(.05+.9*Math.random());p.y=first?H*(.5+Math.random()*.5):H+10;p.s=(2+6*z)*this.k;p.vy=-(.8+2.6*z);p.life=1;p.dec=.003+Math.random()*.006;p.vx=0}
  else if(k==='lights'){p.s=(16+60*z)*this.k;p.x=Math.random()*W;p.y=first?Math.random()*H:H+p.s;p.vy=-(.12+.35*z);p.vx=(Math.random()-.5)*.15;p.a=.25+.55*z;p.tw=.4+Math.random()*.8}
  else if(k==='stars'){p.x=Math.random()*W;p.y=Math.random()*H;p.s=(5+16*z)*this.k;p.tw=.6+Math.random()*1.6}
  else if(k==='hearts'){p.s=(14+26*z)*this.k;p.x=Math.random()*W;p.y=first?Math.random()*H:H+p.s;p.vy=-(.5+1.1*z);p.spr=(Math.random()*4)|0;p.a=.5+.5*z;p.vr=0}
  else if(k==='confetti'){p.col=['#ff3d81','#ffd23f','#2ec4f1','#7bed5c','#b565f5','#ffffff','#ff8a3d'][(Math.random()*7)|0];p.w=(6+7*z)*this.k;p.h=p.w*(.4+Math.random()*.4);p.vy=1.4+2*z;p.vx=(Math.random()-.5)*1.2;p.drag=.985;p.grav=.035}
  return p;
};
Effects.prototype.cannon=function(n){
  for(var i=0;i<n;i++){var p=this.mk(false),left=i%2===0;p.x=left?-10:this.W+10;p.y=this.H*(.25+Math.random()*.25);var ang=(left?-1:1)*(Math.PI/4+Math.random()*.7)-Math.PI/2+(left?.9:-.9);
    var sp=9+Math.random()*10;p.vx=Math.cos(ang)*sp*(left?1:-1)*(left?1:1);p.vy=-Math.abs(Math.sin(ang))*sp*1.1;p.vx=(left?1:-1)*(3+Math.random()*9);p.vy=-(5+Math.random()*12);this.P.push(p)}
};
Effects.prototype.mkBolt=function(){
  var W=this.W,H=this.H,x=W*(.18+Math.random()*.64),pts=[[x,0]],y=0,self=this;
  while(y<H*(.7+Math.random()*.2)){x+=(Math.random()-.5)*(60+Math.random()*50);y+=18+Math.random()*34;pts.push([x,y])}
  var br=[];pts.forEach(function(p,i){if(i>3&&Math.random()<.22){var q=[p],bx=p[0],by=p[1],dir=Math.random()<.5?-1:1,len=4+((Math.random()*8)|0);for(var j=0;j<len;j++){bx+=dir*(10+Math.random()*30);by+=10+Math.random()*28;q.push([bx,by])}br.push(q)}});
  this.bolts.push({pts:pts,br:br,age:0});
  this.fl.style.transition='none';this.fl.style.background='#dfe9ff';this.fl.style.opacity=.55;var f=this.fl;setTimeout(function(){f.style.transition='opacity .45s ease-out';f.style.opacity=0},60);
  setTimeout(function(){if(self.on&&Math.random()<.6){f.style.transition='none';f.style.opacity=.35;setTimeout(function(){f.style.transition='opacity .4s ease-out';f.style.opacity=0},50)}},180);
};
Effects.prototype.start=function(kind,intensity){
  var self=this;this.kind=kind;this.on=true;this.resize();this.P=[];this.R=[];this.bolts=[];this.mood=0;this.last=0;this.t=0;
  var area=Math.min(2,Math.max(.8,this.W*this.H/(390*844)));
  var base={flowers:[26,48,84],snow:[70,150,300],rain:[110,210,380],fire:[40,90,170],lights:[14,26,42],stars:[26,48,80],hearts:[14,26,46],confetti:[60,110,190],lightning:[0,0,0],none:[0,0,0]}[kind]||[0,0,0];
  var idx={soft:0,cinematic:1,intense:2}[intensity];if(idx==null)idx=1;
  this.N=Math.round(base[idx]*area);
  if(kind==='lightning')this.N=Math.round([40,70,110][idx]*area);
  var K=kind;if(kind==='lightning')this.kind='rain';
  for(var i=0;i<this.N;i++)this.P.push(this.mk(true));
  this.kind=K;if(kind==='lightning')this.rainMk=true;
  if(kind==='confetti')this.cannon(Math.round([40,90,150][idx]));
  this.nextBolt=500;this.sparkT=0;if(kind!=='lightning')this.rainMk=false;
  var loop=function(ts){
    if(!self.raf)return;
    var dt=self.last?Math.min(40,ts-self.last)/16.67:1;self.last=ts;self.t+=dt*16.67;self.step(dt,ts);
    self.raf=requestAnimationFrame(loop);
  };
  cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(loop);
};
Effects.prototype.step=function(dt,ts){
  var c=this.cx,W=this.W,H=this.H,k=this.kind,S=sprites(),P=this.P,i,p;
  c.clearRect(0,0,W,H);
  this.mood+=((this.on?1:0)-this.mood)*Math.min(1,dt*.05);
  var live=this.on?1:0;
  // atmosphere
  if(k==='rain'||this.rainMk){var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(8,16,30,'+(.38*this.mood)+')');g.addColorStop(1,'rgba(150,175,205,'+(.22*this.mood)+')');c.fillStyle=g;c.fillRect(0,0,W,H)}
  if(k==='fire'){var fl=.75+.25*Math.sin(this.t*.012)+.1*Math.sin(this.t*.031);var g2=c.createRadialGradient(W/2,H*1.05,0,W/2,H*1.05,H*.75);g2.addColorStop(0,'rgba(255,130,30,'+(.55*fl*this.mood)+')');g2.addColorStop(.5,'rgba(190,50,10,'+(.22*fl*this.mood)+')');g2.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g2;c.fillRect(0,0,W,H)}
  if(k==='snow'||k==='lights'){c.fillStyle='rgba(10,16,30,'+((k==='snow'?.12:.18)*this.mood)+')';c.fillRect(0,0,W,H)}
  var wind=Math.sin(this.t*.0004)*.6;
  var want=this.on?this.N:0;
  if(this.on){
    if(k==='confetti'){if(P.length<this.N*.55&&Math.random()<.45)P.push(this.mk(false))}
    else if(k==='stars'){while(P.length<this.N)P.push(this.mk(true))}
    else{while(P.length<want)P.push(this.mk(false))}
  }
  for(i=P.length-1;i>=0;i--){
    p=P[i];p.age+=dt;
    if(k==='flowers'){p.x+=(p.vx+wind*p.z+Math.sin(this.t*.0011+p.ph)*.5)*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;p.flip+=p.vf*dt;
      c.save();c.globalAlpha=p.a*(this.on?1:Math.max(0,1-p.age*.002));c.translate(p.x,p.y);c.rotate(p.r+Math.sin(p.ph+this.t*.001)*.5);c.scale(.35+.65*Math.abs(Math.cos(p.flip)),1);c.drawImage(S.petals[p.spr],-p.s/2,-p.s/2,p.s,p.s);c.restore();
      if(p.y>H+40||p.x>W+60){if(this.on)P[i]=this.mk(false);else P.splice(i,1)}}
    else if(k==='snow'){p.x+=(p.vx+wind*.5*p.z+Math.sin(this.t*.0009+p.ph)*.35*p.z)*dt;p.y+=p.vy*dt;c.globalAlpha=p.a;c.drawImage(S.dot,p.x-p.s,p.y-p.s,p.s*2,p.s*2);c.globalAlpha=1;
      if(p.y>H+20){if(this.on)P[i]=this.mk(false);else P.splice(i,1)}}
    else if(k==='rain'||this.rainMk&&p.len){p.y+=p.vy*dt;p.x+=p.vx*dt;
      var gr=c.createLinearGradient(p.x-p.vx*1.6,p.y-p.len,p.x,p.y);gr.addColorStop(0,'rgba(190,210,240,0)');gr.addColorStop(1,'rgba(215,230,255,'+p.a+')');
      c.strokeStyle=gr;c.lineWidth=p.w;c.beginPath();c.moveTo(p.x-p.len*.16,p.y-p.len);c.lineTo(p.x,p.y);c.stroke();
      if(p.y>=p.gy){this.R.push({x:p.x,y:p.gy,r:1,a:.5*p.z});if(this.on){P[i]=this.mk(false);P[i].y=-30}else P.splice(i,1)}}
    else if(k==='fire'){p.life-=p.dec*dt;p.y+=p.vy*dt;p.x+=(Math.sin(this.t*.003+p.ph*3)*.9+wind*.5)*dt;p.vy*=.9985;
      if(p.life<=0||p.y<-30){if(this.on)P[i]=this.mk(false);else P.splice(i,1);continue}
      var s=p.s*(.4+p.life*1.4);c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(1,p.life*1.3)*(.55+.45*Math.sin(this.t*.02+p.ph*5));c.drawImage(S.glow,p.x-s*2,p.y-s*2,s*4,s*4);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
    else if(k==='lights'){p.y+=p.vy*dt;p.x+=p.vx*dt+Math.sin(this.t*.0005+p.ph)*.15;var al=p.a*(.65+.35*Math.sin(this.t*.0011*p.tw+p.ph))*(this.on?1:Math.max(0,1-p.age*.004));
      c.globalCompositeOperation='lighter';c.globalAlpha=Math.max(0,al);c.drawImage(S.bokeh,p.x-p.s,p.y-p.s,p.s*2,p.s*2);c.globalAlpha=1;c.globalCompositeOperation='source-over';
      if(p.y<-p.s*2){if(this.on)P[i]=this.mk(false);else P.splice(i,1)}else if(!this.on&&al<=0)P.splice(i,1)}
    else if(k==='stars'){var tw=.35+.65*Math.abs(Math.sin(this.t*.0014*p.tw+p.ph)),aa=tw*(this.on?this.mood:Math.max(0,1-(p.age*.0006)));
      if(!this.on&&aa<=.01){P.splice(i,1);continue}
      c.globalCompositeOperation='lighter';c.globalAlpha=aa;var sz=p.s*(.7+.5*tw);c.drawImage(S.star,p.x-sz,p.y-sz,sz*2,sz*2);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
    else if(k==='hearts'){p.y+=p.vy*dt;p.x+=Math.sin(this.t*.0012+p.ph)*.55*dt;var sc=1+.08*Math.sin(this.t*.004+p.ph);
      c.save();c.globalAlpha=p.a*Math.min(1,p.y/(H*.25));c.translate(p.x,p.y);c.rotate(Math.sin(this.t*.001+p.ph)*.35);c.drawImage(S.hearts[p.spr],-p.s*sc/2,-p.s*sc/2,p.s*sc,p.s*sc);c.restore();
      if(p.y<-40){if(this.on)P[i]=this.mk(false);else P.splice(i,1)}}
    else if(k==='confetti'){p.vx*=p.drag;p.vy=p.vy*p.drag+p.grav*dt;p.x+=(p.vx+Math.sin(this.t*.002+p.ph)*.6)*dt;p.y+=p.vy*dt;p.flip+=p.vf*3*dt;p.r+=p.vr*2*dt;
      var f=Math.cos(p.flip);c.save();c.translate(p.x,p.y);c.rotate(p.r);c.scale(1,Math.abs(f)+.12);c.fillStyle=f>0?p.col:shade(p.col);c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore();
      if(p.y>H+30){if(this.on&&Math.random()<.5)P[i]=this.mk(false);else P.splice(i,1)}}
  }
  // shooting stars
  if(k==='stars'&&this.on){this.sparkT-=dt*16.67;if(this.sparkT<=0){this.sparkT=1400+Math.random()*2200;this.R.push({sh:1,x:W*(.3+Math.random()*.7),y:H*Math.random()*.4,vx:-9-Math.random()*6,vy:4+Math.random()*3,a:1})}}
  // ripples & shooting stars
  for(i=this.R.length-1;i>=0;i--){var r=this.R[i];
    if(r.sh){r.x+=r.vx*dt;r.y+=r.vy*dt;r.a-=.02*dt;var gl=c.createLinearGradient(r.x,r.y,r.x-r.vx*9,r.y-r.vy*9);gl.addColorStop(0,'rgba(255,255,255,'+Math.max(0,r.a)+')');gl.addColorStop(1,'rgba(255,255,255,0)');c.strokeStyle=gl;c.lineWidth=2;c.beginPath();c.moveTo(r.x,r.y);c.lineTo(r.x-r.vx*9,r.y-r.vy*9);c.stroke();if(r.a<=0)this.R.splice(i,1)}
    else{r.r+=.9*dt;r.a-=.018*dt;c.strokeStyle='rgba(205,225,250,'+Math.max(0,r.a)+')';c.lineWidth=1;c.beginPath();c.ellipse(r.x,r.y,r.r*2.2,r.r*.7,0,0,6.3);c.stroke();if(r.a<=0)this.R.splice(i,1)}}
  // lightning
  if(this.rainMk&&this.on&&this.t>this.nextBolt){this.mkBolt();this.nextBolt=this.t+700+Math.random()*1500}
  for(i=this.bolts.length-1;i>=0;i--){var b=this.bolts[i];b.age+=dt;var fr=b.age,al2=fr<3?1:fr<5?.25:fr<8?.9:fr<14?.55*(1-(fr-8)/6):0;
    if(al2<=0){this.bolts.splice(i,1);continue}
    c.fillStyle='rgba(170,195,255,'+(.16*al2)+')';c.fillRect(0,0,W,H);
    var draw=function(pts,wid,col){c.beginPath();pts.forEach(function(q,j){j?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])});c.strokeStyle=col;c.lineWidth=wid;c.lineJoin='round';c.stroke()};
    c.save();c.shadowColor='rgba(130,170,255,'+al2+')';c.shadowBlur=26;
    draw(b.pts,7,'rgba(120,160,255,'+(.3*al2)+')');b.br.forEach(function(q){draw(q,4,'rgba(120,160,255,'+(.25*al2)+')')});
    c.shadowBlur=10;draw(b.pts,2.6,'rgba(225,235,255,'+al2+')');b.br.forEach(function(q){draw(q,1.4,'rgba(225,235,255,'+(.8*al2)+')')});
    c.shadowBlur=0;draw(b.pts,1,'rgba(255,255,255,'+al2+')');c.restore()}
};
function shade(hex){var n=parseInt(hex.slice(1),16),r=(n>>16)*.62|0,g=((n>>8)&255)*.62|0,b=(n&255)*.62|0;return 'rgb('+r+','+g+','+b+')'}
Effects.prototype.end=function(){this.on=false};
Effects.prototype.destroy=function(){cancelAnimationFrame(this.raf);this.raf=0;this.on=false;this.P=[];this.R=[];this.bolts=[];try{this.cx.clearRect(0,0,this.W,this.H)}catch(e){}};

/* ---------- cinematic openings: wax-seal envelopes + arched doors / shutters ---------- */
var ENV={
 'env-rose':{n:'Rose Blush Royale',ic:'💌',d:'Embossed blush envelope with a gold wax seal — the fold lines glow and the flaps open.',base:['#e9a8a0','#d98c86'],tone:'#f6cdc6',line:'#d8b46e',seal:['#f0d28a','#b88a3a'],tile:['#e9a8a0','#8d4a4a']},
 'env-ivory':{n:'Enchanted Seal Reveal',ic:'🕊️',d:'Ivory floral envelope sealed with a deep red wax heart.',base:['#f1ebe0','#e4dccd'],tone:'#ffffff',line:'#cdb27a',seal:['#a3202f','#5d0f1a'],tile:['#f1ebe0','#b9ab8f'],light:1},
 'env-burgundy':{n:'Gilded Grandeur',ic:'🌹',d:'Burgundy rose-embossed envelope with a cream wax seal and gold foil.',base:['#6e1a26','#4a0f19'],tone:'#8d2a38',line:'#d4a65a',seal:['#f6eedb','#cfc2a4'],tile:['#8e2233','#3b0b13']},
 'env-emerald':{n:'Emerald Meadow',ic:'🌿',d:'Deep green floral envelope with a pearl-white wax seal.',base:['#365c46','#27443a'],tone:'#4d7a62',line:'#c9b16f',seal:['#f4f1e8','#c8c3b4'],tile:['#3f6b53','#1b3027']},
 'env-dahlia':{n:'The Dahlia Garden',ic:'🪷',d:'Petrol and sage dahlia envelope: gold light races along the folds, then it blooms open.',base:['#26463f','#193630'],tone:'#3d6a5e',line:'#d0b57a',seal:['#f3ede0','#cabd9f'],tile:['#2d5b50','#12251f']}
};
function envPattern(c1,c2,line){
  var s='<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><radialGradient id="g" cx="40%" cy="35%"><stop offset="0" stop-color="'+c2+'" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs><rect width="160" height="160" fill="'+c1+'"/>';
  function rosette(cx,cy,r,n){var o='';for(var k=0;k<n;k++){var a=k*360/n;o+='<ellipse cx="'+cx+'" cy="'+(cy-r*.55)+'" rx="'+r*.26+'" ry="'+r*.55+'" transform="rotate('+a+' '+cx+' '+cy+')" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2" transform-origin="'+cx+' '+cy+'"/><ellipse cx="'+(cx-.8)+'" cy="'+(cy-r*.55-.8)+'" rx="'+r*.26+'" ry="'+r*.55+'" transform="rotate('+a+' '+cx+' '+cy+')" fill="none" stroke="'+line+'" stroke-opacity=".75" stroke-width="1.2"/>'}return o+'<circle cx="'+cx+'" cy="'+cy+'" r="'+r*.16+'" fill="'+line+'" fill-opacity=".6"/>'}
  s+=rosette(40,40,34,13)+rosette(120,118,34,13)+rosette(120,12,20,9)+rosette(0,118,20,9)+rosette(160,118,20,9);
  var leaf=function(x,y,r){return '<path d="M'+x+' '+y+' q10 -22 30 -24 q-6 20 -30 24" transform="rotate('+r+' '+x+' '+y+')" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/><path d="M'+(x-.8)+' '+(y-.8)+' q10 -22 30 -24 q-6 20 -30 24" transform="rotate('+r+' '+x+' '+y+')" fill="none" stroke="'+line+'" stroke-opacity=".6" stroke-width="1"/>'};
  s+=leaf(86,64,-20)+leaf(78,92,170)+leaf(30,100,200)+leaf(110,60,60)+leaf(70,20,-60)+leaf(150,70,120)+leaf(10,70,-80);
  s+='<rect width="160" height="160" fill="url(#g)"/></svg>';
  return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")';
}
function envMarkup(id,data){
  var t=ENV[id],pat=envPattern(t.base[0],t.base[1],t.line),names=esc((data&&data.names)||'');
  var st='--pat:'+pat.replace(/"/g,'&quot;')+';--ln:'+t.line+';--s1:'+t.seal[0]+';--s2:'+t.seal[1]+';--tone:'+t.tone+';--b1:'+t.base[0]+';--b2:'+t.base[1];
  var seal=t.light?'<b class="sl"><s class="hh">♡</s></b>':'<b class="sl"><s class="rs">'+(function(){var o='';for(var i=0;i<14;i++)o+='<i style="--pr:'+(i*360/14)+'deg"></i>';return o})()+'</s></b>';
  var lines='<svg class="xl" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="xg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6d8" stop-opacity="0"/><stop offset=".5" stop-color="#fff0b8"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></linearGradient></defs><path class="x1" d="M0 0 L50 50 L100 0" /><path class="x2" d="M0 100 L50 50 L100 100"/><path class="x3" d="M0 0 L50 50 L0 100" /><path class="x4" d="M100 0 L50 50 L100 100"/></svg>';
  return '<div class="ev'+(t.light?' lt':'')+'" style="'+st+'"><i class="gl"></i><i class="fl fL"></i><i class="fl fR"></i><i class="fl fB"></i><i class="fl fT"></i>'+lines+seal+'<p class="lab">OPEN YOUR INVITATION<span>'+names+'</span></p></div>';
}
/* arched doors */
var DOORS={
 'door-emerald':{n:'Emerald Arch',ic:'🚪',d:'Mint arched doors framed in bougainvillea swing open into your invitation.',a:'round',wall:['#f6ead2','#e8d3ab'],stone:'#f3e6c9',door:['#8fcfba','#4a9a86'],fl:['#e0267f','#f25aa3','#c21873'],lamp:1,tile:['#8fcfba','#e0267f']},
 'door-royal':{n:'Royal Mediterranean',ic:'🔷',d:'Cobalt blue arched doors with blossoms and tiled steps.',a:'round',wall:['#f3e9d6','#e1d0ae'],stone:'#f1e5c8',door:['#2f6fd0','#123f8c'],fl:['#e0267f','#f25aa3','#c21873'],lamp:1,tile:['#2f6fd0','#f3e9d6']},
 'door-moroccan':{n:'Moroccan Emerald',ic:'🕌',d:'Teal studded doors under a pointed Moroccan arch on warm ochre walls.',a:'moorish',wall:['#f0c36a','#d99a38'],stone:'#f5d99b',door:['#3aa59a','#1b6a63'],fl:['#e0267f','#f25aa3','#c21873'],lamp:1,tile:['#3aa59a','#f0c36a']},
 'door-gold':{n:'Gold Arabesque',ic:'🏺',d:'Golden carved arabesque doors in a white keyhole arch.',a:'moorish',wall:['#faf5ee','#e9e0d3'],stone:'#fffaf0',door:['#f1c443','#c28d10'],fl:['#e0267f','#f25aa3','#c21873'],lamp:1,tile:['#f1c443','#faf5ee']},
 'door-blush':{n:'Blush Tree of Life',ic:'🌸',d:'Soft blush doors with pampas grass and drifting petals.',a:'round',wall:['#f6e3da','#ebc9bb'],stone:'#fbeee7',door:['#f1cfc4','#d9a595'],fl:['#e9a1b5','#f6c9d4','#d9708f'],lamp:0,tile:['#f1cfc4','#d9708f']},
 'door-marigold':{n:'Marigold Palace',ic:'🏵️',d:'Royal palace gate in sandstone, draped with marigold garlands.',a:'palace',wall:['#e0b184','#c68d5b'],stone:'#efd0a6',door:['#f0dfae','#c9a24e'],fl:['#ff9d1c','#ffc43a','#e8710a'],lamp:1,tile:['#e0b184','#ff9d1c']},
 'door-amalfi':{n:'Amalfi Breeze',ic:'🍋',d:'Weathered blue shutters with lemons and bougainvillea swing open to the sea breeze.',a:'rect',wall:['#f6f1e6','#e6dcc6'],stone:'#fffaf0',door:['#86aed8','#5f89b6'],fl:['#e0267f','#f25aa3','#c21873'],lamp:0,lemons:1,tile:['#86aed8','#f2c230']}
};
var ARCH={
 round:{top:52,left:[['V',82],['A',30]]},
 moorish:{top:44,left:[['V',92],['C',20,70,34,56,50,44]]},
 palace:{top:40,left:[['V',80],['C',20,64,30,58,38,52],['C',44,48,48,46,50,40]]},
 rect:{top:40,left:[['V',40]]}
};
function holePath(kind){
  var a=ARCH[kind],x0=20,B=150,p='M'+x0+' '+B;
  a.left.forEach(function(s){if(s[0]==='V')p+=' V'+s[1];else if(s[0]==='A')p+=' A30 30 0 0 1 50 52';else p+=' C'+s.slice(1).join(' ').replace(/(\d+) (\d+)/g,'$1 $2')});
  if(kind==='rect')p+=' H80';
  // mirrored right side (reverse)
  var right=[];
  if(kind==='round')right=[' A30 30 0 0 1 80 82',' V'+B];
  else if(kind==='moorish')right=[' C66 56 80 70 80 92',' V'+B];
  else if(kind==='palace')right=[' C52 46 56 48 62 52',' C70 58 80 64 80 80',' V'+B];
  else right=[' V'+B];
  return p+right.join('')+' Z';
}
function leafPath(kind){
  switch(kind){
    case 'round':return 'M0 98 V30 A30 30 0 0 1 30 0 V98 Z';
    case 'moorish':return 'M0 106 V48 C0 26 14 12 30 0 V106 Z';
    case 'palace':return 'M0 110 V40 C0 24 10 18 18 12 C24 8 28 6 30 0 V110 Z';
    default:return 'M0 100 H30 V0 H0 Z';
  }
}
function seedRand(n){var s=n;return function(){s=(s*9301+49297)%233280;return s/233280}}
function doorMarkup(id){
  var t=DOORS[id],k=t.a,top=ARCH[k].top,hy=k==='rect'?140:150,hh=hy-top;
  var uid=id.replace(/[^a-z]/g,''),r=seedRand(id.length*37+7);
  var hp=k==='rect'?'M20 '+hy+' V'+top+' H80 V'+hy+' Z':holePath(k);
  var fl='',i,fx,fy;
  var cols=t.fl;
  function bloom(x,y,sz){var c=cols[(r()*3)|0];return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+sz.toFixed(2)+'" fill="'+c+'" opacity=".95"/>'}
  function leaf(x,y){return '<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="2.4" ry="1.1" transform="rotate('+((r()*180)|0)+' '+x.toFixed(1)+' '+y.toFixed(1)+')" fill="#5b8a3c" opacity=".9"/>'}
  // blossoms hugging the top of the surround and the corners
  for(i=0;i<110;i++){
    var ang=Math.PI*(1.02+r()*.96),cx=50+Math.cos(ang)*(34+r()*7),cy=(top+28)+Math.sin(ang)*(30+r()*10);
    if(k==='rect'){cx=14+r()*72;cy=top-6+r()*10-(r()<.5?4:0)}
    fl+=leaf(cx+(r()-.5)*3,cy+(r()-.5)*3)+bloom(cx,cy,1.2+r()*2.1);
  }
  for(i=0;i<46;i++){var side=r()<.5?0:1,x=side?(80+r()*18):(2+r()*18),y=30+r()*110;fl+=leaf(x,y)+bloom(x,y,1.1+r()*1.9)}
  for(i=0;i<24;i++){var x=r()<.5?(2+r()*20):(78+r()*20),y=hy-6+r()*16;fl+=leaf(x,y)+bloom(x,y,1.2+r()*2)}
  if(t.lemons){for(i=0;i<9;i++){var lx=(i<5?10+r()*18:72+r()*18),ly=top-12+r()*14;fl+='<ellipse cx="'+lx.toFixed(1)+'" cy="'+ly.toFixed(1)+'" rx="2.8" ry="3.6" fill="#f2c230"/><ellipse cx="'+(lx-.7).toFixed(1)+'" cy="'+(ly-1).toFixed(1)+'" rx=".8" ry="1.4" fill="#fff3b0" opacity=".8"/>'}}
  var lamps='';
  if(t.lamp){[12,88].forEach(function(x){lamps+='<line x1="'+x+'" y1="62" x2="'+x+'" y2="68" stroke="#3b2a14" stroke-width=".7"/><rect x="'+(x-2.4)+'" y="68" width="4.8" height="9" rx="1" fill="#2a1d0e"/><rect x="'+(x-1.7)+'" y="69.4" width="3.4" height="6.2" fill="#ffd27a" class="lp"/><circle cx="'+x+'" cy="73" r="9" fill="url(#lg'+uid+')" class="lg"/>'})}
  var stairs='<rect x="14" y="'+hy+'" width="72" height="5" fill="'+t.stone+'"/><rect x="10" y="'+(hy+5)+'" width="80" height="5" fill="'+t.stone+'" opacity=".92"/><rect x="6" y="'+(hy+10)+'" width="88" height="8" fill="'+t.stone+'" opacity=".85"/><rect x="0" y="'+(hy+18)+'" width="100" height="'+(178-hy-18)+'" fill="'+t.wall[1]+'"/><rect x="14" y="'+hy+'" width="72" height="1" fill="#000" opacity=".12"/><rect x="10" y="'+(hy+5)+'" width="80" height="1" fill="#000" opacity=".12"/>';
  var wall='<svg class="wl" viewBox="0 0 100 178" preserveAspectRatio="none"><defs><linearGradient id="wg'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+t.wall[0]+'"/><stop offset="1" stop-color="'+t.wall[1]+'"/></linearGradient><radialGradient id="lg'+uid+'"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient><pattern id="st'+uid+'" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="none"/><circle cx="1" cy="1" r=".5" fill="#000" opacity=".06"/><circle cx="4" cy="4" r=".4" fill="#fff" opacity=".12"/></pattern></defs>'
    +'<path fill-rule="evenodd" fill="url(#wg'+uid+')" d="M0 0H100V178H0Z '+hp.replace(/^M/,'M')+'"/>'
    +'<path fill-rule="evenodd" fill="url(#st'+uid+')" d="M0 0H100V178H0Z '+hp+'"/>'
    +'<path d="'+hp+'" fill="none" stroke="'+t.stone+'" stroke-width="5" stroke-linejoin="round"/><path d="'+hp+'" fill="none" stroke="#000" stroke-opacity=".16" stroke-width=".8"/>'
    +stairs+lamps+fl+'</svg>';
  var hw=30,lh=k==='round'?98:(k==='moorish'?106:(k==='palace'?110:100));
  function leafSvg(flip){
    var d=leafPath(k),c1=t.door[0],c2=t.door[1],g='dg'+uid+(flip?'r':'l');
    var inner='<defs><linearGradient id="'+g+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+c2+'"/><stop offset=".55" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient><clipPath id="c'+g+'"><path d="'+d+'"/></clipPath></defs><path d="'+d+'" fill="url(#'+g+')"/><g clip-path="url(#c'+g+')" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".5">';
    for(var q=3;q<30;q+=3)inner+='<line x1="'+q+'" y1="0" x2="'+q+'" y2="'+lh+'"/>';
    inner+='</g><g clip-path="url(#c'+g+')" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".7"><rect x="4" y="'+(lh*.5)+'" width="22" height="'+(lh*.4)+'" rx="1.5"/><rect x="4" y="'+(lh*.14)+'" width="22" height="'+(lh*.28)+'" rx="1.5"/></g>';
    if(k==='moorish'||k==='palace'){inner+='<g clip-path="url(#c'+g+')" fill="#000" fill-opacity=".18">'+[[10,0.62],[20,0.62],[10,0.78],[20,0.78],[15,0.7]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+(lh*p[1])+'" r="1"/>'}).join('')+'</g>'}
    inner+='<circle cx="27" cy="'+(lh*.62)+'" r="1.4" fill="#e7c477" stroke="#000" stroke-opacity=".35" stroke-width=".3"/>';
    return '<svg viewBox="0 0 30 '+lh+'" preserveAspectRatio="none" style="'+(flip?'transform:scaleX(-1)':'')+'">'+inner+'</svg>';
  }
  var topPct=(top/178*100),hPct=(hh/178*100);
  var pos='top:'+topPct.toFixed(2)+'%;height:'+hPct.toFixed(2)+'%;width:30%;';
  return '<div class="dr" style="--tp:'+(top+hh*.5)/1.78+'%"><i class="gl" style="top:'+topPct.toFixed(2)+'%;height:'+hPct.toFixed(2)+'%"></i><u class="lf l" style="'+pos+'left:20%">'+leafSvg(0)+'</u><u class="lf r" style="'+pos+'left:50%">'+leafSvg(1)+'</u>'+wall+'</div>';
}
function cineMarkup(id,data){return ENV[id]?envMarkup(id,data):doorMarkup(id)}
function cineList(){
  var out=[];
  Object.keys(ENV).forEach(function(k){var t=ENV[k];out.push({id:k,name:t.n,group:'cinematic',icon:t.ic,desc:t.d,tile:t.tile,ms:6400,cam:1,prem:1})});
  Object.keys(DOORS).forEach(function(k){var t=DOORS[k];out.push({id:k,name:t.n,group:'cinematic',icon:t.ic,desc:t.d,tile:t.tile,ms:5400,cam:1,prem:1})});
  out.unshift({id:'palace-chandelier',name:'Palace Chandelier',group:'cinematic',icon:'🕯️',desc:'A dark Mughal palace hall lit by a giant crystal chandelier — the camera glides in and the light blooms into your card.',tile:['#8a5f2a','#0b0705'],ms:5800,cam:1,prem:1});
  return out;
}

/* ---------- paper-craft cinematic openings (Kerala backwater, brass lamps, paper arch, midnight stargaze) ---------- */
function twoNames(n){var p=String(n||'').split(/\s*(?:&|\band\b|\+|♡|❤|\bweds\b)\s*/i).filter(Boolean);return [p[0]||'Tanya',p[1]||'Rohan']}
function pr(seed){var s=seed;return function(){s=(s*9301+49297)%233280;return s/233280}}
function palmSvg(x,y,s,flip,rr){
  var o='<g class="palm"><g transform="translate('+x+' '+y+') scale('+(flip?-s:s)+' '+s+')"><path d="M0 0 C-4 -20 -2 -44 6 -64" stroke="#7a5230" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M0 0 C-4 -20 -2 -44 6 -64" stroke="#a87a4a" stroke-width="1.2" fill="none" stroke-dasharray="1 3"/><g transform="translate(6 -64)">';
  var ang=[-155,-125,-95,-60,-25,10,40,-175,60],cols=['#5f9470','#6fa87c','#4d8260','#7ab586'];
  ang.forEach(function(a,i){var L=24+(i%3)*5;o+='<g transform="rotate('+a+')"><path d="M0 0 Q'+L*.5+' -7 '+L+' 1 Q'+L*.5+' 4 0 0Z" fill="'+cols[i%4]+'" stroke="#2e5a43" stroke-width=".25" filter="url(#ps)"/><path d="M2 0 L'+(L-2)+' .6" stroke="#2e5a43" stroke-width=".3"/></g>'});
  o+='<circle cx="-2" cy="3" r="3.2" fill="#a9772f"/><circle cx="3" cy="4" r="3" fill="#c39037"/></g></g></g>';return o;
}
function lotusSvg(x,y,s,c){var o='<g transform="translate('+x+' '+y+') scale('+s+')">';[-50,-25,0,25,50].forEach(function(a){o+='<path transform="rotate('+a+')" d="M0 0 Q-5 -9 0 -17 Q5 -9 0 0Z" fill="'+c+'" stroke="rgba(120,40,70,.4)" stroke-width=".3" filter="url(#ps)"/>'});return o+'</g>'}
function pcSvg(inner,defs){return '<svg class="pcs" viewBox="0 0 100 178" preserveAspectRatio="none"><defs><filter id="ps" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx=".5" dy=".9" stdDeviation=".55" flood-color="#000" flood-opacity=".38"/></filter><filter id="bl"><feGaussianBlur stdDeviation="1.2"/></filter>'+(defs||'')+'</defs>'+inner+'</svg>'}
function keralaMarkup(){
  var r=pr(11),o='',i;
  o+='<rect width="100" height="92" fill="url(#ksk)"/>';
  for(i=0;i<26;i++)o+='<circle class="tw" style="animation-delay:'+(r()*3).toFixed(2)+'s" cx="'+(r()*100).toFixed(1)+'" cy="'+(r()*40).toFixed(1)+'" r="'+(.2+r()*.5).toFixed(2)+'" fill="#ffe9b0"/>';
  o+='<circle cx="82" cy="14" r="1.6" fill="#f0a64a"/><g transform="translate(60 12)">'+[0,72,144,216,288].map(function(a){return '<ellipse transform="rotate('+a+')" cx="0" cy="-3" rx="1.7" ry="3.1" fill="#dfe8df" stroke="#9db5a5" stroke-width=".2"/>'}).join('')+'<circle r="1.2" fill="#e8d28a"/></g>';
  // water
  o+='<rect y="88" width="100" height="90" fill="url(#kwt)"/>';
  // house group
  var house='<g class="hs"><polygon points="12,52 50,26 88,52 88,56 12,56" fill="#b98a52" filter="url(#ps)"/><polygon points="22,56 50,34 78,56" fill="#c79a60"/>';
  for(i=0;i<9;i++)house+='<line x1="'+(16+i*8.4)+'" y1="55" x2="'+(26+i*6.2)+'" y2="'+(36+i*1.4)+'" stroke="#8d6434" stroke-width=".3" opacity=".6"/>';
  house+='<rect x="24" y="56" width="52" height="36" fill="#a35f3d" filter="url(#ps)"/><rect x="22" y="54" width="56" height="3" fill="#6f4228"/>';
  house+='<rect x="38" y="60" width="24" height="32" fill="#ffe29a"/><rect x="38" y="60" width="24" height="32" fill="url(#kdr)"/><rect x="36" y="58" width="28" height="2.4" fill="#7a4a2c"/>';
  house+='<g class="cpl" fill="#2d1c18"><path d="M43 92 L43 74 C43 70 44 68 46 68 C48 68 49 70 49 74 L49 92Z"/><circle cx="46" cy="65.6" r="2.4"/><path d="M52 92 L52 76 C52 72 53 70.5 55 70.5 C57 70.5 58 72 58 76 L58 92Z"/><circle cx="55" cy="68.2" r="2.1"/><circle cx="50.4" cy="75" r="1" fill="#f3d28a"/></g>';
  [34,66].forEach(function(gx){for(var k=0;k<14;k++)house+='<circle cx="'+gx+'" cy="'+(58+k*2.4)+'" r="1.05" fill="'+(k%3===1?'#e65a2a':'#fff7e6')+'"/>'});
  for(i=0;i<=10;i++){var t=i/10,gx2=34+t*32,gy=90+Math.sin(t*3.14)*7;house+='<circle cx="'+gx2.toFixed(1)+'" cy="'+gy.toFixed(1)+'" r="1.05" fill="'+(i%3===1?'#e65a2a':'#fff7e6')+'"/>'}
  house+='</g>';
  o+=house;
  o+='<g transform="translate(0 184) scale(1 -1)" opacity=".34" filter="url(#bl)" class="rfl"><use href="#hsRef"/></g>';
  o+='<g class="gli">';for(i=0;i<150;i++){o+='<circle cx="'+(22+r()*56).toFixed(1)+'" cy="'+(124+r()*10).toFixed(1)+'" r="'+(.12+r()*.34).toFixed(2)+'" fill="#ffd574" opacity="'+(.3+r()*.7).toFixed(2)+'"/>'}o+='</g>';
  o+='<ellipse cx="50" cy="128" rx="30" ry="4.5" fill="url(#kgl)"/>';
  o+='<g class="plL">'+palmSvg(8,128,.86,0,0)+palmSvg(-2,150,1,0,0)+'</g><g class="plR">'+palmSvg(94,132,.9,1,0)+palmSvg(104,152,1.02,1,0)+'</g>';
  [[22,160,1.1],[78,163,1.15],[40,170,.8],[92,170,1],[8,168,.9]].forEach(function(l,k){o+='<ellipse cx="'+l[0]+'" cy="'+(l[1]+2)+'" rx="'+(7*l[2])+'" ry="2.4" fill="#4d8a62" filter="url(#ps)"/>'+lotusSvg(l[0],l[1],.6*l[2],k%2?'#f5a9c4':'#f9c7d8')});
  var ref='<g id="hsRef">'+house.replace('class="hs"','')+'</g>';
  return '<div class="pc pk">'+pcSvg('<g id="hsDef" style="display:none">'+'</g>'+o,'<linearGradient id="ksk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12403d"/><stop offset="1" stop-color="#1f5a50"/></linearGradient><linearGradient id="kwt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#174b45"/><stop offset="1" stop-color="#0d3330"/></linearGradient><radialGradient id="kdr"><stop offset="0" stop-color="#fff3cf" stop-opacity=".9"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></radialGradient><radialGradient id="kgl"><stop offset="0" stop-color="#ffd37a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd37a" stop-opacity="0"/></radialGradient>'+ref.replace('<g id="hsRef">','<g id="hsRef">').replace(/^/,'')).replace('</defs>','</defs>')+'<i class="fl2"></i></div>';
}
function lampSvg(cx,cy,s,ph){
  var o='<g class="lamp" transform="translate('+cx+' '+cy+') scale('+s+')">';
  o+='<ellipse cx="0" cy="40" rx="20" ry="5" fill="#4a3320"/><ellipse cx="0" cy="38" rx="20" ry="5" fill="#6b4a2a"/><ellipse cx="0" cy="37" rx="15" ry="3.2" fill="#8a6338"/>';
  o+='<path d="M-4 37 L-6 8 Q-3 2 0 2 Q3 2 6 8 L4 37Z" fill="#6f4a28"/>';
  for(var k=0;k<5;k++)o+='<ellipse cx="0" cy="'+(10+k*6)+'" rx="'+(5-Math.abs(k-2)*.6)+'" ry="1.4" fill="none" stroke="#c9985a" stroke-width=".6"/>';
  o+='<path d="M-18 0 Q-18 6 -10 6 L10 6 Q18 6 18 0 Q10 3 0 3 Q-10 3 -18 0Z" fill="#8a5e30"/><path d="M-22 -3 L22 -3" stroke="#a97a45" stroke-width="2.2" stroke-linecap="round"/>';
  [-17,17].forEach(function(x){o+='<path d="M'+(x-3)+' -3 L'+(x+3)+' -3 L'+(x+2)+' 1 L'+(x-2)+' 1Z" fill="#8a5e30"/><path class="sf" style="animation-delay:'+(ph+(x>0?.3:0))+'s" d="M'+x+' -11 Q'+(x+2.4)+' -6 '+x+' -3 Q'+(x-2.4)+' -6 '+x+' -11Z" fill="#ffb02e"/>'});
  o+='<path d="M-3 -3 L3 -3 L2 2 L-2 2Z" fill="#8a5e30"/><circle cx="0" cy="-14" r="9.5" fill="#ffd36a" opacity=".24" class="hl"/><path class="mf" style="animation-delay:'+ph+'s" d="M0 -30 Q8 -18 0 -3 Q-8 -18 0 -30Z" fill="url(#lfl)"/><path class="mf" style="animation-delay:'+(ph+.2)+'s" d="M0 -22 Q4 -14 0 -6 Q-4 -14 0 -22Z" fill="#fff6d8" opacity=".85"/>';
  return o+'</g>';
}
function lampsMarkup(){
  var o='<rect width="100" height="178" fill="url(#lbg)"/><rect width="100" height="46" fill="url(#ltop)"/>';
  var r=pr(5),i;
  o+='<g fill="#2f6b55" opacity=".85">'+[ [6,12,14],[40,6,10],[84,10,16],[66,4,8] ].map(function(l){return '<ellipse cx="'+l[0]+'" cy="'+l[1]+'" rx="'+l[2]+'" ry="'+(l[2]*.55)+'" transform="rotate('+(l[0]*3)+' '+l[0]+' '+l[1]+')"/>'}).join('')+'</g>';
  o+='<path d="M92 4 q8 6 4 16 q-6 -4 -4 -16Z" fill="#f4b1c8"/>';
  for(i=0;i<40;i++)o+='<circle class="tw" style="animation-delay:'+(r()*3).toFixed(2)+'s" cx="'+(30+r()*40).toFixed(1)+'" cy="'+(40+r()*40).toFixed(1)+'" r=".3" fill="#ffe9a0"/>';
  o+='<g class="lampsL">'+lampSvg(12,92,.72,.1)+'</g><g class="lampsC">'+lampSvg(50,86,1.05,0)+'</g><g class="lampsR">'+lampSvg(88,92,.72,.4)+'</g>';
  // toran
  o+='<rect y="148" width="100" height="30" fill="url(#lcr)"/><path d="M0 150 Q50 152 100 150" stroke="#8d7243" stroke-width=".6" fill="none"/><g class="tor">';
  for(i=0;i<13;i++){var x=3+i*7.7;o+='<path d="M'+x+' 152 q-3.4 10 0 19 q3.4 -9 0 -19Z" fill="#2b7a3d" stroke="#1d5a2b" stroke-width=".3" filter="url(#ps)"/><line x1="'+x+'" y1="153" x2="'+x+'" y2="169" stroke="#1d5a2b" stroke-width=".25"/>';
    o+='<circle cx="'+(x-1.4)+'" cy="152" r="3.1" fill="'+(i%2?'#e9b44c':'#f08a1d')+'" filter="url(#ps)"/><circle cx="'+(x-1.4)+'" cy="152" r="1.2" fill="'+(i%2?'#fff0b8':'#ffd36a')+'"/>'}
  o+='</g>';
  return '<div class="pc pl">'+pcSvg(o,'<linearGradient id="lbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c6a1f"/><stop offset=".35" stop-color="#b19a2e"/><stop offset=".72" stop-color="#8f7b24"/><stop offset=".86" stop-color="#1b3a2a"/><stop offset="1" stop-color="#f3ecd2"/></linearGradient><linearGradient id="ltop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#143b32"/><stop offset="1" stop-color="#143b32" stop-opacity="0"/></linearGradient><linearGradient id="lcr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5efd6"/><stop offset="1" stop-color="#f5efd6"/></linearGradient><linearGradient id="lfl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a00"/><stop offset=".6" stop-color="#ffc233"/><stop offset="1" stop-color="#fff2b0"/></linearGradient>')+'<i class="bm"></i></div>';
}
function archMarkup(data){
  var nm=twoNames(data&&data.names),d=data&&data.date?new Date(data.date+'T'+((data.time||'19:00'))+':00'):null,diff=d?Math.max(0,d-Date.now()):68*864e5+14*36e5+19*6e4;
  var days=Math.floor(diff/864e5),hrs=Math.floor(diff%864e5/36e5),mins=Math.floor(diff%36e5/6e4);
  var o='',i,r=pr(21);
  [[14,58,-30],[88,64,40],[10,142,20],[92,150,-20]].forEach(function(l){o+='<g class="lf"><g transform="translate('+l[0]+' '+l[1]+') rotate('+l[2]+')"><path d="M0 0 Q6 -8 14 -10 Q8 -2 0 0Z" fill="#d7c29a" stroke="#b49a68" stroke-width=".3" filter="url(#ps)"/><path d="M0 0 Q4 6 12 7 Q6 1 0 0Z" fill="#cdb585" filter="url(#ps)"/></g></g>'});
  o+='<ellipse cx="50" cy="150" rx="48" ry="7" fill="rgba(120,100,70,.18)"/>';
  o+='<path d="M16 158 L16 84 Q16 40 50 40 Q84 40 84 84 L84 158Z" fill="url(#ar1)" filter="url(#ps)"/>';
  o+='<path d="M27 150 L27 86 Q27 52 50 52 Q73 52 73 86 L73 150Z" fill="url(#ar2)"/>';
  o+='<rect x="27" y="86" width="46" height="64" fill="url(#ar3)" opacity=".0"/>';
  o+='<g class="in"><path d="M27 150 L27 86 Q27 52 50 52 Q73 52 73 86 L73 150Z" fill="url(#arl)" opacity="0"/></g>';
  // plaques + lotus
  [[13,98],[73,98]].forEach(function(p){o+='<rect x="'+p[0]+'" y="'+p[1]+'" width="14" height="9" fill="#c9b08a" filter="url(#ps)"/><g transform="translate('+(p[0]+7)+' '+(p[1]+7)+') scale(.34)" fill="none" stroke="#fff6e6" stroke-width="1.6"><path d="M0 0 Q-6 -8 0 -16 Q6 -8 0 0M-2 0 Q-12 -4 -14 -12 Q-4 -10 0 0M2 0 Q12 -4 14 -12 Q4 -10 0 0"/></g>'});
  // garland
  o+='<path d="M20 70 Q50 14 80 70" fill="none" stroke="#b8a46a" stroke-width=".9"/>';
  for(i=0;i<9;i++){var t=i/8,a=Math.PI*(1-t),gx=50-Math.cos(a)*-30*-1,gx2=50+Math.cos(a)*30,gy=70-Math.sin(a)*34;
    o+='<g transform="translate('+gx2.toFixed(1)+' '+gy.toFixed(1)+') rotate('+((t-.5)*100)+')"><path d="M0 0 q-2.4 -3.4 0 -6.5 q2.4 3.1 0 6.5Z" fill="#fffdf6" stroke="#d8d0b8" stroke-width=".25" filter="url(#ps)"/><path d="M-1.2 1 q5 2 8 6 q-5 .6 -8 -6Z" fill="#9aa76a"/><path d="M1.2 1 q-5 2 -8 6 q5 .6 8 -6Z" fill="#b2b985"/></g>'}
  // steps
  o+='<rect x="10" y="150" width="80" height="6" fill="#efe9db" filter="url(#ps)"/><rect x="6" y="156" width="88" height="7" fill="#e6dfce" filter="url(#ps)"/>';
  // couple
  o+='<g class="cp" fill="#c7ae86"><path d="M36 150 C37 130 40 112 42 104 C43 100 46 100 47 104 C49 112 52 130 56 150Z"/><circle cx="44.5" cy="98" r="3.4"/><path d="M49 150 L50 112 C50 106 53 103 56 103 C59 103 61 106 61 112 L62 150Z" fill="#bda27a"/><circle cx="56" cy="97.5" r="3.1" fill="#bda27a"/><path d="M40 150 C34 150 28 152 24 156 L56 156 Z" opacity=".5"/></g>';
  o+=lotusSvg(66,152,.5,'#d1ab6c');
  var txt='<div class="ptx"><b>'+esc(nm[0])+'</b><em>WEDS</em><b>'+esc(nm[1])+'</b><div class="cd"><span><i>'+days+'</i>DAYS</span><span><i>'+hrs+'</i>HRS</span><span><i>'+mins+'</i>MIN</span></div></div>';
  return '<div class="pc pa">'+pcSvg(o,'<linearGradient id="ar1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d6cc"/><stop offset=".35" stop-color="#f1efe9"/><stop offset=".7" stop-color="#e8e5dc"/><stop offset="1" stop-color="#cfcbbf"/></linearGradient><linearGradient id="ar2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfae8e"/><stop offset=".6" stop-color="#d8c9a8"/><stop offset="1" stop-color="#e6dbc0"/></linearGradient><linearGradient id="ar3"><stop offset="0" stop-color="#fff"/></linearGradient><radialGradient id="arl" cx="50%" cy="65%" r="60%"><stop offset="0" stop-color="#fff9e4"/><stop offset="1" stop-color="#ffe6a8"/></radialGradient>')+txt+'</div>';
}
function stargazeMarkup(data){
  var nm=twoNames(data&&data.names),o='',i,r=pr(31);
  o+='<rect width="100" height="178" fill="#1f2c96"/><rect width="100" height="178" fill="url(#pais)" opacity=".5"/>';
  o+='<polygon points="38,0 62,0 92,178 8,178" fill="url(#beam)" class="bmx"/>';
  // hanging garlands
  [[10,60],[24,44],[40,30],[60,34],[76,48],[90,62]].forEach(function(g,gi){o+='<line x1="'+g[0]+'" y1="0" x2="'+g[0]+'" y2="'+g[1]+'" stroke="#d8c58a" stroke-width=".25"/>';for(i=0;i<g[1]/4;i++){var cy=3+i*4,col=['#f6a8a0','#f8c4b8','#fff0e0','#f08c8c'][(i+gi)%4];o+='<circle cx="'+(g[0]+(i%2?1.1:-1.1))+'" cy="'+cy+'" r="'+(1.5+((i+gi)%3)*.55)+'" fill="'+col+'" filter="url(#ps)"/>'}});
  o+='<g class="sdL"><path d="M0 70 Q14 66 22 82 L22 178 L0 178Z" fill="#6b72c6" opacity=".95" filter="url(#ps)"/><rect x="0" y="70" width="22" height="108" fill="url(#pais2)" opacity=".7"/></g>';
  o+='<g class="sdR"><path d="M100 70 Q86 66 78 82 L78 178 L100 178Z" fill="#6b72c6" opacity=".95" filter="url(#ps)"/><rect x="78" y="70" width="22" height="108" fill="url(#pais2)" opacity=".7"/></g>';
  o+='<g class="pnl"><path d="M25 150 L25 66 L50 40 L75 66 L75 150Z" fill="#f7efdf" filter="url(#ps)"/><path d="M28 148 L28 67 L50 44 L72 67 L72 148Z" fill="none" stroke="#d6bf8a" stroke-width=".4"/></g>';
  var c1='<g class="cpl2"><path d="M34 178 C34 160 37 148 41 142 C43 139 46 140 47 144 L50 178Z" fill="#a8c3ea"/><circle cx="43" cy="136" r="3.4" fill="#e1a98f"/><path d="M50 178 L51 146 C51 141 54 139 57 139 C60 139 62 141 62 146 L63 178Z" fill="#f2e2c4"/><circle cx="57" cy="135" r="3.2" fill="#e1a98f"/><path d="M53 133 q4 -5 8 0 q-4 1 -8 0Z" fill="#f4ecda"/></g>';
  var txt='<div class="stx"><small>WELCOME TO THE</small><em>Wedding</em><small>OF</small><b>'+esc(nm[0])+'</b><small>&amp;</small><b>'+esc(nm[1])+'</b></div>';
  return '<div class="pc ps2">'+pcSvg(o+c1,'<pattern id="pais" width="14" height="18" patternUnits="userSpaceOnUse"><path d="M7 2 C12 4 12 12 7 15 C3 12 3 6 7 2Z M7 6 C9 7 9 11 7 12" fill="none" stroke="#7d8ae0" stroke-width=".4"/></pattern><pattern id="pais2" width="10" height="12" patternUnits="userSpaceOnUse"><path d="M5 1 C8 3 8 8 5 10 C2 8 2 4 5 1Z" fill="none" stroke="#c4caf6" stroke-width=".35"/></pattern><linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9c4" stop-opacity=".95"/><stop offset=".6" stop-color="#ffd9a8" stop-opacity=".35"/><stop offset="1" stop-color="#ffd9a8" stop-opacity="0"/></linearGradient>')+txt+'</div>';
}
var PAPER={'kerala-backwater':{n:'Kerala Backwater',ic:'🛶',d:'A paper-craft backwater at night: a lit doorway, palms and lotus — the camera glides to the glowing door and the card unfolds.',tile:['#1f5a50','#ffd37a']},
 'diya-lamps':{n:'Nilavilakku Lamps',ic:'🪔',d:'Three brass temple lamps with a mango-leaf and marigold toran — the flames rise and light up your card.',tile:['#b19a2e','#1b3a2a']},
 'paper-arch':{n:'Paper Arch',ic:'🏛️',d:'A cream paper-craft arch with jasmine, your names and a live countdown — the camera walks through the arch.',tile:['#efe9db','#c9b08a']},
 'midnight-stargaze':{n:'Midnight Stargaze',ic:'🌌',d:'Indigo paisley doors slide apart under hanging blossoms; a beam of light lifts the welcome panel into your card.',tile:['#1f2c96','#f6a8a0']}};
function paperMarkup(id,data){return id==='kerala-backwater'?keralaMarkup():id==='diya-lamps'?lampsMarkup():id==='paper-arch'?archMarkup(data):stargazeMarkup(data)}
function paperList(){return Object.keys(PAPER).map(function(k){var t=PAPER[k];return {id:k,name:t.n,group:'cinematic',icon:t.ic,desc:t.d,tile:t.tile,ms:6000,cam:1,prem:1}})}

OPENINGS=paperList().concat(cineList()).concat(OPENINGS);
/* ---------- ocean (canvas) ---------- */
function OceanRun(opEl){
  var cv=opEl.querySelector('canvas');if(!cv)return null;
  var c=cv.getContext('2d'),W=0,H=0,raf=0,go=false,g0=0,bub=[],i;
  function size(){var d=Math.min(2,global.devicePixelRatio||1);W=global.innerWidth;H=global.innerHeight;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}
  size();global.addEventListener('resize',size);
  for(i=0;i<46;i++)bub.push({x:Math.random(),y:Math.random(),s:1+Math.random()*3.5,v:.3+Math.random()*.9,p:Math.random()*9});
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
  function lerp(a,b,t){return a+(b-a)*t}
  function wy(x,k,amp,t){return Math.sin(x*.011+t*.0013*(k+1)+k*1.9)*amp+Math.sin(x*.026-t*.0009*(k+1)+k)*amp*.5+Math.sin(x*.0045+t*.0006)*amp*.9}
  function frame(ts){
    var T=go?ts-g0:-1,L,amp=1,sky=1,fade=1;
    if(!go){L=.57+.012*Math.sin(ts/1100)}
    else if(T<1500){var e=ease(T/1500);L=lerp(.57,.82,e);amp=1+e*1.6;sky=1-e*.7}
    else if(T<2900){var e2=ease((T-1500)/1400);L=lerp(.82,1.3,e2);amp=2.6-e2*1.2;sky=.3*(1-e2)}
    else if(T<3500){L=1.3;amp=1.2;sky=0}
    else {var e3=ease(Math.min(1,(T-3500)/1900));L=lerp(1.3,-.12,e3);amp=1.2+e3*.4;sky=0;fade=T>4300?Math.max(0,1-(T-4300)/1100):1}
    c.clearRect(0,0,W,H);c.globalAlpha=fade;
    var y0=H*(1-L);
    if(sky>0){
      var sg=c.createLinearGradient(0,0,0,H*.7);sg.addColorStop(0,'#1b2f5e');sg.addColorStop(.45,'#7a6fa8');sg.addColorStop(.75,'#f0a07c');sg.addColorStop(1,'#ffd9a0');
      c.globalAlpha=fade*sky;c.fillStyle=sg;c.fillRect(0,0,W,H);
      var sun=c.createRadialGradient(W*.5,H*.43,0,W*.5,H*.43,H*.32);sun.addColorStop(0,'rgba(255,240,200,.95)');sun.addColorStop(.25,'rgba(255,196,128,.55)');sun.addColorStop(1,'rgba(255,170,100,0)');c.fillStyle=sun;c.fillRect(0,0,W,H);
      c.globalAlpha=fade;
    }
    var cols=[['#0a5577','#04304a'],['#0f7894','#06415c'],['#23a0b6','#0b5670'],['#5bc7d3','#127189']];
    for(var k=0;k<4;k++){
      var base=y0+k*H*.02+(3-k)*H*.01,a=(5+k*5)*amp,al=.9;
      c.beginPath();c.moveTo(0,H+20);
      for(var x=0;x<=W+8;x+=7)c.lineTo(x,base+wy(x,k,a,ts));
      c.lineTo(W,H+20);c.closePath();
      var gr=c.createLinearGradient(0,base-a,0,base+H*.5);gr.addColorStop(0,cols[k][0]);gr.addColorStop(1,cols[k][1]);
      c.globalAlpha=fade*al;c.fillStyle=gr;c.fill();
      if(k>=2){ // foam
        c.beginPath();for(var x2=0;x2<=W+8;x2+=7){var yy=base+wy(x2,k,a,ts);x2?c.lineTo(x2,yy):c.moveTo(x2,yy)}
        c.strokeStyle='rgba(255,255,255,'+(k===3?.8:.35)+')';c.lineWidth=k===3?3.2:1.6;c.shadowColor='rgba(255,255,255,.8)';c.shadowBlur=k===3?10:4;c.stroke();c.shadowBlur=0;
        if(k===3){c.fillStyle='rgba(255,255,255,.55)';for(var f=0;f<26;f++){var fx=(f*83+ts*.03*(1+f%3))%W,fy=base+wy(fx,k,a,ts)-1+Math.sin(f+ts*.004)*2;c.beginPath();c.arc(fx,fy,1+(f%3),0,6.3);c.fill()}}
      }
    }
    // caustics + glitter in the water
    if(y0<H*.98){
      c.globalCompositeOperation='lighter';c.lineWidth=1.2;
      for(var q=0;q<9;q++){c.beginPath();var oy=y0+H*.05+q*H*.045;for(var x3=0;x3<=W;x3+=10){var yq=oy+Math.sin(x3*.02+ts*.0011+q*1.3)*9+Math.sin(x3*.047-ts*.0016+q)*4;x3?c.lineTo(x3,yq):c.moveTo(x3,yq)}c.strokeStyle='rgba(170,240,250,'+(.07*(1-q/10))+')';c.stroke()}
      c.globalCompositeOperation='source-over';
      for(i=0;i<bub.length;i++){var b=bub[i];b.y-=b.v*.0007*16;if(b.y<0)b.y=1;var bx=b.x*W+Math.sin(ts*.002+b.p)*6,by=y0+(H-y0)*b.y;if(by<y0+4)continue;c.beginPath();c.arc(bx,by,b.s,0,6.3);c.strokeStyle='rgba(220,250,255,.5)';c.lineWidth=.8;c.stroke()}
    }
    c.globalAlpha=1;
    if(!go||T<5400)raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  return {go:function(){go=true;g0=performance.now()},stop:function(){cancelAnimationFrame(raf);global.removeEventListener('resize',size)}};
}

/* ---------- palace chandelier hall (canvas) ---------- */
function PalaceRun(opEl){
  var cv=opEl.querySelector('canvas');if(!cv)return null;
  var c=cv.getContext('2d'),W=0,H=0,raf=0,go=false,g0=0,bg=null,cand=[],gl=[],dust=[],i,u=1;
  function rnd(a,b){return a+Math.random()*(b-a)}
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
  function build(){
    var d=Math.min(2,global.devicePixelRatio||1);W=global.innerWidth;H=global.innerHeight;u=W/390;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0);
    bg=document.createElement('canvas');bg.width=W*d;bg.height=H*d;var x=bg.getContext('2d');x.setTransform(d,0,0,d,0,0);
    var vx=W*.5,vy=H*.55,g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0c0705');g.addColorStop(.55,'#1b100a');g.addColorStop(1,'#07040a');x.fillStyle=g;x.fillRect(0,0,W,H);
    // dome
    var dg=x.createRadialGradient(vx,H*.1,10,vx,H*.1,W*.7);dg.addColorStop(0,'#2a1a10');dg.addColorStop(1,'#0b0604');x.fillStyle=dg;x.beginPath();x.ellipse(vx,H*.1,W*.68,H*.2,0,0,6.3);x.fill();
    for(i=0;i<6;i++){x.strokeStyle='rgba(200,150,80,'+(.28-i*.03)+')';x.lineWidth=1.2*u;x.beginPath();x.ellipse(vx,H*.1,W*(.66-i*.1),H*(.19-i*.03),0,0,6.3);x.stroke();
      var n=14+i*4;for(var k=0;k<n;k++){var a=k/n*6.283,px=vx+Math.cos(a)*W*(.62-i*.1),py=H*.1+Math.sin(a)*H*(.175-i*.03);x.fillStyle='rgba(190,140,70,.28)';x.beginPath();x.arc(px,py,2.2*u,0,6.3);x.fill()}}
    // side arcades (perspective)
    for(var side=-1;side<=1;side+=2){
      for(i=0;i<4;i++){
        var s=1-i*.19,xo=vx+side*(W*.5*s+(i? -W*.0:0)),w=W*.17*s,top=H*(.2+i*.06),bot=H*(.78-i*.04);
        var cx=vx+side*(W*.46*s-(w*.2)),gx=x.createLinearGradient(cx-w/2,0,cx+w/2,0);gx.addColorStop(0,'#2b190d');gx.addColorStop(.5,'#6a4624');gx.addColorStop(1,'#23140a');
        x.fillStyle=gx;x.fillRect(cx-w*.5,top,w,bot-top);
        // arch + inner light
        x.strokeStyle='rgba(215,165,90,'+(.55*s)+')';x.lineWidth=2*u*s;x.beginPath();x.moveTo(cx-w*.38,bot);x.lineTo(cx-w*.38,top+w*.5);x.quadraticCurveTo(cx,top-w*.3,cx+w*.38,top+w*.5);x.lineTo(cx+w*.38,bot);x.stroke();
        var lg=x.createRadialGradient(cx,(top+bot)*.52,2,cx,(top+bot)*.52,w*.7);lg.addColorStop(0,'rgba(255,196,110,'+(.5*s)+')');lg.addColorStop(1,'rgba(255,170,80,0)');x.fillStyle=lg;x.fillRect(cx-w,top,w*2,bot-top);
        for(var m=0;m<9;m++){x.fillStyle='rgba(200,150,80,.2)';x.fillRect(cx-w*.5,top+(bot-top)*(m/9),w,1)}
      }
    }
    // back doorway
    var bgw=W*.2,bh=H*.2;var bl=x.createRadialGradient(vx,vy,2,vx,vy,W*.35);bl.addColorStop(0,'rgba(255,200,120,.85)');bl.addColorStop(.35,'rgba(255,160,70,.35)');bl.addColorStop(1,'rgba(255,140,50,0)');x.fillStyle=bl;x.fillRect(0,vy-H*.25,W,H*.5);
    x.fillStyle='#120a06';x.beginPath();x.moveTo(vx-bgw*.5,vy+bh*.5);x.lineTo(vx-bgw*.5,vy-bh*.1);x.quadraticCurveTo(vx,vy-bh*.75,vx+bgw*.5,vy-bh*.1);x.lineTo(vx+bgw*.5,vy+bh*.5);x.fill();
    x.strokeStyle='rgba(225,175,95,.7)';x.lineWidth=1.6*u;x.stroke();
    // floor
    var fy=H*.64,fg=x.createLinearGradient(0,fy,0,H);fg.addColorStop(0,'#3a2412');fg.addColorStop(.5,'#1d120a');fg.addColorStop(1,'#0d0806');x.fillStyle=fg;x.fillRect(0,fy,W,H-fy);
    x.strokeStyle='rgba(215,165,90,.22)';x.lineWidth=1;
    for(i=0;i<14;i++){var yy=fy+Math.pow(i/13,1.9)*(H-fy);x.beginPath();x.moveTo(0,yy);x.lineTo(W,yy);x.stroke()}
    for(i=-9;i<=9;i++){x.beginPath();x.moveTo(vx+i*W*.02,fy);x.lineTo(vx+i*W*.2,H);x.stroke()}
    for(i=0;i<5;i++){x.strokeStyle='rgba(225,175,95,'+(.4-i*.06)+')';x.lineWidth=1.5;x.beginPath();x.ellipse(vx,H*.9,W*(.42-i*.07),H*(.06-i*.01),0,0,6.3);x.stroke()}
    // chandelier body
    var cx0=vx,cy0=H*.1;x.strokeStyle='rgba(210,170,100,.7)';x.lineWidth=1.4*u;x.beginPath();x.moveTo(cx0,0);x.lineTo(cx0,cy0+H*.02);x.stroke();
    cand=[];gl=[];
    var tiers=[{y:H*.17,w:W*.1,n:5},{y:H*.25,w:W*.2,n:7},{y:H*.34,w:W*.34,n:9}];
    tiers.forEach(function(t,ti){
      for(var k=0;k<t.n;k++){
        var f=(k/(t.n-1))*2-1,px=cx0+f*t.w,py=t.y+Math.abs(f)*H*.012;
        // arm
        x.strokeStyle='rgba(210,170,100,.85)';x.lineWidth=1.2*u;x.beginPath();x.moveTo(cx0,t.y-H*.012);x.quadraticCurveTo(cx0+f*t.w*.5,t.y+H*.022,px,py);x.stroke();
        // candle
        x.fillStyle='#f1e6cf';x.fillRect(px-1.8*u,py-H*.022,3.6*u,H*.022);cand.push({x:px,y:py-H*.025,s:ti===2?1.1:.9,ph:Math.random()*9});
        // crystal strands
        for(var q=0;q<5;q++){var qx=px+(q-2)*3.2*u,ql=H*(.02+((k+q)%3)*.012+ti*.004);x.strokeStyle='rgba(235,215,170,.55)';x.lineWidth=.6;x.beginPath();x.moveTo(qx,py);x.lineTo(qx,py+ql);x.stroke();x.fillStyle='rgba(255,236,200,.9)';x.beginPath();x.moveTo(qx,py+ql+3.4*u);x.lineTo(qx-1.6*u,py+ql);x.lineTo(qx+1.6*u,py+ql);x.fill();if(q%2===0)gl.push({x:qx,y:py+ql,p:Math.random()*9})}
      }
    });
    // bowl
    var by=H*.4;for(i=0;i<9;i++){var rr=W*(.19-i*.014);x.strokeStyle='rgba(235,205,150,'+(.5-i*.04)+')';x.lineWidth=1.4;x.beginPath();x.ellipse(cx0,by-i*H*.008,rr,rr*.22,0,0,3.14);x.stroke()}
    var bgr=x.createRadialGradient(cx0,by-H*.01,3,cx0,by-H*.01,W*.2);bgr.addColorStop(0,'rgba(255,225,160,.55)');bgr.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=bgr;x.beginPath();x.ellipse(cx0,by-H*.01,W*.2,H*.06,0,0,6.3);x.fill();
    for(i=0;i<110;i++){var aa=rnd(0,6.283),rad=rnd(.02,.19)*W,gx2=cx0+Math.cos(aa)*rad,gy2=by-Math.abs(Math.sin(aa))*rad*.22-rnd(0,H*.05)+H*.01;gl.push({x:gx2,y:gy2,p:Math.random()*9});x.fillStyle='rgba(255,236,190,.65)';x.beginPath();x.arc(gx2,gy2,rnd(.6,1.4)*u,0,6.3);x.fill()}
    x.strokeStyle='rgba(235,205,150,.7)';x.beginPath();x.moveTo(cx0,by);x.lineTo(cx0,by+H*.04);x.stroke();x.fillStyle='rgba(255,236,200,.95)';x.beginPath();x.moveTo(cx0,by+H*.055);x.lineTo(cx0-4*u,by+H*.038);x.lineTo(cx0+4*u,by+H*.038);x.fill();
    dust=[];for(i=0;i<60;i++)dust.push({x:rnd(0,W),y:rnd(0,H*.8),s:rnd(.5,1.6),v:rnd(.1,.4),p:rnd(0,9)});
  }
  build();global.addEventListener('resize',build);
  function frame(ts){
    var T=go?ts-g0:-1,z=1,bloom=0,alpha=1,glow=1;
    if(!go){z=1+.012*Math.sin(ts/1900);glow=.9+.1*Math.sin(ts/700)}
    else if(T<3400){var e=ease(T/3400);z=1+e*1.9;glow=1+e*.9;bloom=T>2500?(T-2500)/900:0}
    else{z=2.9+(T-3400)/9000;glow=1.9;bloom=1;alpha=Math.max(0,1-(T-3600)/1700)}
    if(bloom>1)bloom=1;
    var vx=W*.5,vy=H*.52;
    c.clearRect(0,0,W,H);c.globalAlpha=alpha;
    c.save();c.translate(vx,vy);c.scale(z,z);c.translate(-vx,-vy);
    c.drawImage(bg,0,0,W,H);
    // floor reflection of the chandelier
    var rf=c.createLinearGradient(0,H*.64,0,H);rf.addColorStop(0,'rgba(255,190,100,'+(.25*glow)+')');rf.addColorStop(1,'rgba(255,170,80,0)');c.fillStyle=rf;c.beginPath();c.moveTo(W*.4,H*.64);c.lineTo(W*.6,H*.64);c.lineTo(W*.78,H);c.lineTo(W*.22,H);c.fill();
    c.globalCompositeOperation='lighter';
    // flames
    for(i=0;i<cand.length;i++){var f=cand[i],fl=.75+.25*Math.sin(ts*.011+f.ph)+.1*Math.sin(ts*.027+f.ph*2),hh=H*.014*f.s*fl;
      var gr=c.createRadialGradient(f.x,f.y,0,f.x,f.y,18*u*f.s*glow);gr.addColorStop(0,'rgba(255,214,140,'+(.8*fl)+')');gr.addColorStop(1,'rgba(255,150,60,0)');c.fillStyle=gr;c.beginPath();c.arc(f.x,f.y,18*u*f.s*glow,0,6.3);c.fill();
      c.fillStyle='rgba(255,236,190,'+(.95*fl)+')';c.beginPath();c.moveTo(f.x,f.y-hh);c.quadraticCurveTo(f.x+2.4*u,f.y,f.x,f.y+1.5*u);c.quadraticCurveTo(f.x-2.4*u,f.y,f.x,f.y-hh);c.fill()}
    var big=c.createRadialGradient(W*.5,H*.3,0,W*.5,H*.3,W*.55);big.addColorStop(0,'rgba(255,205,120,'+(.2*glow)+')');big.addColorStop(1,'rgba(255,170,80,0)');c.fillStyle=big;c.fillRect(0,0,W,H*.7);
    // crystal sparkle
    for(i=0;i<gl.length;i++){var g=gl[i],tw=Math.max(0,Math.sin(ts*.004+g.p*3));if(tw>.82){var sz=(2+tw*3)*u*glow;c.fillStyle='rgba(255,246,220,'+(tw-.6)+')';c.fillRect(g.x-sz,g.y-.4,sz*2,.8);c.fillRect(g.x-.4,g.y-sz,.8,sz*2)}}
    // dust in the light
    for(i=0;i<dust.length;i++){var d2=dust[i];d2.y-=d2.v*.5;d2.x+=Math.sin(ts*.0007+d2.p)*.25;if(d2.y<0)d2.y=H*.8;c.fillStyle='rgba(255,220,160,'+(.25+.25*Math.sin(ts*.002+d2.p))+')';c.beginPath();c.arc(d2.x,d2.y,d2.s*u,0,6.3);c.fill()}
    c.restore();c.globalCompositeOperation='lighter';
    if(bloom>0){var bg2=c.createRadialGradient(vx,H*.5,0,vx,H*.5,Math.max(W,H)*.9);bg2.addColorStop(0,'rgba(255,244,214,'+(bloom*.95)+')');bg2.addColorStop(.5,'rgba(255,210,140,'+(bloom*.55)+')');bg2.addColorStop(1,'rgba(255,170,80,'+(bloom*.2)+')');c.fillStyle=bg2;c.fillRect(0,0,W,H)}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;
    if(!go||T<5600)raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  return {go:function(){go=true;g0=performance.now()},stop:function(){cancelAnimationFrame(raf);global.removeEventListener('resize',build)}};
}

var RUNNERS={'ocean-wave':OceanRun,'palace-chandelier':PalaceRun};
/* ---------- opening markup ---------- */
function rnd(a,b){return a+Math.random()*(b-a)}
function artBg(data){var a=(data&&data.art)||{};if(a.img)return 'background-image:url(&quot;'+String(a.img).replace(/"/g,'%22')+'&quot;)';var p=a.p||['#3a2a18','#0b0907'];return 'background:linear-gradient(160deg,'+esc(p[0])+','+esc(p[1])+')'}
function opMarkup(id,data){
  var i,h='';
  switch(id){
    case 'velvet-curtains':return '<i class="a"></i><i class="b"></i><i class="c"></i>';
    case 'palace-doors':return '<i class="e"></i><i class="a"></i><i class="b"></i><i class="d l"></i><i class="d r"></i>';
    case 'royal-gate':return '<i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i><b class="ic">⚜️</b>';
    case 'royal-ribbon':return '<i class="c"></i><i class="e"></i><i class="a"></i><i class="b"></i><b class="ic">🎀</b>';
    case 'royal-mirror':return '<i class="cv"></i><i class="a"></i>';
    case 'luxury-letter':return '<i class="mb"></i><i class="bk1"></i><i class="bk2"></i><i class="bk3"></i><u class="env"><i class="eb"></i><i class="ec" style="'+artBg(data)+'"></i><i class="ef"></i><i class="el"></i><i class="es"><b>✦</b></i></u>';
    case 'card-open':return '<i class="cg"></i><u class="cov"><i class="pn"><i class="fr"><b class="m1">✦</b><b class="m2">You are invited</b><b class="m3">with joy &amp; blessings</b></i><i class="bkf"></i></i></u>';
    case 'scroll-open':return '<i class="a"></i><i class="b"></i><i class="d"></i><b class="ic">📜</b>';
    case 'gift-box':return '<i class="e"></i><u class="w"><i class="a"></i><u class="l"><i class="b"></i><b class="d">🎀</b></u></u>';
    case 'golden-spotlight':return '<i class="cv"></i>';
    case 'ocean-wave':case 'palace-chandelier':return '<canvas class="oc"></canvas>';
    case 'clouds-parting':return '<i class="s"></i><i class="a"></i><i class="b"></i><b class="ic">☁️</b>';
    case 'rain-curtain':return '<i class="s"></i><i class="c"></i><i class="a"></i><i class="b"></i><b class="ic">🌧️</b>';
    case 'snow-frost':return '<i class="s"></i><i class="a"></i><i class="b"></i><b class="ic">❄️</b>';
    case 'petal-bloom':for(i=0;i<10;i++)h+='<i style="--i:'+i+'"></i>';return '<i class="cv"></i><u class="f">'+h+'</u>';
    case 'wind-leaves':h='<i class="s"></i>';for(i=0;i<22;i++){var dx=rnd(60,140),dy=rnd(-80,-10);h+='<b class="lf" style="--x:'+rnd(-4,92).toFixed(0)+'%;--y:'+rnd(-3,92).toFixed(0)+'%;--r:'+rnd(-60,60).toFixed(0)+'deg;--sz:'+rnd(7,13).toFixed(1)+'vmin;--d:'+rnd(0,2).toFixed(2)+'s;--fd:'+rnd(.2,1.2).toFixed(2)+'s;--dx:'+dx.toFixed(0)+'vw;--dy:'+dy.toFixed(0)+'vh;--rot:'+rnd(200,520).toFixed(0)+'deg">🍃</b>'}return h;
    case 'galaxy-stars':return '<i class="s"></i><u class="w"><i class="a"></i><i class="b"></i><i class="c"></i></u><b class="ic">🌌</b>';
    case 'lightning':return '<i class="s"></i><i class="a"></i><i class="b"></i><i class="f"></i><b class="ic">⚡</b>';
    case 'fire-spark':h='<i class="s"></i>';for(i=0;i<26;i++)h+='<i class="sp" style="--x:'+rnd(2,98).toFixed(0)+'%;--sz:'+rnd(3,8).toFixed(1)+'px;--t:'+rnd(1.6,3.2).toFixed(2)+'s;--d:'+rnd(0,2.4).toFixed(2)+'s;--dx:'+rnd(-9,9).toFixed(0)+'vw"></i>';return h+'<i class="b"></i><b class="ic">🔥</b>';
    case 'diya-reveal':return '<i class="cv"></i><u class="d"><b>🪔</b></u>';
    case 'floral-temple':return '<i class="cv"></i><u class="f"><i class="a"></i><i class="b"></i><b class="g">🌼</b></u>';
    case 'arch-reveal':return '<i class="cv"></i><u class="f"><i class="a"></i><i class="b"></i><i class="c"></i></u><b class="ic">✦</b>';
    case 'celebration-burst':h='<i class="cv"></i><i class="e"></i>';var cols=['#ff4d8d','#ffd24d','#4dd2ff','#8dff6a','#c06bff','#ffffff'];for(i=0;i<56;i++){var ang=Math.random()*6.283,dist=rnd(45,115);h+='<i class="cf" style="--x:'+rnd(3,95).toFixed(0)+'%;--y:'+rnd(3,95).toFixed(0)+'%;--w:'+rnd(5,10).toFixed(0)+'px;--h:'+rnd(8,16).toFixed(0)+'px;--c:'+cols[i%6]+';--d:'+rnd(0,1.5).toFixed(2)+'s;--fd:'+rnd(.4,.8).toFixed(2)+'s;--dx:'+(Math.cos(ang)*dist).toFixed(0)+'vmax;--dy:'+(Math.sin(ang)*dist).toFixed(0)+'vmax;--rot:'+rnd(300,900).toFixed(0)+'deg"></i>'}return h+'<b class="ic">🎊</b>';
  }
  if(PAPER[id])return paperMarkup(id,data);
  if(ENV[id]||DOORS[id])return cineMarkup(id,data);
  return '<i class="cv"></i>';
}

/* ---------- player ---------- */
var current=null;
function close(){if(!current)return;var c=current;current=null;c.destroy()}
function icsFor(data){
  var f=fmtDate(data.date);if(!f)return '';
  var t=String(data.time||'').match(/^(\d{1,2}):(\d{2})/),pad=function(n){return String(n).padStart(2,'0')};
  var ds=f.d.getFullYear()+pad(f.d.getMonth()+1)+pad(f.d.getDate());
  var s=t?ds+'T'+pad(+t[1])+t[2]+'00':ds;
  var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UTSAVLY//EN','BEGIN:VEVENT','UID:'+Date.now()+'@utsavly','DTSTART'+(t?'':';VALUE=DATE')+':'+s,'SUMMARY:'+String(data.occasion||'Invitation')+' — '+String(data.names||'').replace(/[\r\n,;]/g,' '),'LOCATION:'+String(data.venue||'').replace(/[\r\n,;]/g,' '),'END:VEVENT','END:VCALENDAR'];
  return 'data:text/calendar;charset=utf8,'+encodeURIComponent(lines.join('\r\n'));
}
function open(data,opts){
  close();
  data=data||{};opts=opts||{};
  var art=data.art||{};
  var op=opById(data.opening);
  var site=data.site||(global.location&&/^https?:/.test(global.location.protocol)?global.location.origin+'/':'');
  var root=document.createElement('div');root.className='up';root.setAttribute('role','dialog');root.setAttribute('aria-label','Invitation');
  var ink=artInk(art);
  root.innerHTML='<div class="up-backdrop"></div><div class="up-stage"></div><canvas class="up-fx"></canvas><div class="up-flash"></div>'
    +'<div class="op" data-op="'+esc(op.id)+'">'+opMarkup(op.id,data)+'</div>'
    +'<div class="up-sheet"></div>'
    +'<div class="up-top"><span>UTSAVLY</span><div><button class="up-btn" data-act="mute" aria-label="Toggle sound">♪</button><button class="up-btn" data-act="close" aria-label="Close invitation">✕</button></div></div>'
    +'<div class="up-tap">Tap to open</div><div class="up-hint"><span></span><i>↑</i></div>'
    +'<div class="up-nav"><button data-act="prev">‹ Back</button><button data-act="next">Next ›</button></div>'
    +'<div class="up-foot"><a href="'+IG+'" target="_blank" rel="noopener noreferrer">Developed by <b>Gourav Patyal</b></a></div>'
    +'<div class="up-replay"><button data-act="replay">↻ Replay</button><button data-act="close">Close</button></div>';
  document.body.appendChild(root);document.body.classList.add('upOpen');
  var stage=root.querySelector('.up-stage'),backdrop=root.querySelector('.up-backdrop'),opEl=root.querySelector('.op'),hint=root.querySelector('.up-hint'),tap=root.querySelector('.up-tap'),sheet=root.querySelector('.up-sheet'),replay=root.querySelector('.up-replay');
  var oceanRun=RUNNERS[op.id]?RUNNERS[op.id](opEl):null;
  var card=buildCard(data);stage.appendChild(card);var zone=card.__zone;
  zone.__lim=Math.min(.82,2*Math.min(zoneBox(art).y,100-zoneBox(art).y)/100);
  if(art.img)backdrop.style.backgroundImage='url("'+String(art.img).replace(/"/g,'%22')+'")';
  else{backdrop.style.background='radial-gradient(circle at 50% 40%,'+((art.p&&art.p[0])||'#3a2a18')+',#050403)';var bgc=buildCard({art:art,font:data.font});bgc.style.cssText='position:absolute;inset:0;width:100%;height:100%';bgc.__zone.remove();backdrop.appendChild(bgc)}
  var state={i:0,busy:false,opened:false,musicOn:false,timers:[],dead:false};
  ratioFor(art,function(r){stage.style.setProperty('--ar',r);opEl.style.setProperty('--ar',r);if(state.i>0)refit()});

  var fx=new Effects(root.querySelector('.up-fx'),root.querySelector('.up-flash'));fx.resize();
  var music=new Music();
  var startIdx={opening:0,date:1,effect:2,names:3,venue:4,throughout:0}[data.musicStart||'opening'];if(startIdx==null)startIdx=0;
  var hasAudio=!!(data.musicUrl||(data.music==='upload'&&data.audioUrl)||(data.music&&data.music!=='none'&&data.music!=='upload'));
  function later(fn,ms){var t=setTimeout(function(){if(!state.dead)fn()},ms);state.timers.push(t);return t}
  function refit(){fitZone(zone,stage.clientHeight||600)}
  function startMusic(){
    if(state.musicOn||!hasAudio)return;state.musicOn=true;
    var url=data.musicUrl||(data.music==='upload'?data.audioUrl:'');
    music.play({kind:data.music,url:url,start:data.trimStart,end:data.trimEnd});
  }
  function maybeMusic(idx){if(idx>=startIdx)startMusic()}
  function setHint(txt){hint.firstChild.textContent=txt||'';hint.classList.toggle('on',!!txt)}
  function swapZone(html,after){
    zone.classList.add('upz-fadeout');
    later(function(){zone.classList.remove('upz-fadeout');zone.innerHTML=html;refit();if(after)after()},zone.innerHTML?420:0);
  }
  function showDate(){state.i=1;maybeMusic(1);swapZone(blockDate(data),function(){later(function(){setHint('Swipe up');},1800)})}
  function runEffect(){
    state.i=2;state.busy=true;maybeMusic(2);setHint('');
    zone.classList.add('upz-fadeout');
    var kind=data.revealEffect||'flowers',intensity=data.effectIntensity||'cinematic';
    var dur=kind==='none'?1100:({soft:2800,cinematic:3800,intense:4800}[intensity]||3800);
    later(function(){fx.start(kind,intensity)},kind==='none'?0:350);
    later(function(){fx.end()},dur);
    later(function(){showNames();state.busy=false},dur+900);
  }
  function showNames(){state.i=3;maybeMusic(3);zone.classList.remove('upz-fadeout');zone.innerHTML=blockNames(data);refit();later(function(){setHint('Swipe up')},2200)}
  var autoT=null,galT=null;
  var photos=(data.gallery||[]).filter(Boolean).slice(0,8);
  function allSaves(){return (data.photo?[data.photo]:[]).concat(photos)}
  function seq(){return photos.length?[1,3,4,6,5]:[1,3,4,5]}
  function stopGal(){clearInterval(galT);galT=null}
  function showVenue(fwd){
    stopGal();state.i=4;root.classList.remove('isComplete');maybeMusic(4);
    swapZone(blockVenue(data),function(){setHint('');if(fwd&&!photos.length)autoT=later(function(){if(state.i===4)goStep(5,true)},3800)});
  }
  function blockGallery(){
    return '<p class="upz-eyebrow">Moments</p><div class="upz-gal">'+photos.map(function(u,i){return '<img alt="" src="'+esc(u)+'" class="'+(i?'':'on')+'">'}).join('')+'</div><div class="upz-dots">'+photos.map(function(u,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div>';
  }
  function showGallery(){
    stopGal();state.i=6;root.classList.remove('isComplete');maybeMusic(6);
    swapZone(blockGallery(),function(){
      setHint('');var im=zone.querySelectorAll('.upz-gal img'),dt=zone.querySelectorAll('.upz-dots i'),k=0;
      if(im.length>1)galT=setInterval(function(){im[k].classList.remove('on');dt[k].classList.remove('on');k=(k+1)%im.length;im[k].classList.add('on');dt[k].classList.add('on')},2300);
    });
  }
  function showComplete(){
    clearTimeout(autoT);stopGal();state.i=5;setHint('');maybeMusic(5);
    zone.classList.remove('upz-fadeout');zone.innerHTML=blockNames(data,true);
    root.classList.add('isComplete');
    var f=fmtDate(data.date),t=fmtTime(data.time),h='<div>';
    h+='<p class="sh-eyebrow">'+esc(data.occasion||'You are invited')+'</p>';
    if(f)h+='<div class="sh-row"><span>📅</span><b>'+esc(f.long)+(t?' · '+esc(t):'')+'</b></div>';
    if(data.venue)h+='<div class="sh-row"><span>📍</span><b>'+esc(data.venue)+'</b></div>';
    if(data.message)h+='<p class="sh-msg" dir="auto">“'+esc(data.message)+'”</p>';
    if(f){var days=Math.round((f.d-new Date(new Date().setHours(0,0,0,0)))/864e5);h+=days>0?'<div class="sh-count">'+days+' day'+(days>1?'s':'')+' to go</div>':(days===0?'<div class="sh-count">Today!</div>':'')}
    var sv=allSaves();
    if(sv.length)h+='<div class="sh-gal">'+sv.map(function(u,i){return '<a href="'+esc(u)+'" download="photo-'+(i+1)+'.jpg"><img src="'+esc(u)+'" alt="Photo '+(i+1)+'"><span>Save</span></a>'}).join('')+'</div><p class="sh-note">Tap a photo to save it</p>';
    h+='<div class="sh-actions"><button data-act="prev">‹ Back</button>';
    if(data.venue)h+='<a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(data.venue)+'" target="_blank" rel="noopener noreferrer">📍 Open map</a>';
    var ics=icsFor(data);if(ics)h+='<a href="'+ics+'" download="invitation.ics">📅 Add to calendar</a>';
    h+='</div>';
    h+='<div class="up-brand">✦ Made with <b>UTSAVLY</b><br>Developed by <a href="'+IG+'" target="_blank" rel="noopener noreferrer">Gourav Patyal</a><br>'+(site?'<a class="create" href="'+esc(site)+'" target="_blank" rel="noopener noreferrer">Create your own invitation →</a>':'')+'</div></div>';
    sheet.innerHTML=h;sheet.scrollTop=0;
    later(refit,1100);
  }
  function goStep(n,fwd){
    clearTimeout(autoT);stopGal();
    if(n===1){root.classList.remove('isComplete');state.i=1;swapZone(blockDate(data),function(){setHint('Swipe up')})}
    else if(n===3){root.classList.remove('isComplete');showNames()}
    else if(n===4)showVenue(fwd);
    else if(n===6)showGallery();
    else if(n===5)showComplete();
  }
  function openIt(){
    if(state.opened)return;state.opened=true;tap.classList.add('off');root.classList.add('isOpened');
    maybeMusic(0);
    opEl.classList.add('go');if(oceanRun)oceanRun.go();
    if(op.cam){later(function(){root.classList.add('camIn')},Math.round(op.ms*.5));later(function(){root.classList.remove('camIn')},op.ms+2600)}
    later(function(){opEl.classList.add('done');
      if(opts.openingOnly){replay.classList.add('on');return}
      showDate();
    },op.ms);
  }
  function next(){
    if(state.busy||!state.opened||opts.openingOnly)return;
    var q=seq(),ix=q.indexOf(state.i);if(ix<0||ix>=q.length-1)return;
    clearTimeout(autoT);
    if(state.i===1){setHint('');runEffect();return}
    goStep(q[ix+1],true);
  }
  function prev(){
    if(state.busy||!state.opened||opts.openingOnly)return;
    var q=seq(),ix=q.indexOf(state.i);if(ix<=0)return;
    goStep(q[ix-1],false);
  }
  var nav=root.querySelector('.up-nav'),bPrev=nav.querySelector('[data-act=prev]'),bNext=nav.querySelector('[data-act=next]');
  function updNav(){
    var q=seq(),ix=q.indexOf(state.i),show=state.opened&&!opts.openingOnly&&state.i>=1&&!root.classList.contains('isComplete');
    nav.classList.toggle('on',show);bPrev.disabled=state.busy||ix<=0;bNext.disabled=state.busy||ix<0||ix>=q.length-1;
  }
  var navT=setInterval(updNav,150);
  function replayOp(){
    replay.classList.remove('on');state.opened=false;opEl.classList.remove('go','done');
    var fresh=document.createElement('div');fresh.innerHTML=opMarkup(op.id,data);opEl.innerHTML=fresh.innerHTML;if(oceanRun){oceanRun.stop();oceanRun=RUNNERS[op.id](opEl)}void opEl.offsetWidth;
    tap.classList.remove('off');
  }
  // gestures
  var y0=0,x0=0,moved=false,lastWheel=0;
  root.addEventListener('touchstart',function(e){var t=e.changedTouches[0];y0=t.clientY;x0=t.clientX;moved=false;music.retry()},{passive:true});
  root.addEventListener('touchend',function(e){
    var t=e.changedTouches[0],dy=y0-t.clientY,dx=Math.abs(x0-t.clientX);
    if(e.target.closest('.up-sheet')&&Math.abs(dy)<45)return;
    if(Math.abs(dy)>45&&Math.abs(dy)>dx*1.2){moved=true;if(e.target.closest('.up-sheet')&&state.i===5&&dy<0)return;dy>0?next():prev()}
  },{passive:true});
  root.addEventListener('click',function(e){
    music.retry();
    var a=e.target.closest('[data-act]');
    if(a){var act=a.dataset.act;if(act==='close'){close();if(opts.onClose)opts.onClose()}else if(act==='mute'){music.setMuted(!music.muted);a.textContent=music.muted?'🔇':'♪'}else if(act==='replay')replayOp();else if(act==='next')next();else if(act==='prev')prev();return}
    if(e.target.closest('a,button,.up-sheet'))return;
    if(moved){moved=false;return}
    if(!state.opened)openIt();else next();
  });
  root.addEventListener('wheel',function(e){e.preventDefault();var n=Date.now();if(n-lastWheel<800||Math.abs(e.deltaY)<14)return;lastWheel=n;if(!state.opened){openIt();return}e.deltaY>0?next():prev()},{passive:false});
  var onKey=function(e){if(e.key==='Escape'){close();if(opts.onClose)opts.onClose()}else if(e.key==='Enter'||e.key===' '||e.key==='ArrowDown'||e.key==='ArrowUp'&&false){e.preventDefault();state.opened?next():openIt()}else if(e.key==='ArrowUp'){prev()}};
  document.addEventListener('keydown',onKey);
  var onResize=function(){fx.resize();if(state.i>0)refit()};global.addEventListener('resize',onResize);
  if(!hasAudio)root.querySelector('[data-act=mute]').style.display='none';

  current={destroy:function(){
    state.dead=true;if(oceanRun)oceanRun.stop();clearInterval(navT);clearInterval(galT);state.timers.forEach(clearTimeout);fx.destroy();music.stop();
    document.removeEventListener('keydown',onKey);global.removeEventListener('resize',onResize);
    root.remove();document.body.classList.remove('upOpen');
  },root:root};
  if(opts.autoOpen)setTimeout(openIt,350);
  return current;
}

global.UtsavlyPlayer={open:open,close:close,buildCard:buildCard,ratioFor:ratioFor,fitZone:fitZone,blockNames:blockNames,photoHTML:photoHTML,blockDate:blockDate,
  OPENINGS:OPENINGS,GROUPS:GROUPS,EFFECTS:EFFECTS,MUSIC:MUSIC,Music:Music,Effects:Effects,fmtDate:fmtDate,fmtTime:fmtTime,opById:opById,safeFont:safeFont,IG:IG};
})(window);
