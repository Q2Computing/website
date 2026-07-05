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
        <h1>AlphaPilot: Autonomous Drone Racing</h1>
        <p class={styles.meta}>
          Foehn, P. et al.
          &nbsp;·&nbsp; arXiv:2005.12813 (2020) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2005.12813" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          AlphaPilot was the DARPA-backed autonomous drone racing challenge, the first open
          autonomous drone racing competition at professional scale. The system presented here
          competed at speeds exceeding 8 m/s through gates with centimeter-level tolerances
          using only onboard sensing and compute. It documents the complete autonomous flight
          stack required to approach human-competitive performance on a standardized course,
          providing the American performance baseline against which subsequent systems are measured.
        </p>
        <p>
          The core problem is gate detection under motion blur and varying illumination at
          speeds where any latency in the perception-to-control loop results in a missed gate.
          AlphaPilot addresses this with a modular architecture: learned gate detection, analytic
          pose estimation, MPC-based trajectory optimization, and a model-based controller
          running at 200 Hz.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Gate detection and pose estimation</h3>
        <p>
          Gate corners are detected by a convolutional network trained to regress keypoint
          heatmaps in image space. Given detected corner pixels{" "}
          <Math tex="\{u_i, v_i\}_{i=1}^{4}" /> and known gate geometry, pose is recovered
          by solving a PnP problem: find rotation <Math tex="R \in SO(3)" /> and translation
          <Math tex="t \in \mathbb{R}^3" /> such that the reprojection error is minimized
          over all four corners:
        </p>
        <Math display tex="\min_{R, t} \sum_{i=1}^{4} \left\| \begin{bmatrix} u_i \\ v_i \end{bmatrix} - \pi\!\left(R\, p_i^G + t\right) \right\|^2" />
        <p>
          where <Math tex="p_i^G \in \mathbb{R}^3" /> are the known gate corner positions
          in gate frame and <Math tex="\pi" /> is the camera projection function.
        </p>

        <h3>Minimum-time trajectory generation</h3>
        <p>
          The trajectory between gates is planned as a minimum-time polynomial subject to
          dynamic feasibility constraints. Given waypoints{" "}
          <Math tex="\{w_k\}_{k=1}^{K}" /> (gate centers), the trajectory optimizer
          finds segment times <Math tex="\{T_k\}" /> and polynomial coefficients that
          minimize total flight time:
        </p>
        <Math display tex="\min_{\{T_k\}, \mathbf{c}} \sum_{k=1}^{K} T_k \quad \text{s.t.} \quad \|\mathbf{a}(t)\| \leq a_{\max},\;\; \|\boldsymbol{\omega}(t)\| \leq \omega_{\max}" />
        <p>
          Acceleration and angular rate bounds enforce dynamic feasibility on the physical
          platform. The polynomial order (typically 7th order for position trajectory) ensures
          continuity through the required derivative order.
        </p>

        <h3>Model Predictive Controller</h3>
        <p>
          A nonlinear MPC tracks the reference trajectory. The state vector includes
          position, velocity, quaternion attitude, and body rates. The MPC minimizes
          a quadratic cost over a receding horizon <Math tex="N" />:
        </p>
        <Math display tex="\min_{u_{0:N-1}} \sum_{k=0}^{N-1} \left( \|e_k\|_Q^2 + \|u_k\|_R^2 \right) + \|e_N\|_{Q_f}^2" />
        <p>
          where <Math tex="e_k = x_k - x_k^{\text{ref}}" /> is the tracking error and
          <Math tex="Q, R, Q_f" /> are positive semidefinite weight matrices. The 200 Hz
          control rate is achievable because the MPC uses an analytic Jacobian of the
          quadrotor dynamics rather than finite differences.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Competition performance:</strong> AlphaPilot placed second in the
            DARPA-backed Lockheed Martin AlphaPilot Challenge, completing the course
            autonomously at speeds exceeding 8 m/s
          </li>
          <li>
            <strong>Gate detection:</strong> CNN-based keypoint detection runs at 30 Hz
            on an NVIDIA Jetson AGX Xavier, with detection latency below 35 ms
          </li>
          <li>
            <strong>Control rate:</strong> 200 Hz model predictive controller with
            analytic Jacobians on the same onboard compute
          </li>
          <li>
            <strong>Robustness:</strong> System operates under motion blur and illumination
            variation across the full competition course without external reference
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          AlphaPilot establishes the American performance ceiling for GPS-denied autonomous
          flight at competitive speeds. The 8 m/s gate traversal benchmark contextualizes
          the capability ceiling against which navigation systems operating in the same regime
          must be measured.
        </p>
        <p>
          The system's modular architecture is instructive. Gate detection, pose estimation,
          trajectory planning, and tracking control are separate modules with clean interfaces.
          This modularity allows each component to be replaced or upgraded independently,
          which is the correct design pattern for research platforms where individual
          capabilities (detection accuracy, controller bandwidth) will improve at different rates.
        </p>
        <p>
          The 200 Hz MPC rate achieved on a Jetson AGX Xavier demonstrates that nonlinear
          model predictive control is feasible on embedded hardware when the Jacobians are
          computed analytically rather than numerically. This is a design constraint that
          propagates upward: the dynamics model used for MPC must be simple enough that
          its Jacobian is tractable in closed form.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: AlphaPilot | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of AlphaPilot: CNN keypoint detection, PnP pose estimation, minimum-time polynomial trajectory planning, and 200 Hz MPC for competitive autonomous drone racing.",
    },
  ],
};
