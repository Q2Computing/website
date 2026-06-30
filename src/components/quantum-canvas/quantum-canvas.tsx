import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const QuantumCanvas = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = 85;
    const LINE_DIST = 145;
    const REPULSE_RADIUS = 110;
    const REPULSE_STRENGTH = 28;
    const BASE_MAX_SPEED = 1.1;
    const GRAVITY_RAMP = 0.003;
    const GRAVITY_CAP = 7;
    const BURST_SCALE = 0.005;
    const BURST_CAP = 7;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const px: number[] = [];
    const py: number[] = [];
    const pvx: number[] = [];
    const pvy: number[] = [];

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.8;
      px.push(Math.random() * W);
      py.push(Math.random() * H);
      pvx.push(Math.cos(angle) * speed);
      pvy.push(Math.sin(angle) * speed);
    }

    let mouseX = -9999;
    let mouseY = -9999;
    let isDown = false;
    let downAt = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };

    const onDown = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      isDown = true;
      downAt = performance.now();
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      const held = performance.now() - downAt;
      const burst = Math.min(held * BURST_SCALE, BURST_CAP);
      for (let i = 0; i < COUNT; i++) {
        const dx = px[i] - mouseX;
        const dy = py[i] - mouseY;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        pvx[i] += (dx / d) * burst;
        pvy[i] += (dy / d) * burst;
      }
    };

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("resize", onResize);

    function tick(ts: number) {
      ctx!.fillStyle = "#080e1c";
      ctx!.fillRect(0, 0, W, H);

      const held = isDown ? ts - downAt : 0;
      const gravity = Math.min(held * GRAVITY_RAMP, GRAVITY_CAP) * 0.055;
      const maxSpeed = isDown ? BASE_MAX_SPEED * 3.5 : BASE_MAX_SPEED;

      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const d2 = dx * dx + dy * dy;
          if (d2 < REPULSE_RADIUS * REPULSE_RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = REPULSE_STRENGTH / d2;
            const fx = (dx / d) * f;
            const fy = (dy / d) * f;
            pvx[i] += fx; pvy[i] += fy;
            pvx[j] -= fx; pvy[j] -= fy;
          }
        }

        const mdx = px[i] - mouseX;
        const mdy = py[i] - mouseY;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 > 0.01) {
          const md = Math.sqrt(md2);
          if (isDown && gravity > 0) {
            pvx[i] -= (mdx / md) * gravity;
            pvy[i] -= (mdy / md) * gravity;
          } else if (md2 < REPULSE_RADIUS * REPULSE_RADIUS) {
            const f = (REPULSE_STRENGTH * 2) / md2;
            pvx[i] += (mdx / md) * f;
            pvy[i] += (mdy / md) * f;
          }
        }

        const speed = Math.sqrt(pvx[i] * pvx[i] + pvy[i] * pvy[i]);
        if (speed > maxSpeed) {
          pvx[i] = (pvx[i] / speed) * maxSpeed;
          pvy[i] = (pvy[i] / speed) * maxSpeed;
        }

        px[i] += pvx[i];
        py[i] += pvy[i];

        if (px[i] < 0)  { px[i] = 0;  pvx[i] = Math.abs(pvx[i]); }
        if (px[i] > W)  { px[i] = W;  pvx[i] = -Math.abs(pvx[i]); }
        if (py[i] < 0)  { py[i] = 0;  pvy[i] = Math.abs(pvy[i]); }
        if (py[i] > H)  { py[i] = H;  pvy[i] = -Math.abs(pvy[i]); }
      }

      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINE_DIST) {
            const alpha = ((1 - d / LINE_DIST) * 0.5).toFixed(3);
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(30,150,255,${alpha})`;
            ctx!.lineWidth = 0.7;
            ctx!.moveTo(px[i], py[i]);
            ctx!.lineTo(px[j], py[j]);
            ctx!.stroke();
          }
        }
      }

      for (let i = 0; i < COUNT; i++) {
        ctx!.beginPath();
        ctx!.arc(px[i], py[i], 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(70,200,255,0.88)";
        ctx!.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    cleanup(() => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", onResize);
    });
  });

  return (
    <canvas
      ref={canvasRef}
      style="position: absolute; inset: 0; width: 100%; height: 100%; display: block;"
    />
  );
});
