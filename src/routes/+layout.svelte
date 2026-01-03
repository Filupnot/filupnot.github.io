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
</style>
