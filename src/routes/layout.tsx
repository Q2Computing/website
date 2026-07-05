import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import { CookieBanner } from '../components/banner/banner';
import Header from "../components/header/header";
import Footer from "../components/footer/footer";

import styles from "./styles.css?inline";
import katexStyles from "katex/dist/katex.min.css?inline";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  useStyles$(styles);
  useStyles$(katexStyles);
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
});
