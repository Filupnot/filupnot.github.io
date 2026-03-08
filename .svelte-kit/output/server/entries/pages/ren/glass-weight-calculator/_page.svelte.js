import { V as head, X as attr, W as attr_class, $ as ensure_array_like, _ as stringify } from "../../../../chunks/index2.js";
import { b as base } from "../../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../../chunks/context.js";
const IMPERIAL_DENSITY = 158;
const METRIC_DENSITY = 2531;
const CUBIC_INCHES_PER_CUBIC_FOOT = 1728;
const CUBIC_MM_PER_CUBIC_METER = 1e9;
const IMPERIAL_THICKNESSES = [
  { label: '1/8"', value: 0.125 },
  { label: '3/16"', value: 0.1875 },
  { label: '1/4"', value: 0.25 },
  { label: '5/16"', value: 0.3125 },
  { label: '3/8"', value: 0.375 },
  { label: '1/2"', value: 0.5 },
  { label: '5/8"', value: 0.625 },
  { label: '3/4"', value: 0.75 },
  { label: '1"', value: 1 }
];
const METRIC_THICKNESSES = [
  { label: "3mm", value: 3 },
  { label: "4mm", value: 4 },
  { label: "5mm", value: 5 },
  { label: "6mm", value: 6 },
  { label: "8mm", value: 8 },
  { label: "10mm", value: 10 },
  { label: "12mm", value: 12 },
  { label: "15mm", value: 15 },
  { label: "19mm", value: 19 },
  { label: "25mm", value: 25 }
];
function calculateImperialWeight(lengthInches, widthInches, thicknessInches) {
  if (thicknessInches === null || !lengthInches || !widthInches || !thicknessInches) {
    return 0;
  }
  const volumeCubicInches = lengthInches * widthInches * thicknessInches;
  return volumeCubicInches * IMPERIAL_DENSITY / CUBIC_INCHES_PER_CUBIC_FOOT;
}
function calculateMetricWeight(lengthMm, widthMm, thicknessMm) {
  if (thicknessMm === null || !lengthMm || !widthMm || !thicknessMm) {
    return 0;
  }
  const volumeCubicMm = lengthMm * widthMm * thicknessMm;
  return volumeCubicMm * METRIC_DENSITY / CUBIC_MM_PER_CUBIC_METER;
}
function roundWeight(weight) {
  if (weight === 0) return 0;
  if (weight >= 1) return Math.round(weight);
  return Math.round(weight * 10) / 10;
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let imperialWeights, metricWeights, imperialTotal, metricTotal;
    const createEmptyLites = () => Array.from({ length: 6 }, () => ({ thickness: null }));
    let activeUnit = "imperial";
    let imperial = { length: "", width: "", lites: createEmptyLites() };
    let metric = { length: "", width: "", lites: createEmptyLites() };
    const calcWeight = (length, width, thickness, isMetric) => {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      if (isMetric) {
        return roundWeight(calculateMetricWeight(l, w, thickness));
      }
      return roundWeight(calculateImperialWeight(l, w, thickness));
    };
    imperialWeights = imperial.lites.map((lite) => calcWeight(imperial.length, imperial.width, lite.thickness, false));
    metricWeights = metric.lites.map((lite) => calcWeight(metric.length, metric.width, lite.thickness, true));
    imperialTotal = imperialWeights.reduce((sum, w) => sum + w, 0);
    metricTotal = metricWeights.reduce((sum, w) => sum + w, 0);
    head("15kg6uv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Glass Weight Calculator</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<section class="calc-page svelte-15kg6uv"><a class="breadcrumb svelte-15kg6uv"${attr("href", `${stringify(base)}/ren`)}>← Ren's Tools</a> <header class="page-hero svelte-15kg6uv"><h1 class="svelte-15kg6uv">Glass Weight Calculator</h1> <p class="subhead svelte-15kg6uv">Calculate the weight of glass based on dimensions and thickness.</p></header> <div class="unit-toggle svelte-15kg6uv" role="tablist" aria-label="Unit system"><button role="tab"${attr("aria-selected", activeUnit === "imperial")} data-testid="imperial-tab"${attr_class("svelte-15kg6uv", void 0, { "active": activeUnit === "imperial" })}>Imperial</button> <button role="tab"${attr("aria-selected", activeUnit === "metric")} data-testid="metric-tab"${attr_class("svelte-15kg6uv", void 0, { "active": activeUnit === "metric" })}>Metric</button></div> <div class="tables-wrap svelte-15kg6uv"><div${attr_class("table-panel svelte-15kg6uv", void 0, { "hidden-mobile": activeUnit !== "imperial" })} data-testid="imperial-panel"><div class="panel-header svelte-15kg6uv"><h2 class="svelte-15kg6uv">Imperial</h2> <p class="density svelte-15kg6uv">Glass Density = ${escape_html(IMPERIAL_DENSITY)} lb/ft³</p></div> <div class="dimensions svelte-15kg6uv"><label class="svelte-15kg6uv"><span class="svelte-15kg6uv">Length (in)</span> <input type="number" inputmode="decimal" min="0" step="any"${attr("value", imperial.length)} placeholder="0" aria-label="Length in inches" data-testid="imperial-length" class="svelte-15kg6uv"/></label> <label class="svelte-15kg6uv"><span class="svelte-15kg6uv">Width (in)</span> <input type="number" inputmode="decimal" min="0" step="any"${attr("value", imperial.width)} placeholder="0" aria-label="Width in inches" data-testid="imperial-width" class="svelte-15kg6uv"/></label></div> <table class="svelte-15kg6uv"><thead class="svelte-15kg6uv"><tr><th class="svelte-15kg6uv">Lite #</th><th class="svelte-15kg6uv">Thickness (in)</th><th class="svelte-15kg6uv">Weight (lbs)</th></tr></thead><tbody class="svelte-15kg6uv"><!--[-->`);
    const each_array = ensure_array_like(imperial.lites);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let lite = each_array[i];
      $$renderer2.push(`<tr class="svelte-15kg6uv"><td class="lite-num svelte-15kg6uv">${escape_html(i + 1)}</td><td class="svelte-15kg6uv">`);
      $$renderer2.select(
        {
          value: lite.thickness,
          "aria-label": `Lite ${stringify(i + 1)} thickness`,
          "data-testid": `imperial-thickness-${stringify(i)}`,
          class: ""
        },
        ($$renderer3) => {
          $$renderer3.option({ value: null }, ($$renderer4) => {
            $$renderer4.push(`—`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(IMPERIAL_THICKNESSES);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let opt = each_array_1[$$index];
            $$renderer3.option({ value: opt.value }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(opt.label)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        },
        "svelte-15kg6uv"
      );
      $$renderer2.push(`</td><td class="weight-cell svelte-15kg6uv"${attr("data-testid", `imperial-weight-${stringify(i)}`)}>${escape_html(imperialWeights[i])}</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody><tfoot class="svelte-15kg6uv"><tr class="svelte-15kg6uv"><td colspan="2" class="total-label svelte-15kg6uv">Weight</td><td class="total-value svelte-15kg6uv" data-testid="imperial-total">${escape_html(imperialTotal)}</td></tr></tfoot></table> <button class="clear-btn svelte-15kg6uv" type="button">Clear Table</button></div> <div${attr_class("table-panel svelte-15kg6uv", void 0, { "hidden-mobile": activeUnit !== "metric" })} data-testid="metric-panel"><div class="panel-header svelte-15kg6uv"><h2 class="svelte-15kg6uv">Metric</h2> <p class="density svelte-15kg6uv">Glass Density = ${escape_html(METRIC_DENSITY)} kg/m³</p></div> <div class="dimensions svelte-15kg6uv"><label class="svelte-15kg6uv"><span class="svelte-15kg6uv">Length (mm)</span> <input type="number" inputmode="decimal" min="0" step="any"${attr("value", metric.length)} placeholder="0" aria-label="Length in millimeters" data-testid="metric-length" class="svelte-15kg6uv"/></label> <label class="svelte-15kg6uv"><span class="svelte-15kg6uv">Width (mm)</span> <input type="number" inputmode="decimal" min="0" step="any"${attr("value", metric.width)} placeholder="0" aria-label="Width in millimeters" data-testid="metric-width" class="svelte-15kg6uv"/></label></div> <table class="svelte-15kg6uv"><thead class="svelte-15kg6uv"><tr><th class="svelte-15kg6uv">Lite #</th><th class="svelte-15kg6uv">Thickness (mm)</th><th class="svelte-15kg6uv">Weight (kgs)</th></tr></thead><tbody class="svelte-15kg6uv"><!--[-->`);
    const each_array_2 = ensure_array_like(metric.lites);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let lite = each_array_2[i];
      $$renderer2.push(`<tr class="svelte-15kg6uv"><td class="lite-num svelte-15kg6uv">${escape_html(i + 1)}</td><td class="svelte-15kg6uv">`);
      $$renderer2.select(
        {
          value: lite.thickness,
          "aria-label": `Lite ${stringify(i + 1)} thickness`,
          "data-testid": `metric-thickness-${stringify(i)}`,
          class: ""
        },
        ($$renderer3) => {
          $$renderer3.option({ value: null }, ($$renderer4) => {
            $$renderer4.push(`—`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_3 = ensure_array_like(METRIC_THICKNESSES);
          for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
            let opt = each_array_3[$$index_2];
            $$renderer3.option({ value: opt.value }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(opt.label)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        },
        "svelte-15kg6uv"
      );
      $$renderer2.push(`</td><td class="weight-cell svelte-15kg6uv"${attr("data-testid", `metric-weight-${stringify(i)}`)}>${escape_html(metricWeights[i])}</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody><tfoot class="svelte-15kg6uv"><tr class="svelte-15kg6uv"><td colspan="2" class="total-label svelte-15kg6uv">Weight</td><td class="total-value svelte-15kg6uv" data-testid="metric-total">${escape_html(metricTotal)}</td></tr></tfoot></table> <button class="clear-btn svelte-15kg6uv" type="button">Clear Table</button></div></div></section>`);
  });
}
export {
  _page as default
};
