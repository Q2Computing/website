import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="container">

      <h1>Our Services</h1>
      <p class="page-subtitle">We offer a spectrum of high-impact services designed to solve complex challenges by integrating cutting-edge research with principled, multi-disciplinary engineering.</p>

      <section class="service-section">
        <h2>Autonomous Systems &amp; Robotics</h2>
        <p>Leveraging our core research in physics-informed, object-blind navigation, we design autonomous systems that maintain operational continuity in the most challenging environments: GPS-denied, communication-degraded, and infrastructure-independent.</p>

        <h3>Autonomous Navigation Architecture</h3>
        <p>Design and validation of navigation systems for GPS-denied (DDIL) environments using Positional Confidence Score methodology. We produce validated architectures and simulation results for aerial, ground, or marine robotic platforms, ready for procurement and integration by your team or a hardware partner. <a href="/work-with-us/?service=autonomous-navigation" class="inline-link">Start this engagement.</a></p>

        <h3>Simulation &amp; Digital Twin Development</h3>
        <p>Creation of high-fidelity digital environments to train, test, and validate robotic behaviors, ensuring reliable sim-to-real transfer and dramatically reducing physical prototyping costs before any hardware is committed. <a href="/work-with-us/?service=digital-twin" class="inline-link">Start this engagement.</a></p>

        <h3>AI Model Design for Edge Deployment</h3>
        <p>Design and validation of AI/ML models sized for low-cost, low-power hardware targets, specifying the inference pipeline, quantization strategy, and hardware bill of materials so your team or a manufacturing partner can deploy with confidence. <a href="/work-with-us/?service=edge-ai" class="inline-link">Start this engagement.</a></p>
      </section>

      <section class="service-section">
        <h2>Enterprise AI &amp; Data Rationalization</h2>
        <p>Drawing from experience at the core of enterprise AI for global technology leaders, we turn complex data landscapes into a clear competitive advantage.</p>

        <h3>Enterprise AI Strategy &amp; Integration</h3>
        <p>Designing and implementing AI-driven solutions to automate complex business processes, from IT support ticket resolution to intelligent workflow management, reducing operational overhead and improving efficiency. <a href="/work-with-us/?service=enterprise-ai" class="inline-link">Start this engagement.</a></p>

        <h3>Complex Data Analysis &amp; Insights</h3>
        <p>Applying a rigorous statistical process to extract actionable intelligence from vast, complex datasets. Specializing in technical domains such as semiconductor metrology and global logistics. <a href="/work-with-us/?service=data-analysis" class="inline-link">Start this engagement.</a></p>
      </section>

      <section class="service-section">
        <h2>Strategic &amp; Feasibility Services</h2>
        <p>For clients at the frontier of innovation, we act as a strategic partner to de-risk investment and accelerate the path from concept to a validated design ready for development or procurement.</p>

        <h3>Feasibility Studies &amp; Simulation Prototyping</h3>
        <p>Thorough technical feasibility studies for novel concepts in AI, automation, and robotics. We build simulation-validated prototypes to test hypotheses and produce the empirical evidence needed to secure grants, investment, or internal approval, before hardware costs are incurred. <a href="/work-with-us/?service=feasibility" class="inline-link">Start this engagement.</a></p>

        <h3>Full-Stack System Architecture</h3>
        <p>End-to-end system design spanning hardware architecture (electrical, embedded, aerospace) and software (AI, full-stack) from first principles. You get a coherent specification that a manufacturing partner, integrator, or in-house team can execute against, not a set of disconnected documents from different vendors. <a href="/work-with-us/?service=system-architecture" class="inline-link">Start this engagement.</a></p>
      </section>

      <section class="service-cta-footer">
        <p>Not sure which service fits your problem? Describe your challenge and we will tell you honestly whether and how we can help.</p>
        <a href="/work-with-us/" class="cta-button">Work With Us</a>
      </section>

    </div>
  );
});

export const head: DocumentHead = {
  title: 'Services | Q2 Computing',
  meta: [
    {
      name: 'description',
      content: 'Q2 Computing designs automation systems, autonomous software, hardware architectures, and AI solutions. We design, validate, and specify. You integrate or procure.',
    },
  ],
};
