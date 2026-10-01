const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const track=(name,params={})=>window.UtsavlyAnalytics?.event(name,params);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Theme is initialized first so one optional feature can never prevent the top toggle from working.
function setTheme(mode){
  const isDark=mode==='dark';
  document.documentElement.classList.toggle('dark',isDark);
  if(document.body) document.body.classList.toggle('dark',isDark);
  try{localStorage.setItem('utsavly-theme',isDark?'dark':'light')}catch(e){}
  const toggle=document.querySelector('#themeToggle');
  if(toggle){
    toggle.textContent=isDark?'☀':'☾';
    toggle.setAttribute('aria-label',isDark?'Switch to light mode':'Switch to dark mode');
    toggle.setAttribute('title',isDark?'Switch to light mode':'Switch to dark mode');
  }
}
function initTheme(){
  let saved='light';
  try{saved=localStorage.getItem('utsavly-theme')||'light'}catch(e){}
  setTheme(saved);
  const toggle=document.querySelector('#themeToggle');
  if(toggle && !toggle.dataset.bound){
    toggle.dataset.bound='1';
    toggle.addEventListener('click',()=>{
      const next=document.documentElement.classList.contains('dark')?'light':'dark';
      setTheme(next);
      track('theme_toggle',{theme:next});
    });
  }
}
initTheme();

const categories=[
  ['💍','Wedding & Family','Wedding, engagement, mehndi, haldi, sangeet & reception','Wedding'],
  ['🎂','Birthday & Personal','Birthdays, anniversaries, milestones & personal celebrations','Birthday'],
  ['☾','Muslim Celebrations','Eid, Nikah, Walima, Qawwali & family gatherings','Muslim'],
  ['🪔','Hindu & Traditional','Puja, Jagran, Diwali, Griha Pravesh & ceremonies','Hindu'],
  ['☬','Sikh Celebrations','Guru Purab, Anand Karaj & Punjabi celebrations','Sikh'],
  ['✝','Christian Celebrations','Weddings, baptisms, church & family celebrations','Christian'],
  ['🎄','Christmas & Holidays','Christmas, New Year & seasonal celebrations','Christmas'],
  ['👶','Baby Shower','Dreamy, soft, floral & storybook celebrations','Baby'],
  ['🎓','Graduation','Editorial, academic, bold & modern celebrations','Graduation'],
  ['🏡','Housewarming','Griha Pravesh, new home & family blessings','Housewarming'],
  ['🌿','Mehndi & Haldi','Henna, marigold, colour & pre-wedding celebrations','Mehndi'],
  ['🎶','Sangeet & Qawwali','Music, rhythm, heritage & festive evenings','Music'],
  ['🕯️','Puja & Jagran','Devotional, temple-inspired & spiritual gatherings','Jagran'],
  ['🎉','Festival Celebrations','Diwali, Holi, Navratri, Eid & cultural festivals','Festival'],
  ['💼','Corporate & Launch','Business events, launches, dinners & professional occasions','Corporate']
];

