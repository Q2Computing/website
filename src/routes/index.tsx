import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { QuantumCanvas } from "../components/quantum-canvas/quantum-canvas";
import styles from "./index.module.css";

export default component$(() => {
  return (
    <>
      <section class={styles.hero}>
        <QuantumCanvas />
        <div class={styles.heroContent}>
          <h1>Engineering built to work without you watching it</h1>
          <p class={styles.heroSub}>
            Q2 Computing designs automation systems, autonomous software, and hardware architectures
            for small businesses and operators who are done waiting for someone else to solve their problems
          </p>

        </div>
      </section>

      <div class="container">

        <section class="section">
          <blockquote class="mission-statement">
            Q2 Computing generalizes mathematics as models that surround our interpretation of reality, so that machines can accomplish what humans already understand how to do well, liberating people to think about how their business can grow and thrive in sustainable ways
          </blockquote>
        </section>

        <section class="section">
          <h2>What we deliver today</h2>
          <p>The infrastructure keeping small businesses behind is not an accident. It was designed that way. Here is what Q2 can put in front of you right now.</p>
          <p><strong>Software and algorithms:</strong> If your people are doing the same thing on repeat, we write the software that stops that. Process automation, AI integration, custom tooling, full-stack web applications. The deliverable is working code, not a slide deck. We scope it, build it, and hand it over with direct access to the engineer who wrote it throughout.</p>
          <p><strong>Rapid physical prototyping:</strong> Q2 operates out of Generator, Vermont's fabrication and makerspace facility in Burlington. If your problem has a physical component, we can design, iterate, and prototype it there. 3D printing, laser cutting, electronics assembly, and mechanical fabrication are all on the table. The goal is to get something in your hands fast enough that you can make a real decision about whether to invest further, before enterprise costs are incurred.</p>
          <p><strong>PCB design and microprocessor development:</strong> We design printed circuit boards and develop custom microprocessor architectures from schematic through layout, signal integrity analysis, and embedded firmware. If your product needs custom silicon or a purpose-built control board, we can take it from concept to a manufacturable design. The output is a complete hardware package your fabrication partner can run with.</p>
          <p><strong>Feasibility and simulation:</strong> Before you commit budget to hardware or a full development cycle, we can model the problem in simulation, validate the approach, and tell you honestly whether the physics and the math support what you are trying to build. This is the work that prevents expensive mistakes and produces the evidence needed for a grant application, an internal investment case, or a procurement decision.</p>
        </section>

        <section class="section">
          <h2>Direct line to the engineer</h2>
          <p>We agree on what needs to be built, how long it will take, and what it will cost before any work begins. You will never open an invoice that surprises you, and the scope we agree on is the scope we deliver. As work progresses, you have direct access to a private workspace with live updates so you always know exactly where things stand. No hand-offs, no translation layers, no one between you and the work being done on your behalf.</p>
        </section>

        <section class="section cta">
          <h2>Have a problem that keeps getting handed off and never solved?</h2>
          <p>Tell us what you are working on and we will tell you honestly if we can help.</p>
          <a href="/work-with-us/" class="cta-button">Work With Us</a>
        </section>

      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Q2 Computing",
  meta: [
    {
      name: "description",
      content: "Q2 Computing designs automation systems, autonomous software, and hardware architectures for small businesses and operators who are done waiting for someone else to solve their problems.",
    },
  ],
};
