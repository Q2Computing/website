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
        <h1>VINS-Mono: A Robust and Versatile Monocular Visual-Inertial State Estimator</h1>
        <p class={styles.meta}>
          Qin, T., Li, P. &amp; Shen, S.
          &nbsp;·&nbsp; IEEE Trans. Robot. 34, 1004-1020 (2018) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/1708.03852" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          GPS-denied localization for mobile platforms requires fusing camera and IMU data
          without accumulated drift. VINS-Mono provides a complete, tightly-coupled
          monocular visual-inertial odometry pipeline: IMU preintegration for fast
          prediction, feature-based visual updates, sliding window bundle adjustment for
          local consistency, and optional loop closure for global drift correction. It
          is the most widely deployed open-source VIO baseline in the robotics field and
          is used directly as the feature frontend in Deep Drone Acrobatics (#12).
        </p>

        <h2>Key mathematical framework</h2>

        <h3>IMU preintegration</h3>
        <p>
          Rather than integrating raw IMU measurements at every camera frame and
          re-integrating when IMU biases change, VINS-Mono preintegrates IMU measurements
          in the body frame between consecutive keyframes <Math tex="b_k" /> and{" "}
          <Math tex="b_{k+1}" />. The preintegrated terms are relative translation,
          velocity change, and rotation:
        </p>
        <Math display tex="\alpha_{b_{k+1}}^{b_k} = \iint_{t \in [t_k, t_{k+1}]} R_t\left(\hat{a}_t - b_a - n_a\right) dt^2" />
        <Math display tex="\beta_{b_{k+1}}^{b_k} = \int_{t \in [t_k, t_{k+1}]} R_t\left(\hat{a}_t - b_a - n_a\right) dt" />
        <Math display tex="\gamma_{b_{k+1}}^{b_k} = \int_{t \in [t_k, t_{k+1}]} \frac{1}{2}\,\Omega\!\left(\hat{\omega}_t - b_g - n_g\right)\gamma_t^{b_k}\, dt" />
        <p>
          where <Math tex="\hat{a}_t" /> and <Math tex="\hat{\omega}_t" /> are raw
          accelerometer and gyroscope measurements, <Math tex="b_a, b_g" /> are slowly
          varying biases, and <Math tex="n_a, n_g" /> are white noise terms. These
          preintegrated quantities can be updated cheaply when bias estimates change
          without re-integration.
        </p>

        <h3>IMU measurement residual</h3>
        <p>
          Given state estimates at keyframes <Math tex="b_k" /> and{" "}
          <Math tex="b_{k+1}" />, the IMU residual vector measures discrepancy between
          predicted and preintegrated motion:
        </p>
        <Math display tex="r_{\mathcal{B}}(z_{b_{k+1}}^{b_k}, \mathcal{X}) = \begin{bmatrix} R_{b_k}^w{}^\top (p_{b_{k+1}}^w - p_{b_k}^w - v_{b_k}^w \Delta t + \frac{1}{2}g^w \Delta t^2) - \alpha_{b_{k+1}}^{b_k} \\ R_{b_k}^w{}^\top (v_{b_{k+1}}^w - v_{b_k}^w + g^w \Delta t) - \beta_{b_{k+1}}^{b_k} \\ 2\left[\gamma_{b_{k+1}}^{b_k}{}^{-1} \otimes R_{b_k}^w{}^\top R_{b_{k+1}}^w\right]_{xyz} \\ \delta b_a \\ \delta b_g \end{bmatrix}" />

        <h3>Visual measurement residual</h3>
        <p>
          For a landmark <Math tex="l" /> observed from camera frame{" "}
          <Math tex="c_j" />, the visual residual is the reprojection error in
          normalized image coordinates:
        </p>
        <Math display tex="r_{\mathcal{C}}(z_l^{c_j}, \mathcal{X}) = z_l^{c_j} - \pi\!\left(R_c^b{}^\top R_{b_j}^w{}^\top\!\left(p_l^w - p_{b_j}^w\right) - R_c^b{}^\top p_c^b\right)" />
        <p>
          where <Math tex="\pi(\cdot)" /> is the normalized projection function and
          <Math tex="R_c^b, p_c^b" /> are the camera-IMU extrinsic calibration.
        </p>

        <h3>Sliding window bundle adjustment</h3>
        <p>
          VINS-Mono maintains a sliding window of the most recent keyframes and optimizes
          the full state vector <Math tex="\mathcal{X}" /> by minimizing the sum of
          IMU and visual residuals weighted by their respective covariances:
        </p>
        <Math display tex="\min_{\mathcal{X}} \left\{ \|r_p - H_p \mathcal{X}\|^2 + \sum_{k \in \mathcal{B}} \left\| r_{\mathcal{B}}(z_{b_{k+1}}^{b_k}, \mathcal{X}) \right\|_{P_{b_{k+1}}^{b_k}}^2 + \sum_{(l,j) \in \mathcal{C}} \left\| r_{\mathcal{C}}(z_l^{c_j}, \mathcal{X}) \right\|_{P_l^{c_j}}^2 \right\}" />
        <p>
          The term <Math tex="\|r_p - H_p \mathcal{X}\|^2" /> is the prior from
          marginalized states, maintained via the Schur complement to keep the window
          size bounded. This is the tightly-coupled formulation: IMU and visual
          measurements are jointly optimized rather than fused sequentially.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>EuRoC benchmark:</strong> VINS-Mono achieves centimeter-level
            position accuracy on all EuRoC MAV sequences, competitive with or
            exceeding stereo and RGB-D systems using only a monocular camera and IMU
          </li>
          <li>
            <strong>Initialization:</strong> Fully automatic. Estimates camera-IMU
            extrinsics and IMU biases online without pre-calibration
          </li>
          <li>
            <strong>Loop closure:</strong> DBoW2-based place recognition with pose
            graph optimization eliminates long-term drift in environments with revisited
            regions
          </li>
          <li>
            <strong>Deployment:</strong> Real-time on an Intel NUC CPU. Used as the
            feature frontend in Deep Drone Acrobatics and as the localization baseline
            in EGO-Planner and EGO-Swarm
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          VINS-Mono is the standard against which camera-dependent localization is
          measured. Its preintegration formulation is the correct way to handle
          asynchronous IMU and camera data in a sliding window estimator: IMU provides
          high-frequency prediction, camera provides low-frequency but drift-free
          correction, and the preintegrated terms allow both to be jointly optimized
          in a single nonlinear least-squares problem.
        </p>
        <p>
          The sensor fusion architecture here is the transferable result. Camera input
          improves accuracy and precision over inertial sensing alone, and this benefit
          holds even at low resolution when the visual task is terrain conformation
          evaluation rather than high-fidelity feature tracking. Low-resolution frames
          are computationally cheap to process, which makes them compatible with
          edge-constrained deployments where full VIO pipelines are too expensive.
          The camera does not need to run a SLAM pipeline to be useful: it only needs
          to produce observations that correlate with the terrain prior.
        </p>
        <p>
          VINS-Mono's deployment in Deep Drone Acrobatics as a feature track frontend
          rather than a full localization system illustrates this principle. Harris corner
          detection and Lucas-Kanade tracking are computationally simple relative to
          bundle adjustment, yet they provide enough scene-geometry information to
          satisfy the abstraction lemma's condition for minimizing the sim-to-real gap.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: VINS-Mono | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of VINS-Mono: IMU preintegration, tightly-coupled visual-inertial bundle adjustment, sliding window optimization, and its role as the GPS-denied localization baseline in the field.",
    },
  ],
};
