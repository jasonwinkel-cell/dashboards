// Offers a reload when a newer version of this page has been published.
// Data on the pages refreshes on its own, but new page code only loads on a full reload,
// so a page left open (or an installed app) could otherwise keep running an old version.
(() => {
  const meta = document.querySelector('meta[name="app-version"]');
  const current = meta && meta.content;
  if (!current) return;
  let shown = false, busy = false;
  async function check() {
    if (shown || busy || document.hidden) return;
    busy = true;
    try {
      const r = await fetch(location.pathname + "?v=" + Date.now(), { cache: "no-store" });
      if (r.ok) {
        const m = (await r.text()).match(/<meta name="app-version" content="([^"]+)"/);
        if (m && m[1] !== current) show();
      }
    } catch (e) { /* offline: try again later */ }
    busy = false;
  }
  function show() {
    shown = true;
    const bar = document.createElement("div");
    bar.className = "update-bar";
    bar.setAttribute("role", "status");
    bar.innerHTML = 'This page has been updated. <button type="button">Reload</button>';
    bar.querySelector("button").addEventListener("click", () => location.reload());
    document.body.appendChild(bar);
  }
  setTimeout(check, 10e3);
  setInterval(check, 5 * 60e3);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
})();
