<script lang="ts">
  import { base } from "$app/paths";

  const rosterSize = 4;
  const maxNameLength = 18;

  const makeDefaultRoster = (label: string) =>
    Array.from({ length: rosterSize }, (_, index) => `${label} ${index + 1}`);

  let homeInputs = makeDefaultRoster("Home");
  let awayInputs = makeDefaultRoster("Away");

  let confirmed = false;
  let confirmedHome = [...homeInputs];
  let confirmedAway = [...awayInputs];

  const sanitizeName = (value: string, fallback: string) => {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    return trimmed.slice(0, maxNameLength);
  };

  const rotateLeft = (values: string[], steps: number) => {
    const offset = ((steps % values.length) + values.length) % values.length;
    return values.map((_, index) => values[(index + offset) % values.length]);
  };

  const buildRounds = (home: string[], away: string[]) =>
    Array.from({ length: rosterSize }, (_, roundIndex) => {
      const awayOrder = rotateLeft(away, roundIndex);
      return {
        round: roundIndex + 1,
        awayOrder,
        matches: home.map((homePlayer, matchIndex) => ({
          home: homePlayer,
          away: awayOrder[matchIndex],
          table: matchIndex + 1
        }))
      };
    });

  const confirmTeams = () => {
    confirmedHome = homeInputs.map((name, index) =>
      sanitizeName(name, `Home ${index + 1}`)
    );
    confirmedAway = awayInputs.map((name, index) =>
      sanitizeName(name, `Away ${index + 1}`)
    );
    confirmed = true;
  };

  const editTeams = () => {
    confirmed = false;
  };

  $: rounds = confirmed ? buildRounds(confirmedHome, confirmedAway) : [];
  $: matchupCount = rounds.reduce((total, round) => total + round.matches.length, 0);
</script>

