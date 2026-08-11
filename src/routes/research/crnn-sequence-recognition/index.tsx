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
        <h1>An End-to-End Trainable Neural Network for Image-Based Sequence Recognition</h1>
        <p class={styles.meta}>
          Shi, B., Bai, X. &amp; Yao, C.
          &nbsp;·&nbsp; IEEE Trans. Pattern Anal. Mach. Intell. 39, 2298-2304 (2016) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/1507.05717" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Optical character recognition and scene text reading require mapping a sequence
          of visual features to a sequence of labels of unknown length. Prior systems
          segmented the input image into individual characters before recognition, requiring
          precise segmentation as a preprocessing step. This paper introduces the
          Convolutional Recurrent Neural Network (CRNN): a fully convolutional feature
          extractor feeding into a bidirectional LSTM decoder trained with Connectionist
          Temporal Classification (CTC) loss, enabling end-to-end training without any
          segmentation step.
        </p>
        <p>
          The architectural contribution is the combination of spatial feature extraction
          with temporal sequence modeling in a single differentiable pipeline. The same
          architecture generalizes to any problem where the input has spatial structure
          and the output is a variable-length sequence.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Feature sequence extraction</h3>
        <p>
          Given input image <Math tex="I \in \mathbb{R}^{H \times W \times C}" />, a
          convolutional feature extractor produces a feature map{" "}
          <Math tex="F \in \mathbb{R}^{H' \times W' \times D}" />. Vertical slices
          of this map (columns) form the feature sequence:
        </p>
        <Math display tex="x_t = F[:, t, :] \in \mathbb{R}^{H' \times D}, \quad t = 1, \ldots, W'" />
        <p>
          Each <Math tex="x_t" /> captures the visual features at horizontal position
          <Math tex="t" /> across the full height of the feature map. The sequence
          length <Math tex="W'" /> depends on the input width through the convolutional
          downsampling factor.
        </p>

        <h3>Bidirectional LSTM</h3>
        <p>
          The feature sequence is processed by a two-layer bidirectional LSTM. At each
          timestep <Math tex="t" />, the forward and backward hidden states are:
        </p>
        <Math display tex="\overrightarrow{h}_t = \text{LSTM}(x_t, \overrightarrow{h}_{t-1})" />
        <Math display tex="\overleftarrow{h}_t = \text{LSTM}(x_t, \overleftarrow{h}_{t+1})" />
        <p>
          The concatenated state <Math tex="h_t = [\overrightarrow{h}_t;\, \overleftarrow{h}_t]" />
          is projected to a per-class score over the label vocabulary at each position:
        </p>
        <Math display tex="y_t = W h_t + b \in \mathbb{R}^{|\mathcal{V}|+1}" />
        <p>
          where <Math tex="|\mathcal{V}|+1" /> includes a blank token for CTC.
        </p>

        <h3>Connectionist Temporal Classification loss</h3>
        <p>
          The label sequence <Math tex="\mathbf{l} = (l_1, \ldots, l_S)" /> is shorter
          than the output sequence <Math tex="T = W'" />. CTC defines a set of paths
          <Math tex="\mathcal{B}^{-1}(\mathbf{l})" /> (output sequences that collapse
          to <Math tex="\mathbf{l}" /> by merging repeated labels and removing blanks)
          and trains to maximize:
        </p>
        <Math display tex="\log p(\mathbf{l} \mid \mathbf{x}) = \log \sum_{\pi \in \mathcal{B}^{-1}(\mathbf{l})} \prod_{t=1}^{T} p(\pi_t \mid \mathbf{x})" />
        <p>
          This sum over paths is computed efficiently with a forward-backward dynamic
          programming algorithm, making the loss differentiable with respect to the
          per-timestep output scores. The result is that neither the alignment between
          input positions and output labels, nor the segmentation boundaries, need to
          be specified during training.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Scene text:</strong> State-of-the-art accuracy on IIIT5K, SVT, and
            ICDAR benchmarks at the time of publication, without scene-specific fine-tuning
          </li>
          <li>
            <strong>End-to-end training:</strong> No segmentation preprocessing required.
            A single backward pass through the CTC loss trains the full convolutional
            plus recurrent pipeline
          </li>
          <li>
            <strong>Speed:</strong> Real-time on a GPU, with the convolutional backbone
            shared between position encoding and sequence features
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The CRNN architecture establishes the template for any system that must map
          a spatially structured input to a variable-length output sequence without
          prior knowledge of the alignment between input regions and output elements.
          CTC loss is the correct objective when the alignment is unknown and should
          be inferred from data.
        </p>
        <p>
          For sequential anomaly observation models, the key transfer is the bidirectional
          LSTM component. A system that processes a temporal sequence of observations
          to produce a state label (confidence class, heading decision, localization
          region) faces the same alignment ambiguity: which observations correspond to
          which state transitions. The bidirectional LSTM's ability to capture context
          from both past and future frames in a sequence makes it the correct architecture
          for this class of problem.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: CRNN Sequence Recognition | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of CRNN: convolutional feature extraction, bidirectional LSTM, and Connectionist Temporal Classification loss for end-to-end sequence recognition without segmentation.",
    },
  ],
};
