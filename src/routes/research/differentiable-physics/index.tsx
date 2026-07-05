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
        <h1>Differentiable Physics Simulation</h1>
        <p class={styles.meta}>
          Liang, J. &amp; Lin, M. C.
          &nbsp;·&nbsp; ICLR Workshop on Integration of Deep Neural Models and Differential Equations (2020)
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Training robot control policies from scratch with model-free reinforcement
          learning requires millions of environment interactions and often converges to
          locally optimal solutions. Differentiable physics simulation provides an
          alternative: by making the simulation itself differentiable, gradients of
          a task objective can be propagated directly through the physical dynamics
          to the policy parameters, dramatically reducing the sample count required
          to find good policies.
        </p>
        <p>
          This work characterizes the theory and implementation of differentiable rigid-body
          simulation, including contact dynamics and joint constraints, and demonstrates
          that gradient-based optimization through physics can solve manipulation and
          locomotion tasks with orders of magnitude fewer interactions than model-free
          methods on the same benchmarks.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Differentiable time integration</h3>
        <p>
          Rigid-body dynamics integrate Newton-Euler equations forward in time.
          For a rigid body with generalized coordinates <Math tex="q \in \mathbb{R}^n" />
          and velocities <Math tex="\dot{q} \in \mathbb{R}^n" />, the dynamics are:
        </p>
        <Math display tex="M(q)\ddot{q} + C(q, \dot{q})\dot{q} = \tau + J_c^\top \lambda" />
        <p>
          where <Math tex="M(q)" /> is the mass matrix, <Math tex="C(q, \dot{q})" />
          contains Coriolis and centrifugal terms, <Math tex="\tau" /> is the
          generalized force from actuators, <Math tex="J_c" /> is the contact Jacobian,
          and <Math tex="\lambda" /> are contact forces. Standard simulators solve
          this forward for <Math tex="\ddot{q}" /> at each timestep. A differentiable
          simulator additionally maintains the Jacobians:
        </p>
        <Math display tex="\frac{\partial q_{t+1}}{\partial \theta}, \quad \frac{\partial \dot{q}_{t+1}}{\partial \theta}" />
        <p>
          where <Math tex="\theta" /> are policy parameters, enabling backpropagation
          through the physical trajectory.
        </p>

        <h3>Gradient through the control policy</h3>
        <p>
          The policy <Math tex="\pi_\theta(x_t)" /> maps observed state to control.
          The task loss at the end of a trajectory of length <Math tex="T" /> is:
        </p>
        <Math display tex="\mathcal{L}(\theta) = \ell(q_T, \dot{q}_T)" />
        <p>
          The policy gradient is computed by unrolling through the simulation:
        </p>
        <Math display tex="\frac{\partial \mathcal{L}}{\partial \theta} = \frac{\partial \ell}{\partial q_T} \frac{\partial q_T}{\partial \theta} + \frac{\partial \ell}{\partial \dot{q}_T} \frac{\partial \dot{q}_T}{\partial \theta}" />
        <p>
          Each step of the unroll applies the chain rule through the time integrator,
          the contact resolution step, and the policy network. All three must be
          differentiable for the gradient to flow end-to-end.
        </p>

        <h3>Contact handling</h3>
        <p>
          Contact forces are the primary source of non-differentiability in rigid-body
          simulation. The paper addresses this through smooth approximations of the
          contact complementarity conditions. The Signorini condition (no penetration,
          no tensile force) is approximated by a smooth penalty:
        </p>
        <Math display tex="\lambda_n \approx k \max(0, -g_n)^2" />
        <p>
          where <Math tex="g_n" /> is the signed gap between contacting surfaces
          and <Math tex="k" /> is a stiffness coefficient. This penalty is
          differentiable everywhere except at exact zero gap, which has measure zero
          in practice.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Sample efficiency:</strong> Differentiable physics optimization
            converges to good policies in 10-100x fewer environment interactions
            than PPO and SAC on manipulation benchmarks
          </li>
          <li>
            <strong>Policy quality:</strong> Final performance matches or exceeds
            model-free baselines, with the gradient signal providing better local
            search direction than Monte Carlo estimates
          </li>
          <li>
            <strong>Locomotion:</strong> Locomotion gaits (walk, trot, jump)
            emerge from optimization against a forward progress objective without
            reward shaping, using gradients through contact forces
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          Differentiable physics simulation is the enabling technology behind
          Back to Newton's Laws (#1). The ability to propagate gradients directly
          through the flight dynamics is what allows Back to Newton's Laws to train
          a policy end-to-end without a reward function, instead minimizing the
          discrepancy between predicted and actual velocity using gradients that
          flow through the aerodynamic model.
        </p>
        <p>
          The contact differentiability problem is less relevant for aerial vehicles
          operating below 7 m/s in atmospheric conditions, where contact dynamics
          are absent and the relevant physics is aerodynamic drag. The smooth
          drag model in that regime means the differentiable physics assumption
          holds without any contact approximation. Differentiability breaks down
          for ground-contact robotics (landing, manipulation) but is clean for
          free-flight dynamics within the operating envelope.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: Differentiable Physics Simulation | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of differentiable physics simulation: time integration Jacobians, smooth contact approximation, and policy gradient through rigid-body dynamics for sample-efficient robot learning.",
    },
  ],
};
