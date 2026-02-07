<script lang="ts">
  import { base } from "$app/paths";

  const tools = [
    {
      title: "Glass Weight Calculator",
      path: "/ren/glass-weight-calculator",
      description: "Calculate glass weight from dimensions"
    }
  ];
</script>

<svelte:head>
  <title>Ren's Tools</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="ren-page">
  <a class="breadcrumb" href="{base}/">← Home</a>
  <header class="page-hero">
    <p class="eyebrow">Ren's Tools</p>
    <h1>Glass Stuff.</h1>
    <p class="subhead">Tools for the glass industry.</p>
  </header>

  <div class="tools-grid">
    {#each tools as tool}
      <a class="tool-card" href="{base}{tool.path}">
        <div class="card-body">
          <div class="icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="8" y1="10" x2="16" y2="10" />
              <line x1="8" y1="14" x2="12" y2="14" />
              <line x1="8" y1="18" x2="10" y2="18" />
            </svg>
          </div>
          <div class="card-text">
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
          </div>
        </div>
        <span class="card-arrow" aria-hidden="true">→</span>
      </a>
    {/each}
  </div>
</section>

<style>
  :global(main[data-page="ren"]) {
    --app-bg: radial-gradient(circle at top, #e8f4f8 0%, #f1f5f8 45%, #e3eff7 100%);
    --app-text: #1b2530;
    --app-muted: #425c6b;
    --app-accent: #2e6b8a;
    --app-card-bg: #ffffff;
    --app-card-border: rgba(27, 37, 48, 0.08);
    --app-card-shadow: 0 20px 45px rgba(27, 37, 48, 0.08);
    --app-card-hover-shadow: 0 28px 50px rgba(27, 37, 48, 0.12);
    --app-icon-bg: #e0f0f8;
  }

  :global(:root[data-theme="dark"] main[data-page="ren"]) {
    --app-bg: radial-gradient(circle at top, #0c1418 0%, #121a20 45%, #0f1820 100%);
    --app-text: #e8f0f5;
    --app-muted: #9eb4c4;
    --app-accent: #7ec8e8;
    --app-card-bg: #151d24;
    --app-card-border: rgba(232, 240, 245, 0.12);
    --app-card-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
    --app-card-hover-shadow: 0 28px 50px rgba(0, 0, 0, 0.45);
    --app-icon-bg: #1a2830;
  }

  .ren-page {
    width: min(1100px, 100%);
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
    color: var(--app-text);
  }

  .breadcrumb {
    text-decoration: none;
    color: var(--app-muted);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .breadcrumb:hover {
    color: var(--app-text);
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
    color: var(--app-accent);
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
    color: var(--app-muted);
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .tool-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 24px;
    background: var(--app-card-bg);
    border: 1px solid var(--app-card-border);
    box-shadow: var(--app-card-shadow);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .tool-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--app-card-hover-shadow);
  }

  .card-body {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: var(--app-icon-bg);
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    color: var(--app-accent);
  }

  .icon-wrap svg {
    width: 28px;
    height: 28px;
  }

  .card-text h2 {
    margin: 0 0 0.25rem;
    font-size: 1.25rem;
  }

  .card-text p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--app-muted);
  }

  .card-arrow {
    font-size: 1.5rem;
    color: var(--app-muted);
  }

  @media (max-width: 720px) {
    .ren-page {
      gap: 2rem;
    }

    .tool-card {
      padding: 1.25rem;
    }
  }
</style>
