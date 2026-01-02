<script lang="ts">
  import "../lib/styles/global.css";
  import { base } from "$app/paths";

</script>

<svelte:head>
  <link rel="icon" href="{base}/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="{base}/darts-thumb.svg" />
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