const cards=[
  // Wedding
  ['Wedding','Floral Garden','theme-garden','❀','Cascading florals, botanical frame & soft ivory','FREE'],
  ['Wedding','Royal Indian','theme-maroon','✦','Handcrafted royal border, deep maroon & antique gold','FREE'],
  ['Wedding','Mughal Heritage','theme-heritage','❈','Arch-inspired heritage geometry & champagne gold','FREE'],
  ['Wedding','Blush Romance','theme-blush','♡','Watercolour blooms, blush paper & romantic script','FREE'],
  ['Wedding','Sage & Champagne','theme-sage','❦','Botanical leaves, sage paper & champagne details','FREE'],
  ['Wedding','Ivory Monogram','theme-ivory','◇','Editorial ivory, monogram frame & fine linework','FREE'],
  ['Wedding','Celestial Love','theme-midnight','☾','Night sky, stars & elegant celestial typography','FREE'],
  ['Wedding','Rajasthani Heritage','theme-rajasthani','◈','Royal pattern, warm red, saffron & gold','FREE'],
  ['Wedding','Embossed Gold Palace','theme-embossed','✦','3D embossed floral metalwork, antique gold relief & jewel detailing','FREE'],
  ['Wedding','Royal Doorway','theme-doorway','▣','Architectural carved doors, warm lamps, flowers & cinematic depth','FREE'],
  // Birthday — each design is a different visual world, not a recolour
  ['Birthday','Royal Princess Cameo','theme-birthday-cameo','♕','Pearls, sculpted flowers, cameo portrait frame, crown and champagne ornamentation','FREE'],
  ['Birthday','Royal Ornate Frame','theme-birthday-frame','✦','Grand 3D carved frame, metallic corners, crown crest and gallery-style typography','FREE'],
  ['Birthday','Pearl & Blush Palace','theme-birthday-pearl','❀','Blush silk, pearl clusters, ribbon bow and soft rose relief','FREE'],
  ['Birthday','Crystal Celebration','theme-birthday-crystal','◇','Champagne crystal facets, luminous gems and glass-like highlights','FREE'],
  ['Birthday','Golden Birthday Stage','theme-birthday-stage','✦','Cinematic stage, warm spotlights, floral plinth and luxury name reveal','FREE'],
  ['Birthday','Royal Gift Reveal','theme-birthday-gift','▣','A sculpted gift box, ribbon, glow and layered surprise reveal','FREE'],
  ['Birthday','Floral Embossed','theme-birthday-floral','❦','Raised botanical flowers, ornamental border and elegant engraved type','FREE'],
  ['Birthday','Vintage Mirror','theme-birthday-mirror','◈','Antique mirror, aged gold frame, reflections and editorial lettering','FREE'],
  ['Birthday','Butterfly Garden','theme-birthday-butterfly','🦋','Dimensional butterflies, garden florals, pearl dust and soft light','FREE'],
  ['Birthday','Rose Palace','theme-birthday-rose','🌹','Sculpted roses, burgundy silk, antique gold and romantic luxury','FREE'],
  ['Birthday','Lavender Jewel','theme-birthday-lavender','✧','Lavender velvet, silver-gold filigree, crystals and dreamy glow','FREE'],
  ['Birthday','Midnight Luxury','theme-birthday-midnight','★','Deep midnight blue, gold stars, velvet depth and cinematic light','FREE'],
  ['Birthday','Fairytale Celebration','theme-birthday-fairytale','♛','Storybook palace, floating lights, flowers and whimsical depth','FREE'],
  ['Birthday','Editorial Photo Luxe','theme-birthday-editorial','▤','Magazine-inspired photo frame, fine borders and premium typography','FREE'],
  ['Birthday','Color Pop Couture','theme-pop','✦','Sculptural colour blocks, playful confetti and modern fashion-editorial energy','FREE'],
  ['Birthday','Disco Chrome','theme-retro','◉','Chrome reflections, disco lights and polished party typography','FREE'],
  // Muslim
  ['Muslim','Emerald & Gold','theme-emerald','☾','Emerald arch, geometric detail & gold illumination','FREE'],
  ['Muslim','Navy Crescent','theme-navy','☪','Navy night, crescent moon & refined gold geometry','FREE'],
  ['Muslim','Ivory Nikah','theme-whitegold','۞','Ivory arch, delicate floral linework & gold','FREE'],
  ['Muslim','Burgundy Walima','theme-burgundy','✦','Burgundy velvet mood, arches & champagne gold','FREE'],
  ['Muslim','Sage Islamic','theme-sage','❈','Sage botanical pattern with subtle Islamic geometry','FREE'],
  ['Muslim','Mughal Qawwali','theme-heritage','❖','Heritage arch, ornamental border & musical elegance','FREE'],
  ['Muslim','Lantern Night','theme-midnight','🏮','Lantern glow, stars & cinematic night ambience','FREE'],
  ['Muslim','Ivory Nikah Envelope','theme-envelope','✉','Soft ivory paper, wax-seal envelope, delicate florals & champagne gold','FREE'],
  ['Muslim','Moonlit Arch','theme-moonarch','☾','Deep midnight arch, crescent light, mosque silhouette & warm glow','FREE'],
  // Hindu / Traditional — temple and fort architecture worlds
  ['Hindu','Temple Grandeur','theme-temple-grand','🛕','Carved temple gateway, brass details, diya glow and ceremonial depth','FREE'],
  ['Hindu','Royal Fort Palace','theme-fort-palace','♜','Historic fort gates, sandstone relief, royal arches and warm palace light','FREE'],
  // Hindu
  ['Hindu','Maroon & Gold','theme-maroon','ॐ','Ceremonial red, gold border & traditional motifs','FREE'],
  ['Hindu','Mandala Ivory','theme-ivory','✺','Fine mandala, ivory paper & sacred geometry','FREE'],
  ['Hindu','Temple Heritage','theme-temple','🛕','Temple-inspired frame, warm saffron & gold','FREE'],
  ['Hindu','Lotus Ceremony','theme-lotus','🪷','Lotus illustration, warm blush & ceremonial details','FREE'],
  ['Hindu','Marigold Celebration','theme-marigold','✿','Marigold garlands, saffron glow & festive borders','FREE'],
  ['Hindu','Royal Rajasthani','theme-rajasthani','◈','Painted heritage mood, jewel tones & ornate border','FREE'],
  // Sikh
  ['Sikh','Royal Blue & Gold','theme-blue','☬','Deep blue, gold linework & elegant Punjabi heritage','FREE'],
  ['Sikh','Ivory Anand Karaj','theme-whitegold','✦','Ivory paper, refined gold & architectural framing','FREE'],
  ['Sikh','Saffron Heritage','theme-marigold','☬','Saffron, warm ivory & Punjabi ornamental pattern','FREE'],
  ['Sikh','Deep Maroon Punjabi','theme-burgundy','❈','Maroon, floral Punjabi pattern & gold detailing','FREE'],
  // Christian
  ['Christian','White & Gold','theme-whitegold','✝','Clean ivory, gold linework & graceful typography','FREE'],
  ['Christian','Garden Church','theme-garden','❦','Botanical garden wedding with soft editorial type','FREE'],
  ['Christian','Sage Romance','theme-sage','♡','Sage foliage, ivory paper & romantic details','FREE'],
  ['Christian','Blush Watercolor','theme-blush','✿','Watercolour florals and soft romantic composition','FREE'],
  // Christmas
  ['Christmas','Forest & Gold','theme-forest','✦','Pine, forest green, warm gold & winter glow','FREE'],
  ['Christmas','Burgundy Christmas','theme-burgundy','❄','Burgundy, cream, ornaments & festive elegance','FREE'],
  ['Christmas','Snowy Ivory','theme-snow','❄','Snowfall, ivory paper & frosted winter details','FREE'],
  ['Christmas','Winter Night','theme-winter','✧','Blue winter sky, stars and cinematic snow mood','FREE'],
  // Baby
  ['Baby','Dreamy Cloud','theme-pastel','☁','Clouds, soft lavender & storybook atmosphere','FREE'],
  ['Baby','Butterfly Garden','theme-garden','🦋','Botanical leaves, butterflies & gentle pastels','FREE'],
  ['Baby','Little Bloom','theme-blush','✿','Soft blooms, warm blush & delicate lettering','FREE'],
  // Graduation
  ['Graduation','Modern Editorial','theme-editorial','▰','Editorial typography, academic lines & clean layout','FREE'],
  ['Graduation','Midnight Achievement','theme-midnight','✦','Deep navy-violet, gold stars & achievement mood','FREE'],
  ['Graduation','Classic Ivory','theme-whitegold','🎓','Elegant ivory, fine border & timeless type','FREE'],
  // Housewarming
  ['Housewarming','Warm Home','theme-champagne','⌂','Warm neutral palette, home linework & botanicals','FREE'],
  ['Housewarming','Griha Pravesh','theme-temple','🪔','Saffron, marigold and ceremonial doorway details','FREE'],
  ['Housewarming','Botanical Home','theme-garden','❦','Greenery, architecture sketch & natural palette','FREE'],
  // Mehndi/Music/Jagran/Festival/Corporate
  ['Mehndi','Henna Garden','theme-marigold','❀','Henna-inspired florals, bright accents & festive energy','FREE'],
  ['Mehndi','Sunlit Haldi','theme-lotus','☀','Golden yellow, marigold blooms & sunlight mood','FREE'],
  ['Music','Qawwali Heritage','theme-heritage','♪','Mughal-inspired arches, rich gold & musical mood','FREE'],
  ['Music','Sangeet Lights','theme-pop','♫','Festive light trails, colour and rhythm','FREE'],
  ['Jagran','Jai Mata Di','theme-maroon','🪔','Devotional red, diya glow, floral border & temple mood','FREE'],
  ['Jagran','Divine Light','theme-heritage','✦','Warm golden light, sacred geometry & calm composition','FREE'],
  ['Festival','Diya Celebration','theme-marigold','🪔','Diya glow, rangoli-inspired geometry & gold','FREE'],
  ['Festival','Navratri Heritage','theme-maroon','✦','Festive red, ornamental border & ceremonial energy','FREE'],
  ['Festival','Midnight Mandala','theme-mandala','✺','Deep indigo-violet field, fine mandala linework & subtle antique gold','FREE'],
  ['Corporate','Executive Glass','theme-editorial','◇','Clean editorial, glass-like panels & modern type','FREE'],
  ['Corporate','Luxury Launch','theme-navy','✦','Navy, champagne and premium launch-event styling','FREE']
];

const fonts=[
  ['Great Vibes','Wedding Script'],['Allura','Elegant Calligraphy'],['Alex Brush','Brush Calligraphy'],['Parisienne','Romantic Script'],['Cormorant Garamond','Classic Serif'],['Playfair Display','Luxury Serif'],['Libre Baskerville','Traditional Serif'],['Prata','Modern Luxury'],['Cinzel','Royal / Heritage'],['DM Serif Display','Editorial Display'],['Marcellus','Architectural Classic'],['Bodoni Moda','High Fashion'],['Cormorant SC','Ceremonial Small Caps'],['Raleway','Editorial Sans'],['DM Sans','Minimal Sans']
];

