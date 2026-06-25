/* ════════════════════════════════════════════════════════════════
   visualise · shared practice column + activity heatmap
   - Per-pattern practice list: GFG → LeetCode → NeetCode direct links
     (order is deliberate: learn the pattern at GFG, then grind LC/NeetCode)
   - A "done" checkbox per problem, persisted in localStorage.
   - A GitHub-style activity heatmap built from completion dates.
   - If the Supabase auth layer is present and a user is signed in
     (window.vAuth.user()), completions are mirrored to a
     `practice_progress` table (best-effort, never blocks the UI).

   USAGE (from a hub page):
     // 1) one <script src="/practice.js"> in <head> or before </body>
     // 2) build a block for the current pattern:
     el.innerHTML = VXPractice.practiceBlock(patternId, [
        {name:'Network Delay Time', diff:'Medium',
         gfg:'https://www.geeksforgeeks.org/...',
         lc :'https://leetcode.com/problems/network-delay-time/',
         neet:'https://neetcode.io/problems/network-delay-time'},
        ...
     ]);
     // 3) (optional) a heatmap anywhere:
     host.innerHTML = VXPractice.heatmapBlock();
     // 4) wire interactions (idempotent — safe to call after every render):
     VXPractice.wire(rootEl || document);
   ════════════════════════════════════════════════════════════════ */
