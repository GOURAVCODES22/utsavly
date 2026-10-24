(function(){
  // Add your real GA4 Measurement ID here, e.g. G-ABC1234567.
  // Never put an API secret in this file.
  var MEASUREMENT_ID = window.UTSAVLY_GA4_ID || "";
  if(MEASUREMENT_ID && /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID)){
    var s=document.createElement("script");
    s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments)};
    gtag("js",new Date());
    gtag("config",MEASUREMENT_ID,{send_page_view:true});
  }
  window.UtsavlyAnalytics={event:function(name,params){
    if(typeof window.gtag==="function") window.gtag("event",name,params||{});
    try{const key="utsavly-events";const a=JSON.parse(localStorage.getItem(key)||"[]");a.push({name,params:params||{},at:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(a.slice(-100)));}catch(e){}
  }};
})();
