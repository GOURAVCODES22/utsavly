/* UTSAVLY studio — wires the old card catalogue to the new player. Loaded after all other scripts. */
(function(){
'use strict';
var P=window.UtsavlyPlayer; if(!P)return;
var $=function(s,r){return (r||document).querySelector(s)};
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var OLD={'wax-pull':'luxury-letter','bell-split':'palace-doors','mirror-crown':'royal-mirror','arch-glow':'arch-reveal','lake-castle':'ocean-wave','curtain':'velvet-curtains','royal-door':'palace-doors','envelope':'luxury-letter','heritage-scroll':'scroll-open','golden-light':'golden-spotlight','cloud-parting':'clouds-parting','rain-reveal':'rain-curtain','snow-reveal':'snow-frost','floral-bloom':'petal-bloom','galaxy-reveal':'galaxy-stars','lightning-reveal':'lightning','temple-doors':'palace-doors','fort-gates':'royal-gate','spotlight-stage':'golden-spotlight','letter-reveal':'luxury-letter','fire-reveal':'fire-spark','wind-reveal':'wind-leaves','flower-bloom':'petal-bloom'};
var FXOK=['flowers','snow','rain','fire','lightning','lights','stars','hearts','confetti','none'];
function normOp(id){for(var i=0;i<P.OPENINGS.length;i++)if(P.OPENINGS[i].id===id)return id;return OLD[id]||'velvet-curtains'}
function normFx(f){f=String(f||'');if(f==='star')return 'stars';if(f==='light')return 'lights';return FXOK.indexOf(f)>-1?f:'flowers'}
function allCards(){try{return cards}catch(e){return []}}
function cardByName(name,cat){var a=allCards(),i;for(i=0;i<a.length;i++)if(a[i][1]===name&&(!cat||a[i][0]===cat))return a[i];for(i=0;i<a.length;i++)if(a[i][1]===name)return a[i];return null}
function defaultCard(cat){var a=allCards(),i;for(i=0;i<a.length;i++)if(a[i][0]===(cat||'Wedding')&&a[i][7])return a[i];for(i=0;i<a.length;i++)if(a[i][7])return a[i];return a[0]}
function artFromCard(c){
  if(!c)return {theme:'theme-ivory'};
  var x=c[7];if(x&&x.img)return {img:x.img,x:x.x,y:x.y,w:x.w,ink:x.ink};
  var u=c[6];if(u&&u.l)return {l:u.l,p:u.p,f:u.f};
  return {theme:c[2]||'theme-ivory'};
}
var OCCN={Diwali:'Happy Diwali',Sikh:'Anand Karaj',Christian:'Holy Matrimony',Christmas:'Merry Christmas',Corporate:'You Are Invited',Jagran:'Shri Jagran',Birthday:'Birthday Celebration',Anniversary:'Anniversary Celebration',Muslim:'Eid Mubarak',Baby:'Baby Shower',Hindu:'Shubh Utsav',Festival:'Festival Celebration',Music:'Sangeet Night',Wedding:'Wedding Celebration'};

/* ---------- data -> player ---------- */
function toPlayer(d){
  d=d||{};
  var c=cardByName(d.card,d.category)||defaultCard(d.category);
  var x=c&&c[7];
  var url=(d.musicUrl&&d.music!=='none')?d.musicUrl:'';
  return {
    art:artFromCard(c),names:d.names||'Janu & Janvi',occasion:d.occasion||OCCN[c&&c[0]]||'You are invited',message:d.message||'',
    date:d.date||'',time:d.time||'',venue:d.venue||'',
    opening:normOp(d.opening||(x&&x.o)),revealEffect:normFx(d.revealEffect||(x&&x.fx)),effectIntensity:d.effectIntensity||'cinematic',
    font:d.font||'Great Vibes',fontColor:d.fontColor||'',fontColorUser:!!d.fontColorUser,color:d.color||'',tintAmt:+d.tintAmt||0,
    music:d.music||'festive',musicUrl:url,audioUrl:d.audioUrl||'',trimStart:+d.trimStart||0,trimEnd:+d.trimEnd||0,musicStart:d.musicStart||'opening',
    photo:d.photo||'',photoShape:d.photoShape||'circle',photoSize:+d.photoSize||34,gallery:d.gallery||[],scratch:d.scratch||null,
    site:location.origin+'/'
  };
}
var prevOpenCinematic=null;
var direct=null;
(function(){
  var m=location.pathname.match(/^\/i\/([^/]+)/i),q=new URLSearchParams(location.search).get('i');
  if(!m&&!q)return;
  var id=m?decodeURIComponent(m[1]):q,d=null;
  try{d=decodeInvitationData(new URLSearchParams(location.search).get('d')||'')}catch(e){}
  if(!d){try{d=JSON.parse(localStorage.getItem('utsavly-demo-'+id)||'null')}catch(e){}}
  direct=d||{occasion:'Wedding Celebration',names:'Janu & Janvi',category:'Wedding'};
})();
function bridgeOpen(d){
  if(direct){d=direct;direct=null;}
  var data=toPlayer(d);
  if(!data.date&&!d.names){data.date=''}
  P.open(data,{autoOpen:false});
}
function installBridges(){window.openCinematic=bridgeOpen;window.openCustomizer=openStudio}
installBridges();
document.addEventListener('DOMContentLoaded',function(){setTimeout(installBridges,400)});
window.addEventListener('load',function(){setTimeout(installBridges,600)});

/* ---------- studio state ---------- */
var S=null,studioEl=null,mus=null,trimDur=0,trimAudio=null,curTab='details';
function fresh(c){
  var x=c&&c[7],cat=c?c[0]:'Wedding';
  return {card:c,category:cat,occasion:OCCN[cat]||'Celebration',names:cat==='Birthday'?'Janvi':'Janu & Janvi',
    message:'Together with their families, we invite you to celebrate this beautiful beginning with us.',
    date:'',time:'19:00',venue:'',language:'English',font:'Great Vibes',fontColor:'#ffffff',fontColorUser:false,color:'#b68b48',tintAmt:0,scratch:{names:false,date:false,venue:false,message:false,secret:'',pos:'mid',foil:'gold'},
    opening:normOp(x&&x.o),revealEffect:normFx(x&&x.fx),effectIntensity:'cinematic',
    music:cat==='Birthday'?'birthday_happy':'festive',musicUrl:'',audioUrl:'',fileName:'',file:null,trimStart:0,trimEnd:0,musicStart:'opening',photo:'',photoShape:'circle',photoSize:34,gallery:[]};
}
function displayNames(){
  var n=S.names||'';try{return convertName(n,S.language)||n}catch(e){return n}
}
function playerData(){
  var d=toPlayer({card:S.card[1],category:S.category,occasion:S.occasion,names:displayNames(),message:S.message,date:S.date,time:S.time,venue:S.venue,
    opening:S.opening,revealEffect:S.revealEffect,effectIntensity:S.effectIntensity,font:S.font,fontColor:S.fontColor,fontColorUser:S.fontColorUser,color:S.color,tintAmt:S.tintAmt,
    music:S.music==='url'?'url':S.music,musicUrl:S.music==='url'?S.musicUrl:'',audioUrl:S.music==='upload'?S.audioUrl:'',trimStart:S.trimStart,trimEnd:S.trimEnd,musicStart:S.musicStart,photo:S.photo,photoShape:S.photoShape,photoSize:S.photoSize,gallery:S.gallery,scratch:S.scratch});
  d.music=S.music==='url'?'custom':S.music;
  return d;
}

/* ---------- live preview ---------- */
function prevHTML(){
  var f=P.fmtDate(S.date),t=P.fmtTime(S.time),n=displayNames()||'Your names';
  var size=Math.max(8,Math.min(21,200/Math.max(7,n.length)));
  return P.photoHTML(playerData())+'<p class="upz-eyebrow">'+esc(S.occasion||'You are invited')+'</p><h2 class="upz-names" dir="auto" style="--nfs:'+size.toFixed(1)+'em">'+esc(n)+'</h2><div class="upz-rule"></div><p class="upz-line">'+(f?esc(f.wd+', '+f.day+' '+f.mon+' '+f.yr):'Pick your date')+(t&&f?' · '+esc(t):'')+'</p>'+(S.venue?'<p class="upz-line">📍 '+esc(S.venue)+'</p>':'');
}
function renderPreview(){
  var box=$('#stuCardBox');if(!box)return;
  var d=playerData();
  var card=P.buildCard(d);card.__zone.innerHTML=prevHTML();
  box.innerHTML='';box.appendChild(card);
  var art=d.art;
  P.ratioFor(art,function(r){box.style.setProperty('--ar',r);fit()});
  function fit(){var z=card.__zone;var y=art.img?(art.y||50):50;z.__lim=Math.min(.84,2*Math.min(y,100-y)/100);P.fitZone(z,card.clientHeight||300)}
  fit();
}
var rpT=0;function touch(){cancelAnimationFrame(rpT);rpT=requestAnimationFrame(renderPreview)}

/* ---------- panes ---------- */
function opt(list,sel){return list.map(function(o){return '<option'+(o===sel?' selected':'')+'>'+esc(o)+'</option>'}).join('')}
var SW=['#ffffff','#fff0c8','#f2d79b','#d8b06a','#ff6b8a','#8e1634','#2a1d0f','#111111'];
var TINTS=['#b68b48','#8e1634','#0f5132','#1b3a6b','#6a2c91','#e85d75','#111111'];
function paneDetails(){
  var langs=[];try{langs=languages}catch(e){langs=['English']}
  var fl=[];try{fl=fonts}catch(e){fl=[['Great Vibes','Wedding Script']]}
  return '<div class="stu-pane on" data-p="details">'
  +'<label>Occasion title<input id="sOcc" value="'+esc(S.occasion)+'" maxlength="40"></label>'
  +'<label>Names<input id="sNames" value="'+esc(S.names)+'" maxlength="60" placeholder="Janu &amp; Janvi"></label>'
  +'<div class="two"><label>Date<input id="sDate" type="date" value="'+esc(S.date)+'"></label><label>Time<input id="sTime" type="time" value="'+esc(S.time)+'"></label></div>'
  +'<label>Venue<input id="sVenue" value="'+esc(S.venue)+'" maxlength="90" placeholder="Hotel / hall, city"></label>'
  +'<label>Message<textarea id="sMsg" maxlength="220">'+esc(S.message)+'</textarea></label>'
  +'<label>Language / script<select id="sLang">'+opt(langs,S.language)+'</select></label>'
  +'<p class="stu-note">Hindi &amp; Punjabi convert English names automatically. You can type directly in any script too.</p></div>';
}
function paneStyle(){
  S.scratch=S.scratch||{names:false,date:false,venue:false,message:false,secret:'',pos:'mid',foil:'gold'};
  var fl=[];try{fl=fonts}catch(e){fl=[['Great Vibes','Wedding Script']]}
  return '<div class="stu-pane" data-p="style">'
  +'<label>Font style<select id="sFont">'+fl.map(function(f){return '<option value="'+esc(f[0])+'"'+(f[0]===S.font?' selected':'')+'>'+esc(f[0])+' — '+esc(f[1])+'</option>'}).join('')+'</select></label>'
  +'<h4>Text colour</h4><div class="stu-sw" id="sInk"><button class="auto'+(S.fontColorUser?'':' on')+'" data-c="">Auto</button>'+SW.map(function(c){return '<button style="background:'+c+'" data-c="'+c+'" class="'+(S.fontColorUser&&S.fontColor===c?'on':'')+'" aria-label="'+c+'"></button>'}).join('')+'<input type="color" id="sInkC" value="'+(S.fontColor.length===7?S.fontColor:'#ffffff')+'" aria-label="Custom text colour"></div>'
  +'<h4>Card colour tint</h4><div class="stu-sw" id="sTint">'+TINTS.map(function(c){return '<button style="background:'+c+'" data-c="'+c+'" class="'+(S.color===c?'on':'')+'" aria-label="'+c+'"></button>'}).join('')+'<input type="color" id="sTintC" value="'+S.color+'" aria-label="Custom tint"></div>'
  +'<label>Tint strength <span id="sTintV">'+S.tintAmt+'%</span><input id="sTintA" type="range" min="0" max="80" value="'+S.tintAmt+'"></label>'
  +'<p class="stu-note">Tint blends softly over the card artwork — set to 0% to keep the original card.</p>'
  +'<h4>Scratch card (optional)</h4><p class="stu-note">Cover details with a scratch foil — guests scratch with a finger to reveal. Keep everything off for no scratch.</p><div class="stu-seg" id="sScr">'+[['names','Names'],['date','Date & time'],['venue','Venue'],['message','Message']].map(function(o){return '<button data-k="'+o[0]+'" class="'+(S.scratch[o[0]]?'on':'')+'">'+o[1]+'</button>'}).join('')+'</div>'
  +'<label>Secret surprise, anywhere (optional)<input id="sScrT" maxlength="60" placeholder="e.g. Dinner is on us 🎉" value="'+esc(S.scratch.secret||'')+'"></label>'
  +'<div class="stu-seg" id="sScrP">'+[['top','Top'],['mid','Middle'],['bottom','Bottom']].map(function(o){return '<button data-s="'+o[0]+'" class="'+(S.scratch.pos===o[0]?'on':'')+'">'+o[1]+'</button>'}).join('')+'</div>'
  +'<div class="stu-seg" id="sScrF">'+[['gold','Gold foil'],['silver','Silver'],['rose','Rose gold']].map(function(o){return '<button data-s="'+o[0]+'" class="'+(S.scratch.foil===o[0]?'on':'')+'">'+o[1]+'</button>'}).join('')+'</div>'
  +'<h4>Your photo (optional)</h4><label class="stu-file">🖼 Add photo<input type="file" id="sPhoto" accept="image/*"></label>'
  +'<div id="sPhotoBox" style="display:'+(S.photo?'block':'none')+'"><div class="stu-seg" id="sShape">'+[['circle','Circle'],['round','Rounded'],['none','Hide']].map(function(o){return '<button data-s="'+o[0]+'" class="'+(S.photoShape===o[0]?'on':'')+'">'+o[1]+'</button>'}).join('')+'</div>'
  +'<label style="margin-top:10px">Photo size <span id="sPhotoV">'+S.photoSize+'%</span><input id="sPhotoS" type="range" min="18" max="56" value="'+S.photoSize+'"></label><button class="stu-mini" id="sPhotoX" style="padding:10px 16px">Remove photo</button></div>'
  +'<h4>Photo gallery (up to 6)</h4><label class="stu-file">🖼 Add photos<input type="file" id="sGal" accept="image/*" multiple></label><div class="stu-thumbs" id="sThumbs"></div>'
  +'<p class="stu-note">Gallery photos play as a slideshow after the venue, and guests can save them from the final screen.</p>'
  +'<p class="stu-note">Your photo appears with the names when they are revealed. Photos are saved inside the downloaded file; shared links stay lightweight and show the card without them.</p></div>';
}
function paneOpening(){
  var h='<div class="stu-pane" data-p="opening"><p class="stu-note" style="margin:0 0 4px">How your invitation opens. Tap <b>Preview</b> to see it on your own card.</p><div class="stu-op">';
  Object.keys(P.GROUPS).forEach(function(g){
    h+='<div class="stu-opg">'+P.GROUPS[g]+'</div>';
    P.OPENINGS.filter(function(o){return o.group===g}).forEach(function(o){
      h+='<div class="stu-opc'+(o.id===S.opening?' on':'')+'" data-id="'+o.id+'"><div class="stu-opt" style="background:linear-gradient(135deg,'+o.tile[0]+','+o.tile[1]+')">'+o.icon+'</div><div><strong>'+esc(o.name)+'</strong><small>'+esc(o.desc)+'</small></div><div class="btns"><button class="pick" data-a="pick">'+(o.id===S.opening?'Selected':'Select')+'</button><button data-a="prev">▶ Preview</button></div></div>';
    });
  });
  return h+'</div></div>';
}
function paneEffect(){
  return '<div class="stu-pane" data-p="effect"><p class="stu-note" style="margin:0 0 10px">Plays right after the date is revealed, before the names appear.</p><div class="stu-fx">'
  +P.EFFECTS.map(function(e){return '<button data-e="'+e[0]+'" class="'+(S.revealEffect===e[0]?'on':'')+'"><span>'+e[2]+'</span>'+e[1]+'</button>'}).join('')+'</div>'
  +'<h4>Intensity</h4><div class="stu-seg" id="sInt">'+['soft','cinematic','intense'].map(function(k){return '<button data-i="'+k+'" class="'+(S.effectIntensity===k?'on':'')+'">'+k[0].toUpperCase()+k.slice(1)+'</button>'}).join('')+'</div>'
  +'<div style="margin-top:14px"><button class="stu-mini" id="sFxPrev" style="padding:11px 18px;font-size:12px">▶ Preview effect</button></div></div>';
}
function mmss(s){s=Math.max(0,s||0);return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}
function paneMusic(){
  var hasSong=S.music==='upload'||S.music==='url';
  return '<div class="stu-pane" data-p="music"><h4 style="margin-top:0">Hand-pick music</h4><div class="stu-mu" id="sMu">'
  +P.MUSIC.map(function(m){return '<button data-m="'+m[0]+'" class="'+(S.music===m[0]?'on':'')+'"><span>'+m[1]+'</span><i data-a="mp">▶</i></button>'}).join('')+'</div>'
  +'<h4>Or use your own song</h4><div class="stu-song"><label class="stu-file">⬆ Upload song (MP3 / M4A)<input type="file" id="sFile" accept="audio/*"></label>'
  +'<label style="margin:0">…or paste a direct audio link<input id="sUrl" placeholder="https://…/song.mp3" value="'+esc(S.musicUrl)+'"></label>'
  +'<div id="sTrimBox" style="display:'+(hasSong?'block':'none')+'">'
  +'<p class="stu-note" id="sSongName" style="color:#f2d79b;margin-top:10px">'+esc(S.fileName||S.musicUrl||'')+'</p>'
  +'<div class="stu-trim"><div class="tr"><canvas id="sWave" width="600" height="46"></canvas><div class="fill" id="sFill"></div><div class="ph" id="sPh"></div><input type="range" id="sTrS" min="0" max="1000" value="0" aria-label="Start"><input type="range" id="sTrE" min="0" max="1000" value="1000" aria-label="End"></div>'
  +'<div class="tt"><span>Start <b id="sTs">0:00</b></span><span id="sTl"></span><span>End <b id="sTe">full</b></span></div>'
  +'<div class="stu-seg" id="sChips" style="margin-bottom:8px">'+[10,15,30,60].map(function(n){return '<button data-l="'+n+'">'+n+'s</button>'}).join('')+'</div>'
  +'<div class="two"><button class="stu-mini" id="sTrP" style="padding:11px">▶ Preview clip</button><button class="stu-mini" id="sTrR" style="padding:11px">Use full song</button></div></div></div>'
  +'<p class="stu-note">Drag the gold edges to choose exactly which part plays — it loops smoothly. Uploaded songs play in this browser and inside the downloaded file; for a shareable <b>link</b>, use a direct audio URL.</p></div>'
  +'<h4>When should music start?</h4><label style="margin:0"><select id="sMs">'+[['opening','From the opening (tap)'],['date','When date appears'],['effect','At the effect'],['names','When names appear'],['venue','At the venue']].map(function(o){return '<option value="'+o[0]+'"'+(S.musicStart===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label></div>';
}

/* ---------- open / close ---------- */
function openStudio(){
  var c=null;try{c=selectedCard}catch(e){}
  c=window.__UTSAVLY_SELECTED_CARD__||c;
  if(!c)c=defaultCard('Wedding');
  closeStudio(true);
  S=fresh(c);mus=new P.Music();
  var el=document.createElement('div');el.className='stu';el.setAttribute('role','dialog');el.setAttribute('aria-label','Customize invitation');
  el.innerHTML='<div class="stu-top"><div><small>'+esc(String(c[0]).toUpperCase())+' · CUSTOMIZE</small><b>'+esc(c[1])+'</b></div><button class="stu-x" id="stuX" aria-label="Close">✕</button></div>'
   +'<div class="stu-prev"><div class="stuCard" id="stuCardBox"></div></div>'
   +'<div class="stu-right"><div class="stu-tabs" id="stuTabs">'+[['details','✍ Details'],['style','🎨 Style'],['opening','🎭 Opening'],['effect','✨ Effect'],['music','🎵 Music']].map(function(t){return '<button data-t="'+t[0]+'" class="'+(t[0]==='details'?'on':'')+'">'+t[1]+'</button>'}).join('')+'</div>'
   +'<div class="stu-body" id="stuBody">'+paneDetails()+paneStyle()+paneOpening()+paneEffect()+paneMusic()+'</div>'
   +'<div class="stu-bar"><button id="stuPlay">▶ Preview invitation</button><button class="pri" id="stuGen">Generate link →</button></div></div>'
   +'<div class="stu-res" id="stuRes"></div>';
  document.body.appendChild(el);document.body.classList.add('stuOpen');studioEl=el;
  try{var d=$('#drawer');if(d)d.classList.remove('open');var sc=$('.scrim');if(sc)sc.classList.remove('show');if(typeof closeModal==='function')closeModal()}catch(e){}
  wire();renderPreview();
  if(window.track)try{track('studio_open',{card:c[1]})}catch(e){}
}
function closeStudio(silent){
  if(!studioEl)return;
  try{mus&&mus.stop()}catch(e){}try{if(trimAudio){trimAudio.pause();trimAudio=null}}catch(e){}
  studioEl.remove();studioEl=null;S=null;document.body.classList.remove('stuOpen');
}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&studioEl&&!document.querySelector('.up'))closeStudio()});

/* ---------- wiring ---------- */
function setTab(t){
  curTab=t;
  [].forEach.call(studioEl.querySelectorAll('#stuTabs button'),function(b){b.classList.toggle('on',b.dataset.t===t)});
  [].forEach.call(studioEl.querySelectorAll('.stu-pane'),function(p){p.classList.toggle('on',p.dataset.p===t)});
  $('#stuBody').scrollTop=0;
  if(t!=='music'){mus.stop();stopTrimPrev()}
}
function wire(){
  var R=studioEl;
  $('#stuX').onclick=function(){closeStudio()};
  $('#stuTabs').onclick=function(e){var b=e.target.closest('button');if(b)setTab(b.dataset.t)};
  var bind=function(id,key,after){var el=$(id);el.addEventListener('input',function(){S[key]=el.value;if(after)after();touch()})};
  bind('#sOcc','occasion');bind('#sNames','names');bind('#sDate','date');bind('#sTime','time');bind('#sVenue','venue');bind('#sMsg','message');bind('#sLang','language');bind('#sFont','font');
  $('#sLang').addEventListener('change',function(){S.language=this.value;touch()});
  // colours
  $('#sInk').onclick=function(e){var b=e.target.closest('button');if(!b)return;var c=b.dataset.c;S.fontColorUser=!!c;if(c)S.fontColor=c;[].forEach.call(this.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});touch()};
  $('#sInkC').addEventListener('input',function(){S.fontColor=this.value;S.fontColorUser=true;[].forEach.call($('#sInk').querySelectorAll('button'),function(x){x.classList.remove('on')});touch()});
  $('#sTint').onclick=function(e){var b=e.target.closest('button');if(!b)return;S.color=b.dataset.c;if(!S.tintAmt){S.tintAmt=35;$('#sTintA').value=35;$('#sTintV').textContent='35%'}[].forEach.call(this.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});$('#sTintC').value=S.color;touch()};
  $('#sTintC').addEventListener('input',function(){S.color=this.value;if(!S.tintAmt){S.tintAmt=35;$('#sTintA').value=35;$('#sTintV').textContent='35%'}[].forEach.call($('#sTint').querySelectorAll('button'),function(x){x.classList.remove('on')});touch()});
  $('#sTintA').addEventListener('input',function(){S.tintAmt=+this.value;$('#sTintV').textContent=this.value+'%';touch()});
  $('#sScr').onclick=function(e){var b=e.target.closest('button');if(!b)return;var k=b.dataset.k;S.scratch[k]=!S.scratch[k];b.classList.toggle('on',!!S.scratch[k]);touch()};
  $('#sScrT').addEventListener('input',function(){S.scratch.secret=this.value;touch()});
  [['sScrP','pos'],['sScrF','foil']].forEach(function(q){$('#'+q[0]).onclick=function(e){var b=e.target.closest('button');if(!b)return;S.scratch[q[1]]=b.dataset.s;[].forEach.call(this.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});touch()}});
  // photo
  $('#sPhoto').onchange=function(){
    var f=this.files&&this.files[0];if(!f)return;
    var img=new Image(),u=URL.createObjectURL(f);
    img.onload=function(){var m=720,k=Math.min(1,m/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);S.photo=cv.toDataURL('image/jpeg',.82);URL.revokeObjectURL(u);if(S.photoShape==='none')S.photoShape='circle';$('#sPhotoBox').style.display='block';[].forEach.call($('#sShape').querySelectorAll('button'),function(x){x.classList.toggle('on',x.dataset.s===S.photoShape)});touch()};
    img.onerror=function(){alert('This image could not be read. Please try a JPG or PNG.')};img.src=u;
  };
  $('#sShape').onclick=function(e){var b=e.target.closest('button');if(!b)return;S.photoShape=b.dataset.s;[].forEach.call(this.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});touch()};
  $('#sPhotoS').addEventListener('input',function(){S.photoSize=+this.value;$('#sPhotoV').textContent=this.value+'%';touch()});
  $('#sPhotoX').onclick=function(){S.photo='';$('#sPhotoBox').style.display='none';$('#sPhoto').value='';touch()};
  // gallery
  function shrink(file,cb){var img=new Image(),u=URL.createObjectURL(file);img.onload=function(){var m=900,k=Math.min(1,m/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(u);cb(cv.toDataURL('image/jpeg',.82))};img.onerror=function(){URL.revokeObjectURL(u);cb(null)};img.src=u}
  function thumbs(){var box=$('#sThumbs');if(!box)return;box.innerHTML=S.gallery.map(function(u,i){return '<div><img src="'+u+'" alt=""><button data-i="'+i+'" aria-label="Remove">✕</button></div>'}).join('')}
  thumbs();
  $('#sThumbs').onclick=function(e){var b=e.target.closest('button');if(!b)return;S.gallery.splice(+b.dataset.i,1);thumbs()};
  $('#sGal').onchange=function(){
    var fs=[].slice.call(this.files||[]).slice(0,Math.max(0,6-S.gallery.length));this.value='';
    if(!fs.length){alert('You can add up to 6 gallery photos.');return}
    var n=fs.length;fs.forEach(function(f){shrink(f,function(u){if(u)S.gallery.push(u);if(--n===0)thumbs()})});
  };
  // openings
  R.querySelector('[data-p=opening]').onclick=function(e){
    var card=e.target.closest('.stu-opc');if(!card)return;var id=card.dataset.id,a=e.target.closest('button');
    if(a&&a.dataset.a==='prev'){var d=playerData();d.opening=id;d.musicStart='opening';d.music='none';d.musicUrl='';d.audioUrl='';P.open(d,{openingOnly:true,autoOpen:false});return}
    S.opening=id;[].forEach.call(this.querySelectorAll('.stu-opc'),function(x){var on=x===card;x.classList.toggle('on',on);x.querySelector('.pick').textContent=on?'Selected':'Select'});
  };
  // effects
  R.querySelector('[data-p=effect]').onclick=function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.dataset.e){S.revealEffect=b.dataset.e;[].forEach.call(this.querySelectorAll('.stu-fx button'),function(x){x.classList.toggle('on',x===b)});playFx()}
    else if(b.dataset.i){S.effectIntensity=b.dataset.i;[].forEach.call($('#sInt').querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});playFx()}
    else if(b.id==='sFxPrev')playFx();
  };
  // music
  $('#sMu').onclick=function(e){
    var b=e.target.closest('button');if(!b)return;var m=b.dataset.m;
    if(e.target.dataset.a==='mp'){ // preview toggle
      if(mus.playing&&mus.cur===m){mus.stop();mus.cur=null;e.target.textContent='▶';return}
      stopTrimPrev();mus.stop();[].forEach.call(this.querySelectorAll('i'),function(i){i.textContent='▶'});
      if(m!=='none'){mus.play({kind:m});mus.cur=m;e.target.textContent='■'}return;
    }
    mus.stop();mus.cur=null;[].forEach.call(this.querySelectorAll('i'),function(i){i.textContent='▶'});
    S.music=m;[].forEach.call(this.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});
    $('#sTrimBox').style.display='none';
  };
  $('#sMs').onchange=function(){S.musicStart=this.value};
  $('#sFile').onchange=function(){
    var f=this.files&&this.files[0];if(!f)return;
    if(f.size>25*1024*1024){alert('Please choose a song under 25 MB.');this.value='';return}
    if(S.audioUrl)try{URL.revokeObjectURL(S.audioUrl)}catch(e){}
    S.file=f;S.audioUrl=URL.createObjectURL(f);S.fileName=f.name;S.music='upload';S.musicUrl='';$('#sUrl').value='';
    useSong(S.audioUrl,f.name);
  };
  $('#sUrl').addEventListener('change',function(){
    var v=this.value.trim();if(!v)return;
    if(!/^https?:\/\//i.test(v)){alert('Please paste a full link starting with https://');return}
    S.musicUrl=v;S.music='url';S.file=null;S.fileName='';useSong(v,v);
  });
  $('#sTrS').addEventListener('input',function(){trimMove('s')});
  $('#sTrE').addEventListener('input',function(){trimMove('e')});
  $('#sChips').onclick=function(e){
    var b=e.target.closest('button');if(!b||!trimDur)return;var L=+b.dataset.l,st=S.trimStart||0;
    if(L>=trimDur){S.trimStart=0;S.trimEnd=0}else{if(st+L>trimDur)st=trimDur-L;S.trimStart=st;S.trimEnd=st+L}
    $('#sTrS').value=Math.round(S.trimStart/trimDur*1000);$('#sTrE').value=S.trimEnd?Math.round(S.trimEnd/trimDur*1000):1000;trimUI();
    if(trimAudio){try{trimAudio.currentTime=S.trimStart}catch(x){}}
  };
  $('#sTrP').onclick=toggleTrimPrev;
  $('#sTrR').onclick=function(){S.trimStart=0;S.trimEnd=0;$('#sTrS').value=0;$('#sTrE').value=1000;trimUI()};
  $('#stuPlay').onclick=function(){mus.stop();stopTrimPrev();var d=playerData();P.open(d,{autoOpen:false})};
  $('#stuGen').onclick=generate;
}
function playFx(){
  var cv=document.createElement('canvas');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9500';
  var fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:9501';
  document.body.appendChild(cv);document.body.appendChild(fl);
  var fx=new P.Effects(cv,fl);fx.start(S.revealEffect==='none'?'none':S.revealEffect,S.effectIntensity);
  setTimeout(function(){fx.end()},2600);setTimeout(function(){fx.destroy();cv.remove();fl.remove()},3600);
}

