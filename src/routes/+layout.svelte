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
  data-page={
    isHomePath($page.url.pathname)
      ? "home"
      : isGamesIndexPath($page.url.pathname)
        ? "games"
        : $page.url.pathname.includes("/games/darts-cricket")
          ? "darts-cricket"
          : $page.url.pathname.includes("/games/dominoes")
            ? "dominoes"
            : $page.url.pathname.includes("/games/oh-hell")
              ? "oh-hell"
              : $page.url.pathname.includes("/games/8-ball-pool")
                ? "pool-league"
                : "default"
  }
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
  data-testid="theme-toggle"
>
  <span class="theme-icon" aria-hidden="true">
    {#if theme === "dark"}
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 4a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1zm6.66 2.34a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0zM20 11a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-2.4 6.8a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41zM12 18.5a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1zM5.34 17.8a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0zM4 11a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm2.4-6.8a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L6.4 5.61A1 1 0 0 1 6.4 4.2zM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5z"
        />
      </svg>
    {:else}
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.7 3.4a1 1 0 0 1 .2 1.98 7.5 7.5 0 1 0 7.72 10.92 1 1 0 0 1 1.69.96A9.5 9.5 0 1 1 12.7 3.4z"
        />
      </svg>
    {/if}
  </span>
</button>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--app-bg, radial-gradient(circle at top, #f8f4ff 0%, #f1f5f8 45%, #f7efe3 100%));
    color: var(--app-text, #1b1b1f);
    transition: background 0.2s ease, color 0.2s ease;
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
    width: 64px;
    height: 64px;
    padding: 0;
    font-size: 1.35rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 12px 24px rgba(17, 17, 23, 0.12);
    backdrop-filter: blur(8px);
  }

  .theme-icon {
    width: 36px;
    height: 36px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .theme-icon svg {
    width: 100%;
    height: 100%;
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
      width: 56px;
      height: 56px;
    }
  }
</style>
