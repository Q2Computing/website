import { component$ } from '@builder.io/qwik';
import { useServerTimeLoader } from '../../routes/layout';
import styles from './footer.module.css';

export default component$(() => {
  const serverTime = useServerTimeLoader();

  return (
    <footer>
      <div class={styles.anchor}>
        <a href="https://www.builder.io/" target="_blank">
          <span>Made with ♡ by Q2-Computing, </span>
          <span>{serverTime.value.date}</span>
        </a>
      </div>
    </footer>
  );
});
