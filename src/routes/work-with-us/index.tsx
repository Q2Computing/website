import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./work-with-us.module.css";

const problems = [
  {
    icon: "/images/icon-automation.png",
    alt: "Automation icon",
    heading: "You have a process that requires human judgment, but your best people lose hours to it every day",
    body: "Your best people are spending hours on tasks that follow a pattern. If a person can learn it, a machine can do it. We turn your operational data into automation that replicates that judgment at scale, without replacing the people who matter.",
  },
  {
    icon: "/images/icon-resilience.png",
    alt: "Resilience icon",
    heading: "You need a system that works when the network fails",
    body: "GPS-denied, communication-degraded, or operating in the field with no guarantee of connectivity. We build autonomous systems engineered to maintain mission continuity when the infrastructure fails.",
  },
  {
    icon: "/images/icon-hardware.png",
    alt: "Hardware icon",
    heading: "You have a hardware problem that software alone can't fix",
    body: "Circuit design, PCB layout, signal analysis, embedded systems. We operate across the full stack from silicon to software. If your problem lives at the intersection of hardware and intelligence, this is where we work.",
  },
  {
    icon: "/images/icon-mission.png",
    alt: "Mission icon",
    heading: "You need someone who understands both the mission and the machine",
    body: "Defense, public safety, critical infrastructure. We bring field-tested operational experience alongside engineering depth. We've worked in environments where failure is not an option and built systems designed to reflect that standard.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    body: "Send a brief description of your challenge via email. No forms, no sales calls, no obligation. We'll read it and tell you honestly whether we can help.",
  },
  {
    number: "02",
    title: "Free consultation",
    body: "If there's a fit, we schedule a direct conversation with just you and the engineer who will actually do the work. We assess scope, timeline, and feasibility together.",
  },
  {
    number: "03",
    title: "Engagement agreement",
    body: "We agree on deliverables, timeline, and rate. No subcontractors, no hand-offs. You get direct access to the person solving your problem.",
  },
  {
    number: "04",
    title: "Real-time workspace access",
    body: "Once engaged, you get access to a private workspace where you receive live updates as work progresses. You always know exactly where your project stands.",
  },
];

export default component$(() => {
  return (
    <div class={styles.page}>

      <section class={styles.hero}>
        <div class={styles.heroInner}>
          <h1>The Future of Automation Starts With Your Data</h1>
          <p class={styles.heroSub}>
            Do you have a difficult, sensitive, or repetitive task that demands your most capable people?
            Q2 Computing turns the operational data from your daily workflows into automation that
            liberates your best minds for the work only they can do.
          </p>
          <a href="/contact/" class={styles.heroBtn}>Tell Us What You Need</a>
        </div>
      </section>

      <section class={styles.problems}>
        <div class={styles.container}>
          <h2>We work on problems that others won't touch</h2>
          <p class={styles.sectionSub}>
            If your challenge sits at the intersection of hardware, software, and operational reality,
            that is exactly where we operate.
          </p>
          <div class={styles.problemGrid}>
            {problems.map((p) => (
              <div key={p.heading} class={styles.problemCard}>
                <div class={styles.problemCardHeader}>
                  <img src={p.icon} alt={p.alt} class={styles.problemIcon} width="160" height="160" />
                  <h3>{p.heading}</h3>
                </div>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class={styles.process}>
        <div class={styles.container}>
          <h2>How an engagement works</h2>
          <p class={styles.sectionSub}>
            Direct, transparent, and built around your timeline.
          </p>
          <div class={styles.steps}>
            {steps.map((s) => (
              <div key={s.number} class={styles.step}>
                <span class={styles.stepNumber}>{s.number}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class={styles.cta}>
        <div class={styles.ctaInner}>
          <h2>Ready to turn your hardest problem into your competitive edge?</h2>
          <p>No intake forms. No account managers. Just a direct line to the engineer solving your problem.</p>
          <a href="/contact/" class={styles.ctaBtn}>Start the Conversation</a>
        </div>
      </section>

    </div>
  );
});

export const head: DocumentHead = {
  title: "Work With Us | Q2 Computing",
  meta: [
    {
      name: "description",
      content: "Q2 Computing turns operational data into automation that liberates your best people from repetitive work. Direct engineering engagement, no hand-offs.",
    },
  ],
};
