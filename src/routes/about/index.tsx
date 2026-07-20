import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import heroStyles from '../index.module.css';
import styles from './about.module.css';
import { swarmPaperCount, totalPaperCount, leanProofCount } from '../../data/research';

export default component$(() => {
  return (
    <>
      <section class={styles.openingBanner}>
        <div class={styles.openingInner}>
          <p>The automation gap between large organizations and small businesses is not a fair fight. It was designed to be a war of attrition.</p>
          <p>Q2 Computing is building in Burlington, VT to change the systems citizens use in that fight.</p>
        </div>
      </section>

      <div class="container">

        <section class="section">
          <h2>Why Q2 exists</h2>
          <p>Small businesses built this country. Then the tools to run one got priced out of reach, on purpose.</p>
          <p>Not because small operators lack talent. Not because they lack drive. Because the people who built the tools decided that complexity should require scale, and that scale should require capital that only one side of the fight has access to.</p>
          <p>The machine shop that has been running the same family name for forty years cannot afford the software that certifies the lifespan of the parts it ships. The journalist covering a conflict zone cannot prove her footage has not been altered. The farmer building his first automated irrigation system cannot access the engineering that would let him prove it works. These are not edge cases. These are the operating conditions of most of the people doing most of the real work in the American economy.</p>
          <p>The gap was not created by accident. It is maintained by vendor lock-in, proprietary tooling, and the quiet assumption that if you cannot afford the enterprise stack, your work does not need to be verified, protected, or remembered.</p>
          <p>Q2 exists to dismantle that assumption.</p>
        </section>

        <section class="section">
          <h2>A background built for this fight</h2>
          <p>Before Q2, there was a combat deployment to Iraq and a commission as a U.S. Army officer. That experience instilled something no classroom provides: what it means to design systems that have to work when conditions are worst, not when conditions are ideal. Resilience is not a feature you add at the end. It is a constraint you design around from the beginning.</p>
          <p>That constraint shaped the engineering education that followed. Aerospace Engineering at Boston University covered control systems, flight dynamics, and the mathematics of physical systems operating at the edge of their performance envelope. Electrical Engineering at the University of Vermont covered circuit design, signal analysis, processor architecture, FPGA programming, and the hardware-software boundary where most real engineering problems actually live. The shift into computer science and AI was not a departure from engineering. It was the recognition that software and machine learning were the highest-leverage tools available for the class of problems worth solving.</p>
          <p>The result is a founder who can work from the transistor up: circuit design and PCB layout, embedded firmware and FPGA synthesis, AI model development and optimization, full-stack software and web applications, robotic systems integration, and autonomous navigation for environments where GPS and communications cannot be assumed. A research archive of {totalPaperCount} peer-reviewed works, with {leanProofCount} Lean 4 machine-verified proofs of the mathematical foundations. Most firms operate in one layer of the stack. Q2 operates across all of them, because the hardest problems are always at the seams where hardware meets firmware, firmware meets software, and software meets the world.</p>
        </section>

        <section class="section">
          <h2>What we are equipped to build</h2>

          <p><strong>Websites and business software</strong></p>
          <p>Web development is the most accessible entry point for most organizations. Q2 builds websites and web applications that are engineered, not assembled from templates. That means correct architecture from the start, pages that load fast, and software that does exactly what the business needs without the feature bloat and maintenance overhead that comes from off-the-shelf platforms. If you have a business problem that a well-built piece of software could solve, this is where the engagement usually starts.</p>

          <p><strong>AI development and integration</strong></p>
          <p>Most organizations don't need a foundation model. They need a specific AI capability integrated cleanly into their existing workflow. Q2 designs and builds custom AI systems: fine-tuned models, retrieval-augmented pipelines, edge inference deployments, and process automation that uses AI where it actually adds value and skips it where it doesn't. The physics-informed research background means Q2 approaches AI with the same rigor applied to any engineering problem, not as a tool to apply to everything, but as a technique to apply where the math supports it.</p>

          <p><strong>Processor and hardware design</strong></p>
          <p>Q2 works across the hardware stack from circuit schematic through PCB layout, signal integrity analysis, FPGA synthesis, and embedded firmware. If your product has a hardware component and you need an engineer who understands both the silicon and the software running on it, that intersection is where Q2 operates most naturally. Hardware design engagements typically produce a validated specification and bill of materials your manufacturing partner can execute against, not a prototype that only works in one lab.</p>

          <p><strong>Robotic automation design</strong></p>
          <p>Q2 uses physics-based simulation to design and validate robotic automation systems before any hardware is committed. The output is a validated architecture, a procurement path, and an integration plan, not a vendor quote for proprietary equipment that locks you in for the next decade. Two BCN3D Moveo robotic arms are currently being built in Vermont as the first physical proof point of this methodology, demonstrating that precision automation is buildable from open-source tooling at a fraction of enterprise cost.</p>

          <p><strong>Communications-denied autonomous systems</strong></p>
          <p>Skepticism about autonomous systems is rational. The leading implementations are opaque, overpromised, and built to work only when every assumption holds. That skepticism does not change the trajectory. Autonomous systems will be deployed whether the people affected by them trust them or not. The only variable is the quality of the engineering behind them.</p>
          <p>Q2's navigation framework was designed for denied, disrupted, intermittent, and limited (DDIL) environments from the start, treating GPS and live communication as a bonus rather than a requirement. The result is an architecture that maintains operational continuity when the grid goes down, the signal drops, or the supply chain breaks. This work has been submitted to the U.S. Army Civil Engineering Working Group and is backed by a {swarmPaperCount}-paper research archive with {leanProofCount} Lean 4 machine-verified proofs.</p>
        </section>

        <section class="section">
          <h2>The efficiency thesis</h2>
          <p>The insight that became Q2's core research direction came from a practical experiment: simulate a land navigation mission between two points. What emerged was not a solution. It was the observation that the leading approaches from major software companies were consuming an enormous amount of computational resources to accomplish something that should have been tractable at a fraction of the cost. Brute-force scale was being substituted for principled design.</p>
          <p>The peer-reviewed literature confirmed it. Lean neural networks trained on the physical geometry of their environment, rather than on massive labeled recognition datasets, could navigate competently at a fraction of the computational overhead. That finding generalized: across AI, hardware, and software, the most efficient solution is almost never the first one proposed. Q2 exists to continue finding better ones.</p>
        </section>

        <section class="section">
          <h2>Built in Vermont, built for everyone who was told not to bother</h2>
          <p>The first physical proof point is already underway: two BCN3D Moveo robotic arms built from open-source designs, 3D-printed structural components, and off-the-shelf stepper motors. Precision automation built in a Vermont garage, not an enterprise procurement cycle. These are the proving ground for the automation architectures Q2 designs for clients, and the first step in a longer sequence: demonstrate the capability, contract with Vermont businesses, and build the manufacturing and design practice that makes this a realistic option for operators who have been written off by the enterprise automation industry.</p>
          <p>The research direction extends further. Q2 is pursuing a partnership with the University of Vermont through the DOE INFUSE program, applying radiation-informed robotics research to nuclear and fusion facility maintenance. Vermont has the manufacturing base, the engineering talent, and the community density to build something real. Q2 intends to be part of that build.</p>
        </section>

        <section class="section">
          <h2>Commitment to the research frontier</h2>
          <p>Q2 maintains a public research archive covering every paper that directly informed its methodology: {totalPaperCount} peer-reviewed works across autonomous navigation and reactor robotics, each with full citation and a plain-language analysis of exactly how it connects to Q2's work. {leanProofCount} Lean 4 machine-verified proofs of the mathematical foundations are published alongside the archive, providing machine-checkable verification of the core theoretical claims.</p>
          <p>The research section is not a reading list. It is an accountability record for every claim Q2 makes about what the underlying science actually supports. Future publications will be released in the same section as they become available. The <a href="/research/" class="cta-link">full archive is here</a>.</p>
        </section>

      </div>

      <section class={heroStyles.patriot}>
        <div class={heroStyles.patriotInner}>
          <h2>Q2 Computing: Vision</h2>
          <p>The gap between what large organizations can build and what small businesses can access has never been an accident. It is maintained by vendor ecosystems, proprietary tooling, and the assumption that complexity requires scale. Q2's model starts from the opposite assumption: that a rigorous engineering process, open-source tooling, and a founder who works across the full stack can produce outcomes that were previously only available to organizations with enterprise budgets.</p>
          <p>The near-term goal is Vermont-made robotic automation, built from the grassroots. The Moveo arms being built now are the first step in a longer sequence: demonstrate the capability, contract with Vermont businesses, and build the manufacturing and design practice that makes precision automation a realistic option for operators who have been written off by the enterprise automation industry.</p>
          <p>The longer-term research direction extends from autonomous navigation into radiation-informed robotics for nuclear and fusion facility maintenance, developed in partnership with the University of Vermont through the DOE INFUSE program. That work is in development. The near-term deliverable is simpler and more immediate: engineering built to work without you watching it, across every layer of the stack.</p>
        </div>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: 'About Q2 Computing',
  meta: [
    {
      name: 'description',
      content: 'Q2 Computing is a Vermont-based engineering firm spanning web development, AI, processor design, robotic automation, and communications-denied autonomous systems. Founded by a former U.S. Army officer with degrees in Aerospace and Electrical Engineering.',
    },
  ],
};
