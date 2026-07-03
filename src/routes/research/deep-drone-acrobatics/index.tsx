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
        <h1>Deep Drone Acrobatics</h1>
        <p class={styles.meta}>
          Kaufmann, E., Loquercio, A., Ranftl, R., Müller, M., Koltun, V. &amp; Scaramuzza, D.
          &nbsp;·&nbsp; Robotics: Science and Systems (2020) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/2006.05768" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Acrobatic quadrotor maneuvers require extreme angular accelerations that push platforms
          to their physical limits and cause vision-based state estimation to fail through
          motion blur and feature tracking loss. Prior systems performing such maneuvers
          relied on external motion capture infrastructure. This paper is the first to demonstrate
          acrobatic flight at up to 3g using only onboard sensing and computation, with zero
          real-world fine-tuning after simulation training.
        </p>
        <p>
          The central insight is that raw sensory input contains simulation-reality discrepancies
          that prevent transfer, but appropriate abstractions of those inputs (feature tracks
          from VIO, pre-integrated IMU) are invariant to the environmental factors that differ
          between simulation and the physical world. The paper proves this formally and validates
          it across Power Loop, Barrel Roll, Matty Flip, and combined sequences.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Quadrotor dynamics</h3>
        <p>
          The privileged expert operates on a simplified quadrotor model where{" "}
          <Math tex="p^{WB}" /> is position, <Math tex="v^{WB}" /> velocity,{" "}
          <Math tex="q^{WB}" /> attitude quaternion, <Math tex="\omega^B" /> body
          angular rate, and <Math tex="c^B" /> collective thrust in body frame:
        </p>
        <Math display tex="\dot{p}^{WB} = v^{WB}, \quad \dot{v}^{WB} = {}^Wg + q^{WB} \odot c^B" />
        <Math display tex="\dot{q}^{WB} = \tfrac{1}{2}\,\Lambda(\omega^B) \cdot q^{WB}" />
        <p>
          This model neglects angular rate dynamics to reduce the planning problem to a
          form tractable for real-time MPC. The simplification holds for the maneuver
          timescales tested.
        </p>

        <h3>Receding horizon expert controller</h3>
        <p>
          The privileged expert <Math tex="\pi^*" /> is a Model Predictive Controller
          that repeatedly solves an open-loop optimization over a horizon of{" "}
          <Math tex="N" /> steps. Let <Math tex="x[k] = \tau_r[k] - s[k]" /> be the
          deviation of platform state from the reference trajectory at step{" "}
          <Math tex="k" />. The MPC minimizes:
        </p>
        <Math display tex="\pi^* = \min_u \left[ x[N]^\top Q\, x[N] + \sum_{k=1}^{N-1} \left( x[k]^\top Q\, x[k] + u[k]^\top R\, u[k] \right) \right]" />
        <p>
          subject to equality constraints <Math tex="r(x,u)=0" /> from the system
          dynamics and optional bounds <Math tex="h(x,u) \leq 0" />. The cost matrices
          <Math tex="Q, R" /> are positive semidefinite. Only the first element of the
          optimized control sequence is applied.
        </p>

        <h3>Student-expert performance bound</h3>
        <p>
          The student policy <Math tex="\pi" /> imitates the privileged expert via
          DAgger. The performance gap is formally bounded by the Wasserstein distance
          between the two policies on the trajectories the student actually visits:
        </p>
        <Math display tex="J(\pi) - J(\pi^*) \leq C_{\pi^*} \mathbb{E}_{\rho(\pi)}\!\left[D_W(\pi, \pi^*)\right] \leq C_{\pi^*} \mathbb{E}_{\rho(\pi)} \mathbb{E}_{u^* \sim \pi^*} \mathbb{E}_{u \sim \pi}\!\left[\|u^* - u\|\right]" />
        <p>
          where <Math tex="C_{\pi^*}" /> depends on the smoothness of expert actions.
          This reduces the learning problem to minimizing the expected action discrepancy
          under the student's own state distribution:
        </p>
        <Math display tex="\pi = \min_{\hat{\pi}}\; \mathbb{E}_{s[k] \sim \rho(\pi)}\!\left[\|u^*(s[k]) - \hat{\pi}(o[k])\|\right]" />

        <h3>Formal proof that abstraction reduces the sim-to-real gap</h3>
        <p>
          Let <Math tex="M(z|s)" /> and <Math tex="L(z|s)" /> be the observation models
          in the real world and in simulation. For a Lipschitz-continuous policy with
          constant <Math tex="K" />, the simulation-to-reality performance gap is
          bounded by the Wasserstein distance between observation models:
        </p>
        <Math display tex="J(\pi_r) - J(\pi_s) \leq C_{\pi_s} K \cdot \mathbb{E}_{\rho(\pi_r)}\!\left[D_W(M, L)\right]" />
        <p>
          If a mapping <Math tex="f" /> satisfies{" "}
          <Math tex="D_W(f(M), f(L)) \leq D_W(M, L)" />, then a policy trained
          on the abstracted representation <Math tex="f(O)" /> has a strictly lower
          simulation-to-reality gap than one trained on raw observations. Feature tracks
          satisfy this condition: they depend on scene geometry rather than surface
          appearance, making them invariant to the visual domain shift between simulation
          and reality.
        </p>

        <h3>Network architecture</h3>
        <p>
          Three asynchronous input branches process different modalities at their native
          sensor frequencies and feed a synchronous output MLP:
        </p>
        <ul>
          <li>
            <strong>Visual branch (feature tracks):</strong> Reduced PointNet
            (32 → 64 → 128 → 128 filters) over 40 sampled Harris corners per keyframe,
            global average pooling to 128-dim, then temporal convolutions over history
            length <Math tex="L=8" />
          </li>
          <li>
            <strong>IMU branch:</strong> Bias-subtracted, gravity-aligned inertial signal
            at 100 Hz through temporal convolution (128 filters then 3 × 64 filters),
            fully connected to 128-dim
          </li>
          <li>
            <strong>Reference branch:</strong> Same structure as IMU branch, updated at 50 Hz
          </li>
          <li>
            <strong>Output MLP:</strong> Concatenated 384-dim input through layers of
            size 128 → 64 → 32, outputting collective thrust and body rates at 100 Hz
          </li>
        </ul>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Tracking error:</strong> 24 ± 5 cm on Power Loop, 58 ± 9 cm on
            Barrel Roll, 53 ± 15 cm on Matty Flip, 45% lower than VIO-MPC baseline
            across maneuvers
          </li>
          <li>
            <strong>Success rate:</strong> 100% on all three individual maneuvers in
            simulation and on the physical platform with zero fine-tuning
          </li>
          <li>
            <strong>Combo sequence:</strong> 95% success on a combined triple Barrel Roll
            + double Power Loop + Matty Flip executed without stopping
          </li>
          <li>
            <strong>Abstraction validation:</strong> Raw image input achieved 80% success
            in training environment and 0% in novel backgrounds; feature track input
            maintained 100% success across all tested environments
          </li>
          <li>
            <strong>Hardware:</strong> Custom 1.15 kg quadrotor with 4:1 thrust-to-weight
            ratio, NVIDIA Jetson TX2 for inference, Intel RealSense T265 for visual-inertial input
          </li>
          <li>
            <strong>Peak acceleration:</strong> Up to 3g during acrobatic maneuvers
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          The abstraction lemma is the transferable result. The paper provides a formal
          proof that using scene-geometry-dependent representations rather than raw pixel
          input bounds the sim-to-real gap in terms of the Wasserstein distance between
          observation models. This is not a heuristic: it is a theorem with a computable
          certificate. Any system training in simulation can apply the same reasoning to
          choose input representations that minimize domain shift.
        </p>
        <p>
          The DAgger-based training procedure handles the distribution shift between expert
          trajectories and student trajectories without requiring physical hardware during
          training. The student's own rollouts are added to the dataset iteratively,
          ensuring the learned policy is robust on the state distribution it will actually
          visit at deployment rather than only on trajectories the expert generates.
        </p>
        <p>
          The asynchronous network design (where each sensor branch operates at its
          native frequency) is directly applicable to any multi-sensor embedded system
          where sensors produce data at different rates. The output layer runs at a fixed
          frequency regardless of when inputs arrive, which is the correct architecture
          for real-time control on constrained hardware.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Deep Drone Acrobatics | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of Deep Drone Acrobatics: formal proof that input abstraction reduces sim-to-real gap, DAgger imitation learning from privileged expert, and zero-shot 3g acrobatic maneuver transfer to physical hardware.",
    },
  ],
};
