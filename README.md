# UTSAVLY — Luxury Digital Invitations

This package is a tested **frontend prototype** for the UTSAVLY platform direction discussed in the project.

## Included
- Luxury light UI + optional dark mode for the platform
- Occasion-specific card collections
- Cultural/faith-specific visual collections
- Free + Premium labels
- Multiple opening engines by occasion
- Multilingual custom text fields
- Luxury typography/color customization direction
- Cinematic multi-scene preview demo
- Publish demo that generates a stable demo ID/link + QR
- Share/copy/download QR controls
- Review + photo feedback form demo
- Analytics hooks that do not send names/messages/guest PII
- SEO metadata, canonical placeholder, OG metadata and JSON-LD identity
- robots.txt, sitemap.xml and Vercel security headers

## Important production boundary
This is intentionally a **frontend prototype**, not a fake production backend. Real invitations, authentication, database persistence, media uploads, RSVP storage, admin moderation, payments, server-generated QR, and `/i/:id` dynamic routing require a backend/database/storage layer.

### Premium payments
Do not put a Razorpay secret key in frontend code. Add a backend order endpoint, verify the payment server-side, then unlock Premium. A real Razorpay key/merchant account is required before live checkout can work.

### Domain
The package is domain-neutral for deployment. After choosing the final production domain, set the canonical/OG URLs and add a production sitemap URL in `robots.txt`.

### Analytics
GA4 is wired and ready. Put the real Measurement ID in `ga-config.js` (format `G-...`) before deployment; never send guest names, phone numbers, email addresses, wishes, or other private invitation data as analytics parameters.

## Deploy
Upload the files to GitHub and connect the repository to Vercel. Vercel creates preview deployments on Git pushes; test the preview before production.


## front/navigation repair
- Occasion categories are hidden from the homepage and live only in the Explore drawer.
- Fixed drawer visibility/pointer interaction and mobile header layering.
- Removed the homepage category launcher strip to keep the hero clean and premium.
- The current Vercel origin is used for demo invitation URLs; production persistent invitation routes require the backend phase.

## Birthday Couture Collection
Birthday now includes distinct visual-world cards rather than recoloured templates: Royal Princess Cameo, Royal Ornate Frame, Pearl & Blush Palace, Crystal Celebration, Golden Birthday Stage, Royal Gift Reveal, Floral Embossed, Vintage Mirror, Butterfly Garden, Rose Palace, Lavender Jewel, Midnight Luxury, Fairytale Celebration, Editorial Photo Luxe, Color Pop Couture and Disco Chrome.

Birthday openings were expanded to match these worlds, including Cameo Unveil, Pearl Bloom, Crystal Shimmer, Golden Stage, Vintage Mirror, Rose Bloom, Butterfly Garden, Lavender Jewel, Midnight Stars, Fairytale Palace, Editorial Cover, Disco Chrome and Color Couture.


## updates
- Robust platform dark/light mode toggle with persisted theme.
- Expanded luxury font studio with additional script-friendly fallbacks.
- Roman-name transliteration for Hindi/Punjabi (including common demo names such as Janu/Janvi).
- Cinematic scenes stay hidden behind the selected opening until the opening animation reveals them.
- CSS 3D opening choreography for gift, cameo, pearl, spotlight, mirror, rose, butterfly, midnight, fairytale, temple doors and royal fort gates.
- Added Temple Grandeur and Royal Fort Palace card worlds to the Hindu/Traditional collection.
- Preserved the existing V7 birthday couture collection and other occasion cards.


## SEO + Analytics identity update
- Added explicit creator/author metadata for Gourav Patyal and alternate name Gorav Patyal.
- Preserved GitHub and Instagram sameAs identity links.
- Added a subtle creator identity section on the homepage.
- Added sitemap.xml and robots.txt sitemap declaration.
- GA4 loader is ready in `ga-config.js`; no data is sent until a real Measurement ID is supplied.
- Analytics events must never include invitation names, phone numbers, email addresses, wishes, or other private guest data.

## Premium Cards + Openings
- premium-v25.css/js: 12 reference-style cards (Birthday, Muslim, Wedding, Music) and 5 new cinematic openings, registered into the existing engine without touching app.js.

## fixes
- Fixed load-time crash in app.js (Premium modal binding) that broke Review button and /i/ direct links.
- New music engine (resumes AudioContext, chord pad + melody, louder). Cinema view hides site nav and has higher text contrast.
- SEO: Gourav/Gorav Patyal keywords, FAQ + Person JSON-LD, About section, sitemap. GA4: set ID in ga-config.js.

## Updates
- Category hub (3 cards per category + View all), openings by category chips, 18 unique card layouts (premium shimmer), cinema colours follow the card.

## Photo cards + cinematic player
- 40 photo-background cards (images/), cards shown as full-screen background with zoom, effects (flowers, snow, rain, fire, lights, stars, hearts, confetti, lightning), date then names reveal.
- Songs: upload up to 30 MB or paste an mp3 link, with start/end trim.

## Invitation player & studio (new)
- `invitation-player.js/.css` — self-contained player: 22 real opening animations, Opening → Date → Swipe → Effect → Names → Swipe → Venue → Complete, effects (flowers, snow, rain, fire, lightning, lights, stars, hearts, confetti), music with start/end trim, "Create your own" branding.
- `studio.js/.css` — full-screen customize flow with live card preview (names, date, time, venue, message, language, font, text colour, card tint, opening, effect, music/upload/trim), link + QR + offline HTML download.
- `index.html` has `<base href="/">` so assets load correctly on shared `/i/<name>` links (the Vercel rewrite previously served index.html for `/i/style.css`).
- Existing SEO, schema, analytics, sitemap, robots and all images are untouched.
