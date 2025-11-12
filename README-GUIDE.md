
# FAHUMUINRAFA - Production Mobile Web App (PWA, WebView-ready)

This is a mobile-first, production-optimized single-page web app intended to be hosted on GitHub Pages
or used inside an Android WebView / Capacitor / TWA. It is styled for mobile portrait view and follows
modern app UI/UX for campus portals.

## What is included
- index.html (mobile single-page app)
- style.css (theme & UI)
- app.js (navigation & small interactions)
- manifest.json (PWA manifest)
- service-worker.js (offline caching)
- assets/icons (192 & 512)
- Uses remote official images for logo & hero (you can replace with local images)

## How to use
1. Upload entire folder to GitHub repo root.
2. Enable GitHub Pages (branch: main, folder: /root) to get a hosted URL.
3. Use that URL as WebView target in Android app or open on mobile browser.
4. (Optional) Convert to APK using Capacitor or TWA -> README includes guidance.

## Notes for Play Store
- Recommended to wrap this web app in a WebView via Capacitor or convert to Trusted Web Activity (TWA).
- Provide privacy policy URL and app images/screenshots required by Play Console.
- Keep permissions minimal (WebView app doesn't need extra permissions).

