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
        <h1>PyTorch: An Imperative Style, High-Performance Deep Learning Library</h1>
        <p class={styles.meta}>
          Paszke, A. et al.
          &nbsp;·&nbsp; NeurIPS (2019) &nbsp;·&nbsp;
          <a href="https://arxiv.org/abs/1912.01703" target="_blank" rel="noopener noreferrer">Paper</a>
        </p>
        <p class={styles.notice}>
          Q2 Computing analysis. All mathematical results and empirical findings are attributed to the original authors.
          We present our reading of the work as it relates to robotic automation.
        </p>
      </div>

      <div class={styles.body}>

        <h2>What this paper solves</h2>
        <p>
          Deep learning frameworks prior to PyTorch required defining the computation
          graph statically before execution (define-and-run). This made debugging
          difficult, dynamic architectures cumbersome, and rapid research iteration
          slow. PyTorch introduced define-by-run execution: the computation graph is
          constructed dynamically as operations execute, making the framework behave
          like standard imperative Python and enabling automatic differentiation through
          arbitrary control flow.
        </p>
        <p>
          PyTorch is the implementation substrate for every neural network in this
          archive. The differentiable physics training in Back to Newton's Laws (#1),
          the PPO training in Champion-Level Drone Racing (#11), and the gradient-based
          trajectory optimization in EGO-Planner (#3) and EGO-Swarm (#4) all depend
          on PyTorch's autograd system to propagate gradients through computation graphs
          that could not be expressed in a static graph framework.
        </p>

        <h2>Key mathematical framework</h2>

        <h3>Reverse-mode automatic differentiation</h3>
        <p>
          PyTorch implements reverse-mode automatic differentiation (backpropagation).
          Every tensor operation records itself in a directed acyclic graph of{" "}
          <Math tex="\texttt{Function}" /> nodes. Given a scalar loss{" "}
          <Math tex="\mathcal{L}" />, the gradient with respect to any parameter{" "}
          <Math tex="\theta" /> is computed by the chain rule traversed in reverse
          topological order through the graph:
        </p>
        <Math display tex="\frac{\partial \mathcal{L}}{\partial \theta} = \frac{\partial \mathcal{L}}{\partial y_n} \cdot \frac{\partial y_n}{\partial y_{n-1}} \cdots \frac{\partial y_1}{\partial \theta}" />
        <p>
          Each node stores only its local Jacobian-vector product function (the
          vector-Jacobian product, or VJP). The backward pass multiplies these
          products sequentially, accumulating gradients without materializing full
          Jacobian matrices. This is what makes backpropagation through millions
          of parameters computationally feasible.
        </p>

        <h3>Gradient accumulation and parameter update</h3>
        <p>
          Gradients are accumulated on the <Math tex="\texttt{.grad}" /> attribute
          of each leaf tensor (parameter). An optimizer then applies the update rule.
          For stochastic gradient descent:
        </p>
        <Math display tex="\theta \leftarrow \theta - \eta \cdot \nabla_\theta \mathcal{L}" />
        <p>
          For Adam, which maintains running estimates of first and second gradient moments:
        </p>
        <Math display tex="m_t = \beta_1 m_{t-1} + (1 - \beta_1)\nabla_\theta \mathcal{L}" />
        <Math display tex="v_t = \beta_2 v_{t-1} + (1 - \beta_2)(\nabla_\theta \mathcal{L})^2" />
        <Math display tex="\theta \leftarrow \theta - \eta \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}" />
        <p>
          where <Math tex="\hat{m}_t = m_t / (1-\beta_1^t)" /> and{" "}
          <Math tex="\hat{v}_t = v_t / (1-\beta_2^t)" /> are bias-corrected estimates.
          PyTorch's autograd computes <Math tex="\nabla_\theta \mathcal{L}" /> for
          any differentiable computation graph with a single call to{" "}
          <Math tex="\mathcal{L}\texttt{.backward()}" />.
        </p>

        <h3>Dynamic graph and differentiable physics</h3>
        <p>
          The define-by-run model is what makes differentiable physics simulation
          possible in PyTorch. In Back to Newton's Laws (#1), the training loop
          unrolls the physical simulation for <Math tex="N" /> timesteps, with each
          state transition implemented as a PyTorch operation:
        </p>
        <Math display tex="x_{k+1} = f_\text{physics}(x_k, \pi_\theta(o_k))" />
        <p>
          Because <Math tex="f_\text{physics}" /> is composed of differentiable
          PyTorch operations (matrix multiplies, elementwise arithmetic, exponentials),
          the gradient <Math tex="\partial \mathcal{L} / \partial \theta" /> flows
          directly through the physics without any additional implementation. A static
          graph framework would require declaring the entire unrolled trajectory before
          knowing how many timesteps to simulate.
        </p>

        <h2>Empirical results</h2>
        <ul>
          <li>
            <strong>Performance:</strong> Competitive with or exceeding TensorFlow on
            standard benchmarks while maintaining imperative execution semantics
          </li>
          <li>
            <strong>Adoption:</strong> Became the dominant framework in academic robotics
            and reinforcement learning research within two years of the NeurIPS 2019
            publication
          </li>
          <li>
            <strong>Ecosystem:</strong> TorchScript and TorchServe enable deployment
            of PyTorch models to production systems and embedded hardware without the
            Python runtime
          </li>
        </ul>

        <h2>What this means for robotic automation</h2>
        <p>
          PyTorch's contribution to this archive is as infrastructure rather than
          algorithm. Every training loop, every gradient computation, and every
          model deployment in the research cited here depends on the autograd engine
          described in this paper. The reason differentiable physics training is
          feasible at all is that PyTorch allows physics simulation to be expressed
          as ordinary tensor operations with automatic gradient tracking.
        </p>
        <p>
          For edge deployment, TorchScript's ability to compile a trained model to
          a static computation graph that runs without Python is what allows policies
          trained with dynamic graphs in simulation to execute on embedded hardware
          like the Jetson TX2 in Swift or the Mango Pi in Back to Newton's Laws.
          The training and deployment environments use the same model weights but
          different execution backends.
        </p>

      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analysis: PyTorch | Q2 Computing Research",
  meta: [
    {
      name: "description",
      content: "Q2 Computing analysis of PyTorch: reverse-mode automatic differentiation, dynamic computation graphs, and why define-by-run execution enables differentiable physics training for robotic policy learning.",
    },
  ],
};
