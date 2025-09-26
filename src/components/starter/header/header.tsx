import { component$ } from "@builder.io/qwik";
import { Q2Logo } from "../icons/q2";
import styles from "./header.module.css";

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/" title="q2">
            <Q2Logo height={50} width={143} />
          </a>
        </div>
        <ul>
          <li>
            <a
              href="https://q2computing.com/research/"
              target="_blank"
            >
              Research
            </a>
          </li>
          <li>
            <a
              href="https://q2computing.com/blog/"
              target="_blank"
            >
              Blog
            </a>
          </li>
          <li>
            <a
              href="https://q2computing.com/FAQ/"
              target="_blank"
            >
              FAQ
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
