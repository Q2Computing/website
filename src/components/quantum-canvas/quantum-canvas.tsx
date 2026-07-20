import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

// Quantized visible spectrum for fusion products: orange → yellow → lime → cyan → blue → indigo → violet
// Level 0 is white (pure ground state). Level 1+ climbs the spectrum via fusion.
const SPECTRUM_HUES = [30, 55, 82, 165, 200, 255, 290];
const MAX_LEVEL = SPECTRUM_HUES.length; // levels 1–7; 0 = white

function particleColor(level: number, speed: number): string {
  if (level === 0) {
    const t = Math.min(speed / 1.5, 1);
    return `hsl(30,${(t * 10).toFixed(0)}%,${(90 + t * 7).toFixed(0)}%)`;
  }
  const hue = SPECTRUM_HUES[Math.min(level - 1, MAX_LEVEL - 1)];
  const t = Math.min(speed / 10, 1);
  const lightness = 55 + t * 38;
  const saturation = 100 - t * 28;
  return `hsl(${hue},${saturation.toFixed(0)}%,${lightness.toFixed(0)}%)`;
}

// Quantized mass: linear atomic number (H=1, He=2, Li=3, …)
function particleMass(level: number): number {
  return level + 1;
}

export const QuantumCanvas = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LINE_DIST      = 140;
    const K              = 600;     // Coulomb constant (canvas units)
    const EPS2           = 64;      // Plummer softening (eps = 8px)
    const BASE_MAX_SPEED = 10.0;
    const GRAVITY_RAMP   = 0.004;
    const GRAVITY_CAP    = 120;
    const BURST_SCALE    = 0.018;
    const BURST_CAP      = 30;
    const PHOTON_SPEED   = 420;

    const COLD_CAP       = 0.015;  // Phase 1 idle speed cap
    const WARM_THRESHOLD = 2000;   // ms hold before speed cap opens up
    const HOLD_THRESHOLD = 15000;  // ms of continuous hold required to enter Phase 2 (fusion)

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    type P = { x: number; y: number; vx: number; vy: number; level: number; mass: number };
    type Flash = { x: number; y: number; r: number; alpha: number };

    const particles: P[] = [];
    const flashes: Flash[] = [];

    for (let i = 0; i < 85; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.05 + Math.random() * 0.05;
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        level: 0,
        mass: 1,
      });
    }

    let mouseX = -9999, mouseY = -9999;
    let isDown = false, downAt = 0;
    let raf = 0;
    let singularity = false;
    let singularityFrames = 0;
    const SINGULARITY_TIMEOUT = 200;
    const trail: { x: number; y: number }[] = [];
    let wave: { ox: number; oy: number; r: number } | null = null;
    const WAVE_SPEED = 15;

    function bigBang(ox: number, oy: number) {
      singularity = false;
      singularityFrames = 0;
      trail.length = 0;
      particles.length = 0;
      wave = null;
      for (let i = 0; i < 6; i++) {
        flashes.push({ x: ox, y: oy, r: 8 + i * 18, alpha: 0.9 - i * 0.12 });
      }
      for (let i = 0; i < 85; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.05 + Math.random() * 0.05;
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          level: 0,
          mass: 1,
        });
      }
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };
    const onDown = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      if (particles.length === 0 && !wave) {
        bigBang(mouseX, mouseY);
        return;
      }
      isDown = true;
      downAt = performance.now();
    };
    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      const burst = Math.min((performance.now() - downAt) * BURST_SCALE, BURST_CAP);
      for (const p of particles) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        // Burst impulse scaled by 1/mass — heavier particles kicked less
        p.vx += (dx / d) * burst / Math.sqrt(p.mass);
        p.vy += (dy / d) * burst / Math.sqrt(p.mass);
      }
    };
    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const r = canvas.getBoundingClientRect();
      mouseX = t.clientX - r.left;
      mouseY = t.clientY - r.top;
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const r = canvas.getBoundingClientRect();
      mouseX = t.clientX - r.left;
      mouseY = t.clientY - r.top;
      if (particles.length === 0 && !wave) {
        bigBang(mouseX, mouseY);
        return;
      }
      isDown = true;
      downAt = performance.now();
    };
    const onTouchEnd = () => {
      if (!isDown) return;
      isDown = false;
      const burst = Math.min((performance.now() - downAt) * BURST_SCALE, BURST_CAP);
      for (const p of particles) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (dx / d) * burst / Math.sqrt(p.mass);
        p.vy += (dy / d) * burst / Math.sqrt(p.mass);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("resize", onResize);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    function tick(ts: number) {
      ctx!.fillStyle = "#080e1c";
      ctx!.fillRect(0, 0, W, H);

      const held = isDown ? ts - downAt : 0;
      const inExpPhase = isDown && held >= HOLD_THRESHOLD;
      const tExp = inExpPhase ? held - HOLD_THRESHOLD : 0;

      // Phase 1: constant speed cap (mass-scaled), no fusion, no energy injection
      // Phase 2: no speed cap, exponential energy injection, fusion enabled
      const energyInject = inExpPhase ? 0.02 * Math.exp(tExp / 7000) : 0;
      const collisionR   = inExpPhase ? 12 + 8 * Math.min(tExp / 12000, 1) : 0;
      const collisionD2  = collisionR * collisionR;

      const fissionBoost = held > 60000 ? 1 + (held - 60000) / 10000 : 1;
      const gravity = Math.min(held * GRAVITY_RAMP, GRAVITY_CAP) * 0.08 * fissionBoost;
      const n = particles.length;

      // ── Forces ────────────────────────────────────────────
      for (let i = 0; i < n; i++) {
        const p = particles[i];

        // Particle–particle Coulomb: charge = mass, inertia = mass
        for (let j = i + 1; j < n; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const softD2 = dx * dx + dy * dy + EPS2;
          const d = Math.sqrt(softD2);
          // Force magnitude: K * qi * qj / r^2  (charge = mass)
          const fMag = (K * p.mass * q.mass) / (softD2 * d);
          // Acceleration = F / own_mass
          p.vx += (dx * fMag) / p.mass;
          p.vy += (dy * fMag) / p.mass;
          q.vx -= (dx * fMag) / q.mass;
          q.vy -= (dy * fMag) / q.mass;
        }

        // Mouse: gravity when held (mass-independent), repulsion when idle (mass-scaled)
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 > 0.01) {
          const md = Math.sqrt(md2);
          if (isDown && gravity > 0) {
            // Gravitational attraction: mass-independent (equivalence principle)
            p.vx -= (mdx / md) * gravity;
            p.vy -= (mdy / md) * gravity;
          } else {
            const smd2 = md2 + EPS2;
            const smd = Math.sqrt(smd2);
            // Mouse charge fixed at 2; particle charge = mass; accel = F / p.mass
            const fMag = (K * 2 * p.mass) / (smd2 * smd);
            p.vx += (mdx * fMag) / p.mass;  // simplifies: K*2/(smd2*smd) — mass-independent
            p.vy += (mdy * fMag) / p.mass;
          }
        }

        // Thermal injection: divided by √mass (equipartition — heavier = harder to excite)
        if (energyInject > 0) {
          const sqrtM = Math.sqrt(p.mass);
          p.vx += (Math.random() - 0.5) * energyInject / sqrtM;
          p.vy += (Math.random() - 0.5) * energyInject / sqrtM;
        }

        // Speed cap: logarithmic ramp from COLD_CAP → BASE_MAX_SPEED over WARM_THRESHOLD
        if (!inExpPhase) {
          const warmT = isDown ? Math.min(held / WARM_THRESHOLD, 1) : 0;
          const activeCap = COLD_CAP + (BASE_MAX_SPEED - COLD_CAP) * Math.log(1 + warmT * (Math.E - 1));
          const cap = activeCap / Math.sqrt(p.mass);
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > cap) {
            p.vx = (p.vx / spd) * cap;
            p.vy = (p.vy / spd) * cap;
          }
        }

        p.x += p.vx; p.y += p.vy;

        if (!singularity) {
          if (p.x < 0)  { p.x = 0;  p.vx =  Math.abs(p.vx); }
          if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); }
          if (p.y < 0)  { p.y = 0;  p.vy =  Math.abs(p.vy); }
          if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); }
        }
      }

      // ── Fusion (Phase 2 only: collisionD2 is 0 in Phase 1) ──────────────
      if (collisionD2 > 0) {
        const dead = new Set<number>();
        const born: P[] = [];
        const np2 = particles.length;

        for (let i = 0; i < np2; i++) {
          if (dead.has(i)) continue;
          for (let j = i + 1; j < np2; j++) {
            if (dead.has(j)) continue;
            const pi = particles[i], pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            if (dx * dx + dy * dy < collisionD2) {
              dead.add(i);
              dead.add(j);
              const mi = pi.mass, mj = pj.mass, mt = mi + mj;
              const mx = (mi * pi.x + mj * pj.x) / mt;
              const my = (mi * pi.y + mj * pj.y) / mt;
              // Mass adds directly: H+He→Li, He+He→Be. Level = combined mass - 1
              const newLevel = Math.min(mt - 1, MAX_LEVEL);
              born.push({
                x: mx, y: my,
                vx: (mi * pi.vx + mj * pj.vx) / mt,
                vy: (mi * pi.vy + mj * pj.vy) / mt,
                level: newLevel,
                mass: particleMass(newLevel),
              });
              flashes.push({ x: mx, y: my, r: 6 + newLevel * 2, alpha: 1.0 });
              break;
            }
          }
        }

        [...dead].sort((a, b) => b - a).forEach(i => particles.splice(i, 1));
        born.forEach(p => particles.push(p));
      }

      // ── Singularity (Phase 3 gate) ────────────────────────
      if (particles.length === 1) {
        const p = particles[0];
        if (!inExpPhase) {
          // Hold released — abort singularity, lone particle returns to Phase 1
          if (singularity) {
            singularity = false;
            singularityFrames = 0;
            trail.length = 0;
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
            const cap = COLD_CAP / Math.sqrt(p.mass);
            p.vx = (p.vx / spd) * cap;
            p.vy = (p.vy / spd) * cap;
          }
        } else {
          if (!singularity) {
            singularity = true;
            singularityFrames = 0;
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
            p.vx = (p.vx / spd) * 4;
            p.vy = (p.vy / spd) * 4;
          }
          p.vx *= 1.035;
          p.vy *= 1.035;
          singularityFrames++;
          trail.push({ x: p.x, y: p.y });
          if (trail.length > 30) trail.shift();

          const exited = p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60;
          const timedOut = singularityFrames > SINGULARITY_TIMEOUT;
          if (exited || timedOut) {
            if (exited) wave = { ox: p.x, oy: p.y, r: 0 }; // Phase 3 supernova
            particles.length = 0;
            singularity = false;
            singularityFrames = 0;
            trail.length = 0;
          }
        }
      } else {
        singularity = false;
        trail.length = 0;
      }

      // ── Wave physics ──────────────────────────────────────
      if (wave) {
        wave.r += WAVE_SPEED;

        for (let i = particles.length - 1; i >= 0; i--) {
          const dx = particles[i].x - wave.ox;
          const dy = particles[i].y - wave.oy;
          if (dx * dx + dy * dy <= wave.r * wave.r) {
            flashes.push({ x: particles[i].x, y: particles[i].y, r: 3, alpha: 0.6 });
            particles.splice(i, 1);
          }
        }

        const maxR = Math.sqrt(W * W + H * H);
        if (wave.r > maxR + WAVE_SPEED) {
          const cols = Math.round(Math.sqrt(85 * W / H));
          const cellW = W / cols;
          const rows = Math.ceil(85 / cols);
          const cellH = H / rows;
          for (let i = 0; i < 85; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            particles.push({
              x: cellW * col + cellW * (0.15 + Math.random() * 0.7),
              y: cellH * row + cellH * (0.15 + Math.random() * 0.7),
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              level: 0,
              mass: 1,
            });
          }
          wave = null;
          singularity = false;
          singularityFrames = 0;
          trail.length = 0;
        }
      }

      // ── Draw flashes ──────────────────────────────────────
      for (let i = flashes.length - 1; i >= 0; i--) {
        const fl = flashes[i];
        const g = ctx!.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, fl.r);
        g.addColorStop(0, `rgba(255,255,255,${fl.alpha.toFixed(2)})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.beginPath();
        ctx!.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();
        fl.r += 4;
        fl.alpha -= 0.055;
        if (fl.alpha <= 0) flashes.splice(i, 1);
      }

      // ── Draw lines ────────────────────────────────────────
      const np = particles.length;
      for (let i = 0; i < np; i++) {
        for (let j = i + 1; j < np; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINE_DIST) {
            const alpha = ((1 - d / LINE_DIST) * 0.45).toFixed(3);
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(30,150,255,${alpha})`;
            ctx!.lineWidth = 0.7;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // ── Draw particles ────────────────────────────────────
      for (const p of particles) {
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const radius = 2.5 + p.level * 0.6;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = particleColor(p.level, spd);
        ctx!.fill();
      }

      // ── Draw wave ring ────────────────────────────────────
      if (wave) {
        const r = wave.r;
        ctx!.beginPath();
        ctx!.arc(wave.ox, wave.oy, r, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(140,210,255,0.18)";
        ctx!.lineWidth = 80;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(wave.ox, wave.oy, r, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(200,235,255,0.45)";
        ctx!.lineWidth = 36;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(wave.ox, wave.oy, r, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(255,255,255,0.92)";
        ctx!.lineWidth = 10;
        ctx!.stroke();
      }

      // ── Draw singularity trail ────────────────────────────
      if (singularity && trail.length > 1) {
        ctx!.beginPath();
        ctx!.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx!.lineTo(trail[i].x, trail[i].y);
        }
        ctx!.strokeStyle = "rgba(255,220,80,0.5)";
        ctx!.lineWidth = 2;
        ctx!.stroke();
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    // ── Remove unused var warning ─────────────────────────
    void PHOTON_SPEED;

    cleanup(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    });
  });

  return (
    <canvas
      ref={canvasRef}
      style="position: absolute; inset: 0; width: 100%; height: 100%; display: block;"
    />
  );
});
