import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "./research.module.css";

const swarmSupportingResearch = [
  {
    num: 1,
    title: "Back to Newton's Laws: Learning Vision-Based Agile Flight via Differentiable Physics",
    citation: "Zhang, Y., Hu, Y., Song, Y., Zou, D. & Lin, W. Nature Mach. Intell. (2025).",
    summary: "The primary source that triggered Q2's research direction. Demonstrates autonomous multi-agent flight at 20 m/s with a 90% success rate using differentiable physics simulation, no state estimation, and sub-$21 edge compute. Directly establishes the viability of physics-informed policy learning for the hardware class Q2 targets.",
    href: "https://arxiv.org/abs/2407.10648",
    analysis: "/research/back-to-newtons-laws/",
  },
  {
    num: 2,
    title: "Teach-Repeat-Replan: A Complete and Robust System for Aggressive Flight in Complex Environments",
    citation: "Gao, F. et al. IEEE Trans. Robot. 36, 1526–1545 (2020).",
    summary: "Establishes the complete autonomous flight stack (global planning, local re-planning, and VIO localization) that defines the infrastructure problem Q2's work is designed to operate without.",
    href: "https://arxiv.org/abs/1907.00520",
    analysis: "/research/teach-repeat-replan/",
  },
  {
    num: 3,
    title: "EGO-Planner: An ESDF-Free Gradient-Based Local Planner for Quadrotors",
    citation: "Zhou, X., Wang, Z., Ye, H., Xu, C. & Gao, F. IEEE Robot. Autom. Lett. 6, 478–485 (2020).",
    summary: "Demonstrates gradient-based local planning without expensive distance field computation, directly informing the efficiency constraints of Q2's edge-compute deployment target.",
    href: "https://arxiv.org/abs/2008.08835",
    analysis: "/research/ego-planner/",
  },
  {
    num: 4,
    title: "EGO-Swarm: A Fully Autonomous and Decentralized Quadrotor Swarm System in Cluttered Environments",
    citation: "Zhou, X., Zhu, J., Zhou, H., Xu, C. & Gao, F. arXiv:2011.04183 (2020).",
    summary: "First systematic solution for fully autonomous decentralized quadrotor swarms in unknown cluttered environments using only onboard resources. Extends EGO-Planner with implicit topological planning, reciprocal collision avoidance as a soft barrier penalty, and VIO drift correction via agent detection in depth images.",
    href: "https://arxiv.org/abs/2011.04183",
    analysis: "/research/ego-swarm/",
  },
  {
    num: 5,
    title: "Learning High-Speed Flight in the Wild",
    citation: "Loquercio, A. et al. Sci. Robot. 6, eabg5810 (2021).",
    summary: "Proves that lean neural networks operating on minimal sensor input can support competent high-speed navigation, motivating Q2's efficiency-first policy architecture.",
    href: "https://www.science.org/doi/10.1126/scirobotics.abg5810",
    analysis: "/research/learning-high-speed-flight/",
  },
  {
    num: 6,
    title: "Perception-Aware Receding Horizon Navigation for MAVs",
    citation: "Zhang, Z. & Scaramuzza, D. ICRA 2534–2541 (IEEE, 2018).",
    summary: "Integrates perception quality directly into trajectory optimization, a complementary approach to Q2's anomaly-observation confidence model.",
    href: "https://ieeexplore.ieee.org/document/8460684",
    analysis: "/research/perception-aware-navigation/",
  },
  {
    num: 7,
    title: "AlphaPilot: Autonomous Drone Racing",
    citation: "Foehn, P. et al. arXiv:2005.12813 (2020).",
    summary: "Documents the DARPA-backed AlphaPilot Challenge system, establishing aggressive vision-based flight benchmarks at speeds exceeding 8 m/s. Provides the open-access American performance baseline that contextualizes the ceiling Q2's GPS-denied framework is designed to operate within.",
    href: "https://arxiv.org/abs/2005.12813",
    analysis: "/research/alphapilot/",
  },
  {
    num: 8,
    title: "TartanAir: A Dataset to Push the Limits of Visual SLAM",
    citation: "Wang, W. et al. IROS 4909–4916 (IEEE, 2020).",
    summary: "Diverse simulation dataset spanning degraded visual conditions, validating the simulation-first approach Q2 uses for zero-shot physical generalization.",
    href: "https://arxiv.org/abs/2003.14338",
    analysis: "/research/tartanair/",
  },
  {
    num: 9,
    title: "DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras",
    citation: "Teed, Z. & Deng, J. NeurIPS (2021).",
    summary: "Establishes the mature visual SLAM baseline for onboard localization across camera modalities without external reference. Q2's anomaly-based approach deliberately departs from this to remove the camera dependency entirely.",
    href: "https://arxiv.org/abs/2108.10869",
    analysis: "/research/droid-slam/",
  },
  {
    num: 10,
    title: "Learned Inertial Odometry for Autonomous Drone Racing",
    citation: "Cioffi, G., Bauersfeld, L., Kaufmann, E. & Scaramuzza, D. IEEE Robot. Autom. Lett. 8, 2684–2691 (2023).",
    summary: "Inertial-only odometry for drone racing validates dead-reckoning under GPS denial, directly informing Q2's sensor-minimal navigation assumption.",
    href: "https://ieeexplore.ieee.org/document/10015592",
    analysis: "/research/learned-inertial-odometry/",
  },
  {
    num: 11,
    title: "Champion-Level Drone Racing Using Deep Reinforcement Learning",
    citation: "Kaufmann, E. et al. Nature 620, 982–987 (2023).",
    summary: "Sets the upper bound of learned flight policy capability at human-champion level, demonstrating that PPO-trained policies with empirical sim-to-real residual models can achieve world-champion performance on embedded hardware.",
    href: "https://www.nature.com/articles/s41586-023-06419-4",
    analysis: "/research/swift-drone-racing/",
  },
  {
    num: 12,
    title: "Deep Drone Acrobatics",
    citation: "Kaufmann, E. et al. Robotics: Science and Systems (2020).",
    summary: "Demonstrates extreme maneuver learning transferable from simulation, establishing the sim-to-real transfer methodology Q2 applies to swarm coordination policies.",
    href: "https://arxiv.org/abs/2006.05768",
    analysis: "/research/deep-drone-acrobatics/",
  },
  {
    num: 13,
    title: "Agilicious: Open-Source and Open-Hardware Agile Quadrotor for Vision-Based Flight",
    citation: "Foehn, P. et al. Sci. Robot. 7, eabl6259 (2022).",
    summary: "Open-source agile quadrotor platform that provides the physical deployment reference architecture and performance envelope for Q2's hardware target.",
    href: "https://www.science.org/doi/10.1126/scirobotics.abl6259",
    analysis: "/research/agilicious/",
  },
  {
    num: 14,
    title: "Differentiable Physics Simulation",
    citation: "Liang, J. & Lin, M. C. ICLR Workshop (2020).",
    summary: "Physics-based simulation for differentiable policy training, the foundational technique behind Q2's digital validation methodology and zero-shot generalization approach.",
    href: "https://arxiv.org/abs/2110.05965",
    analysis: "/research/differentiable-physics/",
  },
  {
    num: 15,
    title: "Proximal Policy Optimization Algorithms",
    citation: "Schulman, J. et al. arXiv:1707.06347 (2017).",
    summary: "The proximal policy optimization algorithm Q2 applies for reinforcement learning-based policy training within the swarm coordination framework.",
    href: "https://arxiv.org/abs/1707.06347",
    analysis: "/research/ppo/",
  },
  {
    num: 16,
    title: "A Machine Learning Approach to Visual Perception of Forest Trails for Mobile Robots",
    citation: "Giusti, A. et al. IEEE Robot. Autom. Lett. 1, 661–667 (2015).",
    summary: "Early demonstration of visual navigation policy learning in unstructured environments with no pre-labeled map, a direct analogue to Q2's object-blind positional confidence approach.",
    href: "https://ieeexplore.ieee.org/document/7358076",
    analysis: "/research/forest-trails/",
  },
  {
    num: 17,
    title: "An End-to-End Trainable Neural Network for Image-Based Sequence Recognition",
    citation: "Shi, B., Bai, X. & Yao, C. IEEE Trans. Pattern Anal. Mach. Intell. 39, 2298–2304 (2016).",
    summary: "End-to-end sequence recognition architecture that informs the temporal modeling of successive anomaly observations in Q2's Markov chain confidence framework.",
    href: "https://arxiv.org/abs/1507.05717",
    analysis: "/research/crnn-sequence-recognition/",
  },
  {
    num: 18,
    title: "Learning Phrase Representations Using RNN Encoder-Decoder for Statistical Machine Translation",
    citation: "Cho, K. et al. arXiv:1406.1078 (2014).",
    summary: "Foundational sequence-to-sequence architecture underlying the recurrent modeling of state transition probabilities in Q2's confidence update model.",
    href: "https://arxiv.org/abs/1406.1078",
    analysis: "/research/rnn-encoder-decoder/",
  },
  {
    num: 19,
    title: "VINS-Mono: A Robust and Versatile Monocular Visual-Inertial State Estimator",
    citation: "Qin, T., Li, P. & Shen, S. IEEE Trans. Robot. 34, 1004–1020 (2018).",
    summary: "The most widely deployed GPS-denied localization baseline in the field. Informs Q2's multi-sensor integration approach: low-resolution camera frames evaluating terrain conformation with computationally simple algorithms improve positional accuracy and precision beyond inertial sensing alone.",
    href: "https://arxiv.org/abs/1708.03852",
    analysis: "/research/vins-mono/",
  },
  {
    num: 20,
    title: "PyTorch: An Imperative Style, High-Performance Deep Learning Library",
    citation: "Paszke, A. et al. NeurIPS (2019).",
    summary: "The deep learning framework used for implementing and training Q2's policy networks and confidence estimation models.",
    href: "https://arxiv.org/abs/1912.01703",
    analysis: "/research/pytorch/",
  },
  {
    num: 21,
    title: "Deep Drone Racing: From Simulation to Reality with Domain Randomization",
    citation: "Loquercio, A. et al. IEEE Trans. Robot. 36, 1–14 (2019).",
    summary: "Domain randomization for sim-to-real transfer in aggressive flight, directly informing Q2's zero-shot generalization methodology from digital simulation to physical deployment.",
    href: "https://arxiv.org/abs/1905.09727",
    analysis: "/research/deep-drone-racing/",
  },
  {
    num: 22,
    title: "Gradients Are Not All You Need",
    citation: "Metz, L. et al. arXiv:2111.05803 (2021).",
    summary: "Characterizes failure modes of gradient-based optimization in chaotic dynamical systems, informing Q2's hybrid approach to policy training under non-smooth swarm dynamics.",
    href: "https://arxiv.org/abs/2111.05803",
    analysis: "/research/gradients-not-all-you-need/",
  },
  {
    num: 23,
    title: "Learning Long-Term Dependencies with Gradient Descent Is Difficult",
    citation: "Bengio, Y., Simard, P. & Frasconi, P. IEEE Trans. Neural Netw. 5, 157–166 (1994).",
    summary: "Foundational characterization of the vanishing gradient problem in recurrent networks, directly relevant to Q2's Markov chain formulation for iterative confidence updating across distributed nodes.",
    href: "https://ieeexplore.ieee.org/document/279181",
    analysis: "/research/learning-long-term-dependencies/",
  },
];