const openingSets={
  Wedding:[
    ['envelope','Luxury Envelope','A sealed invitation opens slowly, revealing the story beneath.','✉'],
    ['royal-door','Royal Palace Doors','Twin doors part with a warm gold light before the first scene.','▣'],
    ['curtain','Velvet Curtain','A soft theatre curtain reveals the celebration like a private premiere.','◫'],
    ['floral-unfold','Floral Unfold','Petals and botanical lines unfold around the names.','❀'],
    ['golden-light','Golden Light','A single beam of champagne light reveals the invitation word by word.','✦'],
    ['cinematic-camera','Cinematic Camera','A slow camera-style push moves from atmosphere into the couple story.','◉'],
    ['heritage-scroll','Heritage Scroll','A traditional scroll opens into a modern luxury wedding story.','❈'],
    ['liquid-glass','Liquid Glass','A translucent glass veil clears to reveal the first scene.','◇']
  ],
  Birthday:[
    ['gift-box','Royal Gift Reveal','A sculpted gift opens in layers; light spills out and reveals the birthday story.','▣'],
    ['cameo-unveil','Cameo Unveil','A royal frame assembles piece by piece before the name appears in the centre.','♕'],
    ['pearl-bloom','Pearl Bloom','Pearls and flowers drift into place, then the ribbon reveals the first scene.','❀'],
    ['crystal-shimmer','Crystal Shimmer','Crystal facets catch moving light while the invitation resolves through the reflections.','◇'],
    ['spotlight-stage','Golden Stage','Curtains part, a warm spotlight travels forward and the birthday title rises into view.','✦'],
    ['mirror-reveal','Vintage Mirror','A mirror catches the camera movement and turns a reflection into the first invitation scene.','◈'],
    ['rose-bloom','Rose Bloom','Sculpted roses open one by one around the name, creating a living floral frame.','🌹'],
    ['butterfly-bloom','Butterfly Garden','Butterflies cross the screen and settle into a luminous garden around the birthday details.','🦋'],
    ['lavender-jewel','Lavender Jewel','Jewelled particles form a lavender crest before the date and name appear.','✧'],
    ['midnight-stars','Midnight Stars','A velvet night sky opens with moving gold stars and a slow cinematic push-in.','★'],
    ['fairytale-palace','Fairytale Palace','A storybook palace emerges through mist, then transitions into the celebration.','♛'],
    ['editorial-cover','Editorial Cover','Typography and image panels slide into a luxury magazine-style opening.','▤'],
    ['disco-chrome','Disco Chrome','Chrome reflections sweep across the screen and ignite the party title.','◉'],
    ['color-couture','Color Couture','Sculptural colour ribbons move like fabric and reveal each opening word.','✦'],
    ['cinematic-story','Cinematic Story','A film-title opening transitions into the birthday narrative.','▶']
  ],
  Muslim:[
    ['crescent-reveal','Crescent Reveal','A crescent emerges from the night sky and opens the invitation.','☾'],
    ['lantern-glow','Lantern Glow','Lanterns illuminate the first words one by one.','🏮'],
    ['moonlight','Moonlight','Soft moonlight travels across an Islamic geometric frame.','☪'],
    ['arch-reveal','Arch Reveal','An elegant arch opens onto the celebration details.','⌂'],
    ['geometric-light','Geometric Light','A refined geometric pattern resolves into the first scene.','❖'],
    ['heritage-scroll','Heritage Scroll','A heritage scroll reveals the invitation with ornamental detail.','❈']
  ],
  Hindu:[
    ['fort-gates','Royal Fort Gates','Massive carved fort gates open through a deep 3D corridor of warm palace light.','♜'],
    ['diya-reveal','Diya Reveal','A diya glow expands into the first ceremonial scene.','🪔'],
    ['temple-doors','Temple Doors','Temple-inspired doors open into a warm golden invitation world.','🛕'],
    ['mandala-form','Mandala Formation','A mandala builds itself around the opening words.','✺'],
    ['marigold-fall','Marigold Unfold','Marigold petals drift into a festive ceremonial frame.','✿'],
    ['golden-aarti','Golden Light','A warm ritual glow reveals the invitation gradually.','✦'],
    ['heritage-painting','Heritage Painting','A traditional illustrated texture resolves into the story.','◈']
  ],
  Sikh:[
    ['golden-light','Golden Light','Warm gold light reveals the invitation with calm elegance.','✦'],
    ['heritage-arch','Heritage Arch','An architectural arch opens into the Anand Karaj story.','⌂'],
    ['scroll','Elegant Scroll','A refined scroll unfolds into the celebration.','❈'],
    ['blue-gold','Blue & Gold Reveal','Royal blue and gold layers separate to reveal each word.','☬'],
    ['floral-unfold','Floral Unfold','Punjabi-inspired floral linework grows around the names.','❀'],
    ['cinematic-camera','Cinematic Story','A slow cinematic reveal moves from atmosphere to details.','◉']
  ],
  Christian:[
    ['church-doors','Church Doors','Elegant doors open into a soft botanical celebration.','✝'],
    ['garden-bloom','Garden Bloom','Botanical lines bloom into the invitation.','❦'],
    ['golden-light','Golden Light','A warm beam reveals the names and message.','✦'],
    ['watercolor-wash','Watercolour Wash','A soft painted wash clears to reveal the first scene.','✿'],
    ['letter-reveal','Love Letter','A refined letter opens into the celebration story.','✉'],
    ['cinematic-camera','Cinematic Story','A film-like push-in begins the celebration.','◉']
  ],
  Christmas:[
    ['ornament-reveal','Ornament Reveal','A hanging ornament swings gently into the opening.','✦'],
    ['snowfall','Snowfall','Soft snowfall settles before the invitation appears.','❄'],
    ['lantern-glow','Christmas Lights','Warm lights guide the eye into the first scene.','✧'],
    ['winter-window','Winter Window','A frosted window clears to reveal the celebration.','□'],
    ['gift-box','Gift Box','A festive box opens into the holiday story.','▣'],
    ['cinematic-winter','Cinematic Winter','A slow winter camera move reveals the invitation.','◉']
  ],
  Baby:[
    ['cloud-dream','Dreamy Cloud','Soft clouds part to reveal a gentle storybook opening.','☁'],
    ['butterfly-bloom','Butterfly Bloom','Butterflies and flowers reveal the first words.','🦋'],
    ['ribbon-box','Ribbon & Box','A delicate ribbon opens the celebration like a keepsake.','🎀'],
    ['storybook','Storybook','A storybook page turns into the first scene.','▤'],
    ['soft-glow','Soft Glow','A dreamy glow reveals each word softly.','✦'],
    ['photo-reveal','Memory Reveal','A family-photo frame gently comes into focus.','▣']
  ],
  Graduation:[
    ['cap-rise','Cap & Light','A graduation cap silhouette rises into an editorial title.','🎓'],
    ['editorial-reveal','Editorial Reveal','Typography enters like a magazine cover story.','▰'],
    ['page-turn','Page Turn','A refined academic page turns into the celebration.','▤'],
    ['spotlight','Achievement Spotlight','A spotlight reveals the graduate name.','✦'],
    ['golden-line','Golden Line','A single line draws the first scene into existence.','—'],
    ['cinematic-camera','Cinematic Story','A subtle camera move begins the achievement story.','◉']
  ],
  Housewarming:[
    ['door-open','New Door','A beautiful doorway opens into the new-home celebration.','⌂'],
    ['lamp-glow','Warm Lamp','A warm home light reveals the first words.','🪔'],
    ['floral-bloom','Botanical Bloom','Greenery grows around the house story.','❦'],
    ['griha-pravesh','Ceremonial Entry','A ceremonial threshold opens into the invitation.','✦'],
    ['watercolor-home','Illustrated Home','A home illustration resolves into the story.','⌂'],
    ['cinematic-camera','Cinematic Home','A slow architectural camera reveal introduces the event.','◉']
  ],
  Mehndi:[
    ['henna-draw','Henna Draw','A henna-inspired line draws itself into the opening.','❀'],
    ['marigold-bloom','Marigold Bloom','Marigolds bloom into a sunlit festive scene.','✿'],
    ['color-splash','Colour Splash','Refined colour washes reveal the celebration.','✦'],
    ['dhol-beat','Rhythm Reveal','Decorative rhythm lines introduce the sangeet/haldi mood.','♫'],
    ['floral-unfold','Floral Unfold','Floral borders grow around the first scene.','❦'],
    ['cinematic-camera','Cinematic Story','A festive camera move starts the celebration.','◉']
  ],
  Music:[
    ['heritage-arch','Heritage Arch','A Mughal-inspired arch opens into the musical evening.','❖'],
    ['lamp-glow','Golden Stage','Warm stage light reveals the first words.','✦'],
    ['rhythm-lines','Rhythm Lines','Musical lines animate into the celebration story.','♫'],
    ['curtain','Velvet Curtain','A theatre curtain opens to the event.','◫'],
    ['qawwali-scroll','Qawwali Scroll','A heritage scroll reveals the musical gathering.','❈'],
    ['cinematic-camera','Cinematic Stage','A slow stage-camera reveal begins the night.','◉']
  ],
  Jagran:[
    ['jai-mata-di','Jai Mata Di','A diya and devotional glow open the invitation.','🪔'],
    ['temple-doors','Temple Doors','A temple-inspired doorway opens into the gathering.','🛕'],
    ['golden-light','Divine Light','Warm golden light reveals the sacred details.','✦'],
    ['mandala-form','Mandala Formation','A ceremonial mandala forms around the title.','✺'],
    ['floral-unfold','Floral Blessing','A devotional floral border unfolds gently.','❀'],
    ['heritage-scroll','Sacred Scroll','A traditional scroll opens into the event story.','❈']
  ],
  Festival:[
    ['diya-reveal','Diya Reveal','Rows of light build into the festival opening.','🪔'],
    ['rangoli-form','Rangoli Formation','A rangoli pattern draws itself beneath the title.','✺'],
    ['lantern-glow','Lantern Glow','Festive lanterns illuminate the story.','✧'],
    ['color-splash','Colour Celebration','A controlled colour reveal starts the festival.','✦'],
    ['moon-reveal','Moonlight','A soft celestial opening introduces the celebration.','☾'],
    ['cinematic-camera','Cinematic Festival','A slow camera sweep reveals the event.','◉']
  ],
  Corporate:[
    ['glass-reveal','Glass Reveal','A clean glass layer separates to reveal the event title.','◇'],
    ['editorial-reveal','Editorial Title','A premium editorial title sequence introduces the event.','▰'],
    ['light-trail','Light Trail','A restrained light trail draws the brand/event mark.','—'],
    ['architecture','Architectural Reveal','Architectural lines form the first scene.','⌂'],
    ['minimal-focus','Minimal Focus','A precise focus pull reveals the essential details.','◉'],
    ['cinematic-camera','Cinematic Camera','A polished camera move creates a launch-film feel.','▶']
  ]
};
const languages=['English','हिन्दी — Hindi','ਪੰਜਾਬੀ — Punjabi','ગુજરાતી — Gujarati','मराठी — Marathi','বাংলা — Bengali','தமிழ் — Tamil','తెలుగు — Telugu','ಕನ್ನಡ — Kannada','മലയാളം — Malayalam','اردو — Urdu','অসমীয়া — Assamese','ଓଡ଼ିଆ — Odia','नेपाली — Nepali','संस्कृतम् — Sanskrit','العربية — Arabic','Español — Spanish','Français — French','Deutsch — German','Italiano — Italian','Português — Portuguese'];

