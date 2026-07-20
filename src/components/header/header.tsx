import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import ImgQ2Icon from '../../media/icon.png?w=96&h=96&jsx';
import styles from './header.module.css';

const navLinks = [
  { href: '/', text: 'Home' },
  { href: '/about/', text: 'About Us'},
  { href: '/services/', text: 'Services' },
  { href: '/research/', text: 'Research'},
  { href: '/blog/', text: 'Blog'},
  { href: '/contact/', text: 'Contact'},
];

const isSmallViewport = () =>
  window.innerWidth <= 768 ||
  (window.innerHeight <= 500 && window.innerWidth > window.innerHeight);

export default component$(() => {
  const hidden = useSignal(false);
  const lockUntil = useSignal(0); // ms timestamp — prevents re-hide after peek tap

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!isSmallViewport()) { hidden.value = false; return; }
      if (Date.now() < lockUntil.value) return;
      const y = window.scrollY;
      if (y > lastY && y > 60) { hidden.value = true; }
      else if (y < lastY) { hidden.value = false; }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanup(() => window.removeEventListener('scroll', onScroll));
  });

  const restoreHeader = $(() => {
    hidden.value = false;
    lockUntil.value = Date.now() + 1500;
  });

  return (
    <>
      <header class={[styles.header, hidden.value ? styles.headerHidden : ''].join(' ')}>
        {/* Logo row */}
        <div class={styles.wrapper}>
          <div class={styles.logo}>
            <a href='/'>
              <ImgQ2Icon alt='Q2-Computing Icon'/>
            </a>
          </div>
          <nav class={styles.nav}>
            <ul>
              {navLinks.map((link) =>(
                <li key={link.text}>
                  <Link href={link.href}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div class={styles.actions}>
            <Link href='/work-with-us/' class={styles.workBtn}>Work With Us</Link>
          </div>
        </div>

        {/* Mobile nav strip — scrollable pill row, one-tap access */}
        <nav class={styles.mobileNav} aria-label="Mobile navigation">
          <ul>
            {navLinks.map((link) => (
              <li key={link.text}>
                <Link href={link.href}>{link.text}</Link>
              </li>
            ))}
            <li>
              <Link href='/work-with-us/' class={styles.mobileWorkBtn}>Work With Us</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Peek tab — fixed at top of viewport, visible only when header is hidden */}
      {hidden.value && (
        <button class={styles.peekBtn} aria-label="Show navigation" onClick$={restoreHeader}>
          <svg width="18" height="11" viewBox="0 0 18 11" fill="none" aria-hidden="true">
            <polyline points="1,1 9,9 17,1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      )}
    </>
  );
});
