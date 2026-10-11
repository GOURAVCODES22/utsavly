/* UTSAVLY real openings: 23 photo-real openings, one engine, tint-aware. */
(function(){'use strict';
var P=window.UtsavlyPlayer;if(!P)return;var B='sc/o_';
var sm=function(t){t=t<0?0:t>1?1:t;return t*t*(3-2*t)};
function mix(R,a,b,t){for(var n in R){var u=a[n]==null?R[n]:a[n],v=b[n]==null?u:b[n];R[n]=u+(v-u)*t}return R}
function kf(k,p){var R={o:1,x:0,y:0,s:1,sx:1,r:0,ry:0,bl:0,br:1,ci:0,sc:1},i;if(!k)return R;if(p<=k[0][0])return mix(R,k[0][1],k[0][1],0);
 for(i=1;i<k.length;i++)if(p<=k[i][0])return mix(R,k[i-1][1],k[i][1],sm((p-k[i-1][0])/(k[i][0]-k[i-1][0])));return mix(R,k[k.length-1][1],k[k.length-1][1],0)}
function h2(h){var r=parseInt(h.substr(1,2),16)/255,g=parseInt(h.substr(3,2),16)/255,b=parseInt(h.substr(5,2),16)/255,M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m,H=0,S=0,Lm=(M+m)/2;
 if(d){S=d/(1-Math.abs(2*Lm-1));H=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;H*=60;if(H<0)H+=360}return [H,S,Lm]}
function hsl(H,S,L){var c=(1-Math.abs(2*L-1))*S,x=c*(1-Math.abs((H/60)%2-1)),m=L-c/2,r=0,g=0,b=0;
 if(H<60){r=c;g=x}else if(H<120){r=x;g=c}else if(H<180){g=c;b=x}else if(H<240){g=x;b=c}else if(H<300){r=x;b=c}else{r=c;b=x}
 return 'rgb('+Math.round((r+m)*255)+','+Math.round((g+m)*255)+','+Math.round((b+m)*255)+')'}
var PI=new Image();PI.src=B+'petal.webp';
var A={'env-rose':'luxury-letter','env-ivory':'luxury-letter','env-burgundy':'luxury-letter','env-emerald':'luxury-letter','env-dahlia':'luxury-letter',
'door-emerald':'palace-doors','door-royal':'palace-doors','door-moroccan':'palace-doors','door-gold':'palace-doors','door-blush':'palace-doors','door-marigold':'palace-doors','door-amalfi':'palace-doors','midnight-stargaze':'palace-doors',
'paper-arch':'arch-reveal','floral-temple':'arch-reveal','diya-lamps':'diya-reveal','royal-ribbon':'gift-box'};
var T=function(a,b,o){return [a,o||{}]};
/* layer: i=image  cv=cover  fill/glow  rep=tile  cl=l|r  th=base hue (tintable)  bl=blend  org=transform-origin  */
var G='#ffe2a0';
var D={
'palace-doors':{ms:5800,L:[{fill:'#0c0805',z:0},{glow:G,x:50,y:50,w:150,z:1,k:[[0,{o:0,s:.5}],[.28,{o:.15,s:.6}],[.75,{o:1,s:1.25}]]},
 {i:'doors',cv:1,cl:'l',org:'0% 50%',z:3,th:28,k:[[0,{s:1}],[.18,{s:1.02}],[.25,{ry:0}],[.78,{ry:-84,s:1.12}]]},{i:'doors',cv:1,cl:'r',org:'100% 50%',z:3,th:28,k:[[0,{s:1}],[.18,{s:1.02}],[.25,{ry:0}],[.78,{ry:84,s:1.12}]]}],
 F:[{t:'dust',a:[.2,.9],n:70,c:['#ffe9b0','#ffd27a']}],fade:.86},
'royal-gate':{ms:5800,L:[{fill:'#1a1208',z:0},{glow:'#ffd9a0',x:50,y:52,w:140,z:1,k:[[0,{o:.1}],[.5,{o:.8,s:1.1}],[.85,{o:1,s:1.4}]]},
 {i:'gate',cv:1,cl:'l',org:'50% 60%',z:3,th:38,k:[[0,{s:1}],[.2,{x:0}],[.78,{x:-56,ry:-28,s:1.35}]]},{i:'gate',cv:1,cl:'r',org:'50% 60%',z:3,th:38,k:[[0,{s:1}],[.2,{x:0}],[.78,{x:56,ry:28,s:1.35}]]}],
 F:[{t:'dust',a:[.25,.9],n:50,c:['#fff0c8','#ffd27a']}],fade:.87},
'arch-reveal':{ms:6000,L:[{fill:'#14100a',z:0},{i:'arch',cv:1,org:'50% 46%',z:2,th:340,k:[[0,{s:1,br:1}],[.8,{s:3.3,br:1.35}],[.92,{s:4.2,br:1.9,o:1}]]},
 {glow:'#fff6dc',x:50,y:46,w:90,z:3,k:[[0,{o:.1,s:.2}],[.6,{o:.5,s:.8}],[.9,{o:1,s:2.6}]]}],F:[{t:'petals',a:[.1,.85],n:34,c:['#ffd0dc','#fff','#f6a8c0']}],fade:.9},
'luxury-letter':{ms:6600,env:1},
'palace-chandelier':{ms:6400,L:[{fill:'#050302',z:0},{i:'chandelier',cv:1,org:'50% 38%',z:2,k:[[0,{s:1,br:.9}],[.8,{s:1.9,br:1.5}],[.95,{s:2.3,br:1.9}]]},
 {glow:'#fff1c8',x:50,y:36,w:70,z:3,k:[[0,{o:.15,s:.4}],[.55,{o:.55,s:.9}],[.9,{o:1,s:3}]]}],F:[{t:'dust',a:[.1,.95],n:80,c:['#fff6d8','#ffe08a']}],fade:.9},
'kerala-backwater':{ms:6400,L:[{i:'backwater',cv:1,org:'66% 55%',z:2,k:[[0,{s:1,y:0}],[.85,{s:2.9,y:-1.5}],[.95,{s:3.4,br:1.4}]]},
 {glow:'#ffd890',x:66,y:55,w:50,z:3,k:[[0,{o:.25,s:.2}],[.6,{o:.6,s:.6}],[.92,{o:1,s:4}]]}],F:[{t:'fly',a:[0,1],n:36,c:['#fff3b0','#ffd35a']}],fade:.9},
'diya-reveal':{ms:5800,L:[{i:'diya',cv:1,org:'50% 70%',z:2,k:[[0,{s:1,br:.28}],[.3,{br:.7}],[.7,{br:1.25,s:1.12}],[.95,{s:1.3,br:1.5}]]},
 {glow:'#ffb347',x:50,y:68,w:60,z:3,k:[[0,{o:.1,s:.3}],[.4,{o:.5,s:.7}],[.9,{o:1,s:4.5}]]}],F:[{t:'embers',a:[.2,.95],n:60,c:['#ffb347','#ffe08a']}],fade:.9},
'velvet-curtains':{ms:5400,L:[{i:'stagefloor',cv:1,z:1,k:[[0,{br:.55,s:1}],[.8,{br:1.15,s:1.12}]]},
 {i:'curtain',x:56,y:50,w:112,h:106,z:3,th:355,org:'0% 50%',k:[[0,{x:0,sx:1}],[.18,{x:0,sx:1}],[.8,{x:-70,sx:.5}]]},{i:'curtain',x:44,y:50,w:112,h:106,z:3,th:355,fx:1,k:[[0,{x:0,sx:1}],[.18,{x:0,sx:1}],[.8,{x:85,sx:.5}]]},
 {glow:'#ffe6b0',x:50,y:62,w:70,z:2,k:[[0,{o:0}],[.4,{o:.4}],[.85,{o:1,s:2}]]}],F:[{t:'dust',a:[.3,.95],n:50,c:['#fff0c8']}],fade:.88},
'royal-mirror':{ms:5800,mirror:1},
'card-open':{ms:5400,L:[{fill:'radial-gradient(circle at 50% 40%,#3a2a18,#0a0705)',z:0},{i:'parch',x:50,y:50,w:70,h:78,z:2,k:[[0,{o:0,s:.9}],[.3,{o:0}],[.5,{o:1,s:1}],[.88,{s:1.5,o:1}]]},
 {i:'cover',x:50,y:50,w:72,z:3,org:'0% 50%',orgbox:1,th:45,k:[[0,{s:1,ry:0}],[.15,{ry:0}],[.6,{ry:-108,o:1}],[.62,{o:0}]]},{glow:'#fff1d0',x:50,y:50,w:80,z:4,k:[[0,{o:0}],[.5,{o:.2}],[.9,{o:.9,s:2}]]}],F:[{t:'dust',a:[.3,.95],n:40,c:['#ffe9b0']}],fade:.9},
'scroll-open':{ms:5600,L:[{fill:'radial-gradient(circle at 50% 45%,#4a3320,#120b05)',z:0},{i:'parch',x:50,y:50,w:94,h:96,z:2,k:[[0,{ci:50}],[.2,{ci:50}],[.75,{ci:0}]]},
 {i:'scroll',x:50,y:50,w:68,z:3,cl:'l',org:'100% 50%',k:[[0,{x:0}],[.2,{x:0}],[.75,{x:-52}],[.85,{o:0}]]},{i:'scroll',x:50,y:50,w:68,z:3,cl:'r',org:'0% 50%',k:[[0,{x:0}],[.2,{x:0}],[.75,{x:52}],[.85,{o:0}]]}],F:[{t:'dust',a:[.3,.95],n:40,c:['#f0d9a8']}],fade:.9},
'gift-box':{ms:5800,L:[{fill:'radial-gradient(circle at 50% 60%,#2a1a14,#0a0605)',z:0},{glow:'#ffe2a0',x:50,y:55,w:60,z:1,k:[[0,{o:0,s:.2}],[.45,{o:.2}],[.62,{o:1,s:1}],[.92,{o:1,s:5}]]},
 {i:'boxbody',x:50,y:62,w:64,z:2,th:355},
 {i:'boxlid',x:50,y:48,w:66,z:3,th:355,k:[[0,{y:0,o:1}],[.45,{y:0,r:0}],[.65,{y:-60,x:30,r:-35,o:1}],[.85,{o:0}]]},
 {i:'bow',x:50,y:43,w:36,z:4,th:42,k:[[0,{o:1}],[.3,{r:-6}],[.4,{r:6}],[.5,{y:-70,r:30,s:1.1}],[.62,{o:0}]]}],F:[{t:'confetti',a:[.55,.56],n:90,c:['#f2c14e','#fff','#e8a0a0','#d94f77']},{t:'burst',a:[.55,.9],n:50,c:['#ffe9b0']}],fade:.88},
'golden-spotlight':{ms:5600,L:[{i:'stagedark',cv:1,z:1,k:[[0,{br:.5,s:1}],[.8,{br:1.1,s:1.12}]]},
 {glow:'#ffe3a0',x:50,y:60,w:42,z:3,k:[[0,{x:-30,y:10,o:.9}],[.25,{x:30,y:6}],[.5,{x:-10,y:12}],[.7,{x:0,y:0,s:1.2}],[.92,{s:6,o:1}]]}],F:[{t:'dust',a:[.1,.95],n:60,c:['#fff0c8']}],fade:.9},
'celebration-burst':{ms:4400,L:[{fill:'radial-gradient(circle at 50% 50%,#2a1a30,#07040a)',z:0},{glow:'#fff6d8',x:50,y:50,w:90,z:2,k:[[0,{o:0,s:.2}],[.12,{o:1,s:1}],[.4,{o:0,s:2}]]},{ring:1,z:3,k:[[0,{o:0,s:.1}],[.12,{o:.9,s:.2}],[.6,{o:0,s:3}]]}],
 F:[{t:'confetti',a:[.1,.11],n:220,c:['#f2c14e','#ffffff','#e8a0a0','#d94f77','#7fd1c8','#b79cf0']}],fade:.78},
'ocean-wave':{ms:6200,L:[{i:'sea2',cv:1,z:1,k:[[0,{s:1.1,y:0}],[.4,{s:1.03}],[.6,{y:0}],[.92,{y:112}]]},
 {i:'wave',cv:1,z:2,bl:'screen',org:'50% 100%',k:[[0,{y:70,o:0}],[.2,{y:58,o:.25}],[.45,{y:0,o:1,s:1.08}],[.62,{y:0,o:1,s:1.16}],[.92,{y:112,o:.6}]]},
 {fill:'#ffe6c0',z:3,bl:'screen',k:[[.44,{o:0}],[.5,{o:.3}],[.58,{o:0}]]},
 {i:'shore',x:50,y:-4,w:100,h:22,z:4,op:'top',k:[[0,{o:0,y:0}],[.5,{o:0,y:0}],[.55,{o:1,y:0}],[.92,{y:112}]]}],F:[{t:'spray',a:[.35,.62],n:70,c:['#ffffff','#bfeaf5']}],fade:.96},
'clouds-parting':{ms:4800,L:[{fill:'linear-gradient(#2f6fb8,#9cc4ea)',z:0,k:[[0,{o:1}],[.85,{o:1}],[.97,{o:0}]]},
 {i:'cloud',mk:'linear-gradient(to right,transparent 0,#000 16%,#000 84%,transparent 100%)',cv:1,fx:1,z:2,bl:'screen',k:[[0,{x:-105}],[.38,{x:-6,s:1.05}],[.55,{x:-6,s:1.05}],[.92,{x:-112,s:1.15}]]},{i:'cloud',mk:'linear-gradient(to right,transparent 0,#000 16%,#000 84%,transparent 100%)',cv:1,z:2,bl:'screen',k:[[0,{x:105}],[.38,{x:6,s:1.05}],[.55,{x:6,s:1.05}],[.92,{x:112,s:1.15}]]},
 {i:'cloud',mk:'linear-gradient(to right,transparent 0,#000 16%,#000 84%,transparent 100%)',cv:1,fx:1,z:3,bl:'screen',k:[[.05,{x:-110,y:6}],[.42,{x:-14,y:6,s:1.2}],[.56,{x:-14,y:6,s:1.2}],[.94,{x:-118,y:6,s:1.3}]]},{i:'cloud',mk:'linear-gradient(to right,transparent 0,#000 16%,#000 84%,transparent 100%)',cv:1,z:3,bl:'screen',k:[[.05,{x:110,y:-6}],[.42,{x:14,y:-6,s:1.2}],[.56,{x:14,y:-6,s:1.2}],[.94,{x:118,y:-6,s:1.3}]]},
 {glow:'#fff3d6',x:50,y:50,w:90,z:4,k:[[0,{o:0}],[.55,{o:.5}],[.8,{o:0}]]}],F:[],fade:.93},
'rain-curtain':{ms:4800,L:[{fill:'linear-gradient(#27394a,#0a1118)',z:0,k:[[0,{o:1}],[.55,{o:1}],[.95,{o:0}]]},{i:'rain',rep:1,spd:90,z:2,bl:'screen',k:[[0,{o:.9}],[.6,{o:.8}],[.9,{o:0}]]},
 {i:'rain',rep:1,spd:55,z:2,bl:'screen',x:0,w:100,sh:.5,k:[[0,{o:.6}],[.9,{o:0}]]},{i:'drops',cv:1,z:3,bl:'screen',k:[[0,{o:.9,y:0}],[.5,{o:.8,y:8}],[.9,{o:0,y:30}]]}],F:[],fade:.92},
'snow-frost':{ms:4600,L:[{fill:'linear-gradient(#27475f,#0b1b2d)',z:0,k:[[0,{o:1}],[.55,{o:1}],[.95,{o:0}]]},{i:'frost',cv:1,z:2,bl:'screen',k:[[0,{o:.2,s:1.45}],[.35,{o:1,s:1.15}],[.55,{o:.95,s:1}],[.92,{o:0,s:.92}]]},{glow:'#dff3ff',x:50,y:50,w:90,z:1,k:[[0,{o:0}],[.7,{o:.35}],[.95,{o:0}]]}],F:[{t:'snow',a:[0,.95],n:90,c:['#ffffff','#dff3ff']}],fade:.92},
'petal-bloom':{ms:5600,L:[{fill:'radial-gradient(circle at 50% 50%,#3a1c28,#0d0509)',z:0},{i:'rose',x:50,y:50,w:80,z:2,org:'50% 50%',mask:1,th:340,k:[[0,{s:.18,r:-60,o:1}],[.55,{s:1,r:0}],[.92,{s:6.5,r:20,o:1}]]},{glow:'#ffc4d4',x:50,y:50,w:70,z:1,k:[[0,{o:0}],[.5,{o:.5}],[.9,{o:1,s:2}]]}],F:[{t:'petals',a:[.45,.95],n:50,c:['#f6a8c0','#ffd0dc','#e5668a'],img:1}],fade:.9},
'wind-leaves':{ms:4600,L:[{fill:'linear-gradient(#f4d6b8,#f9ecd8)',z:0,k:[[0,{o:1}],[.75,{o:1}],[.97,{o:0}]]},
 {i:'leaf',x:50,y:50,w:120,h:110,z:2,k:[[0,{x:-130,y:10,r:-20}],[.7,{x:120,y:-10,r:25}]]},{i:'leaf',x:50,y:50,w:100,h:100,z:2,fx:1,k:[[.1,{x:-120,y:-15,r:15}],[.85,{x:130,y:20,r:-30}]]},{i:'leaf',x:50,y:50,w:90,h:90,z:2,k:[[.2,{x:-120,y:25,r:-10}],[.95,{x:130,y:-20,r:30}]]}],F:[{t:'leaves',a:[.05,.9],n:46,c:['#e07a2a','#c0391b','#e8a32a']}],fade:.95},
'galaxy-stars':{ms:5400,L:[{i:'galaxy',cv:1,org:'50% 50%',z:1,k:[[0,{s:1,r:0}],[.85,{s:3.4,r:28}]]},{glow:'#fff',x:50,y:50,w:60,z:3,k:[[0,{o:0}],[.75,{o:.15}],[.95,{o:1,s:4}]]}],F:[{t:'warp',a:[.1,.95],n:140,c:['#ffffff','#cfe0ff']}],fade:.93},
'lightning':{ms:5000,L:[{i:'storm',cv:1,z:1,k:[[0,{br:.7,s:1}],[.8,{br:.9,s:1.12}],[.95,{br:1.6}]]},
 {i:'bolt',cv:1,z:3,bl:'screen',k:[[.14,{o:0}],[.16,{o:1}],[.2,{o:0}],[.36,{o:0}],[.38,{o:1,x:6}],[.43,{o:0}],[.56,{o:0}],[.58,{o:1,x:-5}],[.66,{o:0}]]},
 {fill:'#dfeaff',z:4,k:[[.14,{o:0}],[.16,{o:.55}],[.22,{o:0}],[.36,{o:0}],[.38,{o:.6}],[.46,{o:0}],[.56,{o:0}],[.58,{o:.8}],[.7,{o:0}]]},
 {glow:'#ffd27a',x:50,y:40,w:90,z:3,k:[[0,{o:0}],[.75,{o:.2}],[.95,{o:1,s:3}]]}],F:[{t:'rain',a:[0,.9],n:80,c:['#9fb6d6']}],fade:.9,shake:[.14,.7]},
'fire-spark':{ms:5000,L:[{fill:'#040201',z:0,k:[[0,{o:1}],[.8,{o:1}],[.97,{o:0}]]},{i:'fire',cv:1,z:2,bl:'screen',org:'50% 100%',k:[[0,{y:55,s:.7,o:.4}],[.4,{y:0,s:1.05,o:1}],[.8,{y:-12,s:1.3,o:1}],[.97,{y:-40,s:1.5,o:0}]]},
 {i:'embers',cv:1,z:3,bl:'screen',k:[[0,{o:.2,y:10}],[.5,{o:1,y:-6}],[.95,{o:0,y:-30}]]},{glow:'#ff7a1a',x:50,y:90,w:120,z:1,k:[[0,{o:.1}],[.6,{o:.8}],[.95,{o:0}]]}],F:[{t:'embers',a:[.1,.95],n:70,c:['#ff9a2a','#ffd27a']}],fade:.95}
};
/* ---------- engine ---------- */
function build(op,data,tn){var id=op.id,def=D[id],root=document.createElement('div');root.className='rxo';root.style.cssText='position:absolute;inset:0;overflow:hidden;background:transparent;perspective:none';
 var cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:9;pointer-events:none';var els=[],W=0,H=0,cx=cv.getContext('2d'),pt=[],spawned={};
 function size(){W=innerWidth;H=innerHeight;var d=Math.min(devicePixelRatio||1,1.5);cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}size();
 var th=function(h){return tn?(tn.h-h):0};
 function mk(L){var e,st;
  if(L.i){e=document.createElement('div');e.style.backgroundImage='url('+B+L.i+'.webp)';e.style.backgroundSize=L.rep?'100% auto':(L.cv?'cover':'100% 100%');e.style.backgroundPosition=L.op==='top'?'50% 0':'50% 50%';e.style.backgroundRepeat=L.rep?'repeat-y':'no-repeat';
   if(L.cv||L.rep){e.style.cssText+=';left:0;top:0;width:100%;height:100%'}else{e.style.width=L.w+'%';e.style.height=L.h?L.h+'%':'';e.style.left=(L.x-L.w/2)+'%';e.style.top=L.h?(L.y-L.h/2)+'%':'';
    if(!L.h){var im=new Image();im.onload=function(){e.style.height=(L.w/100*W*im.height/im.width/H*100)+'%';e.style.top=(L.y-parseFloat(e.style.height)/2)+'%'};im.src=B+L.i+'.webp'}}
   if(L.cl)e.style.clipPath=L.cl==='l'?'inset(0 50% 0 0)':'inset(0 0 0 50%)';
   if(L.mk)e.style.webkitMaskImage=e.style.maskImage=L.mk;if(L.mask)e.style.webkitMaskImage=e.style.maskImage='radial-gradient(closest-side,#000 70%,transparent 96%)'}
  else if(L.glow){e=document.createElement('div');var gc=tn?hsl(tn.h,.85,.7):L.glow;e.style.cssText='left:'+(L.x-L.w/2)+'%;width:'+L.w+'%;padding-bottom:'+L.w+'%;height:0;border-radius:50%;top:calc('+L.y+'% - '+(L.w/2)+'vw);background:radial-gradient(circle,'+gc+' 0%,'+gc+'88 30%,transparent 68%);mix-blend-mode:screen'}
  else if(L.fill){e=document.createElement('div');e.style.cssText='left:0;top:0;width:100%;height:100%;background:'+L.fill}
  else if(L.ring){e=document.createElement('div');e.style.cssText='left:50%;top:50%;width:100vw;height:100vw;margin:-50vw 0 0 -50vw;border-radius:50%;border:.6vw solid #ffe9b0;box-shadow:0 0 6vw #ffd27a'}
  e.style.position='absolute';e.style.zIndex=L.z||1;e.style.willChange='transform,opacity';if(L.bl)e.style.mixBlendMode=L.bl;if(L.org)e.style.transformOrigin=L.org;
  root.appendChild(e);els.push({e:e,L:L})}
 (def.L||[]).forEach(mk);
 if(def.env)envBuild(root,els,tn,mk);if(def.mirror)mirrorBuild(root,els,tn);
 root.appendChild(cv);
 function spawn(f,t){var n=f.n,i,c=f.c;for(i=0;i<n;i++){var p={x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,g:0,l:1,d:1,s:2+Math.random()*3,c:c[i%c.length],sh:'dot',r:Math.random()*6,vr:(Math.random()-.5)*6};
  switch(f.t){case 'dust':p.vy=-(8+Math.random()*14);p.vx=(Math.random()-.5)*10;p.d=3+Math.random()*3;p.tw=1;break;
  case 'fly':p.vy=-(4+Math.random()*8);p.vx=(Math.random()-.5)*14;p.d=4+Math.random()*3;p.tw=1;p.s=1.5+Math.random()*2;break;
  case 'embers':p.y=H*(.6+Math.random()*.5);p.vy=-(40+Math.random()*90);p.vx=(Math.random()-.5)*40;p.d=2+Math.random()*2.5;p.tw=1;break;
  case 'snow':p.y=-10;p.vy=40+Math.random()*60;p.vx=(Math.random()-.5)*30;p.d=7;p.s=1.5+Math.random()*3;break;
  case 'rain':p.y=-20;p.vy=900+Math.random()*500;p.vx=-120;p.d=1.2;p.sh='line';p.s=1;break;
  case 'confetti':p.x=W/2;p.y=H/2;var a=Math.random()*6.283,v=300+Math.random()*700;p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v-200;p.g=900;p.d=3+Math.random()*2;p.sh='rect';p.s=4+Math.random()*5;break;
  case 'burst':p.x=W/2;p.y=H*.5;var b=Math.random()*6.283,w=100+Math.random()*350;p.vx=Math.cos(b)*w;p.vy=Math.sin(b)*w;p.d=1.6;p.tw=1;break;
  case 'petals':p.y=f.a[0]>.3?H/2:-20;p.x=f.a[0]>.3?W/2:Math.random()*W;var q=Math.random()*6.283,u=f.a[0]>.3?120+Math.random()*420:20;p.vx=Math.cos(q)*u;p.vy=f.a[0]>.3?Math.sin(q)*u:40+Math.random()*50;p.g=f.a[0]>.3?60:0;p.d=4;p.sh='petal';p.s=5+Math.random()*6;break;
  case 'leaves':p.x=-30;p.y=Math.random()*H;p.vx=300+Math.random()*500;p.vy=(Math.random()-.5)*160;p.d=3;p.sh='petal';p.s=6+Math.random()*7;break;
  case 'spray':p.x=W*(.2+Math.random()*.6);p.y=H*.55;p.vy=-(200+Math.random()*400);p.vx=(Math.random()-.5)*160;p.g=700;p.d=1.6;p.s=1.5+Math.random()*2.5;break;
  case 'warp':p.x=W/2;p.y=H/2;var z=Math.random()*6.283;p.vx=Math.cos(z);p.vy=Math.sin(z);p.sh='warp';p.d=1.4;p.s=0;p.sp=0;break}
  p.max=p.d;p.f=f.t;p.im=f.img;pt.push(p)}}
 function draw(t,dt){cx.clearRect(0,0,W,H);(def.F||[]).forEach(function(f,i){var span=f.a[1]-f.a[0];
   if(f.t==='confetti'||f.t==='burst'||(f.t==='petals'&&f.a[0]>.3)){if(t>=f.a[0]&&!spawned[i]){spawned[i]=1;spawn(f,t)}}
   else if(t>=f.a[0]&&t<=f.a[1]){var rate=f.n/(def.ms/1000*span);spawned[i]=(spawned[i]||0)+rate*dt;while(spawned[i]>=1){spawned[i]--;spawn({t:f.t,n:1,c:f.c,a:f.a},t)}}});
  for(var i=pt.length-1;i>=0;i--){var p=pt[i];p.l-=dt/p.d;if(p.l<=0){pt.splice(i,1);continue}
   if(p.sh==='warp'){p.sp+=dt*(260+t*900);p.x+=p.vx*p.sp*dt;p.y+=p.vy*p.sp*dt;cx.strokeStyle=p.c;cx.globalAlpha=Math.min(1,p.l*1.2);cx.lineWidth=1.2;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.vx*p.sp*.06,p.y-p.vy*p.sp*.06);cx.stroke();continue}
   p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;var al=Math.min(1,p.l*3)*(p.tw?.5+.5*Math.sin(p.r*3):1);cx.globalAlpha=Math.max(0,al);cx.fillStyle=p.c;
   if(p.sh==='dot'){cx.shadowColor=p.c;cx.shadowBlur=p.s*3;cx.beginPath();cx.arc(p.x,p.y,p.s,0,6.283);cx.fill();cx.shadowBlur=0}
   else if(p.sh==='line'){cx.strokeStyle=p.c;cx.globalAlpha=.35;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x+p.vx*.03,p.y-p.vy*.03);cx.stroke()}
   else if(p.sh==='rect'){cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.scale(1,Math.abs(Math.sin(p.r*2))+.2);cx.fillRect(-p.s,-p.s/2,p.s*2,p.s);cx.restore()}
   else if(p.im&&PI.complete&&PI.naturalWidth){cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.scale(1,.6+.4*Math.sin(p.r*1.7));var pw=p.s*5;cx.drawImage(PI,-pw/2,-pw*PI.height/PI.width/2,pw,pw*PI.height/PI.width);cx.restore()}
   else{cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.scale(1,.55+.45*Math.sin(p.r*1.7));cx.beginPath();cx.ellipse(0,0,p.s*1.5,p.s,0,0,6.283);cx.fill();cx.restore()}}cx.globalAlpha=1}
 function render(t,dt,idle){
  els.forEach(function(E){var L=E.L,K=kf(L.k,t),e=E.e,tr='';
   if(L.sh){}
   var x=K.x,y=K.y;if(L.rep){var off=idle?0:(performance.now()/1000*(L.spd||60))%100;e.style.backgroundPositionY=(off/100*H)+'px'}
   if(E.dyn){E.dyn(t,K,e);return}
   e.style.opacity=K.o;
   tr='translate('+(x*W/100).toFixed(1)+'px,'+(y*H/100).toFixed(1)+'px) ';
   if(K.ry)tr='perspective(1500px) '+tr+'rotateY('+K.ry.toFixed(1)+'deg) ';
   tr+='rotate('+K.r.toFixed(1)+'deg) scale('+((L.fx?-1:1)*K.s*K.sx).toFixed(3)+','+K.s.toFixed(3)+')';e.style.transform=tr;
   var f=(L.f||'');if(K.br!==1)f+=' brightness('+K.br.toFixed(2)+')';if(K.bl)f+=' blur('+K.bl+'px)';if(L.th!=null&&tn)f+=' hue-rotate('+th(L.th)+'deg) saturate(1.1)';e.style.filter=f||'none';
   if(L.i&&K.ci)e.style.clipPath='inset(0 '+K.ci+'% 0 '+K.ci+'%)';else if(L.i&&!L.cl&&L.i==='parch')e.style.clipPath='none'});
  var fa=def.fade||.9,fo=t<fa?1:1-sm((t-fa)/(1-fa));root.style.opacity=fo;
  if(def.shake&&t>def.shake[0]&&t<def.shake[1])root.style.transform='translate('+((Math.random()-.5)*8)+'px,'+((Math.random()-.5)*6)+'px)';else root.style.transform='none';
  draw(t,dt)}
 return {el:root,render:render,size:size}}
