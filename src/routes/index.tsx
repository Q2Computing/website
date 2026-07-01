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
            Q2 Computing builds automation, autonomous systems, and hardware solutions
            for small businesses and operators who are done waiting for someone else to solve their problems
          </p>
          <a href="/work-with-us/" class={styles.heroBtn}>Work With Us</a>
        </div>
      </section>

      <div class="container">

        <section class="section">
          <h2>What we deliver today</h2>
          <p>The infrastructure keeping small businesses behind is not an accident. It was designed that way.</p>
          <p><strong>Process automation:</strong> If your people are doing the same thing on repeat, we build the systems that liberate them. Using physics-based simulation, we can produce realizable results in days and have them operationally ready within months. We do not replace people. We teach them the power they already possess, because the human brain is faster, more resilient, more capable, and more energy efficient than any AI system ever built. Our job is to put that power to work on the problems only humans can solve, and let the machines make your people money no matter the role they currently fulfill in your organization.</p>
          <p><strong>Robotic automation:</strong> Major tech firms have made robotic automation sound like something only large organizations can afford or deploy. We use physics-based simulation to validate and replicate those same systems using open source tooling, producing realizable results in days. You get precision manufacturing, circuit testing, and physical automation with the same outcomes, without the enterprise price tag or the vendor lock-in.</p>
          <p><strong>Resilient autonomous systems:</strong> Most autonomous systems are designed assuming reliable infrastructure, and when that infrastructure fails, the system fails with it. We design from the ground up for degraded environments, treating GPS, communications, and power as a bonus rather than a requirement. Your systems maintain operational continuity when the grid goes down, the signal drops, or the supply chain breaks.</p>
          <p><strong>Hardware and embedded systems:</strong> Most engineering firms stop at the software layer and hand off hardware integration to someone else, which is precisely where real problems live. We work across the full stack from circuit design and PCB layout to signal analysis and embedded deployment because the intersection of hardware and software is where the hardest problems actually are. You get a system that works end to end, not a handoff chain where nobody owns the seams.</p>
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
      content: "Q2 Computing builds automation, autonomous systems, and hardware solutions for small businesses and operators who are done waiting for someone else to solve their problems.",
    },
  ],
};
