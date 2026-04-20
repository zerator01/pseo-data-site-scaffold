# DailyTarot

DailyTarot is a static Next.js tarot reference site built around a custom black-and-gold deck, full card-detail pages, group hubs, ranking pages, a daily draw surface, and a three-card reading flow.

## What Lives Here

- `app/`: route families for home, cards, groups, combinations, rankings, reading, and trust pages
- `data/tarot-cards.json`: the primary content dataset for all 78 cards
- `src/components/`: reusable tarot UI including the interactive card component and daily draw
- `src/lib/`: tarot-specific helpers for routes, card images, groups, combinations, and schema
- `public/cards-fullbleed/`: source full-bleed PNG card art
- `public/cards-goldcrop/`: cropped PNG card art prepared for delivery
- `public/cards-goldcrop-webp/`: final webp assets that mirror the CDN object structure
- `scripts/`: image-generation, crop, conversion, upload, validation, and maintenance scripts
- `state/imagegen-runs/`: generation and asset-processing run records

## Runtime Model

- The site builds as a static export via Next.js.
- Card art is served from `https://img.dailytarot.org`.
- `data/tarot-cards.json` is the source of truth for card copy, image URLs, keywords, symbolism, yes/no text, and title offsets.
- Combination pages are statically generated for every card pair.

## Common Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Card Asset Pipeline

1. Generate or update a full-bleed card image in `public/cards-fullbleed/...`.
2. Crop the gold border into `public/cards-goldcrop/...`.
3. Convert cropped PNGs into `public/cards-goldcrop-webp/...`.
4. Upload the final webp assets to R2 so they resolve at `img.dailytarot.org`.
5. Update `data/tarot-cards.json` if the public image URL needs a new cache-busting version.

Relevant scripts:

- `scripts/auto_crop_gold_border.py`
- `scripts/convert-goldcrop-to-webp.py`
- `scripts/upload-goldcrop-webp-to-r2.mjs`
- `scripts/pull-fullbleed-batch.mjs`
- `scripts/generate-fullbleed-v2-major-selected.mjs`
- `scripts/generate-fullbleed-v2-minor-selected.mjs`

## Quality Checks

- Run `npm run lint` before treating UI work as ready.
- Run `npm run build` after route or data changes to confirm static export still succeeds.
- If you change image URLs or route generation rules, verify the built output in `out/`.

## Current Product Surface

- Full 78-card index
- Major Arcana and suit hub pages
- Individual card detail pages
- Full combination library for card pairs
- Rankings for yes-cards, warning cards, and major arcana
- Browser-based daily draw
- Randomized three-card past/present/future reading
