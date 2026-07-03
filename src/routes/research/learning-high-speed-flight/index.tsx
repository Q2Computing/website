import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Math } from "../../../components/math/math";
import styles from "../teach-repeat-replan/trr.module.css";

export default component$(() => {
  return (
    <div class={styles.page}>

      <div class={styles.header}>
        <p class={styles.breadcrumb}>
          <a href="/research/">Research</a> &rsaquo; Analysis
        </p>
        <h1>Learning High-Speed Flight in the Wild</h1>
        <p class={styles.meta}>
          Loquercio, A. et al.
          &nbsp;·&nbsp; Science Robotics 6, eabg5810 (2021) &nbsp;·&nbsp;
          <a href="https://www.science.org/doi/10.1126/scirobotics.abg5810" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          High-speed flight through unstructured natural environments (forests, orchards,
          mountain terrain) presents a different problem than structured drone racing.
          There are no gates to detect, no known course geometry, and the obstacle
          structure is dense, irregular, and unpredictable. Prior systems required either
          3D maps built in advance or sensors (LiDAR, depth cameras) that are too heavy
          or power-intensive for small platforms.
        </p>
        <p>
          This paper trains a policy to fly at up to 10 m/s through previously unseen
          natural environments using only a forward-facing depth camera and an IMU.
          The key insight is that the policy does not need to reconstruct a 3D map:
          it maps directly from depth observations to body-rate commands, compressing
          the perception-planning-control pipeline into a single forward pass at 25 Hz.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Privileged expert training</h3>
        <p>
          The training follows the same privileged learning pattern as Deep Drone Acrobatics
          (#12). A privileged expert <Math tex="\pi^*" /> has access to the full 3D point
          cloud from simulation and plans collision-free trajectories using sampling-based
          motion planning. The student policy <Math tex="\pi_\theta" /> observes only
          simulated depth images and learns to imitate the expert via DAgger:
        </p>
        <Math display tex="\pi_\theta = \arg\min_\theta \mathbb{E}_{s \sim \rho(\pi_\theta)}\!\left[\|u^*(s) - \pi_\theta(o(s))\|^2\right]" />
        <p>
          where <Math tex="o(s)" /> is the depth image observable from state{" "}
          <Math tex="s" /> and <Math tex="u^* = \pi^*(s)" /> is the expert body rate
          command. The student never sees the 3D point cloud at test time.
        </p>

        <h3>Uncertainty estimation</h3>
        <p>
          The policy outputs both a mean action and an uncertainty estimate. Using
          Monte Carlo dropout, the predicted uncertainty at test time is:
        </p>
        <Math display tex="\hat{\sigma}^2(o) = \frac{1}{M} \sum_{m=1}^{M} \|\hat{u}_m - \bar{u}\|^2" />
        <p>
          where <Math tex="\hat{u}_m" /> is the action sampled from the{" "}
          <Math tex="m" />-th stochastic forward pass and{" "}
          <Math tex="\bar{u} = M^{-1} \sum_m \hat{u}_m" /> is the mean action.
          When <Math tex="\hat{\sigma}^2" /> exceeds a threshold, the system reduces
          commanded speed, trading safety for speed.
        </p>

        <h3>Network architecture</h3>
        <p>
          The policy consists of two components operating asynchronously. A recurrent
          convolutional encoder processes depth images at 25 Hz:
        </p>
        <Math display tex="z_t = \text{RNN}(\text{CNN}(o_t), z_{t-1})" />
        <p>
          The encoded state <Math tex="z_t" /> is concatenated with IMU measurements
          and fed to an MLP that outputs body rates and collective thrust. The recurrent
          unit maintains implicit state across frames, allowing the policy to reason
          about motion-induced depth changes.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Speed:</strong> Successful flight at up to 10 m/s through
            previously unseen forest environments without any pre-built map
          </li>
          <li>
            <strong>Sensors:</strong> Forward-facing depth camera at 25 Hz and IMU only,
            no LiDAR, no GPS, no motion capture
          </li>
          <li>
            <strong>Zero-shot transfer:</strong> Policy trained entirely in simulation
            transfers to physical environments not seen during training
          </li>
          <li>
            <strong>Uncertainty behavior:</strong> The system autonomously slows down
            in high-uncertainty regions (dense obstacles, texture-poor zones) and
            accelerates in open areas
          </li>
          <li>
            <strong>Success rate:</strong> 80% course completion in natural environments
            at 7 m/s average speed, versus 0% for a model-based baseline without a map
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The paper demonstrates that a single lean recurrent policy can subsume
          perception, planning, and control for high-speed navigation in unstructured
          environments. Constructing a map, planning a path through it, and executing
          that path are three sequential steps each of which can fail independently.
          Compressing all three into one network trained end-to-end eliminates the
          failure interfaces between them.
        </p>
        <p>
          The uncertainty-based speed modulation is the correct failure mode for a
          navigation system: when the policy is uncertain, it slows down rather than
          maintaining speed and crashing. This is a safety-by-design property emergent
          from the uncertainty estimation, not from an explicit speed limiter. Any
          navigation system targeting real-world deployment should expose a calibrated
          uncertainty estimate for exactly this purpose.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Learning High-Speed Flight in the Wild | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of high-speed wild flight: privileged DAgger training, Monte Carlo dropout uncertainty estimation, recurrent depth-to-control policy at 10 m/s through unstructured environments.",
    },
  ],
};
