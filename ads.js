/* UTSAVLY ads: no ads on shared invitation URLs, editor overlays, or before configuration. */
(function(){
  var cfg=window.UTSAVLY_ADS||{};
  var path=location.pathname||'/';
  var isInvitation=/^\/i\//i.test(path)||new URLSearchParams(location.search).has('i');
  var wrap=document.getElementById('utsavlyAdWrap');
  var slot=document.getElementById('utsavlyAdSlot');
  if(!wrap||!slot||isInvitation||cfg.enabled!==true||!/^ca-pub-\d{16}$/.test(cfg.publisherId||'')||!/^\d+$/.test(cfg.homePageSlotId||''))return;
  wrap.hidden=false;
  slot.setAttribute('data-ad-client',cfg.publisherId);
  slot.setAttribute('data-ad-slot',cfg.homePageSlotId);
  var script=document.createElement('script');
  script.async=true;
  script.crossOrigin='anonymous';
  script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(cfg.publisherId);
  script.onload=function(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}};
  script.onerror=function(){wrap.hidden=true};
  document.head.appendChild(script);
})();
