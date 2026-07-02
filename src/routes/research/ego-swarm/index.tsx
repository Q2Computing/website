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
        <h1>EGO-Swarm: A Fully Autonomous and Decentralized Quadrotor Swarm System in Cluttered Environments</h1>
        <p class={styles.meta}>
          Zhou, X., Zhu, J., Zhou, H., Xu, C. &amp; Gao, F. &nbsp;·&nbsp; arXiv:2011.04183 (2020) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2011.04183" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Most quadrotor swarm research at the time of this publication was validated under
          motion capture systems, pre-built maps, or pure simulation: conditions that assume
          external infrastructure the field environment does not provide. EGO-Swarm is the
          first systematic solution for fully autonomous decentralized quadrotor swarms
          operating in unknown cluttered environments using only onboard compute, onboard
          sensing, and a bandwidth-limited broadcast network.
        </p>
        <p>
          The system extends EGO-Planner's gradient-based local planning framework to multiple
          agents, adding three capabilities: implicit topological trajectory generation to
          escape local minima, decentralized reciprocal collision avoidance formulated as a
          soft barrier penalty, and relative localization drift compensation using agent
          detection in depth images. Real-world experiments demonstrate three quadrotors
          navigating a forest at 1.5 m/s with no external infrastructure.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>EGO-Planner baseline objective</h3>
        <p>
          EGO-Swarm inherits the single-agent gradient-based trajectory optimization from
          EGO-Planner. A uniform B-spline with control points{" "}
          <Math tex="Q" /> parameterizes the trajectory. The optimizer minimizes:
        </p>
        <Math display tex="\min_Q \; J_\text{EGO} = \sum_{r \in \{s,c,d,t\}} \lambda_r J_r" />
        <p>
          Smoothness <Math tex="J_s" /> and terminal progress <Math tex="J_t" /> are
          minimum-error terms:
        </p>
        <Math display tex="J_r = \left\| L(Q) - D \right\|_n^n" />
        <p>
          Collision <Math tex="J_c" /> and dynamic feasibility <Math tex="J_d" /> are
          soft barrier constraints that penalize control points violating a threshold{" "}
          <Math tex="T" />:
        </p>
        <Math display tex="J_r = \begin{cases} \left\| L(Q) - (T - \epsilon) \right\|_S^n & L(Q) > T - \epsilon \\ 0 & L(Q) \leq T - \epsilon \end{cases}" />
        <p>
          Obstacle distance for control point <Math tex="Q_i" /> relative to obstacle{" "}
          <Math tex="j" /> is defined via an anchor-normal pair{" "}
          <Math tex="\{p_{ij}, v_{ij}\}" />:
        </p>
        <Math display tex="d_{ij} = (Q_i - p_{ij}) \cdot v_{ij}" />
        <p>
          The anchor <Math tex="p_{ij}" /> lies at the obstacle surface and{" "}
          <Math tex="v_{ij}" /> points outward along the safe direction. No Euclidean
          Signed Distance Field is required. The environment is represented entirely by
          these sparse {"{p, v}"} pairs, which is why replanning takes only milliseconds.
        </p>

        <h3>Implicit topological trajectory generation</h3>
        <p>
          Gradient descent on a single objective can converge to local minima where two
          agents crowd the same corridor or produce dynamically infeasible trajectories.
          EGO-Swarm escapes local minima implicitly by generating a second candidate with
          inverted constraint direction:
        </p>
        <Math display tex="v_\text{new} := -v, \quad p_\text{new} \text{ at opposite obstacle surface}" />
        <p>
          The pair <Math tex="\{p_\text{new}, v_\text{new}\}" /> defines a constraint that
          forces the trajectory to the opposite side of the obstacle, placing it in a
          distinct topological class under the Uniform Visibility Deformation (UVD) relation
          from Zhou et al. 2020. Two trajectories <Math tex="\gamma_1, \gamma_2" /> are
          UVD-distinct if there exists some parameter <Math tex="s" /> such that the
          line segment <Math tex="\gamma_1(s)\gamma_2(s)" /> passes through an obstacle.
          Both candidates are optimized in parallel threads and the lower-cost trajectory
          is executed. Computation overhead: 0.017 ms versus 7.63 ms for Fast-Planner's
          explicit path search.
        </p>

        <h3>Reciprocal collision avoidance</h3>
        <p>
          Let <Math tex="x_k(t) \in \mathbb{R}^3" /> be the position of agent{" "}
          <Math tex="k" /> among <Math tex="K" /> agents. The free region for agent{" "}
          <Math tex="k" /> excluding other agents is:
        </p>
        <Math display tex="X_k^\text{free}(t) := X \setminus \{x_i(t) \mid i \in \mathbb{Z} \setminus k,\; i \leq K\}" />
        <p>
          Swarm collision avoidance is added as a soft barrier penalty over the trajectory
          time span <Math tex="[t_s, t_e]" />:
        </p>
        <Math display tex="J_{w,k} = \int_{t_s}^{t_e} \begin{cases} d_{k,i}(t)^2 & d_{k,i}(t) < 0 \\ 0 & d_{k,i}(t) \geq 0 \end{cases}\, dt" />
        <Math display tex="d_{k,i}(t) = E^{1/2}[\gamma_k(t) - \gamma_i(t)] - (C + \epsilon)" />
        <p>
          where <Math tex="E := \text{diag}(1, 1, 1/c),\; c > 1" /> stretches the
          ellipsoidal safety margin along the vertical axis to reduce downwash risk,
          and <Math tex="C" /> is the user-defined agent clearance. Adding the weighted
          swarm penalty to the base objective gives each agent's full planning problem:
        </p>
        <Math display tex="\min_Q \; J = J_\text{EGO} + \lambda_w J_{w,k}" />
        <p>
          B-spline position evaluation used in the collision integral uses matrix form:
        </p>
        <Math display tex="\gamma(t) = s(t)^\top M_{p_b+1} q_m, \quad s(t) = [1,\, s,\, s^2,\, \ldots,\, s^{p_b}]^\top" />
        <p>
          where <Math tex="s(t) = (t - t_m)/\Delta t" /> on knot span{" "}
          <Math tex="(t_m, t_{m+1}]" /> and <Math tex="M_{p_b+1}" /> is the constant
          B-spline basis matrix for degree <Math tex="p_b" />.
        </p>

        <h3>Localization drift compensation</h3>
        <p>
          VIO drift accumulates during flight in the absence of loop-closure. EGO-Swarm
          corrects drift by comparing predicted agent positions from received trajectories
          against observed positions in depth images. A spherical trust region{" "}
          <Math tex="\mathcal{S} \subset \mathbb{R}^3" /> centered at the predicted
          position <Math tex="\gamma_i(t_\text{now})" /> with empirical radius{" "}
          <Math tex="R" /> is projected into the depth image:
        </p>
        <Math display tex="z \begin{bmatrix} s \\ 1 \end{bmatrix} = K T_{wc} \begin{bmatrix} \bar{s} \\ 1 \end{bmatrix}, \quad \bar{s} \in \mathcal{S}" />
        <p>
          where <Math tex="K" /> is the camera intrinsic matrix and{" "}
          <Math tex="T_{wc}" /> is the extrinsic. The exact projection is an elliptical
          conic section, so an approximate axis-aligned ellipse{" "}
          <Math tex="\tilde{\mathcal{S}}" /> is used instead. Depth points within{" "}
          <Math tex="\tilde{\mathcal{S}}" /> that project into{" "}
          <Math tex="\mathcal{S}" /> form a point cluster{" "}
          <Math tex="\mathcal{P}" />. The observed agent position is the cluster centroid:
        </p>
        <Math display tex="\hat{p} = \mu_1(\mathcal{P})" />
        <p>
          The error between <Math tex="\gamma_i(t_\text{now})" /> and{" "}
          <Math tex="\hat{p}" /> is fed to a filter; the estimated drift is then used to
          correct the VIO estimate. Detected agents are masked from both depth images and
          grayscale images before map fusion to prevent moving agents from corrupting the
          static obstacle map.
        </p>

        <h2>System architecture</h2>
        <p>
          Each agent runs an identical onboard stack: camera and IMU feed VIO drift
          correction and agent removal, producing odometry and local maps. A local planner
          generates trajectories that are broadcast immediately to all agents. Two networks
          connect the swarm:
        </p>
        <ul>
          <li>
            <strong>Broadcast network:</strong> Trajectory sharing over unreliable
            low-bandwidth links. Each agent rechecks collision as soon as a new trajectory
            is received and replans if necessary. This handles the race condition where
            two agents simultaneously generate non-conflicting trajectories that conflict
            with each other after transmission delay.
          </li>
          <li>
            <strong>Chain network:</strong> Reliable connection-based network used only
            for timestamp synchronization and ordered startup. Agents generate initial
            trajectories in priority order to avoid chaos during simultaneous initialization.
          </li>
        </ul>

        <h2>Benchmark results</h2>
        <p>
          Swarm planning in empty space comparing eight agents performing swap transitions
          on a circle (i7-9700KF, simulation):
        </p>
        <ul>
          <li>
            <strong>EGO-Swarm computation time:</strong> 0.514 ms per replanning cycle,
            versus 668 ms for DMPC (offline) and 1180 ms for RBP (offline)
          </li>
          <li>
            <strong>ORCA collision rate:</strong> 0.375 collisions per agent, versus 0
            for EGO-Swarm. ORCA's velocity-based formulation is incompatible with
            third-order quadrotor dynamics.
          </li>
          <li>
            <strong>Flight time:</strong> 14.3 s for EGO-Swarm versus 28.5 s for ORCA,
            confirming that collision-free trajectories are not conservatively planned
          </li>
        </ul>
        <p>
          In obstacle-rich environments (0.42 obs/m²), ten simulated drones maintained
          a minimum clearance of 0.208 m with a planning cycle of 5.00 ms. Computation
          time scales sub-linearly with agent count due to the on-demand collision check
          strategy that ignores trajectories outside the planning horizon.
        </p>

        <h2>What this means for robotic automation</h2>
        <p>
          The gradient-based collision formulation is the result most directly relevant
          to distributed automation at scale. Centralized swarm planners require
          high-frequency accurate pose communication, a guarantee that degrades or
          disappears in field environments. EGO-Swarm's broadcast-and-replan strategy
          tolerates packet loss and latency by design: each agent's planner treats received
          trajectories as constraints and rechecks them opportunistically rather than
          depending on reliable delivery.
        </p>
        <p>
          The drift correction mechanism demonstrates that inter-agent relative localization
          can be maintained using only depth cameras and the trajectories already being
          broadcast for collision avoidance. No additional sensor infrastructure is required.
          This matters for any deployment where UWB ranging hardware or external tracking
          is unavailable. The same information exchanged for planning purposes is sufficient
          to bound localization error.
        </p>
        <p>
          The November 2020 preprint date establishes this methodology's public record
          approximately eighteen months before the Science Robotics 2022 publication of
          related swarm flight results, and two and a half years before the publication
          date of Champion-Level Drone Racing.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: EGO-Swarm | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of EGO-Swarm: decentralized quadrotor swarm navigation using gradient-based local planning, implicit topological trajectory generation, and VIO drift correction from depth images.",
    },
  ],
};
