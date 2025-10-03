import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import PiFormula from '../../media/pi.png?w=300h=200&jsx';

export default component$(() => {
  return (
    <div class="container">

        <h1>About the Founder</h1>

        <section class="section">
          <span class="image-left">
            <div class="text">
              <h2>Mission Driven: Optimal Solutions</h2>
              <p>The mission of Q2-Computing began long before its founding, sparked by a simple portfolio problem in a 3rd-grade classroom: given a set amount of fence, what geometric shape maximizes the area? Intuitively, the answer was a circle. But proving it—understanding the fundamental principles that made it true—ignited a lifelong passion.</p>
              <p>This drive to move beyond intuition to empirical proof became the guiding principle of a journey through the seemingly disparate worlds of mathematics, military service, and multiple engineering disciplines. It's a journey about rationalizing reality—finding the most elegant and efficient solution, not just the obvious one.</p>
            </div>
            <div class="image">
              <PiFormula />
            </div>
          </span>
        </section>
        
        <section class="section">
            <h2>Values Guided: Service, Integrity, and Strategy</h2>
            <p>This pursuit of knowledge continued through a combat deployment to Iraq and a commission as a U.S. Army officer. It led to the study of Aerospace Engineering at Boston University and later, Electrical Engineering at the University of Vermont. But this path was also guided by a core set of principles: a commitment to service, and a refusal to compromise on intellectual integrity, even declining a graduate position over the predatory intellectual property practices of the American collegiate system.</p>
            <p class="quote">Recognizing that computational models were outperforming traditional heuristic constructs, the focus shifted to computer science—a tool to improve technology for all of humanity.</p>
            <p>Today, the rise of LLMs demonstrates what has always been possible at the intersection of mathematics, software, and hardware. However, their immense computational cost is unsustainable, creating a volatile economic crisis. The only viable path forward is to empower nimble, innovative businesses to discover the true limits of efficient robotic autonomy.</p>
        </section>

        <section class="section">
            <h2>Focused Vision: From a Backyard Challenge to Competitive Dominance</h2>
            <p>The moment that focused these diverse experiences into a singular mission came from a simple challenge from a brother-in-law: simulate a land navigation mission from one home to another. The result was a stark realization—the simulation was using an excessive amount of computational resources to achieve a simple objective.</p>
            <p>This practical experiment crystallized a core problem with modern AI: inefficiency. It was further reinforced by peer-reviewed research demonstrating that lean neural networks could achieve remarkable competence without the computational overhead of brute-force methods. The hypothesis for Q2-Computing was formed: there had to be a more rational, efficient, and ultimately more effective way to achieve autonomy.</p>
        </section>

        <section class="section">
            <h2>The Breakthrough: Positional Confidence</h2>
            <p>This insight is the foundation of our "object-blind" navigation technology. By combining the discipline learned in the military, the hard physics of engineering, and the abstract logic of computer science, we developed a system that doesn't need to know <strong>what</strong> an object is, only that its presence is an anomaly that can refine its understanding of <strong>where</strong> it is.</p>
            <p>Q2-Computing was founded not just to build software, but to provide a competitive advantage by leveraging a unique, multidisciplinary understanding of computer science. We believe in building solutions that are not just powerful, but principled, efficient, and trustworthy—engineered to succeed from first principles.</p>
        </section>

        <section class="section">
            <h2>Our Commitment to the Research Frontier</h2>
            <p>Innovation is a collaborative endeavor. The breakthrough for our Positional Confidence Scores was made possible by standing on the shoulders of giants—the dedicated researchers and programmers whose public work pushes the boundaries of what's possible. We believe that transparency and collaboration are essential for building trustworthy and effective technology.</p>
            <p>In that spirit, we are committed to contributing back to this vibrant ecosystem. Our <a href="/research/" class="cta-link">Research</a> section serves as a curated library of the pivotal public works that inspire our own, and will be the home for future publications from Q2-Computing as we continue to rationalize the complex realities of autonomous systems.</p>
        </section>

    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contact Us',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with us through our contact page.',
    },
  ],
};