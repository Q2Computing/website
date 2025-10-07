import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container mx-auto p-8">
      <h1 class="text-4xl font-bold mb-6">Research and Analysis</h1>
      <p class="text-lg text-gray-600 mb-8">
        An exploration of impactful research papers in the field of robotic
        automation and autonomous systems.
      </p>

      <div class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
        <h2 class="text-2xl font-semibold mb-2">
          Teach-Repeat-Replan for Aggressive Drone Flight
        </h2>
        <p class="mb-4">
          A short summary of the robust system for aggressive flight
          in complex environments proposed by Fei Gao et al.
        </p>
        <Link
          href="/research/teach-repeat-replan/"
          class="text-blue-600 hover:underline font-semibold"
        >
          Read the Analysis →
        </Link>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Research in Robotic Automation",
  meta: [
    {
      name: "description",
      content: "A collection of analyses on key robotics research papers.",
    },
  ],
};