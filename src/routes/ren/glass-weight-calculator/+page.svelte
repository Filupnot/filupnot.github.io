<script lang="ts">
  import { base } from "$app/paths";
  import {
    calculateImperialWeight,
    calculateMetricWeight,
    roundWeight,
    IMPERIAL_THICKNESSES,
    METRIC_THICKNESSES,
    IMPERIAL_DENSITY,
    METRIC_DENSITY
  } from "$lib/glass-weight";

  type Lite = {
    thickness: number | null;
  };

  type UnitData = {
    length: string;
    width: string;
    lites: Lite[];
  };

  const createEmptyLites = (): Lite[] =>
    Array.from({ length: 6 }, () => ({ thickness: null }));

  let activeUnit: "imperial" | "metric" = "imperial";
  let imperial: UnitData = {
    length: "",
    width: "",
    lites: createEmptyLites()
  };
  let metric: UnitData = {
    length: "",
    width: "",
    lites: createEmptyLites()
  };

  const clearImperial = () => {
    imperial = { length: "", width: "", lites: createEmptyLites() };
  };

  const clearMetric = () => {
    metric = { length: "", width: "", lites: createEmptyLites() };
  };

  const calcWeight = (
    length: string,
    width: string,
    thickness: number | null,
    isMetric: boolean
  ): number => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    if (isMetric) {
      return roundWeight(calculateMetricWeight(l, w, thickness));
    }
    return roundWeight(calculateImperialWeight(l, w, thickness));
  };

  $: imperialWeights = imperial.lites.map((lite) =>
    calcWeight(imperial.length, imperial.width, lite.thickness, false)
  );
  $: metricWeights = metric.lites.map((lite) =>
    calcWeight(metric.length, metric.width, lite.thickness, true)
  );

  $: imperialTotal = imperialWeights.reduce((sum, w) => sum + w, 0);
  $: metricTotal = metricWeights.reduce((sum, w) => sum + w, 0);
</script>