/* ---------- song trim ---------- */
function useSong(src,label){
  mus.stop();stopTrimPrev();
  S.trimStart=0;S.trimEnd=0;$('#sTrimBox').style.display='block';$('#sSongName').textContent=label||'';
  [].forEach.call($('#sMu').querySelectorAll('button'),function(x){x.classList.remove('on')});
  var a=new Audio();a.preload='metadata';
  a.onloadedmetadata=function(){trimDur=isFinite(a.duration)?a.duration:0;$('#sTrS').value=0;$('#sTrE').value=1000;trimUI();drawWave(src)};
  a.onerror=function(){$('#sSongName').textContent='⚠ Could not load this audio — try another file or link.';trimDur=0};
  a.src=src;
}
function drawWave(src){
  var cv=$('#sWave');if(!cv)return;var c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);
  var bars=60,w=cv.width/bars;c.fillStyle='#f2d79b';
  var seed=0;for(var i=0;i<(S.fileName||src).length;i++)seed=(seed*31+(S.fileName||src).charCodeAt(i))%9973;
  var draw=function(arr){for(var i=0;i<bars;i++){var h=6+arr[i]*(cv.height-12);c.fillRect(i*w+1,(cv.height-h)/2,w-2,h)}};
  var fake=[];for(i=0;i<bars;i++){seed=(seed*1103515245+12345)%2147483648;fake.push(.2+.8*Math.abs(Math.sin(i*.45+seed%7))*(seed%100/100*.5+.5))}
  draw(fake);
  if(S.file&&window.AudioContext&&S.file.size<20e6){
    S.file.arrayBuffer().then(function(buf){var ac=new AudioContext();return ac.decodeAudioData(buf).then(function(b){var d=b.getChannelData(0),step=Math.floor(d.length/bars),arr=[],mx=0;for(var i=0;i<bars;i++){var s=0;for(var j=0;j<step;j+=Math.max(1,step>>6))s+=Math.abs(d[i*step+j]||0);arr.push(s);mx=Math.max(mx,s)}arr=arr.map(function(v){return mx?v/mx:.3});c.clearRect(0,0,cv.width,cv.height);draw(arr);try{ac.close()}catch(e){}})}).catch(function(){});
  }
}
function trimMove(which){
  var s=+$('#sTrS').value,e=+$('#sTrE').value;
  if(which==='s'&&s>e-20){s=e-20;$('#sTrS').value=s}
  if(which==='e'&&e<s+20){e=s+20;$('#sTrE').value=e}
  S.trimStart=trimDur?s/1000*trimDur:0;S.trimEnd=(trimDur&&e<1000)?e/1000*trimDur:0;
  trimUI();
  if(trimAudio){try{trimAudio.currentTime=S.trimStart}catch(x){}}
}
function trimUI(){
  var s=+$('#sTrS').value,e=+$('#sTrE').value;
  var f=$('#sFill');f.style.left=(s/10)+'%';f.style.width=((e-s)/10)+'%';
  $('#sTs').textContent=mmss(S.trimStart);$('#sTe').textContent=S.trimEnd?mmss(S.trimEnd):(trimDur?mmss(trimDur):'full');
  var len=(S.trimEnd||trimDur)-S.trimStart;$('#sTl').textContent=trimDur?'Clip '+mmss(len):'';
}
var phT=0;
function toggleTrimPrev(){
  if(trimAudio){stopTrimPrev();return}
  mus.stop();var src=S.music==='upload'?S.audioUrl:S.musicUrl;if(!src)return;
  var a=trimAudio=new Audio(src);a.currentTime=S.trimStart||0;
  a.play().catch(function(){alert('Tap again to allow audio playback.');stopTrimPrev()});
  $('#sTrP').textContent='■ Stop';var ph=$('#sPh');ph.style.display='block';
  phT=setInterval(function(){
    if(!trimAudio)return;var end=S.trimEnd||trimDur||a.duration;
    if(a.currentTime>=end-.05){a.currentTime=S.trimStart||0}
    if(trimDur)ph.style.left=(a.currentTime/trimDur*100)+'%';
  },80);
}
function stopTrimPrev(){
  clearInterval(phT);if(trimAudio){try{trimAudio.pause()}catch(e){}trimAudio=null}
  var b=$('#sTrP');if(b)b.textContent='▶ Preview clip';var ph=$('#sPh');if(ph)ph.style.display='none';
}

