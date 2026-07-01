import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "./research.module.css";

const supportingResearch = [
  {
    num: 1,
    title: "Teach-Repeat-Replan: A Complete and Robust System for Aggressive Flight in Complex Environments",
    citation: "Gao, F. et al. IEEE Trans. Robot. 36, 1526–1545 (2020).",
    summary: "Establishes the complete autonomous flight stack (global planning, local re-planning, and VIO localization) that defines the infrastructure problem Q2's work is designed to operate without.",
    href: "https://arxiv.org/abs/1907.00520",
    analysis: "/research/teach-repeat-replan/",
  },
  {
    num: 2,
    title: "EGO-Planner: An ESDF-Free Gradient-Based Local Planner for Quadrotors",
    citation: "Zhou, X., Wang, Z., Ye, H., Xu, C. & Gao, F. IEEE Robot. Autom. Lett. 6, 478–485 (2020).",
    summary: "Demonstrates gradient-based local planning without expensive distance field computation, directly informing the efficiency constraints of Q2's edge-compute deployment target.",
    href: "https://arxiv.org/abs/2008.08835",
    analysis: "/research/ego-planner/",
  },
  {
    num: 3,
    title: "Swarm of Micro Flying Robots in the Wild",
    citation: "Zhou, X. et al. Sci. Robot. 7, eabm5954 (2022).",
    summary: "Validates multi-agent coordination at physical scale in unstructured environments, establishing the real-world benchmark Q2's distributed confidence framework is designed to meet.",
    href: "https://www.science.org/doi/10.1126/scirobotics.abm5954",
  },
  {
    num: 4,
    title: "Learning High-Speed Flight in the Wild",
    citation: "Loquercio, A. et al. Sci. Robot. 6, eabg5810 (2021).",
    summary: "Proves that lean neural networks operating on minimal sensor input can support competent high-speed navigation, motivating Q2's efficiency-first policy architecture.",
    href: "https://www.science.org/doi/10.1126/scirobotics.abg5810",
  },
  {
    num: 5,
    title: "Perception-Aware Receding Horizon Navigation for MAVs",
    citation: "Zhang, Z. & Scaramuzza, D. ICRA 2534–2541 (IEEE, 2018).",
    summary: "Integrates perception quality directly into trajectory optimization, a complementary approach to Q2's anomaly-observation confidence model.",
    href: "https://ieeexplore.ieee.org/document/8460684",
  },
  {
    num: 6,
    title: "Are We Ready for Autonomous Drone Racing? The UZH-FPV Drone Racing Dataset",
    citation: "Delmerico, J. et al. ICRA 6713–6719 (IEEE, 2019).",
    summary: "Provides aggressive-flight benchmarking infrastructure that contextualizes the performance ceiling Q2's GPS-denied framework is designed to operate within.",
    href: "https://ieeexplore.ieee.org/document/8793887",
  },
  {
    num: 7,
    title: "TartanAir: A Dataset to Push the Limits of Visual SLAM",
    citation: "Wang, W. et al. IROS 4909–4916 (IEEE, 2020).",
    summary: "Diverse simulation dataset spanning degraded visual conditions, validating the simulation-first approach Q2 uses for zero-shot physical generalization.",
    href: "https://arxiv.org/abs/2003.14338",
  },
  {
    num: 8,
    title: "DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras",
    citation: "Teed, Z. & Deng, J. NeurIPS (2021).",
    summary: "Establishes the mature visual SLAM baseline for onboard localization across camera modalities without external reference. Q2's anomaly-based approach deliberately departs from this to remove the camera dependency entirely.",
    href: "https://arxiv.org/abs/2108.10869",
  },
  {
    num: 9,
    title: "Learned Inertial Odometry for Autonomous Drone Racing",
    citation: "Cioffi, G., Bauersfeld, L., Kaufmann, E. & Scaramuzza, D. IEEE Robot. Autom. Lett. 8, 2684–2691 (2023).",
    summary: "Inertial-only odometry for drone racing validates dead-reckoning under GPS denial, directly informing Q2's sensor-minimal navigation assumption.",
    href: "https://ieeexplore.ieee.org/document/10015592",
  },
  {
    num: 10,
    title: "Champion-Level Drone Racing Using Deep Reinforcement Learning",
    citation: "Kaufmann, E. et al. Nature 620, 982–987 (2023).",
    summary: "Sets the upper bound of learned flight policy capability at human-champion level, motivating Q2's pursuit of comparable swarm coordination performance under infrastructure denial.",
    href: "https://www.nature.com/articles/s41586-023-06419-4",
  },
  {
    num: 11,
    title: "Deep Drone Acrobatics",
    citation: "Kaufmann, E. et al. Robotics: Science and Systems (2020).",
    summary: "Demonstrates extreme maneuver learning transferable from simulation, establishing the sim-to-real transfer methodology Q2 applies to swarm coordination policies.",
    href: "https://arxiv.org/abs/2006.05768",
  },
  {
    num: 12,
    title: "Agilicious: Open-Source and Open-Hardware Agile Quadrotor for Vision-Based Flight",
    citation: "Foehn, P. et al. Sci. Robot. 7, eabl6259 (2022).",
    summary: "Open-source agile quadrotor platform that provides the physical deployment reference architecture and performance envelope for Q2's hardware target.",
    href: "https://www.science.org/doi/10.1126/scirobotics.abl6259",
  },
  {
    num: 13,
    title: "Differentiable Physics Simulation",
    citation: "Liang, J. & Lin, M. C. ICLR Workshop (2020).",
    summary: "Physics-based simulation for differentiable policy training, the foundational technique behind Q2's digital validation methodology and zero-shot generalization approach.",
    href: "https://arxiv.org/abs/2110.05965",
  },
  {
    num: 14,
    title: "Proximal Policy Optimization Algorithms",
    citation: "Schulman, J. et al. arXiv:1707.06347 (2017).",
    summary: "The proximal policy optimization algorithm Q2 applies for reinforcement learning-based policy training within the swarm coordination framework.",
    href: "https://arxiv.org/abs/1707.06347",
  },
  {
    num: 15,
    title: "A Machine Learning Approach to Visual Perception of Forest Trails for Mobile Robots",
    citation: "Giusti, A. et al. IEEE Robot. Autom. Lett. 1, 661–667 (2015).",
    summary: "Early demonstration of visual navigation policy learning in unstructured environments with no pre-labeled map, a direct analogue to Q2's object-blind positional confidence approach.",
    href: "https://ieeexplore.ieee.org/document/7358076",
  },
  {
    num: 16,
    title: "An End-to-End Trainable Neural Network for Image-Based Sequence Recognition",
    citation: "Shi, B., Bai, X. & Yao, C. IEEE Trans. Pattern Anal. Mach. Intell. 39, 2298–2304 (2016).",
    summary: "End-to-end sequence recognition architecture that informs the temporal modeling of successive anomaly observations in Q2's Markov chain confidence framework.",
    href: "https://arxiv.org/abs/1507.05717",
  },
  {
    num: 17,
    title: "Learning Phrase Representations Using RNN Encoder-Decoder for Statistical Machine Translation",
    citation: "Cho, K. et al. arXiv:1406.1078 (2014).",
    summary: "Foundational sequence-to-sequence architecture underlying the recurrent modeling of state transition probabilities in Q2's confidence update model.",
    href: "https://arxiv.org/abs/1406.1078",
  },
  {
    num: 18,
    title: "VINS-Mono: A Robust and Versatile Monocular Visual-Inertial State Estimator",
    citation: "Qin, T., Li, P. & Shen, S. IEEE Trans. Robot. 34, 1004–1020 (2018).",
    summary: "The most widely deployed GPS-denied localization baseline in the field. Q2's framework is positioned as an alternative that removes the camera dependency entirely.",
    href: "https://arxiv.org/abs/1708.03852",
  },
  {
    num: 19,
    title: "PyTorch: An Imperative Style, High-Performance Deep Learning Library",
    citation: "Paszke, A. et al. NeurIPS (2019).",
    summary: "The deep learning framework used for implementing and training Q2's policy networks and confidence estimation models.",
    href: "https://arxiv.org/abs/1912.01703",
  },
  {
    num: 20,
    title: "Deep Drone Racing: From Simulation to Reality with Domain Randomization",
    citation: "Loquercio, A. et al. IEEE Trans. Robot. 36, 1–14 (2019).",
    summary: "Domain randomization for sim-to-real transfer in aggressive flight, directly informing Q2's zero-shot generalization methodology from digital simulation to physical deployment.",
    href: "https://arxiv.org/abs/1905.09294",
  },
  {
    num: 21,
    title: "Gradients Are Not All You Need",
    citation: "Metz, L. et al. arXiv:2111.05803 (2021).",
    summary: "Characterizes failure modes of gradient-based optimization in chaotic dynamical systems, informing Q2's hybrid approach to policy training under non-smooth swarm dynamics.",
    href: "https://arxiv.org/abs/2111.05803",
  },
  {
    num: 22,
    title: "Learning Long-Term Dependencies with Gradient Descent Is Difficult",
    citation: "Bengio, Y., Simard, P. & Frasconi, P. IEEE Trans. Neural Netw. 5, 157–166 (1994).",
    summary: "Foundational characterization of the vanishing gradient problem in recurrent networks, directly relevant to Q2's Markov chain formulation for iterative confidence updating across distributed nodes.",
    href: "https://ieeexplore.ieee.org/document/279181",
  },
  {
    num: 23,
    title: "Mango Pi MQ Quad",
    citation: "mangopi.org (2023).",
    summary: "The low-cost edge compute hardware target for Q2's physical deployment architecture, chosen for its power efficiency, compact form factor, and open ecosystem.",
    href: "https://mangopi.org/mqquad",
  },
];

