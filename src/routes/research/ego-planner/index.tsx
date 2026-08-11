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
        <h1>EGO-Planner: An ESDF-Free Gradient-Based Local Planner for Quadrotors</h1>
        <p class={styles.meta}>
          Zhou, X., Wang, Z., Xu, C. &amp; Gao, F. &nbsp;·&nbsp; IEEE Robot. Autom. Lett. 6, 478-485 (2021) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2008.08835" target="_blank" rel="noopener noreferrer">Paper</a>
          &nbsp;·&nbsp;
          <a href="https://github.com/ZJU-FAST-Lab/ego-planner" target="_blank" rel="noopener noreferrer">Code</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Gradient-based trajectory optimizers need to know two things about every point on a
          trajectory: is it in collision, and which direction moves it out fastest. The standard
          answer is an Euclidean Signed Distance Field (ESDF): a precomputed 3D grid where every
          voxel stores its distance to the nearest obstacle and the gradient pointing away from it.
          ESDF works well but is expensive. Updating the field after sensor observations takes
          20-100ms and touches the entire map volume, most of which the trajectory never visits.
        </p>
        <p>
          EGO-Planner eliminates the ESDF entirely. Instead of asking the map for distances,
          it asks a much cheaper question: for each trajectory control point that is currently
          in collision, where is the nearest point on a collision-free guiding path? The answer
          to that question is all the gradient information the optimizer needs, and it can be
          computed in milliseconds without touching the rest of the map.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>B-spline trajectory representation</h3>
        <p>
          The trajectory is represented as a uniform B-spline of degree <em>p</em>{" "}
          over control points <Math tex="\mathbf{Q} = \{q_0, q_1, \ldots, q_n\}" />:
        </p>
        <Math display tex="\mathbf{T}(t) = \sum_{i} B_{i,p}(t) \cdot q_i" />
        <p>
          where <Math tex="B_{i,p}" /> are the B-spline basis functions. A degree-5 B-spline gives{" "}
          <Math tex="C^2" /> continuity (continuous position, velocity, and acceleration) by construction,
          which means the trajectory is dynamically smooth without explicit smoothness constraints
          on every intermediate waypoint. Velocity and acceleration at any point are linear
          combinations of the control points, so their gradients are constant matrices and no
          numerical differentiation is required.
        </p>

        <h3>ESDF-free collision penalty</h3>
        <p>
          For each control point <Math tex="q_i" /> that lies inside an occupied voxel, EGO-Planner
          constructs a guiding path: a collision-free path segment near <Math tex="q_i" /> found by
          ray-casting through the occupied region. Let <Math tex="g_i" /> be the nearest point on this
          guiding path to <Math tex="q_i" />. The collision cost for that control point is:
        </p>
        <Math display tex="J_c(q_i) = \frac{1}{2} \| q_i - g_i \|^2" />
        <p>
          The gradient <Math tex="\nabla J_c = q_i - g_i" /> points directly from the collision point
          toward the guiding path, replacing the ESDF gradient entirely. The guiding path is only
          computed for control points that are actually in collision. The planner touches no map
          information outside the trajectory's immediate vicinity.
        </p>

        <h3>Smoothness cost</h3>
        <p>
          The smoothness penalty operates on the finite differences of control points,
          which correspond to velocity, acceleration, and jerk under the B-spline parameterization:
        </p>
        <Math display tex="J_s = \lambda_v \sum \|v_i\|^2 + \lambda_a \sum \|a_i\|^2 + \lambda_j \sum \|j_i\|^2" />
        <p>
          where <Math tex="v_i, a_i, j_i" /> are the velocity, acceleration, and jerk vectors at each knot.
        </p>

        <h3>Dynamic feasibility via time reallocation</h3>
        <p>
          Rather than penalizing dynamic constraint violations inside the cost function,
          EGO-Planner handles feasibility as a post-optimization correction. After each
          optimization step, if any velocity or acceleration bound is violated, the time
          allocation is scaled:
        </p>
        <Math display tex="T_\text{new} = T_\text{old} \cdot \max\!\left(\frac{\|v_i\|}{v_\text{max}},\ \sqrt{\frac{\|a_i\|}{a_\text{max}}}\right)" />
        <p>
          Scaling up <Math tex="T" /> uniformly reduces all velocities and accelerations proportionally
          while preserving the trajectory shape. An anisotropic curve-fitting step then adjusts
          higher-order derivatives independently per axis to recover smoothness without distorting
          the spatial path.
        </p>

        <h3>Total optimization objective</h3>
        <Math display tex="J = \lambda_s \cdot J_\text{smooth} + \lambda_c \cdot J_\text{collision}" />
        <p>
          Minimized via L-BFGS over the control point positions. Dynamic feasibility is enforced
          by the time reallocation step outside the gradient loop, keeping the optimization
          landscape well-conditioned and making feasibility a hard guarantee rather than a
          soft preference.
        </p>

        <h2>Empirical observations</h2>
        <ul>
          <li>
            <strong>Planning time:</strong> EGO-Planner completed replanning cycles in 2-6ms
            on an Intel NUC (i7, 8th gen). ESDF-based baselines required 20-100ms for equivalent
            map sizes, a 10-20x speedup
          </li>
          <li>
            <strong>Flight speed:</strong> Real-world experiments confirmed stable autonomous
            flight at up to 7.4 m/s in cluttered indoor environments without collision
          </li>
          <li>
            <strong>Trajectory quality:</strong> Benchmark comparisons showed EGO-Planner
            produced trajectories with comparable smoothness and safety margins to ESDF-based
            methods despite not computing the field
          </li>
          <li>
            <strong>Hardware target:</strong> Successfully deployed on embedded platforms
            including the NVIDIA Jetson TX2, confirming the method is viable on the class
            of hardware Q2 targets for edge deployment
          </li>
          <li>
            <strong>Replanning frequency:</strong> The sub-10ms planning time enabled
            replanning at 10-20Hz, sufficient for real-time obstacle avoidance at the
            tested flight speeds
          </li>
          <li>
            <strong>Robustness:</strong> Experiments in both simulated and real environments
            with dynamic obstacles confirmed the guiding-path gradient remains stable when
            the trajectory crosses new obstacles mid-flight
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The ESDF removal is the transferable result. Any gradient-based motion planner that
          currently maintains a distance field to compute collision gradients is paying a
          computational tax proportional to map volume. EGO-Planner shows that the only
          information the optimizer actually needs is local to the trajectory itself.
          The insight scales to ground robots, robotic arms, and any system doing real-time
          trajectory optimization in a changing environment.
        </p>
        <p>
          The time-reallocation approach to dynamic feasibility is also worth noting.
          Encoding feasibility as a penalty term competing with smoothness and collision terms
          creates poorly conditioned optimization landscapes. Separating it into a deterministic
          post-processing step keeps the optimizer working on a cleaner problem and makes
          feasibility a hard guarantee rather than a soft preference.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: EGO-Planner | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of EGO-Planner: ESDF-free gradient-based trajectory optimization using B-spline representation, guiding-path collision gradients, and time reallocation for dynamic feasibility.",
    },
  ],
};
