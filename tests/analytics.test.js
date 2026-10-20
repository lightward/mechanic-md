// Analytics loader checks, matching mechanic.dev's and locksmith.dev's. Run with `npm test`.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

const ID = "G-3JXHX4CSXH";
const source = await readFile(new URL("../assets/analytics.js", import.meta.url), "utf8");

function load({ url = "https://mechanic.md/", navigator = {}, disabled = false } = {}) {
  const listeners = {};
  const scripts = [];
  const window = { location: new URL(url), [`ga-disable-${ID}`]: disabled };
  const context = vm.createContext({ window, navigator, URL, URLSearchParams, document: {
    referrer: "https://chatgpt.com/c/private-conversation?q=private#private",
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
    addEventListener: (type, handler) => { listeners[type] = handler; },
  } });
  vm.runInContext(source, context);
  return {
    scripts,
    repeat: () => vm.runInContext(source, context),
    calls: () => JSON.parse(JSON.stringify((window.dataLayer || []).map((args) => Array.from(args)))),
    click: (href, { type = "click", button = 0, copy = false } = {}) => listeners[type]?.({
      type, button, defaultPrevented: false,
      target: { closest: (selector) => (selector === "#copy" ? (copy ? {} : null) : (href ? { href } : null)) },
    }),
  };
}

test("loads the mechanic.md stream once, with one automatic page view", () => {
  const page = load();
  page.repeat();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${ID}`);
  assert.deepEqual(page.calls().map((call) => call[0]), ["js", "config"]);
  const config = page.calls()[1][2];
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.page_referrer, "https://chatgpt.com/c/private-conversation");
});

test("does not load on previews or for browser opt-outs", () => {
  for (const options of [
    { url: "http://localhost:8080/" }, { url: "https://lightward.github.io/mechanic-md/" },
    { navigator: { doNotTrack: "1" } }, { navigator: { globalPrivacyControl: true } }, { disabled: true },
  ]) {
    const page = load(options);
    page.click("https://apps.shopify.com/mechanic");
    assert.equal(page.scripts.length, 0);
    assert.equal(page.calls().length, 0);
  }
});

test("keeps campaign attribution but drops other queries and fragments", () => {
  const page = load({ url: "https://mechanic.md/?utm_source=newsletter&email=private@example.com#private" });
  assert.equal(page.calls()[1][2].page_location, "https://mechanic.md/?utm_source=newsletter");
});

test("names copies and useful outbound clicks without collecting their details", () => {
  const page = load();
  page.click(null, { copy: true });
  page.click("https://mechanic.md/start.md");
  page.click("https://apps.shopify.com/mechanic?ref=private");
  page.click("https://learn.mechanic.dev/core/tasks?secret=private#x", { type: "auxclick", button: 1 });
  page.click("https://tasks.mechanic.dev/some-task");
  page.click("https://github.com/lightward/mechanic-skills");
  page.click("https://shopify.dev/docs");
  const events = page.calls().filter((call) => call[0] === "event");
  assert.deepEqual(events.map((call) => call[1]), [
    "markdown_copy", "raw_markdown_click", "app_store_click", "documentation_click", "task_library_click", "github_click",
  ]);
  assert.equal(events[3][2].link_url, "https://learn.mechanic.dev/core/tasks");
  assert.ok(!JSON.stringify(events).includes("private"));
});
