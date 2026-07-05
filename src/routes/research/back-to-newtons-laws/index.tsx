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
        <h1>Back to Newton's Laws: Learning Vision-Based Agile Flight via Differentiable Physics</h1>
        <p class={styles.meta}>
          Zhang, Y., Hu, Y., Song, Y., Zou, D. &amp; Lin, W. &nbsp;·&nbsp; Nature Mach. Intell. (2025) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2407.10648" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Autonomous aerial navigation has traditionally been decomposed into a pipeline:
          map the environment, plan a path, track it with a controller. Each stage accumulates
          latency and failure modes. This paper eliminates the pipeline entirely. A single
          convolutional recurrent neural network maps raw depth observations directly to
          thrust commands, trained end-to-end by backpropagating gradients through a
          differentiable physics simulation. No mapping, no planning, no state estimation module.
        </p>
        <p>
          The result runs at 20 m/s on a $21 ARM processor, achieves 90% success in dense
          environments against 60% for the prior state of the art, coordinates a six-drone
          swarm through narrow gates without inter-agent communication, and transfers
          zero-shot from simulation to the physical world without domain randomization.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Differentiable physics training objective</h3>
        <p>
          Policy parameters <Math tex="\theta" /> are optimized by minimizing a loss
          accumulated over a trajectory of <Math tex="N" /> timesteps:
        </p>
        <Math display tex="\mathcal{L}_\theta = \sum_{k=0}^{N-1} l(x_k,\, \pi_\theta(o_k))" />
        <p>
          Because the physics simulation is differentiable, the gradient flows directly
          through the trajectory:
        </p>
        <Math display tex="\frac{\partial \mathcal{L}_\theta}{\partial \theta} = \frac{1}{N} \sum_{k=0}^{N-1} \left[ \sum_{i=0}^{k} \frac{\partial l_k}{\partial x_k} \prod_{j=i+1}^{k} \frac{\partial x_j}{\partial x_{j-1}} \frac{\partial x_i}{\partial \theta} + \frac{\partial l_k}{\partial u_k} \frac{\partial u_k}{\partial \theta} \right]" />
        <p>
          This eliminates the reward-shaping and variance-reduction machinery required by
          model-free RL. The policy sees exact gradients rather than estimated ones,
          which is why convergence requires only 10% of the samples needed by PPO.
        </p>

        <h3>Point-mass dynamics</h3>
        <p>
          Rather than a full rigid-body model, the simulation uses simplified point-mass
          kinematics with a calibrated air drag term:
        </p>
        <Math display tex="v_{k+1} = v_k + \frac{a_k + a_{k+1}}{2}\Delta t" />
        <Math display tex="p_{k+1} = p_k + v_k\Delta t + \frac{1}{2}a_k(\Delta t)^2" />
        <Math display tex="a_\text{drag} = -\theta_1 \|v\| v - \theta_2 v" />
        <p>
          The quadratic drag term becomes significant above 9 m/s, contributing more than
          5 m/s² deceleration for the 3-inch platform tested. Neglecting it breaks
          sim-to-real transfer at high speed. Including it with calibrated coefficients
          restores zero-shot transfer without any further adaptation.
        </p>

        <h3>Control latency model</h3>
        <p>
          Flight controller response is modelled as a fixed delay followed by exponential
          smoothing, via convolution with impulse response:
        </p>
        <Math display tex="\eta(t) = \begin{cases} 0 & t < \tau \\ \lambda e^{-\lambda(t-\tau)} & t \geq \tau \end{cases}" />
        <p>
          With <Math tex="\tau = 1/15\,\text{s}" /> and <Math tex="\lambda = 12" />,
          this model captures the actuator lag that causes instability in naive sim-to-real
          transfer at high speeds. The latency model is hardware-agnostic and was validated
          across multiple drone platforms.
        </p>

        <h3>Composite physics-driven loss</h3>
        <p>
          The training loss combines four differentiable terms:
        </p>
        <Math display tex="\mathcal{L} = \lambda_v \mathcal{L}_v + \lambda_c \mathcal{L}_c + \lambda_a \mathcal{L}_a + \lambda_j \mathcal{L}_j" />
        <p>
          Velocity tracking pulls the drone toward a reference speed. Let{" "}
          <Math tex="e_k = \|v_k^\text{set} - \bar{v}_k\|_2" /> be the scalar speed
          error at timestep <Math tex="k" />, and <Math tex="\beta" /> a threshold
          that separates the quadratic and linear regimes (PyTorch default{" "}
          <Math tex="\beta = 1" />). The SmoothL1 penalty on that error is:
        </p>
        <Math display tex="\text{SmoothL1}(e_k) = \begin{cases} \dfrac{e_k^2}{2\beta} & e_k < \beta \\[6pt] e_k - \dfrac{\beta}{2} & e_k \geq \beta \end{cases}" />
        <p>
          Below the threshold the loss is quadratic: gradients scale with error magnitude,
          which is gentle near the target. Above the threshold it is linear: gradient is
          constant, preventing explosion when velocity error is large early in training.
          The full velocity loss averages this penalty over the trajectory:
        </p>
        <Math display tex="\mathcal{L}_v = \frac{1}{T} \sum_{k=1}^{T} \text{SmoothL1}(e_k)" />
        <p>
          Obstacle avoidance uses a composite penalty combining a hard quadratic term
          for close proximity and a soft logarithmic barrier for early warning:
        </p>
        <Math display tex="\mathcal{L}_c = \frac{1}{T} \sum v_k^c \cdot \max(1 - (d_k - r_q),\, 0)^2 + \beta_1 \ln(1 + e^{\beta_2(d_k - r_q)})" />
        <p>
          Smoothness terms penalize acceleration magnitude and jerk:
        </p>
        <Math display tex="\mathcal{L}_a = \frac{1}{T}\sum \|a_k\|^2, \qquad \mathcal{L}_j = \frac{1}{T-1}\sum \left\|\frac{a_k - a_{k+1}}{\Delta t}\right\|^2" />
        <p>
          Weights are <Math tex="\lambda_v=1,\,\lambda_c=2,\,\lambda_a=0.01,\,\lambda_j=0.001" />.
          The collision weight dominates to ensure safety is the primary constraint.
        </p>

        <h3>Temporal gradient decay</h3>
        <p>
          Backpropagating through long trajectories causes gradient explosion.
          The paper introduces an exponential decay on the state transition Jacobians:
        </p>
        <Math display tex="\frac{\partial x_j}{\partial x_{j-1}} \cdot e^{-\alpha \Delta t}" />
        <p>
          This attenuates gradients from distant timesteps, aligning the effective learning
          horizon with the sensor's perception range. Gradients from obstacles too far away
          to be seen are suppressed before they can destabilize training.
        </p>

        <h3>Network architecture</h3>
        <p>
          A convolutional recurrent neural network processes 16×12 depth maps
          (inverted and max-pooled from the RealSense D435i output):
        </p>
        <ul>
          <li>CNN: 32 (kernel 2) → 64 (kernel 3) → 128 (kernel 3) filters</li>
          <li>Linear projection to 192-dimensional feature vector</li>
          <li>Target velocity, attitude, and velocity estimates concatenated</li>
          <li>GRU cell processes the combined 192-dim input</li>
          <li>Output: desired thrust acceleration and velocity estimate</li>
        </ul>
        <p>
          The GRU provides the recurrent memory that allows implicit state estimation
          without an explicit odometry module. The network learns to integrate temporal
          dynamics from the sequence of depth observations alone.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Single-agent success rate:</strong> 90% in complex environments
            versus 60% prior state of the art
          </li>
          <li>
            <strong>Flight speed:</strong> 20 m/s in forest environments, doubling
            previous methods
          </li>
          <li>
            <strong>Sample efficiency:</strong> Converges to 100% success at 5 m/s
            by 1000 training iterations, requiring only 10% of the samples needed by PPO
          </li>
          <li>
            <strong>Multi-agent swarm:</strong> Six drones coordinated through narrow
            gates in opposing directions without inter-agent communication, achieving
            success rates comparable to communication-based methods
          </li>
          <li>
            <strong>Dynamic obstacles:</strong> Closing gates, moving barriers,
            and crowds with unpredictable motion handled without explicit motion prediction
          </li>
          <li>
            <strong>Hardware:</strong> Mango Pi SBC (ARM Cortex-A53, 30×65×6 mm, 11 g),
            RealSense D435i at 15 Hz. Total platform cost: $21 excluding development
          </li>
          <li>
            <strong>Zero-shot sim-to-real:</strong> No domain randomization or
            real-world adaptation required. Point-mass model with calibrated drag and
            latency is sufficient for physical deployment
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The differentiable physics approach inverts the conventional assumption about
          what makes simulation useful. Standard practice uses simulation to generate
          training data. This paper uses simulation as a differentiable function that
          the optimizer can reason through directly. The gradient flows through physics,
          not just through the network, which is why sample efficiency improves by an order
          of magnitude over PPO.
        </p>
        <p>
          The point-mass simplification is the counterintuitive result. A dramatically
          simplified dynamics model (one that ignores quaternion rotations, flexible
          dynamics, and aerodynamic complexity) generalizes better to physical hardware
          than high-fidelity models do. The reason is that simplified models have fewer
          parameters to mis-specify. Adding calibrated drag and latency at the boundaries
          where simplification breaks down is sufficient to close the sim-to-real gap.
        </p>
        <p>
          The emergent swarm coordination is the result most directly relevant to
          distributed autonomous systems. Six agents developed mutual avoidance, waiting,
          and following behaviors without explicit coordination design. The physics-driven
          obstacle avoidance loss alone was sufficient. This demonstrates that collective
          navigation behaviors can emerge from individual policies trained on shared
          physics objectives, without communication infrastructure.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Back to Newton's Laws | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of Back to Newton's Laws: differentiable physics training, point-mass dynamics with calibrated drag and latency, emergent multi-agent coordination, and zero-shot sim-to-real transfer on $21 edge hardware.",
    },
  ],
};
