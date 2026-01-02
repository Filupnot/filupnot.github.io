<script lang="ts">
  import { base } from "$app/paths";

  const cards = [
    {
      title: "Games",
      description: "Score trackers for different games.",
      href: "/games"
    }
  ];
</script>

<div class="home-stack">
  <section class="hero">
    <img
      class="avatar"
      src="{base}/philip-face.png"
      alt="Philip Knott"
      width="200"
      height="200"
    />
    <h2>Philip Knott</h2>
  </section>

  <section class="cards">
    {#each cards as card}
      <a class="card" href="{base}{card.href}">
        <div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
        <span class="card-arrow" aria-hidden="true">→</span>
      </a>
    {/each}
  </section>
</div>

<style>
  .home-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(520px, 100%);
    gap: 2rem;
  }

  .hero {
    display: grid;
    place-items: center;
    gap: 1.5rem;
    text-align: center;
  }

  .avatar {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 999px;
  }

  h2 {
    margin: 0;
  }

  .cards {
    display: grid;
    gap: 1rem;
    width: 100%;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.25rem 1.5rem;
    border-radius: 18px;
    border: 1px solid rgba(32, 27, 47, 0.12);
    background: #fff;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
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
</style>
