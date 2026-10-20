# mechanic.md

A small starting guide for people and AI assistants building Shopify automations with Mechanic.

## Content

Edit `start.md`. The build publishes that file unchanged at `/start.md` and `/llms.txt`, and renders the same content as accessible HTML at `/`.

The home page presents the Markdown source in a dark editor theme, with syntax colors, line numbers, semantic headings, and clickable links. Copy Markdown copies the original file, including punctuation and line breaks. If clipboard access is unavailable, a dialog provides selected source text for manual copying.

The detailed skills stay in [lightward/mechanic-skills](https://github.com/lightward/mechanic-skills); this repository links to them rather than maintaining another copy.

GitHub Pages serves the root as HTML and determines MIME types itself. The raw Markdown endpoint is `/start.md`; the root advertises it with an alternate link and a visible link. This site does not implement content negotiation or promise a `text/markdown` response header.

## Local development

Local terminal (fish-compatible):

```sh
npm ci
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080.

## Social sharing

The build includes Open Graph and large-image card metadata with an absolute HTTPS URL for `assets/og-image-v1.png` (1200 × 630). The editable artwork is `assets/og-image.svg`. The committed PNG keeps deployment independent of local fonts and image tools.

To regenerate it with librsvg installed, in a local fish terminal:

```sh
rsvg-convert -o assets/og-image-v1.png assets/og-image.svg
npm run build
```

After changing the artwork, use a new versioned PNG filename and update the metadata and copy path in `scripts/build.mjs` to avoid stale image caches. LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) can refresh its preview of the home page.

## Search and measurement

These accounts are owned by matt@lightward.com and set up the same way as mechanic.dev and locksmith.dev.

| Service | Setup | Verified by |
| --- | --- | --- |
| Google Analytics | Property **Mechanic.md (AI starter guide)** (559723636) in the Lightward Inc account. Web stream **Mechanic.md Website** (16168353113), measurement ID `G-3JXHX4CSXH` | `assets/analytics.js` |
| Google Search Console | Domain property `mechanic.md`, with the sitemap submitted | `google-site-verification` TXT record in DNSimple |
| Bing Webmaster Tools | Site `https://mechanic.md/` | `msvalidate.01` meta tag in the page head |
| GitHub Pages | Domain verified for the Lightward org, which prevents takeover | `_github-pages-challenge-lightward` TXT record |

Keep those records and the meta tag. Removing them unverifies the site.

`assets/analytics.js` runs only on mechanic.md. It doesn't load for local previews, Do Not Track, Global Privacy Control, or the Google Analytics opt-out flag. Google Signals and ad personalization are off. It keeps only `utm_*` parameters in page addresses, and trims referrers to their origin and path.

It reports these events: `markdown_copy`, `raw_markdown_click`, `app_store_click`, `documentation_click`, `task_library_click`, and `github_click`. None of them include destination query strings. `npm test` checks this behavior.

The build also publishes `robots.txt`, which explicitly allows search and AI crawlers, and `sitemap.xml`.

## Deployment

GitHub Actions builds pull requests and deploys pushes to `main` using GitHub Pages. In repository settings, Pages uses GitHub Actions with the custom domain `mechanic.md`.

DNSimple manages DNS. The apex points to GitHub Pages; GitHub manages the site's HTTPS certificate. Do not reintroduce a DNSimple URL redirect while this site is hosted on Pages.
