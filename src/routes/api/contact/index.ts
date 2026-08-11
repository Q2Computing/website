/**
 * POST /api/contact
 *
 * Server-side handler for the work-with-us form.
 * Security layers:
 *   1. Verify Cloudflare Turnstile token, rejects bots before touching Formspree
 *   2. Proxy valid submissions to Formspree
 *
 * Env vars required in production:
 *   TURNSTILE_SECRET_KEY: from dash.cloudflare.com > Turnstile
 *   FORMSPREE_ENDPOINT: your Formspree form URL (optional override)
 *
 * Cloudflare publishes always-pass and always-fail test key pairs for local
 * development. They are documented at
 * developers.cloudflare.com/turnstile/troubleshooting/testing/ and are
 * deliberately NOT reproduced here: a literal test secret in source lets a
 * misconfigured deployment look valid, and Netlify's secrets scanner will
 * fail the build when a configured env value matches file contents.
 */

import type { RequestHandler } from "@builder.io/qwik-city";

// v0, not v1, same version as the widget script (/turnstile/v0/api.js).
// The v1 path 404s with an empty body, which surfaced as "Unexpected end of
// JSON input" and a 503 on every submission. Verified against the live
// endpoint 2026-08-10.
const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const FORMSPREE        = process.env.FORMSPREE_ENDPOINT ?? "https://formspree.io/f/xbjnryey";

// No fallback, in any environment. A hardcoded test secret is how a
// misconfiguration disguises itself as a working form: every token verifies,
// nothing errors, and bots pass. Local development sets this in .env like any
// other environment.
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? null;

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

  // 2. Proxy to Formspree, omitting the Turnstile token.
  // Built by copy-and-delete rather than a destructuring discard, which would
  // create an unused binding and fail lint.
  const formPayload: Record<string, unknown> = { ...body };
  delete formPayload["cf-turnstile-response"];

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
