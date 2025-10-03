/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Netlify Edge when building for production.
 *
 * Learn more about the Netlify integration here:
 * - https://qwik.dev/docs/deployments/netlify-edge/
 *
 */
import {
  createQwikCity,
  type PlatformNetlify,
} from "@builder.io/qwik-city/middleware/netlify-edge";
import qwikCityPlan from "@qwik-city-plan";
import render from "./entry.ssr";

declare global {
  /**
   * This empty interface is the standard way to extend Qwik's global platform types
   * for a specific adapter. We disable the ESLint rule for this line as it is
   * intentional and necessary for correct type inference.
  */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface QwikCityPlatform extends PlatformNetlify {}
}

export default createQwikCity({ render, qwikCityPlan });
