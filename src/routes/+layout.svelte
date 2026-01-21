<script lang="ts">
  import "../lib/styles/global.css";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  const themeStorageKey = "site-theme";
  let theme: "light" | "dark" = "light";

  const applyTheme = (next: "light" | "dark") => {
    theme = next;
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.dataset.theme = next;
    document.body?.setAttribute("data-theme", next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // Ignore storage failures.
    }
  };

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  onMount(() => {
    const saved = (() => {
      try {
        return localStorage.getItem(themeStorageKey);
      } catch {
        return null;
      }
    })();
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved === "light" || saved === "dark" ? saved : prefersDark ? "dark" : "light";
    applyTheme(initial);
  });

  const isGamesPath = (pathname: string) => {
    return (
      pathname === "/games" ||
      pathname.startsWith("/games/") ||
      pathname === `${base}/games` ||
      pathname.startsWith(`${base}/games/`)
    );
  };

  const isGamesIndexPath = (pathname: string) => {
    return pathname === "/games" || pathname === `${base}/games`;
  };

  const isGamesSubpath = (pathname: string) => {
    return isGamesPath(pathname) && !isGamesIndexPath(pathname);
  };

  const isHomePath = (pathname: string) => {
    return pathname === "/" || pathname === base || pathname === `${base}/`;
  };
</script>

<svelte:head>
  <link rel="icon" href="{base}/knot.png" type="image/png" />
  <link rel="icon" href="{base}/icons/icon-32.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="{base}/icons/icon-16.png" sizes="16x16" type="image/png" />
  <link rel="apple-touch-icon" href="{base}/icons/apple-touch-icon.png" sizes="180x180" />
  {#if isGamesPath($page.url.pathname)}
    <link rel="manifest" href="{base}/games/manifest.json" />
  {:else}
    <link rel="manifest" href="{base}/manifest.json" />
  {/if}
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="Scorecards" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<main
  class="page"
  class:top-content={isGamesIndexPath($page.url.pathname)}
  class:center-content={isGamesSubpath($page.url.pathname)}
  class:top-centered-content={isHomePath($page.url.pathname)}
>
  <section class="content">
    <slot />
  </section>

</main>
<button
  class="theme-toggle"
  type="button"
  on:click={toggleTheme}
  aria-pressed={theme === "dark"}
  aria-label="Toggle dark mode"
  title="Toggle dark mode"
>
  <span class="theme-label">{theme === "dark" ? "Light" : "Dark"}</span>
</button>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
  }

  .top-content .content {
    align-items: flex-start;
    justify-content: center;
  }

  .top-centered-content .content {
    align-items: flex-start;
    justify-content: center;
  }

  .center-content .content {
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 720px) {
    .content {
      padding: 1.5rem 1rem;
    }
  }

  .theme-toggle {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 50;
    border: 1px solid rgba(27, 27, 31, 0.12);
    background: rgba(255, 255, 255, 0.85);
    color: #1b1b1f;
    border-radius: 999px;
    padding: 0.55rem 0.85rem;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 12px 24px rgba(17, 17, 23, 0.12);
    backdrop-filter: blur(8px);
  }

  .theme-toggle:focus-visible {
    outline: 2px solid rgba(27, 27, 31, 0.4);
    outline-offset: 2px;
  }

  :global(:root[data-theme="dark"]) .theme-toggle {
    border-color: rgba(240, 240, 255, 0.2);
    background: rgba(18, 20, 28, 0.85);
    color: #f2f2f7;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  }

  :global(:root[data-theme="dark"]) .theme-toggle:focus-visible {
    outline-color: rgba(242, 242, 247, 0.6);
  }

  @media (max-width: 720px) {
    .theme-toggle {
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 0.75rem;
    }
  }
</style>