export default component$(() => {
  return (
    <div class={styles.page}>

      <div class={styles.header}>
        <h1>Research</h1>
        <p>
          Original contributions from Q2 Computing alongside the foundational body of work that supports them.
          Every author cited has earned their credit.
        </p>
      </div>

      <div class={styles.layout}>

        {/* ── Left: Q2 Computing original work ── */}
        <div class={styles.q2col}>
          <h2>Q2 Computing</h2>

          <div class={styles.paper}>
            <p class={styles.paperMeta}>
              October 7, 2025 &nbsp;·&nbsp; Justin Adams &nbsp;·&nbsp; Q2 Computing
              <span class={styles.restrictedBadge}>Distribution Restricted</span>
            </p>

            <h3>Distributed Autonomous Swarm Navigation in GPS-Denied Environments</h3>

            <p>
              A method for maintaining collective positional confidence in a distributed autonomous
              swarm operating where GPS and external communication are unavailable or actively denied.
              Terrain data for the defined area of operations is preloaded onto each node, providing
              the inference basis for localization. Each node performs rapid observation of
              environmental anomalies and treats successive observations as states in a Markov chain.
              Confidence is iteratively updated across the swarm, enabling reliable localization and
              navigation without centralized coordination or live external signals.
            </p>

            <p>
              The system maintains high positional confidence within the area of operations.
              Nodes that leave the defined terrain boundary will lose confidence progressively
              as observations diverge from the loaded prior. This is a known and intentional constraint
              that bounds operational scope. The approach is label-blind by design: the terrain
              prior is geographic, not object-classified. No feature-labeled dataset of the
              environment is required. The method was developed and validated in physics-based
              digital simulation and is designed for zero-shot generalization to physical
              deployment on low-cost edge hardware <a href="#ref-23">[23]</a>.
            </p>

            <p><strong>Key contributions:</strong></p>
            <ul>
              <li>Inference-based localization using preloaded terrain data, with no GPS or live external signals</li>
              <li>Label-blind positional confidence framework requiring no object-classified environmental data</li>
              <li>Markov chain formulation for iterative confidence updating across distributed nodes</li>
              <li>Physics-based simulation validation with design for zero-shot physical generalization</li>
              <li>Hardware target architecture on low-cost accessible edge compute</li>
            </ul>

            <p>
              The operational failure mode this work addresses is not theoretical. Modern autonomous
              systems depend on infrastructure they do not control. GPS can be denied, spoofed, or
              degraded. A swarm that cannot localize without live external reference cannot be trusted
              when it is needed most. This framework removes that dependency at the architecture level
              while keeping the terrain prior compact enough to fit on edge hardware.
            </p>

            <p>
              Submitted to the U.S. Army Civil Engineering Working Group. Full methodology,
              experimental results, and implementation details remain restricted pending review.
            </p>

            <Link href="/research/swarm-navigation/" class={styles.paperLink}>
              Read the full abstract and citation record →
            </Link>
          </div>
        </div>

        {/* ── Right: supporting research ── */}
        <div class={styles.supportCol}>
          <h2>Supporting Research</h2>

          <ol class={styles.refList}>
            {supportingResearch.map((ref) => (
              <li key={ref.num} id={`ref-${ref.num}`} class={styles.refItem}>
                <div class={styles.refHeader}>
                  <span class={styles.refNum}>{ref.num}.</span>
                  <span class={styles.refTitle}>{ref.title}</span>
                </div>
                <p class={styles.refCitation}>{ref.citation}</p>
                <p class={styles.refSummary}>{ref.summary}</p>
                <a href={ref.href} target="_blank" rel="noopener noreferrer" class={styles.refLink}>
                  View source →
                </a>
                {ref.analysis && (
                  <a href={ref.analysis} class={styles.refLink} style="margin-left: 1rem;">
                    View analysis →
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Research | Q2 Computing",
  meta: [
    {
      name: "description",
      content: "Q2 Computing original research in autonomous swarm navigation alongside the complete body of foundational work that supports it.",
    },
  ],
};
