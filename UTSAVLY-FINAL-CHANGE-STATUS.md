# UTSAVLY change status — no-cloud restore

- Removed Supabase/cloud-storage configuration and upload code.
- Kept invitation link generation, QR code, download, and social sharing controls.
- The downloaded standalone HTML invitation embeds the selected uploaded audio file, allowing offline playback from that downloaded file.
- A link shared in WhatsApp is only a URL; it does not attach the downloaded HTML file. For custom music in the online link, use a public direct audio URL. Otherwise the online link uses built-in music.
- Browser autoplay restrictions may require guests to tap the music control.
- Syntax checks were run for `app.js` and `studio.js`; end-to-end browser playback/share has not been tested here.
