/* ════════════════════════════════════════════════════════════════
   visualise · auth layer (Supabase, no-build / CDN)
   - Gates every hub page: landing ("/") and "/login" stay public,
     everything else requires a signed-in user.
   - Floating auth chip (bottom-right) with the user's email + Log out.
   - Logs login / logout events to the `auth_events` table in your DB.
   - FAILS OPEN: if supabase-config.js still has placeholders, the gate
     is disabled so the site never locks itself out before you add keys.
   ════════════════════════════════════════════════════════════════ */
(function () {
  var cfg = window.SUPABASE_CONFIG || {};
  var configured = !!(cfg.url && cfg.anonKey &&
    cfg.url.indexOf("YOUR-") === -1 && cfg.anonKey.indexOf("YOUR-") === -1);

  var path = location.pathname;
  var isLogin   = path.indexOf("/login") === 0;
  var isLanding = path === "/" || path === "/index.html";
  var gated = configured && !isLogin && !isLanding;

  /* ---- instant overlay on gated pages (prevents content flash) ---- */
  if (gated) injectOverlay();

  if (!configured) { return; }            // demo mode → no gate, no chip

  /* ---- load the Supabase UMD client, then boot ---- */
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  s.onload = boot;
  s.onerror = function () { removeOverlay(); };   // never trap the user
  document.head.appendChild(s);

  var sb, lastUser = null;

  function boot() {
    sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    window.vAuth = {
      client: sb,
      signOut: function () { return sb.auth.signOut(); },
      user: function () { return lastUser; }
    };

    sb.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (gated && !session) {
        location.replace("/login?next=" + encodeURIComponent(path + location.search + location.hash));
        return;
      }
      lastUser = session ? session.user : null;
      removeOverlay();
      mountChip(session);
    });

    sb.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_IN") {
        lastUser = session.user;
        // log once per browser session to avoid token-refresh spam
        if (!sessionStorage.getItem("v_logged_in")) {
          sessionStorage.setItem("v_logged_in", "1");
          logEvent("login", session.user);
        }
      } else if (event === "SIGNED_OUT") {
        logEvent("logout", lastUser);
        sessionStorage.removeItem("v_logged_in");
        lastUser = null;
        if (!isLanding && !isLogin) { location.replace("/login"); return; }
      }
      mountChip(session);
    });
  }

  function logEvent(type, user) {
    if (!sb || !user) return;
    try {
      sb.from("auth_events").insert({
        event: type,
        user_id: user.id,
        email: user.email,
        path: location.pathname,
        user_agent: navigator.userAgent
      }).then(function () {}, function () {});   // best-effort
    } catch (e) {}
  }

  /* ---- floating auth chip ---- */
  function mountChip(session) {
    injectChipStyle();
    var el = document.getElementById("vauth");
    if (!el) { el = document.createElement("div"); el.id = "vauth"; document.body.appendChild(el); }
    if (session) {
      el.innerHTML =
        '<span class="vauth-dot"></span>' +
        '<span class="vauth-email" title="' + esc(session.user.email) + '">' + esc(session.user.email) + '</span>' +
        '<button class="vauth-btn" id="vauthOut">Log out</button>';
      el.querySelector("#vauthOut").onclick = function () { sb.auth.signOut(); };
    } else {
      el.innerHTML = '<a class="vauth-btn solid" href="/login?next=' +
        encodeURIComponent(path) + '">Log in</a>';
    }
  }

  function esc(t){ return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  /* ---- styles ---- */
  function injectOverlay() {
    var st = document.createElement("style");
    st.textContent =
      "#vauth-ov{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;" +
      "background:#06080c;color:#90a0b3;font-family:'Inter',system-ui,sans-serif;letter-spacing:.3px}" +
      "#vauth-ov .sp{width:34px;height:34px;border-radius:50%;border:3px solid #1b2533;border-top-color:#00e5ff;animation:vspin .8s linear infinite}" +
      "@keyframes vspin{to{transform:rotate(360deg)}}";
    document.head.appendChild(st);
    var ov = document.createElement("div");
    ov.id = "vauth-ov";
    ov.innerHTML = '<div class="sp"></div><div>Checking access…</div>';
    (document.body || document.documentElement).appendChild(ov);
  }
  function removeOverlay() { var o = document.getElementById("vauth-ov"); if (o) o.remove(); }

  function injectChipStyle() {
    if (document.getElementById("vauth-style")) return;
    var st = document.createElement("style");
    st.id = "vauth-style";
    st.textContent =
      "#vauth{position:fixed;right:16px;bottom:16px;z-index:60;display:flex;align-items:center;gap:9px;" +
      "padding:7px 9px 7px 13px;border-radius:30px;background:rgba(12,16,22,.86);border:1px solid #1e2a38;" +
      "backdrop-filter:blur(10px);box-shadow:0 8px 30px rgba(0,0,0,.4);font-family:'Inter',system-ui,sans-serif}" +
      "#vauth .vauth-dot{width:7px;height:7px;border-radius:50%;background:#5dff8f;box-shadow:0 0 8px #5dff8f}" +
      "#vauth .vauth-email{font-size:12px;color:#c9d1d9;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
      "#vauth .vauth-btn{font-size:12px;font-weight:600;color:#90a0b3;background:transparent;border:1px solid #2a3645;" +
      "border-radius:18px;padding:5px 12px;cursor:pointer;text-decoration:none;transition:.15s;font-family:inherit}" +
      "#vauth .vauth-btn:hover{color:#fff;border-color:#475569}" +
      "#vauth .vauth-btn.solid{color:#06220f;background:#5dff8f;border-color:#5dff8f}" +
      "@media(max-width:560px){#vauth .vauth-email{max-width:96px}}";
    document.head.appendChild(st);
  }
})();

/* ---- LimitPlane beacon ----------------------------------------------------
   Reports each page view to a locally running LimitPlane gateway
   (github.com/mightbeanshuu/LimitPlane) so real visualise traffic shows up
   on its live dashboard. Fails silently when no gateway is listening, so
   normal visitors never notice it. Change the origin if the gateway moves. */
(function () {
  var url = "http://localhost:3000/b?k=lp_visualise_a91f3c&p=" + encodeURIComponent(location.pathname);
  function fire(opts) { return fetch(url, opts); }
  try {
    /* Chrome gates public-site -> localhost behind Local Network Access:
       the request must be tagged with targetAddressSpace, and the browser
       shows a one-time permission prompt. Fall back for other browsers. */
    fire({ mode: "no-cors", targetAddressSpace: "local" })
      .catch(function () { return fire({ mode: "no-cors", targetAddressSpace: "private" }); })
      .catch(function () { return fire({ mode: "no-cors" }); })
      .catch(function () {});
  } catch (e) {
    try { fire({ mode: "no-cors" }).catch(function () {}); } catch (e2) {}
  }
})();
