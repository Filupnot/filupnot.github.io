<script lang="ts">
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  const cards = [
    {
      title: "Game Score Tools",
      description: "Simple score tracking tools for games.",
      href: "/games"
    }
  ];

  type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
    baseVx: number;
    baseVy: number;
    phase: number;
    orbit: number;
  };

  let canvas: HTMLCanvasElement | null = null;

  onMount(() => {
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0, active: false };
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;

    const createNodes = (count: number) => {
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        baseVx: (Math.random() - 0.5) * 0.35,
        baseVy: (Math.random() - 0.5) * 0.35,
        phase: Math.random() * Math.PI * 2,
        orbit: 10 + Math.random() * 26
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.max(45, Math.round((width * height) / 24000)));
      createNodes(count);
      drawFrame(performance.now(), true);
    };

    const updatePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    const drawLines = (maxDistance: number) => {
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDistance) {
            continue;
          }
          const alpha = (1 - dist / maxDistance) * 0.2;
          ctx.strokeStyle = `rgba(60, 56, 76, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    };

    const drawDots = () => {
      ctx.fillStyle = "rgba(60, 56, 76, 0.45)";
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawFrame = (time: number, isStatic = false) => {
      ctx.clearRect(0, 0, width, height);

      const influenceRadius = 140;
      nodes.forEach((node) => {
        node.baseX += node.baseVx;
        node.baseY += node.baseVy;

        if (node.baseX < -40 || node.baseX > width + 40) {
          node.baseVx *= -1;
        }

        if (node.baseY < -40 || node.baseY > height + 40) {
          node.baseVy *= -1;
        }

        const driftX = Math.cos(time * 0.0003 + node.phase) * node.orbit;
        const driftY = Math.sin(time * 0.00028 + node.phase) * node.orbit;
        const targetX = node.baseX + driftX;
        const targetY = node.baseY + driftY;

        node.vx += (targetX - node.x) * 0.02;
        node.vy += (targetY - node.y) * 0.02;

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceRadius && dist > 0.001) {
            const force = (1 - dist / influenceRadius) * 0.8;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
      });

      drawLines(140);
      drawDots();

      if (!isStatic) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    resize();

    if (!prefersReducedMotion.matches) {
      rafId = window.requestAnimationFrame(drawFrame);
      window.addEventListener("pointermove", updatePointer, { passive: true });
      window.addEventListener("pointerdown", updatePointer, { passive: true });
      window.addEventListener("pointerleave", clearPointer, { passive: true });
      window.addEventListener("pointerout", clearPointer, { passive: true });
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
      window.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("pointerout", clearPointer);
      window.cancelAnimationFrame(rafId);
    };
  });
</script>

<canvas class="ambient-canvas" bind:this={canvas} aria-hidden="true"></canvas>

<svelte:head>
  <title>Home</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="home-stack">
  <section class="hero">
    <div class="portrait-wrap">
      <img
        class="avatar"
        src="{base}/philip-face.png"
        alt="Philip Knott"
        width="200"
        height="200"
      />
      <span class="orbit"></span>
    </div>
    <div class="hero-text">
      <p class="eyebrow">Hello, I am</p>
      <h2>Philip Knott</h2>
      <p class="subhead">Software developer. Owns a domain.</p>
    </div>
  </section>

  <section class="cards">
    {#each cards as card}
      <a class="card" href="{base}{card.href}">
        <div class="card-text">
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
        <span class="card-arrow" aria-hidden="true">→</span>
      </a>
    {/each}
  </section>

</div>

<footer class="site-footer">
  <a
    href="https://github.com/Filupnot/filupnot.github.io"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Repository for this website"
  >
    <svg
      class="github-icon"
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2C6.477 2 2 6.484 2 12.02c0 4.426 2.865 8.185 6.84 9.51.5.092.682-.217.682-.482 0-.238-.008-.868-.013-1.703-2.782.604-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.533 1.033 1.533 1.033.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.95 0-1.093.39-1.987 1.03-2.686-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.845c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.545 1.377.202 2.394.1 2.647.64.699 1.028 1.593 1.028 2.686 0 3.848-2.339 4.694-4.566 4.943.359.309.678.92.678 1.852 0 1.337-.012 2.417-.012 2.747 0 .268.18.58.688.481A10.022 10.022 0 0 0 22 12.02C22 6.484 17.523 2 12 2z"
      />
    </svg>
  </a>
</footer>

<style>
  :global(body) {
    background: radial-gradient(circle at top, #f2efe8 0%, #e5edf2 45%, #f7f4ee 100%);
  }

  .home-stack {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: min(820px, 100%);
    gap: 2.5rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
    margin-top: 1.5rem;
  }

  .ambient-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 240px) minmax(0, 1fr);
    gap: clamp(1.5rem, 3vw, 2.5rem);
    align-items: center;
    padding: 0.25rem 0;
  }

  .portrait-wrap {
    position: relative;
    width: min(220px, 100%);
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    display: grid;
    place-items: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 999px;
    border: 6px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 18px 40px rgba(32, 27, 47, 0.12);
  }

  .orbit {
    position: absolute;
    inset: -12px;
    border-radius: 999px;
    border: 1px dashed rgba(32, 27, 47, 0.18);
    opacity: 0.7;
    animation: orbit-spin 18s linear infinite;
  }

  .hero-text {
    display: grid;
    gap: 0.75rem;
  }

  h2 {
    margin: 0;
    font-family: "Source Serif 4", "Times New Roman", serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    color: #1f1b2e;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.7rem;
    font-weight: 600;
    color: #5e4b7a;
    margin: 0;
  }

  .subhead {
    margin: 0;
    font-size: clamp(1rem, 2vw, 1.15rem);
    color: #4b425c;
    line-height: 1.6;
  }

  .cards {
    display: grid;
    gap: 1rem;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.35rem 1.6rem;
    border-radius: 20px;
    border: 1px solid rgba(32, 27, 47, 0.1);
    background: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    color: inherit;
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 24px 40px rgba(0, 0, 0, 0.12);
  }

  .card h3 {
    margin: 0 0 0.35rem;
    font-size: 1.2rem;
  }

  .card p {
    margin: 0;
    color: #4b425c;
  }

  .card-arrow {
    font-size: 1.5rem;
  }

  .site-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 1.25rem;
    display: flex;
    justify-content: center;
    z-index: 2;
  }

  .site-footer a {
    font-weight: 600;
    text-decoration: none;
    font-size: 0.9rem;
    color: rgba(44, 36, 56, 0.7);
    padding: 0.25rem 0.35rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .site-footer a:hover {
    color: rgba(27, 21, 36, 0.95);
  }

  .github-icon {
    width: 1.15rem;
    height: 1.15rem;
  }

  @keyframes orbit-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 720px) {
    .hero {
      grid-template-columns: minmax(0, 1fr);
      text-align: center;
    }

    .hero-text {
      text-align: center;
    }
  }
</style>