let activeCategory='Wedding', selectedCard=cards[0], selectedFont='Great Vibes', selectedColor='#B68B48', selectedFontColor='#252019', selectedOpening=openingSets.Wedding[0];
let selectedAudioUrl='';
let musicAudio=null, musicCtx=null, musicTimer=null;
let selectedMusic='festive';
let selectedMusicStart='throughout';

function categoryKey(name){return categories.find(c=>c[1]===name)?.[3]||'Wedding'}
function renderFilters(){const c=categories.find(x=>x[3]===activeCategory)||categories[0];$('#activeCategoryLabel').textContent=c[0]+' '+c[1];}
function renderCards(){
  const list=cards.filter(c=>c[0]===activeCategory);
  $('#cardGrid').innerHTML=list.map((c,i)=>`<article class="cardDesign" data-card-index="${cards.indexOf(c)}"><span class="badge">${c[5]}</span><div class="cardArt ${c[2]} motif-${c[1].toLowerCase().replace(/[^a-z0-9]+/g,'-')}"><i>${c[3]}</i><strong>Janu <span>♡</span> Janvi</strong><small>${esc(c[1])} · DIGITAL INVITATION</small><em>${esc(c[4])}</em></div><div class="cardBottom"><b>${esc(c[1])}</b><button class="selectCard">Select & Customize →</button></div></article>`).join('');
  $$('.selectCard').forEach(b=>b.onclick=e=>{const c=cards[Number(e.target.closest('.cardDesign').dataset.cardIndex)];selectCard(c)});
}
function selectCard(c){selectedCard=c;activeCategory=c[0];selectedOpening=(openingSets[c[0]]||openingSets.Wedding)[0];track('card_selected',{card:c[1],category:c[0]});openCustomizer()}
function languageKey(v){
  if(v.includes('Hindi')||v.includes('हिन्दी')) return 'hi';
  if(v.includes('Punjabi')||v.includes('ਪੰਜਾਬੀ')) return 'pa';
  if(v.includes('Gujarati')||v.includes('ગુજરાતી')) return 'gu';
  if(v.includes('Bengali')||v.includes('বাংলা')) return 'bn';
  if(v.includes('Marathi')||v.includes('मराठी')) return 'mr';
  if(v.includes('Tamil')||v.includes('தமிழ்')) return 'ta';
  if(v.includes('Telugu')||v.includes('తెలుగు')) return 'te';
  if(v.includes('Kannada')||v.includes('ಕನ್ನಡ')) return 'kn';
  if(v.includes('Malayalam')||v.includes('മലയാളം')) return 'ml';
  if(v.includes('Urdu')||v.includes('اردو')) return 'ur';
  if(v.includes('Arabic')||v.includes('العربية')) return 'ar';
  if(v.includes('Nepali')||v.includes('नेपाली')) return 'ne';
  if(v.includes('Sanskrit')||v.includes('संस्कृत')) return 'sa';
  return 'en';
}
const romanTokens={a:'अ',aa:'आ',i:'इ',ee:'ई',u:'उ',oo:'ऊ',e:'ए',ai:'ऐ',o:'ओ',au:'औ',k:'क',kh:'ख',g:'ग',gh:'घ',ng:'ङ',ch:'च',chh:'छ',j:'ज',jh:'झ',t:'त',th:'थ',d:'द',dh:'ध',n:'न',p:'प',ph:'फ',b:'ब',bh:'भ',m:'म',y:'य',r:'र',l:'ल',v:'व',w:'व',sh:'श',s:'स',h:'ह',f:'फ़',z:'ज़',q:'क़',x:'क्स',c:'क'};
const punjabiTokens={a:'ਅ',aa:'ਆ',i:'ਇ',ee:'ਈ',u:'ਉ',oo:'ਊ',e:'ਏ',ai:'ਐ',o:'ਓ',au:'ਔ',k:'ਕ',kh:'ਖ',g:'ਗ',gh:'ਘ',ng:'ਙ',ch:'ਚ',chh:'ਛ',j:'ਜ',jh:'ਝ',t:'ਤ',th:'ਥ',d:'ਦ',dh:'ਧ',n:'ਨ',p:'ਪ',ph:'ਫ',b:'ਬ',bh:'ਭ',m:'ਮ',y:'ਯ',r:'ਰ',l:'ਲ',v:'ਵ',w:'ਵ',sh:'ਸ਼',s:'ਸ',h:'ਹ',f:'ਫ',z:'ਜ਼'};
function transliterateWord(word,script){
  if(!/^[A-Za-z0-9]+$/.test(word)) return word;
  const map=script==='pa'?punjabiTokens:romanTokens; let out='',i=0,lower=word.toLowerCase();
  while(i<lower.length){let hit=null;for(const n of [3,2,1]){const part=lower.slice(i,i+n);if(map[part]){hit=part;break}}if(hit){out+=map[hit];i+=hit.length}else{out+=word[i];i++}}
  return out;
}
const commonHindiNames={janu:'जानु',janvi:'जानवी',gourav:'गौरव',gorav:'गोरव',priya:'प्रिया',aman:'अमन',rahul:'राहुल',simran:'सिमरन',arjun:'अर्जुन',ananya:'अनन्या',pooja:'पूजा',neha:'नेहा',rohit:'रोहित'};
const commonPunjabiNames={janu:'ਜਾਨੂ',janvi:'ਜਾਨਵੀ',gourav:'ਗੌਰਵ',gorav:'ਗੋਰਵ',priya:'ਪ੍ਰਿਆ',aman:'ਅਮਨ',rahul:'ਰਾਹੁਲ',simran:'ਸਿਮਰਨ',arjun:'ਅਰਜੁਨ',ananya:'ਅਨਨਿਆ',pooja:'ਪੂਜਾ',neha:'ਨੇਹਾ',rohit:'ਰੋਹਿਤ'};
function convertName(text,language){
  const key=languageKey(language); if(key==='en') return text;
  const dict=key==='pa'?commonPunjabiNames:commonHindiNames;
  if(['hi','mr','ne','sa'].includes(key)||key==='pa') return text.split(/([\s&♡-]+)/).map(x=>{const k=x.toLowerCase();return dict[k]||(/^[A-Za-z]/.test(x)?transliterateWord(x,key==='pa'?'pa':'hi'):x)}).join('');
  return text;
}
function openCustomizer(){
  const c=selectedCard;
  const palettes=[
    ['Ivory','#F7F0E3','#2A241C'],['Champagne','#D8B56A','#2B2115'],['Maroon','#5C1F25','#FFF3DE'],
    ['Emerald','#173D32','#FFF1C9'],['Navy','#162846','#FFF1C9'],['Midnight','#171526','#F5E8C9'],
    ['Blush','#E8C5C0','#4B2D2A'],['Lavender','#E8DFF0','#352A3D'],['Saffron','#D58A2C','#FFF3D4']
  ];
  const paletteHTML=palettes.map(([n,b,f])=>`<button type="button" class="swatch ${selectedColor.toLowerCase()===b.toLowerCase()?'active':''}" data-bg="${b}" data-fg="${f}" title="${n}"><span style="background:${b}"></span><small>${n}</small></button>`).join('');
  showModal(`<div class="customizer"><div class="modalEyebrow">SELECTED CARD · ${esc(c[0])}</div><h2>${esc(c[1])}</h2><div class="liveCard ${c[2]}" id="liveCard"><span class="liveMotif">${c[3]}</span><strong id="liveNames">Janu ♡ Janvi</strong><small>${esc(c[1])} · DIGITAL INVITATION</small><p id="liveLanguage">English</p></div><div class="customControls"><label>Your Names<input id="customNames" value="Janu ♡ Janvi" dir="auto" autocomplete="off" placeholder="अपना नाम लिखें / Write your names"></label><label>Language / Script<select id="customLanguage">${languages.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>Font Style<select id="customFont">${fonts.map(f=>`<option value="${esc(f[0])}">${esc(f[0])} — ${esc(f[1])}</option>`).join('')}</select></label><label>Card Colour<input id="customColor" type="color" value="${selectedColor}" aria-label="Choose card colour"></label><label>Font Colour<input id="customFontColor" type="color" value="${selectedFontColor}" aria-label="Choose font colour"></label><label>Exact Card HEX<input id="customHex" value="${selectedColor}" maxlength="7" inputmode="text" placeholder="#F7F0E3"></label></div><div class="paletteTitle">CARD PALETTES</div><div class="colorPresets">${paletteHTML}</div><div class="customizerActions"><button class="btn primary full" id="applyCustomization" type="button">Use This Card →</button></div><p class="muted">Type names normally in any supported script. Tap a palette or the colour square to change the live card instantly.</p></div>`);
  const live=$('#liveCard'), name=$('#customNames'), lang=$('#customLanguage'), font=$('#customFont'), color=$('#customColor'), fc=$('#customFontColor'), hex=$('#customHex');
  function validHex(v){return /^#[0-9a-fA-F]{6}$/.test(v)}
  function update(){
    selectedFont=font.value;
    selectedColor=color.value;
    selectedFontColor=fc.value;
    live.style.setProperty('--custom-bg',selectedColor);
    live.style.setProperty('--custom-fg',selectedFontColor);
    live.dataset.script=languageKey(lang.value);
    live.style.background=selectedColor;
    live.style.color=selectedFontColor;
    $('#liveNames').textContent=convertName(name.value||'Janu ♡ Janvi',lang.value);
    $('#liveNames').style.fontFamily=`'${selectedFont}', serif`;
    $('#liveNames').style.color=selectedFontColor;
    $('#liveLanguage').textContent=lang.value;
    if(document.activeElement!==hex) hex.value=selectedColor.toUpperCase();
    $$('.swatch').forEach(x=>x.classList.toggle('active',x.dataset.bg.toLowerCase()===selectedColor.toLowerCase()));
  }
  [name,lang,font,color,fc].forEach(x=>x.addEventListener('input',update));
  color.addEventListener('change',update); fc.addEventListener('change',update);
  hex.addEventListener('input',()=>{let v=hex.value.trim();if(!v.startsWith('#'))v='#'+v;if(validHex(v)){color.value=v;update()}});
  $$('.swatch').forEach(b=>b.onclick=()=>{color.value=b.dataset.bg;fc.value=b.dataset.fg;update()});
  const applyCustomization=$('#applyCustomization');
  if(applyCustomization) applyCustomization.onclick=()=>{
    closeModal();
    $('#names').value=convertName(name.value,lang.value);
    $('#language').value=lang.value;
    selectedColor=color.value;
    selectedFontColor=fc.value;
    track('card_customized',{card:c[1],font:selectedFont,color:selectedColor,fontColor:selectedFontColor});
    renderOpenings();
    (document.querySelector('.builder')||document.querySelector('.collection'))?.scrollIntoView({behavior:'smooth'});
  };
  update();
}

function renderOpenings(){
  const list=openingSets[activeCategory]||openingSets.Wedding;
  const host=$('#openings');
  if(!host)return;
  host.innerHTML=list.map((o,i)=>`<article class="openingCard ${selectedOpening?.[0]===o[0]?'selected':''}" data-opening-index="${i}"><div class="openingVisual opening-${esc(o[0])}"><span>${o[3]}</span><i></i><b>Janu <em>♡</em> Janvi</b><small>${esc(o[1])}</small></div><div class="openingInfo"><div><strong>${esc(o[1])}</strong><small>${esc(o[2])}</small></div><button class="btn ${selectedOpening?.[0]===o[0]?'primary':'soft'} selectOpening">${selectedOpening?.[0]===o[0]?'Selected ✓':'Choose opening →'}</button></div></article>`).join('');
  $$('#openings .selectOpening').forEach(btn=>btn.onclick=()=>{
    const i=Number(btn.closest('.openingCard').dataset.openingIndex); selectedOpening=list[i];
    track('opening_selected',{opening:selectedOpening[1],category:activeCategory}); renderOpenings();
    document.querySelector('.builder').scrollIntoView({behavior:'smooth'});
  });
}

function renderOccasionDrawer(){
  $('#catList').innerHTML=categories.map(c=>`<button class="cat"><span>${c[0]}</span><div><b>${esc(c[1])}</b><small>${esc(c[2])}</small></div></button>`).join('');
  $$('.cat').forEach((b,i)=>b.onclick=()=>{activeCategory=categories[i][3];selectedOpening=(openingSets[activeCategory]||openingSets.Wedding)[0];renderFilters();renderCards();renderOpenings();closeDrawer();document.querySelector('.collection').scrollIntoView({behavior:'smooth'});track('category_selected',{category:activeCategory})});
}
function showModal(html){$('#modalBody').innerHTML=html;$('#modal').classList.add('show');$('#modal').classList.remove('cinemaModal');$('#modal').setAttribute('aria-hidden','false')}
function closeModal(){stopInvitationMusic();$('#modal').classList.remove('show','cinemaModal');$('#modal').setAttribute('aria-hidden','true');$('.modalBox').classList.remove('cinemaBox')}
function closeDrawer(){$('#drawer').classList.remove('open');$('#drawer').setAttribute('aria-hidden','true');$('#scrim').classList.remove('show')}

const openDrawer=()=>{$('#drawer').classList.add('open');$('#drawer').setAttribute('aria-hidden','false');$('#scrim').classList.add('show');track('occasion_drawer_open')};
renderFilters();renderCards();renderOpenings();renderOccasionDrawer();
function renderOccasionSearch(q=''){const list=categories.filter(c=>c.slice(1,3).join(' ').toLowerCase().includes(q.toLowerCase()));$('#catList').innerHTML=list.map(c=>`<button class="cat" data-cat="${esc(c[3])}"><span>${c[0]}</span><div><b>${esc(c[1])}</b><small>${esc(c[2])}</small></div></button>`).join('');$$('#catList .cat').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;selectedOpening=(openingSets[activeCategory]||openingSets.Wedding)[0];renderFilters();renderCards();renderOpenings();closeDrawer();document.querySelector('.collection').scrollIntoView({behavior:'smooth'});track('category_selected',{category:activeCategory})})}
renderOccasionSearch();
$('#search').onfocus=openDrawer;$('#search').oninput=e=>renderOccasionSearch(e.target.value);
if ($('#catBtn')) $('#catBtn').onclick=openDrawer;
if ($('#openOccasions')) $('#openOccasions').onclick=openDrawer;
if ($('#changeCategory')) $('#changeCategory').onclick=openDrawer;
if ($('#closeCat')) $('#closeCat').onclick=closeDrawer;
if ($('#scrim')) $('#scrim').onclick=closeDrawer;
$('#createBtn').onclick=()=>{document.querySelector('.collection').scrollIntoView({behavior:'smooth'});track('create_invitation_click')};
if($('#footerCreate')) $('#footerCreate').addEventListener('click',()=>track('footer_create_click'));
$('#custom').onclick=()=>{showModal(`<div class="modalEyebrow">CREATE YOUR OWN OCCASION</div><h2>Your event.<br>Your rules.</h2><p>Choose a starting visual world, then customise its colours, fonts, names, language, scenes and content.</p><button class="btn primary" data-go>Start Creating →</button>`);$('#modalBody [data-go]').onclick=()=>{closeModal();document.querySelector('.collection').scrollIntoView({behavior:'smooth'});track('custom_occasion_start')}};
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))closeModal()});$('#closeModal').onclick=closeModal;
function effectLabel(k){return ({flowers:'Flower Rain',snow:'Snowfall',rain:'Rainfall',fire:'Fire Sparks',lightning:'Lightning Reveal',none:'A Quiet Transition'})[k]||'Flower Rain'}
function effectSubtitle(k){return ({flowers:'A soft shower of petals falls through the scene.',snow:'Elegant snow drifts across the screen in slow motion.',rain:'Cinematic rain passes through the light before the reveal.',fire:'Warm sparks and glowing embers rise around the frame.',lightning:'A dramatic flash illuminates the invitation before the names appear.',none:'A calm cinematic pause creates anticipation.'})[k]||'A cinematic transition builds anticipation.'}

