// Analytics tracker - sends pageview to Supabase Edge Function
const EDGE_URL = "https://pxacnzpundghlojfldif.supabase.co/functions/v1/track-pageview";

// Generate or retrieve session ID (no personal data)
function getSessionId() {
  let sid = sessionStorage.getItem("_msid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("_msid", sid);
  }
  return sid;
}

export function trackPage(page, lang) {
  try {
    const payload = {
      page,
      lang,
      session_id: getSessionId(),
      referrer: document.referrer || null,
    };
    // Fire and forget - don't block the UI
    fetch(EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {}); // Silent fail - analytics should never break the site
  } catch (e) {}
}