<svelte:head>
  <title>Pool League</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Sora:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="pool-page">
  <a class="breadcrumb" href="{base}/games">← Game Score Tools</a>

  {#if confirmed}
    <section class="schedule">
      <div class="schedule-head">
        <div>
          <p class="card-label">Matchups</p>
          <h2>Four rounds.</h2>
        </div>
        <button class="ghost" type="button" on:click={editTeams}>
          Edit teams
        </button>
      </div>

      <div class="round-grid">
        {#each rounds as round}
          <article class="round-card" style="--delay: {round.round}">
            <header>
              <span class="round-chip">Round {round.round}</span>
              <span class="round-away">
                Away order: {round.awayOrder.join(" -> ")}
              </span>
            </header>
            <ul>
              {#each round.matches as match}
                <li>
                  <span class="table">Table {match.table}</span>
                  <span class="names">
                    <strong>{match.home}</strong>
                    <span class="versus">vs</span>
                    <strong>{match.away}</strong>
                  </span>
                </li>
              {/each}
            </ul>
          </article>
        {/each}
      </div>
    </section>
  {:else}
    <header class="hero">
      <p class="eyebrow">Pool league</p>
      <h1>Round-robin matchups.</h1>
    </header>

    <div class="pool-card">
      <div class="card-top">
        <div>
          <p class="card-label">Lineup</p>
          <h2>Set the teams.</h2>
        </div>
        <span class="chip">{matchupCount || rosterSize * rosterSize} total games</span>
      </div>

      <form class="rosters" on:submit|preventDefault={confirmTeams}>
        <div class="roster-block">
          <div class="roster-head">
            <h3>Home team</h3>
            <span class="roster-pill">Stays in order</span>
          </div>
          <div class="roster-grid">
            {#each homeInputs as name, index}
              <label class="name-field">
                <span>Home {index + 1}</span>
                <input
                  bind:value={homeInputs[index]}
                  placeholder="Home {index + 1}"
                  maxlength={maxNameLength}
                  autocomplete="off"
                />
              </label>
            {/each}
          </div>
        </div>

        <div class="roster-block">
          <div class="roster-head">
            <h3>Away team</h3>
            <span class="roster-pill shift-pill">Shifts each round</span>
          </div>
          <div class="roster-grid">
            {#each awayInputs as name, index}
              <label class="name-field">
                <span>Away {index + 1}</span>
                <input
                  bind:value={awayInputs[index]}
                  placeholder="Away {index + 1}"
                  maxlength={maxNameLength}
                  autocomplete="off"
                />
              </label>
            {/each}
          </div>
        </div>

        <button class="confirm" type="submit">Confirm teams</button>
      </form>
    </div>
  {/if}
</section>

<style>
  :global(main[data-page="pool-league"]) {
    --app-bg: #f3f1ea;
    --app-text: #1b1b1f;
    --app-muted: #434855;
    --app-accent: #2f5f68;
    --app-card-bg: #ffffff;
    --app-card-border: rgba(22, 26, 35, 0.08);
    --app-card-shadow: 0 30px 60px rgba(30, 33, 43, 0.12);
    --app-panel-bg: #f7f4ef;
    --app-chip-bg: #14353d;
    --app-chip-text: #fef8ee;
    --app-ghost-border: rgba(27, 27, 31, 0.3);
  }

  :global(:root[data-theme="dark"] main[data-page="pool-league"]) {
    --app-bg: #12161c;
    --app-text: #f0f1f4;
    --app-muted: #b3b6c2;
    --app-accent: #9fd6df;
    --app-card-bg: #1c222c;
    --app-card-border: rgba(240, 241, 244, 0.12);
    --app-card-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
    --app-panel-bg: #202633;
    --app-chip-bg: #9fd6df;
    --app-chip-text: #0f141a;
    --app-ghost-border: rgba(240, 241, 244, 0.3);
  }

  :global(body) {
    margin: 0;
    overflow: auto;
  }

  :global(.site-header) {
    display: none;
  }

  .pool-page {
    width: min(1200px, 100%);
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    font-family: "Sora", system-ui, sans-serif;
    color: var(--app-text);
    position: relative;
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

  .hero {
    display: grid;
    gap: 1rem;
    animation: fadeIn 0.6s ease both;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--app-accent);
  }

  .hero h1 {
    font-family: "Playfair Display", "Times New Roman", serif;
    font-size: clamp(2.4rem, 4vw, 3.4rem);
    margin: 0;
  }

  .pool-card {
    background: var(--app-card-bg);
    border-radius: 28px;
    padding: clamp(1.5rem, 2.5vw, 2.5rem);
    border: 1px solid var(--app-card-border);
    box-shadow: var(--app-card-shadow);
    position: relative;
    overflow: hidden;
    animation: floatIn 0.7s ease both;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .card-label {
    text-transform: uppercase;
    letter-spacing: 0.22em;
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--app-muted);
  }

  .card-top h2 {
    margin: 0.35rem 0 0;
    font-family: "Playfair Display", "Times New Roman", serif;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
  }

  .chip {
    background: var(--app-chip-bg);
    color: var(--app-chip-text);
    padding: 0.5rem 0.9rem;
    border-radius: 999px;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
  }

  .rosters {
    margin-top: 2rem;
    display: grid;
    gap: 2rem;
  }

  .roster-block {
    background: var(--app-panel-bg);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid var(--app-card-border);
  }

  .roster-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .roster-head h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  .roster-pill {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 600;
    color: var(--app-accent);
  }

  .shift-pill {
    color: #8a5b1d;
  }

  :global(:root[data-theme="dark"] main[data-page="pool-league"]) .shift-pill {
    color: #e0b46d;
  }

  .roster-grid {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .name-field {
    display: grid;
    gap: 0.45rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--app-muted);
  }

  .name-field input {
    font-family: "Sora", system-ui, sans-serif;
    padding: 0.75rem 0.85rem;
    border-radius: 14px;
    border: 1px solid rgba(22, 26, 35, 0.15);
    background: var(--app-card-bg);
    font-size: 0.95rem;
    color: var(--app-text);
    transition: border 0.2s ease, box-shadow 0.2s ease;
  }

  .name-field input:focus {
    outline: none;
    border-color: #2a91a0;
    box-shadow: 0 0 0 3px rgba(42, 145, 160, 0.2);
  }

  .confirm {
    justify-self: flex-start;
    background: #2a91a0;
    color: #fef8ee;
    border: none;
    border-radius: 999px;
    padding: 0.85rem 1.5rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .confirm:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(42, 145, 160, 0.25);
  }

  .schedule {
    background: var(--app-card-bg);
    color: var(--app-text);
    border-radius: 28px;
    padding: clamp(1.5rem, 2.5vw, 2.5rem);
    border: 1px solid var(--app-card-border);
    box-shadow: var(--app-card-shadow);
    animation: riseIn 0.7s ease both;
  }

  .schedule-head {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .schedule-head h2 {
    margin: 0.35rem 0 0;
    font-family: "Playfair Display", "Times New Roman", serif;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
  }

  .ghost {
    background: transparent;
    color: var(--app-text);
    border: 1px solid var(--app-ghost-border);
    border-radius: 999px;
    padding: 0.75rem 1.4rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
  }

  .ghost:hover {
    border-color: var(--app-text);
  }

  .round-grid {
    margin-top: 2rem;
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  }

  .round-card {
    background: var(--app-panel-bg);
    border-radius: 20px;
    padding: 1.25rem;
    border: 1px solid var(--app-card-border);
    animation: staggerIn 0.6s ease both;
    animation-delay: calc(var(--delay) * 0.08s);
  }

  .round-card header {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .round-chip {
    display: inline-flex;
    align-items: center;
    background: rgba(42, 145, 160, 0.18);
    color: var(--app-accent);
    padding: 0.4rem 0.7rem;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.6rem;
    font-weight: 600;
    width: fit-content;
  }

  .round-away {
    font-size: 0.85rem;
    color: var(--app-muted);
  }

  .round-card ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.75rem;
  }

  .round-card li {
    background: var(--app-card-bg);
    border-radius: 14px;
    padding: 0.8rem 0.9rem;
    display: grid;
    gap: 0.5rem;
  }

  .table {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.6rem;
    color: var(--app-muted);
  }

  .names {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    font-size: 0.95rem;
  }

  .names strong {
    font-weight: 600;
  }

  .versus {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--app-muted);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes floatIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes riseIn {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes staggerIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 720px) {
    .pool-page {
      gap: 2rem;
    }

    .card-top {
      flex-direction: column;
      align-items: flex-start;
    }

    .schedule-head {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero,
    .pool-card,
    .schedule,
    .round-card {
      animation: none;
    }
  }
</style>
