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
        <h1>Deep Drone Racing: From Simulation to Reality with Domain Randomization</h1>
        <p class={styles.meta}>
          Loquercio, A. et al.
          &nbsp;·&nbsp; IEEE Trans. Robot. 36, 1–14 (2019) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/1905.09727" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Learning a drone racing policy directly in the real world is sample-inefficient
          and dangerous. Simulation training is safe and fast but policies trained in
          simulation fail to transfer when the visual appearance of the simulated world
          does not match reality. This paper applies domain randomization to the simulation
          environment during training, forcing the network to learn representations that
          are invariant to visual appearance rather than tied to any specific render style.
        </p>
        <p>
          The result is a policy trained entirely in simulation that transfers zero-shot
          to physical hardware, racing through gates at speeds up to 8 m/s without any
          fine-tuning on real data. This paper is the domain randomization baseline
          for quadrotor sim-to-real transfer.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Domain randomization</h3>
        <p>
          Let <Math tex="\xi \sim p(\xi)" /> be a randomization parameter sampled
          from a distribution over visual domain parameters (gate texture, background
          texture, lighting, camera noise). The network is trained on observations
          <Math tex="o_\xi" /> drawn from the randomized domain:
        </p>
        <Math display tex="\pi^* = \arg\min_\theta \mathbb{E}_{\xi \sim p(\xi)}\!\left[\mathcal{L}(\pi_\theta, \xi)\right]" />
        <p>
          The key insight is that a policy trained to minimize loss under the entire
          distribution <Math tex="p(\xi)" /> must learn features that are invariant
          across visual domains. If the real world falls within (or close to) the support
          of <Math tex="p(\xi)" />, the trained policy will generalize.
        </p>

        <h3>Gate pose estimation</h3>
        <p>
          The input to the network is the estimated gate pose rather than raw pixels.
          A separate gate detection module estimates the gate center position and
          orientation in camera frame:
        </p>
        <Math display tex="\hat{T}_{gc} = \begin{bmatrix} R_{gc} & t_{gc} \\ 0 & 1 \end{bmatrix} \in SE(3)" />
        <p>
          This modular design separates perception (gate detection, domain-dependent)
          from control (gate-relative navigation, domain-invariant). Domain randomization
          is applied to the perception module; the control module receives a consistent
          gate-relative state regardless of visual domain.
        </p>

        <h3>Network architecture and training</h3>
        <p>
          The policy network maps gate-relative state to body rate commands. Let
          <Math tex="s = (p_{gc}, v, q) \in \mathbb{R}^{10}" /> be the state
          consisting of gate-relative position, velocity, and attitude. The network
          outputs body rates <Math tex="\omega^B \in \mathbb{R}^3" /> and thrust:
        </p>
        <Math display tex="(\omega^B, c) = \pi_\theta(s)" />
        <p>
          The training loss combines imitation of a model-based expert and a
          trajectory smoothness regularizer:
        </p>
        <Math display tex="\mathcal{L} = \sum_t \left\| (\omega_t^B, c_t) - (\omega_t^{B,*}, c_t^*) \right\|^2 + \lambda \sum_t \left\| (\omega_{t+1}^B - \omega_t^B) \right\|^2" />

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Zero-shot transfer:</strong> Policy trained purely in simulation
            transfers to physical hardware without real-world fine-tuning, achieving
            100% gate completion in nominal conditions
          </li>
          <li>
            <strong>Speed:</strong> Successfully races through gates at up to 8 m/s,
            competitive with the AlphaPilot system
          </li>
          <li>
            <strong>Domain gap ablation:</strong> Without domain randomization, the
            policy achieves 0% gate completion on the physical platform despite 100%
            in simulation
          </li>
          <li>
            <strong>Compute:</strong> Inference on an Intel NUC (no discrete GPU)
            at 30 Hz
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          This paper makes the empirical case for domain randomization as a zero-cost
          sim-to-real transfer technique: the gate completion rate without randomization
          is 0% on the physical platform; with randomization it is 100%. The technique
          adds no real-world data collection, no manual annotation, and no fine-tuning
          after training. The only cost is simulation diversity, which is effectively free.
        </p>
        <p>
          The modular perception-control decomposition is architecturally important.
          Domain randomization is applied to the perception layer (gate detection)
          while the control layer (gate-relative navigation) is trained in a canonical
          coordinate frame. This separation is the correct design pattern when perception
          is domain-dependent but the control problem has a canonical formulation that
          is domain-invariant.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Deep Drone Racing | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of Deep Drone Racing: domain randomization over visual appearance, modular perception-control decomposition, and zero-shot sim-to-real transfer at 8 m/s gate traversal.",
    },
  ],
};
