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
        <h1>TartanAir: A Dataset to Push the Limits of Visual SLAM</h1>
        <p class={styles.meta}>
          Wang, W. et al.
          &nbsp;·&nbsp; IROS (2020) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2003.14338" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Benchmarking visual SLAM and odometry systems requires diverse environments with
          accurate ground-truth trajectories. Existing datasets (EuRoC, KITTI, TUM) cover
          a narrow range of conditions and provide trajectories under controlled, well-lit,
          feature-rich settings. Systems trained and evaluated exclusively on these datasets
          fail to generalize to degraded conditions: rain, fog, darkness, featureless surfaces,
          and rapid lighting changes.
        </p>
        <p>
          TartanAir addresses this by generating large-scale, photorealistic simulation data
          across diverse environments and degradation conditions with precise ground-truth
          from the simulation engine itself. It provides the training and evaluation substrate
          that validates zero-shot generalization from simulation to physical deployment.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Photometric consistency and depth</h3>
        <p>
          TartanAir provides stereo RGB, depth maps, optical flow, and semantic segmentation
          from an Unreal Engine simulation. The depth map provides a direct measurement of
          scene geometry:
        </p>
        <Math display tex="Z(u, v) = \frac{f \cdot B}{\text{disparity}(u, v)}" />
        <p>
          where <Math tex="f" /> is focal length and <Math tex="B" /> is stereo baseline.
          Exact ground-truth depth eliminates the ambiguity present in real-world LiDAR
          scans (occlusion, specular reflection, sparse coverage) and provides a clean
          signal for training depth-based navigation networks.
        </p>

        <h3>Trajectory ground truth</h3>
        <p>
          Ground-truth trajectory is expressed as a sequence of rigid-body poses:
        </p>
        <Math display tex="\{T_k\}_{k=1}^{N} \subset SE(3), \quad T_k = \begin{bmatrix} R_k & t_k \\ 0 & 1 \end{bmatrix}" />
        <p>
          The simulation engine provides <Math tex="T_k" /> with numerical precision
          limited only by floating-point arithmetic, compared to real-world datasets where
          ground truth is provided by motion capture or RTK-GPS with millimeter-level
          noise. Trajectory evaluation computes absolute trajectory error (ATE):
        </p>
        <Math display tex="\text{ATE} = \sqrt{\frac{1}{N} \sum_{k=1}^{N} \left\| t_k - \hat{t}_k \right\|^2}" />
        <p>
          and relative pose error (RPE) over segments of length <Math tex="\Delta" />:
        </p>
        <Math display tex="\text{RPE}(\Delta) = \frac{1}{N - \Delta} \sum_{k=1}^{N-\Delta} \left\| \left(T_{k+\Delta}^{-1} T_k\right)^{-1} \left(\hat{T}_{k+\Delta}^{-1} \hat{T}_k\right) \right\|_F" />

        <h3>Domain diversity</h3>
        <p>
          TartanAir spans 16 environments across five categories: outdoor, urban, indoor,
          nature, and industrial. Each environment includes 22 degradation conditions
          combining lighting variation (day/night/dawn), weather (fog/rain/snow), and
          camera perturbations. For a learned system, the diversity ensures that the
          hypothesis space explored during training covers the modes likely to appear
          during physical deployment.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Scale:</strong> Over 1 million frames across 16 environments,
            22 degradation conditions, stereo RGB + depth + optical flow + semantic labels
          </li>
          <li>
            <strong>Baseline evaluation:</strong> Most tested visual SLAM systems
            (ORB-SLAM2, DSO, OpenVINS) fail in degraded conditions (fog, darkness,
            featureless surfaces) that TartanAir includes by design
          </li>
          <li>
            <strong>Challenge winner:</strong> The TartanAir SLAM challenge revealed
            that learned odometry systems generalize better across conditions than
            classical feature-based systems
          </li>
          <li>
            <strong>Ground truth precision:</strong> Sub-millimeter pose accuracy
            from simulation engine, unreachable by any real-world ground-truth system
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          TartanAir validates the simulation-first training paradigm by demonstrating that
          diverse simulated data transfers to real-world performance better than small
          real-world datasets. The key variable is diversity of conditions, not photorealism:
          a system trained on 22 degradation modes generalizes better than one trained on
          perfect synthetic imagery of a single environment type.
        </p>
        <p>
          For zero-shot sim-to-real transfer, the relevant property is that the distribution
          of training conditions covers the distribution of test conditions. TartanAir's
          design makes this tractable by providing ground-truth data under conditions
          (severe fog, total darkness, texture-free surfaces) that are nearly impossible to
          annotate in the real world. Systems trained and validated on TartanAir carry
          an implicit certificate that their performance envelope spans these modes.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: TartanAir | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of TartanAir: photorealistic simulation dataset spanning 16 environments and 22 degradation conditions with exact ground-truth for visual SLAM and odometry evaluation.",
    },
  ],
};
