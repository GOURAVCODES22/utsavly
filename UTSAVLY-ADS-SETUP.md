# UTSAVLY ads setup (AdSense-ready, disabled by default)

- The ad slot is placed below the main site's invitation-building content. It is not inserted into the Create/Customize controls.
- Shared invitation URLs (`/i/...` and legacy `?i=...`) are explicitly excluded.
- Ads remain disabled until the site is approved and real IDs are added.

## Enable only after approval
1. Apply for Google AdSense and complete the site's review. Approval is not guaranteed.
2. Create a display ad unit and copy your own publisher ID (`ca-pub-...`) and ad-unit slot ID.
3. Edit `ads-config.js`: set `enabled: true`, fill `publisherId` and `homePageSlotId`.
4. Commit/push to GitHub and verify the Vercel deployment.
5. Test the homepage and a shared `/i/...` link. The shared invitation must remain ad-free.

Do not paste example IDs, use someone else's publisher ID, click your own ads, or encourage guests to click ads. No revenue is generated while disabled and earnings are not guaranteed.
