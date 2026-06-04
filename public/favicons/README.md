Favicon & App Icon Guidelines for AgroInsight AI
==============================================

This folder contains the recommended favicon and application icon naming conventions, sizes, and formats for a production-ready PWA and social presence.

Design intent
-------------
- Communicate: agriculture, weather, intelligence, analytics.
- Options:
  - Option A: Leaf + Cloud (simple, scalable)
  - Option B: Tree + Weather Radar (illustrative, strong forestry signal)
  - Option C: AI + Farm Landscape (brandable full mark)

Recommended palette
-------------------
- Primary (dark): #0f172a (navy/ink)
- Accent (leaf): #2f9e44 (green)
- Accent (sky): #38bdf8 (sky blue)
- Neutral (light bg): #ffffff

Directory structure
-------------------
public/
  favicons/
    icon-192.png           (192x192, PNG, maskable)
    icon-512.png           (512x512, PNG, maskable)
    apple-touch-icon.png   (180x180, PNG)
    favicon.ico            (multiple sizes inside ICO)
    icon.png               (shortcut icon, 32x32)
    opengraph-image.png    (1200x630, PNG)
    twitter-image.png      (1200x675, PNG)

Naming conventions
------------------
- Use `kebab-case` and explicit sizes in filenames.
- Keep `favicon.ico` at the root (`/public/favicon.ico`) to support older browsers.
- Keep `manifest.json` at `/public/manifest.json` and reference `/favicons/icon-192.png` and `/favicons/icon-512.png`.

Formats and sizes
-----------------
- favicon.ico — include 16x16, 32x32, 48x48 inside an .ico file.
- icon.png — 32x32 PNG (shortcut icon). Useful for browsers and favicons fallback.
- apple-touch-icon.png — 180x180 PNG for iOS home screen.
- icon-192.png — 192x192 PNG (maskable) for Android install.
- icon-512.png — 512x512 PNG (maskable) for Play Store / high-density screens.
- opengraph-image.png — 1200x630 PNG for Open Graph.
- twitter-image.png — 1200x675 PNG for Twitter/X (large summary card).

Accessibility & contrast
-----------------------
- Keep strong shape contrast — simple silhouettes (leaf, cloud, tree) read well at small sizes.
- Avoid text inside the icon; logos with text do not scale down well.

Source and export recommendations
---------------------------------
- Design in vector (Figma/Sketch/Illustrator). Export PNGs at exact sizes.
- Provide a single SVG master for brand use and an optimized PNG pipeline for builds.
- Generate `favicon.ico` by combining 16/32/48 PNGs (ImageMagick or Figma plugin).

Automating generation (example ImageMagick commands)
--------------------------------------------------
`convert icon-16.png icon-32.png icon-48.png favicon.ico`

Performance
-----------
- Keep icons under 100KB each; prefer <20KB where possible for mobile.
- Serve images from CDN for global performance.

Placeholders
------------
- Add temporary placeholders until final assets are provided: `opengraph-image.png`, `twitter-image.png`, `icon.png`, `apple-touch-icon.png`.

Notes
-----
- Twitter/X and Open Graph require different aspect ratios — keep both `opengraph-image.png` (1200x630) and `twitter-image.png` (1200x675).
- The `manifest.json` included at project root references the maskable icons to ensure proper install UX on Android.
