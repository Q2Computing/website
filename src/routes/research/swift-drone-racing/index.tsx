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
        <h1>Champion-Level Drone Racing Using Deep Reinforcement Learning</h1>
        <p class={styles.meta}>
          Kaufmann, E., Bauersfeld, L., Loquercio, A., Müller, M., Koltun, V. &amp; Scaramuzza, D.
          &nbsp;·&nbsp; Nature 620, 982-987 (2023) &nbsp;·&nbsp; Received 5 January 2023
          &nbsp;·&nbsp;
          <a href="https://www.nature.com/articles/s41586-023-06419-4" target="_blank" rel="noopener noreferrer">Paper (Open Access)</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to autonomous navigation and the boundaries it explicitly does not cross.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Swift is an autonomous drone racing system that defeated three human world champions
          in head-to-head physical competition. It combines deep reinforcement learning trained
          in simulation with empirical residual models estimated from real-world flight data,
          enabling sim-to-real transfer without manual tuning. Swift won 15 of 25 head-to-head
          races and recorded the fastest lap time of the event.
        </p>
        <p>
          This is a genuine milestone: no autonomous mobile robot had previously achieved
          world-champion-level performance in a physical competitive sport using only onboard
          sensors. The result validates that model-free deep RL can learn physical control
          policies that generalize from simulation to reality at the edge of vehicle dynamics.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Quadrotor dynamics</h3>
        <p>
          The simulation models full rigid-body quadrotor dynamics. Position, attitude quaternion,
          inertial velocity, and body rates evolve as:
        </p>
        <Math display tex="\dot{p} = v, \quad \dot{q} = q \otimes \begin{bmatrix} 0 \\ \omega/2 \end{bmatrix}, \quad \dot{v} = \frac{1}{m}\left(q(f_\text{prop} + f_\text{aero} + f_\text{res})\right) + g" />
        <Math display tex="\dot{\omega} = J^{-1}(\tau_\text{prop} + \tau_\text{mot} + \tau_\text{aero} + \tau_\text{iner})" />
        <p>
          Propeller forces and drag torques follow a quadratic model in motor speed{" "}
          <Math tex="\Omega_i" />:
        </p>
        <Math display tex="f(\Omega_i) = \begin{bmatrix}0 \\ 0 \\ c_l \cdot \Omega_i^2\end{bmatrix}, \quad \tau(\Omega_i) = \begin{bmatrix}0 \\ 0 \\ c_d \cdot \Omega_i^2\end{bmatrix}" />
        <p>
          Aerodynamic forces are modelled as a grey-box polynomial in body-frame velocity
          components and average squared motor speed, with coefficients identified from
          real-world flight data. This is the mechanism that allows the simulator to match
          physical behavior without a first-principles aerodynamic model.
        </p>

        <h3>PPO training and reward formulation</h3>
        <p>
          The control policy is a two-layer MLP (2 × 128, LeakyReLU) trained using
          Proximal Policy Optimization across 100 parallel simulation agents.
          The reward at each timestep combines four terms:
        </p>
        <Math display tex="r_t = r_t^\text{prog} + r_t^\text{perc} + r_t^\text{cmd} - r_t^\text{crash}" />
        <p>where:</p>
        <Math display tex="r_t^\text{prog} = \lambda_1 [d_{t-1}^\text{Gate} - d_t^\text{Gate}]" />
        <Math display tex="r_t^\text{perc} = \lambda_2 \exp[\lambda_3 \cdot \delta_\text{cam}^4]" />
        <Math display tex="r_t^\text{cmd} = \lambda_4 \|a_t\| + \lambda_5 \|a_t - a_{t-1}\|^2" />
        <p>
          The perception reward <Math tex="r^\text{perc}" /> explicitly incentivizes keeping
          the next gate in the camera's field of view, because gate visibility is what
          enables pose estimation. This design constraint is load-bearing: the entire
          localization architecture depends on visual contact with known landmarks.
        </p>

        <h3>Kalman filter for VIO drift correction</h3>
        <p>
          Visual-inertial odometry accumulates drift at high speed. Gate detections provide
          periodic absolute pose corrections. A Kalman filter estimates translational drift{" "}
          <Math tex="p_d" /> and drift velocity <Math tex="v_d" />:
        </p>
        <Math display tex="x_{k+1} = F x_k, \quad P_{k+1} = F P_k F^\top + Q" />
        <Math display tex="K_k = P_k^- H^\top (H P_k^- H^\top + R)^{-1}" />
        <Math display tex="x_k^+ = x_k^- + K_k(z_k - H x_k^-), \quad P_k^+ = (I - K_k H) P_k^-" />
        <p>
          The measurement <Math tex="z_k" /> is the pose estimate from gate detection via
          camera resectioning (IPPE). Measurement covariance <Math tex="R" /> is estimated
          by sampling 20 perturbed gate-corner detections and propagating them through IPPE.
          Without gate detections (without known landmarks), this correction loop has no input.
        </p>

        <h3>Residual model identification</h3>
        <p>
          Sim-to-real transfer requires only approximately 50 seconds of real-world flight data.
          Perception residuals (stochastic drift in VIO estimates) are modelled with Gaussian processes:
        </p>
        <Math display tex="\kappa(z_i, z_j) = \sigma_f^2 \exp\!\left(-\frac{1}{2}(z_i - z_j)^\top L^{-2} (z_i - z_j)\right) + \sigma_n^2" />
        <p>
          Dynamics residuals (deterministic acceleration errors) are modelled with k-nearest
          neighbour regression (<Math tex="k=5" />) as a function of platform state and commanded thrust:
        </p>
        <Math display tex="a_\text{res} = \text{KNN}(s, c)" />
        <p>
          The key insight is that only a small dataset is needed because the residuals are
          environment- and track-specific: the model fits the specific failure modes observed
          on this particular track with this particular hardware. This specificity is a
          capability and a constraint simultaneously.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Head-to-head record:</strong> Swift won 15 of 25 races against three
            human world champions (60% win rate overall)
          </li>
          <li>
            <strong>Fastest lap:</strong> Swift median single-lap time 5.52 s versus
            best human median of 5.76 s (Bitmatta). Fastest recorded race time 17.465 s
            versus best human 17.956 s (Vanover)
          </li>
          <li>
            <strong>Reaction time advantage:</strong> Swift departed the podium on average
            120 ms before human pilots
          </li>
          <li>
            <strong>Sensorimotor latency:</strong> 40 ms for Swift versus approximately
            220 ms for expert human pilots
          </li>
          <li>
            <strong>Hardware:</strong> NVIDIA Jetson TX2 (6-core CPU at 2 GHz, 256 CUDA
            cores). Gate detection inference: 40 ms on GPU. Racing policy inference: 8 ms on CPU
          </li>
          <li>
            <strong>Training time:</strong> 10⁸ environment interactions, 50 minutes on
            i9-12900K + RTX 3090
          </li>
          <li>
            <strong>Domain shift robustness:</strong> All baseline approaches (zero-shot,
            domain randomization, time-optimal MPC) failed to complete a single lap when
            deployed with realistic perception noise. Swift succeeded in all four test settings
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The residual model identification approach is the transferable result. Any system
          that trains in simulation and deploys on physical hardware faces the sim-to-real gap.
          Swift demonstrates that this gap can be closed with as little as 50 seconds of
          real-world data, provided the residuals are modelled separately for perception and
          dynamics. The Gaussian process approach handles stochastic perception errors;
          k-NN handles deterministic dynamics errors. Keeping them separate and fitting
          each to its statistical character is what makes the small dataset sufficient.
        </p>
        <p>
          The Jetson TX2 deployment confirms that PPO-trained policies with this level of
          capability can run on embedded hardware at the compute class Q2 targets.
          Gate detection in 40 ms and policy inference in 8 ms leave substantial headroom
          for additional onboard processing.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Champion-Level Drone Racing (Swift) | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of Swift: what champion-level drone racing using deep RL solves, covering PPO training, Kalman-filter VIO correction, and residual model identification on embedded hardware.",
    },
  ],
};
