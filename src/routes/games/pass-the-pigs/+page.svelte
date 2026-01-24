<script lang="ts">
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  type Player = {
    id: number;
    name: string;
    score: number;
    eliminated: boolean;
  };

  type RollOutcome = {
    id: string;
    label: string;
    points: number;
    type: "score" | "pig-out" | "oinker" | "piggyback";
  };

  type LogEntry = {
    id: number;
    text: string;
    kind: "roll" | "bank" | "special" | "hog";
  };

  type GameState = {
    players: Player[];
    turnTotal: number;
    turnRolls: RollOutcome[];
    currentPlayerId: number;
    lastRoll: RollOutcome | null;
    activityLog: LogEntry[];
    activityId: number;
    confirmReset: boolean;
  };

  const minPlayers = 2;
  const maxPlayers = 10;

  let nextId = 1;

  const createPlayer = (index: number): Player => ({
    id: nextId++,
    name: `PLAYER ${index + 1}`,
    score: 0,
    eliminated: false
  });

  let players: Player[] = Array.from({ length: 4 }, (_, index) =>
    createPlayer(index)
  );
  let targetScore = 100;
  let currentPlayerId = players[0]?.id ?? 0;

  let turnTotal = 0;
  let turnRolls: RollOutcome[] = [];
  let activityLog: LogEntry[] = [];
  let confirmReset = false;
  let history: GameState[] = [];
  let showSticky = false;
  let rollPanel: HTMLElement | null = null;
  let rollHeader: HTMLElement | null = null;

  let lastRoll: RollOutcome | null = null;
  let view: "setup" | "play" = "setup";

  const positionOptions = [
    { id: "razorback", label: "Razorback", points: 5 },
    { id: "trotter", label: "Trotter", points: 5 },
    { id: "snouter", label: "Snouter", points: 10 },
    { id: "leaning-jowler", label: "Leaning Jowler", points: 15 }
  ];

  const standardOutcomes: RollOutcome[] = [
    { id: "sider", label: "Sider (both same side)", points: 1, type: "score" },
    { id: "razorback", label: "Razorback", points: 5, type: "score" },
    { id: "trotter", label: "Trotter", points: 5, type: "score" },
    { id: "snouter", label: "Snouter", points: 10, type: "score" },
    { id: "leaning-jowler", label: "Leaning Jowler", points: 15, type: "score" },
    { id: "double-razorback", label: "Double Razorback", points: 20, type: "score" },
    { id: "double-trotter", label: "Double Trotter", points: 20, type: "score" },
    { id: "double-snouter", label: "Double Snouter", points: 40, type: "score" },
    { id: "double-leaning-jowler", label: "Double Leaning Jowler", points: 60, type: "score" }
  ];

  const specialOutcomes: RollOutcome[] = [
    { id: "pig-out", label: "Pig Out (opposite sides)", points: 0, type: "pig-out" },
    { id: "oinker", label: "Oinker (pigs touch)", points: 0, type: "oinker" },
    { id: "piggyback", label: "Piggyback (one on top)", points: 0, type: "piggyback" }
  ];

  let comboA = positionOptions[0].id;
  let comboB = positionOptions[1].id;
  let comboError = "";
  let pressedId: string | null = null;
  let pressedTimer: number | null = null;

  let enableHogCall = false;
  let hogCallerId = "";
  let hogCallResult: "correct" | "wrong" = "correct";
  let hogCallError = "";

  let activityId = 1;

  const setPlayerName = (id: number, value: string) => {
    const trimmed = value.trim().toUpperCase().slice(0, 16);
    players = players.map((player) =>
      player.id === id ? { ...player, name: trimmed } : player
    );
  };

  const displayNameFor = (player: Player, index: number) =>
    player.name.trim() ? player.name : `PLAYER ${index + 1}`;

  const handleTargetChange = (event: Event) => {
    const value = Number((event.currentTarget as HTMLInputElement).value);
    if (!Number.isFinite(value)) return;
    targetScore = Math.min(500, Math.max(50, value));
  };

  const addPlayer = () => {
    if (players.length >= maxPlayers) return;
    players = [...players, createPlayer(players.length)];
  };

  const removePlayer = () => {
    if (players.length <= minPlayers) return;
    const removed = players[players.length - 1];
    players = players.slice(0, -1);
    if (removed.id === currentPlayerId) {
      currentPlayerId = players[0]?.id ?? 0;
    }
  };

  const resetGame = () => {
    if (!confirmReset) {
      confirmReset = true;
      return;
    }

    players = players.map((player, index) => ({
      ...player,
      name: `PLAYER ${index + 1}`,
      score: 0,
      eliminated: false
    }));
    turnTotal = 0;
    turnRolls = [];
    activityLog = [];
    lastRoll = null;
    currentPlayerId = players[0]?.id ?? 0;
    confirmReset = false;
    view = "setup";
    history = [];
  };

  const addLog = (text: string, kind: LogEntry["kind"] = "roll") => {
    activityLog = [
      { id: activityId++, text, kind },
      ...activityLog
    ].slice(0, 24);
  };

  const captureState = (): GameState => ({
    players: players.map((player) => ({ ...player })),
    turnTotal,
    turnRolls: turnRolls.map((roll) => ({ ...roll })),
    currentPlayerId,
    lastRoll: lastRoll ? { ...lastRoll } : null,
    activityLog: activityLog.map((entry) => ({ ...entry })),
    activityId,
    confirmReset
  });

  const pushHistory = () => {
    history = [...history, captureState()].slice(-30);
  };

  const undoLastAction = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    history = history.slice(0, -1);
    players = previous.players;
    turnTotal = previous.turnTotal;
    turnRolls = previous.turnRolls;
    currentPlayerId = previous.currentPlayerId;
    lastRoll = previous.lastRoll;
    activityLog = previous.activityLog;
    activityId = previous.activityId;
    confirmReset = previous.confirmReset;
    comboError = "";
    hogCallError = "";
  };

  const nextActivePlayerId = (fromId: number) => {
    if (players.length === 0) return fromId;
    const startIndex = players.findIndex((player) => player.id === fromId);
    for (let step = 1; step <= players.length; step += 1) {
      const index = (startIndex + step) % players.length;
      if (!players[index].eliminated) {
        return players[index].id;
      }
    }
    return fromId;
  };

  const endTurn = () => {
    turnTotal = 0;
    turnRolls = [];
    lastRoll = null;
    confirmReset = false;
    currentPlayerId = nextActivePlayerId(currentPlayerId);
  };

  const startGame = () => {
    view = "play";
  };

  const returnToSetup = () => {
    view = "setup";
  };

  const applyOutcome = (outcome: RollOutcome) => {
    const currentIndex = players.findIndex((player) => player.id === currentPlayerId);
    if (currentIndex === -1) return;

    pressedId = outcome.id;
    if (pressedTimer) window.clearTimeout(pressedTimer);
    pressedTimer = window.setTimeout(() => {
      pressedId = null;
      pressedTimer = null;
    }, 260);

    pushHistory();
    const current = players[currentIndex];
    lastRoll = outcome;

    if (outcome.type === "score") {
      turnTotal += outcome.points;
      turnRolls = [...turnRolls, outcome];
      addLog(`${displayNameFor(current, currentIndex)} rolled ${outcome.label} (+${outcome.points}).`);
      return;
    }

    if (outcome.type === "pig-out") {
      addLog(`${displayNameFor(current, currentIndex)} pig out. Turn score drops to 0.`, "special");
      endTurn();
      return;
    }

    if (outcome.type === "oinker") {
      players = players.map((player, index) =>
        index === currentIndex ? { ...player, score: 0 } : player
      );
      addLog(`${displayNameFor(current, currentIndex)} oinker. Total score resets.`, "special");
      endTurn();
      return;
    }

    if (outcome.type === "piggyback") {
      players = players.map((player, index) =>
        index === currentIndex ? { ...player, eliminated: true } : player
      );
      addLog(`${displayNameFor(current, currentIndex)} piggyback. Player is out.`, "special");
      endTurn();
    }
  };

  const bankPoints = () => {
    const currentIndex = players.findIndex((player) => player.id === currentPlayerId);
    if (currentIndex === -1) return;

    pushHistory();
    const current = players[currentIndex];
    if (turnTotal <= 0) {
      addLog(`${displayNameFor(current, currentIndex)} passes.`, "bank");
      endTurn();
      return;
    }

    players = players.map((player, index) =>
      index === currentIndex ? { ...player, score: player.score + turnTotal } : player
    );
    addLog(`${displayNameFor(current, currentIndex)} banks ${turnTotal} points.`, "bank");
    endTurn();
  };

  const applyCombo = () => {
    if (comboA === comboB) {
      comboError = "Pick two different positions for a combo roll.";
      return;
    }

    const first = positionOptions.find((pos) => pos.id === comboA);
    const second = positionOptions.find((pos) => pos.id === comboB);
    if (!first || !second) return;

    comboError = "";
    pressedId = "combo";
    if (pressedTimer) window.clearTimeout(pressedTimer);
    pressedTimer = window.setTimeout(() => {
      pressedId = null;
      pressedTimer = null;
    }, 260);
    applyOutcome({
      id: `combo-${comboA}-${comboB}`,
      label: `${first.label} + ${second.label}`,
      points: first.points + second.points,
      type: "score"
    });
  };

  const applyHogCall = () => {
    hogCallError = "";
    const currentIndex = players.findIndex((player) => player.id === currentPlayerId);
    if (currentIndex === -1) {
      hogCallError = "Pick a current player before applying a hog call.";
      return;
    }
    if (!lastRoll || lastRoll.type !== "score") {
      hogCallError = "Hog call applies only to the most recent scoring roll.";
      return;
    }
    if (!hogCallerId) {
      hogCallError = "Select a hog caller.";
      return;
    }

    const callerId = Number(hogCallerId);
    if (!Number.isFinite(callerId)) {
      hogCallError = "Select a valid hog caller.";
      return;
    }

    const callerIndex = players.findIndex((player) => player.id === callerId);
    if (callerIndex === -1) {
      hogCallError = "Select a valid hog caller.";
      return;
    }

    pushHistory();
    const points = lastRoll.points * 2;
    const callerName = displayNameFor(players[callerIndex], callerIndex);
    const currentName = displayNameFor(players[currentIndex], currentIndex);
    if (hogCallResult === "correct") {
      players = players.map((player, index) => {
        if (index === callerIndex) {
          return { ...player, score: player.score + points };
        }
        if (index === currentIndex) {
          return { ...player, score: Math.max(0, player.score - points) };
        }
        return player;
      });
      addLog(`Hog call correct: ${callerName} gains ${points}, ${currentName} loses ${points}.`, "hog");
      return;
    }

    players = players.map((player, index) => {
      if (index === callerIndex) {
        return { ...player, score: Math.max(0, player.score - points) };
      }
      if (index === currentIndex) {
        return { ...player, score: player.score + points };
      }
      return player;
    });
    addLog(`Hog call wrong: ${callerName} loses ${points}, ${currentName} gains ${points}.`, "hog");
  };

  $: currentIndex = players.findIndex((player) => player.id === currentPlayerId);
  $: currentPlayer = currentIndex >= 0 ? players[currentIndex] : null;
  $: winner = players.find((player) => !player.eliminated && player.score >= targetScore) ?? null;
  $: eligibleHogCallers = players.filter(
    (player) => !player.eliminated && player.id !== currentPlayerId && player.score >= 20
  );
  $: if (enableHogCall) {
    if (
      !hogCallerId ||
      !eligibleHogCallers.some((player) => String(player.id) === hogCallerId)
    ) {
      hogCallerId = eligibleHogCallers[0]?.id ? String(eligibleHogCallers[0].id) : "";
    }
  }

  const liveScoreFor = (player: Player) =>
    player.score + (player.id === currentPlayerId ? turnTotal : 0);

  onMount(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 720px)");
    let rafId = 0;

    const computeThreshold = () => {
      if (!rollHeader) return null;
      const rect = rollHeader.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const update = () => {
      const threshold = computeThreshold();
      if (threshold === null) {
        showSticky = false;
        return;
      }
      showSticky = media.matches && window.scrollY >= threshold;
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    media.addEventListener("change", scheduleUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      media.removeEventListener("change", scheduleUpdate);
    };
  });
