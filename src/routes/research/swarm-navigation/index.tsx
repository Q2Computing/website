import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./swarm.module.css";

const references = [
  {
    num: 1,
    text: "Gao, F. et al. Teach-repeat-replan: A complete and robust system for aggressive flight in complex environments. IEEE Trans. Robot. 36, 1526–1545 (2020).",
    href: "https://arxiv.org/abs/1907.00520",
  },
  {
    num: 2,
    text: "Zhou, X., Wang, Z., Ye, H., Xu, C. & Gao, F. Ego-planner: An esdf-free gradient-based local planner for quadrotors. IEEE Robot. Autom. Lett. 6, 478–485 (2020).",
    href: "https://arxiv.org/abs/2008.08835",
  },
  {
    num: 3,
    text: "Zhou, X. et al. Swarm of micro flying robots in the wild. Sci. Robot. 7, eabm5954 (2022).",
    href: "https://www.science.org/doi/10.1126/scirobotics.abm5954",
  },
  {
    num: 4,
    text: "Loquercio, A. et al. Learning high-speed flight in the wild. Sci. Robot. 6, eabg5810 (2021).",
    href: "https://www.science.org/doi/10.1126/scirobotics.abg5810",
  },
  {
    num: 5,
    text: "Zhang, Z. & Scaramuzza, D. Perception-aware receding horizon navigation for MAVs. in 2018 IEEE International Conference on Robotics and Automation (ICRA) 2534–2541 (IEEE, 2018).",
    href: "https://ieeexplore.ieee.org/document/8460684",
  },
  {
    num: 6,
    text: "Delmerico, J., Cieslewski, T., Rebecq, H., Faessler, M. & Scaramuzza, D. Are we ready for autonomous drone racing? the uzh-fpv drone racing dataset. in 2019 International Conference on Robotics and Automation (ICRA) 6713–6719 (IEEE, 2019).",
    href: "https://ieeexplore.ieee.org/document/8793887",
  },
  {
    num: 7,
    text: "Wang, W. et al. Tartanair: A dataset to push the limits of visual slam. in 2020 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS) 4909–4916 (IEEE, 2020).",
    href: "https://arxiv.org/abs/2003.14338",
  },
  {
    num: 8,
    text: "Teed, Z. & Deng, J. DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras. Adv. Neural Inf. Process. Syst. (2021).",
    href: "https://arxiv.org/abs/2108.10869",
  },
  {
    num: 9,
    text: "Cioffi, G., Bauersfeld, L., Kaufmann, E. & Scaramuzza, D. Learned inertial odometry for autonomous drone racing. IEEE Robot. Autom. Lett. 8, 2684–2691 (2023).",
    href: "https://ieeexplore.ieee.org/document/10015592",
  },
  {
    num: 10,
    text: "Kaufmann, E. et al. Champion-level drone racing using deep reinforcement learning. Nature 620, 982–987 (2023).",
    href: "https://www.nature.com/articles/s41586-023-06419-4",
  },
  {
    num: 11,
    text: "Kaufmann, E., Loquercio, A., Ranftl, R., Müller, M., Koltun, V. & Scaramuzza, D. Deep drone acrobatics. in Proceedings of Robotics: Science and Systems (Corvalis, Oregon, USA, 2020).",
    href: "https://arxiv.org/abs/2006.05768",
  },
  {
    num: 12,
    text: "Foehn, P. et al. Agilicious: Open-source and open-hardware agile quadrotor for vision-based flight. Sci. Robot. 7, eabl6259 (2022).",
    href: "https://www.science.org/doi/10.1126/scirobotics.abl6259",
  },
  {
    num: 13,
    text: "Liang, J. & Lin, M. C. Differentiable physics simulation. in ICLR 2020 Workshop on Integration of Deep Neural Models and Differential Equations (2020).",
    href: "https://arxiv.org/abs/2110.05965",
  },
  {
    num: 14,
    text: "Schulman, J., Wolski, F., Dhariwal, P., Radford, A. & Klimov, O. Proximal policy optimization algorithms. arXiv preprint arXiv:1707.06347 (2017).",
    href: "https://arxiv.org/abs/1707.06347",
  },
  {
    num: 15,
    text: "Giusti, A. et al. A machine learning approach to visual perception of forest trails for mobile robots. IEEE Robot. Autom. Lett. 1, 661–667 (2015).",
    href: "https://ieeexplore.ieee.org/document/7358076",
  },
  {
    num: 16,
    text: "Shi, B., Bai, X. & Yao, C. An end-to-end trainable neural network for image-based sequence recognition and its application to scene text recognition. IEEE Trans. Pattern Anal. Mach. Intell. 39, 2298–2304 (2016).",
    href: "https://arxiv.org/abs/1507.05717",
  },
  {
    num: 17,
    text: "Cho, K. et al. Learning phrase representations using RNN encoder-decoder for statistical machine translation. arXiv preprint arXiv:1406.1078 (2014).",
    href: "https://arxiv.org/abs/1406.1078",
  },
  {
    num: 18,
    text: "Qin, T., Li, P. & Shen, S. VINS-Mono: A Robust and Versatile Monocular Visual-Inertial State Estimator. IEEE Trans. Robot. 34, 1004–1020 (2018).",
    href: "https://arxiv.org/abs/1708.03852",
  },
  {
    num: 19,
    text: "Paszke, A. et al. PyTorch: An Imperative Style, High-Performance Deep Learning Library. arXiv preprint arXiv:1912.01703 (2019).",
    href: "https://arxiv.org/abs/1912.01703",
  },
  {
    num: 20,
    text: "Loquercio, A., Kaufmann, E., Ranftl, R., Dosovitskiy, A., Koltun, V. & Scaramuzza, D. Deep drone racing: From simulation to reality with domain randomization. IEEE Trans. Robot. 36, 1–14 (2019).",
    href: "https://arxiv.org/abs/1905.09294",
  },
  {
    num: 21,
    text: "Metz, L., Freeman, C. D., Schoenholz, S. S. & Kachman, T. Gradients are not all you need. arXiv preprint arXiv:2111.05803 (2021).",
    href: "https://arxiv.org/abs/2111.05803",
  },
  {
    num: 22,
    text: "Bengio, Y., Simard, P. & Frasconi, P. Learning long-term dependencies with gradient descent is difficult. IEEE Trans. Neural Netw. 5, 157–166 (1994).",
    href: "https://ieeexplore.ieee.org/document/279181",
  },
  {
    num: 23,
    text: "Mango Pi MQ Quad. Tiny and Elegant SBC. mangopi.org (2023).",
    href: "https://mangopi.org/mqquad",
  },
];