(function () {
  var KEY = "vx_practice_v1";
  var CSS = "/practice.css";

  /* auto-inject the stylesheet once */
  if (!document.querySelector('link[href="' + CSS + '"]')) {
    var l = document.createElement("link");
    l.rel = "stylesheet"; l.href = CSS;
    document.head.appendChild(l);
  }

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function today() { return new Date().toISOString().slice(0, 10); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function idOf(patternId, name) { return slug(patternId) + "__" + slug(name); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ---- vector icons (currentColor) ---- */
  var IC = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    book:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    code:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    play:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    dumb:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
  };

  function diffClass(d) { d = (d || "").toLowerCase(); return d === "easy" || d === "medium" || d === "hard" ? d : ""; }

  /* ---- render one pattern's practice block ---- */
  function practiceBlock(patternId, problems) {
    if (!problems || !problems.length) return "";
    var store = load();
    var doneN = 0;
    var rows = problems.map(function (p) {
      var id = idOf(patternId, p.name);
      var done = !!store[id];
      if (done) doneN++;
      var links = "";
      if (p.gfg)  links += '<a class="vxp-lnk gfg"  href="' + esc(p.gfg)  + '" target="_blank" rel="noopener" title="Practice on GeeksforGeeks">' + IC.book + '<span class="vxp-lbl">GFG</span></a>';
      if (p.lc)   links += '<a class="vxp-lnk lc"   href="' + esc(p.lc)   + '" target="_blank" rel="noopener" title="Solve on LeetCode">'        + IC.code + '<span class="vxp-lbl">LC</span></a>';
      if (p.neet) links += '<a class="vxp-lnk neet" href="' + esc(p.neet) + '" target="_blank" rel="noopener" title="Watch on NeetCode">'         + IC.play + '<span class="vxp-lbl">NeetCode</span></a>';
      var dc = diffClass(p.diff);
      return '<div class="vxp-row' + (done ? " done" : "") + '" data-pid="' + esc(id) + '">' +
               '<button class="vxp-chk" role="checkbox" aria-checked="' + done + '" aria-label="Mark ' + esc(p.name) + ' done">' + IC.check + '</button>' +
               '<span class="vxp-name" title="' + esc(p.name) + '">' + esc(p.name) + '</span>' +
               (dc ? '<span class="vxp-diff ' + dc + '">' + esc(p.diff) + '</span>' : '') +
               '<span class="vxp-links">' + links + '</span>' +
             '</div>';
    }).join("");
    return '<div class="vxp-wrap">' +
      '<div class="vxp-head">' + IC.dumb + ' Practice — GFG · LeetCode · NeetCode' +
        '<span class="vxp-prog"><b class="vxp-doneN">' + doneN + '</b> / ' + problems.length + ' done</span>' +
      '</div><div class="vxp-list">' + rows + '</div></div>';
  }

  /* ---- heatmap from completion dates ---- */
  function heatmapBlock(weeks) {
    weeks = weeks || 17;
    var days = weeks * 7;
    var store = load();
    var counts = {};
    Object.keys(store).forEach(function (k) { var d = store[k]; counts[d] = (counts[d] || 0) + 1; });

    // align grid so the last column ends today, rows = weekday (0=Sun)
    var end = new Date(); end.setHours(0, 0, 0, 0);
    var endDow = end.getDay();
    var cells = [];
    var total = 0;
    // walk back from today, pad the trailing week to a full column
    var start = new Date(end); start.setDate(start.getDate() - (days - 1) - (6 - endDow));
    var cur = new Date(start);
    var last = new Date(end); last.setDate(last.getDate() + (6 - endDow));
    while (cur <= last) {
      var iso = cur.toISOString().slice(0, 10);
      var c = (cur <= end) ? (counts[iso] || 0) : -1; // -1 = future filler
      if (c > 0) total += c;
      var lvl = c <= 0 ? "" : c >= 6 ? "l4" : c >= 4 ? "l3" : c >= 2 ? "l2" : "l1";
      cells.push('<div class="vxp-cell ' + (c < 0 ? "" : lvl) + '"' +
        (c > 0 ? ' title="' + c + ' on ' + iso + '"' : '') + (c < 0 ? ' style="visibility:hidden"' : '') + '></div>');
      cur.setDate(cur.getDate() + 1);
    }
    return '<div class="vxp-heat" id="vxp-heat-host">' +
      '<div class="vxp-head">' + IC.flame + ' Practice activity' +
        '<span class="vxp-prog"><b>' + total + '</b> in last ' + weeks + ' weeks</span></div>' +
      '<div class="vxp-grid">' + cells.join("") + '</div>' +
      '<div class="vxp-legend">less <span class="vxp-cell"></span><span class="vxp-cell l1"></span>' +
        '<span class="vxp-cell l2"></span><span class="vxp-cell l3"></span><span class="vxp-cell l4"></span> more</div>' +
    '</div>';
  }

  function refreshHeatmap() {
    var host = document.getElementById("vxp-heat-host");
    if (host) host.outerHTML = heatmapBlock();
  }

  /* ---- best-effort Supabase mirror ---- */
  function syncRemote(id, doneAt) {
    try {
      var a = window.vAuth, u = a && a.user && a.user();
      if (!u || !a.client) return;
      if (doneAt) {
        a.client.from("practice_progress").upsert(
          { user_id: u.id, prob_id: id, done_at: doneAt },
          { onConflict: "user_id,prob_id" }
        ).then(function () {}, function () {});
      } else {
        a.client.from("practice_progress").delete()
          .eq("user_id", u.id).eq("prob_id", id).then(function () {}, function () {});
      }
    } catch (e) {}
  }

  function toggle(id) {
    var store = load();
    var nowDone = !store[id];
    if (nowDone) store[id] = today(); else delete store[id];
    save(store);
    syncRemote(id, nowDone ? store[id] : null);
    return nowDone;
  }

  /* ---- wire interactions (idempotent) ---- */
  function wire(root) {
    root = root || document;
    root.querySelectorAll(".vxp-row").forEach(function (row) {
      if (row.getAttribute("data-vxp-bound")) return;
      row.setAttribute("data-vxp-bound", "1");
      var chk = row.querySelector(".vxp-chk");
      chk.addEventListener("click", function () {
        var done = toggle(row.getAttribute("data-pid"));
        row.classList.toggle("done", done);
        chk.setAttribute("aria-checked", String(done));
        // update the nearest progress counter
        var wrap = row.closest(".vxp-wrap");
        if (wrap) {
          var n = wrap.querySelectorAll(".vxp-row.done").length;
          var el = wrap.querySelector(".vxp-doneN");
          if (el) el.textContent = n;
        }
        refreshHeatmap();
      });
    });
  }

  window.VXPractice = {
    practiceBlock: practiceBlock,
    heatmapBlock: heatmapBlock,
    refreshHeatmap: refreshHeatmap,
    wire: wire,
    _id: idOf
  };
})();
