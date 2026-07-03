import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "../swarm-navigation/swarm.module.css";

const references = [
  {
    num: 1,
    text: "Groves, K., Hernandez, E., West, A., Wright, T. & Lennox, B. Robotic exploration of an unknown nuclear environment using radiation informed autonomous navigation. Robotics 10, 78 (2021).",
    href: "https://doi.org/10.3390/robotics10020078",
  },
  {
    num: 2,
    text: "West, A., Wright, T., Tsitsimpelis, I., Groves, K., Joyce, M. J. & Lennox, B. Real-time avoidance of ionising radiation using layered costmaps for mobile robots. Front. Robot. AI 9, 862067 (2022).",
    href: "https://doi.org/10.3389/frobt.2022.862067",
  },
  {
    num: 3,
    text: "West, A., Tsitsimpelis, I., Licata, M., Jazbec, A., Snoj, L., Joyce, M. J. & Lennox, B. Use of Gaussian process regression for radiation mapping of a nuclear reactor with a mobile robot. Sci. Rep. 11, 13975 (2021).",
    href: "https://www.nature.com/articles/s41598-021-93474-4",
  },
  {
    num: 4,
    text: "Stibinger, P., Baca, T., Doubravova, D., Rusnak, J., Solc, J., Jakubek, J., Stepan, P. & Saska, M. RADRON: Cooperative localization of ionizing radiation sources by MAVs with Compton cameras. arXiv:2510.26018 (2025).",
    href: "https://arxiv.org/abs/2510.26018",
  },
  {
    num: 5,
    text: "Będkowski, J. End-to-end navigation stack for nuclear power plant inspection with mobile robot. SoftwareX (2024).",
    href: "https://www.sciencedirect.com/science/article/pii/S2352711024001213",
  },
  {
    num: 6,
    text: "Vairagade, H., Kim, S., Son, H. & Zhang, F. A nuclear power plant digital twin for developing robot navigation and interaction. Front. Energy Res. 12, 1356624 (2024).",
    href: "https://doi.org/10.3389/fenrg.2024.1356624",
  },
  {
    num: 7,
    text: "Zhang, K., Hutson, C., Knighton, J., Herrmann, G. & Scott, T. Radiation tolerance testing methodology of robotic manipulator prior to nuclear waste handling. Front. Robot. AI 7, 6 (2020).",
    href: "https://doi.org/10.3389/frobt.2020.00006",
  },
  {
    num: 8,
    text: "Nancekievill, M. et al. Detection of simulated Fukushima Daiichi fuel debris using a remotely operated vehicle at the Naraha test facility. Sensors 19, 4602 (2019).",
    href: "https://doi.org/10.3390/s19204602",
  },
  {
    num: 9,
    text: "Damiani, C. et al. Overview of the ITER remote maintenance design and of the development activities in Europe. Fusion Eng. Des. (2018).",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S0920379618303739",
  },
  {
    num: 10,
    text: "Yin, R., Wu, H., Li, M., Cheng, Y., Song, Y. & Handroos, H. Mastering autonomous assembly in fusion application with learning-by-doing: a peg-in-hole study. arXiv:2208.11737 (2022).",
    href: "https://arxiv.org/abs/2208.11737",
  },
  {
    num: 11,
    text: "Jonasson, E. T., Pinto, L. R. & Vale, A. Comparison of three key remote sensing technologies for mobile robot localization in nuclear facilities. Fusion Eng. Des. 172, 112691 (2021).",
    href: "https://www.sciencedirect.com/science/article/pii/S0920379621004671",
  },
  {
    num: 12,
    text: "Benito, T. & Barrientos, A. An intelligent human–machine interface architecture for long-term remote robot handling in fusion reactor environments. Appl. Sci. 14, 4814 (2024).",
    href: "https://doi.org/10.3390/app14114814",
  },
  {
    num: 13,
    text: "Patel, H. K. & Rathod, P. J. Use of robotic and automation systems in small modular and micro reactor development. Int. J. Sci. Res. 11, 1524–1527 (2022).",
    href: "https://www.ijsr.net/getabstract.php?paperid=SR24517150508",
  },
  {
    num: 14,
    text: "Jog, N. Highly miniaturized robots for inspection of small nuclear piping. M.S. thesis, Carnegie Mellon University Robotics Institute (2019).",
    href: "https://www.ri.cmu.edu/publications/highly-miniaturized-robots-for-inspection-of-small-nuclear-piping/",
  },
];