export default component$(() => {
  return (
    <div class={styles.page}>

      <div class={styles.header}>
        <span class={styles.classifiedBadge}>Distribution restricted</span>
        <h1>Distributed Autonomous Swarm Navigation in GPS-Denied Environments</h1>
        <p class={styles.meta}>Justin Adams &nbsp;·&nbsp; Q2 Computing &nbsp;·&nbsp; October 7, 2025 &nbsp;·&nbsp; Submitted to U.S. Army Civil Engineering Working Group</p>
      </div>

      <div class={styles.layout}>

        <div class={styles.primary}>

          <h2>Abstract</h2>
          <p>This work presents a method for maintaining collective positional confidence in a distributed autonomous swarm operating in environments where GPS and external communication infrastructure are unavailable or actively denied. Terrain data for the defined area of operations is preloaded onto each node prior to deployment, providing the inference basis for localization without reliance on live external signals. Each node performs rapid observation of environmental anomalies and treats successive observations as states in a Markov chain. Confidence in positional estimates is iteratively updated across the swarm, allowing the collective to localize and navigate with high reliability in the absence of centralized coordination.</p>
          <p>The system maintains high positional confidence within the loaded area of operations. Nodes that exit the terrain boundary will experience progressive confidence degradation as observations diverge from the preloaded prior. This is a known constraint that defines the operational envelope, not a failure of the method. The approach is label-blind by design: the terrain prior is geographic, not object-classified. No feature-labeled dataset of the operating environment is required. The method was developed and validated in digital simulation and is designed for zero-shot generalization to physical deployment on low-cost edge hardware.</p>

          <h2>Motivation</h2>
          <p>Modern autonomous systems are overwhelmingly dependent on infrastructure they do not control. GPS can be denied, spoofed, or degraded. Communication links can be jammed or severed. Cloud-based coordination requires connectivity that cannot be guaranteed in contested, disaster, or remote operating environments.</p>
          <p>The operational failure mode is not theoretical. It is the daily reality for systems deployed in environments like those currently documented in active conflict zones. A swarm that cannot localize without external reference is a swarm that cannot be trusted when it is needed most.</p>

          <h2>Key Contributions</h2>
          <ul>
            <li>Inference-based localization using preloaded terrain data, with no GPS or live external signals required</li>
            <li>A label-blind positional confidence framework requiring no object-classified environmental data</li>
            <li>A Markov chain formulation for iterative confidence updating across distributed nodes</li>
            <li>Validation through physics-based digital simulation with design for zero-shot physical generalization</li>
            <li>A hardware target architecture built on low-cost accessible edge compute <a href="#ref-23">[23]</a></li>
          </ul>

          <h2>Relationship to Prior Work</h2>
          <p>This work builds directly on the body of research in aggressive autonomous flight <a href="#ref-1">[1]</a>, gradient-based local planning <a href="#ref-2">[2]</a>, and micro-robot swarm coordination <a href="#ref-3">[3]</a>. The high-speed flight policies demonstrated by Loquercio et al. <a href="#ref-4">[4]</a> established that competent navigation policies can be trained with lean neural networks operating on minimal sensor input, which informs the efficiency constraints of the approach presented here.</p>
          <p>Visual SLAM methods including DROID-SLAM <a href="#ref-8">[8]</a> and VINS-Mono <a href="#ref-18">[18]</a> demonstrate the maturity of onboard localization without external reference. This work departs from visual SLAM in that it does not require camera-based feature tracking or a persistent map. The positional confidence model is derived from anomaly observation rather than feature correspondence.</p>
          <p>The reinforcement learning framework follows the PPO formulation of Schulman et al. <a href="#ref-14">[14]</a>, with physics-based simulation informed by Liang and Lin <a href="#ref-13">[13]</a>. The champion-level drone racing results of Kaufmann et al. <a href="#ref-10">[10]</a> and the deep acrobatics work <a href="#ref-11">[11]</a> establish the upper bound of what learned flight policies can achieve, motivating the pursuit of similar capability under infrastructure denial.</p>

          <h2>Status</h2>
          <p>Full methodology, experimental results, and implementation details remain restricted pending review. The citation record above represents the complete foundational literature from which this contribution was derived. All referenced authors are credited in full.</p>

        </div>

        <div class={styles.references}>
          <h2>References</h2>
          <ol class={styles.refList}>
            {references.map((ref) => (
              <li key={ref.num} id={`ref-${ref.num}`} class={styles.refItem}>
                <span class={styles.refNum}>{ref.num}.</span>
                {ref.text}{" "}
                <a href={ref.href} target="_blank" rel="noopener noreferrer">[link]</a>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Distributed Autonomous Swarm Navigation | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing research on distributed autonomous swarm navigation in GPS-denied environments using object-blind positional confidence and Markov chain estimation.",
    },
    {
      name: "robots",
      content: "noindex",
    },
  ],
};
