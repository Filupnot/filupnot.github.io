<script lang="ts">
  import "../lib/styles/global.css";
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  const isGamesPath = (pathname: string) => {
    return (
      pathname === "/games" ||
      pathname.startsWith("/games/") ||
      pathname === `${base}/games` ||
      pathname.startsWith(`${base}/games/`)
    );
  };
</script>

<svelte:head>
  <link rel="icon" href="{base}/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="{base}/icons/icon-32.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="{base}/icons/icon-16.png" sizes="16x16" type="image/png" />
  <link rel="apple-touch-icon" href="{base}/icons/apple-touch-icon.png" sizes="180x180" />
  {#if isGamesPath($page.url.pathname)}
    <link rel="manifest" href="{base}/manifest-games.json" />
  {:else}
    <link rel="manifest" href="{base}/manifest.json" />
  {/if}
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="Scorecards" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<main class="page">
  <header class="site-header">
    <nav class="nav">
      <a href="{base}/">Home</a>
      <a href="{base}/games">Games</a>
      <a href="{base}/about">About</a>
    </nav>
  </header>

  <section class="content">
    <slot />
  </section>

</main>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .site-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #ddd;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
  }

  .nav {
    display: flex;
    gap: 1rem;
  }

  @media (max-width: 720px) {
    .site-header {
      padding: 0.75rem 1rem;
    }

    .content {
      padding: 1.5rem 1rem;
    }
  }
</style>
