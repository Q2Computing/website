import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <div class="container">

          <section class="section hero">
              <h1>From Complex Data to Competitive Dominance</h1>
              <p class="subheading">We don't just solve technical problems—we rationalize reality. Q2-Computing integrates elite expertise across aerospace, AI, and full-stack engineering to deliver solutions that are not only intelligent but resilient, robust, and ready for the real world.</p>
          </section>

          <section class="section approach">
              <h2>Bridging the Gap Between Disciplines</h2>
              <p>In today's hyper-specialized world, the most critical challenges lie at the intersection of different fields. A brilliant aerospace concept fails without robust software; a powerful AI remains useless without the electrical engineering to support it. Q2-Computing was founded on a simple principle: true innovation requires a holistic approach.</p>
              <p>We believe the next generation of autonomy must be built on a foundation of trust. That's why we approach every problem not just as engineers, but as responsible stewards of powerful technology, ensuring that every solution we build is engineered for success from first principles.</p>
          </section>
          
          <section class="section experience">
              <h2>Battle-Tested in the Enterprise Arena</h2>
              <p>Conceptual brilliance is not enough. Our strategies are forged from hands-on experience delivering mission-critical solutions for global technology leaders.</p>
              <p>Working with a premier global technology consulting firm, we were at the core of developing enterprise-grade AI services that automated complex IT support resolutions—a task requiring a deep understanding of the entire web development stack. Our work extended to providing critical, data-driven insights for the titans of the semiconductor industry, helping to analyze and optimize everything from intricate metrology data to global logistics.</p>
              <p>This experience proved a core truth: the statistical process for uncovering powerful insights is universal. We have a proven track record of applying this rigorous analytical process to solve high-stakes problems, turning vast corporate data stores into actionable intelligence and a clear competitive advantage.</p>
          </section>

          <section class="section innovation">
              <h2>The Future of Autonomy: True Resilience When Connection is Lost</h2>
              <p>Our core innovation is a paradigm shift in autonomous navigation, born from a universal challenge: what happens when the network fails? Whether it's a first responder's drone in a hurricane-stricken area, an agricultural robot in a remote field, or a defense asset in a contested environment, the loss of GPS or communication can mean mission failure. We solve this by evaluating <strong>positional confidence</strong>.</p>
              <p>Inspired by groundbreaking research that trained competent flight policies with lean neural networks, our "object-blind" method allows autonomous systems to interpolate their location with astonishing accuracy.</p>
              
              <h3>How it works:</h3>
              <p>Instead of relying on pre-labeled objects, our software trains a neural network to rapidly observe environmental anomalies. By treating each new observation as a point in a Markov chain, a swarm can iteratively update its collective confidence in its location. This approach, honed in a digital simulation, is designed for zero-shot generalization to the real world, providing a level of resilience and adaptability that traditional systems cannot match.</p>
              
              <p>This technology has profound implications across all sectors:</p>
              <ul class="benefits">
                  <li><strong>Disaster Response & Public Safety:</strong> Drones that can map a disaster zone or find survivors long after cell towers have gone down.</li>
                  <li><strong>Industrial & Civil Operations:</strong> High-precision tasks like automated infrastructure inspection, construction, and agriculture, using less expensive hardware without total reliance on satellite connectivity.</li>
                  <li><strong>Defense & National Security:</strong> Ensuring operational overmatch and mission continuity for autonomous systems in DDIL (Denied, Degraded, Intermittent, and Limited) environments.</li>
              </ul>
          </section>

          <section class="section cta">
              <h2>Ready to turn your most complex challenge into your greatest strength?</h2>
              <p>Let's discuss how our integrated approach to engineering and artificial intelligence can rationalize your reality and deliver a decisive competitive edge.</p>
              <a href="/contact/" class="cta-button">Contact Us</a>
          </section>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Q2-Computing",
  meta: [
    {
      name: "description",
      content: "Q2-Computing software and hardware services",
    },
  ],
};
