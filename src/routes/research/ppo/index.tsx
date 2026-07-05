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
        <h1>Proximal Policy Optimization Algorithms</h1>
        <p class={styles.meta}>
          Schulman, J., Wolski, F., Dhariwal, P., Radford, A. &amp; Klimov, O.
          &nbsp;·&nbsp; arXiv:1707.06347 (2017) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/1707.06347" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Policy gradient methods for reinforcement learning are unstable: a single
          large gradient step can collapse a policy, and recovering requires restarting
          from scratch. Trust Region Policy Optimization (TRPO) addressed this by
          constraining each update to stay within a KL-divergence bound from the current
          policy, but it requires second-order optimization and is difficult to apply
          when the policy shares parameters with a value function or auxiliary loss.
        </p>
        <p>
          PPO achieves the same stability guarantee through a first-order clipped
          surrogate objective that is simple to implement, compatible with shared
          architectures, and admits multiple minibatch epochs per rollout. It became
          the standard policy gradient algorithm for continuous control and is the
          training method used in Champion-Level Drone Racing (#11 in this archive).
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Policy gradient baseline</h3>
        <p>
          Standard policy gradient maximizes the expected return by ascending the
          gradient of the log-probability of actions weighted by advantage:
        </p>
        <Math display tex="\mathcal{L}^{PG}(\theta) = \mathbb{E}_t\!\left[\log \pi_\theta(a_t \mid s_t)\, A_t\right]" />
        <p>
          where <Math tex="A_t" /> is an estimate of the advantage function at
          timestep <Math tex="t" />. Multiple epochs of gradient ascent on this
          objective destroys the policy because large updates shift{" "}
          <Math tex="\pi_\theta" /> far from the distribution that generated the data.
        </p>

        <h3>Probability ratio</h3>
        <p>
          Let <Math tex="r_t(\theta)" /> be the ratio of the new policy probability
          to the old policy probability for the taken action:
        </p>
        <Math display tex="r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_\text{old}}(a_t \mid s_t)}" />
        <p>
          When <Math tex="r_t = 1" />, the policy is unchanged. TRPO constrains
          updates by requiring the expected KL divergence between old and new policy
          to stay below a threshold <Math tex="\delta" />. PPO enforces a softer
          version by clipping <Math tex="r_t" /> directly.
        </p>

        <h3>Clipped surrogate objective</h3>
        <p>
          The PPO-Clip objective pessimistically clips the probability ratio so that
          updates which move the policy too far from the old policy receive no additional
          gradient signal:
        </p>
        <Math display tex="\mathcal{L}^{CLIP}(\theta) = \mathbb{E}_t\!\left[\min\!\left(r_t(\theta)\,A_t,\; \mathrm{clip}(r_t(\theta),\, 1-\varepsilon,\, 1+\varepsilon)\,A_t\right)\right]" />
        <p>
          The clip threshold <Math tex="\varepsilon = 0.2" /> is the primary
          hyperparameter. When the advantage is positive (the action was good), the
          ratio is clipped above at <Math tex="1+\varepsilon" /> so the policy cannot
          over-exploit it. When the advantage is negative (the action was bad), the
          ratio is clipped below at <Math tex="1-\varepsilon" /> so the policy cannot
          collapse toward avoiding it too aggressively.
        </p>

        <h3>Generalized Advantage Estimation</h3>
        <p>
          The advantage estimate <Math tex="A_t" /> uses Generalized Advantage
          Estimation (GAE) to balance bias and variance. Let{" "}
          <Math tex="\delta_t^V = r_t + \gamma V(s_{t+1}) - V(s_t)" /> be the
          TD residual. GAE computes an exponentially weighted sum of TD residuals:
        </p>
        <Math display tex="\hat{A}_t^{GAE(\gamma,\lambda)} = \sum_{l=0}^{\infty} (\gamma\lambda)^l\, \delta_{t+l}^V" />
        <p>
          The parameter <Math tex="\lambda \in [0,1]" /> interpolates between
          high-bias one-step TD (<Math tex="\lambda=0" />) and high-variance
          Monte Carlo returns (<Math tex="\lambda=1" />). Typical values are{" "}
          <Math tex="\gamma=0.99,\, \lambda=0.95" />.
        </p>

        <h3>Combined training objective</h3>
        <p>
          When the policy and value function share network parameters, PPO optimizes
          a combined objective that adds a value function loss and an entropy bonus:
        </p>
        <Math display tex="\mathcal{L}^{CLIP+VF+S}(\theta) = \mathbb{E}_t\!\left[\mathcal{L}_t^{CLIP}(\theta) - c_1\,\mathcal{L}_t^{VF}(\theta) + c_2\,S[\pi_\theta](s_t)\right]" />
        <Math display tex="\mathcal{L}_t^{VF}(\theta) = \left(V_\theta(s_t) - V_t^{\text{targ}}\right)^2" />
        <p>
          The entropy bonus <Math tex="S[\pi_\theta](s_t)" /> penalizes premature
          convergence to deterministic policies. Coefficients{" "}
          <Math tex="c_1 = 1,\; c_2 = 0.01" /> are standard. Unlike TRPO, this
          objective is differentiable and can be optimized with any first-order method.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Continuous control:</strong> PPO outperforms TRPO, A2C, and
            CMA-ES on the majority of MuJoCo locomotion benchmarks including
            Hopper, Walker2d, HalfCheetah, and Ant
          </li>
          <li>
            <strong>Atari games:</strong> Matches or exceeds A3C performance on
            most Atari 2600 games using a single GPU within hours of wall-clock time
          </li>
          <li>
            <strong>Sample efficiency:</strong> Achieves competitive performance
            with far fewer total environment interactions than TRPO due to multiple
            epochs of minibatch updates per rollout
          </li>
          <li>
            <strong>Implementation simplicity:</strong> Requires only first-order
            gradients and no line search, making it compatible with standard deep
            learning frameworks and shared policy-value architectures
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          PPO's importance in this archive is primarily as an infrastructure algorithm.
          It is the training method behind Champion-Level Drone Racing, where 100 parallel
          simulation agents trained a quadrotor policy over 10⁸ environment interactions
          to achieve human-world-champion performance. The clip mechanism is what makes
          that scale of parallel training stable: independent rollouts from different
          agents can be batched into minibatch updates without any single rollout
          catastrophically shifting the policy.
        </p>
        <p>
          The GAE formulation is directly applicable to any control problem where the
          reward signal is delayed or sparse. In swarm coordination, individual node
          rewards depend on collective outcomes that may not materialize until many
          timesteps after the action that caused them. GAE's weighted sum of TD
          residuals provides a low-variance advantage estimate under exactly this
          kind of temporal credit assignment problem.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Proximal Policy Optimization | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of PPO: clipped surrogate objective, generalized advantage estimation, and why first-order policy optimization at scale enables champion-level robotic control.",
    },
  ],
};
