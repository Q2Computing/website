import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import PiFormula from '../../media/pi.png?w=300h=200&jsx';
import styles from '../index.module.css';

export default component$(() => {
  return (
    <>
      <div class="container">

        <h1>About the Founder</h1>

        <section class="section">
          <span class="image">
            <div class="text">
              <h2>Mission Driven: Optimal Solutions</h2>
              <p>The mission of Q2-Computing began long before its founding, sparked by a simple portfolio problem in a 3rd-grade classroom: given a set amount of fence, what geometric shape maximizes the area? Intuitively, the answer is a circle. But proving it—understanding the fundamental principles that made it true—ignited a lifelong passion.</p>
              <p>This drive to move beyond intuition to empirical proof became the guiding principle of a journey through the seemingly disparate worlds of mathematics, military service, and multiple engineering disciplines. It's a journey about rationalizing reality—finding the most elegant and efficient solution, not just the obvious one.</p>
            </div>
            <PiFormula />
          </span>
        </section>

        <section class="section">
          <h2>Values Guided: Service, Integrity, and Strategy</h2>
          <p>Our journey is rooted in a lifelong commitment to service, a principle that was strengthened during a combat deployment to Iraq and as a commissioned U.S. Army officer. This drive led to the study of Aerospace Engineering at Boston University and Electrical Engineering at the University of Vermont, always with a focus on solving real-world problems.</p>
          <p>This path has been consistently guided by a core belief in intellectual integrity and open innovation. We believe that transformative technology should be accessible and serve the broader community, a principle that has informed every major decision, including choosing a path dedicated to open-source and collaborative development.</p>
          <p>We recognized early on that advanced computational models held more promise than traditional methods. This insight prompted a dedicated shift into computer science, viewing it as the most powerful tool to develop technology that benefits all of humanity.</p>
          <p>Today's Large Language Models (LLMs) showcase the incredible potential at the intersection of mathematics, software, and hardware. However, their high computational requirements present a significant challenge to widespread adoption. We see this not as a roadblock, but as the next great opportunity.</p>
          <p>Our mission is to pioneer computational efficiency. We empower nimble, innovative businesses to unlock the true potential of robotic autonomy, creating sustainable and scalable solutions for a better future.</p>
        </section>

        <section class="section">
          <h2>Focused Vision: From a Backyard Challenge to Competitive Dominance</h2>
          <p>The moment that focused these diverse experiences into a singular mission came from a simple challenge from a brother-in-law: simulate a land navigation mission from one home to another. The result was a stark realization—top software companies moving in to last mile logistics were using an excessive amount of computational resources to achieve a simple objective.</p>
          <p>This practical experiment crystallized a core problem with modern AI: inefficiency. It was further reinforced by peer-reviewed research demonstrating that lean neural networks could achieve remarkable competence without the computational overhead of brute-force methods. The hypothesis for Q2-Computing was formed: there had to be a more rational, efficient, and ultimately more effective way to achieve autonomy.</p>
        </section>

        <section class="section">
          <h2>The Breakthrough: Physics-Informed Autonomy</h2>
          <p>Our core breakthrough is a new paradigm for autonomous navigation, shifting from brittle, recognition-based systems to a resilient, physics-informed approach. By combining the discipline of aerospace engineering with the adaptive power of modern AI, we've developed a system that can navigate reliably, even when GPS and communication fail.</p>
          <p>Instead of relying on recognizing specific objects, our system learns the fundamental principles of physics and geometry. Using a novel technique called <strong>differentiable physics</strong>, we train lightweight neural networks in a virtual environment to understand motion, terrain, and spatial relationships. This allows an autonomous swarm to collaboratively determine its location with high confidence by fusing sensor data through a learned, physics-driven model. This method is engineered from first principles to be inherently robust and adaptable to the real world.</p>
          <p>Q2-Computing was founded not just to build software, but to provide a competitive advantage by leveraging a unique, multidisciplinary understanding of computer science. We believe in building solutions that are not just powerful, but principled, efficient, and trustworthy—engineered to succeed from the ground up.</p>
        </section>

        <section class="section">
          <h2>Our Commitment to the Research Frontier</h2>
          <p>Innovation is a collaborative endeavor. The breakthrough for positional confidence based on differentiable physics modeling was made possible by standing on the shoulders of giants—the dedicated researchers and programmers whose public work pushes the boundaries of what's possible. We believe that transparency and collaboration are essential for building trustworthy and effective technology.</p>
          <p>In that spirit, we are committed to contributing back to this vibrant ecosystem. Our <a href="/research/" class="cta-link">Research</a> section serves as a curated library of the pivotal public works that inspire our own, and will be the home for future publications from Q2-Computing as we continue to rationalize the complex realities of autonomous systems.</p>
        </section>

      </div>

      <section class={styles.patriot}>
        <div class={styles.patriotInner}>
          <h2>Q2 Computing: Vision</h2>
          <p>Every worker generates data. When they succeed, they prove a process works. When they fail, they reveal where the process breaks. Both have value. Right now that value flows entirely to the organization and none of it flows back to the worker who produced it.</p>
          <p>We are building a compensation model that changes that. Workers are paid directly for their contribution to the training data that makes automation smarter, whether they succeed or fail. The labor cost of improvement gets distributed to the people doing the improving. That is a more efficient market, not a more complicated one.</p>
          <p>Planned obsolescence built margins on customers staying ignorant. That worked until it didn't. Every company that bet on it eventually paid through brand damage, regulation, or market share handed to someone who built a better product. Q2's model turns that dynamic around. Workers who make your automation smarter get paid for it. The improvement cycle becomes a revenue model instead of a cost center. The cost of writing people off doesn't disappear. It shows up somewhere else on someone else's balance sheet, and eventually it shows up on yours.</p>
          <p>At the macro level, distributed manufacturing and distributed AI development lower the cost of entry for every small business that adopts them. When production is local and knowledge is shared, the logistical overhead that large centralized operations depend on stops being a competitive advantage and starts being dead weight.</p>
          <p>Every person your competitors dismissed is a data point they never captured. Q2's model collects that signal and converts it into engineering value. Your employees know something your AI doesn't. Now you can pay them for it. This system is in active development. If your organization wants to be part of building it, reach out now.</p>
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
      content: 'Learn about Q2 Computing, its founder, and the mission to build physics-informed autonomous systems.',
    },
  ],
};
