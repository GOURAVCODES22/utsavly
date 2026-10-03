/* UTSAVLY invitation player — self-contained (no dependency on app.js). */
(function(global){
'use strict';
var IG='https://www.instagram.com/codetocreation/';
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

/* ---------- catalogue ---------- */
var GROUPS={nature:'🌿 Nature',royal:'👑 Royal',classic:'💌 Classic',spiritual:'🪔 Spiritual / Festival'};
// id, name, group, icon, description, tile colours, total ms
var OPENINGS=[
['ocean-wave','Ocean Wave','nature','🌊','Waves rise, cover the whole screen, then pull back to reveal your card.',['#1a6f9c','#031a2b'],4700],
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
['luxury-letter','Luxury Letter','classic','💌','A wax-sealed envelope opens and slides away.',['#e3d1ac','#16110d'],3400],
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

/* ---------- effects ---------- */
function Effects(canvas,flash){this.cv=canvas;this.fl=flash;this.cx=canvas.getContext('2d');this.P=[];this.raf=0;this.kind='none';this.on=false;this.bolts=[];this.t0=0}
Effects.prototype.resize=function(){var d=Math.min(2,global.devicePixelRatio||1);this.W=global.innerWidth;this.H=global.innerHeight;this.cv.width=this.W*d;this.cv.height=this.H*d;this.cx.setTransform(d,0,0,d,0,0)};
Effects.prototype.spawn=function(first){
  var k=this.kind,W=this.W,H=this.H,rise=(k==='fire'||k==='lights'||k==='hearts'||k==='stars'&&false);
  var p={x:Math.random()*W,s:3+Math.random()*7,ph:Math.random()*9,vx:(Math.random()-.5)*.8,r:Math.random()*6,vr:(Math.random()-.5)*.08,a:.35+Math.random()*.6,c:['#ffc2d4','#ff8fb1','#fff0f5','#ffd3a8','#ff6f9c'][Math.random()*5|0]};
  p.y=first?Math.random()*H:(rise?H+10:-12);
  p.vy=rise?-(.8+Math.random()*1.8):(k==='rain'?11+Math.random()*6:1.2+Math.random()*2.2);
  if(k==='lights'){p.vy*=.5;p.s=2.5+Math.random()*5}
  if(k==='stars'){p.y=Math.random()*H;p.vy=0;p.vx=0;p.s=2+Math.random()*4}
  if(k==='hearts'){p.s=3+Math.random()*5;p.c=['#ff4d79','#ff85a2','#ffc2d1'][Math.random()*3|0]}
  if(k==='confetti'){p.c=['#ff4d8d','#ffd24d','#4dd2ff','#8dff6a','#c06bff','#fff'][Math.random()*6|0];p.vy=1.8+Math.random()*3}
  if(k==='snow'){p.s=2+Math.random()*4}
  return p;
};
Effects.prototype.draw=function(p,t){
  var c=this.cx,k=this.kind;
  if(k==='flowers'){c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.globalAlpha=.9;c.beginPath();c.ellipse(0,0,p.s*1.3,p.s*.7,0,0,6.3);c.fill();c.beginPath();c.ellipse(0,0,p.s*.7,p.s*1.3,0,0,6.3);c.fill();c.restore()}
  else if(k==='snow'){c.fillStyle='rgba(255,255,255,.92)';c.beginPath();c.arc(p.x,p.y,p.s*.5,0,6.3);c.fill()}
  else if(k==='rain'){c.strokeStyle='rgba(200,222,255,.65)';c.lineWidth=1.2;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-2.5,p.y+p.s*3);c.stroke()}
  else if(k==='fire'){c.fillStyle='rgba(255,'+(110+p.s*12|0)+',30,'+p.a+')';c.shadowColor='#ff7a1a';c.shadowBlur=8;c.beginPath();c.arc(p.x,p.y,p.s*.4,0,6.3);c.fill();c.shadowBlur=0}
  else if(k==='lights'){var g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*2.6);g.addColorStop(0,'rgba(255,230,150,'+(p.a*.9)+')');g.addColorStop(1,'rgba(255,230,150,0)');c.fillStyle=g;c.fillRect(p.x-p.s*2.6,p.y-p.s*2.6,p.s*5.2,p.s*5.2)}
  else if(k==='hearts'){c.font=(p.s*3.4)+'px serif';c.fillStyle=p.c;c.globalAlpha=p.a+.2;c.fillText('♥',p.x,p.y);c.globalAlpha=1}
  else if(k==='stars'){c.font=(p.s*3)+'px serif';c.fillStyle='rgba(255,236,165,'+(.45+.55*Math.sin(t*.004+p.ph))+')';c.fillText('✦',p.x,p.y)}
  else if(k==='confetti'){c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);c.restore()}
};
Effects.prototype.bolt=function(){
  var x=this.W*(.25+Math.random()*.5),y=0,pts=[[x,y]];
  while(y<this.H*.85){x+=(Math.random()-.5)*70;y+=30+Math.random()*50;pts.push([x,y])}
  this.bolts.push({pts:pts,life:1});
  this.fl.style.transition='none';this.fl.style.opacity=.85;var f=this.fl;setTimeout(function(){f.style.transition='opacity .35s ease';f.style.opacity=0},70);
};
Effects.prototype.start=function(kind,intensity){
  var self=this;this.kind=kind;this.on=true;this.resize();this.P=[];this.bolts=[];
  var area=this.W*this.H/(390*844);
  this.N=Math.round(({soft:45,cinematic:90,intense:170}[intensity]||90)*Math.min(2,Math.max(.8,area)));
  if(kind==='none'||kind==='lightning')this.N=0;
  for(var i=0;i<this.N;i++)this.P.push(this.spawn(true));
  this.burst=kind==='confetti'||kind==='flowers'?110:0;
  this.nextBolt=0;
  var loop=function(t){
    if(!self.raf)return;
    var c=self.cx;c.clearRect(0,0,self.W,self.H);
    var want=self.on?self.N+(self.burst>0?self.burst:0):0;
    while(self.P.length<want&&self.on)self.P.push(self.spawn(false));
    for(var i=self.P.length-1;i>=0;i--){var p=self.P[i];p.x+=p.vx+Math.sin(t*.001+p.ph)*.4;p.y+=p.vy;p.r+=p.vr;self.draw(p,t);if(p.y>self.H+25||p.y<-35||(!self.on&&Math.random()<.04)||(self.P.length>want&&Math.random()<.03))self.P.splice(i,1)}
    if(self.burst>0)self.burst-=2;
    if(self.kind==='lightning'&&self.on&&t>self.nextBolt){self.bolt();self.nextBolt=t+500+Math.random()*700}
    for(var b=self.bolts.length-1;b>=0;b--){var bo=self.bolts[b];c.save();c.strokeStyle='rgba(230,240,255,'+bo.life+')';c.lineWidth=2.4;c.shadowColor='#8fb8ff';c.shadowBlur=22;c.beginPath();bo.pts.forEach(function(q,j){j?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])});c.stroke();c.restore();bo.life-=.07;if(bo.life<=0)self.bolts.splice(b,1)}
    self.raf=requestAnimationFrame(loop);
  };
  cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(loop);
};
Effects.prototype.end=function(){this.on=false};
Effects.prototype.destroy=function(){cancelAnimationFrame(this.raf);this.raf=0;this.on=false;this.P=[];try{this.cx.clearRect(0,0,this.W,this.H)}catch(e){}};

