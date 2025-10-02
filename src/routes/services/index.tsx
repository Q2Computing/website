import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import styles from './styles.css'
export default component$(() => {
  return (
    <div class="services-container">

        <h1>Our Services</h1>
        <p class="page-subtitle">We offer a spectrum of high-impact services designed to solve complex challenges by integrating cutting-edge research with principled, multi-disciplinary engineering.</p>

        <section class="service-section">
            <h2>Autonomous Systems & Robotics</h2>
            <p>Leveraging our core innovation in "object-blind" navigation, we provide solutions that enable true autonomy in the most challenging environments.</p>

            <h3>Autonomous Navigation & Localization</h3>
            <ul>
                <li>Development and integration of robust navigation systems for GPS-denied (DDIL) environments using our Positional Confidence Score technology. Ideal for aerial, ground, or marine robotics.</li>
            </ul>
            
            <h3>Simulation & Digital Twin Development</h3>
            <ul>
                <li>Creation of high-fidelity digital environments to train, test, and validate robotic behaviors, ensuring reliable "sim-to-real" transfer and drastically reducing physical prototyping costs.</li>
            </ul>

            <h3>AI Model Optimization for Edge Devices</h3>
            <ul>
                <li>Refining and deploying complex AI/ML models on low-cost, low-power hardware, enabling powerful, decentralized intelligence without reliance on expensive computational resources.</li>
            </ul>
        </section>

        <section class="service-section">
            <h2>Enterprise AI & Data Rationalization</h2>
            <p>Drawing from experience at the core of enterprise AI for global technology leaders, we turn complex data landscapes into a clear competitive advantage.</p>
            
            <h3>Enterprise AI Strategy & Integration</h3>
            <ul>
                <li>Designing and implementing AI-driven solutions to automate complex business processes, from IT support ticket resolution to intelligent workflow management, reducing operational overhead and improving efficiency.</li>
            </ul>

            <h3>Complex Data Analysis & Insights</h3>
            <ul>
                <li>Applying a rigorous statistical process to extract actionable intelligence from vast, complex datasets. Specializing in technical domains such as semiconductor metrology and global logistics.</li>
            </ul>
        </section>

        <section class="service-section">
            <h2>Strategic & Prototyping Services</h2>
            <p>For clients at the frontier of innovation, we act as a strategic partner to de-risk investment and accelerate the path from concept to reality.</p>

            <h3>Feasibility Studies & R&D Prototyping</h3>
            <ul>
                <li>Conducting thorough technical feasibility studies for novel concepts in AI and robotics. We build functional prototypes to validate hypotheses and provide the empirical data needed to secure grants or venture funding.</li>
            </ul>

            <h3>Full-Stack System Architecture & Development</h3>
            <ul>
                <li>Providing end-to-end system design that integrates hardware (electrical/aerospace) and software (AI/full-stack) from first principles, ensuring your final product is robust, scalable, and built on a sound engineering foundation.</li>
            </ul>
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