function openCinematic(d){
  d=d||{};
  const safeCategory=d.category||activeCategory||'Wedding';
  const safeCards=cards.filter(c=>c[0]===safeCategory);
  const cardForInvite=(safeCards.find(c=>c[1]===d.card)||selectedCard||safeCards[0]||cards[0]);
  const openingsForInvite=openingSets[safeCategory]||openingSets.Wedding;
  const openingForInvite=(openingsForInvite.find(o=>o[0]===d.opening)||selectedOpening||openingsForInvite[0]);
  const inviteColor=d.color||selectedColor;
  const inviteFontColor=d.fontColor||selectedFontColor;
  const inviteFont=d.font||selectedFont;
  const scenes=[
    {k:'opening',ey:'THE BEGINNING',title:'A story begins.',body:`${openingForInvite?.[1]||'Luxury Opening'} · ${cardForInvite?.[1]||'Selected Card'}`,extra:'Tap to begin'},
    {k:'date',ey:'SAVE THE DATE',title:dateText(d.date)||'Your Special Date',body:d.time?`${d.time} · A day to remember`:'A day to remember',extra:'Date revealed · Swipe up for the names'},
    {k:'effect',ey:'A MOMENT BEFORE THE NAMES',title:effectLabel(d.revealEffect),body:effectSubtitle(d.revealEffect),extra:'Your chosen effect plays now'},
    {k:'names',ey:d.occasion||'THE CELEBRATION',title:d.names||'Janu & Janvi',body:'Together with their families',extra:'Names revealed · Swipe up to continue'},
    {k:'message',ey:'A NOTE FROM THE HEART',title:'Together with their families…',body:d.message||'We invite you to celebrate this beautiful beginning with us.',extra:'Swipe up for the celebration'},
    {k:'venue',ey:'THE PLACE',title:d.venue||'Your Venue',body:'The setting where memories become real.',extra:'Place revealed · Swipe up to continue'},
    {k:'events',ey:'THE CELEBRATION',title:'Your Celebration',body:'Each moment becomes its own chapter.',extra:'Swipe up for memories'},
    {k:'memory',ey:'MEMORIES',title:'A gallery of moments.',body:'Photos and videos can become part of the story.',extra:'Swipe up for the countdown'},
    {k:'countdown',ey:'UNTIL WE MEET',title:'The countdown begins.',body:'A live countdown will sit inside the final invitation.',extra:'Swipe up for RSVP'},
    {k:'rsvp',ey:'BE OUR GUEST',title:'Will you join us?',body:'RSVP · Wishes · Guest messages',extra:'Swipe up to finish'},
    {k:'closing',ey:'WITH LOVE',title:d.names||'Janu & Janvi',body:'We cannot wait to celebrate with you.',extra:'Create. Celebrate. Remember.'}
  ];

  const opening=openingForInvite?.[0]||'envelope';
  const effect=d.revealEffect||'flowers';
  const intensity=d.effectIntensity||'cinematic';
  const root=`<div class="cinemaExperience" data-opening="${esc(opening)}" data-effect="${esc(effect)}" data-intensity="${esc(intensity)}" data-card-theme="${esc(cardForInvite?.[2]||'theme-ivory')}" style="--cinema-accent:${esc(inviteColor)};--cinema-text:${esc(inviteFontColor)};--cinema-font:'${esc(inviteFont)}'" data-script="${esc(languageKey(d.language||'English'))}">
    <div class="cinemaTop"><span>UTSAVLY · CINEMATIC INVITATION</span><button class="cinemaClose" id="cinemaClose" aria-label="Close cinematic invitation">×</button></div>
    <div class="storyScroll" id="storyScroll">${scenes.map((s,i)=>`
      <section class="storyScene scene-${s.k} ${i===0?'activeScene':''}" data-index="${i}" aria-hidden="${i===0?'false':'true'}">
        ${i===0?`<div class="openingStage opening-stage-${esc(opening)}" aria-hidden="true"><div class="openingLayer openingLayerA"></div><div class="openingLayer openingLayerB"></div><div class="openingLayer openingLayerC"></div><div class="openingObject">${esc(openingForInvite?.[3]||'✦')}</div></div>`:''}
        ${s.k==='effect'?`<div class="revealEffectLayer effect-${esc(effect)} intensity-${esc(intensity)}" aria-hidden="true"><div class="effectParticles"></div><div class="effectFlash"></div></div>`:''}
        <div class="sceneContent">
          <div class="sceneOrnament">${esc(cardForInvite?.[3]||'✦')}</div>
          <p class="sceneEyebrow">${esc(s.ey)}</p><h2>${esc(s.title)}</h2><p class="sceneBody">${esc(s.body)}</p><span class="sceneExtra">${esc(s.extra)}</span>
          ${s.k==='closing'?`<div class="inviteEndCredit"><a href="https://www.instagram.com/codetocreation/" target="_blank" rel="noopener noreferrer">Designed &amp; Developed by Gorav Patyal</a><a href="/">Create Your Own Invitation →</a></div>`:''}
        </div>
        ${i<scenes.length-1?`<button class="sceneNext" type="button" data-next="${i+1}">${i===0?'Tap to Reveal Date':'Swipe / Tap to Continue'} <span>↓</span></button>`:`<div class="sceneSwipe">THE END</div>`}
      </section>`).join('')}</div>
  </div>`;

  showModal(root);
  $('#modal').classList.add('cinemaModal');
  const box=$('.modalBox'); if(box) box.classList.add('cinemaBox');
  $('#cinemaClose').onclick=closeModal;

  let musicStarted=false, current=0, openingStarted=false, advancing=false;
  const musicStartIndex=({opening:0,date:1,names:3,effect:2,venue:6,throughout:0}[d.musicStart||selectedMusicStart] ?? 0);
  const sc=$('#storyScroll'), sceneEls=$$('.storyScene');

  const startMusic=()=>{
    if(!musicStarted){
      musicStarted=true;
      playInvitationMusic(d.music||selectedMusic,d.audioUrl||selectedAudioUrl);
    }
  };

  const activate=(idx, userAction=false)=>{
    idx=Math.max(0,Math.min(sceneEls.length-1,idx));
    if(idx===current && !userAction) return;
    current=idx;
    sceneEls.forEach((el,i)=>{
      const active=i===idx;
      el.classList.toggle('activeScene',active);
      el.setAttribute('aria-hidden',String(!active));
    });
    if(sc) sc.scrollTop=0;

    if(userAction && idx>=musicStartIndex) startMusic();

    if(idx===0 && !openingStarted){
      openingStarted=true;
      sceneEls[0].classList.add('seen','opening-playing');
      setTimeout(()=>sceneEls[0].classList.add('opening-revealed'),1000);
    }

    if(idx===2){
      const effectEl=sceneEls[idx];
      effectEl.classList.remove('effect-playing','effect-complete');
      void effectEl.offsetWidth;
      effectEl.classList.add('effect-playing');
      setTimeout(()=>{
        effectEl.classList.add('effect-complete');
        if(current===2) activate(3,false);
      },1800);
    }
  };

  const next=()=>{ if(advancing || current>=sceneEls.length-1) return; startMusic(); advancing=true; activate(current+1,true); setTimeout(()=>advancing=false,450); };

  $$('.sceneNext').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation(); next();
  }));

  let touchY=0,touchX=0;
  sc.addEventListener('touchstart',e=>{
    const t=e.changedTouches[0]; touchY=t.clientY; touchX=t.clientX;
  },{passive:true});
  sc.addEventListener('touchend',e=>{
    const t=e.changedTouches[0],dy=touchY-t.clientY,dx=Math.abs(touchX-t.clientX);
    if(Math.abs(dy)>35 && Math.abs(dy)>dx*1.1){ e.preventDefault(); if(dy>0) next(); }
  },{passive:false});

  sc.addEventListener('wheel',e=>{
    e.preventDefault();
    if(Math.abs(e.deltaY)>12 && e.deltaY>0) next();
  },{passive:false});

  sc.addEventListener('click',e=>{
    if(e.target.closest('.cinemaClose,.sceneNext,.inviteEndCredit')) return;
    next();
  });

  activate(0,false);
  track('cinematic_open',{opening:openingForInvite?.[1],card:cardForInvite?.[1],effect});
}

