import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import styles from './banner.module.css';

/**
 * Cookie notice.
 *
 * The site sets no first-party cookies. Verified against production: zero
 * cookies, zero localStorage, zero sessionStorage, measured after Turnstile
 * had already run and issued a token. Turnstile operates inside a cross-origin
 * iframe served from challenges.cloudflare.com, so anything it stores lives in
 * Cloudflare's origin rather than ours.
 *
 * So this is not a consent gate, because there is nothing to consent to. It is
 * a short honesty statement that names the one third party involved and says
 * plainly what it does not do.
 *
 * The only thing this component writes is the dismissal flag below, so the
 * notice does not reappear on every page.
 */
export const CookieBanner = component$(() => {
  const state = useStore({
    isVisible: false,
  });

  // Runs in the browser only. Shows the notice until it is dismissed, and
  // always in dev so changes to the copy are visible without clearing storage.
  //
  // strategy must be 'document-ready'. The default is an intersection observer
  // on the host element, and this component returns null until isVisible flips,
  // so there is nothing to observe. The task would wait for an element that
  // only appears once the task has run. Same circular failure that stopped the
  // Turnstile widget from ever mounting on work-with-us.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const dismissed = localStorage.getItem('cookie_consent');
    if (!dismissed || import.meta.env.DEV) {
      state.isVisible = true;
    }
  }, { strategy: 'document-ready' });

  const handleAccept$ = $(() => {
    localStorage.setItem('cookie_consent', 'true');
    state.isVisible = false;
  });

  if (!state.isVisible) {
    return null;
  }

  return (
    <div class={styles.banner} role="note" aria-label="Cookie notice">
      <p class={styles.headline}>
        {/*
          Bitten cookie. The design is Justin's, from a reference image he
          provided; this is a transcription of it into inline SVG, not an
          original drawing. If the source file turns up, replace this with an
          <img> pointing at it rather than keeping the approximation.

          Inline rather than the emoji because U+1F36A renders whole on Windows
          and most platforms, so the bite, and therefore the joke, would be lost
          for most visitors.

          Decorative, so it is hidden from assistive tech: the text carries the
          meaning.
        */}
        <svg
          class={styles.cookie}
          viewBox="0 0 64 64"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* Overlapping circles subtract a scalloped bite from the upper right */}
            <mask id="cookieBite">
              <rect width="64" height="64" fill="#fff" />
              <circle cx="54" cy="13" r="13" fill="#000" />
              <circle cx="43" cy="7"  r="8"  fill="#000" />
              <circle cx="59" cy="26" r="8"  fill="#000" />
              <circle cx="47" cy="24" r="6.5" fill="#000" />
            </mask>
          </defs>
          <g mask="url(#cookieBite)">
            <circle cx="32" cy="32" r="29" fill="#C4703A" />
            <circle cx="30" cy="33" r="24" fill="#F0C879" />
          </g>
          <circle cx="22" cy="21" r="4.6" fill="#6B4327" />
          <circle cx="19" cy="34" r="6"   fill="#6B4327" />
          <circle cx="33" cy="40" r="4.2" fill="#6B4327" />
          <circle cx="26" cy="48" r="3.8" fill="#6B4327" />
          <circle cx="41" cy="49" r="5"   fill="#6B4327" />
          <circle cx="25" cy="28" r="1.7" fill="#6B4327" />
        </svg>
        We ate all the non-essential cookies
      </p>
      <p class={styles.text}>
        The only crumb left is Cloudflare's bot check on our contact form. It tells
        humans from robots and does nothing else. No tracking, no ads, no profile of you
      </p>
      <button class={styles.button} onClick$={handleAccept$}>
        Got it
      </button>
    </div>
  );
});
