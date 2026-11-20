/*
 * Pyramidev cookie consent banner. Framework-agnostic, no dependencies, ES5-compatible syntax.
 * Markup: banner-consentimiento.html. Styles: banner-consentimiento.css (brand tokens only). Policy: politica-cookies.html.
 *
 * Contract:
 * - Nothing non-essential runs before opt-in. Gated elements are written inert and this script activates them only for a
 *   granted category:
 *     <script type="text/plain" data-consent="analytics" data-src="https://..."></script>   (external script)
 *     <script type="text/plain" data-consent="marketing">...inline code...</script>        (inline script)
 *     <iframe data-consent="marketing" data-src="https://..."></iframe>                      (embed)
 *   Every other attribute of a gated script is copied to the live script (for example data-cf-beacon, async, defer).
 *   data-consent-type="module" sets the type of the live script. data-cookies="_ga,_ga_*" lists the cookies the element
 *   sets, so they are deleted when its category is revoked (a trailing * matches by prefix).
 * - Categories: essential (always on, cannot be turned off), analytics, marketing.
 * - Accept, reject and configure have the same visual weight (same class). The decision is stored in localStorage under
 *   "py-consent" together with data-policy-version of #py-consent; a stored decision of another version asks again and,
 *   until the visitor decides, nothing non-essential runs.
 * - Any element with [data-consent-open] (the footer link «Configurar cookies») reopens the banner with the panel open.
 * - Revoking a category that was granted deletes its listed cookies and reloads the page, so no loaded tag keeps running.
 * - Optional data-log-endpoint on #py-consent: each decision is POSTed as JSON (registro-consentimientos.md); the server adds
 *   the timestamp of receipt and the hashed or truncated IP. A failed post never blocks the visitor.
 * - window.PyConsent = { get(), has(category), open() }; document dispatches "py-consent:change" with the record as detail.
 * - Without JavaScript nothing gated ever runs: the safe default.
 */
