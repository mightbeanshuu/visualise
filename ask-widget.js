/* ════════════════════════════════════════════════════════════════
   visualise · Ask-AI floating widget (vanilla JS, no deps)
   Posts {question, context} to /api/ask (Groq-backed serverless fn).
   No API key ever lives here — it stays server-side on Vercel.
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  if (window.__askWidgetLoaded) return;
  window.__askWidgetLoaded = true;

  var SPARKLE =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" ' +
    'fill="currentColor"/>' +
    '<path d="M18.5 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" ' +
    'fill="currentColor" opacity=".8"/></svg>';

  // ---- page context for relevant answers ----
  function pageContext() {
    var heading = "";
    var h1 = document.querySelector("h1, .htitle, header h1");
    if (h1 && h1.textContent) heading = h1.textContent.trim().replace(/\s+/g, " ");
    var title = (document.title || "").trim();
    var parts = [];
    if (title) parts.push(title);
    if (heading && heading !== title) parts.push(heading);
    return parts.join(" — ").slice(0, 400);
  }

  // ---- safe minimal markdown -> HTML (escape first, then format) ----
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function render(text) {
    var out = "";
    var parts = String(text).split(/```/); // odd indices are code blocks
    for (var i = 0; i < parts.length; i++) {
      if (i % 2 === 1) {
        var block = parts[i].replace(/^[a-zA-Z0-9_+-]*\n/, ""); // strip lang line
        out += "<pre><code>" + esc(block.replace(/\n$/, "")) + "</code></pre>";
      } else {
        var paras = parts[i].split(/\n{2,}/);
        for (var p = 0; p < paras.length; p++) {
          var chunk = paras[p];
          if (!chunk.trim()) continue;
          var html = esc(chunk).replace(/\n/g, "<br>");
          // inline `code`
          html = html.replace(/`([^`]+)`/g, function (_, c) { return "<code>" + c + "</code>"; });
          // **bold**
          html = html.replace(/\*\*([^*]+)\*\*/g, function (_, b) { return "<strong>" + b + "</strong>"; });
          out += "<p>" + html + "</p>";
        }
      }
    }
    return out;
  }

  var RESET_ICON =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M4 4v5h5" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M4 9a8 8 0 1 1-1 5" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---- build DOM ----
  var fab = document.createElement("button");
  fab.id = "ai-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "Ask AI about this pattern");
  fab.setAttribute("title", "Ask AI about this pattern");
  fab.innerHTML =
    '<span class="ai-fab-ico">' + SPARKLE + "</span>" +
    '<span class="ai-fab-label">Ask AI</span>';

  var panel = document.createElement("div");
  panel.id = "ai-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", "Ask AI about this pattern");
  panel.innerHTML =
    '<div class="ai-head">' +
      '<span class="ai-dot">' + SPARKLE + "</span>" +
      "<h3>Ask about this pattern" +
        '<span class="ai-sub">Powered by Groq · concise DSA tutor</span>' +
      "</h3>" +
      '<button id="ai-reset" class="ai-head-btn" type="button" ' +
        'aria-label="Reset panel position and size" title="Reset position & size">' + RESET_ICON + "</button>" +
      '<button id="ai-close" class="ai-head-btn" type="button" aria-label="Close">&times;</button>' +
    "</div>" +
    '<div class="ai-body">' +
      '<div class="ai-answer" id="ai-answer">' +
        '<span class="ai-placeholder">Ask anything about this pattern — intuition, approach, edge cases, or complexity.</span>' +
      "</div>" +
    "</div>" +
    '<div class="ai-foot">' +
      '<textarea id="ai-input" rows="2" aria-label="Your question" ' +
        'placeholder="e.g. Why does BFS give the shortest path on an unweighted graph?"></textarea>' +
      '<div class="ai-row">' +
        '<span class="ai-hint"><kbd>Ctrl/⌘ + Enter</kbd> to ask · <kbd>Esc</kbd> to close</span>' +
        '<button id="ai-send" type="button">Ask</button>' +
      "</div>" +
    "</div>" +
    '<span class="ai-grip" aria-hidden="true"></span>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var input = panel.querySelector("#ai-input");
  var sendBtn = panel.querySelector("#ai-send");
  var answer = panel.querySelector("#ai-answer");
  var closeBtn = panel.querySelector("#ai-close");
  var resetBtn = panel.querySelector("#ai-reset");
  var head = panel.querySelector(".ai-head");

  // ---- movable + resizable + persisted geometry ----
  var STORE_KEY = "vx_ask_panel";
  var placed = false; // becomes true once we pin via left/top (vs default right/bottom)

  function loadGeom() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var g = JSON.parse(raw);
      if (g && typeof g.left === "number" && typeof g.top === "number") return g;
    } catch (e) {}
    return null;
  }
  function saveGeom() {
    if (!placed) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        left: panel.offsetLeft, top: panel.offsetTop,
        w: panel.offsetWidth, h: panel.offsetHeight,
      }));
    } catch (e) {}
  }
  function clampToViewport() {
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var maxL = Math.max(0, window.innerWidth - w);
    var maxT = Math.max(0, window.innerHeight - h);
    var l = Math.min(Math.max(panel.offsetLeft, 0), maxL);
    var t = Math.min(Math.max(panel.offsetTop, 0), maxT);
    panel.style.left = l + "px";
    panel.style.top = t + "px";
  }
  // pin the panel using left/top so dragging/resizing has a single source of truth
  function pin(left, top) {
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.left = left + "px";
    panel.style.top = top + "px";
    placed = true;
  }
  function applyGeom(g) {
    if (g.w) panel.style.width = g.w + "px";
    if (g.h) panel.style.height = g.h + "px";
    pin(g.left, g.top);
    clampToViewport();
  }
  function resetGeom() {
    placed = false;
    panel.style.left = panel.style.top = "";
    panel.style.right = panel.style.bottom = "";
    panel.style.width = panel.style.height = "";
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
  }

  // drag via header (pointer events)
  var drag = null;
  head.addEventListener("pointerdown", function (e) {
    if (e.target.closest("button")) return; // let header buttons work
    var r = panel.getBoundingClientRect();
    if (!placed) pin(r.left, r.top); // convert from right/bottom anchor first
    drag = { dx: e.clientX - panel.offsetLeft, dy: e.clientY - panel.offsetTop };
    head.classList.add("ai-dragging");
    head.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  head.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var l = Math.min(Math.max(e.clientX - drag.dx, 0), Math.max(0, window.innerWidth - w));
    var t = Math.min(Math.max(e.clientY - drag.dy, 0), Math.max(0, window.innerHeight - h));
    panel.style.left = l + "px";
    panel.style.top = t + "px";
  });
  function endDrag(e) {
    if (!drag) return;
    drag = null;
    head.classList.remove("ai-dragging");
    try { head.releasePointerCapture(e.pointerId); } catch (er) {}
    saveGeom();
  }
  head.addEventListener("pointerup", endDrag);
  head.addEventListener("pointercancel", endDrag);

  // persist size changes from native resize:both.
  // Distinguish a real user resize from layout noise (display toggle, reset)
  // by comparing against the natural default size, so reset isn't clobbered.
  var naturalW = 0, naturalH = 0;
  if (typeof ResizeObserver !== "undefined") {
    var rzTimer = null;
    new ResizeObserver(function () {
      if (!panel.classList.contains("ai-show")) return;
      if (placed) { // already pinned (dragged or restored): persist any resize
        clearTimeout(rzTimer);
        rzTimer = setTimeout(saveGeom, 200);
        return;
      }
      var w = panel.offsetWidth, h = panel.offsetHeight;
      if (!naturalW) { naturalW = w; naturalH = h; return; } // capture baseline
      if (Math.abs(w - naturalW) > 2 || Math.abs(h - naturalH) > 2) {
        var r = panel.getBoundingClientRect(); // user actually resized → pin + save
        pin(r.left, r.top);
        clearTimeout(rzTimer);
        rzTimer = setTimeout(saveGeom, 200);
      }
    }).observe(panel);
  }
  window.addEventListener("resize", function () { if (placed) clampToViewport(); });

  function open() {
    var g = loadGeom();
    if (g) applyGeom(g);
    panel.classList.add("ai-show");
    fab.classList.add("ai-open");
    setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    panel.classList.remove("ai-show");
    fab.classList.remove("ai-open");
    fab.focus();
  }

  var loading = false;
  function setLoading(on) {
    loading = on;
    sendBtn.disabled = on;
    sendBtn.textContent = on ? "Asking…" : "Ask";
  }

  async function ask() {
    if (loading) return;
    var q = (input.value || "").trim();
    if (!q) { input.focus(); return; }
    if (q.length > 2000) {
      answer.className = "ai-answer ai-error";
      answer.textContent = "Question too long (max 2000 characters).";
      return;
    }
    setLoading(true);
    answer.className = "ai-answer";
    answer.innerHTML =
      '<span class="ai-loading">Thinking<span class="ai-dots"><i></i><i></i><i></i></span></span>';
    try {
      var res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context: pageContext() }),
      });
      var data = null;
      try { data = await res.json(); } catch (e) { data = null; }
      if (!res.ok || !data || !data.answer) {
        var msg = (data && (data.error || data.detail)) ||
          ("Request failed (" + res.status + ").");
        if (data && data.error && data.detail) msg = data.error + " — " + data.detail;
        answer.className = "ai-answer ai-error";
        answer.textContent = msg;
        return;
      }
      answer.className = "ai-answer";
      answer.innerHTML = render(data.answer);
    } catch (err) {
      answer.className = "ai-answer ai-error";
      answer.textContent = "Network error: " + (err && err.message ? err.message : err);
    } finally {
      setLoading(false);
    }
  }

  // ---- events ----
  fab.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  resetBtn.addEventListener("click", function () { resetGeom(); input.focus(); });
  sendBtn.addEventListener("click", ask);
  input.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); ask(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("ai-show")) close();
  });
})();