export default component$(() => {
  return (
    <div class={styles.page}>

      <div class={styles.header}>
        <span class={styles.classifiedBadge}>Research Direction</span>
        <h1>Radiation-Informed Autonomous Navigation for Robotic Maintenance in Fusion and Small Modular Reactor Facilities</h1>
        <p class={styles.meta}>Justin Adams &nbsp;·&nbsp; Q2 Computing &nbsp;·&nbsp; In development, in coordination with University of Vermont partners</p>
      </div>

      <div class={styles.layout}>

        <div class={styles.primary}>

          <h2>Abstract</h2>
          <p>This is a working research direction, not a completed contribution: an extension of Q2's GPS-denied swarm navigation framework to environments where radiation flux, rather than GPS availability, is the variable that must be inferred, avoided, and navigated around. Remote maintenance and inspection robots for fusion (ITER/DEMO-class) and small modular reactor facilities must operate in confined, activated, and communication-degraded interiors, where continuous line-of-sight teleoperation is unreliable and cumulative dose exposure must be minimized for both the robot and any human oversight team.</p>
          <p>The working direction treats radiation dose-rate gradients the way the swarm-navigation framework treats terrain anomalies: as successive observations updating a positional and safety confidence estimate, informing path planning that keeps cumulative dose and localization uncertainty within bounds without requiring a live external reference signal. Where the original framework is label-blind with respect to objects in the environment, this direction would need to fuse a radiation-safety confidence channel alongside the existing positional confidence channel, since the two are not the same hazard and do not necessarily degrade together.</p>

          <h2>Motivation</h2>
          <p>Fusion facilities built to ITER scale are designed for operational lifespans exceeding 30 years, with remote handling systems that must be maintained, upgraded, and integrated with equipment developed across that entire span <a href="#ref-9">[9]</a> <a href="#ref-12">[12]</a>. Small modular and micro reactor developers face a parallel but distinct problem: smaller facilities, tighter internal geometry, and a stated industry need for robotic inspection and automation as these designs move from concept to deployment <a href="#ref-13">[13]</a> <a href="#ref-14">[14]</a>.</p>
          <p>The precedent for why this matters is not hypothetical. The Fukushima Daiichi response relied on remotely operated vehicles for localization and debris detection under conditions where human entry was not viable <a href="#ref-8">[8]</a>. A navigation system that depends on a live external reference, whether that reference is GPS or an uninterrupted communication link to a human operator, is a system that fails exactly when it is needed most. That is the same failure mode the original swarm-navigation work was built to remove for GPS denial, applied here to a different denied signal.</p>

          <h2>Working Objectives</h2>
          <ul>
            <li>Extend the Markov chain confidence model from GPS denial to radiation-informed navigation and dose-aware path planning, building on layered-costmap and radiation-informed navigation precedent <a href="#ref-1">[1]</a> <a href="#ref-2">[2]</a></li>
            <li>Unify localization confidence and radiation-safety confidence into a single decision variable for autonomous path planning in reactor interiors, informed by existing radiation mapping and sensor-fusion approaches <a href="#ref-3">[3]</a> <a href="#ref-11">[11]</a></li>
            <li>Validate the approach in simulation first, consistent with Q2's existing zero-shot generalization methodology, using reactor digital-twin environments and existing open-source navigation stacks as a baseline <a href="#ref-5">[5]</a> <a href="#ref-6">[6]</a></li>
            <li>Characterize edge-compute and actuator survivability limits for mixed-field radiation environments before any physical deployment <a href="#ref-7">[7]</a></li>
            <li>Extend the distributed-swarm-confidence approach to cooperative radiation-source localization, where Q2's existing multi-agent background applies most directly <a href="#ref-4">[4]</a></li>
            <li>Build a Vermont-based training and fabrication pipeline for this work through a University of Vermont partnership and the Generator makerspace in Burlington</li>
          </ul>

          <h2>Relationship to Prior Work</h2>
          <p>The reactor-robotics literature splits cleanly into two problems this direction has to address together: navigation under an actively hazardous, spatially varying signal <a href="#ref-1">[1]</a> <a href="#ref-2">[2]</a> <a href="#ref-3">[3]</a>, and the systems-integration and hardware-survivability constraints of deploying any autonomous system inside an activated facility at all <a href="#ref-7">[7]</a> <a href="#ref-9">[9]</a> <a href="#ref-12">[12]</a>. Q2's existing swarm-navigation work addresses a structurally similar problem, denial of a reference signal, GPS in that case, but has not yet been adapted to treat radiation dose rate as the denied or hazardous signal, nor to the confined indoor geometry of a reactor interior in place of open terrain.</p>
          <p>The autonomous assembly work of Yin et al. <a href="#ref-10">[10]</a> and the miniaturized piping-inspection robot of Jog <a href="#ref-14">[14]</a> represent the manipulation and physical-form-factor constraints, respectively, that any navigation layer built under this direction would eventually need to operate alongside, rather than being solved by navigation research alone.</p>

          <h2>Status</h2>
          <p>This is an active research direction at Q2 Computing, not a completed or submitted paper. It builds directly on the distributed swarm navigation framework above, and development work, including a proposed DOE INFUSE partnership with the University of Vermont and undergraduate involvement through the Generator makerspace in Burlington, is in progress. No experimental results are available for public release at this stage. The citation record above represents the foundational literature this direction is being built against.</p>

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
  title: "Reactor Robotics & Radiation-Denied Autonomy | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing research direction extending GPS-denied swarm navigation to radiation-informed autonomous robotics for fusion and small modular reactor facility maintenance.",
    },
  ],
};
