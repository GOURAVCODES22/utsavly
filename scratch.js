/* UTSAVLY scratch-to-reveal: optional foil over names / date / venue / message / a secret patch. */
(function(){'use strict';
var FOIL={gold:['#f8e7b4','#d9ab55','#b98a38'],silver:['#f4f6f9','#b9c0c9','#8e97a2'],rose:['#fbdcd5','#d9958f','#b8706b']};
var css='.scr{position:absolute;z-index:6;pointer-events:auto;border-radius:10px;touch-action:none;cursor:pointer;transition:opacity .7s}.scrs{position:absolute;left:14%;width:72%;height:10.5%;z-index:30;display:none;align-items:center;justify-content:center;text-align:center;font:600 15px/1.25 Inter,system-ui,sans-serif;color:#fff;padding:0 14px;border-radius:12px;background:rgba(30,18,8,.82);border:1px solid rgba(230,190,110,.7)}.scrs.on{display:flex}.scrs span{position:relative;z-index:1}';
function ensure(){if(document.getElementById('scrcss'))return;var s=document.createElement('style');s.id='scrcss';s.textContent=css;document.head.appendChild(s)}
function paint(c,kind){var x=c.getContext('2d'),w=c.width,h=c.height,p=FOIL[kind]||FOIL.gold,g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,p[0]);g.addColorStop(.5,p[1]);g.addColorStop(1,p[2]);x.fillStyle=g;x.fillRect(0,0,w,h);
 for(var i=0;i<w*h/90;i++){x.fillStyle='rgba(255,255,255,'+Math.random()*.35+')';x.fillRect(Math.random()*w,Math.random()*h,1.6,1.6);x.fillStyle='rgba(60,30,0,'+Math.random()*.12+')';x.fillRect(Math.random()*w,Math.random()*h,1.4,1.4)}
 var sh=x.createLinearGradient(0,0,w,0);sh.addColorStop(.35,'rgba(255,255,255,0)');sh.addColorStop(.5,'rgba(255,255,255,.45)');sh.addColorStop(.65,'rgba(255,255,255,0)');x.fillStyle=sh;x.fillRect(0,0,w,h);
 x.fillStyle='rgba(70,40,5,.6)';x.font='600 '+Math.max(10,Math.min(h*.34,w*.07))+'px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('✦  SCRATCH  ✦',w/2,h/2)}
function sparks(host,r){try{for(var i=0;i<14;i++){var d=document.createElement('i');d.style.cssText='position:absolute;z-index:7;pointer-events:none;width:5px;height:5px;border-radius:50%;background:#ffe08a;box-shadow:0 0 8px #ffd27a;left:'+(r.l+r.w/2)+'px;top:'+(r.t+r.h/2)+'px';host.appendChild(d);var a=Math.random()*6.283,v=40+Math.random()*70;d.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate('+Math.cos(a)*v+'px,'+Math.sin(a)*v+'px)',opacity:0}],{duration:800,easing:'ease-out'}).onfinish=function(){this.effect.target.remove()}}}catch(e){}}
/* cover a rectangle (l,t,w,h in host px) inside host */
function coverRect(host,r,o){o=o||{};ensure();if(getComputedStyle(host).position==='static')host.style.position='relative';
 var c=document.createElement('canvas'),d=Math.min(devicePixelRatio||1,2),pad=8;r={l:r.l-pad,t:r.t-pad*.6,w:r.w+pad*2,h:r.h+pad*1.2};
 c.className='scr';c.style.cssText='pointer-events:auto;left:'+r.l+'px;top:'+r.t+'px;width:'+r.w+'px;height:'+r.h+'px';c.width=Math.max(30,r.w*d);c.height=Math.max(24,r.h*d);paint(c,o.foil);host.appendChild(c);
 var x=c.getContext('2d'),down=false,lx=0,ly=0,moves=0,done=false,rad=18*d;
 function pos(e){var b=c.getBoundingClientRect();return [(e.clientX-b.left)*c.width/b.width,(e.clientY-b.top)*c.height/b.height]}
 function stop(e){e.stopPropagation()}
 ['touchstart','touchmove','touchend','mousedown','mousemove','click'].forEach(function(n){c.addEventListener(n,stop,{passive:true})});
 function check(){var t=document.createElement('canvas');t.width=48;t.height=24;var q=t.getContext('2d');q.drawImage(c,0,0,48,24);var im=q.getImageData(0,0,48,24).data,n=0;for(var i=3;i<im.length;i+=4)if(im[i]<60)n++;
  if(n/(48*24)>.45)reveal()}
 function reveal(){if(done)return;done=true;c.style.opacity=0;sparks(host,r);if(navigator.vibrate)try{navigator.vibrate([12,40,18])}catch(e){}if(o.onReveal)o.onReveal();setTimeout(function(){c.remove()},800)}
 c.addEventListener('pointerdown',function(e){down=true;try{c.setPointerCapture(e.pointerId)}catch(x){}var p=pos(e);lx=p[0];ly=p[1];seg(p[0],p[1],p[0]+.1,p[1]);e.stopPropagation()});
 function seg(a,b,e,f){x.globalCompositeOperation='destination-out';x.lineCap='round';x.lineWidth=rad*2;x.beginPath();x.moveTo(a,b);x.lineTo(e,f);x.stroke()}
 c.addEventListener('pointermove',function(e){if(!down||done)return;var p=pos(e);seg(lx,ly,p[0],p[1]);lx=p[0];ly=p[1];if(++moves%6===0){check();if(navigator.vibrate&&moves%18===0)try{navigator.vibrate(3)}catch(x){}}e.stopPropagation()});
 c.addEventListener('pointerup',function(){down=false;check()});c.addEventListener('pointercancel',function(){down=false});
 return c}
/* cover a union of elements within their common parent */
function tb(e){try{var r=document.createRange();r.selectNodeContents(e);var b=r.getBoundingClientRect();if(b.width>2&&b.height>2)return b}catch(x){}return e.getBoundingClientRect()}
function coverEls(els,o){var host=els[0].parentElement,hb=host.getBoundingClientRect(),l=1e9,t=1e9,rr=-1e9,bb=-1e9;els.forEach(function(e){var b=tb(e);l=Math.min(l,b.left);t=Math.min(t,b.top);rr=Math.max(rr,b.right);bb=Math.max(bb,b.bottom)});
 var sx=host.offsetWidth?hb.width/host.offsetWidth:1;return coverRect(host,{l:(l-hb.left)/sx,t:(t-hb.top)/sx,w:(rr-l)/sx,h:(bb-t)/sx},o)}
function secret(parent,sc,z){if(!sc||!sc.secret)return null;ensure();var d=document.createElement('div');d.className='scrs on';var top={top:'12%',mid:'46%',bottom:'70%'}[sc.pos||'mid']||'46%';d.style.top=top;if(z)d.style.zIndex=z;d.innerHTML='<span></span>';d.firstChild.textContent=sc.secret;parent.appendChild(d);
 requestAnimationFrame(function(){coverRect(d,{l:0,t:0,w:d.offsetWidth,h:d.offsetHeight},{foil:sc.foil})});return d}
function any(sc){return !!(sc&&(sc.names||sc.date||sc.venue||sc.message||sc.secret))}
window.UtsavlyScratch={coverRect:coverRect,coverEls:coverEls,secret:secret,any:any};
/* ---- main player hook ---- */
var P=window.UtsavlyPlayer;if(!P)return;var po=P.open;
P.open=function(d,opt){var r=po.apply(this,arguments);try{if(any(d&&d.scratch))watch(d.scratch)}catch(e){}return r};
function watch(sc){var roots=document.querySelectorAll('.up'),root=roots[roots.length-1];if(!root)return;var got={},sec=null,tm=0;
 function scan(){var z;
  if(sc.names&&!got.n){z=root.querySelector('.upz-names');if(z&&!z.__scr&&!z.parentElement.querySelector('.scr')){z.__scr=1;coverEls([z],{foil:sc.foil,onReveal:function(){got.n=1}})}}
  if(sc.date){var eb=root.querySelector('.upz-eyebrow');if(!got.d&&eb&&/save the date/i.test(eb.textContent)){var ds=[].slice.call(eb.parentElement.querySelectorAll('.upz-sub,.upz-big'));if(ds.length&&!ds[0].__scr&&!eb.parentElement.querySelector('.scr')){ds[0].__scr=1;coverEls(ds,{foil:sc.foil,onReveal:function(){got.d=1}})}}
   if(!got.d)[].forEach.call(root.querySelectorAll('.sh-row'),function(r){if(r.textContent.indexOf('📅')>-1&&!r.__scr){r.__scr=1;coverEls([r],{foil:sc.foil,onReveal:function(){got.d=1}})}})}
  if(sc.venue){var ev=root.querySelector('.upz-eyebrow');if(!got.v&&ev&&/the venue/i.test(ev.textContent)){var vb=ev.parentElement.querySelector('.upz-big');if(vb&&!vb.__scr&&!ev.parentElement.querySelector('.scr')){vb.__scr=1;coverEls([vb],{foil:sc.foil,onReveal:function(){got.v=1}})}}
   if(!got.v)[].forEach.call(root.querySelectorAll('.sh-row'),function(r){if(r.textContent.indexOf('📍')>-1&&!r.__scr){r.__scr=1;coverEls([r],{foil:sc.foil,onReveal:function(){got.v=1}})}})}
  if(sc.message&&!got.m){var m=root.querySelector('.sh-msg');if(m&&!m.__scr){m.__scr=1;coverEls([m],{foil:sc.foil,onReveal:function(){got.m=1}})}}
  if(sc.secret&&!sec){var op=root.querySelector('.op');if(op&&op.classList.contains('done')){sec=secret(root,sc);if(sec)sec.classList.add('on')}}}
 var mo=new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(scan,260)});mo.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});setTimeout(scan,600)}
})();
