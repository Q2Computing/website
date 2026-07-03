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
        <h1>DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras</h1>
        <p class={styles.meta}>
          Teed, Z. &amp; Deng, J.
          &nbsp;·&nbsp; NeurIPS (2021) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2108.10869" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Classical visual SLAM systems (ORB-SLAM, DSO) are brittle in textureless
          environments and under rapid motion because they rely on handcrafted feature
          detection and matching. Deep learning-based alternatives exist but typically
          handle only monocular cameras and accumulate drift without loop closure.
          DROID-SLAM provides a learned SLAM system that operates across monocular,
          stereo, and RGB-D camera configurations, achieves state-of-the-art accuracy
          with real-time performance, and supports loop closure and global bundle adjustment.
        </p>
        <p>
          The key innovation is differentiable dense bundle adjustment (DBA): rather
          than optimizing over sparse keypoints, DROID-SLAM jointly optimizes camera
          poses and per-pixel depth using a recurrent neural network that iteratively
          refines the update direction within a Gauss-Newton framework.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Differentiable Bundle Adjustment layer</h3>
        <p>
          DROID-SLAM maintains a factor graph over keyframes. Each edge{" "}
          <Math tex="(i, j)" /> in the graph represents a visual overlap between frames
          <Math tex="i" /> and <Math tex="j" />. The reprojection of frame <Math tex="i" />
          pixels into frame <Math tex="j" /> is:
        </p>
        <Math display tex="p_{ij} = \Pi_c\!\left(G_{ij} \cdot \Pi_c^{-1}(p_i, d_i)\right)" />
        <p>
          where <Math tex="\Pi_c" /> is the camera projection, <Math tex="G_{ij} \in SE(3)" />
          is the relative pose from frame <Math tex="i" /> to <Math tex="j" />, and{" "}
          <Math tex="d_i" /> is per-pixel inverse depth. The flow residual is:
        </p>
        <Math display tex="r_{ij}(p_i) = p_{ij} - \hat{p}_{ij}" />
        <p>
          where <Math tex="\hat{p}_{ij}" /> is the estimated flow from a correlation volume.
          The Gauss-Newton update minimizes the total reprojection error:
        </p>
        <Math display tex="\min_{G, d} \sum_{(i,j) \in \mathcal{E}} \sum_{p_i} w_{ij}(p_i) \left\| r_{ij}(p_i) \right\|^2" />
        <p>
          where <Math tex="w_{ij}(p_i) \in [0, 1]" /> is a per-pixel confidence weight
          predicted by the network. This weight allows the network to down-weight
          occluded or ambiguous correspondences.
        </p>

        <h3>Recurrent update operator</h3>
        <p>
          The update direction within the Gauss-Newton step is predicted by a recurrent
          network (ConvGRU) that processes the correlation volume between frame pairs.
          At iteration <Math tex="k" />, the network predicts a flow update{" "}
          <Math tex="\Delta_{ij}^{(k)}" /> and confidence <Math tex="w_{ij}^{(k)}" />:
        </p>
        <Math display tex="\left(\Delta_{ij}^{(k)}, w_{ij}^{(k)}\right) = f_\theta\!\left(\text{corr}(F_i, F_j, \hat{p}_{ij}^{(k)}),\; h^{(k-1)}\right)" />
        <p>
          The correlation volume <Math tex="\text{corr}(F_i, F_j, p)" /> samples the
          feature similarity between frame <Math tex="i" /> at position <Math tex="p" />
          and frame <Math tex="j" /> at a neighborhood of candidate positions. The
          hidden state <Math tex="h" /> accumulates information across iterations,
          implementing a learned preconditioner for the bundle adjustment.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>EuRoC:</strong> DROID-SLAM achieves 0.021 m ATE (monocular) and
            0.011 m ATE (stereo), outperforming ORB-SLAM3, DSO, and VINS-Mono on
            the majority of sequences
          </li>
          <li>
            <strong>TUM-RGBD:</strong> State-of-the-art performance across RGB-D sequences
            including texture-poor environments where classical SLAM systems lose tracking
          </li>
          <li>
            <strong>TartanAir:</strong> Best performance across the TartanAir challenge
            sequences, including degraded conditions where feature-based systems fail
          </li>
          <li>
            <strong>Runtime:</strong> Real-time on an NVIDIA RTX 2080 GPU; not yet
            feasible on embedded compute without model compression
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          DROID-SLAM represents the mature baseline for learned visual localization.
          It demonstrates that deep learning can close the accuracy gap with classical
          bundle adjustment while extending robustness to conditions where classical
          systems fail. The DBA layer is the correct abstraction: it retains the
          geometric structure of bundle adjustment (reprojection residuals, Gauss-Newton
          updates) while replacing the handcrafted components (feature matching, outlier
          rejection) with learned counterparts.
        </p>
        <p>
          The GPU compute requirement is the binding constraint for embedded deployment.
          DROID-SLAM at full accuracy requires a discrete GPU; the Jetson AGX Xavier
          (used in AlphaPilot) is at the edge of feasibility. This compute cost is
          what motivates sensor-minimal navigation approaches that bypass full visual
          SLAM entirely.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: DROID-SLAM | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of DROID-SLAM: differentiable dense bundle adjustment, recurrent update operator over correlation volumes, and learned visual SLAM across monocular, stereo, and RGB-D cameras.",
    },
  ],
};
