<script lang="ts">
  import { base } from "$app/paths";
</script>

<svelte:head>
  <title>Wall Art Planner</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<a class="back-link" href="{base}/">← philipknott.net</a>
<iframe class="planner-frame" src="{base}/wall-planner-app.html" title="Wall Art Planner"></iframe>

<style>
  /* This page is a full-bleed app: drop the layout's centering/padding and
     hide the site theme toggle (the planner carries its own visual theme). */
  :global(body[data-page="wall-planner"] main.page > .content) {
    padding: 0;
    align-items: stretch;
  }
  :global(body[data-page="wall-planner"] .theme-toggle) {
    display: none;
  }

  .planner-frame {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    border: 0;
    z-index: 1;
  }

  .back-link {
    position: fixed;
    top: 1rem;
    right: 1.25rem;
    z-index: 10;
    font-family: "Space Grotesk", system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-decoration: none;
    color: #f4efe6;
    background: rgba(28, 26, 23, 0.72);
    backdrop-filter: blur(6px);
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    transition: background 0.15s ease;
  }

  .back-link:hover {
    background: rgba(28, 26, 23, 0.92);
  }
</style>
