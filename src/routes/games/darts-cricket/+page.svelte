<script lang="ts">
  import { base } from "$app/paths";

  const rows = ["20", "19", "18", "17", "16", "15", "Bull"];
  const markIcons = ["", "cricket-one.png", "cricket-two.png", "cricket-three.png"];
  const stepDelayMs = 80;

  let teamNames = ["HOME", "AWAY"];
  let marks = rows.map(() => [0, 0]);
  let confirmReset = false;
  const pendingSteps = rows.map(() => [0, 0]);
  const isProcessing = rows.map(() => [false, false]);
  const lastPointerAt = rows.map(() => [0, 0]);

  const applyAdvance = (rowIndex: number, teamIndex: number) => {
    const next = (marks[rowIndex][teamIndex] + 1) % markIcons.length;
    marks = marks.map((row, r) =>
      row.map((value, t) => (r === rowIndex && t === teamIndex ? next : value))
    );
  };

  const processQueue = (rowIndex: number, teamIndex: number) => {
    if (pendingSteps[rowIndex][teamIndex] === 0) {
      isProcessing[rowIndex][teamIndex] = false;
      return;
    }

    pendingSteps[rowIndex][teamIndex] -= 1;
    applyAdvance(rowIndex, teamIndex);
    setTimeout(() => processQueue(rowIndex, teamIndex), stepDelayMs);
  };

  const advanceMark = (rowIndex: number, teamIndex: number) => {
    pendingSteps[rowIndex][teamIndex] += 1;
    if (isProcessing[rowIndex][teamIndex]) {
      return;
    }

    isProcessing[rowIndex][teamIndex] = true;
    processQueue(rowIndex, teamIndex);
  };

  const handlePointerDown = (rowIndex: number, teamIndex: number) => {
    lastPointerAt[rowIndex][teamIndex] = Date.now();
    advanceMark(rowIndex, teamIndex);
  };

  const handleClick = (rowIndex: number, teamIndex: number) => {
    const lastPointer = lastPointerAt[rowIndex][teamIndex];
    if (lastPointer && Date.now() - lastPointer < 350) {
      return;
    }

    advanceMark(rowIndex, teamIndex);
  };

  const renameTeam = (teamIndex: number) => {
    if (typeof window === "undefined") {
      return;
    }

    const next = window.prompt("Team name", teamNames[teamIndex]);
    if (!next) {
      return;
    }

    const trimmed = next.trim();
    if (!trimmed) {
      return;
    }

    teamNames = teamNames.map((name, index) =>
      index === teamIndex ? trimmed.slice(0, 18) : name
    );
  };

  const resetMarks = () => {
    marks = rows.map(() => [0, 0]);
    confirmReset = false;
    pendingSteps.forEach((row, rowIndex) => {
      row.forEach((_, teamIndex) => {
        pendingSteps[rowIndex][teamIndex] = 0;
        isProcessing[rowIndex][teamIndex] = false;
      });
    });
  };

  const handleReset = () => {
    if (!confirmReset) {
      confirmReset = true;
      return;
    }

    resetMarks();
  };
</script>

<svelte:head>
  <title>Darts Cricket</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="cricket-page">
  <a class="breadcrumb" href="{base}/games">← Game Score Tools</a>
  <div class="board">
    <div class="board-head">
      <button
        class="team-chip team-left"
        type="button"
        on:click={() => renameTeam(0)}
        aria-label="Rename HOME team"
      >
        {teamNames[0]}
      </button>
      <span class="target-label">Targets</span>
      <button
        class="team-chip team-right"
        type="button"
        on:click={() => renameTeam(1)}
        aria-label="Rename AWAY team"
      >
        {teamNames[1]}
      </button>
    </div>

    <div class="board-grid" role="grid">
      {#each rows as row, rowIndex}
        <div class="board-row" role="row">
          <button
            class="mark-cell"
            type="button"
            on:pointerdown={() => handlePointerDown(rowIndex, 0)}
            on:click={() => handleClick(rowIndex, 0)}
            aria-label="{teamNames[0]} marks for {row}"
          >
            {#if marks[rowIndex][0] > 0}
              <img
                class="mark-icon"
                src="{base}/{markIcons[marks[rowIndex][0]]}"
                alt=""
              />
            {/if}
          </button>
          <div class="target-cell" role="rowheader">{row}</div>
          <button
            class="mark-cell"
            type="button"
            on:pointerdown={() => handlePointerDown(rowIndex, 1)}
            on:click={() => handleClick(rowIndex, 1)}
            aria-label="{teamNames[1]} marks for {row}"
          >
            {#if marks[rowIndex][1] > 0}
              <img
                class="mark-icon"
                src="{base}/{markIcons[marks[rowIndex][1]]}"
                alt=""
              />
            {/if}
          </button>
        </div>
      {/each}
    </div>

    <button
      class="reset-text"
      type="button"
      on:click={handleReset}
      aria-live="polite"
    >
      {confirmReset ? "ARE YOU SURE?" : "RESET"}
    </button>
  </div>
</section>

<style>
  :global(main[data-page="darts-cricket"]) {
    --app-bg: radial-gradient(circle at top, #f2efe8 0%, #e5edf2 45%, #f7f4ee 100%);
    --app-text: #1b1a17;
    --app-muted: #4b425c;
    --app-card-bg: #ffffff;
    --app-panel-bg: #f0ece3;
    --app-panel-muted: #f5f8fb;
    --app-chip-bg: #f7f2e6;
    --app-chip-border: rgba(27, 26, 23, 0.15);
    --app-border: rgba(27, 26, 23, 0.08);
  }

  :global(:root[data-theme="dark"] main[data-page="darts-cricket"]) {
    --app-bg: radial-gradient(circle at top, #12161c 0%, #1a2028 45%, #1f2530 100%);
    --app-text: #f0f1f4;
    --app-muted: #b3b6c2;
    --app-card-bg: #1c222c;
    --app-panel-bg: #242a35;
    --app-panel-muted: #202633;
    --app-chip-bg: #232a35;
    --app-chip-border: rgba(240, 241, 244, 0.18);
    --app-border: rgba(240, 241, 244, 0.12);
  }

  .cricket-page {
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
    touch-action: manipulation;
  }

  :global(.site-header) {
    display: none;
  }

  .board {
    background: var(--app-card-bg);
    border-radius: 28px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    border: 1px solid var(--app-border);
    box-shadow: 0 30px 60px rgba(27, 26, 23, 0.12);
    width: 100%;
    max-width: 540px;
    align-self: center;
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

  .board-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    text-align: center;
    padding-bottom: 0;
  }

  .team-chip {
    border: none;
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
    color: var(--app-muted);
    flex: 0 0 64px;
  }

  .board-grid {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin-top: 20px;
  }

  .board-row {
    display: flex;
    align-items: center;
    gap: 0.95rem;
    width: 100%;
  }

  .target-cell {
    border-radius: 18px;
    background: var(--app-panel-bg);
    padding: 0.6rem 0.5rem;
    text-align: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex: 0 0 64px;
    font-size: 1rem;
  }

  .mark-cell {
    border-radius: 18px;
    min-height: 50px;
    border: 1px solid var(--app-border);
    background: var(--app-panel-muted);
    display: grid;
    place-items: center;
    touch-action: manipulation;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    flex: 1 1 0;
    min-width: 0;
  }

  .mark-cell:active {
    transform: scale(0.98);
    box-shadow: inset 0 0 0 2px rgba(27, 26, 23, 0.12);
  }

  .mark-icon {
    width: 42px;
    height: 42px;
    object-fit: contain;
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
    margin-top: 20px;
  }

</style>