(function (root) {
  "use strict";

  var STORAGE_KEY = "py-consent";
  var SCHEMA = 1;
  var OPTIONAL = ["analytics", "marketing"];
  var ACTIONS = { accept: "accept_all", reject: "reject_all", save: "save_selection" };

  // ---- Pure core (no DOM): exported as PyConsentCore for tests. ----

  // Returns the stored record or null when it is missing or malformed. Never throws.
  function parse(raw) {
    if (typeof raw !== "string" || raw === "") return null;
    var r;
    try { r = JSON.parse(raw); } catch (e) { return null; }
    if (!r || typeof r !== "object" || r.schema !== SCHEMA) return null;
    if (typeof r.policy_version !== "string" || r.policy_version === "") return null;
    if (typeof r.consent_id !== "string" || r.consent_id === "") return null;
    if (!r.choices || r.choices.essential !== true) return null;
    for (var i = 0; i < OPTIONAL.length; i++) if (typeof r.choices[OPTIONAL[i]] !== "boolean") return null;
    return r;
  }

  // True when the visitor must be asked: no valid record, or a record of another policy version.
  function needsDecision(record, policyVersion) {
    return !record || record.policy_version !== policyVersion;
  }

  // A category is granted only by a record of the current policy version. Essential is always granted.
  function granted(record, category, policyVersion) {
    if (category === "essential") return true;
    if (OPTIONAL.indexOf(category) === -1) return false;
    if (needsDecision(record, policyVersion)) return false;
    return record.choices[category] === true;
  }

  // Builds the record that is stored and logged. Unknown categories are dropped; missing ones are false.
  function makeRecord(opts) {
    var choices = { essential: true };
    for (var i = 0; i < OPTIONAL.length; i++) choices[OPTIONAL[i]] = !!(opts.choices && opts.choices[OPTIONAL[i]] === true);
    return {
      schema: SCHEMA,
      consent_id: opts.consentId,
      policy_version: opts.policyVersion,
      decided_at: opts.now.toISOString(),
      source: opts.source,
      action: opts.action,
      choices: choices,
    };
  }

  // Choices for each first-layer action; "save" takes the panel checkboxes.
  function choicesFor(action, panelChoices) {
    var c = {};
    for (var i = 0; i < OPTIONAL.length; i++) {
      var k = OPTIONAL[i];
      c[k] = action === "accept" ? true : action === "reject" ? false : !!(panelChoices && panelChoices[k]);
    }
    return c;
  }

  // Categories that were granted by prev (in its own version) and are not granted by next.
  function revoked(prev, next) {
    var out = [];
    if (!prev) return out;
    for (var i = 0; i < OPTIONAL.length; i++) {
      var k = OPTIONAL[i];
      if (prev.choices[k] === true && !(next && next.choices[k] === true)) out.push(k);
    }
    return out;
  }

  // Cookie names that match a data-cookies list ("_ga,_ga_*").
  function matchCookies(list, cookieNames) {
    var patterns = String(list || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    return cookieNames.filter(function (name) {
      return patterns.some(function (p) { return p.charAt(p.length - 1) === "*" ? name.indexOf(p.slice(0, -1)) === 0 : name === p; });
    });
  }

  var core = {
    STORAGE_KEY: STORAGE_KEY, SCHEMA: SCHEMA, OPTIONAL: OPTIONAL.slice(), ACTIONS: ACTIONS,
    parse: parse, needsDecision: needsDecision, granted: granted, makeRecord: makeRecord, choicesFor: choicesFor,
    revoked: revoked, matchCookies: matchCookies,
  };
  root.PyConsentCore = core;
  if (!root.document) return;

  // ---- Browser part. ----
  var doc = root.document;

  function storageGet() {
    try { return root.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function storageSet(value) {
    try { root.localStorage.setItem(STORAGE_KEY, value); return true; } catch (e) { return false; }
  }
  // Random identifier of the browser's decision; it is not personal data and links log entries of the same browser.
  function newId() {
    var c = root.crypto;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
    var bytes = [];
    if (c && typeof c.getRandomValues === "function") bytes = Array.prototype.slice.call(c.getRandomValues(new Uint8Array(16)));
    else for (var i = 0; i < 16; i++) bytes.push(Math.floor(Math.random() * 256));
    return bytes.map(function (b) { return (b < 16 ? "0" : "") + b.toString(16); }).join("");
  }

  function cookieNames() {
    return doc.cookie ? doc.cookie.split(";").map(function (s) { return s.split("=")[0].trim(); }).filter(Boolean) : [];
  }
  // Deletes a cookie on the current host and on each parent domain (tags often set it on the registrable domain).
  function deleteCookie(name) {
    var parts = root.location.hostname.split(".");
    var expired = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    doc.cookie = expired;
    for (var i = 0; i < parts.length - 1; i++) doc.cookie = expired + "; domain=." + parts.slice(i).join(".");
  }

  function gated() {
    return Array.prototype.slice.call(doc.querySelectorAll("script[data-consent], iframe[data-consent]"));
  }

  var SKIP_ATTRS = { type: 1, "data-consent": 1, "data-src": 1, "data-cookies": 1, "data-consent-type": 1, "data-consent-done": 1 };
  function activateElement(el) {
    if (el.hasAttribute("data-consent-done")) return;
    el.setAttribute("data-consent-done", "");
    if (el.tagName === "IFRAME") {
      var src = el.getAttribute("data-src");
      if (src) el.setAttribute("src", src);
      return;
    }
    var live = doc.createElement("script");
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (!SKIP_ATTRS[a.name]) live.setAttribute(a.name, a.value);
    }
    var type = el.getAttribute("data-consent-type");
    if (type) live.type = type;
    var external = el.getAttribute("data-src");
    if (external) live.src = external;
    else live.text = el.text;
    el.parentNode.insertBefore(live, el.nextSibling);
  }

  function start() {
    var banner = doc.getElementById("py-consent");
    if (!banner) return;
    var version = banner.getAttribute("data-policy-version");
    // Fail closed: without a policy version nothing non-essential can be granted.
    if (!version) { if (root.console) root.console.error("py-consent: data-policy-version is missing"); return; }
    var current = parse(storageGet());
    var panel = banner.querySelector("[data-consent-panel]");
    var title = banner.querySelector("[data-consent-title]");
    var boxes = {};
    OPTIONAL.forEach(function (k) { boxes[k] = banner.querySelector('input[name="' + k + '"]'); });
    var opener = null;

    function button(action) { return banner.querySelector('[data-consent-action="' + action + '"]'); }
    function setPanel(open) {
      if (panel) panel.hidden = !open;
      var save = button("save"), configure = button("configure");
      if (save) save.hidden = !open;
      if (configure) configure.hidden = open;
    }
    // The first automatic show does not move focus; reopening from a link or open() does.
    function show(withPanel, moveFocus) {
      OPTIONAL.forEach(function (k) { if (boxes[k]) boxes[k].checked = granted(current, k, version); });
      setPanel(!!withPanel);
      banner.hidden = false;
      if (moveFocus && title) title.focus();
    }
    function hide() {
      banner.hidden = true;
      if (opener && typeof opener.focus === "function") opener.focus();
      opener = null;
    }
    function activate() {
      gated().forEach(function (el) { if (granted(current, el.getAttribute("data-consent"), version)) activateElement(el); });
    }
    function log(record) {
      var endpoint = banner.getAttribute("data-log-endpoint");
      if (!endpoint || typeof root.fetch !== "function") return;
      var body = {};
      for (var k in record) if (Object.prototype.hasOwnProperty.call(record, k)) body[k] = record[k];
      body.page = root.location.pathname;
      body.user_agent = root.navigator ? root.navigator.userAgent : "";
      try {
        root.fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true, credentials: "omit" })
          .catch(function () { /* the log is best effort; the decision stands */ });
      } catch (e) { /* same */ }
    }
    function decide(action, source) {
      var panelChoices = {};
      OPTIONAL.forEach(function (k) { panelChoices[k] = !!(boxes[k] && boxes[k].checked); });
      var prev = needsDecision(current, version) ? null : current;
      var record = makeRecord({
        choices: choicesFor(action, panelChoices), policyVersion: version, source: source, action: ACTIONS[action],
        consentId: (current && current.consent_id) || newId(), now: new Date(),
      });
      storageSet(JSON.stringify(record)); // when storage is blocked the decision lasts for this page view only
      current = record;
      log(record);
      hide();
      var lost = revoked(prev, record);
      if (lost.length) {
        var names = cookieNames();
        gated().forEach(function (el) {
          if (lost.indexOf(el.getAttribute("data-consent")) !== -1) matchCookies(el.getAttribute("data-cookies"), names).forEach(deleteCookie);
        });
        root.location.reload();
        return;
      }
      activate();
      if (typeof root.CustomEvent === "function") doc.dispatchEvent(new root.CustomEvent("py-consent:change", { detail: record }));
    }

    banner.addEventListener("click", function (ev) {
      var target = ev.target && ev.target.closest ? ev.target.closest("[data-consent-action]") : null;
      if (!target) return;
      var action = target.getAttribute("data-consent-action");
      if (action === "configure") { setPanel(true); var first = boxes[OPTIONAL[0]]; if (first) first.focus(); return; }
      if (ACTIONS[action]) decide(action, panel && !panel.hidden ? "panel" : "banner");
    });
    banner.addEventListener("keydown", function (ev) {
      // Escape closes only a reopened banner; a first visit needs a decision.
      if (ev.key === "Escape" && !needsDecision(current, version)) hide();
    });
    doc.addEventListener("click", function (ev) {
      var link = ev.target && ev.target.closest ? ev.target.closest("[data-consent-open]") : null;
      if (!link) return;
      ev.preventDefault();
      opener = link;
      show(true, true);
    });

    root.PyConsent = {
      get: function () { return needsDecision(current, version) ? null : current; },
      has: function (category) { return granted(current, category, version); },
      open: function () { show(true, true); },
    };

    if (needsDecision(current, version)) show(false, false);
    else activate();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof window !== "undefined" ? window : globalThis);
