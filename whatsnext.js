/* ════════════════════════════════════════════════════════════════
   visualise · "What's next" cards
   After every pattern (below the prev/next nav) inject hub-style cards:
     • "Next pattern →"  (advances within this hub) — or "Browse all
       topics" if you're on the last pattern
     • two other topic hubs to jump to
   Re-injected on each pattern render via a MutationObserver.
   ════════════════════════════════════════════════════════════════ */
(function () {
  var HUBS = [
    { href: "/graphs/",      t: "Graphs",              d: "BFS, DFS & weighted shortest paths.",        a: "0,229,255"  },
    { href: "/arrays/",      t: "Arrays & Hashing",    d: "Two pointers, sliding window, binary search.", a: "0,229,255"  },
    { href: "/trees/",       t: "Trees",               d: "Traversals, depth, LCA, validate BST.",      a: "93,255,143" },
    { href: "/heap/",        t: "Heap / Priority Queue", d: "Heapify, push, pop, heap sort, top-K.",    a: "255,209,102"},
    { href: "/dp/",          t: "Dynamic Programming",  d: "Tables that fill cell by cell.",            a: "124,147,255"},
    { href: "/stack-queue/", t: "Stack & Queue",        d: "Monotonic stack, queues, parsing.",         a: "56,189,248" },
    { href: "/linked-list/", t: "Linked List",          d: "Reverse, cycle, middle, palindrome.",       a: "255,90,205" },
    { href: "/tries/",       t: "Tries",                d: "Prefix trees, wildcard DFS, word break.",   a: "0,229,255"  },
    { href: "/backtracking/", t: "Backtracking",        d: "Subsets, permutations, N-Queens.",          a: "255,90,205" },
    { href: "/greedy/",      t: "Greedy",               d: "Exchange arguments, scheduling, jumps.",    a: "93,255,143" },
    { href: "/intervals/",   t: "Intervals",            d: "Merge, insert, sweep overlaps.",            a: "255,159,10" },
    { href: "/bit-manipulation/", t: "Bit Manipulation", d: "XOR, masks, set bits, bit tries.",         a: "191,90,242" },
    { href: "/math-geometry/", t: "Math & Geometry",    d: "GCD, sieve, matrices, geometry.",           a: "124,147,255"}
  ];

  injectStyle();
  var mainEl = document.getElementById("main") || document.body;
  new MutationObserver(tryInject).observe(mainEl, { childList: true, subtree: true });
  tryInject();

  function currentBase() {
    var seg = location.pathname.split("/").filter(Boolean)[0] || "";
    return "/" + seg + "/";
  }

  function tryInject() {
    var pnav = document.querySelector("#main .pnav");
    if (!pnav) return;
    if (pnav.parentNode.querySelector(".vx-next")) return;   // already added this render

    var base = currentBase();
    var others = HUBS.filter(function (h) { return h.href.indexOf(base) !== 0 && base.indexOf(h.href) !== 0; }).slice(0, 2);
    if (others.length < 2) others = HUBS.filter(function (h) { return h.href !== base; }).slice(0, 2);

    var nextBtn = document.querySelector("#main #nextBtn");
    var hasNext = nextBtn && !nextBtn.disabled;

    var cards = "";
    cards += hasNext
      ? card({ kind: "next", t: "Next pattern", d: "Continue to the next pattern in this hub.", a: "0,229,255", cta: "Continue →" })
      : card({ kind: "all", href: "/", t: "Browse all topics", d: "You've reached the end of this hub — explore the rest.", a: "124,147,255", cta: "All topics →" });
    others.forEach(function (h) {
      cards += card({ kind: "hub", href: h.href, t: h.t, d: h.d, a: h.a, cta: "Open " + h.t.split(" ")[0] + " hub →" });
    });

    var wrap = document.createElement("div");
    wrap.className = "vx-next fade";
    wrap.innerHTML = '<div class="vx-next-h">WHAT’S NEXT</div><div class="vx-next-grid">' + cards + "</div>";
    pnav.insertAdjacentElement("afterend", wrap);

    var nc = wrap.querySelector('[data-kind="next"]');
    if (nc) nc.addEventListener("click", function () { if (nextBtn) nextBtn.click(); });
  }

  function card(o) {
    var clickable = o.kind === "next";
    var tag = (o.href && !clickable) ? "a" : "div";
    var href = (o.href && !clickable) ? ' href="' + o.href + '"' : "";
    return "<" + tag + href + ' class="vx-card" data-kind="' + o.kind + '" style="--a:' + o.a + '">' +
      '<div class="vx-card-t">' + esc(o.t) + "</div>" +
      '<div class="vx-card-d">' + esc(o.d) + "</div>" +
      '<div class="vx-card-cta">' + esc(o.cta) + "</div>" +
      "</" + tag + ">";
  }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function injectStyle() {
    var st = document.createElement("style");
    st.textContent =
      ".vx-next{margin:24px 0 8px;}" +
      ".vx-next-h{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;font-weight:700;color:#5a6675;margin:0 0 12px;}" +
      ".vx-next-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}" +
      "@media(max-width:760px){.vx-next-grid{grid-template-columns:1fr;}}" +
      ".vx-card{position:relative;display:flex;flex-direction:column;gap:7px;text-decoration:none;color:inherit;cursor:pointer;" +
        "padding:16px 17px;border-radius:16px;border:1px solid rgba(var(--a),.22);overflow:hidden;" +
        "background:linear-gradient(180deg,rgba(var(--a),.06),rgba(255,255,255,.03));" +
        "-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);" +
        "box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 10px 30px rgba(0,0,0,.34);" +
        "transition:transform .22s cubic-bezier(.2,.7,.3,1),border-color .22s,box-shadow .22s;}" +
      ".vx-card:hover{transform:translateY(-4px);border-color:rgba(var(--a),.6);" +
        "box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 18px 40px rgba(0,0,0,.45),0 0 26px rgba(var(--a),.12);}" +
      ".vx-card-t{font-size:15px;font-weight:600;letter-spacing:-.3px;color:#eef2f8;}" +
      ".vx-card-d{font-size:12px;line-height:1.5;color:#90a0b3;}" +
      ".vx-card-cta{margin-top:auto;font-size:12.5px;font-weight:600;color:rgb(var(--a));padding-top:6px;}";
    document.head.appendChild(st);
  }
})();
