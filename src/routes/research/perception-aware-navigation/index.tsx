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
        <h1>Perception-Aware Receding Horizon Navigation for MAVs</h1>
        <p class={styles.meta}>
          Zhang, Z. &amp; Scaramuzza, D.
          &nbsp;·&nbsp; ICRA 2534–2541 (IEEE, 2018) &nbsp;·&nbsp;
          <a href="https://ieeexplore.ieee.org/document/8460684" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Visual-inertial odometry fails when the camera cannot track enough visual
          features, which happens when the platform points away from textured surfaces,
          moves too fast for the feature tracker, or enters poorly lit regions.
          Standard trajectory planners treat the camera as a passive sensor and plan
          purely for dynamical feasibility, ignoring whether the resulting trajectory
          will degrade VIO quality.
        </p>
        <p>
          This paper integrates perception quality directly into the trajectory
          optimization. The planner actively chooses trajectories that maintain good
          feature density in the camera field of view, preventing VIO failure before
          it happens. This is a co-optimization of motion and perception rather than
          treating them as independent layers.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Perception quality model</h3>
        <p>
          Let <Math tex="\mathcal{F}(x)" /> be a scalar measure of feature density
          in the camera field of view from state <Math tex="x = (p, q)" />. One
          natural choice is the number of map points visible:
        </p>
        <Math display tex="\mathcal{F}(x) = \left|\left\{l \in \mathcal{M} : \pi(R_c^w(q)\, (l - p) + p_c) \in [0,W] \times [0,H]\right\}\right|" />
        <p>
          where <Math tex="\mathcal{M}" /> is the sparse map, <Math tex="\pi" /> is
          the camera projection, <Math tex="R_c^w(q)" /> is the world-to-camera
          rotation from attitude <Math tex="q" />, and <Math tex="[0,W] \times [0,H]" />
          is the image plane. Higher <Math tex="\mathcal{F}" /> means more features
          visible and better VIO quality.
        </p>

        <h3>Perception-aware MPC objective</h3>
        <p>
          The trajectory optimizer minimizes a composite objective that penalizes
          both tracking error and perception quality loss:
        </p>
        <Math display tex="\min_{u_{0:N}} \sum_{k=0}^{N} \left[\|x_k - x_k^r\|_Q^2 + \|u_k\|_R^2 - \alpha\, \mathcal{F}(x_k)\right]" />
        <p>
          subject to quadrotor dynamics <Math tex="x_{k+1} = f(x_k, u_k)" /> and
          feasibility constraints on thrust and angular rate. The term{" "}
          <Math tex="-\alpha\, \mathcal{F}(x_k)" /> rewards trajectories that
          maintain high feature visibility, with <Math tex="\alpha" /> balancing
          tracking performance against perception quality.
        </p>

        <h3>Receding horizon execution</h3>
        <p>
          The problem is solved at each timestep over a short horizon{" "}
          <Math tex="N \Delta t" /> (typically 1-2 s) and only the first control
          in the sequence is applied. The horizon is short enough that the local
          feature map is approximately constant, making the perception quality term
          <Math tex="\mathcal{F}(x_k)" /> computable without global map updates
          during the optimization.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>VIO survival:</strong> Perception-aware trajectories maintain
            active feature tracking in environments where standard MPC trajectories
            lose tracking completely within the mission window
          </li>
          <li>
            <strong>Mission success:</strong> Navigation tasks that require pointing
            away from textured surfaces are completed successfully with the perception
            objective active; standard planners fail on the same tasks
          </li>
          <li>
            <strong>Computational cost:</strong> Perception quality gradient is
            computed analytically by differentiating through the visibility model,
            adding modest overhead to the MPC solve time
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          Perception-aware planning makes explicit what is implicit in most navigation
          stacks: the localization system has performance requirements that depend on
          where the platform looks, and trajectory planning must respect those requirements.
          A system that navigates correctly but positions its camera where it cannot
          track features will fail when VIO loses tracking.
        </p>
        <p>
          The architectural principle transfers directly: any system with a sensing
          modality whose quality depends on the platform state should include sensing
          quality as a term in the trajectory optimization. For anomaly-based localization,
          this means choosing trajectories that maximize anomaly observation rate rather
          than purely minimizing navigation cost. The planner and the sensor confidence
          model are coupled, not independent layers.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Perception-Aware Receding Horizon Navigation | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of perception-aware MPC: feature visibility model, co-optimization of tracking and perception quality, and receding horizon navigation that prevents VIO failure.",
    },
  ],
};
