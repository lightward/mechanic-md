# mechanic.md

A small starting guide for people and AI assistants building Shopify automations with Mechanic.

## Content

Edit `start.md`. The build publishes that file unchanged at `/start.md` and `/llms.txt`, and renders the same content as accessible HTML at `/`.

The detailed skills stay in [lightward/mechanic-skills](https://github.com/lightward/mechanic-skills); this repository links to them rather than maintaining another copy.

GitHub Pages serves the root as HTML and determines MIME types itself. The raw Markdown endpoint is `/start.md`; the root advertises it with an alternate link and a visible link. This site does not implement content negotiation or promise a `text/markdown` response header.

## Local development

Local terminal (fish-compatible):

```sh
npm ci
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080.

## Deployment

GitHub Actions builds pull requests and deploys pushes to `main` using GitHub Pages. In repository settings, Pages uses GitHub Actions with the custom domain `mechanic.md`.

DNSimple manages DNS. The apex points to GitHub Pages; GitHub manages the site's HTTPS certificate. Do not reintroduce a DNSimple URL redirect while this site is hosted on Pages.
