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
        <h1>Learned Inertial Odometry for Autonomous Drone Racing</h1>
        <p class={styles.meta}>
          Cioffi, G., Bauersfeld, L., Kaufmann, E. &amp; Scaramuzza, D.
          &nbsp;·&nbsp; IEEE Robot. Autom. Lett. 8, 2684-2691 (2023) &nbsp;·&nbsp;
          <a href="https://ieeexplore.ieee.org/document/10015592" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Visual-inertial odometry fails during aggressive drone flight: motion blur and
          rapid rotation cause visual feature tracking to break down. IMU-only dead reckoning
          accumulates drift rapidly from integrated accelerometer and gyroscope bias. This paper
          trains a neural network to perform inertial odometry by predicting velocity from raw
          IMU measurements, bypassing camera input entirely.
        </p>
        <p>
          The result is a localization system that works under the exact conditions where
          visual methods fail: aggressive maneuvers, motion blur, textureless walls, and
          rapid lighting changes. It provides a GPS-denied odometry baseline using only
          the IMU that every platform already carries.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>IMU kinematics and the drift problem</h3>
        <p>
          Raw IMU integration for position estimate accumulates errors quadratically in time.
          Given accelerometer measurement <Math tex="\tilde{a} = a + b_a + n_a" /> (true
          acceleration plus bias plus noise) and gyroscope measurement{" "}
          <Math tex="\tilde{\omega} = \omega + b_g + n_g" />, dead reckoning computes:
        </p>
        <Math display tex="v_{k+1} = v_k + \left(R_k(\tilde{a}_k - b_a) + g\right)\Delta t" />
        <Math display tex="p_{k+1} = p_k + v_k \Delta t + \frac{1}{2}\left(R_k(\tilde{a}_k - b_a) + g\right)\Delta t^2" />
        <p>
          Bias <Math tex="b_a" /> is unknown and time-varying. Any error in the bias
          estimate grows as <Math tex="O(t^2)" /> in position, making raw IMU integration
          unusable beyond a few seconds.
        </p>

        <h3>Learned velocity prediction</h3>
        <p>
          Rather than integrating acceleration directly, the network predicts body-frame
          velocity from a window of recent IMU measurements. Let{" "}
          <Math tex="\mathcal{I}_k = \{(\tilde{a}_t, \tilde{\omega}_t)\}_{t=k-W}^{k}" />
          be the IMU window of length <Math tex="W" />. The network maps this to a
          velocity estimate:
        </p>
        <Math display tex="\hat{v}_k^B = f_\theta(\mathcal{I}_k)" />
        <p>
          Velocity prediction is less sensitive to bias than acceleration integration
          because the network can implicitly learn the mean bias from training data.
          Position is recovered by integrating the predicted velocity:
        </p>
        <Math display tex="\hat{p}_{k+1} = \hat{p}_k + R_k \hat{v}_k^B \Delta t" />
        <p>
          Attitude <Math tex="R_k" /> is provided by gyroscope integration with online
          bias estimation, which is accurate over short time windows.
        </p>

        <h3>Training loss</h3>
        <p>
          The network is trained to minimize velocity prediction error on a dataset
          of aggressive flight trajectories with ground-truth from a motion capture
          system:
        </p>
        <Math display tex="\mathcal{L} = \frac{1}{T} \sum_{k=1}^{T} \left\| \hat{v}_k^B - v_k^{B,*} \right\|^2" />
        <p>
          where <Math tex="v_k^{B,*}" /> is the ground-truth body-frame velocity
          from motion capture. The network architecture is a temporal convolutional
          network that captures the IMU dynamics relevant for velocity estimation
          across the window length.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Accuracy:</strong> 0.1 m/s velocity RMSE on aggressive flight
            trajectories where VIO fails, achieving 10x lower drift than raw IMU integration
          </li>
          <li>
            <strong>Robustness:</strong> Maintains odometry through maneuvers that cause
            motion blur and VIO tracking failure, including Power Loop and Barrel Roll
          </li>
          <li>
            <strong>Sensor requirement:</strong> IMU only. No camera, no lidar, no GPS.
            The system operates on the sensor already embedded in every flight controller
          </li>
          <li>
            <strong>Latency:</strong> Real-time on an NVIDIA Jetson AGX Xavier at the
            IMU integration rate (200-400 Hz)
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          Learned inertial odometry demonstrates that the IMU (the one sensor present
          in every autonomous platform regardless of cost) contains enough information
          for useful velocity estimation when processed by a learned model rather than
          integrated analytically. This is a sensor-minimal result: no camera, no map,
          no external reference.
        </p>
        <p>
          The dead-reckoning limitation remains: velocity integration still accumulates
          position error over long timescales. But for short-horizon tasks where the
          system periodically receives absolute position corrections (from gate detection,
          anomaly observation, or any other localization event), inertial odometry provides
          a reliable high-frequency bridge between corrections. The learned model is what
          makes that bridge accurate enough to be useful at agile flight speeds.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Learned Inertial Odometry | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of learned inertial odometry: IMU-only velocity prediction via temporal convolutional networks, bypassing camera input for GPS-denied localization during aggressive drone maneuvers.",
    },
  ],
};
