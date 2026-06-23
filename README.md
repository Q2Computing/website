# Q2-Computing: Engineering Repository

This repository hosts the software infrastructure for **Q2-Computing LLC**, where we integrate elite expertise across aerospace, AI, and full-stack engineering to deliver resilient, robust solutions for the real world.

## Tech Stack
* **Framework:** [Qwik](https://qwik.dev/) (Resumable web framework for instant-loading apps)
* **Meta-Framework:** [QwikCity](https://qwik.dev/docs/qwikcity/) (Directory-based routing, layouts, and data fetching)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Runtime/Deployment:** Optimized for **Netlify Edge Functions** for high-performance, low-latency delivery.

## Project Structure
Our directory structure is designed to support scalable, maintainable application logic:
* `src/routes/`: Directory-based routing. Includes `index.tsx` for core pages, `layout.tsx` for global structures, and `index.ts` for server-side endpoints.
* `src/components/`: Reusable, modular UI components.
* `public/`: Static assets and site infrastructure.

## Getting Started

### Development
To run the project in local development mode with Server-Side Rendering (SSR):
```bash
npm start