$('#experienceBtn').onclick=()=>{track('demo_open');openCinematic({occasion:'Wedding Celebration',names:'Janu & Janvi',message:'Together with their families, we invite you to celebrate this beautiful beginning with us.',date:'2027-04-18',time:'19:00',venue:'The Grand Palace, Jammu',language:'English + Hindi',music:'romantic'});};

function getData(){return {occasion:$('#occasion').value.trim(),names:$('#names').value.trim(),message:$('#message').value.trim(),date:$('#date').value,time:$('#time').value,venue:$('#venue').value.trim(),language:$('#language').value.trim(),music:selectedMusic,audioUrl:selectedAudioUrl,musicStart:selectedMusicStart,revealEffect:$('#revealEffect')?.value||'flowers',effectIntensity:$('#effectIntensity')?.value||'cinematic',category:activeCategory,card:selectedCard?.[1]||'',cardTheme:selectedCard?.[2]||'',opening:selectedOpening?.[0]||'',font:selectedFont,color:selectedColor,fontColor:selectedFontColor}}
function dateText(d){if(!d)return 'Your special date';const dt=new Date(d+'T00:00:00');return dt.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
const musicChoice=$('#musicChoice'), musicFile=$('#musicFile'), musicUploadWrap=$('#musicUploadWrap'), musicStart=$('#musicStart');
if(musicChoice){musicChoice.value=selectedMusic; musicChoice.onchange=()=>{selectedMusic=musicChoice.value; musicUploadWrap.classList.toggle('hiddenField',selectedMusic!=='upload');};}
if(musicStart){musicStart.value=selectedMusicStart; musicStart.onchange=()=>{selectedMusicStart=musicStart.value;};}
if(musicFile){musicFile.onchange=()=>{const f=musicFile.files?.[0]; if(f){const max=2*1024*1024; if(f.size>max){alert('Please choose an audio file up to 2 MB for this prototype.'); musicFile.value=''; return;} const reader=new FileReader(); reader.onload=()=>{selectedAudioUrl=String(reader.result||''); selectedMusic='upload'; musicChoice.value='upload';}; reader.readAsDataURL(f);}};}

function stopInvitationMusic(){
  if(musicAudio){try{musicAudio.pause();musicAudio.currentTime=0}catch(e){}musicAudio=null;}
  if(musicTimer){clearInterval(musicTimer);musicTimer=null;}
  if(musicCtx){try{musicCtx.close()}catch(e){} musicCtx=null;}
}
function playInvitationMusic(kind,url){
  stopInvitationMusic();
  if(!kind||kind==='none')return;
  if(kind==='upload'&&url){
    musicAudio=new Audio(url); musicAudio.loop=true; musicAudio.volume=.7;
    musicAudio.play().catch(()=>{}); return;
  }
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
  musicCtx=new AC(); try{musicCtx.resume()}catch(e){}
  const master=musicCtx.createGain(); master.gain.value=.9;
  const comp=musicCtx.createDynamicsCompressor(); master.connect(comp); comp.connect(musicCtx.destination);
  const P={royal:[[220,277.18,329.63],[196,246.94,293.66],[174.61,220,261.63],[196,246.94,293.66]],romantic:[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]],festive:[[293.66,369.99,440],[329.63,392,493.88],[246.94,293.66,369.99],[293.66,369.99,440]],celestial:[[196,246.94,293.66],[174.61,220,261.63],[164.81,207.65,246.94],[196,246.94,293.66]]};
  const B=['birthday_happy','birthday_party','birthday_glow','birthday_royal','birthday_sweet','birthday_piano'];
  const chords=P[kind]||(B.includes(kind)?P.festive:P.royal); let n=0;
  const mel={birthday_happy:1,birthday_party:1,birthday_sweet:1};
  const tone=(f,t,d,type,v)=>{const o=musicCtx.createOscillator(),g=musicCtx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05)};
  const bar=()=>{const t=musicCtx.currentTime+.02,c=chords[n++%chords.length];
    c.forEach(f=>{tone(f,t,3.6,'sine',.16);tone(f*2,t,3.2,'triangle',.05)});
    tone(c[0]/2,t,3.8,'sine',.2);
    [0,.6,1.2,1.8,2.4].forEach((o,i)=>tone(c[i%3]*(mel[kind]?4:2),t+o,.9,'triangle',.07));};
  bar(); musicTimer=setInterval(bar,3000);
}

