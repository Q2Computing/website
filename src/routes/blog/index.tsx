import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="container mx-auto p-8">
      <h1 class="text-4xl font-bold mb-6 border-b pb-4">The Q2-Computing Blog</h1>
      <p class="text-lg text-gray-600 mb-8">
        Exploring the intersection of physics, AI, and autonomous systems.
      </p>

      <div class="py-6">
        <p class="text-sm text-gray-500">October 7, 2025</p>
        <h2 class="text-3xl font-semibold my-2">From Pixels to Physics: Setting Up Your Differentiable Simulation Lab</h2>
        <p class="text-gray-700 mb-4">
          This is the first step in our journey to build and explore differentiable physics simulations. In this post, we cover the foundational setup for macOS, Windows, and Linux.
        </p>
        <Link
          href="/blog/differentiable-physics-setup/"
          class="font-bold text-blue-600 hover:underline"
        >
          Read More →
        </Link>
      </div>

      {/* Add more blog post entries here as you write them */}

    </div>
  );
});

export const head: DocumentHead = {
  title: 'The Q2-Computing Blog',
  meta: [
    {
      name: 'description',
      content: 'Exploring the intersection of physics, AI, and autonomous systems.',
    },
  ],
};