/* envelope: body w/ cut flap, lining, rising card, flap with seal */
function envBuild(root,els,tn,mk){var tri='polygon(0 0,100% 0,50% 56%)',body='polygon(0 0,50% 56%,100% 0,100% 100%,0 100%)';
 var base={x:50,y:56,w:84,th:40};
 [{fill:'radial-gradient(circle at 50% 45%,#3a2418,#0b0604)',z:0},
 {fill:'linear-gradient(#f3e6cb,#e3cf9f)',x:50,y:40,w:70,h:36,z:1,card:1,k:[[0,{o:0,y:6}],[.45,{o:0,y:6}],[.5,{o:1,y:6}],[.82,{y:-34,s:1.5,o:1}]]},
 {i:'letter',x:50,y:56,w:84,z:2,clip:body,th:40,k:[[0,{o:1,s:1}],[.8,{s:1.02,o:1}],[.9,{o:0}]]},
 {i:'letter',x:50,y:56,w:84,z:4,clip:tri,org:'50% 0%',flap:1,th:40,k:[[0,{o:1,s:1}],[.25,{ry:0}],[.5,{ry:-175}]]}].forEach(function(L){mk(L)});
 var n=els.length;var cd=els[n-3].e;cd.style.left='15%';cd.style.top='22%';cd.style.width='70%';cd.style.height='36%';cd.style.borderRadius='6px';els[n-2].e.style.clipPath=body;els[n-1].e.style.clipPath=tri;els[n-1].e.style.backfaceVisibility='hidden';
 [n-2,n-1].forEach(function(i){var e=els[i].e;var im=new Image();im.onload=function(){var h=84/100*innerWidth*im.height/im.width/innerHeight*100;e.style.height=h+'%';e.style.top=(56-h/2)+'%';if(i===n-1)e.style.transformOrigin='50% 0%'};im.src=B+'letter.webp'})}
