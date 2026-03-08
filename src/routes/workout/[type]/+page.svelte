<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';
  import { createSupabase } from '$lib/supabase';
  import {
    DEFAULT_WORKOUT_DEFS,
    REST_SECONDS,
    TIMER_CIRCUMFERENCE,
    formatTime,
    getPrevBest
  } from '$lib/workout';
  import type {
    WorkoutType,
    ExerciseDef,
    SetEntry,
    SessionExercise,
    WorkoutSession
  } from '$lib/workout';
  import type { User, SupabaseClient } from '@supabase/supabase-js';

  export let data: { type: WorkoutType };

  const LABELS: Record<WorkoutType, string> = { push: 'Push', pull: 'Pull', legs: 'Legs' };

  // ─── State ─────────────────────────────────────────────────────────────────
  let supabase: SupabaseClient | null = null;
  let user: User | null = null;
  let loading = true;
  let exercises: ExerciseDef[] = [];
  let exerciseSets: SetEntry[][] = [];   // sets logged this session, per exercise
  let exerciseInputs: string[] = [];     // current text-input value, per exercise
  let activeIndex = 0;                   // which exercise card is expanded
  let lastSession: WorkoutSession | null = null;
  let sessionStartedAt = 0;
  let workoutDone = false;
  let savingWorkout = false;
  let saveError = '';

  // ─── Edit mode ─────────────────────────────────────────────────────────────
  let editingIndex: number | null = null;
  let editName = '';
  let editNote = '';
  let editSets = 3;

  // ─── Timer ─────────────────────────────────────────────────────────────────
  let timerSecondsLeft = 0;
  let timerActive = false;
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  $: timerOffset = TIMER_CIRCUMFERENCE * (1 - timerSecondsLeft / REST_SECONDS);
  $: timerLabel = timerActive ? formatTime(timerSecondsLeft) : 'Rest';

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerSecondsLeft = REST_SECONDS;
    timerActive = true;
    timerInterval = setInterval(() => {
      timerSecondsLeft = Math.max(0, timerSecondsLeft - 1);
      if (timerSecondsLeft === 0) {
        timerActive = false;
        clearInterval(timerInterval!);
        timerInterval = null;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    }, 1000);
  }

  function skipTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerActive = false;
    timerSecondsLeft = 0;
    timerInterval = null;
  }

  function addThirtySeconds() {
    timerSecondsLeft = Math.min(timerSecondsLeft + 30, 600);
    if (!timerActive) {
      timerActive = true;
    }
  }

  // ─── Set logging ───────────────────────────────────────────────────────────
  function logSet(exIdx: number) {
    const raw = exerciseInputs[exIdx].trim();
    const value = parseFloat(raw);
    if (!raw || isNaN(value) || value <= 0) return;

    const lastEx = getLastSessionExercise(exIdx);
    const prevBest = getPrevBest(lastEx);
    const isPR = prevBest > 0 && value > prevBest;

    exerciseSets[exIdx] = [...exerciseSets[exIdx], { value, pr: isPR }];
    exerciseSets = [...exerciseSets];
    startTimer();
  }

  function handleKeydown(e: KeyboardEvent, exIdx: number) {
    if (e.key === 'Enter') logSet(exIdx);
  }

  function getLastSessionExercise(exIdx: number): SessionExercise | undefined {
    if (!lastSession) return undefined;
    return lastSession.exercises.find((e) => e.exerciseId === exercises[exIdx].id);
  }

  function getLastSessionSets(exIdx: number): SetEntry[] {
    return getLastSessionExercise(exIdx)?.sets ?? [];
  }

  function getDefaultInput(exIdx: number): string {
    const prev = getLastSessionSets(exIdx);
    if (prev.length > 0) return String(prev[prev.length - 1].value);
    return '';
  }

  // ─── Edit exercise ─────────────────────────────────────────────────────────
  function openEdit(exIdx: number) {
    editingIndex = exIdx;
    editName = exercises[exIdx].name;
    editNote = exercises[exIdx].note ?? '';
    editSets = exercises[exIdx].defaultSets;
  }

  function cancelEdit() {
    editingIndex = null;
  }

  async function saveEdit() {
    if (editingIndex === null) return;
    const i = editingIndex;
    exercises[i] = { ...exercises[i], name: editName.trim() || exercises[i].name, note: editNote.trim() || undefined, defaultSets: Math.max(1, editSets) };
    exercises = [...exercises];
    editingIndex = null;
    if (supabase && user) {
      await supabase.from('workout_defs').upsert({
        user_id: user.id,
        type: data.type,
        exercises: exercises
      }, { onConflict: 'user_id,type' });
    }
  }

  // ─── Finish workout ─────────────────────────────────────────────────────────
  async function finishWorkout() {
    if (!supabase || !user) return;
    savingWorkout = true;
    saveError = '';
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      user_id: user.id,
      type: data.type,
      date: new Date().toISOString().split('T')[0],
      started_at: new Date(sessionStartedAt).toISOString(),
      completed_at: new Date().toISOString(),
      exercises: exercises
        .map((ex, i) => ({ exerciseId: ex.id, sets: exerciseSets[i] }))
        .filter((ex) => ex.sets.length > 0)
    };
    const { error } = await supabase.from('workout_sessions').insert(session);
    savingWorkout = false;
    if (error) {
      saveError = error.message;
    } else {
      skipTimer();
      workoutDone = true;
    }
  }

  // ─── Data loading ──────────────────────────────────────────────────────────
  async function loadData(sb: SupabaseClient, uid: string) {
    // Load custom exercise defs if user has modified them
    const { data: defsRow } = await sb
      .from('workout_defs')
      .select('exercises')
      .eq('user_id', uid)
      .eq('type', data.type)
      .single();

    const defaultDef = DEFAULT_WORKOUT_DEFS.find((w) => w.type === data.type)!;
    exercises = (defsRow?.exercises as ExerciseDef[] | null) ?? defaultDef.exercises;

    // Load last session for reference weights
    const { data: sessions } = await sb
      .from('workout_sessions')
      .select('*')
      .eq('user_id', uid)
      .eq('type', data.type)
      .order('started_at', { ascending: false })
      .limit(1);

    lastSession = sessions?.[0] ?? null;

    // Init per-exercise state
    exerciseSets = exercises.map(() => []);
    exerciseInputs = exercises.map((_, i) => getDefaultInput(i));
    sessionStartedAt = Date.now();
    loading = false;
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  onMount(() => {
    supabase = createSupabase();
    if (!supabase) { loading = false; return; }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      user = session?.user ?? null;
      if (user && supabase) await loadData(supabase, user.id);
      else if (!user) loading = false;
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      user = session?.user ?? null;
      if (user && supabase) await loadData(supabase, user.id);
      else loading = false;
    });

    return () => {
      subscription.unsubscribe();
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  $: totalSets = exerciseSets.reduce((sum, sets) => sum + sets.length, 0);
</script>

<svelte:head>
  <title>{LABELS[data.type]} Workout</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="tracker-page">

  <!-- ─── Timer bar ─── -->
  <div class="timer-bar" class:timer-active={timerActive} class:timer-idle={!timerActive} aria-live="polite">
    <div class="timer-ring-wrap">
      <svg class="timer-ring" width="52" height="52" viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="none" stroke="var(--ring-track)" stroke-width="5"/>
        <circle
          cx="40" cy="40" r="38"
          fill="none"
          stroke="var(--ring-fill)"
          stroke-width="5"
          stroke-dasharray="{TIMER_CIRCUMFERENCE}"
          stroke-dashoffset="{timerOffset}"
          stroke-linecap="round"
          transform="rotate(-90 40 40)"
          style="transition: stroke-dashoffset 1s linear;"
        />
      </svg>
      <span class="timer-label">{timerActive ? timerLabel : '—'}</span>
    </div>
    <div class="timer-text">
      {#if timerActive}
        <span class="timer-status">Rest · {timerLabel}</span>
        <span class="timer-hint">Next set after the timer</span>
      {:else}
        <span class="timer-status">Ready</span>
        <span class="timer-hint">Log a set to start the rest timer</span>
      {/if}
    </div>
    <div class="timer-actions">
      {#if timerActive}
        <button class="timer-btn" on:click={addThirtySeconds} title="+30s">+30s</button>
        <button class="timer-btn timer-btn-skip" on:click={skipTimer} title="Skip rest">Skip</button>
      {/if}
    </div>
  </div>

  <!-- ─── Header ─── -->
  <div class="page-header">
    <a class="breadcrumb" href="{base}/workout/">← Workouts</a>
    <div class="header-meta">
      <h1>{LABELS[data.type]}</h1>
      {#if !loading && !workoutDone && totalSets > 0}
        <span class="sets-badge">{totalSets} sets logged</span>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="loading-state">
      <span class="spinner" aria-label="Loading…"></span>
    </div>
  {:else if !user}
    <div class="auth-notice">
      <p>Sign in at <a href="{base}/workout/">Workouts</a> to track your sessions.</p>
    </div>
  {:else if workoutDone}
    <!-- ─── Done screen ─── -->
    <div class="done-card">
      <div class="done-icon" aria-hidden="true">🏆</div>
      <h2 class="done-title">Workout complete!</h2>
      <p class="done-meta">{totalSets} sets · {LABELS[data.type]}</p>
      <a class="primary-btn" href="{base}/workout/">Back to Workouts</a>
    </div>
  {:else}
    <!-- ─── Exercise list ─── -->
    <div class="exercise-list">
      {#each exercises as exercise, exIdx}
        {@const isActive = activeIndex === exIdx}
        {@const loggedSets = exerciseSets[exIdx]}
        {@const prevSets = getLastSessionSets(exIdx)}
        {@const isDone = loggedSets.length >= exercise.defaultSets && !isActive}

        <div
          class="exercise-card"
          class:is-active={isActive}
          class:is-done={isDone && !isActive}
        >
          <!-- Card header -->
          <button
            class="exercise-header"
            on:click={() => { activeIndex = exIdx; editingIndex = null; }}
            aria-expanded={isActive}
          >
            <div class="exercise-title-row">
              {#if isDone && !isActive}
                <span class="done-check" aria-hidden="true">✓</span>
              {/if}
              <span class="exercise-name">{exercise.name}</span>
              {#if exercise.note}
                <span class="exercise-note">{exercise.note}</span>
              {/if}
            </div>
            <div class="exercise-summary">
              {#if loggedSets.length > 0}
                <span class="set-pills">
                  {#each loggedSets as s}
                    <span class="set-pill" class:set-pill-pr={s.pr}>{s.value}</span>
                  {/each}
                </span>
              {:else}
                <span class="exercise-count">{exercise.defaultSets} sets</span>
              {/if}
            </div>
          </button>

          {#if isActive}
            <!-- Edit overlay -->
            {#if editingIndex === exIdx}
              <div class="edit-form">
                <div class="edit-row">
                  <label class="edit-label" for="edit-name-{exIdx}">Exercise name</label>
                  <input id="edit-name-{exIdx}" class="edit-input" type="text" bind:value={editName} />
                </div>
                <div class="edit-row">
                  <label class="edit-label" for="edit-note-{exIdx}">Note (optional)</label>
                  <input id="edit-note-{exIdx}" class="edit-input" type="text" placeholder="e.g. grade 4, 15 reps" bind:value={editNote} />
                </div>
                <div class="edit-row">
                  <label class="edit-label" for="edit-sets-{exIdx}">Default sets</label>
                  <input id="edit-sets-{exIdx}" class="edit-input edit-input-small" type="number" min="1" max="20" bind:value={editSets} />
                </div>
                <div class="edit-actions">
                  <button class="ghost-btn" on:click={cancelEdit}>Cancel</button>
                  <button class="primary-btn" on:click={saveEdit}>Save</button>
                </div>
              </div>
            {:else}
              <!-- Active exercise body -->
              <div class="exercise-body">
                <!-- Last session row -->
                {#if prevSets.length > 0}
                  <div class="prev-row">
                    <span class="prev-label">Last session</span>
                    <span class="prev-pills">
                      {#each prevSets as s}
                        <span class="prev-pill">{s.value}</span>
                      {/each}
                    </span>
                  </div>
                {:else}
                  <p class="prev-none">No previous data for this exercise.</p>
                {/if}

                <!-- Set log row -->
                {#if loggedSets.length > 0}
                  <div class="logged-row">
                    <span class="prev-label">This session</span>
                    <span class="prev-pills">
                      {#each loggedSets as s}
                        <span class="set-pill" class:set-pill-pr={s.pr}>{s.value}</span>
                      {/each}
                    </span>
                  </div>
                {/if}

                <!-- Input row -->
                <div class="input-row">
                  <input
                    class="set-input"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Weight / reps"
                    bind:value={exerciseInputs[exIdx]}
                    on:keydown={(e) => handleKeydown(e, exIdx)}
                    aria-label="Set value"
                  />
                  <button
                    class="primary-btn log-btn"
                    on:click={() => logSet(exIdx)}
                    disabled={!exerciseInputs[exIdx] || isNaN(parseFloat(exerciseInputs[exIdx]))}
                  >
                    Log set
                  </button>
                </div>

                <!-- Footer actions -->
                <div class="card-footer">
                  <button class="ghost-btn" on:click={() => openEdit(exIdx)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Edit
                  </button>
                  {#if exIdx < exercises.length - 1}
                    <button class="ghost-btn next-btn" on:click={() => (activeIndex = exIdx + 1)}>
                      Next exercise →
                    </button>
                  {/if}
                </div>
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>

    <!-- ─── Finish button ─── -->
    <div class="finish-row">
      {#if saveError}
        <p class="save-error">{saveError}</p>
      {/if}
      <button
        class="finish-btn"
        on:click={finishWorkout}
        disabled={savingWorkout || totalSets === 0}
      >
        {savingWorkout ? 'Saving…' : 'Finish workout'}
      </button>
    </div>
  {/if}
</div>

<style>
  :global(main[data-page="workout-active"]) {
    --app-bg: radial-gradient(circle at top, #fdf6ee 0%, #f5f0ea 45%, #fdf6ee 100%);
    --app-text: #1c1410;
    --app-muted: #6b5a4e;
    --app-accent: #c45c1a;
    --app-card-bg: #fffaf5;
    --app-card-border: rgba(30, 18, 8, 0.1);
    --app-card-shadow: 0 8px 24px rgba(30, 18, 8, 0.07);
    --app-thumb-bg: #fef0e4;
    --ring-track: rgba(30, 18, 8, 0.1);
    --ring-fill: #c45c1a;
    --pr-color: #d4900a;
  }

  :global(:root[data-theme="dark"] main[data-page="workout-active"]) {
    --app-bg: radial-gradient(circle at top, #150f0a 0%, #1c150e 45%, #1a130c 100%);
    --app-text: #f5ede4;
    --app-muted: #b09080;
    --app-accent: #f97316;
    --app-card-bg: #201710;
    --app-card-border: rgba(245, 237, 228, 0.1);
    --app-card-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    --app-thumb-bg: #2a1c12;
    --ring-track: rgba(245, 237, 228, 0.12);
    --ring-fill: #f97316;
    --pr-color: #f59e0b;
  }

  .tracker-page {
    width: min(680px, 100%);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    color: var(--app-text);
    padding-bottom: 2rem;
  }

  /* ─── Timer bar ─── */
  .timer-bar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1.25rem;
    border-radius: 18px;
    border: 1px solid var(--app-card-border);
    background: var(--app-card-bg);
    box-shadow: var(--app-card-shadow);
    backdrop-filter: blur(12px);
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .timer-active {
    border-color: var(--app-accent);
    background: color-mix(in srgb, var(--app-card-bg) 85%, var(--app-accent) 15%);
  }

  .timer-ring-wrap {
    position: relative;
    width: 52px;
    height: 52px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
  }

  .timer-ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .timer-label {
    position: relative;
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--app-accent);
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
  }

  .timer-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .timer-status {
    font-weight: 700;
    font-size: 1rem;
  }

  .timer-hint {
    font-size: 0.8rem;
    color: var(--app-muted);
  }

  .timer-actions {
    display: flex;
    gap: 0.5rem;
    flex: 0 0 auto;
  }

  .timer-btn {
    background: none;
    border: 1px solid var(--app-card-border);
    border-radius: 999px;
    color: var(--app-text);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.35rem 0.8rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .timer-btn:hover {
    background: var(--app-thumb-bg);
  }

  .timer-btn-skip {
    color: var(--app-accent);
    border-color: var(--app-accent);
  }

  /* ─── Page header ─── */
  .page-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .breadcrumb {
    text-decoration: none;
    color: var(--app-muted);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .breadcrumb:hover { color: var(--app-text); }

  .header-meta {
    display: flex;
    align-items: baseline;
    gap: 1rem;
  }

  h1 {
    font-family: 'Source Serif 4', 'Times New Roman', serif;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    margin: 0;
  }

  .sets-badge {
    font-size: 0.85rem;
    color: var(--app-accent);
    font-weight: 700;
    background: var(--app-thumb-bg);
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
  }

  /* ─── Loading / auth ─── */
  .loading-state {
    display: flex;
    justify-content: center;
    padding: 3rem 0;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--app-card-border);
    border-top-color: var(--app-accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: block;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-notice {
    text-align: center;
    color: var(--app-muted);
    padding: 2rem;
  }

  .auth-notice a {
    color: var(--app-accent);
  }

  /* ─── Exercise cards ─── */
  .exercise-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .exercise-card {
    border-radius: 20px;
    border: 1px solid var(--app-card-border);
    background: var(--app-card-bg);
    box-shadow: var(--app-card-shadow);
    overflow: hidden;
    transition: border-color 0.2s ease;
  }

  .exercise-card.is-active {
    border-color: var(--app-accent);
  }

  .exercise-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    color: inherit;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
  }

  .exercise-title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex-wrap: wrap;
  }

  .done-check {
    color: var(--app-accent);
    font-weight: 700;
    flex: 0 0 auto;
  }

  .exercise-name {
    font-weight: 700;
    font-size: 1rem;
  }

  .exercise-note {
    font-size: 0.78rem;
    color: var(--app-muted);
    background: var(--app-thumb-bg);
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-weight: 600;
  }

  .exercise-summary {
    flex: 0 0 auto;
  }

  .exercise-count {
    font-size: 0.8rem;
    color: var(--app-muted);
  }

  /* ─── Set pills ─── */
  .set-pills,
  .prev-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .set-pill,
  .prev-pill {
    display: inline-block;
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 6px;
    font-variant-numeric: tabular-nums;
  }

  .prev-pill {
    background: var(--app-thumb-bg);
    color: var(--app-muted);
  }

  .set-pill {
    background: var(--app-thumb-bg);
    color: var(--app-text);
  }

  .set-pill-pr {
    background: color-mix(in srgb, var(--pr-color) 15%, transparent);
    color: var(--pr-color);
    outline: 1px solid color-mix(in srgb, var(--pr-color) 40%, transparent);
  }

  /* ─── Exercise body (active) ─── */
  .exercise-body {
    padding: 0 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-top: 1px solid var(--app-card-border);
  }

  .prev-row,
  .logged-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding-top: 1rem;
  }

  .prev-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--app-muted);
    flex: 0 0 auto;
  }

  .prev-none {
    font-size: 0.85rem;
    color: var(--app-muted);
    margin: 0.75rem 0 0;
    font-style: italic;
  }

  /* ─── Input row ─── */
  .input-row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .set-input {
    flex: 1;
    height: 52px;
    border-radius: 12px;
    border: 1px solid var(--app-card-border);
    background: var(--app-thumb-bg);
    color: var(--app-text);
    font-family: inherit;
    font-size: 1.3rem;
    font-weight: 700;
    text-align: center;
    font-variant-numeric: tabular-nums;
    padding: 0 1rem;
    outline: none;
    transition: border-color 0.15s ease;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  .set-input::-webkit-outer-spin-button,
  .set-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .set-input:focus {
    border-color: var(--app-accent);
  }

  /* ─── Buttons ─── */
  .primary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.7rem 1.4rem;
    border-radius: 12px;
    border: none;
    background: var(--app-accent);
    color: #fff;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
    white-space: nowrap;
  }

  .primary-btn:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .primary-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .log-btn {
    height: 52px;
    border-radius: 12px;
    padding: 0 1.4rem;
  }

  .ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.9rem;
    border-radius: 10px;
    border: 1px solid var(--app-card-border);
    background: none;
    color: var(--app-muted);
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .ghost-btn:hover {
    color: var(--app-text);
    background: var(--app-thumb-bg);
  }

  /* ─── Card footer ─── */
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .next-btn {
    color: var(--app-accent);
    border-color: var(--app-accent);
  }

  /* ─── Edit form ─── */
  .edit-form {
    padding: 1rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    border-top: 1px solid var(--app-card-border);
  }

  .edit-row {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .edit-label {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--app-muted);
  }

  .edit-input {
    height: 44px;
    border-radius: 10px;
    border: 1px solid var(--app-card-border);
    background: var(--app-thumb-bg);
    color: var(--app-text);
    font-family: inherit;
    font-size: 0.95rem;
    padding: 0 0.85rem;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .edit-input:focus {
    border-color: var(--app-accent);
  }

  .edit-input-small {
    max-width: 100px;
  }

  .edit-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  /* ─── Done card ─── */
  .done-card {
    padding: 3rem 2rem;
    border-radius: 24px;
    background: var(--app-card-bg);
    border: 1px solid var(--app-card-border);
    box-shadow: var(--app-card-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
  }

  .done-icon {
    font-size: 3rem;
  }

  .done-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  .done-meta {
    color: var(--app-muted);
    margin: 0;
  }

  /* ─── Finish row ─── */
  .finish-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
  }

  .finish-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.9rem 2.5rem;
    border-radius: 14px;
    border: none;
    background: var(--app-accent);
    color: #fff;
    font-family: inherit;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .finish-btn:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-2px);
  }

  .finish-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .save-error {
    font-size: 0.85rem;
    color: #e53e3e;
    margin: 0;
  }

  /* ─── Responsive ─── */
  @media (max-width: 600px) {
    .timer-bar {
      position: sticky;
      top: 0;
      border-radius: 0 0 16px 16px;
    }

    .input-row {
      flex-direction: column;
    }

    .set-input,
    .log-btn {
      width: 100%;
    }

    .card-footer {
      justify-content: stretch;
    }

    .next-btn {
      flex: 1;
      justify-content: center;
    }
  }
</style>
