/* Site measurement, the same privacy-guarded setup as mechanic.dev and locksmith.dev.
   GA4 property "Mechanic.md (AI starter guide)", web stream "Mechanic.md Website". See README. */
(function () {
  "use strict";

  var measurementId = "G-3JXHX4CSXH";
  if (
    !["mechanic.md", "www.mechanic.md"].includes(window.location.hostname) ||
    window["ga-disable-" + measurementId] ||
    navigator.doNotTrack === "1" ||
    navigator.globalPrivacyControl === true ||
    window.mechanicMdAnalyticsLoaded
  ) return;
  window.mechanicMdAnalyticsLoaded = true;

  // Keep campaign attribution, but omit other query strings and all fragments.
  var pageUrl = new URL(window.location.href);
  var campaignParams = new URLSearchParams();
  ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term"].forEach(function (key) {
    if (pageUrl.searchParams.has(key)) campaignParams.set(key, pageUrl.searchParams.get(key));
  });
  pageUrl.search = campaignParams.toString();
  pageUrl.hash = "";

  function cleanUrl(value) {
    try {
      var url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.origin + url.pathname : "";
    } catch (_) {
      return "";
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  // The config command sends the initial page_view; do not send another manually.
  window.gtag("config", measurementId, {
    page_location: pageUrl.href,
    page_referrer: cleanUrl(document.referrer),
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.appendChild(script);

  function track(event) {
    if (event.defaultPrevented || (event.type === "auxclick" && event.button !== 1)) return;
    var target = event.target;
    if (event.type === "click" && target.closest && target.closest("#copy")) {
      window.gtag("event", "markdown_copy", { transport_type: "beacon" });
      return;
    }
    var link = target.closest && target.closest("a[href]");
    if (!link) return;
    var destination;
    try { destination = new URL(link.href); } catch (_) { return; }
    if (destination.protocol !== "https:") return;

    var eventName;
    if (destination.hostname === "mechanic.md" && destination.pathname === "/start.md") {
      eventName = "raw_markdown_click";
    } else if (destination.hostname === "apps.shopify.com" && /^\/mechanic\/?$/.test(destination.pathname)) {
      eventName = "app_store_click";
    } else if (destination.hostname === "learn.mechanic.dev") {
      eventName = "documentation_click";
    } else if (destination.hostname === "tasks.mechanic.dev") {
      eventName = "task_library_click";
    } else if (destination.hostname === "github.com" && /^\/lightward\//.test(destination.pathname)) {
      eventName = "github_click";
    }
    if (!eventName) return;

    // Never include destination query strings or fragments.
    window.gtag("event", eventName, {
      transport_type: "beacon",
      link_url: cleanUrl(destination.href),
      link_domain: destination.hostname
    });
  }
  document.addEventListener("click", track);
  document.addEventListener("auxclick", track);
})();
