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
        <h1>Gradients Are Not All You Need</h1>
        <p class={styles.meta}>
          Metz, L. et al.
          &nbsp;·&nbsp; arXiv:2111.05803 (2021) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2111.05803" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Differentiable programming has enabled gradient-based optimization through
          physics simulations, rendering pipelines, and recurrent models. The implicit
          assumption is that gradients computed through these systems are informative
          about the optimization landscape. This paper systematically characterizes the
          conditions under which this assumption fails: chaotic dynamical systems, long
          unrolled computation graphs, and discontinuous or non-smooth loss surfaces
          all produce gradients that are either numerically unstable or point in the
          wrong direction.
        </p>
        <p>
          The practical consequence for robotics is that differentiable physics training
          is not universally applicable. When the simulation is chaotic or the training
          horizon is long, gradient estimates through the simulation are unreliable and
          gradient-free alternatives may perform better.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Gradient explosion in chaotic systems</h3>
        <p>
          Consider a discrete dynamical system <Math tex="x_{t+1} = f(x_t, \theta)" />.
          The gradient of the loss at time <Math tex="T" /> with respect to the initial
          parameter <Math tex="\theta" /> is computed by the chain rule:
        </p>
        <Math display tex="\frac{\partial \mathcal{L}_T}{\partial \theta} = \frac{\partial \mathcal{L}_T}{\partial x_T} \prod_{t=1}^{T} \frac{\partial f(x_t, \theta)}{\partial x_{t-1}} \cdot \frac{\partial f(x_1, \theta)}{\partial \theta}" />
        <p>
          For a chaotic system, the Jacobian product <Math tex="\prod_{t=1}^T \partial f / \partial x_{t-1}" />
          has eigenvalues that grow exponentially in the Lyapunov exponent
          <Math tex="\lambda > 0" />:
        </p>
        <Math display tex="\left\| \prod_{t=1}^{T} \frac{\partial f}{\partial x_{t-1}} \right\| \sim e^{\lambda T}" />
        <p>
          Even small differences in <Math tex="\theta" /> lead to exponentially diverging
          trajectories, making the gradient both large and poorly conditioned as a
          search direction. Gradient clipping addresses the magnitude but not the direction.
        </p>

        <h3>Bias from truncated gradients</h3>
        <p>
          Truncated backpropagation through time (TBPTT) limits the unroll horizon
          to <Math tex="K" /> steps to control compute and gradient explosion. The
          truncated gradient is:
        </p>
        <Math display tex="\hat{g}_K = \frac{\partial}{\partial \theta} \sum_{t=T-K}^{T} \ell_t" />
        <p>
          This is a biased estimator of the full gradient{" "}
          <Math tex="g = \partial / \partial \theta \sum_{t=1}^{T} \ell_t" /> because
          it ignores the contribution of <Math tex="\theta" /> through timesteps
          <Math tex="1, \ldots, T-K-1" />. The bias is:
        </p>
        <Math display tex="\mathbb{E}[\hat{g}_K] - g = -\frac{\partial}{\partial \theta} \sum_{t=1}^{T-K-1} \ell_t" />
        <p>
          which is nonzero whenever the loss at early timesteps depends on{" "}
          <Math tex="\theta" />. For long-horizon tasks, this term dominates and
          the truncated gradient points in the wrong direction.
        </p>

        <h3>Gradient variance from environment stochasticity</h3>
        <p>
          Stochastic environments contribute variance to the gradient estimator.
          Monte Carlo gradient estimation requires many samples to achieve low variance:
        </p>
        <Math display tex="\text{Var}\!\left[\hat{g}_K\right] = \mathcal{O}\!\left(\frac{e^{2\lambda K}}{N}\right)" />
        <p>
          where <Math tex="N" /> is the number of rollouts. Exponential growth in
          <Math tex="K" /> means the sample count required for a reliable gradient
          estimate grows exponentially with unroll horizon, making long-horizon
          differentiable training impractical even with many parallel environments.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Chaotic loss surfaces:</strong> Gradient descent fails on simple
            logistic maps and pendulum systems where the Lyapunov exponent exceeds the
            gradient signal, while evolutionary strategies succeed
          </li>
          <li>
            <strong>Horizon scaling:</strong> Gradient-based methods degrade
            systematically as unroll horizon increases; gradient-free methods are
            unaffected by horizon length
          </li>
          <li>
            <strong>Discontinuity:</strong> Contact discontinuities in physics simulation
            produce zero gradient almost everywhere with infinite gradient at contact
            transitions: the gradient is uninformative except at a measure-zero set
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          This paper characterizes the failure regime of differentiable physics training.
          The conditions that cause failure are common in robotics: contact dynamics are
          discontinuous, fluid dynamics are chaotic, and multi-step rollouts through
          any complex environment accumulate gradient bias. The practical implication is
          that differentiable physics is reliable for short-horizon, smooth, non-chaotic
          dynamics, and unreliable otherwise.
        </p>
        <p>
          For swarm coordination with many interacting agents, the dynamics can exhibit
          emergent chaos: small per-agent perturbations can amplify through the interaction
          network. Gradient-based policy optimization in this setting faces exactly the
          failure modes characterized here. The appropriate response is either to shorten
          the horizon over which gradients are computed (accepting bias), or to use a
          gradient-free training algorithm (PPO, CMA-ES) for the inter-agent coordination
          component while reserving differentiable training for the per-agent dynamics
          where the assumptions hold.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Gradients Are Not All You Need | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of gradient failure modes in chaotic systems: Lyapunov exponent-driven explosion, truncated gradient bias, and implications for differentiable physics training in robotics.",
    },
  ],
};
