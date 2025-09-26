import { component$ } from "@builder.io/qwik";
import { Link } from '@builder.io/qwik-city';
import ImgQ2Icon from '../../../media/icon.png?w=96&h=96&jsx';
import styles from "./header.module.css";

export default component$(() => {

  const navLinks = [
    { href: '/about', text: 'About Us'},
    { href: '/services', text: 'Services' },
    { href: '/research', text: 'Research'},
    { href: '/blog', text: 'Blog'},
    { href: '/contact', text: 'Contact'},
  ];

  return (
    <header class={["header", styles.header]}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/">
            <ImgQ2Icon alt="Q2-Computing Icon"/>
          </a>
          <p>Q2-Computing
          <br />
          Reality, Rationalized</p>
        </div>
        <nav>
          <ul>
            {navLinks.map((link) =>(
              <li key={link.text}>
                <Link
                  href={link.href}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
});