/* ---------- opening markup ---------- */
function rnd(a,b){return a+Math.random()*(b-a)}
function opMarkup(id){
  var i,h='';
  switch(id){
    case 'velvet-curtains':return '<i class="a"></i><i class="b"></i><i class="c"></i>';
    case 'palace-doors':return '<i class="e"></i><i class="a"></i><i class="b"></i><i class="d l"></i><i class="d r"></i>';
    case 'royal-gate':return '<i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i><b class="ic">⚜️</b>';
    case 'royal-ribbon':return '<i class="c"></i><i class="e"></i><i class="a"></i><i class="b"></i><b class="ic">🎀</b>';
    case 'royal-mirror':return '<i class="cv"></i><i class="a"></i>';
    case 'luxury-letter':return '<u class="w"><i class="a"></i><i class="b"></i><i class="d">✦</i></u>';
    case 'scroll-open':return '<i class="a"></i><i class="b"></i><i class="d"></i><b class="ic">📜</b>';
    case 'gift-box':return '<i class="e"></i><u class="w"><i class="a"></i><u class="l"><i class="b"></i><b class="d">🎀</b></u></u>';
    case 'golden-spotlight':return '<i class="cv"></i>';
    case 'ocean-wave':return '<i class="a"></i><i class="b"></i><i class="c"></i><b class="ic">🌊</b>';
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
    +'<div class="op" data-op="'+esc(op.id)+'">'+opMarkup(op.id)+'</div>'
    +'<div class="up-sheet"></div>'
    +'<div class="up-top"><span>UTSAVLY</span><div><button class="up-btn" data-act="mute" aria-label="Toggle sound">♪</button><button class="up-btn" data-act="close" aria-label="Close invitation">✕</button></div></div>'
    +'<div class="up-tap">Tap to open</div><div class="up-hint"><span></span><i>↑</i></div>'
    +'<div class="up-nav"><button data-act="prev">‹ Back</button><button data-act="next">Next ›</button></div>'
    +'<div class="up-foot"><a href="'+IG+'" target="_blank" rel="noopener noreferrer">Developed by <b>Gourav Patyal</b></a></div>'
    +'<div class="up-replay"><button data-act="replay">↻ Replay</button><button data-act="close">Close</button></div>';
  document.body.appendChild(root);document.body.classList.add('upOpen');
  var stage=root.querySelector('.up-stage'),backdrop=root.querySelector('.up-backdrop'),opEl=root.querySelector('.op'),hint=root.querySelector('.up-hint'),tap=root.querySelector('.up-tap'),sheet=root.querySelector('.up-sheet'),replay=root.querySelector('.up-replay');
  var card=buildCard(data);stage.appendChild(card);var zone=card.__zone;
  zone.__lim=Math.min(.82,2*Math.min(zoneBox(art).y,100-zoneBox(art).y)/100);
  if(art.img)backdrop.style.backgroundImage='url("'+String(art.img).replace(/"/g,'%22')+'")';
  else{backdrop.style.background='radial-gradient(circle at 50% 40%,'+((art.p&&art.p[0])||'#3a2a18')+',#050403)';var bgc=buildCard({art:art,font:data.font});bgc.style.cssText='position:absolute;inset:0;width:100%;height:100%';bgc.__zone.remove();backdrop.appendChild(bgc)}
  var state={i:0,busy:false,opened:false,musicOn:false,timers:[],dead:false};
  ratioFor(art,function(r){stage.style.setProperty('--ar',r);if(state.i>0)refit()});

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
    opEl.classList.add('go');
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
    var fresh=document.createElement('div');fresh.innerHTML=opMarkup(op.id);opEl.innerHTML=fresh.innerHTML;void opEl.offsetWidth;
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
    state.dead=true;clearInterval(navT);clearInterval(galT);state.timers.forEach(clearTimeout);fx.destroy();music.stop();
    document.removeEventListener('keydown',onKey);global.removeEventListener('resize',onResize);
    root.remove();document.body.classList.remove('upOpen');
  },root:root};
  if(opts.autoOpen)setTimeout(openIt,350);
  return current;
}

global.UtsavlyPlayer={open:open,close:close,buildCard:buildCard,ratioFor:ratioFor,fitZone:fitZone,blockNames:blockNames,photoHTML:photoHTML,blockDate:blockDate,
  OPENINGS:OPENINGS,GROUPS:GROUPS,EFFECTS:EFFECTS,MUSIC:MUSIC,Music:Music,Effects:Effects,fmtDate:fmtDate,fmtTime:fmtTime,opById:opById,safeFont:safeFont,IG:IG};
})(window);
