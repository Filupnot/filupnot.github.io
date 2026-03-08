<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { createSupabase, supabaseConfigured } from '$lib/supabase';
  import { DEFAULT_WORKOUT_DEFS } from '$lib/workout';
  import type { WorkoutType, WorkoutSession } from '$lib/workout';
  import type { User, SupabaseClient } from '@supabase/supabase-js';

  const WORKOUT_LABELS: Record<WorkoutType, string> = { push: 'Push', pull: 'Pull', legs: 'Legs' };
  const WORKOUT_ICONS: Record<WorkoutType, string> = { push: '🤜', pull: '💪', legs: '🦵' };
  const WORKOUT_TYPES: WorkoutType[] = ['push', 'pull', 'legs'];
  const WORKOUT_DESC: Record<WorkoutType, string> = {
    push: 'Chest · Shoulders · Triceps',
    pull: 'Back · Biceps · Rear Delts',
    legs: 'Quads · Hamstrings · Calves'
  };

  let supabase: SupabaseClient | null = null;
  let user: User | null = null;
  let loading = true;
  let signingIn = false;
  let lastDates: Record<WorkoutType, string | null> = { push: null, pull: null, legs: null };

  onMount(() => {
    supabase = createSupabase();
    if (!supabase) {
      loading = false;
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      user = session?.user ?? null;
      loading = false;
      if (user && supabase) {
        await loadLastDates();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      user = session?.user ?? null;
      loading = false;
      if (user) loadLastDates();
    });

    return () => subscription.unsubscribe();
  });

  async function loadLastDates() {
    if (!supabase || !user) return;
    for (const type of WORKOUT_TYPES) {
      const { data } = await supabase
        .from('workout_sessions')
        .select('date')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('date', { ascending: false })
        .limit(1)
        .single();
      if (data) lastDates[type] = data.date;
    }
    lastDates = { ...lastDates };
  }

  async function signInWithGoogle() {
    if (!supabase) return;
    signingIn = true;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + `${base}/workout/` }
    });
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Never done';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function exerciseCount(type: WorkoutType): number {
    return DEFAULT_WORKOUT_DEFS.find((w) => w.type === type)?.exercises.length ?? 0;
  }
</script>