function mirrorBuild(root,els,tn){var D2={fill:'#050403',z:0},
 g={dyn:1};
 var gl=document.createElement('div');gl.style.cssText='position:absolute;z-index:1;left:50%;top:50%;width:52vw;height:72vh;margin:-36vh 0 0 -26vw;border-radius:26vw 26vw 2vw 2vw;overflow:hidden;background:linear-gradient(160deg,#dfe7ee,#9fb3c6 45%,#cfd9e2)';
 var sw=document.createElement('div');sw.style.cssText='position:absolute;inset:-20% -60%;background:linear-gradient(105deg,transparent 40%,rgba(255,250,230,.95) 50%,transparent 60%)';gl.appendChild(sw);
 var bg=document.createElement('div');bg.style.cssText='position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,#2a1f14,#050403);z-index:0';root.appendChild(bg);root.appendChild(gl);
 var fr=document.createElement('div');fr.style.cssText='position:absolute;z-index:3;left:50%;top:50%;width:80%;height:100%;margin:0;background:url('+B+'mirror.webp) center/contain no-repeat;transform-origin:50% 50%';root.appendChild(fr);
 var wh=document.createElement('div');wh.style.cssText='position:absolute;inset:0;z-index:4;background:#fff8e0;opacity:0';root.appendChild(wh);
 els.push({e:gl,L:{k:[[0,{o:1}]]},dyn:function(t,K,e){sw.style.transform='translateX('+(-60+t*140)+'%)';e.style.transform='scale('+(1+sm((t-.45)/.45)*4.2)+')';e.style.opacity=1}},{e:fr,L:{k:[[0,{o:1}]]},dyn:function(t,K,e){var s=1+sm((t-.45)/.45)*4.2;e.style.transform='translate(-50%,-50%) scale('+s+')';e.style.opacity=1}},{e:wh,L:{k:[[0,{o:1}]]},dyn:function(t,K,e){e.style.opacity=sm((t-.72)/.2)}});
 if(tn){fr.style.filter='hue-rotate('+(tn.h-42)+'deg)'}
 var im=new Image();im.onload=function(){fr.style.height='84%';fr.style.width=(.84*innerHeight*im.width/im.height)+'px';fr.style.left='50%'};im.src=B+'mirror.webp'}
