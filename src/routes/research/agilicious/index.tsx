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
        <h1>Agilicious: Open-Source and Open-Hardware Agile Quadrotor for Vision-Based Flight</h1>
        <p class={styles.meta}>
          Foehn, P. et al.
          &nbsp;·&nbsp; Science Robotics 7, eabl6259 (2022) &nbsp;·&nbsp;
          <a href="https://www.science.org/doi/10.1126/scirobotics.abl6259" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Agile quadrotor research requires hardware and software that is both open,
          reproducible, and capable enough to reach the physical limits of the platform.
          Proprietary or one-off platforms prevent the community from building cumulative
          results on a shared baseline. Agilicious provides a fully open-source,
          open-hardware quadrotor platform designed specifically for vision-based agile
          flight research, with a software stack capable of 5g maneuvers and a 1 kHz
          control loop.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Quadrotor model and input parameterization</h3>
        <p>
          Agilicious uses a standard rigid-body quadrotor model. The state is{" "}
          <Math tex="x = (p, v, q, \omega) \in \mathbb{R}^3 \times \mathbb{R}^3 \times S^3 \times \mathbb{R}^3" />.
          The control input is collective thrust <Math tex="c \in \mathbb{R}" /> and
          body angular acceleration <Math tex="\dot{\omega}^B \in \mathbb{R}^3" />,
          mapped to individual motor thrusts <Math tex="\{f_i\}_{i=1}^{4}" /> by the
          allocation matrix:
        </p>
        <Math display tex="\begin{bmatrix} c \\ \tau_x \\ \tau_y \\ \tau_z \end{bmatrix} = \begin{bmatrix} 1 & 1 & 1 & 1 \\ -l & l & l & -l \\ l & -l & l & -l \\ -\kappa & -\kappa & \kappa & \kappa \end{bmatrix} \begin{bmatrix} f_1 \\ f_2 \\ f_3 \\ f_4 \end{bmatrix}" />
        <p>
          where <Math tex="l" /> is the arm length and <Math tex="\kappa" /> is the
          drag-to-thrust coefficient. Individual motor thrusts are then mapped to
          motor speed commands.
        </p>

        <h3>Nonlinear MPC formulation</h3>
        <p>
          The primary controller is a nonlinear MPC that minimizes tracking error
          subject to dynamic feasibility. At each timestep, it solves:
        </p>
        <Math display tex="\min_{u_{0:N}} \sum_{k=0}^{N} \ell(x_k, u_k, x_k^{\text{ref}}) \quad \text{s.t.} \quad x_{k+1} = f(x_k, u_k)" />
        <Math display tex="\ell(x, u, x^r) = \|p - p^r\|_{Q_p}^2 + \|v - v^r\|_{Q_v}^2 + \|q \ominus q^r\|_{Q_q}^2 + \|u\|_R^2" />
        <p>
          The rotation error <Math tex="q \ominus q^r" /> uses the quaternion log map
          to compute a rotation vector representing the angle between current and
          reference attitude. The solver runs at 50 Hz with a prediction horizon of
          0.5 s, while an inner loop runs at 1 kHz for attitude stabilization.
        </p>

        <h3>Geometric control fallback</h3>
        <p>
          For compatibility with learned controllers that output different command
          formats, Agilicious also implements a geometric controller on{" "}
          <Math tex="SO(3)" />. Given a desired thrust vector <Math tex="f_{\text{des}}" />
          and heading, it constructs the desired rotation matrix and computes:
        </p>
        <Math display tex="\tau = -k_R e_R - k_\omega e_\omega + \omega \times J\omega" />
        <p>
          where <Math tex="e_R = \frac{1}{2}(R_{\text{des}}^\top R - R^\top R_{\text{des}})^\vee" />
          is the rotation error on{" "}
          <Math tex="SO(3)" /> and <Math tex="J" /> is the inertia tensor.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Agility:</strong> Demonstrated 5g maneuvers including Power Loop
            and Barrel Roll on the physical platform
          </li>
          <li>
            <strong>Control rate:</strong> 1 kHz attitude loop, 50 Hz MPC outer loop,
            with latency below 2 ms for the inner loop
          </li>
          <li>
            <strong>Open hardware:</strong> Complete BOM, PCB files, and CAD released.
            Platform reproducible for under $1,000 in parts
          </li>
          <li>
            <strong>Software compatibility:</strong> Supports ROS, Python, C++, and
            direct controller interfaces for learned policy deployment
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          Agilicious defines the open-hardware reference architecture for agile
          quadrotor research. Its motor allocation matrix, MPC formulation, and
          geometric controller represent the engineering choices that the field has
          converged on for platforms targeting 3-5g maneuvers. The 1 kHz control
          rate sets the latency ceiling that sensing and perception systems must
          achieve to feed the controller without becoming the bottleneck.
        </p>
        <p>
          The open-source release is significant because it means the complete software
          stack used in AlphaPilot, Champion-Level Drone Racing, and Deep Drone
          Acrobatics can be reproduced, benchmarked, and extended on a known hardware
          baseline. For systems designed for edge compute, the Agilicious platform
          provides the physical deployment reference: any algorithm that runs on
          Agilicious's onboard compute (Jetson AGX Xavier) can be validated against
          a known performance envelope.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Agilicious | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of Agilicious: open-source agile quadrotor platform, motor allocation matrix, nonlinear MPC at 50 Hz with 1 kHz attitude loop, and geometric control on SO(3).",
    },
  ],
};
