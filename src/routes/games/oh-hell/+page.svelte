<script lang="ts">
  import { base } from "$app/paths";

  type Round = {
    handSize: number;
    bids: (number | null)[];
    takes: (number | null)[];
  };

  const minPlayers = 2;
  const maxPlayers = 8;

  let players = ["", "", "", ""];
  let maxHand = 8;
  let useReturnTrip = true;
  let rounds: Round[] = [];
  let confirmReset = false;
  let view: "setup" | "round" = "setup";
  let currentRoundIndex = 0;
  let roundPhases: ("bids" | "results")[] = [];

  const buildRounds = (handSize: number, returnTrip: boolean, playerCount: number) => {
    const sizes = Array.from({ length: handSize }, (_, index) => handSize - index);
    if (returnTrip && handSize > 1) {
      sizes.push(...Array.from({ length: handSize - 1 }, (_, index) => index + 2));
    }

    return sizes.map((size) => ({
      handSize: size,
      bids: Array.from({ length: playerCount }, () => null),
      takes: Array.from({ length: playerCount }, () => null)
    }));
  };

  const regenerateRounds = () => {
    rounds = buildRounds(maxHand, useReturnTrip, players.length);
    currentRoundIndex = 0;
    roundPhases = Array.from({ length: rounds.length }, () => "bids");
  };

  const clampValue = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const renamePlayer = (index: number, value: string) => {
    const next = value.trim().toUpperCase().slice(0, 14);
    players = players.map((player, playerIndex) =>
      playerIndex === index ? next : player
    );
  };

  const displayNameFor = (player: string, index: number) =>
    player.trim() ? player : `PLAYER ${index + 1}`;

  const addPlayer = () => {
    if (players.length >= maxPlayers) {
      return;
    }

    players = [...players, ""];
    rounds = rounds.map((round) => ({
      ...round,
      bids: [...round.bids, null],
      takes: [...round.takes, null]
    }));
  };

  const removePlayer = () => {
    if (players.length <= minPlayers) {
      return;
    }

    players = players.slice(0, -1);
    rounds = rounds.map((round) => ({
      ...round,
      bids: round.bids.slice(0, -1),
      takes: round.takes.slice(0, -1)
    }));
  };

  const updateValue = (
    roundIndex: number,
    playerIndex: number,
    key: "bids" | "takes",
    value: number | null
  ) => {
    const round = rounds[roundIndex];
    const nextValue =
      value === null || !Number.isFinite(value)
        ? null
        : clampValue(value, 0, round.handSize);

    rounds = rounds.map((entry, index) => {
      if (index !== roundIndex) {
        return entry;
      }

      const updated = entry[key].map((current, currentIndex) =>
        currentIndex === playerIndex ? nextValue : current
      );
      return { ...entry, [key]: updated };
    });
  };

  const scoreFor = (round: Round, playerIndex: number) => {
    const bid = round.bids[playerIndex];
    const made = round.takes[playerIndex];
    if (bid === null || made === null) {
      return null;
    }
    if (bid === made) {
      return bid === 0 ? 5 : 10 + made;
    }

    return made;
  };

  const scoreForRound = (roundIndex: number, playerIndex: number) => {
    if (roundPhases[roundIndex] !== "results") {
      return null;
    }

    return scoreFor(rounds[roundIndex], playerIndex);
  };

  const totalThrough = (roundIndex: number, playerIndex: number) =>
    rounds.reduce((total, round, index) => {
      if (index > roundIndex) {
        return total;
      }
      const score = scoreForRound(index, playerIndex);
      return total + (score ?? 0);
    }, 0);

  const totalFor = (playerIndex: number) => totalThrough(rounds.length - 1, playerIndex);

  const totalBeforeRound = (roundIndex: number, playerIndex: number) =>
    totalThrough(roundIndex - 1, playerIndex);

  const totalAfterRound = (roundIndex: number, playerIndex: number) => {
    const score = scoreForRound(roundIndex, playerIndex) ?? 0;
    return totalBeforeRound(roundIndex, playerIndex) + score;
  };

  const bidTotalFor = (round: Round) =>
    round.bids.reduce((sum, value) => sum + (value ?? 0), 0);

  const handleReset = () => {
    if (!confirmReset) {
      confirmReset = true;
      return;
    }

    regenerateRounds();
    confirmReset = false;
    view = "setup";
  };

  const handleMaxHandChange = (event: Event) => {
    const target = event.currentTarget as HTMLSelectElement;
    maxHand = Number(target.value);
    regenerateRounds();
  };

  const handleReturnTripChange = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    useReturnTrip = target.checked;
    regenerateRounds();
  };

  const startRounds = () => {
    view = "round";
    currentRoundIndex = 0;
  };

  const goToRound = (nextIndex: number) => {
    currentRoundIndex = clampValue(nextIndex, 0, Math.max(0, rounds.length - 1));
    view = "round";
  };

  const setRoundPhase = (roundIndex: number, phase: "bids" | "results") => {
    roundPhases = roundPhases.map((value, index) =>
      index === roundIndex ? phase : value
    );
  };

  regenerateRounds();
