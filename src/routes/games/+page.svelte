<script lang="ts">
  import { base } from "$app/paths";

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

<style>
  :global(.site-header) {
    display: none;
  }

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
</style>
