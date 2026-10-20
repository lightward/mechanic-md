import { mkdir, readFile, writeFile } from "node:fs/promises";
import { marked } from "marked";

const source = await readFile(new URL("../start.md", import.meta.url), "utf8");
const output = new URL("../dist/", import.meta.url);
await mkdir(output, { recursive: true });

const escape = (text) => text.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const syntax = (text) => `<span class="syntax">${escape(text)}</span>`;

// Keep the source text visible, including Markdown punctuation.
function inline(text) {
  return marked.Lexer.lexInline(text).map((token) => {
    if (token.type === "link" && /^https?:\/\//.test(token.href)) {
      const match = token.raw.match(/^\[([\s\S]*)\]\(([\s\S]*)\)$/);
      if (match) {
        return `${syntax("[")}<a href="${escape(token.href)}">${escape(match[1])}</a>${syntax("](")}<span class="destination">${escape(match[2])}</span>${syntax(")")}`;
      }
      return `<a href="${escape(token.href)}">${escape(token.raw)}</a>`;
    }
    if (token.type === "strong") {
      const delimiter = token.raw.slice(0, 2);
      return `${syntax(delimiter)}<strong>${inline(token.raw.slice(2, -2))}</strong>${syntax(delimiter)}`;
    }
    if (token.type === "codespan") {
      return `<span class="inline-code">${escape(token.raw)}</span>`;
    }
    return escape(token.raw);
  }).join("");
}