</script>

<svelte:head>
  <title>Pass the Pigs</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="pigs-page">
  <a class="breadcrumb" href="{base}/games">&larr; Game Score Tools</a>

  <header class="hero">
    <p class="eyebrow">Pass the Pigs</p>
    <h1>Track every roll, bank, and hog call.</h1>
    <p class="subhead">
      Use the score buttons for each pig position, then bank when you want to
      lock in points. Special rolls reset or end a turn instantly.
    </p>
  </header>

  {#if winner}
    <div class="winner-banner">
      <strong>{displayNameFor(winner, players.indexOf(winner))}</strong> reaches {targetScore} points.
      Finish the round or reset for a new game.
    </div>
  {/if}

  {#if view === "setup"}
    <section class="setup-stage">
      <div class="panel setup-card">
        <div class="panel-head">
          <div>
            <h2>Table setup</h2>
            <p class="muted">Set the target score and player count before starting.</p>
          </div>
        </div>
        <div class="setup-controls">
          <label class="field">
            <span>Target score</span>
            <input
              class="number"
              type="number"
              min="50"
              max="500"
              step="10"
              value={targetScore}
              on:input={handleTargetChange}
            />
          </label>
          <div class="player-buttons">
            <button class="ghost" type="button" on:click={addPlayer}>
              + Add player
            </button>
            <button class="ghost" type="button" on:click={removePlayer}>
              - Remove player
            </button>
          </div>
        </div>
      </div>

      <div class="panel player-setup">
        <div class="panel-head">
          <div>
            <h2>Players</h2>
            <p class="muted">Name each player before the first roll.</p>
          </div>
        </div>
        <div class="player-grid">
          {#each players as player, index}
            <label class="field">
              <span>Player {index + 1}</span>
              <input
                type="text"
                value={player.name}
                on:input={(event) =>
                  setPlayerName(player.id, (event.currentTarget as HTMLInputElement).value)
                }
                aria-label={`Name for player ${index + 1}`}
              />
            </label>
          {/each}
        </div>
      </div>
    </section>

    <div class="setup-actions">
      <button class="primary start-button" type="button" on:click={startGame}>
        Start game
      </button>
    </div>
  {:else}
    {#if showSticky}
      <div class="mobile-sticky" aria-live="polite">
      <div class="sticky-actions">
        <button
          class="ghost icon-button"
          type="button"
          on:click={undoLastAction}
          disabled={history.length === 0}
          aria-label="Undo last action"
          title="Undo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M7.5 5.5a1 1 0 0 1 0 2H5.9l1.8 1.8a7 7 0 1 1 0 9.9 1 1 0 1 1 1.4-1.42 5 5 0 1 0 0-7.07L7.3 9.5H9.5a1 1 0 1 1 0 2H4.75a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75h2.75z"
            />
          </svg>
        </button>
        <button class="primary" type="button" on:click={bankPoints}>
          {turnTotal > 0 ? `Bank ${turnTotal}` : "Pass"}
        </button>
      </div>
    </div>
      <div class="mobile-sticky-spacer" aria-hidden="true"></div>
    {/if}

    <section class="dashboard">
      <div class="panel scoreboard">
        <div class="panel-head">
          <div>
            <h2>Scoreboard</h2>
            {#if currentPlayer}
              <p class="muted">Current turn: {displayNameFor(currentPlayer, currentIndex)}</p>
            {/if}
          </div>
          <div class="score-actions">
            <button class="primary" type="button" on:click={bankPoints}>
              {turnTotal > 0 ? `Bank ${turnTotal} pts` : "Pass turn"}
            </button>
            <button
              class="ghost"
              type="button"
              on:click={undoLastAction}
              disabled={history.length === 0}
            >
              Undo
            </button>
            <button class="ghost" type="button" on:click={returnToSetup}>
              Edit setup
            </button>
            <button class="ghost" type="button" on:click={resetGame}>
              {confirmReset ? "Confirm reset" : "Reset"}
            </button>
          </div>
        </div>

        <div class="score-grid" role="table" aria-label="Pass the Pigs score table">
          <div class="score-row header" role="row">
            <span class="cell" role="columnheader">Player</span>
            <span class="cell" role="columnheader">Banked</span>
            <span class="cell" role="columnheader">Live</span>
          </div>
          {#each players as player, index}
            <div
              class="score-row"
              class:active={player.id === currentPlayerId}
              class:eliminated={player.eliminated}
              role="row"
            >
              <div class="cell name">
                <span>{displayNameFor(player, index)}</span>
                {#if player.eliminated}
                  <span class="tag">Out</span>
                {/if}
              </div>
              <span class="cell" role="cell">{player.score}</span>
              <span class="cell live" role="cell">{liveScoreFor(player)}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="panel controls" bind:this={rollPanel}>
        <div class="panel-head">
        <div>
          <h2 bind:this={rollHeader}>Roll outcomes</h2>
            <p class="muted">Tap a result to add it to the current turn.</p>
          </div>
        </div>

        <div class="roll-grid">
          {#each standardOutcomes as outcome}
            <button
              class="roll-button"
              class:pressed={pressedId === outcome.id}
              type="button"
              on:click={() => applyOutcome(outcome)}
            >
              <span>{outcome.label}</span>
              <strong>{outcome.points} pts</strong>
            </button>
          {/each}
        </div>

        <div class="combo-panel">
          <h3>Mixed combo</h3>
          <p class="muted">
            Use this when each pig lands in a different non-sider position.
          </p>
          <div class="combo-inputs">
            <select bind:value={comboA}>
              {#each positionOptions as option}
                <option value={option.id}>{option.label} ({option.points})</option>
              {/each}
            </select>
            <select bind:value={comboB}>
              {#each positionOptions as option}
                <option value={option.id}>{option.label} ({option.points})</option>
              {/each}
            </select>
            <button
              class="primary"
              class:pressed={pressedId === "combo"}
              type="button"
              on:click={applyCombo}
            >
              Add combo
            </button>
          </div>
          {#if comboError}
            <p class="error" role="alert">{comboError}</p>
          {/if}
        </div>

        <div class="special-panel">
          <h3>Special rolls</h3>
        <div class="special-grid">
          {#each specialOutcomes as outcome}
            <button
              class="roll-button special"
              class:pressed={pressedId === outcome.id}
              type="button"
              on:click={() => applyOutcome(outcome)}
            >
              <span>{outcome.label}</span>
            </button>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <section class="panel rules">
      <div class="panel-head">
        <div>
          <h2>Turn recap</h2>
          <p class="muted">Latest rolls for this turn.</p>
        </div>
        <div class="pill">Turn total: {turnTotal}</div>
      </div>
      <div class="turn-log">
        {#if turnRolls.length === 0}
          <p class="muted">No rolls yet. Add an outcome to begin the turn.</p>
        {:else}
          {#each turnRolls as roll}
            <div class="turn-chip">
              <span>{roll.label}</span>
              <strong>+{roll.points}</strong>
            </div>
          {/each}
        {/if}
      </div>
    </section>

    <section class="panel hog-call">
      <div class="panel-head">
        <div>
          <h2>Hog Call mode</h2>
          <p class="muted">
            Optional rule: after a roll, a caller can win or lose double points.
          </p>
        </div>
        <label class="toggle">
          <input type="checkbox" bind:checked={enableHogCall} />
          <span>Enable Hog Call</span>
        </label>
      </div>

      {#if enableHogCall}
        <div class="hog-grid">
          <label class="field">
            <span>Caller (20+ points)</span>
            <select bind:value={hogCallerId}>
              {#if eligibleHogCallers.length === 0}
                <option value="">No eligible callers</option>
              {:else}
                {#each eligibleHogCallers as player, index}
                  <option value={String(player.id)}>{displayNameFor(player, index)}</option>
                {/each}
              {/if}
            </select>
          </label>

          <label class="field">
            <span>Call result</span>
            <select bind:value={hogCallResult}>
              <option value="correct">Correct</option>
              <option value="wrong">Wrong</option>
            </select>
          </label>

          <button class="primary" type="button" on:click={applyHogCall}>
            Apply hog call
          </button>
        </div>
        {#if hogCallError}
          <p class="error" role="alert">{hogCallError}</p>
        {/if}
      {/if}
    </section>

    <section class="panel activity">
      <div class="panel-head">
        <div>
          <h2>Game log</h2>
          <p class="muted">Latest actions, newest first.</p>
        </div>
      </div>
      <ul class="activity-list">
        {#if activityLog.length === 0}
          <li class="muted">No actions yet.</li>
        {:else}
          {#each activityLog as entry}
            <li class={entry.kind}>{entry.text}</li>
          {/each}
        {/if}
      </ul>
    </section>
  {/if}
</section>

<style>
  :global(main[data-page="pass-the-pigs"]) {
    --app-bg: radial-gradient(circle at top, #ffe9f0 0%, #fdf3e1 45%, #f8f2ff 100%);
    --app-text: #241b2e;
    --app-muted: #5a4c62;
    --app-accent: #f1547a;
    --app-accent-dark: #b63255;
    --app-card-bg: rgba(255, 255, 255, 0.9);
    --app-card-border: rgba(37, 24, 46, 0.12);
    --app-shadow: 0 18px 40px rgba(36, 27, 46, 0.15);
  }

  :global(:root[data-theme="dark"] main[data-page="pass-the-pigs"]) {
    --app-bg: radial-gradient(circle at top, #1a1522 0%, #171521 45%, #0f0c14 100%);
    --app-text: #f6eef7;
    --app-muted: #c7bdd2;
    --app-accent: #f5a4b6;
    --app-accent-dark: #ff6b91;
    --app-card-bg: rgba(28, 24, 36, 0.88);
    --app-card-border: rgba(247, 235, 252, 0.15);
    --app-shadow: 0 18px 40px rgba(7, 4, 10, 0.55);
  }

  .pigs-page {
    width: min(1150px, 100%);
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
    color: var(--app-text);
  }

  .breadcrumb {
    color: var(--app-muted);
    text-decoration: none;
    font-weight: 600;
  }

  .hero {
    display: grid;
    gap: 0.75rem;
  }

  .hero h1 {
    font-family: "Fraunces", "Times New Roman", serif;
    font-size: clamp(2.2rem, 3vw, 3.2rem);
    margin: 0;
  }

  .eyebrow {
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.24em;
    color: var(--app-muted);
    margin: 0;
  }

  .subhead {
    max-width: 620px;
    margin: 0;
    color: var(--app-muted);
  }

  .panel {
    background: var(--app-card-bg);
    border: 1px solid var(--app-card-border);
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: var(--app-shadow);
  }

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .panel h2 {
    margin: 0 0 0.25rem;
    font-family: "Fraunces", "Times New Roman", serif;
    font-size: 1.4rem;
  }

  .muted {
    color: var(--app-muted);
    margin: 0.1rem 0 0;
  }

  .setup-controls {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .field {
    display: grid;
    gap: 0.4rem;
    font-weight: 600;
  }

  .field span {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--app-muted);
  }

  .field input,
  .field select {
    font: inherit;
    padding: 0.5rem 0.65rem;
    border-radius: 12px;
    border: 1px solid var(--app-card-border);
    background: rgba(255, 255, 255, 0.8);
    color: var(--app-text);
  }

  :global(:root[data-theme="dark"]) .field input,
  :global(:root[data-theme="dark"]) .field select {
    background: rgba(18, 15, 24, 0.9);
  }

  .number {
    width: 120px;
  }

  .player-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .setup-stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1.5rem;
  }

  .player-setup .panel-head {
    margin-bottom: 0.5rem;
  }

  .player-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.9rem;
  }

  .winner-banner {
    background: rgba(241, 84, 122, 0.16);
    border: 1px solid rgba(241, 84, 122, 0.4);
    padding: 0.85rem 1.2rem;
    border-radius: 16px;
    font-weight: 600;
  }

  .dashboard {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 1.5rem;
  }

  .scoreboard {
    display: grid;
    gap: 0.75rem;
    align-content: start;
  }

  .score-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .primary,
  .ghost {
    font: inherit;
    border-radius: 999px;
    padding: 0.85rem 1.85rem;
    border: 1px solid transparent;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.02rem;
    line-height: 1.1;
    min-height: 48px;
  }

  .start-button {
    padding: 0.95rem 2.2rem;
    font-size: 1.1rem;
    min-height: 54px;
  }

  .setup-actions {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .primary {
    background: var(--app-accent);
    color: #fff;
    box-shadow: 0 10px 20px rgba(241, 84, 122, 0.35);
  }

  .ghost {
    background: transparent;
    border-color: var(--app-card-border);
    color: var(--app-text);
  }

  .ghost:disabled,
  .primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .score-grid {
    display: grid;
    gap: 0.6rem;
    margin-top: 0.2rem;
  }

  .score-row {
    display: grid;
    grid-template-columns: minmax(140px, 1.4fr) repeat(2, minmax(80px, 1fr));
    gap: 0.75rem;
    align-items: center;
    padding: 0.6rem 0.8rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid transparent;
  }

  :global(:root[data-theme="dark"]) .score-row {
    background: rgba(28, 24, 36, 0.75);
  }

  .score-row.header {
    background: transparent;
    border: none;
    padding: 0 0.8rem;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    color: var(--app-muted);
  }

  .score-row.active {
    border-color: var(--app-accent);
    box-shadow: inset 0 0 0 1px rgba(241, 84, 122, 0.3);
  }

  .score-row.eliminated {
    opacity: 0.6;
  }

  .cell {
    font-weight: 600;
  }

  .cell.name {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .name-input {
    font: inherit;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    color: inherit;
    width: 100%;
  }

  .name-input:focus {
    outline: none;
    border-color: var(--app-accent);
  }

  .tag {
    background: rgba(241, 84, 122, 0.2);
    color: var(--app-accent-dark);
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .cell.live {
    color: var(--app-accent-dark);
  }

  .controls {
    display: grid;
    gap: 1.5rem;
  }

  .roll-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .roll-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    padding: 0.75rem 0.9rem;
    border-radius: 16px;
    border: 1px solid var(--app-card-border);
    background: rgba(255, 255, 255, 0.8);
    font: inherit;
    cursor: pointer;
    text-align: left;
  }

  .roll-button strong {
    font-size: 1.05rem;
  }

  .roll-button.special {
    background: rgba(241, 84, 122, 0.12);
    border-color: rgba(241, 84, 122, 0.35);
  }

  :global(:root[data-theme="dark"]) .roll-button {
    background: rgba(24, 20, 32, 0.85);
  }

  .combo-panel,
  .special-panel {
    border-top: 1px solid var(--app-card-border);
    padding-top: 1rem;
  }

  .combo-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
    align-items: end;
  }

  .combo-inputs select {
    font: inherit;
    padding: 0.5rem 0.65rem;
    border-radius: 12px;
    border: 1px solid var(--app-card-border);
    background: rgba(255, 255, 255, 0.8);
    color: var(--app-text);
  }

  :global(:root[data-theme="dark"]) .combo-inputs select {
    background: rgba(18, 15, 24, 0.9);
  }

  .special-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .rules {
    display: grid;
    gap: 1rem;
  }

  .pill {
    padding: 0.35rem 0.8rem;
    border-radius: 999px;
    background: rgba(241, 84, 122, 0.15);
    font-weight: 600;
  }

  .turn-log {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .turn-chip {
    padding: 0.4rem 0.7rem;
    border-radius: 999px;
    background: rgba(90, 76, 98, 0.12);
    font-weight: 600;
  }

  .hog-call .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .hog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .error {
    margin-top: 0.75rem;
    color: var(--app-accent-dark);
    font-weight: 600;
  }

  .activity-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.6rem;
  }

  .activity-list li {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    padding: 0.6rem 0.8rem;
  }

  :global(:root[data-theme="dark"]) .activity-list li {
    background: rgba(28, 24, 36, 0.75);
  }

  .activity-list li.bank {
    border-left: 4px solid var(--app-accent);
  }

  .activity-list li.special {
    border-left: 4px solid var(--app-accent-dark);
  }

  .activity-list li.hog {
    border-left: 4px solid #f3a62f;
  }

  .mobile-sticky {
    position: fixed;
    top: 0.75rem;
    left: 1rem;
    right: 1rem;
    z-index: 20;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.6rem 0.9rem;
    border-radius: 16px;
    background: var(--app-card-bg);
    border: 1px solid var(--app-card-border);
    box-shadow: var(--app-shadow);
    backdrop-filter: blur(6px);
  }

  .sticky-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }

  .icon-button {
    width: 46px;
    height: 46px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 980px) {
    .dashboard {
      grid-template-columns: 1fr;
    }

    .setup-stage {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .score-row {
      grid-template-columns: minmax(120px, 1fr) repeat(2, minmax(70px, 1fr));
    }
  }

  .roll-button:active,
  .primary:active,
  .ghost:active {
    transform: translateY(1px) scale(0.98);
  }

  .pressed {
    animation: pulse 0.25s ease-out;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(241, 84, 122, 0.4);
    }
    100% {
      box-shadow: 0 0 0 10px rgba(241, 84, 122, 0);
    }
  }
</style>