<svelte:head>
  <title>Glass Weight Calculator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="calc-page">
  <a class="breadcrumb" href="{base}/ren">← Ren's Tools</a>
  <header class="page-hero">
    <h1>Glass Weight Calculator</h1>
    <p class="subhead">Calculate the weight of glass based on dimensions and thickness.</p>
  </header>

  <div class="unit-toggle" role="tablist" aria-label="Unit system">
    <button
      role="tab"
      aria-selected={activeUnit === "imperial"}
      class:active={activeUnit === "imperial"}
      on:click={() => (activeUnit = "imperial")}
      data-testid="imperial-tab"
    >
      Imperial
    </button>
    <button
      role="tab"
      aria-selected={activeUnit === "metric"}
      class:active={activeUnit === "metric"}
      on:click={() => (activeUnit = "metric")}
      data-testid="metric-tab"
    >
      Metric
    </button>
  </div>

  <div class="tables-wrap">
    <!-- Imperial Table -->
    <div
      class="table-panel"
      class:hidden-mobile={activeUnit !== "imperial"}
      data-testid="imperial-panel"
    >
      <div class="panel-header">
        <h2>Imperial</h2>
        <p class="density">Glass Density = {IMPERIAL_DENSITY} lb/ft³</p>
      </div>

      <div class="dimensions">
        <label>
          <span>Length (in)</span>
          <input
            type="number"
            inputmode="decimal"
            min="0"
            step="any"
            bind:value={imperial.length}
            placeholder="0"
            aria-label="Length in inches"
            data-testid="imperial-length"
          />
        </label>
        <label>
          <span>Width (in)</span>
          <input
            type="number"
            inputmode="decimal"
            min="0"
            step="any"
            bind:value={imperial.width}
            placeholder="0"
            aria-label="Width in inches"
            data-testid="imperial-width"
          />
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Lite #</th>
            <th>Thickness (in)</th>
            <th>Weight (lbs)</th>
          </tr>
        </thead>
        <tbody>
          {#each imperial.lites as lite, i}
            <tr>
              <td class="lite-num">{i + 1}</td>
              <td>
                <select
                  bind:value={lite.thickness}
                  aria-label="Lite {i + 1} thickness"
                  data-testid="imperial-thickness-{i}"
                >
                  <option value={null}>—</option>
                  {#each IMPERIAL_THICKNESSES as opt}
                    <option value={opt.value}>{opt.label}</option>
                  {/each}
                </select>
              </td>
              <td class="weight-cell" data-testid="imperial-weight-{i}">{imperialWeights[i]}</td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Weight</td>
            <td class="total-value" data-testid="imperial-total">{imperialTotal}</td>
          </tr>
        </tfoot>
      </table>

      <button class="clear-btn" type="button" on:click={clearImperial}>
        Clear Table
      </button>
    </div>

    <!-- Metric Table -->
    <div
      class="table-panel"
      class:hidden-mobile={activeUnit !== "metric"}
      data-testid="metric-panel"
    >
      <div class="panel-header">
        <h2>Metric</h2>
        <p class="density">Glass Density = {METRIC_DENSITY} kg/m³</p>
      </div>

      <div class="dimensions">
        <label>
          <span>Length (mm)</span>
          <input
            type="number"
            inputmode="decimal"
            min="0"
            step="any"
            bind:value={metric.length}
            placeholder="0"
            aria-label="Length in millimeters"
            data-testid="metric-length"
          />
        </label>
        <label>
          <span>Width (mm)</span>
          <input
            type="number"
            inputmode="decimal"
            min="0"
            step="any"
            bind:value={metric.width}
            placeholder="0"
            aria-label="Width in millimeters"
            data-testid="metric-width"
          />
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Lite #</th>
            <th>Thickness (mm)</th>
            <th>Weight (kgs)</th>
          </tr>
        </thead>
        <tbody>
          {#each metric.lites as lite, i}
            <tr>
              <td class="lite-num">{i + 1}</td>
              <td>
                <select
                  bind:value={lite.thickness}
                  aria-label="Lite {i + 1} thickness"
                  data-testid="metric-thickness-{i}"
                >
                  <option value={null}>—</option>
                  {#each METRIC_THICKNESSES as opt}
                    <option value={opt.value}>{opt.label}</option>
                  {/each}
                </select>
              </td>
              <td class="weight-cell" data-testid="metric-weight-{i}">{metricWeights[i]}</td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="total-label">Weight</td>
            <td class="total-value" data-testid="metric-total">{metricTotal}</td>
          </tr>
        </tfoot>
      </table>

      <button class="clear-btn" type="button" on:click={clearMetric}>
        Clear Table
      </button>
    </div>
  </div>
</section>

<style>
  :global(main[data-page="glass-weight-calculator"]) {
    --app-bg: radial-gradient(circle at top, #e8f0f4 0%, #f0f4f8 45%, #e4ecf0 100%);
    --app-text: #1a252e;
    --app-muted: #4a5c68;
    --app-accent: #2a6a8a;
    --app-card-bg: #ffffff;
    --app-card-border: rgba(26, 37, 46, 0.12);
    --app-header-bg: #d0e4f0;
    --app-row-alt: #f4f8fa;
    --app-total-bg: #c8e8c8;
    --app-input-bg: #ffffff;
    --app-input-border: rgba(26, 37, 46, 0.2);
  }

  :global(:root[data-theme="dark"] main[data-page="glass-weight-calculator"]) {
    --app-bg: radial-gradient(circle at top, #0a1014 0%, #101820 45%, #0c1418 100%);
    --app-text: #e4ecf0;
    --app-muted: #9aacb8;
    --app-accent: #6ac0e8;
    --app-card-bg: #141c22;
    --app-card-border: rgba(228, 236, 240, 0.15);
    --app-header-bg: #1a2830;
    --app-row-alt: #182028;
    --app-total-bg: #1c3024;
    --app-input-bg: #1a2228;
    --app-input-border: rgba(228, 236, 240, 0.2);
  }

  .calc-page {
    width: min(900px, 100%);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
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
    gap: 0.5rem;
  }

  h1 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin: 0;
    font-weight: 700;
  }

  .subhead {
    margin: 0;
    font-size: 1rem;
    color: var(--app-muted);
  }

  .unit-toggle {
    display: none;
  }

  .tables-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .table-panel {
    background: var(--app-card-bg);
    border: 2px solid var(--app-card-border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    background: var(--app-header-bg);
    padding: 1rem 1.25rem;
    text-align: center;
  }

  .panel-header h2 {
    margin: 0 0 0.25rem;
    font-size: 1.35rem;
    font-weight: 700;
  }

  .density {
    margin: 0;
    font-size: 0.85rem;
    font-style: italic;
    color: var(--app-muted);
  }

  .dimensions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: var(--app-header-bg);
  }

  .dimensions label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .dimensions span {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--app-muted);
  }

  .dimensions input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--app-input-border);
    border-radius: 6px;
    background: var(--app-input-bg);
    color: var(--app-text);
    font-size: 1rem;
    font-family: inherit;
  }

  .dimensions input:focus {
    outline: 2px solid var(--app-accent);
    outline-offset: 1px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    flex: 1;
  }

  thead {
    background: var(--app-header-bg);
  }

  th {
    padding: 0.6rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    border-bottom: 1px solid var(--app-card-border);
  }

  tbody tr:nth-child(even) {
    background: var(--app-row-alt);
  }

  td {
    padding: 0.5rem;
    text-align: center;
    vertical-align: middle;
  }

  .lite-num {
    font-weight: 600;
    width: 50px;
  }

  select {
    width: 100%;
    padding: 0.4rem 0.5rem;
    border: 1px solid var(--app-input-border);
    border-radius: 6px;
    background: var(--app-input-bg);
    color: var(--app-text);
    font-size: 0.95rem;
    font-family: inherit;
    cursor: pointer;
  }

  select:focus {
    outline: 2px solid var(--app-accent);
    outline-offset: 1px;
  }

  .weight-cell {
    font-weight: 500;
    background: rgba(200, 232, 200, 0.3);
    min-width: 70px;
  }

  :global(:root[data-theme="dark"]) .weight-cell {
    background: rgba(28, 48, 36, 0.5);
  }

  tfoot {
    background: var(--app-total-bg);
  }

  tfoot tr {
    border-top: 2px solid var(--app-card-border);
  }

  .total-label {
    text-align: right;
    font-weight: 600;
    font-style: italic;
    padding-right: 1rem;
  }

  .total-value {
    font-weight: 700;
    font-size: 1.1rem;
  }

  .clear-btn {
    margin: 1rem auto;
    padding: 0.5rem 1.5rem;
    border: 1px solid var(--app-card-border);
    border-radius: 6px;
    background: var(--app-card-bg);
    color: var(--app-text);
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .clear-btn:hover {
    background: var(--app-row-alt);
  }

  .clear-btn:focus-visible {
    outline: 2px solid var(--app-accent);
    outline-offset: 2px;
  }

  @media (max-width: 720px) {
    .unit-toggle {
      display: flex;
      gap: 0;
      background: var(--app-card-bg);
      border: 2px solid var(--app-card-border);
      border-radius: 10px;
      overflow: hidden;
    }

    .unit-toggle button {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      color: var(--app-muted);
      font-family: inherit;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .unit-toggle button.active {
      background: var(--app-accent);
      color: #fff;
    }

    .unit-toggle button:focus-visible {
      outline: 2px solid var(--app-accent);
      outline-offset: -2px;
    }

    .tables-wrap {
      grid-template-columns: 1fr;
    }

    .hidden-mobile {
      display: none;
    }
  }
</style>
