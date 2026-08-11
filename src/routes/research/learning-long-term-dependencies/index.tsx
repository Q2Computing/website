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
        <h1>Learning Long-Term Dependencies with Gradient Descent Is Difficult</h1>
        <p class={styles.meta}>
          Bengio, Y., Simard, P. &amp; Frasconi, P.
          &nbsp;·&nbsp; IEEE Trans. Neural Netw. 5, 157-166 (1994) &nbsp;·&nbsp;
          <a href="https://ieeexplore.ieee.org/document/279181" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Recurrent neural networks trained with backpropagation through time fail to
          learn dependencies between events separated by many timesteps. Practitioners
          observed this empirically but without a rigorous characterization of why it
          occurs or whether it is fundamental. This paper provides the first formal
          analysis: the vanishing and exploding gradient problem in RNNs is a necessary
          consequence of the geometry of the gradient flow through unrolled recurrent
          networks, not an artifact of any particular implementation.
        </p>
        <p>
          The analysis in this paper is the direct motivation for the GRU (Cho et al.,
          2014, paper #18) and LSTM architectures, both of which were designed specifically
          to allow gradients to flow across long time horizons without vanishing.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Gradient flow in recurrent networks</h3>
        <p>
          A simple recurrent network with hidden state <Math tex="h_t \in \mathbb{R}^n" />
          evolves as:
        </p>
        <Math display tex="h_t = \tanh(W h_{t-1} + U x_t + b)" />
        <p>
          The gradient of loss <Math tex="\mathcal{L}_T" /> at time <Math tex="T" />
          with respect to hidden state at time <Math tex="k &lt; T" /> is:
        </p>
        <Math display tex="\frac{\partial \mathcal{L}_T}{\partial h_k} = \frac{\partial \mathcal{L}_T}{\partial h_T} \prod_{t=k+1}^{T} \frac{\partial h_t}{\partial h_{t-1}}" />
        <p>
          Each Jacobian factor is:
        </p>
        <Math display tex="\frac{\partial h_t}{\partial h_{t-1}} = \text{diag}\!\left(\tanh'(W h_{t-1} + \ldots)\right) W" />
        <p>
          For the gradient to survive a product of <Math tex="T - k" /> such matrices,
          the spectral radius <Math tex="\rho(W)" /> must be controlled.
        </p>

        <h3>Vanishing and exploding gradient conditions</h3>
        <p>
          The product <Math tex="\prod_{t=k+1}^{T} \partial h_t / \partial h_{t-1}" />
          has norm that scales as:
        </p>
        <Math display tex="\left\| \prod_{t=k+1}^{T} \frac{\partial h_t}{\partial h_{t-1}} \right\| \leq \prod_{t=k+1}^{T} \left\| \frac{\partial h_t}{\partial h_{t-1}} \right\| \leq \left(\sigma_1 \| W \|\right)^{T-k}" />
        <p>
          where <Math tex="\sigma_1 = \max_{z} |\tanh'(z)| = 1" /> is the maximum
          derivative of the activation. When{" "}
          <Math tex="\|W\| &lt; 1" />, the product vanishes exponentially in
          <Math tex="T - k" /> (vanishing gradient). When{" "}
          <Math tex="\|W\| &gt; 1" />, the product explodes exponentially (exploding
          gradient). There is no stable regime where long-range gradients neither
          vanish nor explode for a standard RNN.
        </p>

        <h3>The fundamental tradeoff</h3>
        <p>
          The paper shows there is an inherent conflict between two requirements:
          long-term memory retention requires <Math tex="\rho(W) \approx 1" /> so
          that information persists, but gradient propagation also requires{" "}
          <Math tex="\rho(W) \approx 1" /> for the same reason, and at that value
          the gradient signal is neither amplified nor attenuated: it is entirely
          unbiased but also unscaled. Small perturbations in the norm drive the system
          into either vanishing or exploding territory. This is not a problem that
          gradient clipping or careful initialization can solve; it is structural.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Latch problems:</strong> Standard RNNs fail to learn tasks requiring
            memory of an event more than 10 timesteps in the past, regardless of network
            size or training duration
          </li>
          <li>
            <strong>Gradient norms:</strong> Direct measurement of gradient norms across
            timesteps confirms exponential decay (vanishing) or explosion for all
            tested initialization strategies
          </li>
          <li>
            <strong>Alternatives:</strong> The paper proposes time-delay connections and
            leaky integration as partial remedies, which foreshadow the LSTM and GRU
            architectures
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          This 1994 paper is the theoretical foundation for every gated recurrent
          architecture used in this archive. The GRU (paper #18) and the bidirectional
          LSTM (paper #17) are both direct engineering responses to the problem
          characterized here: their gates are designed to allow gradient flow across
          long horizons by providing additive skip connections that bypass the
          multiplicative Jacobian product.
        </p>
        <p>
          For distributed swarm systems where each node maintains a state estimate
          updated over potentially long observation histories, this result is directly
          relevant: any recurrent model used for confidence updating must be architected
          to avoid the vanishing gradient regime. The solution is not to tune the
          learning rate or increase the network size but to change the architecture
          to include gating mechanisms that provide stable gradient paths. This is
          what GRU and LSTM provide, and why those architectures appear everywhere
          in this archive rather than plain RNNs.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Learning Long-Term Dependencies | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of Bengio et al. 1994: formal characterization of the vanishing and exploding gradient problem in recurrent networks and why this motivates gated architectures.",
    },
  ],
};
