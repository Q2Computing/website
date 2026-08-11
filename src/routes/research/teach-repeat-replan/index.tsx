import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Math } from "../../../components/math/math";
import styles from "./trr.module.css";

export default component$(() => {
  return (
    <div class={styles.page}>

      <div class={styles.header}>
        <p class={styles.breadcrumb}>
          <a href="/research/">Research</a> &rsaquo; Analysis
        </p>
        <h1>Teach-Repeat-Replan: A Complete and Robust System for Aggressive Flight in Complex Environments</h1>
        <p class={styles.meta}>
          Gao, F. et al. &nbsp;·&nbsp; IEEE Trans. Robot. 36, 1526-1545 (2020) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/1907.00520" target="_blank" rel="noopener noreferrer">Paper</a>
          &nbsp;·&nbsp;
          <a href="https://github.com/HKUST-Aerial-Robotics/Teach-Repeat-Replan" target="_blank" rel="noopener noreferrer">Code</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Human-piloted trajectories are geometrically valid but dynamically suboptimal.
          A pilot demonstrates a path through an environment once. The system refines that
          path into one the vehicle can fly aggressively and repeatably, then re-plans locally
          in real time when the environment changes. The three-phase name is the architecture:
          teach (human demonstration), repeat (optimized execution), replan (obstacle avoidance).
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Flight corridor construction</h3>
        <p>
          The free-space region around the taught path is approximated as a sequence of
          convex polyhedra. Each polyhedron is grown from a seed point on the reference
          trajectory using the Seed Convex Polyhedron Inflation (SCPI) algorithm.
          The corridor <Math tex="\mathcal{C} = \{P_1, P_2, \ldots, P_n\}" /> is the union
          of these overlapping polyhedra, and the optimized trajectory must satisfy:
        </p>
        <Math display tex="\mathbf{T}(t) \in \mathcal{C} \quad \forall\, t" />
        <p>
          Convex polyhedra give the optimizer significantly more geometric freedom than
          axis-aligned boxes, allowing it to find smoother, more energy-efficient paths
          through narrow or angled passages.
        </p>

        <h3>Spatial-temporal decoupling</h3>
        <p>
          Trajectory optimization is split into two sequential problems rather than solved jointly,
          making each sub-problem tractable in real time.
        </p>
        <p>
          <strong>Spatial pass:</strong> Given corridor <Math tex="\mathcal{C}" />, find the
          arc-length-parameterized path <Math tex="\mathbf{p}(s)" /> that minimizes total jerk
          subject to the containment constraint:
        </p>
        <Math display tex="\min_{\mathbf{p}(s)} \int \left\| \frac{d^3 \mathbf{p}}{ds^3} \right\|^2 ds \quad \text{s.t. } \mathbf{p}(s) \in \mathcal{C}" />
        <p>
          <strong>Temporal pass:</strong> Given the spatial path <Math tex="\mathbf{p}(s)" />,
          find a time parameterization <Math tex="s(t)" /> satisfying velocity, acceleration,
          and jerk limits derived from the vehicle's dynamic model. Solved as a convex
          optimization over the time allocation per path segment. Both passes iterate until
          convergence, typically in under 100ms on the onboard computer.
        </p>

        <h3>Local re-planning via gradient descent</h3>
        <p>
          When the onboard stereo camera detects an obstacle not in the global map,
          the system re-plans a local segment in a sliding window around the current position.
          The local re-planner minimizes:
        </p>
        <Math display tex="J = \lambda_s \cdot J_\text{smooth} + \lambda_c \cdot J_\text{collision} + \lambda_f \cdot J_\text{feasibility}" />
        <p>
          where <Math tex="J_\text{smooth}" /> penalizes jerk, <Math tex="J_\text{collision}" /> penalizes
          proximity to obstacle voxels via signed distance field, and <Math tex="J_\text{feasibility}" /> enforces
          dynamic limits. Gradient descent on this combined cost produces a locally adjusted trajectory
          that avoids the new obstacle while remaining kinodynamically feasible. The sliding window
          ensures continuity with the global plan outside the replanned segment.
        </p>

        <h3>Localization: visual-inertial odometry with loop closure</h3>
        <p>
          State estimation uses a tightly-coupled VIO pipeline fusing IMU preintegration
          with stereo visual features. Drift is bounded over long trajectories by loop closure:
          when the vehicle revisits a previously mapped region, the system detects the match,
          computes the relative pose correction <Math tex="\Delta \mathbf{T} \in SE(3)" />,
          and distributes it across the pose graph via g2o optimization, keeping the global
          map consistent even after extended flight.
        </p>

        <h2>Empirical observations</h2>
        <ul>
          <li>
            <strong>Flight speed:</strong> The system demonstrated reliable autonomous flight
            at up to 7 m/s through cluttered indoor environments, significantly above the
            speed at which purely reactive planners become unsafe
          </li>
          <li>
            <strong>Re-planning latency:</strong> Local re-planning completed in under 20ms
            in tested scenarios, enabling real-time obstacle avoidance without interrupting
            global trajectory execution
          </li>
          <li>
            <strong>Corridor generation:</strong> SCPI generated flight corridors for
            complex 3D paths in under 200ms on a ground station CPU, making the
            teach-to-execute transition practical for field deployment
          </li>
          <li>
            <strong>Trajectory smoothness:</strong> Optimized trajectories consistently
            remained below actuator saturation limits (acceleration under 1.5g, jerk
            bounded), whereas raw human-taught trajectories frequently violated these bounds
          </li>
          <li>
            <strong>Sim-to-real transfer:</strong> Policies trained and validated in
            simulation transferred to physical hardware without retuning, confirmed
            across multiple outdoor flight tests in varying wind conditions
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The spatial-temporal decoupling is the transferable insight. Any automation task
          that involves a demonstrated path (a worker shows the robot what to do once)
          followed by repeated optimized execution is a candidate for this framework.
          The math does not care whether the vehicle is a quadrotor, a robotic arm,
          or a mobile ground platform. The corridor constraint and jerk-minimizing optimizer
          apply equally to any system with smooth dynamic limits.
        </p>
        <p>
          The local re-planner is the robustness layer that makes this deployable in
          real environments. A system that can only repeat learned trajectories exactly
          is fragile. One that can re-plan locally around new obstacles in under 20ms
          can operate in environments that change between runs, which is the normal
          condition in any production setting.
        </p>
        <p>
          The VIO localization backbone demonstrates that centimeter-accurate state
          estimation is achievable without GPS using only a camera and IMU. This is
          directly relevant to any indoor or GPS-denied automation deployment.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Teach-Repeat-Replan | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of Teach-Repeat-Replan: key mathematical concepts including spatial-temporal trajectory decoupling, convex corridor construction, and gradient-based local re-planning, and their implications for robotic automation.",
    },
  ],
};
