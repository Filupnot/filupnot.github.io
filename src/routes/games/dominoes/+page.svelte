<script lang="ts">
  import { base } from "$app/paths";
  import { fly } from "svelte/transition";

  const teamNames = ["HOME", "AWAY"];

  let scores = [0, 0];
  let lastDelta = [1, 1];
  let confirmReset = false;
  const lastPointerAt = teamNames.map(() => [0, 0]);

  const nudgeScore = (teamIndex: number, delta: number) => {
    lastDelta = lastDelta.map((value, index) => (index === teamIndex ? delta : value));
    scores = scores.map((value, index) => (index === teamIndex ? value + delta : value));
  };

  const resetScores = () => {
    scores = [0, 0];
    lastDelta = [1, 1];
    confirmReset = false;
  };

  const handleReset = () => {
    if (!confirmReset) {
      confirmReset = true;
      return;
    }

    resetScores();
  };

  const handlePointerDown = (teamIndex: number, delta: number) => {
    const controlIndex = delta > 0 ? 0 : 1;
    lastPointerAt[teamIndex][controlIndex] = Date.now();
    nudgeScore(teamIndex, delta);
  };

  const handleClick = (teamIndex: number, delta: number) => {
    const controlIndex = delta > 0 ? 0 : 1;
    const lastPointer = lastPointerAt[teamIndex][controlIndex];
    if (lastPointer && Date.now() - lastPointer < 350) {
      return;
    }

    nudgeScore(teamIndex, delta);
  };
</script>

<svelte:head>
  <title>Dominoes</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="dominoes-page">
  <a class="breadcrumb" href="{base}/games">← Game Score Tools</a>

  <div class="board">
    <div class="board-head">
      <span class="team-chip team-left">{teamNames[0]}</span>
      <span class="target-label">Score</span>
      <span class="team-chip team-right">{teamNames[1]}</span>
    </div>

    <div class="score-grid">
      {#each teamNames as team, teamIndex}
        <div class="score-column">
          <button
            class="score-control"
            type="button"
            on:pointerdown={() => handlePointerDown(teamIndex, 1)}
            on:click={() => handleClick(teamIndex, 1)}
            aria-label="Increase {team} score"
          >
            <svg class="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 6l6 7H6l6-7z" />
            </svg>
          </button>

          <div class="score-window" aria-live="polite">
            {#key scores[teamIndex]}
              <span
                class="score-value"
                in:fly={{
                  y: lastDelta[teamIndex] > 0 ? 28 : -28,
                  opacity: 0.2,
                  duration: 180
                }}
                out:fly={{
                  y: lastDelta[teamIndex] > 0 ? -28 : 28,
                  opacity: 0.2,
                  duration: 180
                }}
              >
                {scores[teamIndex]}
              </span>
            {/key}
          </div>

          <button
            class="score-control"
            type="button"
            on:pointerdown={() => handlePointerDown(teamIndex, -1)}
            on:click={() => handleClick(teamIndex, -1)}
            aria-label="Decrease {team} score"
          >
            <svg class="arrow arrow-down" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 6l6 7H6l6-7z" />
            </svg>
          </button>
        </div>
      {/each}
    </div>

    <button class="reset-text" type="button" on:click={handleReset} aria-live="polite">
      {confirmReset ? "ARE YOU SURE?" : "RESET"}
    </button>
  </div>
</section>

<style>
  :global(:root) {
    --app-bg: radial-gradient(circle at top, #f2efe8 0%, #e5edf2 45%, #f7f4ee 100%);
    --app-text: #1b1a17;
    --app-muted: #4b425c;
    --app-card-bg: #ffffff;
    --app-chip-bg: #f7f2e6;
    --app-chip-border: rgba(27, 26, 23, 0.15);
    --app-border: rgba(27, 26, 23, 0.08);
  }

  :global(:root[data-theme="dark"]) {
    --app-bg: radial-gradient(circle at top, #12161c 0%, #1a2028 45%, #1f2530 100%);
    --app-text: #f0f1f4;
    --app-muted: #b3b6c2;
    --app-card-bg: #1c222c;
    --app-chip-bg: #232a35;
    --app-chip-border: rgba(240, 241, 244, 0.18);
    --app-border: rgba(240, 241, 244, 0.12);
  }

  :global(.site-header) {
    display: none;
  }

  .dominoes-page {
    min-height: 100vh;
    padding: 1rem clamp(0.2rem, 2vw, 0.8rem) 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
    color: var(--app-text);
    touch-action: manipulation;
    align-items: center;
  }

  :global(body) {
    margin: 0;
    background: var(--app-bg);
    touch-action: manipulation;
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

  .board {
    background: var(--app-card-bg);
    border-radius: 28px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border: 1px solid var(--app-border);
    box-shadow: 0 30px 60px rgba(27, 26, 23, 0.12);
    width: 100%;
    max-width: 540px;
    align-self: center;
    touch-action: manipulation;
  }

  .board-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    text-align: center;
    padding-bottom: 0;
  }

  .team-chip {
    border-radius: 999px;
    padding: 0.65rem 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 0.7rem;
    background: var(--app-chip-bg);
    color: var(--app-text);
    box-shadow: inset 0 0 0 2px var(--app-chip-border);
    min-width: 0;
  }

  .team-left {
    margin-right: auto;
  }

  .team-right {
    margin-left: auto;
  }

  .target-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #746f63;
    flex: 0 0 64px;
  }

  .score-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
    margin-top: 10px;
  }

  .score-column {
    display: grid;
    grid-template-rows: auto 1fr auto;
    align-items: center;
    gap: 0.85rem;
  }

  .score-control {
    border-radius: 16px;
    border: 1px solid rgba(27, 26, 23, 0.18);
    background: #f5f8fb;
    display: grid;
    place-items: center;
    padding: 0.4rem 0.5rem;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    touch-action: manipulation;
  }

  .score-control:active {
    transform: scale(0.97);
    box-shadow: inset 0 0 0 2px rgba(27, 26, 23, 0.12);
  }

  .arrow {
    width: 22px;
    height: 22px;
    fill: #1b1a17;
  }

  .arrow-down {
    transform: rotate(180deg);
  }

  .score-window {
    border-radius: 22px;
    border: 1px solid rgba(27, 26, 23, 0.18);
    background: #f0ece3;
    height: 84px;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    font-family: "Fraunces", "Times New Roman", serif;
  }

  .score-value {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 2.6rem;
    font-weight: 700;
    color: #1b1a17;
    letter-spacing: 0.02em;
  }

  .reset-text {
    border: none;
    background: transparent;
    color: #c3392b;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
    justify-self: center;
    padding: 0;
    margin-top: 4px;
  }

  @media (max-width: 620px) {
    .board {
      padding: 24px 20px;
    }

    .score-grid {
      gap: 1rem;
    }

    .score-window {
      height: 72px;
    }

    .score-value {
      font-size: 2.2rem;
    }
  }
</style>