const reactorSupportingResearch = [
  {
    num: 1,
    title: "Robotic Exploration of an Unknown Nuclear Environment Using Radiation Informed Autonomous Navigation",
    citation: "Groves, K., Hernandez, E., West, A., Wright, T. & Lennox, B. Robotics 10, 78 (2021).",
    summary: "Converts radiation measurements into a navigation cost signal so a ground robot can actively avoid high-dose areas while exploring an unmapped facility. Direct analogue to Q2's anomaly-observation confidence model, with dose rate replacing terrain anomaly as the observed variable.",
    href: "https://doi.org/10.3390/robotics10020078",
  },
  {
    num: 2,
    title: "Real-Time Avoidance of Ionising Radiation Using Layered Costmaps for Mobile Robots",
    citation: "West, A., Wright, T., Tsitsimpelis, I., Groves, K., Joyce, M. J. & Lennox, B. Front. Robot. AI 9, 862067 (2022).",
    summary: "Layered costmap formulation for real-time radiation avoidance during exploration of poorly documented environments, informing how Q2's confidence-based path planning would need to weight an actively updated hazard field rather than a static preloaded prior.",
    href: "https://doi.org/10.3389/frobt.2022.862067",
  },
  {
    num: 3,
    title: "Use of Gaussian Process Regression for Radiation Mapping of a Nuclear Reactor with a Mobile Robot",
    citation: "West, A., Tsitsimpelis, I., Licata, M., Jazbec, A., Snoj, L., Joyce, M. J. & Lennox, B. Sci. Rep. 11, 13975 (2021).",
    summary: "Interpolates sparse, noisy radiation measurements into a continuous reactor dose-rate map, benchmarked against MCNP6 transport simulation. Establishes the sensor-fusion baseline Q2's radiation-informed confidence model would need to match or improve on.",
    href: "https://www.nature.com/articles/s41598-021-93474-4",
  },
  {
    num: 4,
    title: "RADRON: Cooperative Localization of Ionizing Radiation Sources by MAVs with Compton Cameras",
    citation: "Stibinger, P., Baca, T., Doubravova, D., Rusnak, J., Solc, J., Jakubek, J., Stepan, P. & Saska, M. arXiv:2510.26018 (2025).",
    summary: "Cooperative multi-drone radiation-source localization using miniature Compton cameras, bringing Q2's existing swarm-coordination and distributed-confidence background directly into the radiation-sensing domain.",
    href: "https://arxiv.org/abs/2510.26018",
  },
  {
    num: 5,
    title: "End-to-End Navigation Stack for Nuclear Power Plant Inspection with Mobile Robot",
    citation: "Będkowski, J. SoftwareX (2024).",
    summary: "Open-source, feature-less LiDAR/IMU SLAM stack purpose-built for nuclear facility inspection, the closest existing analogue to the indoor, GPS-denied localization problem Q2's terrain-prior framework was designed around.",
    href: "https://www.sciencedirect.com/science/article/pii/S2352711024001213",
  },
  {
    num: 6,
    title: "A Nuclear Power Plant Digital Twin for Developing Robot Navigation and Interaction",
    citation: "Vairagade, H., Kim, S., Son, H. & Zhang, F. Front. Energy Res. 12, 1356624 (2024).",
    summary: "Full-scope NPP simulator driving a 3D digital twin for training inspection robot swarms. Validates the simulation-first, zero-shot-to-physical methodology Q2 already applies to its swarm navigation work, applied instead to reactor interiors.",
    href: "https://doi.org/10.3389/fenrg.2024.1356624",
  },
  {
    num: 7,
    title: "Radiation Tolerance Testing Methodology of Robotic Manipulator Prior to Nuclear Waste Handling",
    citation: "Zhang, K., Hutson, C., Knighton, J., Herrmann, G. & Scott, T. Front. Robot. AI 7, 6 (2020).",
    summary: "Controlled gamma exposure testing of a commercial manipulator, establishing a methodology for characterizing edge-compute and actuator survivability limits before physical deployment in an activated environment.",
    href: "https://doi.org/10.3389/frobt.2020.00006",
  },
  {
    num: 8,
    title: "Detection of Simulated Fukushima Daiichi Fuel Debris Using a Remotely Operated Vehicle at the Naraha Test Facility",
    citation: "Nancekievill, M. et al. Sensors 19, 4602 (2019).",
    summary: "Field-validated localization system for an underwater inspection robot at a full-scale Fukushima Daiichi test mockup, grounding the reactor-robotics direction in a real deployed accident-response precedent rather than a lab demonstration only.",
    href: "https://doi.org/10.3390/s19204602",
  },
  {
    num: 9,
    title: "Overview of the ITER Remote Maintenance Design and of the Development Activities in Europe",
    citation: "Damiani, C. et al. Fusion Eng. Des. (2018).",
    summary: "Defines the remote-handling architecture and 30-year operational lifespan constraints that ITER-class fusion facilities impose on maintenance robotics, establishing the scale and durability requirements this research direction has to eventually address.",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S0920379618303739",
  },
  {
    num: 10,
    title: "Mastering Autonomous Assembly in Fusion Application with Learning-by-Doing: A Peg-in-Hole Study",
    citation: "Yin, R., Wu, H., Li, M., Cheng, Y., Song, Y. & Handroos, H. arXiv:2208.11737 (2022).",
    summary: "Learned autonomous assembly for plasma-facing component replacement, representing the manipulation half of fusion maintenance robotics that complements Q2's navigation-focused contribution.",
    href: "https://arxiv.org/abs/2208.11737",
  },
  {
    num: 11,
    title: "Comparison of Three Key Remote Sensing Technologies for Mobile Robot Localization in Nuclear Facilities",
    citation: "Jonasson, E. T., Pinto, L. R. & Vale, A. Fusion Eng. Des. 172, 112691 (2021).",
    summary: "Benchmarks depth camera, LIDAR, and mmWave RADAR for localization inside nuclear facilities, informing which sensing modalities remain viable when radiation and confined geometry degrade the options Q2's drone-domain work assumed were available.",
    href: "https://www.sciencedirect.com/science/article/pii/S0920379621004671",
  },
  {
    num: 12,
    title: "An Intelligent Human–Machine Interface Architecture for Long-Term Remote Robot Handling in Fusion Reactor Environments",
    citation: "Benito, T. & Barrientos, A. Appl. Sci. 14, 4814 (2024).",
    summary: "Long-lifecycle HMI architecture (MAMIC) for coordinating evolving remote-handling equipment over a multi-decade fusion facility lifespan, framing the systems-integration problem any autonomous navigation layer has to plug into.",
    href: "https://doi.org/10.3390/app14114814",
  },
  {
    num: 13,
    title: "Use of Robotic and Automation Systems in Small Modular and Micro Reactor Development",
    citation: "Patel, H. K. & Rathod, P. J. Int. J. Sci. Res. 11, 1524–1527 (2022).",
    summary: "Surveys robotic and automation applications across SMR/micro-reactor manufacturing, inspection, and maintenance, the clearest existing statement of the SMR-specific opportunity this research direction targets.",
    href: "https://www.ijsr.net/getabstract.php?paperid=SR24517150508",
  },
  {
    num: 14,
    title: "Highly Miniaturized Robots for Inspection of Small Nuclear Piping",
    citation: "Jog, N. M.S. thesis, Carnegie Mellon University Robotics Institute (2019).",
    summary: "Demonstrates a robot (NanoPiper) built to operate inside 3-inch nuclear piping, using acoustic localization and miniaturized radiation sensing. Sets the miniaturization floor for edge-compute hardware operating in the tightest reactor-interior geometries.",
    href: "https://www.ri.cmu.edu/publications/highly-miniaturized-robots-for-inspection-of-small-nuclear-piping/",
  },
];