let inCode = false;
const lines = source.replace(/\n$/, "").split("\n");
const document = lines.map((line, index) => {
  let content;
  let kind = "";
  if (line.startsWith("```")) {
    inCode = !inCode;
    content = `<span class="fence">${escape(line)}</span>`;
    kind = "code-line";
  } else if (inCode) {
    content = `<code>${escape(line)}</code>`;
    kind = "code-line";
  } else if (/^#{1,6} /.test(line)) {
    const [, hashes, text] = line.match(/^(#{1,6}) (.*)$/);
    content = `<h${hashes.length}>${syntax(hashes + " ")}${inline(text)}</h${hashes.length}>`;
    kind = "heading-line";
  } else if (line.startsWith("> ")) {
    content = `${syntax("> ")}<span class="quote">${inline(line.slice(2))}</span>`;
    kind = "quote-line";
  } else if (line.startsWith("- ")) {
    content = `${syntax("- ")}${inline(line.slice(2))}`;
  } else {
    content = inline(line);
  }
  return `<div class="line ${kind}"><span class="line-number" aria-hidden="true">${index + 1}</span><div class="line-content">${content || "<br>"}</div></div>`;
}).join("\n");

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#272822">
  <title>mechanic.md — Build Shopify automations with your AI</title>
  <meta name="description" content="Give your AI assistant a starting point for Mechanic: task-writing skills, the task library, current documentation, and a preview-first workflow.">
  <link rel="canonical" href="https://mechanic.md/">
  <link rel="alternate" type="text/markdown" href="https://mechanic.md/start.md" title="Read as Markdown">
  <style>
    :root { color-scheme: dark; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: #f0eee7; background: #20211d; font-synthesis: none; }
    * { box-sizing: border-box; }
    body { margin: 0; }
    a { color: #a6e22e; text-decoration: none; text-underline-offset: .22em; }
    a:hover { text-decoration: underline; }
    a:focus-visible, button:focus-visible, textarea:focus-visible { outline: 2px solid #a6e22e; outline-offset: 4px; }
    .skip { position: absolute; top: -5rem; left: 1rem; padding: .8rem; background: #20211d; z-index: 3; }
    .skip:focus { top: 1rem; }
    .masthead { max-width: 1180px; margin: auto; padding: 26px 32px; display: flex; justify-content: space-between; align-items: center; gap: 20px; font-size: 12px; }
    .wordmark { color: #f0eee7; font-weight: 600; font-size: 14px; }
    .wordmark span { color: #a6e22e; }
    nav { display: flex; gap: 24px; }
    nav a { color: #b9b9ac; }
    .editor { max-width: 1116px; margin: 0 auto 32px; border: 1px solid #42433a; border-radius: 9px; overflow: hidden; background: #272822; box-shadow: 0 16px 56px #0002; }
    .toolbar { display: flex; justify-content: space-between; align-items: stretch; gap: 12px; background: #22231e; border-bottom: 1px solid #42433a; }
    .file-tab { display: flex; align-items: center; gap: 10px; padding: 17px 24px; border-right: 1px solid #42433a; border-top: 2px solid #a6e22e; background: #272822; font-size: 13px; }
    .file-icon { color: #a6e22e; font-size: 11px; }
    .actions { display: flex; align-items: center; gap: 20px; padding: 9px 16px; font-size: 12px; }
    .actions a { color: #c1c0b6; }
    button { font: inherit; cursor: pointer; border: 1px solid #626451; border-radius: 5px; color: #f0eee7; background: #36382d; padding: 8px 12px; }
    button:hover { background: #454836; border-color: #a6e22e; }
    #copy { min-width: 15ch; }
    main { padding: 30px 32px 38px 0; font-size: 14px; line-height: 1.85; tab-size: 2; }
    .line { display: grid; grid-template-columns: 68px minmax(0, 1fr); }
    .line-number { padding-right: 23px; color: #858678; text-align: right; user-select: none; font-size: 12px; line-height: 2.1584; }
    .line-content { white-space: pre-wrap; overflow-wrap: anywhere; min-width: 0; }
    h1, h2, h3, h4, h5, h6 { font: inherit; font-weight: 600; margin: 0; color: #f1d778; }
    h1 { color: #a6e22e; }
    strong { font-weight: 600; color: #f0eee7; }
    .syntax { color: #f38bab; }
    .destination { color: #aaa99a; }
    .inline-code, code { color: #e6db74; font: inherit; }
    .fence { color: #ae9eea; }
    .quote { color: #d7dcbb; }
    .quote-line, .code-line { background: #303127; }
    .statusbar { border-top: 1px solid #42433a; padding: 10px 20px; color: #b3b3a5; display: flex; justify-content: space-between; gap: 12px; font-size: 11px; }
    .status-details { display: flex; gap: 20px; }
    .copy-status { color: #a6e22e; }
    footer { max-width: 1116px; margin: 0 auto; padding: 0 0 32px; color: #a8a99b; font-size: 11px; line-height: 1.8; }
    footer a { color: inherit; text-decoration: underline; }
    dialog { width: min(90vw, 720px); background: #272822; color: #f0eee7; border: 1px solid #626451; border-radius: 8px; }
    dialog::backdrop { background: #0009; }
    textarea { width: 100%; height: 45vh; background: #20211d; color: #f0eee7; font: inherit; padding: 12px; }
    @media (max-width: 1180px) { .editor { margin-left: 24px; margin-right: 24px; } footer { padding-left: 24px; padding-right: 24px; } }
    @media (max-width: 600px) {
      .masthead { padding: 20px 16px; } nav { gap: 16px; }
      .editor { margin: 0 8px 20px; border-radius: 6px; }
      .file-tab { padding: 14px 12px; gap: 7px; }
      .actions { gap: 12px; padding: 7px 10px; font-size: 11px; }
      button { padding: 8px; }
      main { padding: 22px 14px 26px 0; font-size: 13px; line-height: 1.85; }
      .line { grid-template-columns: 38px minmax(0, 1fr); }
      .line-number { padding-right: 11px; font-size: 10px; line-height: 2.405; }
      .statusbar { padding: 10px 12px; font-size: 10px; }
      .status-details { gap: 12px; }
      footer { padding: 0 16px 24px; }
    }
  </style>
</head>
<body>
  <a class="skip" href="#document">Skip to Markdown</a>
  <header class="masthead">
    <a class="wordmark" href="/" aria-label="mechanic.md home">mechanic<span>.md</span></a>
    <nav aria-label="Resources"><a href="https://learn.mechanic.dev">Docs ↗</a><a href="https://github.com/lightward/mechanic-md">GitHub ↗</a></nav>
  </header>
  <div class="editor">
    <div class="toolbar">
      <div class="file-tab"><span class="file-icon" aria-hidden="true">M↓</span>start.md</div>
      <div class="actions"><a href="/start.md">Raw ↗</a><button id="copy" type="button" hidden>Copy Markdown</button></div>
    </div>
    <main id="document" aria-label="Mechanic getting started guide">${document}</main>
    <div class="statusbar"><span id="copy-status" class="copy-status" role="status">Markdown</span><span class="status-details"><span>${lines.length} lines</span><span>UTF-8</span></span></div>
  </div>
  <footer>One file. A starting point for you and your AI. Maintained by <a href="https://lightward.com">Lightward</a>.</footer>
  <dialog id="copy-dialog" aria-labelledby="copy-heading">
    <h2 id="copy-heading">Copy Markdown</h2>
    <p>Press ⌘C on Mac or Ctrl+C to copy the selected text.</p>
    <textarea id="copy-source" readonly aria-label="Markdown source"></textarea>
    <form method="dialog"><button>Done</button></form>
  </dialog>
  <script id="markdown-source" type="application/json">${JSON.stringify(source).replace(/</g, "\\u003c")}</script>
  <script>
    const source = JSON.parse(document.getElementById("markdown-source").textContent);
    const button = document.getElementById("copy");
    const status = document.getElementById("copy-status");
    let copyFeedback;
    button.hidden = false;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(source);
        clearTimeout(copyFeedback);
        button.textContent = "Copied!";
        status.textContent = "Markdown copied";
        copyFeedback = setTimeout(() => { button.textContent = "Copy Markdown"; }, 2500);
      } catch {
        const dialog = document.getElementById("copy-dialog");
        const field = document.getElementById("copy-source");
        field.value = source;
        dialog.showModal();
        field.focus();
        field.select();
        status.textContent = "Select and copy Markdown";
      }
    });
  </script>
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
