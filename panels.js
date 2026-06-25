/* ════════════════════════════════════════════════════════════════
   visualise · resizable / movable / lockable main panels
   Targets the two main-area panels — Animation (.demo) and Code
   (.codeCol) — inside #split. You can:
     • drag a panel's grip (or ↑ / ↓) to reorder it up/down
     • drag a panel's bottom-right corner to resize its height
     • hit the floating Lock button to freeze the whole layout
   State (order / heights / locked) is saved in localStorage and
   re-applied every time a pattern re-renders.
   ════════════════════════════════════════════════════════════════ */
(function () {
  var KEY = "vx_panels_v1";
  var TITLES = { demo: "Animation", code: "Code" };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var state = load();
  if (!Array.isArray(state.order)) state.order = ["demo", "code"];
  if (!state.heights) state.heights = {};
  state.locked = !!state.locked;

  injectStyle();
  var lockBtn = makeLockBtn();

  /* re-enhance whenever #main re-renders */
  var mainEl = document.getElementById("main") || document.body;
  var obs = new MutationObserver(function () { enhance(); });
  obs.observe(mainEl, { childList: true, subtree: true });
  enhance();

  /* capture native-resize heights on release */
  document.addEventListener("pointerup", function () {
    var split = document.querySelector("#main #split"); if (!split) return;
    panelsIn(split).forEach(function (p) {
      var k = keyOf(p);
      if (p.style.height) { state.heights[k] = p.style.height; }
    });
    save(state);
  });

  function panelsIn(split) {
    return [].slice.call(split.children).filter(function (c) {
      return c.classList.contains("demo") || c.classList.contains("codeCol");
    });
  }
  function keyOf(p) { return p.classList.contains("demo") ? "demo" : "code"; }

  /* return the direct-child .vx-bar elements of a panel (newest-first not
     guaranteed — order is DOM order) */
  function barsOf(p) {
    return [].slice.call(p.children).filter(function (c) {
      return c.classList && c.classList.contains("vx-bar");
    });
  }

  function enhance() {
    var split = document.querySelector("#main #split");
    if (!split) return;

    /* Pause the observer while we mutate the DOM, so our own inserts/removes
       can never re-trigger enhance() and stack a second bar. Always reconnect
       in finally, even if something throws mid-way. */
    obs.disconnect();
    try {
      split.classList.add("vx-split");

      var panels = panelsIn(split);
      panels.forEach(function (p) {
        var k = keyOf(p);

        /* Idempotent guard: at most ONE .vx-bar per panel. If extras exist
           (from an earlier double-fire), drop all but the first. If a bar is
           already present, this panel is enhanced — just make sure it's the
           first child and skip re-binding. */
        var bars = barsOf(p);
        if (bars.length) {
          for (var i = 1; i < bars.length; i++) { p.removeChild(bars[i]); }
          if (p.firstChild !== bars[0]) p.insertBefore(bars[0], p.firstChild);
          return;
        }

        // handle bar
        var bar = document.createElement("div");
        bar.className = "vx-bar";
        bar.draggable = true;
        bar.innerHTML =
          '<span class="vx-grip" aria-hidden="true">⠿</span>' +
          '<span class="vx-title">' + (TITLES[k] || k) + '</span>' +
          '<span class="vx-hint">drag corner ⤡ to resize</span>' +
          '<span class="vx-moves">' +
            '<button class="vx-mv vx-up" title="Move up" aria-label="Move panel up">↑</button>' +
            '<button class="vx-mv vx-down" title="Move down" aria-label="Move panel down">↓</button>' +
          '</span>';
        p.insertBefore(bar, p.firstChild);

        bar.querySelector(".vx-up").onclick = function () { move(split, p, -1); };
        bar.querySelector(".vx-down").onclick = function () { move(split, p, 1); };

        // drag-to-reorder
        bar.addEventListener("dragstart", function (e) {
          if (state.locked) { e.preventDefault(); return; }
          e.dataTransfer.setData("text/plain", k); split.classList.add("vx-dragging");
        });
        bar.addEventListener("dragend", function () { split.classList.remove("vx-dragging"); });

        /* p-level drop/dragover listeners bound once per panel node */
        if (!p.getAttribute("data-vx-bound")) {
          p.setAttribute("data-vx-bound", "1");
          p.addEventListener("dragover", function (e) { if (!state.locked) e.preventDefault(); });
          p.addEventListener("drop", function (e) {
            e.preventDefault();
            var from = e.dataTransfer.getData("text/plain"); if (!from || from === keyOf(p)) return;
            var dragged = panelsIn(split).filter(function (x) { return keyOf(x) === from; })[0];
            if (dragged) { split.insertBefore(dragged, p); commitOrder(split); }
          });
        }
      });

      applyState(split);
    } finally {
      /* reconnect — resume watching for the next real re-render */
      obs.observe(mainEl, { childList: true, subtree: true });
    }
  }

  function move(split, p, dir) {
    if (state.locked) return;
    if (dir < 0 && p.previousElementSibling) split.insertBefore(p, p.previousElementSibling);
    if (dir > 0 && p.nextElementSibling) split.insertBefore(p.nextElementSibling, p);
    commitOrder(split);
  }

  function commitOrder(split) {
    state.order = panelsIn(split).map(keyOf);
    save(state);
  }

  function applyState(split) {
    // order
    var byKey = {}; panelsIn(split).forEach(function (p) { byKey[keyOf(p)] = p; });
    state.order.forEach(function (k) { if (byKey[k]) split.appendChild(byKey[k]); });
    // sizes + resize affordance + lock
    panelsIn(split).forEach(function (p) {
      var k = keyOf(p);
      p.style.minHeight = "220px";
      p.style.overflow = "auto";
      p.style.resize = state.locked ? "none" : "vertical";
      if (state.heights[k]) p.style.height = state.heights[k];
    });
    split.classList.toggle("vx-locked", state.locked);
    lockBtn.update();
  }

  function makeLockBtn() {
    var b = document.createElement("button");
    b.id = "vx-lock";
    b.onclick = function () {
      state.locked = !state.locked; save(state);
      var split = document.querySelector("#main #split"); if (split) applyState(split);
      b.update();
    };
    b.update = function () {
      b.className = state.locked ? "locked" : "";
      b.innerHTML = state.locked
        ? '<span class="i">🔒</span> Layout locked'
        : '<span class="i">🔓</span> Lock layout';
      b.title = state.locked ? "Click to unlock and rearrange panels" : "Arrange panels, then lock";
    };
    b.update();
    (document.body || document.documentElement).appendChild(b);
    return b;
  }

  function injectStyle() {
    var st = document.createElement("style");
    st.textContent =
      "#main #split.vx-split{display:flex !important;flex-direction:column !important;gap:14px !important;}" +
      "#main #split.vx-split > .demo,#main #split.vx-split > .codeCol{position:relative;}" +
      ".vx-bar{display:flex;align-items:center;gap:10px;margin:-4px -4px 12px;padding:7px 10px;cursor:grab;" +
        "border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);" +
        "-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);user-select:none;}" +
      ".vx-bar:active{cursor:grabbing;}" +
      ".vx-grip{color:#5a6675;font-size:14px;letter-spacing:-2px;}" +
      ".vx-title{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;color:#c9d1d9;}" +
      ".vx-hint{font-size:10px;color:#5a6675;margin-left:4px;}" +
      ".vx-moves{margin-left:auto;display:flex;gap:6px;}" +
      ".vx-mv{width:24px;height:24px;border-radius:7px;cursor:pointer;font-size:13px;line-height:1;" +
        "color:#90a0b3;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);transition:.15s;}" +
      ".vx-mv:hover{color:#fff;background:rgba(255,255,255,.12);}" +
      ".vx-split.vx-locked .vx-moves,.vx-split.vx-locked .vx-hint{display:none;}" +
      ".vx-split.vx-locked .vx-bar{cursor:default;opacity:.8;}" +
      ".vx-split.vx-dragging > .demo,.vx-split.vx-dragging > .codeCol{outline:1px dashed rgba(0,229,255,.4);outline-offset:3px;border-radius:16px;}" +
      "#vx-lock{position:fixed;left:16px;bottom:16px;z-index:60;display:inline-flex;align-items:center;gap:7px;" +
        "font-family:'Inter',system-ui,sans-serif;font-size:12px;font-weight:600;color:#90a0b3;cursor:pointer;" +
        "padding:8px 13px;border-radius:30px;background:rgba(12,16,22,.86);border:1px solid #1e2a38;" +
        "-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 8px 30px rgba(0,0,0,.4);transition:.16s;}" +
      "#vx-lock:hover{color:#fff;border-color:#475569;}" +
      "#vx-lock.locked{color:#5dff8f;border-color:rgba(93,255,143,.4);}" +
      "#vx-lock .i{font-size:13px;}" +
      "@media(max-width:860px){#vx-lock{left:12px;bottom:64px;}}";
    document.head.appendChild(st);
  }
})();
