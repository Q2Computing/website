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
        <h1>Learning Phrase Representations Using RNN Encoder-Decoder for Statistical Machine Translation</h1>
        <p class={styles.meta}>
          Cho, K., van Merrienboer, B., Gulcehre, C., Bahdanau, D., Bougares, F., Schwenk, H. &amp; Bengio, Y.
          &nbsp;·&nbsp; EMNLP (2014) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/1406.1078" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Recurrent neural networks at the time of this paper suffered from two related
          problems: the vanishing gradient that prevented learning long-range dependencies,
          and the lack of a principled architecture for sequence-to-sequence mapping where
          the input and output sequences are of different lengths. This paper introduces
          the RNN Encoder-Decoder framework and the Gated Recurrent Unit (GRU), both of
          which became foundational to the temporal modeling used across the robotics
          literature in this archive.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Encoder-Decoder architecture</h3>
        <p>
          The encoder reads an input sequence{" "}
          <Math tex="(x_1, x_2, \ldots, x_{T_x})" /> and produces a fixed-length
          context vector <Math tex="c" />. At each step the encoder updates its
          hidden state:
        </p>
        <Math display tex="h_t = f(h_{t-1},\, x_t)" />
        <p>
          The context vector summarizes the encoder hidden states:
        </p>
        <Math display tex="c = q(\{h_1, h_2, \ldots, h_{T_x}\})" />
        <p>
          A common choice is <Math tex="c = h_{T_x}" /> (last hidden state).
          The decoder generates the output sequence by modeling the conditional
          probability of each token given the context and all previous outputs:
        </p>
        <Math display tex="p(\mathbf{y}) = \prod_{t=1}^{T_y} p(y_t \mid \{y_1, \ldots, y_{t-1}\}, c)" />
        <p>
          The joint training objective is maximum likelihood:
        </p>
        <Math display tex="\max_\theta \sum_{n=1}^{N} \log p_\theta(\mathbf{y}_n \mid \mathbf{x}_n)" />

        <h3>Gated Recurrent Unit</h3>
        <p>
          The GRU replaces the standard tanh hidden unit with a gated mechanism that
          allows the network to selectively retain or discard information at each step.
          Given input <Math tex="x" /> and previous hidden state <Math tex="h" />:
        </p>
        <p>
          The update gate <Math tex="z" /> controls how much of the previous state
          to carry forward:
        </p>
        <Math display tex="z = \sigma(W_z x + U_z h)" />
        <p>
          The reset gate <Math tex="r" /> controls how much of the previous state
          is exposed when computing the candidate hidden state:
        </p>
        <Math display tex="r = \sigma(W_r x + U_r h)" />
        <p>
          The candidate hidden state mixes new input with a gated view of the past:
        </p>
        <Math display tex="\tilde{h} = \tanh(W x + U(r \odot h))" />
        <p>
          The new hidden state interpolates between the previous state and the candidate:
        </p>
        <Math display tex="h' = (1 - z) \odot h + z \odot \tilde{h}" />
        <p>
          When <Math tex="z \to 0" /> the unit forgets the candidate and copies the
          previous state. When <Math tex="z \to 1" /> it discards the previous state
          and replaces it with the candidate. The reset gate allows the unit to forget
          state selectively when computing new candidates, which is what allows the
          network to capture both short-term and long-term dependencies in the same
          architecture.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Machine translation:</strong> The RNN Encoder-Decoder improved
            phrase table scores on English-to-French translation, with qualitative
            improvements in linguistically plausible phrase representations
          </li>
          <li>
            <strong>Representation quality:</strong> Phrases with similar semantic
            meaning were found to cluster together in the learned continuous space,
            demonstrating that the GRU hidden states encode compositional structure
          </li>
          <li>
            <strong>Architecture impact:</strong> The encoder-decoder framework and
            GRU unit directly enabled subsequent sequence-to-sequence learning advances
            including attention mechanisms and transformer architectures
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The GRU is the recurrent building block inside the network architecture of
          Back to Newton's Laws (#1 in this archive), where a GRU processes a temporal
          sequence of depth observations to maintain implicit state estimation without
          an explicit odometry module. The update and reset gate mechanism is what allows
          the network to retain relevant flight state across timesteps while discarding
          stale observations, exactly the behavior needed when operating at 15 Hz on a
          moving platform.
        </p>
        <p>
          The encoder-decoder framework generalizes directly to any problem where a
          variable-length history of observations must be compressed into a fixed-length
          state representation for control. In distributed swarm systems, each node must
          summarize its observation history into a compact state for decision-making.
          The GRU's gated mechanism provides a principled way to do this with stable
          gradients, which is why it appears across virtually every learned navigation
          system in this archive.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: RNN Encoder-Decoder and GRU | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of the RNN Encoder-Decoder and GRU: update gate, reset gate, candidate hidden state, and why gated recurrent units underlie temporal modeling in learned navigation systems.",
    },
  ],
};
