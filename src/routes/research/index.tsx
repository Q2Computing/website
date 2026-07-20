import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import { swarmSupportingResearch, reactorSupportingResearch } from "../../data/research";
import styles from "./research.module.css";

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