/* ---------- wiring ---------- */
var names={'arch-reveal':'Floral Arch','palace-doors':'Palace Doors','luxury-letter':'Luxury Letter','diya-reveal':'Diya','gift-box':'Gift Box'};
function patchList(){var arr=P.OPENINGS;if(!arr||arr.__rx)return;arr.__rx=1;
 for(var i=arr.length-1;i>=0;i--){var o=arr[i];if(A[o.id]){arr.splice(i,1);continue}if(D[o.id]){o.ms=D[o.id].ms;if(names[o.id])o.name=names[o.id]}}}
patchList();
try{if(typeof openingSets!=='undefined')Object.keys(openingSets).forEach(function(k){var seen={},o=[];openingSets[k].forEach(function(id){id=A[id]||id;if(!seen[id]&&P.OPENINGS.some(function(x){return x.id===id})){seen[id]=1;o.push(id)}});if(o.length)openingSets[k]=o})}catch(e){}
var po=P.open;P.open=function(d,opt){d=d||{};if(A[d.opening])d.opening=A[d.opening];var r=po.apply(this,arguments);try{attach(d)}catch(x){}return r};
function attach(d){var id=d.opening;if(!D[id])return;var els=document.querySelectorAll('.up .op[data-op="'+id+'"]'),opEl=els[els.length-1];if(!opEl)return;
 var tn=(d.tintAmt>0&&d.color&&/^#[0-9a-f]{6}$/i.test(d.color))?{h:h2(d.color)[0]}:null;var op=P.opById(id),inst=null,t0=0,go=false,raf=0;
 function mount(){if(opEl.querySelector('.rxo'))return;opEl.innerHTML='';inst=build(op,d,tn);opEl.style.background='transparent';opEl.appendChild(inst.el)}
 function loop(now){if(!opEl.isConnected){cancelAnimationFrame(raf);return}raf=requestAnimationFrame(loop);var dt=Math.min(.05,(now-(loop.l||now))/1000);loop.l=now;
  if(!inst)return;var t=go?Math.min(1,(now-t0)/D[id].ms):0;if(typeof window.__opT==='number')t=window.__opT;inst.render(t,dt,!go&&typeof window.__opT!=='number')}
 mount();new MutationObserver(function(){if(!opEl.querySelector('.rxo')){inst=null;mount()}var g=opEl.classList.contains('go');if(g&&!go){go=true;t0=performance.now()}else if(!g&&go){go=false}}).observe(opEl,{attributes:true,attributeFilter:['class'],childList:true});
 addEventListener('resize',function(){if(inst)inst.size()});raf=requestAnimationFrame(loop)}
window.UtsavlyOpenings={ids:Object.keys(D),alias:A};
})();
