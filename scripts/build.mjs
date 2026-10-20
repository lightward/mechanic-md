import { mkdir, readFile, writeFile } from "node:fs/promises";
import { marked } from "marked";

const source = await readFile(new URL("../start.md", import.meta.url), "utf8");
const output = new URL("../dist/", import.meta.url);
await mkdir(output, { recursive: true });

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mechanic — Build Shopify automations with your AI</title>
  <meta name="description" content="Give your AI assistant a starting point for Mechanic: task-writing skills, the task library, current documentation, and a preview-first workflow.">
  <link rel="canonical" href="https://mechanic.md/">
  <link rel="alternate" type="text/markdown" href="https://mechanic.md/start.md" title="Read as Markdown">
  <style>
    :root { color-scheme: light dark; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; line-height: 1.7; color: #252925; background: #fafbf8; }
    body { max-width: 48rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; overflow-wrap: anywhere; }
    nav, footer { font-size: .85rem; }
    nav { display: flex; flex-wrap: wrap; gap: .6rem 1.5rem; padding-bottom: 2rem; border-bottom: 1px solid #d6dcd1; }
    h1 { font-size: clamp(2.25rem, 7vw, 3.5rem); letter-spacing: -.06em; margin: 2rem 0 .4rem; line-height: 1.1; }
    h2 { font-size: 1.2rem; margin-top: 2.5rem; line-height: 1.4; }
    a { color: #315d2d; text-underline-offset: .2em; }
    a:hover { text-decoration-thickness: .15em; }
    a:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
    blockquote { margin: 1.5rem 0; padding: .25rem 1rem; border-left: 3px solid #7e9773; background: #eff3e9; }
    pre { padding: 1rem; background: #eff3e9; overflow-x: auto; }
    code { font-family: inherit; font-size: .9em; }
    li { margin: .65rem 0; }
    ul { padding-left: 1.4rem; }
    footer { border-top: 1px solid #d6dcd1; margin-top: 3rem; padding-top: 1rem; }
    @media (prefers-color-scheme: dark) {
      :root { color: #e5e9e0; background: #181d18; }
      a { color: #b9d8a6; }
      blockquote, pre { background: #252e24; }
      nav, footer { border-color: #414b3b; }
    }
  </style>
</head>
<body>
  <nav aria-label="Resources">
    <a href="/start.md">Read as Markdown ↗</a>
    <a href="https://github.com/lightward/mechanic-md">Source on GitHub ↗</a>
    <a href="https://learn.mechanic.dev">Documentation ↗</a>
  </nav>
  <main>${marked.parse(source)}</main>
  <footer>Maintained by <a href="https://lightward.com">Lightward</a>. This page and <a href="/start.md">its Markdown</a> share one source.</footer>
</body>
</html>
`;

await Promise.all([
  writeFile(new URL("index.html", output), page),
  writeFile(new URL("start.md", output), source),
  writeFile(new URL("llms.txt", output), source),
  writeFile(new URL(".nojekyll", output), ""),
]);
console.log("Built dist/index.html, dist/start.md, and dist/llms.txt.");
