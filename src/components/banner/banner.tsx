import { component$, useStore, $ } from '@builder.io/qwik';
import styles from './banner.module.css';

export const CookieBanner = component$(() => {

  const state = useStore({
    isVisible: false,
  });

  // // This hook runs only in the browser.
  // useVisibleTask$(() => {
  //   // import.meta.env.DEV is a special variable from Vite.
  //   // It's `true` when you run `npm run dev` and `false` for a production build.
  //   const isDevMode = import.meta.env.DEV;

  //   const consent = localStorage.getItem('cookie_consent');

  //   // Show the banner if consent hasn't been given OR if we are in development mode.
  //   if (!consent || isDevMode) {
  //     state.isVisible = true;
  //   }
  // });

  const handleAccept$ = $(() => {
    localStorage.setItem('cookie_consent', 'true');
    state.isVisible = false;
  });

  if (!state.isVisible) {
    return null;
  }

  return (
    <div class={styles.banner}>
      <p class={styles.text}>
        We ate all non-essential cookies. Rest assured: no tracking, no storing. Your privacy matters!
      </p>
      <button class={styles.button} onClick$={handleAccept$}>
        Got it!
      </button>
    </div>
  );
});