$('#preview').onclick=()=>{const d=getData();track('invitation_preview',{language:d.language,opening:d.opening});openCinematic(d)};
function invitationId(name){return (name||'invitation').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,32)||'invitation'}
function qrUrl(link,size=320){return 'https://api.qrserver.com/v1/create-qr-code/?size='+size+'x'+size+'&format=png&margin=10&data='+encodeURIComponent(link)}
function encodeInvitationData(d){try{const bytes=new TextEncoder().encode(JSON.stringify(d));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}catch(e){return ''}}
function decodeInvitationData(v){try{v=v.replace(/-/g,'+').replace(/_/g,'/');while(v.length%4)v+='=';const bin=atob(v);const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return JSON.parse(new TextDecoder().decode(bytes))}catch(e){return null}}
$('#publishDemo').onclick=()=>{const d=getData(),id=invitationId(d.names),linkData={...d,audioUrl:''},payload=encodeInvitationData(linkData),link=location.origin+'/i/'+encodeURIComponent(id)+'?d='+encodeURIComponent(payload);try{localStorage.setItem('utsavly-demo-'+id,JSON.stringify(d));}catch(e){}track('invitation_published',{occasion:d.occasion});showModal(`<div class="publish"><div class="modalEyebrow">PUBLISHED · DEMO MODE</div><h2>${esc(d.names||'Your Invitation')}</h2><p>Your current Vercel demo link is ready.</p><div class="linkBox"><input readonly value="${esc(link)}" id="generatedLink"><button id="copyLink">Copy</button></div><img class="qr" src="${qrUrl(link)}" alt="QR code for invitation link"><div class="publishActions"><a class="btn soft" href="${qrUrl(link,900)}" download="utsavly-qr.png" target="_blank" rel="noopener">Download QR</a><button class="btn primary" id="shareLink">Share Link</button></div><small class="muted">Current prototype QR uses an external generator. Production QR will be generated server-side.</small></div>`);$('#copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(link)}catch{const x=$('#generatedLink');x.select();document.execCommand('copy')}$('#copyLink').textContent='Copied ✓'};$('#shareLink').onclick=async()=>{if(navigator.share)await navigator.share({title:d.names||'UTSAVLY Invitation',text:'You are invited.',url:link});else{await navigator.clipboard.writeText(link);$('#shareLink').textContent='Link Copied ✓'}}};
$('#premiumBtn').onclick=()=>{showModal(`<div class="premiumCheckout"><div class="modalEyebrow">UTSAVLY PREMIUM</div><h2>Create your own world.</h2><p>Premium adds blank-canvas creation, advanced typography, custom artwork, 3D depth, camera choreography, timeline editing, custom openings, music sync and advanced exports.</p><div class="priceCard"><b>Premium</b><strong>Coming soon</strong><small>Real payment is connected only after the production backend and merchant account are configured.</small></div><button class="btn primary" data-close>Continue Building →</button></div>`);const _dc=$('#modalBody [data-close]');if(_dc)_dc.onclick=closeModal;};
$('#reviewBtn').onclick=()=>{showModal(`<div class="reviewForm"><div class="modalEyebrow">YOUR EXPERIENCE</div><h2>How did UTSAVLY feel?</h2><div class="reviewStars" role="group" aria-label="Rating">${[1,2,3,4,5].map(n=>`<button type="button" data-rating="${n}" aria-label="${n} star${n>1?'s':''}">★</button>`).join('')}</div><label>Name<input placeholder="Your name"></label><label>Review<textarea placeholder="What did you love or what should we improve?"></textarea></label><label>Invitation photo <input type="file" accept="image/*"></label><button class="btn primary" id="submitReview" type="button">Submit Review</button></div>`);let rating=0;$$('#modalBody .reviewStars button').forEach(b=>b.onclick=()=>{rating=Number(b.dataset.rating);$$('#modalBody .reviewStars button').forEach((x,i)=>x.classList.toggle('selected',i<rating))});$('#submitReview').onclick=()=>{track('review_submitted',{rating});showModal(`<div class="success"><div>✦</div><h2>Thank you.</h2><p>Your review is saved for moderation in this prototype.</p><button class="btn primary" data-close type="button">Done</button></div>`);$('#modalBody [data-close]').onclick=closeModal}};

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeDrawer();
    closeModal();
  }
});
document.addEventListener('mousemove',e=>{const g=$('#cursorGlow');if(g){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'}});

(function openDirectInvitation(){const m=location.pathname.match(/^\/i\/([^/]+)/i);const q=new URLSearchParams(location.search).get('i');if(!m&&!q)return;const id=m?decodeURIComponent(m[1]):q;let d=decodeInvitationData(new URLSearchParams(location.search).get('d')||'');if(!d){try{d=JSON.parse(localStorage.getItem('utsavly-demo-'+id)||'null')}catch(e){}}d=d||{occasion:'Wedding Celebration',names:'Janu & Janvi',message:'Together with their families, we invite you to celebrate this beautiful beginning with us.',date:'2027-04-18',time:'19:00',venue:'The Grand Palace, Jammu',language:'English',music:'festive',revealEffect:'flowers',effectIntensity:'cinematic'};const cat=categories.find(c=>c[3]===d.category)||categories.find(c=>c[1]===d.card)||categories.find(c=>id.toLowerCase().includes((c[3]||'').toLowerCase()));if(cat){activeCategory=cat[3];}const wantedCard=cards.find(c=>c[1]===d.card&&c[0]===activeCategory);if(wantedCard)selectedCard=wantedCard;const wantedOpening=(openingSets[activeCategory]||openingSets.Wedding).find(o=>o[0]===d.opening);if(wantedOpening)selectedOpening=wantedOpening;else selectedOpening=(openingSets[activeCategory]||openingSets.Wedding)[0];if(d.font)selectedFont=d.font;if(d.color)selectedColor=d.color;if(d.fontColor)selectedFontColor=d.fontColor;selectedMusic=d.music||'festive';selectedAudioUrl=d.audioUrl||'';selectedMusicStart=d.musicStart||'throughout';if($('#musicChoice'))$('#musicChoice').value=selectedMusic;if($('#musicStart'))$('#musicStart').value=selectedMusicStart;if($('#musicUploadWrap'))$('#musicUploadWrap').classList.toggle('hiddenField',selectedMusic!=='upload');if($('#revealEffect'))$('#revealEffect').value=d.revealEffect||'flowers';if($('#effectIntensity'))$('#effectIntensity').value=d.effectIntensity||'cinematic';renderFilters();renderCards();renderOpenings();setTimeout(()=>openCinematic(d),180)})();
