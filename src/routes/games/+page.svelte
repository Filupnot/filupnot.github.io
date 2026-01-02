<script lang="ts">
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  const storageKey = "ios-a2hs-dismissed-at";
  const dismissMs = 30 * 24 * 60 * 60 * 1000;
  let showBanner = false;

  const isStandalone = () => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true
    );
  };

  const isIosSafari = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    const vendor = navigator.vendor || "";
    const isIos =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && /Apple/.test(vendor);
    const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    const isInApp = /FBAN|FBAV|Instagram|Line|Twitter|GSA/.test(ua);

    return isIos && isSafari && !isOtherBrowser && !isInApp;
  };

  const hasDesktopTestOverride = () => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("a2hs");
  };

  const recentlyDismissed = () => {
    try {
      const value = localStorage.getItem(storageKey);
      if (!value) return false;
      const dismissedAt = Number(value);
      if (!Number.isFinite(dismissedAt)) return false;
      return Date.now() - dismissedAt < dismissMs;
    } catch {
      return false;
    }
  };

  const markDismissed = () => {
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch {
      // Ignore storage failures.
    }
  };

  const dismissBanner = () => {
    showBanner = false;
    markDismissed();
  };

  onMount(() => {
    const allowDesktopTest = hasDesktopTestOverride();
    if (
      (!isIosSafari() && !allowDesktopTest) ||
      isStandalone() ||
      recentlyDismissed()
    ) {
      return;
    }

    let timerId: number | undefined;

    const handleInteraction = () => {
      showBanner = true;
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      if (timerId) window.clearTimeout(timerId);
    };

    window.addEventListener("pointerdown", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, {
      once: true,
      passive: true
    });
    window.addEventListener("keydown", handleInteraction, { once: true });

    timerId = window.setTimeout(() => {
      showBanner = true;
      cleanup();
    }, 2000);

    return () => {
      cleanup();
    };
  });

  const games = [
    {
      title: "Darts (Cricket)",
      path: "/games/darts-cricket",
      thumbnail: "/darts-thumb.png"
    },
    {
      title: "Dominoes",
      path: "/games/dominoes",
      thumbnail: "/dominoes-thumb.svg"
    }
  ];
</script>

<svelte:head>
  <title>Games</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="games-page">
  <a class="breadcrumb" href="{base}/">← Home</a>
  <header class="page-hero">
    <p class="eyebrow">Games</p>
    <h1>Score trackers.</h1>
    <p class="subhead">Tap a tile to start tracking.</p>
  </header>

  <div class="games-grid">
    {#each games as game}
      <a class="game-card" href="{base}{game.path}">
        <div class="card-body">
          <div class="thumb-wrap">
            <img class="thumb" src="{base}{game.thumbnail}" alt="" />
          </div>
          <h2>{game.title}</h2>
        </div>
      </a>
    {/each}
  </div>
</section>

{#if showBanner}
  <aside
    class="a2hs-banner"
    role="region"
    aria-label="Add to Home Screen instructions"
  >
    <div class="a2hs-text">
      <strong>Add to Home Screen</strong>
      <ol>
        <li>Tap Share (square with up arrow).</li>
        <li>Tap “Add to Home Screen”.</li>
        <li>Tap Add.</li>
      </ol>
    </div>
    <button
      class="a2hs-dismiss"
      type="button"
      on:click={dismissBanner}
      aria-label="Dismiss Add to Home Screen instructions"
    >
      Close
    </button>
  </aside>
{/if}

<style>
  :global(body) {
    background: radial-gradient(circle at top, #f8f4ff 0%, #f1f5f8 45%, #f7efe3 100%);
  }

  .games-page {
    width: min(1100px, 100%);
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
    color: #201b2f;
  }

  .breadcrumb {
    text-decoration: none;
    color: #4b425c;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .breadcrumb:hover {
    color: #2c2438;
  }

  .page-hero {
    display: grid;
    gap: 0.75rem;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    font-weight: 600;
    color: #5e4b7a;
    margin: 0;
  }

  h1 {
    font-family: "Source Serif 4", "Times New Roman", serif;
    font-size: clamp(2rem, 3vw, 3rem);
    margin: 0;
  }

  .subhead {
    max-width: 44rem;
    margin: 0;
    font-size: 1.05rem;
    color: #4b425c;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .game-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 24px;
    background: #fffaf3;
    border: 1px solid rgba(32, 27, 47, 0.08);
    box-shadow: 0 20px 45px rgba(32, 27, 47, 0.08);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card-body {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .game-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 28px 50px rgba(32, 27, 47, 0.12);
  }

  .card-body h2 {
    margin: 0;
    font-size: 1.35rem;
  }

  .thumb-wrap {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: #f6efe6;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
  }

  .thumb {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 720px) {
    .games-page {
      gap: 2rem;
    }

    .game-card {
      padding: 1.25rem;
    }
  }

  .a2hs-banner {
    position: fixed;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    background: #111;
    color: #fff;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  .a2hs-text strong {
    display: block;
    margin-bottom: 0.35rem;
  }

  .a2hs-text ol {
    margin: 0;
    padding-left: 1.2rem;
    font-size: 0.95rem;
  }

  .a2hs-dismiss {
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: transparent;
    color: inherit;
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
  }

  .a2hs-dismiss:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    .a2hs-banner {
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.75rem;
      grid-template-columns: 1fr;
      justify-items: start;
    }

    .a2hs-dismiss {
      justify-self: end;
    }
  }
</style>
