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
        <h1>A Machine Learning Approach to Visual Perception of Forest Trails for Mobile Robots</h1>
        <p class={styles.meta}>
          Giusti, A. et al.
          &nbsp;·&nbsp; IEEE Robot. Autom. Lett. 1, 661-667 (2015) &nbsp;·&nbsp;
          <a href="https://ieeexplore.ieee.org/document/7358076" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Navigation along unstructured forest trails has no pre-labeled map, no GPS, and
          no feature-rich structured environment. The appearance of the trail changes with
          lighting, season, and viewpoint, making template matching and handcrafted feature
          detectors unreliable. This paper trains a convolutional network to classify the
          heading direction required to stay on a forest trail using only a monocular camera.
        </p>
        <p>
          The contribution is not performance but principle: it is an early demonstration
          that a learned visual navigation policy can operate in unstructured natural
          environments without any pre-labeled map of the environment. The network does
          not detect trail edges or segments. It directly classifies heading direction
          from appearance, bypassing the explicit map construction step.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Heading classification</h3>
        <p>
          The navigation problem is framed as a three-class classification: turn left,
          go straight, or turn right. Given image <Math tex="I_t" /> at timestep{" "}
          <Math tex="t" />, the network computes:
        </p>
        <Math display tex="\hat{y}_t = \arg\max_{y \in \{L, S, R\}} f_\theta(I_t)_y" />
        <p>
          where <Math tex="f_\theta(I_t) \in \mathbb{R}^3" /> is the softmax output
          vector. The network is a deep CNN with GoogLeNet architecture pretrained on
          ImageNet and fine-tuned on trail images.
        </p>

        <h3>Training data collection</h3>
        <p>
          Training data is collected by humans hiking the trail with three cameras:
          center-mounted (labeled "straight"), left-mounted (labeled "right", the
          correction needed to re-center), and right-mounted (labeled "left"). This
          three-camera setup generates labeled training data from a single forward
          pass through the environment without any manual annotation:
        </p>
        <Math display tex="\mathcal{D} = \{(I_t^C, S), (I_t^L, R), (I_t^R, L)\}_{t=1}^{T}" />
        <p>
          The camera geometry encodes the correction direction implicitly: seeing the
          trail from the left perspective means the robot needs to turn right to
          re-center.
        </p>

        <h3>Deployment and smoothing</h3>
        <p>
          At deployment, the robot executes the heading command predicted by the
          network at each frame. A simple temporal smoothing filter reduces oscillation:
        </p>
        <Math display tex="\bar{y}_t = \text{mode}\!\left(\hat{y}_{t-W+1}, \ldots, \hat{y}_t\right)" />
        <p>
          over a sliding window of length <Math tex="W" />. No state estimation, no
          map, no prior knowledge of the trail geometry is required at deployment.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Classification accuracy:</strong> 85% heading classification accuracy
            on held-out trail images across varied lighting and terrain
          </li>
          <li>
            <strong>Robot navigation:</strong> Successful autonomous trail following on
            a wheeled robot across multiple environments and seasons not seen during training
          </li>
          <li>
            <strong>Data collection:</strong> 17,000 training images from a single
            five-hour hike using the three-camera setup, no manual annotation required
          </li>
          <li>
            <strong>Generalization:</strong> Training on trails in one region and testing
            in a visually different region maintained above-chance heading prediction
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The key result is the data collection methodology, not the classifier. By placing
          cameras at three lateral offsets and assigning labels based on geometry rather
          than human annotation, the paper generates a labeled navigation dataset from
          unlabeled human hiking data. This is an early instance of the principle that
          the label structure can be embedded in the data collection design rather than
          applied in post-processing.
        </p>
        <p>
          The label-blind navigation principle is architecturally important. The network
          does not know what a trail is, what trees are, or what any visual feature means.
          It learns the statistical association between visual appearance and the correct
          heading direction from examples alone. This is directly analogous to any
          navigation system that uses environmental statistics rather than semantic
          understanding to maintain positional confidence.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Forest Trails Visual Navigation | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of visual forest trail navigation: three-camera heading classification, GoogLeNet fine-tuning, and label-blind navigation policy learning without pre-labeled maps.",
    },
  ],
};