export default component$(() => {
  return (
    <div class={styles.page}>

      <div class={styles.header}>
        <h1>Research</h1>
        <p>
          Original contributions from Q2 Computing alongside the foundational body of work that supports them.
        </p>
      </div>

      <div class={styles.colHeaders}>
        <span class={styles.colLabel}>Q2 Computing</span>
        <span class={styles.colLabel}>External Sources</span>
      </div>

      <div class={styles.trackSection}>
      <h2 class={styles.trackHeading}>Autonomous Swarm Navigation</h2>
      <div class={styles.layout}>

        {/* ── Left: Q2 Computing original work ── */}
        <div class={styles.q2col}>
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
              deployment on low-cost edge hardware.
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
          <ol class={styles.refList}>
            {swarmSupportingResearch.map((ref) => (
              <li key={ref.num} id={`ref-swarm-${ref.num}`} class={styles.refItem}>
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

      <div class={styles.trackSection}>
      <h2 class={styles.trackHeading}>Reactor Robotics &amp; Radiation-Denied Autonomy</h2>
      <div class={styles.layout}>

        {/* ── Left: Q2 Computing original work ── */}
        <div class={styles.q2col}>
          <div class={styles.paper}>
            <p class={styles.paperMeta}>
              Justin Adams &nbsp;·&nbsp; Q2 Computing
              <span class={styles.restrictedBadge}>Research Direction</span>
            </p>

            <h3>Radiation-Informed Autonomous Navigation for Robotic Maintenance in Fusion and Small Modular Reactor Facilities</h3>

            <p>
              An extension of Q2's GPS-denied swarm confidence framework to a new class of
              denied signal: environments where radiation flux, not GPS, is the variable that
              must be inferred, avoided, and navigated around. Remote maintenance and inspection
              robots for fusion (ITER/DEMO-class) and small modular reactor facilities operate in
              confined, activated, and communication-degraded interiors, where continuous
              line-of-sight teleoperation is unreliable and cumulative dose exposure must be
              minimized for both the robot and any human oversight team.
            </p>

            <p>
              The working direction treats radiation dose-rate gradients the way the
              swarm-navigation framework treats terrain anomalies: as successive observations
              updating a positional and safety confidence estimate, informing path planning that
              keeps cumulative dose and localization uncertainty within bounds without requiring
              a live external reference signal <a href="#ref-reactor-1">[1]</a>{" "}
              <a href="#ref-reactor-2">[2]</a>.
            </p>

            <p><strong>Working objectives:</strong></p>
            <ul>
              <li>Extend the Markov chain confidence model from GPS denial to radiation-informed navigation and dose-aware path planning</li>
              <li>Unify localization confidence and radiation-safety confidence into a single decision variable for autonomous path planning in reactor interiors</li>
              <li>Validate the approach in simulation first, consistent with Q2's existing zero-shot generalization methodology, using reactor digital-twin environments <a href="#ref-reactor-6">[6]</a></li>
              <li>Characterize edge-compute and actuator survivability limits for mixed-field radiation environments <a href="#ref-reactor-7">[7]</a></li>
              <li>Build a Vermont-based training and fabrication pipeline for this work with UVM and the Generator makerspace</li>
            </ul>

            <p>
              This is an active research direction at Q2 Computing, not a completed or submitted
              paper. Development work, including a proposed DOE INFUSE partnership with the
              University of Vermont, is in progress. No experimental results are available for
              public release at this stage.
            </p>

            <Link href="/research/reactor-robotics/" class={styles.paperLink}>
              Read the full research direction and citation record →
            </Link>
          </div>
        </div>

        {/* ── Right: supporting research ── */}
        <div class={styles.supportCol}>
          <ol class={styles.refList}>
            {reactorSupportingResearch.map((ref) => (
              <li key={ref.num} id={`ref-reactor-${ref.num}`} class={styles.refItem}>
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
