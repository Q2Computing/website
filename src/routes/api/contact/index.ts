/**
 * POST /api/contact
 *
 * Server-side handler for the work-with-us form.
 * Security layers:
 *   1. Verify Cloudflare Turnstile token — rejects bots before touching Formspree
 *   2. Proxy valid submissions to Formspree
 *
 * Env vars required in production:
 *   TURNSTILE_SECRET_KEY  — from dash.cloudflare.com > Turnstile
 *   FORMSPREE_ENDPOINT    — your Formspree form URL (optional override)
 *
 * Test keys (safe to commit, never pass real traffic):
 *   Site key  1x00000000000000000000AA  (always passes)
 *   Secret    1x0000000000000000000000000000000AA
 */

import type { RequestHandler } from "@builder.io/qwik-city";

const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v1/siteverify";
const FORMSPREE        = process.env.FORMSPREE_ENDPOINT ?? "https://formspree.io/f/xbjnryey";

// Cloudflare's "always passes" test secret. Convenient for dev, catastrophic in
// production: with it, every request verifies successfully, so the form looks
// protected while accepting every bot — and nothing errors to tell you.
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

// Fail closed in production. The test fallback only applies outside production,
// so a missing TURNSTILE_SECRET_KEY on Netlify surfaces as a loud 500 rather
// than a silently open form.
const IS_PRODUCTION    = process.env.NODE_ENV === "production";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
  ?? (IS_PRODUCTION ? null : TURNSTILE_TEST_SECRET);

export const onPost: RequestHandler = async (ev) => {
  // Refuse to run unverified rather than falling back to a secret that
  // approves everything. This is a misconfiguration, not a caller error.
  if (!TURNSTILE_SECRET) {
    console.error("contact_misconfigured: TURNSTILE_SECRET_KEY is not set");
    ev.json(500, { error: "Form is temporarily unavailable" });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await ev.request.json();
  } catch {
    ev.json(400, { error: "Invalid JSON" });
    return;
  }

  const token = body["cf-turnstile-response"] as string | undefined;
  if (!token) {
    ev.json(400, { error: "Missing Turnstile token" });
    return;
  }

  // ── 1. Verify Turnstile token server-side ──────────────────────────────────
  const ip =
    ev.request.headers.get("cf-connecting-ip") ??
    ev.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    undefined;

  const verifyForm = new FormData();
  verifyForm.set("secret",   TURNSTILE_SECRET);
  verifyForm.set("response", token);
  if (ip) verifyForm.set("remoteip", ip);

  // Cloudflare is a third party and can be unreachable, rate-limit, or return
  // an error page instead of JSON. Unguarded, .json() throws and the caller
  // gets an opaque 500 with a raw stack trace in the logs. Fail closed, but
  // fail legibly.
  let verifyData: { success: boolean; "error-codes"?: string[] };
  try {
    const verifyRes = await fetch(TURNSTILE_VERIFY, { method: "POST", body: verifyForm });
    verifyData = await verifyRes.json();
  } catch (err) {
    console.error("turnstile_verify_unavailable:", (err as Error)?.message);
    ev.json(503, { error: "Verification service unavailable. Try again shortly." });
    return;
  }

  if (!verifyData.success) {
    ev.json(403, {
      error: "Human verification failed",
      codes: verifyData["error-codes"] ?? [],
    });
    return;
  }

  // ── 2. Proxy to Formspree (omit the Turnstile token) ──────────────────────
  const { "cf-turnstile-response": _drop, ...formPayload } = body;

  const formspreeRes = await fetch(FORMSPREE, {
    method:  "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body:    JSON.stringify(formPayload),
  });

  if (!formspreeRes.ok) {
    ev.json(502, { error: "Upstream submission failed. Try again or email directly." });
    return;
  }

  ev.json(200, { ok: true });
};
