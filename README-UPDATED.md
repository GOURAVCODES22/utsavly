# UTSAVLY — Updated project

This is the updated static UTSAVLY website project based on the supplied `utsavly-full-latest.zip`.

## Included in this update
- Added six new premium preview experiences (cards 06–11): Kerala Night, Palace Medallions, Midnight Navy & Gold, Cartoon Night Garden, Pink Car, and Royal Burgundy Birthday.
- Each premium preview has its own scroll-based scene sequence and theme-specific reveal assets.
- Premium pricing is shown as **starts from ₹199 · Coming Soon**. These cards are preview-only; there is no payment checkout or premium publishing unlock.
- Used the latest `card 10 assets repair.zip` files for the Pink Car experience.
- Added optional date/time handling to the studio's generate/download flow; empty date/time fields no longer block generation.
- Added WhatsApp and Gmail share actions to the studio result, while the native share action remains available for other supported apps.
- Downloaded invitation HTML now includes a **Create Your Own Invitation** link back to the website.
- Increased scroll invitation supporting-text sizes so names remain the most prominent, while message/date/venue remain more readable.
- Footer credit spelling corrected to **Designed & Developed by Gourav Patyal**.

## Run locally
Open `index.html` in a modern browser, or serve this folder with any static server. For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Important limitations
- This is still a static/demo frontend. Premium checkout, a persistent database, RSVP administration and server-side invitation storage are not enabled.
- Free invitation sharing uses the existing URL-encoded demo flow; QR generation uses the existing external QR service and therefore needs internet.
- The downloaded invitation itself opens offline in a browser, but external fonts and online share/QR actions require internet.
- Social apps available from the system share sheet depend on the guest's device and installed apps.


## October 2026 polish notes
- Mobile invitation studio uses a dedicated full-height layout so controls remain visible and the form scrolls independently from the preview.
- Supporting invitation text follows the selected text colour for better contrast.
- Removed the UTSAVLY wordmark from the guest-facing invitation overlay/footer.
- Added cinematic headline entrance motion with reduced-motion accessibility support.
- SEO files include an absolute canonical URL, Open Graph image, sitemap.xml, robots.txt and llms.txt.
- Bing Webmaster Tools verification still requires the real token from the site owner's Bing account; see BING-WEBMASTER-SETUP.txt.
- Important: a local uploaded song is embedded in a downloaded file, but cannot be magically uploaded to the server when sharing a link. To share custom music across devices, paste a public direct audio URL or add a real media-upload backend. Browser autoplay rules may require the guest to tap the sound control.
