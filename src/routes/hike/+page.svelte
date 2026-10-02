<script lang="ts">
  import { onMount } from "svelte";
  import {
    HIKE_OPTIONS,
    fetchVotes,
    sameName,
    submitVote,
    type HikeVote
  } from "$lib/hike-poll";

  const nameStorageKey = "hike-poll-name";

  let votes: HikeVote[] = [];
  let name = "";
  let selected: string[] = [];
  let loading = true;
  let saving = false;
  let justSaved = false;
  let error = "";

  $: votersByDate = Object.fromEntries(
    HIKE_OPTIONS.map((option) => [
      option.date,
      votes.filter((vote) => vote.dates.includes(option.date)).map((vote) => vote.name)
    ])
  ) as Record<string, string[]>;
  $: topCount = Math.max(0, ...Object.values(votersByDate).map((voters) => voters.length));
  $: existingVote = votes.find((vote) => sameName(vote.name, name));
  $: canSubmit = name.trim().length > 0 && !saving && !loading;

  const loadExistingPicks = () => {
    if (existingVote) selected = [...existingVote.dates];
  };

  const toggle = (date: string) => {
    justSaved = false;
    selected = selected.includes(date)
      ? selected.filter((value) => value !== date)
      : [...selected, date];
  };

  const load = async () => {
    loading = true;
    error = "";
    try {
      votes = await fetchVotes();
      loadExistingPicks();
    } catch {
      error = "Couldn't load votes.";
    } finally {
      loading = false;
    }
  };

  const submit = async () => {
    if (!canSubmit) return;
    saving = true;
    error = "";
    try {
      votes = await submitVote(name.trim(), selected);
      justSaved = true;
      try {
        localStorage.setItem(nameStorageKey, name.trim());
      } catch {
        // Ignore storage failures.
      }
    } catch {
      error = "Couldn't save. Try again.";
    } finally {
      saving = false;
    }
  };

  onMount(() => {
    try {
      const storedName = localStorage.getItem(nameStorageKey);
      if (storedName && !name) name = storedName;
    } catch {
      // Ignore storage failures.
    }
    load();
  });
</script>

<svelte:head>
  <title>When should the hike be?</title>
  <meta property="og:title" content="When should the hike be?" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="poll">
  <h1>When should the hike be?</h1>

  <form on:submit|preventDefault={submit}>
    <input
      class="name"
      type="text"
      bind:value={name}
      on:input={() => (justSaved = false)}
      on:change={loadExistingPicks}
      placeholder="Your name"
      aria-label="Your name"
      autocomplete="given-name"
      maxlength="40"
    />

    <ul class="options">
      {#each HIKE_OPTIONS as option (option.date)}
        {@const voters = votersByDate[option.date] ?? []}
        {@const isSelected = selected.includes(option.date)}
        <li>
          <button
            type="button"
            class="option"
            class:selected={isSelected}
            class:top={topCount > 0 && voters.length === topCount}
            aria-pressed={isSelected}
            on:click={() => toggle(option.date)}
          >
            <span class="check" aria-hidden="true">
              <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
            </span>
            <span class="label">{option.label}</span>
            {#if voters.length > 0}
              <span class="count" aria-label="{voters.length} votes">{voters.length}</span>
            {/if}
            {#if voters.length > 0}
              <span class="voters">{voters.join(", ")}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>

    <button class="submit" type="submit" disabled={!canSubmit}>
      {#if saving}
        Saving…
      {:else if justSaved}
        Saved ✓
      {:else if existingVote}
        Update
      {:else}
        Submit
      {/if}
    </button>

    {#if error}
      <p class="error" role="alert">
        {error}
        {#if !saving}<button type="button" class="retry" on:click={load}>Reload</button>{/if}
      </p>
    {/if}
  </form>

  {#if votes.length > 0}
    <p class="voted">
      <span>Voted</span>
      {votes.map((vote) => vote.name).join(", ")}
    </p>
  {:else if loading}
    <p class="voted">Loading…</p>
  {/if}
</div>

<style>
  :global(main[data-page="hike"]) {
    --app-bg: linear-gradient(180deg, #eef3ea 0%, #f6f3ec 60%, #f3ede2 100%);
    --app-text: #1d2a1f;
    --hike-surface: rgba(255, 255, 255, 0.78);
    --hike-border: rgba(29, 42, 31, 0.12);
    --hike-muted: #5c6b5e;
    --hike-accent: #2f6b45;
    --hike-accent-soft: #dcebdc;
    --hike-accent-text: #ffffff;
    --hike-top: #c9822f;
  }

  :global(:root[data-theme="dark"] main[data-page="hike"]) {
    --app-bg: linear-gradient(180deg, #121a15 0%, #151a17 60%, #1a1a16 100%);
    --app-text: #eef2ec;
    --hike-surface: rgba(255, 255, 255, 0.05);
    --hike-border: rgba(238, 242, 236, 0.14);
    --hike-muted: #a3b2a5;
    --hike-accent: #6fbf8a;
    --hike-accent-soft: rgba(111, 191, 138, 0.16);
    --hike-accent-text: #0f1a13;
    --hike-top: #e3a654;
  }

  .poll {
    width: 100%;
    max-width: 440px;
    font-family: "Space Grotesk", system-ui, sans-serif;
    color: var(--app-text);
  }

  h1 {
    margin: 0.75rem 0 1.5rem;
    padding-right: 72px;
    font-size: clamp(1.75rem, 7vw, 2.25rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .name {
    width: 100%;
    font: inherit;
    font-size: 1.1rem;
    padding: 0.9rem 1rem;
    border-radius: 14px;
    border: 1px solid var(--hike-border);
    background: var(--hike-surface);
    color: var(--app-text);
  }

  .name:focus {
    outline: 2px solid var(--hike-accent);
    outline-offset: 1px;
  }

  .options {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }

  .option {
    width: 100%;
    min-height: 64px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    column-gap: 0.6rem;
    row-gap: 0.25rem;
    padding: 0.8rem 0.85rem;
    border-radius: 14px;
    border: 1px solid var(--hike-border);
    background: var(--hike-surface);
    color: var(--app-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .option.selected {
    background: var(--hike-accent-soft);
    border-color: var(--hike-accent);
  }

  .option.top .count {
    background: var(--hike-top);
    color: #fff;
  }

  .check {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    border: 1.5px solid var(--hike-border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .check svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: var(--hike-accent-text);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
  }

  .selected .check {
    background: var(--hike-accent);
    border-color: var(--hike-accent);
  }

  .selected .check svg {
    opacity: 1;
  }

  .label {
    font-size: 1.1rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .count {
    min-width: 1.6rem;
    height: 1.6rem;
    padding: 0 0.4rem;
    border-radius: 999px;
    background: var(--hike-border);
    font-size: 0.85rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .voters {
    grid-column: 1 / -1;
    font-size: 0.8rem;
    line-height: 1.3;
    color: var(--hike-muted);
    overflow-wrap: anywhere;
  }

  .submit {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 14px;
    background: var(--hike-accent);
    color: var(--hike-accent-text);
    font: inherit;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
  }

  .submit:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .error {
    margin: 0;
    color: #c0392b;
    font-size: 0.95rem;
  }

  .retry {
    margin-left: 0.4rem;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }

  .voted {
    margin: 1.5rem 0 0;
    font-size: 0.95rem;
    color: var(--hike-muted);
    line-height: 1.5;
  }

  .voted span {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