/* ---------- generate link / download ---------- */
function slug(n){return (n||'invitation').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,32)||'invitation'}
function linkData(){
  var d={card:S.card[1],category:S.category,occasion:S.occasion,names:displayNames(),message:S.message,date:S.date,time:S.time,venue:S.venue,language:S.language,
    opening:S.opening,revealEffect:S.revealEffect,effectIntensity:S.effectIntensity,font:S.font,fontColor:S.fontColorUser?S.fontColor:'',fontColorUser:S.fontColorUser,color:S.color,tintAmt:S.tintAmt,
    music:S.music,musicUrl:'',trimStart:+S.trimStart.toFixed(2),trimEnd:+S.trimEnd.toFixed(2),musicStart:S.musicStart,scratch:S.scratch};
  var warn='';
  if(S.music==='url'){d.musicUrl=S.musicUrl;d.music='custom'}
  else if(S.music==='upload'){d.music='festive';d.trimStart=0;d.trimEnd=0;warn='Your uploaded song stays on this device, so the shared link plays the “Celebration” music instead. Download the file to keep your own song, or paste a direct audio link.'}
  if(S.photo||S.gallery.length)warn+=(warn?' ':'')+'Your photos are saved only in the downloaded file; the shared link shows the card without them.';
  return {d:d,warn:warn};
}
function generate(){
  if(!S.date){setTab('details');$('#sDate').focus();try{$('#sDate').showPicker&&$('#sDate').showPicker()}catch(e){}return}
  mus.stop();stopTrimPrev();
  var L=linkData(),id=slug(S.names),payload=encodeInvitationData(L.d);
  var link=location.origin+'/i/'+encodeURIComponent(id)+'?d='+encodeURIComponent(payload);
  try{localStorage.setItem('utsavly-demo-'+id,JSON.stringify(L.d))}catch(e){}
  try{track('invitation_published',{occasion:S.occasion})}catch(e){}
  var res=$('#stuRes');
  res.innerHTML='<div><p style="color:#d8b06a;font:700 9px DM Sans;letter-spacing:.26em;margin:6px 0 0">YOUR INVITATION IS READY</p><h3>'+esc(displayNames())+'</h3><p>Share this unique link or QR code with your guests.</p>'
   +'<div class="lb"><input id="rLink" readonly value="'+esc(link)+'"><button id="rCopy">Copy</button></div>'
   +'<img alt="QR code" src="'+esc(qrUrl(link,360))+'">'
   +'<div class="acts"><button class="pri" id="rShare">Share</button><button id="rDl">⬇ Download file</button><a href="'+esc(link)+'" target="_blank" rel="noopener">▶ Open link</a><a id="rQr" href="'+esc(qrUrl(link,600))+'" target="_blank" rel="noopener" download="invitation-qr.png">QR image</a><button id="rImg" style="grid-column:1/-1">🖼 Save as image (PNG)</button></div>'
   +(L.warn?'<p style="color:#e0b866">'+esc(L.warn)+'</p>':'')
   +'<p style="font-size:11px">The downloaded file opens offline in any browser'+(S.music==='upload'?' and includes your uploaded song':'')+'.</p>'
   +'<button class="back" id="rBack">← Back to editing</button>'
   +'<div class="brand">✦ Made with UTSAVLY<br>Developed by <a href="'+P.IG+'" target="_blank" rel="noopener noreferrer">Gourav Patyal</a></div></div>';
  res.classList.add('on');res.scrollTop=0;
  $('#rBack').onclick=function(){res.classList.remove('on')};
  $('#rCopy').onclick=function(){var i=$('#rLink');i.select();var ok=function(){$('#rCopy').textContent='Copied ✓';setTimeout(function(){$('#rCopy').textContent='Copy'},1800)};if(navigator.clipboard)navigator.clipboard.writeText(link).then(ok,function(){document.execCommand('copy');ok()});else{document.execCommand('copy');ok()}};
  $('#rShare').onclick=function(){if(navigator.share)navigator.share({title:displayNames()+' — '+S.occasion,text:'You are invited! Open your invitation:',url:link}).catch(function(){});else $('#rCopy').click()};
  $('#rDl').onclick=function(){downloadFile(this)};
  $('#rImg').onclick=function(){savePoster(this)};
}
function toDataURL(url){return fetch(url).then(function(r){return r.blob()}).then(function(b){return new Promise(function(res){var f=new FileReader();f.onload=function(){res(f.result)};f.readAsDataURL(b)})})}
function downloadFile(btn){
  var old=btn.textContent;btn.textContent='Preparing…';btn.disabled=true;
  var d=playerData();d.site=location.origin+'/';
  var jobs=[fetch('invitation-player.css').then(function(r){return r.text()}),fetch('invitation-player.js').then(function(r){return r.text()})];
  var art=d.art;
  if(art.img)jobs.push(toDataURL(art.img).then(function(u){art.img=u}));
  else jobs.push(fetch('style.css').then(function(r){return r.text()}),fetch('designer.css').then(function(r){return r.text()}));
  if(S.music==='upload'&&S.file)jobs.push(toDataURL(S.audioUrl).then(function(u){d.audioUrl=u}));
  d.musicUrl=S.music==='url'?S.musicUrl:'';
  Promise.all(jobs).then(function(r){
    var extra=art.img?'':'<style>'+r[2]+'</style><style>'+r[3]+'</style>';
    var html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>'+esc(d.names)+' — Invitation</title><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=Great+Vibes&family=Allura&family=Alex+Brush&family=Parisienne&family=Playfair+Display:wght@500;600&family=Cinzel:wght@500;600&family=Prata&family=Libre+Baskerville&family=DM+Serif+Display&family=Marcellus&family=Noto+Sans+Devanagari&family=Noto+Sans+Gurmukhi&family=Noto+Naskh+Arabic&display=swap" rel="stylesheet"><style>html,body{margin:0;background:#050505;height:100%}</style><style>'+r[0]+'</style>'+extra+'</head><body><script>'+r[1].replace(/<\/script/g,'<\\/script')+'<\/script><script>var DATA='+JSON.stringify(d).replace(/</g,'\\u003c')+';UtsavlyPlayer.open(DATA,{autoOpen:false});<\/script></body></html>';
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=slug(S.names)+'-invitation.html';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);
    btn.textContent='Downloaded ✓';btn.disabled=false;setTimeout(function(){btn.textContent=old},2500);
  }).catch(function(){btn.textContent=old;btn.disabled=false;alert('Download failed. Please try again.')});
}
function loadImg(src){return new Promise(function(res){if(!src)return res(null);var i=new Image();i.onload=function(){res(i)};i.onerror=function(){res(null)};i.src=src})}
function coverDraw(c,img,x,y,w,h){var k=Math.max(w/img.width,h/img.height),iw=img.width*k,ih=img.height*k;c.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih)}
function savePoster(btn){
  var old=btn.textContent;btn.textContent='Preparing…';btn.disabled=true;
  var d=playerData(),art=d.art,W=1080;
  var fam=P.safeFont(d.font);
  Promise.all([loadImg(art.img),loadImg(d.photo&&d.photoShape!=='none'?d.photo:''),document.fonts?document.fonts.load('100px "'+fam+'"').catch(function(){}):0]).then(function(r){
    var bg=r[0],ph=r[1],ratio=bg?bg.width/bg.height:.75,H=Math.round(W/ratio);
    var cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');
    if(bg)coverDraw(c,bg,0,0,W,H);else{var p=art.p||['#2a2218','#0b0907'],g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);c.fillStyle=g;c.fillRect(0,0,W,H)}
    if(d.tintAmt>0){c.globalCompositeOperation='soft-light';c.globalAlpha=Math.min(1,d.tintAmt/100);c.fillStyle=d.color;c.fillRect(0,0,W,H);c.globalCompositeOperation='source-over';c.globalAlpha=1}
    var ink=d.fontColorUser?d.fontColor:(art.img?(art.ink||'#fff'):(art.p?art.p[2]:'#2a1d0f'));
    var zx=(art.img?(art.x||50):50)/100*W,zy=(art.img?(art.y||50):56)/100*H,zw=(art.img?(art.w||60):60)/100*W;
    var f=P.fmtDate(d.date),t=P.fmtTime(d.time),names=d.names||'';
    function layout(sc,draw){
      var y=0,items=[];
      function add(h,fn){items.push({h:h,fn:fn});y+=h}
      if(ph){var ps=Math.min(d.photoSize/100*W,zw)*sc;add(ps+30*sc,function(cy){c.save();c.beginPath();if(d.photoShape==='round')rr(c,zx-ps/2,cy,ps,ps,ps*.14);else c.arc(zx,cy+ps/2,ps/2,0,6.283);c.clip();coverDraw(c,ph,zx-ps/2,cy,ps,ps);c.restore();c.lineWidth=8*sc;c.strokeStyle='rgba(255,255,255,.9)';c.beginPath();if(d.photoShape==='round')rr(c,zx-ps/2,cy,ps,ps,ps*.14);else c.arc(zx,cy+ps/2,ps/2,0,6.283);c.stroke()})}
      add(70*sc,function(cy){c.font='600 '+(4.2*W/100*sc)+'px "DM Sans",sans-serif';c.textAlign='center';c.textBaseline='top';c.globalAlpha=.85;if('letterSpacing' in c)c.letterSpacing=(.28*4.2*W/100*sc)+'px';c.fillText(String(d.occasion||'').toUpperCase(),zx,cy);c.globalAlpha=1;if('letterSpacing' in c)c.letterSpacing='0px'});
      var ns=Math.max(8,Math.min(21,200/Math.max(7,names.length)))*W/100*sc;
      c.font=ns+'px "'+fam+'",serif';var lines=[],cur='';
      names.split(' ').forEach(function(w){var tst=cur?cur+' '+w:w;if(c.measureText(tst).width>zw&&cur){lines.push(cur);cur=w}else cur=tst});if(cur)lines.push(cur);
      add(lines.length*ns*1.12+30*sc,function(cy){c.font=ns+'px "'+fam+'",serif';c.textAlign='center';c.textBaseline='top';lines.forEach(function(l,i){c.fillText(l,zx,cy+i*ns*1.12)})});
      add(40*sc,function(cy){c.globalAlpha=.5;c.fillRect(zx-zw*.15,cy+10*sc,zw*.3,2);c.globalAlpha=1});
      var dl=f?(f.wd+', '+f.day+' '+f.mon+' '+f.yr+(t?' · '+t:'')):'';
      var ls=5*W/100*sc;
      if(dl)add(ls*1.6,function(cy){c.font='500 '+ls+'px "DM Sans",sans-serif';c.textAlign='center';c.textBaseline='top';c.fillText(dl,zx,cy)});
      if(d.venue)add(ls*1.6,function(cy){c.font='500 '+ls+'px "DM Sans",sans-serif';c.textAlign='center';c.textBaseline='top';c.fillText('📍 '+d.venue,zx,cy)});
      if(draw){var cy=zy-y/2;c.fillStyle=ink;c.shadowColor=(lumI(ink)>150?'rgba(0,0,0,.4)':'rgba(255,255,255,.35)');c.shadowBlur=14;items.forEach(function(it){it.fn(cy);cy+=it.h})}
      return y;
    }
    var sc=1;while(layout(sc,false)>H*.84&&sc>.3)sc-=.05;
    layout(sc,true);
    cv.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=slug(S.names)+'-invitation.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);btn.textContent='Saved ✓';btn.disabled=false;setTimeout(function(){btn.textContent=old},2500)},'image/png');
  }).catch(function(){btn.textContent=old;btn.disabled=false;alert('Could not create the image. Please try again.')});
}
function rr(c,x,y,w,h,r){c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function lumI(hex){var n=parseInt(String(hex||'#000').replace('#','').padEnd(6,'0').slice(0,6),16);return ((n>>16)*299+((n>>8)&255)*587+(n&255)*114)/1000}
window.UtsavlyStudio={open:openStudio,close:closeStudio,artFromCard:artFromCard,defaultCard:defaultCard};
})();
