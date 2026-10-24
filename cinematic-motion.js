(function(){
  'use strict';
  var reduced=false;
  try{reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
  function start(){
    var hero=document.querySelector('.heroCard');
    if(!hero)return;
    document.documentElement.classList.add('motion-ready');
    if(reduced)return;
    if(window.gsap){
      try{
        if(window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger)}
        var title=hero.querySelector('h1');
        var eyebrow=hero.querySelector('.eyebrow');
        var lead=hero.querySelector('.lead');
        var actions=hero.querySelector('.actions');
        var meta=hero.querySelector('.heroMeta');
        var tl=gsap.timeline({defaults:{ease:'power3.out'}});
        if(eyebrow)tl.from(eyebrow,{y:18,opacity:0,duration:.65});
        if(title)tl.from(title,{y:38,opacity:0,filter:'blur(10px)',duration:1.05},'-=.25');
        if(title){var em=title.querySelector('em');if(em)tl.fromTo(em,{textShadow:'0 0 0 rgba(216,189,131,0)'},{textShadow:'0 0 28px rgba(216,189,131,.34)',duration:1.15},'-=.55')}
        if(lead)tl.from(lead,{y:20,opacity:0,duration:.7},'-=.55');
        if(actions)tl.from(actions,{y:16,opacity:0,duration:.6},'-=.4');
        if(meta)tl.from(meta.children,{y:12,opacity:0,stagger:.1,duration:.45},'-=.35');
        if(window.ScrollTrigger){
          document.querySelectorAll('main section:not(.hero) .sectionIntro, .builderInfo, .stickyTitle, .share>div, .creatorIdentity>div, .customGrid article, .reviewDemo, .opening').forEach(function(el){
            gsap.fromTo(el,{y:24,opacity:0},{y:0,opacity:1,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true},clearProps:'transform'});
          });
          document.querySelectorAll('.sectionIntro h2 em, .stickyTitle h2 em, .hero h1 em').forEach(function(el){
            gsap.to(el,{textShadow:'0 0 22px rgba(216,189,131,.24)',duration:2.2,yoyo:true,repeat:-1,ease:'sine.inOut'});
          });
        }
      }catch(e){document.documentElement.classList.add('motion-fallback')}
    } else {document.documentElement.classList.add('motion-fallback')}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