<svelte:head>
  <title>Workout Tracker</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="workout-page">
  <a class="breadcrumb" href="{base}/">← Home</a>

  <header class="page-hero">
    <p class="eyebrow">Workout Tracker</p>
    <h1>Train smarter.</h1>
    <p class="subhead">Log sets, track PRs, and rest on time.</p>
  </header>

  {#if loading}
    <div class="loading-state">
      <span class="spinner" aria-label="Loading…"></span>
    </div>
  {:else if !supabaseConfigured}
    <div class="setup-card">
      <p class="setup-title">Supabase not configured</p>
      <p class="setup-body">
        Add <code>PUBLIC_SUPABASE_URL</code> and <code>PUBLIC_SUPABASE_ANON_KEY</code> to your
        <code>.env</code> file. See <code>supabase/schema.sql</code> to create the required tables.
      </p>
    </div>
  {:else if !user}
    <div class="auth-card">
      <p class="auth-title">Sign in to track your workouts</p>
      <p class="auth-body">Your data syncs across all devices.</p>
      <button class="google-btn" on:click={signInWithGoogle} disabled={signingIn}>
        <svg class="google-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {signingIn ? 'Signing in…' : 'Sign in with Google'}
      </button>
    </div>
  {:else}
    <div class="user-bar">
      <span class="user-email">{user.email}</span>
      <button class="sign-out-btn" on:click={signOut}>Sign out</button>
    </div>

    <div class="workout-grid">
      {#each WORKOUT_TYPES as type}
        <a class="workout-card" href="{base}/workout/{type}">
          <div class="card-icon">{WORKOUT_ICONS[type]}</div>
          <div class="card-body">
            <h2>{WORKOUT_LABELS[type]}</h2>
            <p class="card-desc">{WORKOUT_DESC[type]}</p>
            <p class="card-meta">
              {exerciseCount(type)} exercises · Last: {formatDate(lastDates[type])}
            </p>
          </div>
          <span class="card-arrow" aria-hidden="true">→</span>
        </a>
      {/each}
    </div>
  {/if}
</section>

<style>
  :global(main[data-page="workout"]) {
    --app-bg: radial-gradient(circle at top, #fdf6ee 0%, #f5f0ea 45%, #fdf6ee 100%);
    --app-text: #1c1410;
    --app-muted: #6b5a4e;
    --app-accent: #c45c1a;
    --app-card-bg: #fffaf5;
    --app-card-border: rgba(30, 18, 8, 0.1);
    --app-card-shadow: 0 20px 45px rgba(30, 18, 8, 0.07);
    --app-card-hover-shadow: 0 28px 55px rgba(30, 18, 8, 0.12);
    --app-thumb-bg: #fef0e4;
  }

  :global(:root[data-theme="dark"] main[data-page="workout"]) {
    --app-bg: radial-gradient(circle at top, #150f0a 0%, #1c150e 45%, #1a130c 100%);
    --app-text: #f5ede4;
    --app-muted: #b09080;
    --app-accent: #f97316;
    --app-card-bg: #201710;
    --app-card-border: rgba(245, 237, 228, 0.1);
    --app-card-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
    --app-card-hover-shadow: 0 28px 55px rgba(0, 0, 0, 0.55);
    --app-thumb-bg: #2a1c12;
  }

  .workout-page {
    width: min(900px, 100%);
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    font-family: 'Space Grotesk', system-ui, sans-serif;
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
    font-family: 'Source Serif 4', 'Times New Roman', serif;
    font-size: clamp(2rem, 3vw, 3rem);
    margin: 0;
  }

  .subhead {
    max-width: 44rem;
    margin: 0;
    font-size: 1.05rem;
    color: var(--app-muted);
  }

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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .setup-card,
  .auth-card {
    padding: 2rem;
    border-radius: 24px;
    background: var(--app-card-bg);
    border: 1px solid var(--app-card-border);
    box-shadow: var(--app-card-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .setup-title,
  .auth-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
  }

  .setup-body,
  .auth-body {
    font-size: 0.95rem;
    color: var(--app-muted);
    margin: 0;
    max-width: 36rem;
  }

  .setup-body code {
    font-size: 0.88em;
    background: var(--app-thumb-bg);
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }

  .google-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    border: 1px solid var(--app-card-border);
    background: var(--app-card-bg);
    color: var(--app-text);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: var(--app-card-shadow);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    margin-top: 0.5rem;
  }

  .google-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--app-card-hover-shadow);
  }

  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .google-icon {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
  }

  .user-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 1rem;
    border-radius: 12px;
    background: var(--app-thumb-bg);
    font-size: 0.9rem;
  }

  .user-email {
    color: var(--app-muted);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sign-out-btn {
    background: none;
    border: 1px solid var(--app-card-border);
    border-radius: 999px;
    color: var(--app-muted);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 0.75rem;
    cursor: pointer;
    flex: 0 0 auto;
    transition: color 0.15s ease;
  }

  .sign-out-btn:hover {
    color: var(--app-text);
  }

  .workout-grid {
    display: grid;
    gap: 1.25rem;
  }

  .workout-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem;
    border-radius: 24px;
    background: var(--app-card-bg);
    border: 1px solid var(--app-card-border);
    box-shadow: var(--app-card-shadow);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .workout-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--app-card-hover-shadow);
  }

  .card-icon {
    font-size: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: var(--app-thumb-bg);
    display: grid;
    place-items: center;
    flex: 0 0 auto;
  }

  .card-body {
    flex: 1;
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }

  .card-body h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
  }

  .card-desc {
    margin: 0;
    font-size: 0.9rem;
    color: var(--app-muted);
  }

  .card-meta {
    margin: 0;
    font-size: 0.8rem;
    color: var(--app-accent);
    font-weight: 600;
  }

  .card-arrow {
    font-size: 1.5rem;
    color: var(--app-muted);
    flex: 0 0 auto;
  }

  @media (max-width: 720px) {
    .workout-page {
      gap: 2rem;
    }

    .workout-card {
      padding: 1.25rem;
    }
  }
</style>