</script>

<svelte:head>
  <title>Oh Hell!</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="ohhell-page">
  <a class="breadcrumb" href="{base}/games">&larr; Game Score Tools</a>

  <div class="board">
    <header class="board-head">
      <div>
        <div class="eyebrow-row">
          <p class="eyebrow">Oh Hell!</p>
          {#if view === "round"}
            <button
              class="ghost-button ghost-compact"
              type="button"
              on:click={() => (view = "setup")}
            >
              Back to setup
            </button>
          {/if}
        </div>
        {#if view === "setup"}
          <h1>Bid, take, and score.</h1>
          <p class="subhead">
            Hit your bid exactly to score 10 + tricks (or 5 for a zero bid). Miss
            the bid and you just score the tricks you took.
          </p>
        {:else}
          <h1>Round {currentRoundIndex + 1} of {rounds.length}</h1>
          <p class="subhead">
            Cards this round: {rounds[currentRoundIndex]?.handSize ?? 0}
          </p>
        {/if}
      </div>
      <div></div>
    </header>

    {#if view === "setup"}
      <div class="setup-grid">
        <div class="setup-card">
          <h2>Players</h2>
          <p class="hint">Tap a name to edit. Add up to {maxPlayers} players.</p>
          <div class="player-list">
            {#each players as player, playerIndex}
              <label class="player-row">
                <span class="player-index">{playerIndex + 1}</span>
                <input
                  class="player-input"
                  value={player}
                  maxlength="14"
                  placeholder={`PLAYER ${playerIndex + 1}`}
                  on:input={(event) =>
                    renamePlayer(
                      playerIndex,
                      (event.currentTarget as HTMLInputElement).value
                    )}
                />
              </label>
            {/each}
          </div>
          <div class="player-actions">
            <button
              class="ghost-button"
              type="button"
              on:click={addPlayer}
              disabled={players.length >= maxPlayers}
            >
              Add player
            </button>
            <button
              class="ghost-button"
              type="button"
              on:click={removePlayer}
              disabled={players.length <= minPlayers}
            >
              Remove
            </button>
          </div>
        </div>

        <div class="setup-card">
          <h2>Rounds</h2>
          <p class="hint">Pick a max hand size and whether to play back down.</p>
          <label class="control">
            <span>Max hand size</span>
            <select on:change={handleMaxHandChange} value={maxHand}>
              {#each [5, 6, 7, 8, 9, 10, 11, 12, 13] as size}
                <option value={size}>{size}</option>
              {/each}
            </select>
          </label>
          <label class="toggle">
            <input
              type="checkbox"
              checked={useReturnTrip}
              on:change={handleReturnTripChange}
            />
          <span>Play back up to {maxHand}</span>
          </label>
          <div class="round-summary">
            <span>{rounds.length} rounds</span>
            <span class="round-list">{rounds.map((round) => round.handSize).join(" / ")}</span>
          </div>
          <button class="primary-button" type="button" on:click={startRounds}>
            Start rounds
          </button>
        </div>
      </div>
    {:else}
      <div class="rounds">
        {#if rounds[currentRoundIndex]}
          <div class="round-columns" aria-hidden="true">
            <span class="round-columns-spacer"></span>
            <span class="round-columns-label">Bet</span>
            <span class="round-columns-label">Made</span>
            <span class="round-columns-label">Result</span>
          </div>

          <div class="round-rows">
            {#each players as player, playerIndex}
              <div class="player-score-row">
                <div class="player-name">
                  <span>{displayNameFor(player, playerIndex)}</span>
                  <span class="total-badge">
                    {#if
                      roundPhases[currentRoundIndex] === "results" &&
                      scoreForRound(currentRoundIndex, playerIndex) !== null}
                      {totalBeforeRound(currentRoundIndex, playerIndex)} -> {totalAfterRound(currentRoundIndex, playerIndex)}
                    {:else}
                      {totalFor(playerIndex)}
                    {/if}
                  </span>
                </div>
                {#if roundPhases[currentRoundIndex] === "bids"}
                  <div class="stat-group stat-bet">
                    <input
                      class="stat-input"
                      type="number"
                      min="0"
                      max={rounds[currentRoundIndex].handSize}
                      inputmode="numeric"
                      pattern="[0-9]*"
                      value={rounds[currentRoundIndex].bids[playerIndex] ?? ""}
                      on:input={(event) =>
                        updateValue(
                          currentRoundIndex,
                          playerIndex,
                          "bids",
                          (event.currentTarget as HTMLInputElement).value === ""
                            ? null
                            : Number((event.currentTarget as HTMLInputElement).value)
                        )}
                    />
                  </div>
                  <div class="stat-group stat-made stat-placeholder">
                    <div class="stat-value">--</div>
                  </div>
                  <div class="stat-group stat-result stat-placeholder">
                    <div class="stat-value">--</div>
                  </div>
                {:else}
                  <div class="stat-group stat-bet stat-locked">
                    <input
                      class="stat-input"
                      type="number"
                      min="0"
                      max={rounds[currentRoundIndex].handSize}
                      inputmode="numeric"
                      pattern="[0-9]*"
                      value={rounds[currentRoundIndex].bids[playerIndex] ?? ""}
                      disabled
                    />
                  </div>
                  {#if rounds[currentRoundIndex].bids[playerIndex] === null}
                    <div class="stat-group stat-made stat-placeholder">
                      <div class="stat-value">--</div>
                    </div>
                    <div class="stat-group stat-result stat-placeholder">
                      <div class="stat-value">--</div>
                    </div>
                  {:else}
                    <div class="stat-group stat-made">
                      <input
                        class="stat-input"
                        type="number"
                        min="0"
                        max={rounds[currentRoundIndex].handSize}
                        inputmode="numeric"
                        pattern="[0-9]*"
                        value={rounds[currentRoundIndex].takes[playerIndex] ?? ""}
                        on:input={(event) =>
                          updateValue(
                            currentRoundIndex,
                            playerIndex,
                            "takes",
                            (event.currentTarget as HTMLInputElement).value === ""
                              ? null
                              : Number((event.currentTarget as HTMLInputElement).value)
                          )}
                      />
                    </div>
                    <div class="stat-group stat-result">
                      <div class="result-value">
                        {#if scoreForRound(currentRoundIndex, playerIndex) !== null}
                          {scoreForRound(currentRoundIndex, playerIndex)}
                        {:else}
                          --
                        {/if}
                      </div>
                    </div>
                  {/if}
                {/if}
              </div>
            {/each}
          </div>
        {/if}
        <div class="round-footer">
          <div class="round-footer-center">
            <button
              class="ghost-button footer-nav"
              type="button"
              on:click={() => goToRound(currentRoundIndex - 1)}
              disabled={currentRoundIndex <= 0}
              aria-label="Previous round"
            >
              &larr;
            </button>
            {#if roundPhases[currentRoundIndex] === "bids"}
              <button
                class="primary-button lock-toggle"
                type="button"
                on:click={() => setRoundPhase(currentRoundIndex, "results")}
              >
                Lock bids
              </button>
            {:else}
              <button
                class="ghost-button lock-toggle"
                type="button"
                on:click={() => setRoundPhase(currentRoundIndex, "bids")}
              >
                Unlock bids
              </button>
            {/if}
            <button
              class="ghost-button footer-nav"
              type="button"
              on:click={() => goToRound(currentRoundIndex + 1)}
              disabled={
                roundPhases[currentRoundIndex] !== "results" ||
                currentRoundIndex >= rounds.length - 1
              }
              aria-label="Next round"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    {/if}

    <button class="reset-text" type="button" on:click={handleReset} aria-live="polite">
      {confirmReset ? "ARE YOU SURE?" : "RESET SCORES"}
    </button>
  </div>
</section>

<style>
  :global(:root) {
    --app-bg: radial-gradient(circle at top, #f0f3f7 0%, #f7efe5 45%, #f1f6f1 100%);
    --app-text: #1b1a17;
    --app-muted: #4b425c;
    --app-accent: #5e4b7a;
    --app-card-bg: #ffffff;
    --app-card-border: rgba(27, 26, 23, 0.08);
    --app-panel-bg: #fffaf3;
    --app-panel-border: rgba(27, 26, 23, 0.12);
    --app-chip-bg: #f0ece3;
    --app-chip-text: #1b1a17;
    --app-input-bg: #ffffff;
    --app-input-border: rgba(27, 26, 23, 0.12);
    --app-ghost-bg: #f5f8fb;
    --app-primary-bg: #1b1a17;
    --app-primary-text: #fffaf3;
    --app-label: #6a5d4c;
    --app-row-bg: #f7f2e6;
    --app-row-border: rgba(27, 26, 23, 0.08);
    --app-bet: #2c2438;
    --app-made: #1b3a2a;
    --app-result: #6a2b2b;
    --app-reset: #c3392b;
  }

  :global(:root[data-theme="dark"]) {
    --app-bg: radial-gradient(circle at top, #131821 0%, #171c25 45%, #1c2230 100%);
    --app-text: #f0f1f4;
    --app-muted: #b3b6c2;
    --app-accent: #d6c3ff;
    --app-card-bg: #1c222c;
    --app-card-border: rgba(240, 241, 244, 0.12);
    --app-panel-bg: #202633;
    --app-panel-border: rgba(240, 241, 244, 0.12);
    --app-chip-bg: #252c38;
    --app-chip-text: #f0f1f4;
    --app-input-bg: #1a202a;
    --app-input-border: rgba(240, 241, 244, 0.18);
    --app-ghost-bg: #1a212c;
    --app-primary-bg: #f0f1f4;
    --app-primary-text: #111319;
    --app-label: #b4b7c4;
    --app-row-bg: #202633;
    --app-row-border: rgba(240, 241, 244, 0.12);
    --app-bet: #d6c3ff;
    --app-made: #8fe0b4;
    --app-result: #ff9c9c;
    --app-reset: #ff6f61;
  }

  :global(html, body) {
    margin: 0;
    background: var(--app-bg);
    overflow-y: auto !important;
    overflow-x: hidden !important;
    touch-action: manipulation;
  }

  :global(.site-header) {
    display: none;
  }

  .ohhell-page {
    min-height: 100vh;
    /* padding: 1rem clamp(0.5rem, 2.5vw, 1.2rem); */
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
    color: var(--app-text);
    align-items: center;
    width: min(1100px, 100%);
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
    gap: 1.3rem;
    border: 1px solid var(--app-card-border);
    box-shadow: 0 30px 60px rgba(27, 26, 23, 0.12);
    width: 100%;
  }

  .board-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.9rem;
    align-items: start;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--app-accent);
    margin: 0 0 0.4rem 0;
  }

  h1 {
    font-family: "Fraunces", "Times New Roman", serif;
    font-size: clamp(1.8rem, 2.6vw, 2.6rem);
    margin: 0 0 0.35rem 0;
  }

  .eyebrow-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.15rem;
  }

  .round-nav-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .subhead {
    margin: 0;
    color: var(--app-muted);
    font-size: 1rem;
  }

  .setup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.2rem;
  }

  .setup-card {
    border-radius: 20px;
    border: 1px solid var(--app-panel-border);
    background: var(--app-panel-bg);
    padding: 1.1rem;
    display: grid;
    gap: 0.9rem;
  }

  .setup-card h2 {
    margin: 0;
    font-size: 1rem;
  }

  .hint {
    margin: -0.3rem 0 0 0;
    color: var(--app-muted);
    font-size: 0.85rem;
  }

  .player-list {
    display: grid;
    gap: 0.6rem;
  }

  .player-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.6rem;
    align-items: center;
  }

  .player-index {
    width: 28px;
    height: 28px;
    border-radius: 10px;
    background: var(--app-chip-bg);
    color: var(--app-chip-text);
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 0.8rem;
  }

  .player-input {
    border-radius: 12px;
    border: 1px solid var(--app-input-border);
    padding: 0.45rem 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    background: var(--app-input-bg);
    color: var(--app-text);
  }

  .player-actions {
    display: flex;
    gap: 0.6rem;
  }

  .ghost-button {
    border-radius: 999px;
    border: 1px solid var(--app-input-border);
    background: var(--app-ghost-bg);
    padding: 0.4rem 0.9rem;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    color: var(--app-text);
  }

  .ghost-compact {
    padding: 0.25rem 0.7rem;
    font-size: 0.75rem;
  }

  .ghost-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .primary-button {
    border-radius: 999px;
    border: none;
    background: var(--app-primary-bg);
    color: var(--app-primary-text);
    padding: 0.55rem 1.1rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    justify-self: start;
  }

  .footer-nav {
    width: 44px;
    height: 44px;
    border-radius: 999px;
    background: transparent;
    border-color: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    padding: 0;
  }

  .lock-toggle {
    width: 132px;
    height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .control select {
    border-radius: 10px;
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--app-input-border);
    background: var(--app-input-bg);
    font-weight: 600;
    color: var(--app-text);
  }

  .toggle {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    font-weight: 600;
  }

  .round-summary {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: var(--app-muted);
  }

  .round-list {
    font-size: 0.75rem;
    letter-spacing: 0.02em;
  }

  .rounds {
    display: grid;
    gap: 1.2rem;
    width: 100%;
  }

  .round-columns {
    display: grid;
    grid-template-columns: minmax(90px, 1.2fr) repeat(3, minmax(90px, 1fr));
    gap: 0.8rem;
    align-items: center;
    width: 100%;
    padding: 0;
  }

  .round-columns,
  .round-rows,
  .round-footer {
    padding: 0 0.2rem;
  }

  .round-columns-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--app-label);
    text-align: center;
  }

  .round-columns-spacer {
    visibility: hidden;
  }

  .round-rows {
    display: grid;
    gap: 0.6rem;
    width: 100%;
  }

  .player-score-row {
    display: grid;
    grid-template-columns: minmax(90px, 1.2fr) repeat(3, minmax(90px, 1fr));
    gap: 0.8rem;
    align-items: center;
    background: var(--app-row-bg);
    border-radius: 16px;
    padding: 0.6rem 0.8rem;
    border: 1px solid var(--app-row-border);
  }

  .player-name {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .total-badge {
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
    background: var(--app-row-bg);
    font-size: 1rem;
    min-width: 120px;
    text-align: center;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    display: inline-flex;
    align-items: center;
    justify-content: end;
  }

  .stat-group {
    display: grid;
    gap: 0.3rem;
    align-items: center;
  }

  .stat-bet {
    color: var(--app-bet);
  }

  .stat-made {
    color: var(--app-made);
  }

  .stat-result {
    color: var(--app-result);
  }

  .stat-placeholder {
    opacity: 0.45;
  }

  .stat-input {
    width: 100%;
    height: 44px;
    border-radius: 12px;
    border: 1px solid var(--app-input-border);
    background: var(--app-input-bg);
    text-align: center;
    font-weight: 700;
    padding: 0.35rem 0.2rem;
    font-size: 1.35rem;
    color: currentColor;
  }

  .stat-value {
    font-weight: 700;
    font-size: 1.35rem;
    text-align: center;
  }

  .stat-locked .stat-input {
    background: transparent;
    color: var(--app-muted);
    border-color: transparent;
  }

  .result-value {
    border-radius: 14px;
    height: 44px;
    padding: 0.4rem 0.6rem;
    background: var(--app-input-bg);
    font-weight: 700;
    font-size: 1.4rem;
    text-align: center;
    display: grid;
    place-items: center;
  }

  .round-footer {
    display: flex;
    justify-content: center;
  }

  .round-footer-center {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .reset-text {
    border: none;
    background: transparent;
    color: var(--app-reset);
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
    justify-self: center;
    padding: 0;
  }

  @media (max-width: 820px) {
    .board-head {
      grid-template-columns: 1fr;
    }

    .round-columns {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      padding: 0;
    }

    .round-columns-spacer {
      display: none;
    }

    .player-score-row {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      justify-items: stretch;
      row-gap: 0.6rem;
    }

    .player-name {
      grid-column: 1 / -1;
      font-size: 1.05rem;
    }


    .stat-group {
      justify-items: stretch;
    }
  }

  @media (max-width: 600px) {
    .board {
      padding: 24px 20px;
    }

    .player-score-row {
      padding: 0.6rem;
    }
  }

  @media (max-width: 520px) {
    .round-columns-label {
      font-size: 0.6rem;
      letter-spacing: 0.14em;
    }

    /* .total-badge {
      font-size: 1rem;
    } */

    .round-footer {
      justify-items: center;
    }

    .round-footer-center,
    .round-footer-right {
      justify-content: center;
    }
  }
</style>
