import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <article class="container mx-auto p-8">
      <div class="max-w-4xl mx-auto">

        <header class="mb-8">
          <h1 class="text-4xl lg:text-5xl font-bold mb-4">
            From Pixels to Physics: Setting Up Your Differentiable Simulation Lab
          </h1>
          <p class="text-gray-500">
            Published on October 7, 2025 by Q2-Computing
          </p>
        </header>

        <div class="prose lg:prose-xl max-w-none">
          <p>
            Welcome to the first post in our series on building intelligent autonomous systems. The secret behind the next generation of robotics isn't just bigger datasets or faster chips—it's teaching machines the laws of physics. This is the core of <strong>differentiable physics</strong>, a paradigm that allows us to train AI in simulated worlds with unmatched speed and realism.
          </p>
          <p>
            Inspired by the work of <strong>Yuang Zhang et al.</strong> in their paper, <em>"Back to Newton's Laws: Learning Vision-based Agile Flight via Differentiable Physics,"</em> this series will document our journey in building a similar system. Their research demonstrates how this paradigm can train quadrotors to fly with lean, efficient neural networks, and we'll be exploring those concepts from the ground up. Today, we're starting with the foundation: setting up a robust, cross-platform development environment for <strong>macOS, Windows, and Linux</strong>.
          </p>

          <h2>The Core Tech Stack 🛠️</h2>
          <p>To build our simulator, we need a few key tools. Our stack is chosen for its power, flexibility, and strong community support.</p>
          <ul>
            <li><strong>Python:</strong> The undisputed language of AI and scientific computing. We'll use Python 3.10 or newer.</li>
            <li><strong>PyTorch:</strong> An open-source machine learning framework that excels at automatic differentiation—the mathematical engine that makes differentiable physics possible.</li>
            <li><strong>Taichi Lang:</strong> A high-performance, Python-embedded language for computer graphics and simulation. Its differentiable programming backend makes it a perfect choice for getting started without having to build a complex physics engine from scratch.</li>
          </ul>

          <h2>Installation and Setup Guide ⚙️</h2>
          <p>First, ensure you have <strong>Python 3.10+</strong> and <strong>Git</strong> installed on your system.</p>

          <h3>1. Windows Setup (via WSL)</h3>
          <p>The most robust way to develop on Windows is using the Windows Subsystem for Linux (WSL). This gives you a full Linux environment directly within Windows, avoiding common compatibility issues.</p>
          <pre><code>
            1. Install WSL: Open PowerShell as an Administrator and run:
            wsl --install
            <br />
            2. Install Ubuntu from the Microsoft Store.
            <br />
            3. Open your new Ubuntu terminal and proceed with the Linux instructions.
          </code></pre>

          <h3>2. macOS & Linux Setup</h3>
          <p>Create and activate a virtual environment to keep dependencies clean.</p>
          <pre><code>
            1. Create a virtual environment python3 -m venv venv
            <br />
            2. Activate it source venv/bin/activate
          </code></pre>
          
          <h3>3. Installing Python Libraries (All Platforms)</h3>
          <p>Inside your activated virtual environment, install the libraries. Visit the <a href="https://pytorch.org/get-started/locally/" target="_blank" rel="noopener noreferrer">official PyTorch website</a> to get the exact command for your system.</p>
          <pre><code>
            Example command for PyTorch with CPU: pip install torch torchvision torchaudio taichi
          </code></pre>

          <h2>Your First Simulation: A "Hello, World!" Example 🚀</h2>
          <p>Create a file named <code>fall.py</code> and add the following code. This script simulates a falling ball and uses differentiation to "learn" the correct initial velocity to hit a target.</p>
          <pre><code>
            import taichi as ti<br/>
<br/>
            ti.init(arch=ti.cpu, default_fp=ti.f64)<br/>
<br/>
            # --- Simulation Parameters ---<br/>
            gravity = 9.8<br/>
            target_x = 10.0<br/>
            initial_y = 50.0<br/>
<br/>
            # --- Differentiable Variables ---<br/>
            initial_vx = ti.field(dtype=float, shape=(), needs_grad=True)<br/>
            final_pos = ti.field(dtype=float, shape=2, needs_grad=True)<br/>
            initial_vx[None] = 5.0<br/>
<br/>
            @ti.kernel<br/>
            def simulate():<br/>
                pos = ti.Vector([0.0, initial_y])<br/>
                vel = ti.Vector([initial_vx[None], 0.0])<br/>
                for _ in range(100):<br/>
                    vel[1] -= gravity * 0.05<br/>
                    pos += vel * 0.05<br/>
                final_pos[0] = pos[0]<br/>
                final_pos[1] = pos[1]<br/>
<br/>
            # --- The Optimization Loop ---<br/>
            for i in range(10):<br/>
                with ti.Tape(loss=final_pos[0]):<br/>
                    simulate()<br/>
<br/>
                loss = (final_pos[0] - target_x)**2<br/>
                grad = initial_vx.grad[None]<br/>
<br/>
                print(f"Step &lcub;i&rcub;: Loss=&lcub;loss:.2f&rcub;, Vx=&lcub;initial_vx[None]:.2f&rcub;")<br/>
<br/>
                initial_vx[None] -= 0.001 * grad<br/>
          </code></pre>
          <p>Run the script (<code>python fall.py</code>) and you'll see the loss decrease with each step. This demonstrates the core power of this paradigm: we can get gradients <em>through</em> our simulation to optimize any parameter.</p>

          <h2>Conclusion & What's Next</h2>
          <p>You now have a fully functional, cross-platform environment for differentiable physics. In our next post, we'll build on this to simulate more complex systems, like the simple point-mass dynamics used by Yuang Zhang et al. to train agile quadrotors, taking our first real step toward creating truly intelligent, physics-informed agents.</p>
        </div>
      </div>
    </article>
  );
});

export const head: DocumentHead = {
  title: 'From Pixels to Physics: Setting Up Your Differentiable Simulation Lab',
  meta: [
    {
      name: 'description',
      content: 'A guide to setting up a cross-platform development environment for differentiable physics simulations.',
    },
  ],
};