import { V as head, W as attr_class, X as attr, a0 as bind_props, _ as stringify } from "../../../../chunks/index2.js";
import { c as ssr_context, e as escape_html } from "../../../../chunks/context.js";
import "clsx";
import { b as base } from "../../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
const REST_SECONDS = 90;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 38;
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let timerOffset;
    let data = $$props["data"];
    const LABELS = { push: "Push", pull: "Pull", legs: "Legs" };
    let exerciseSets = [];
    let timerSecondsLeft = 0;
    let timerActive = false;
    onDestroy(() => {
    });
    timerOffset = TIMER_CIRCUMFERENCE * (1 - timerSecondsLeft / REST_SECONDS);
    exerciseSets.reduce((sum, sets) => sum + sets.length, 0);
    head("13gqz0t", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(LABELS[data.type])} Workout</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<div class="tracker-page svelte-13gqz0t"><div${attr_class("timer-bar svelte-13gqz0t", void 0, { "timer-active": timerActive, "timer-idle": !timerActive })} aria-live="polite"><div class="timer-ring-wrap svelte-13gqz0t"><svg class="timer-ring svelte-13gqz0t" width="52" height="52" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="none" stroke="var(--ring-track)" stroke-width="5"></circle><circle cx="40" cy="40" r="38" fill="none" stroke="var(--ring-fill)" stroke-width="5"${attr("stroke-dasharray", TIMER_CIRCUMFERENCE)}${attr("stroke-dashoffset", timerOffset)} stroke-linecap="round" transform="rotate(-90 40 40)" style="transition: stroke-dashoffset 1s linear;"></circle></svg> <span class="timer-label svelte-13gqz0t">${escape_html("—")}</span></div> <div class="timer-text svelte-13gqz0t">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="timer-status svelte-13gqz0t">Ready</span> <span class="timer-hint svelte-13gqz0t">Log a set to start the rest timer</span>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="timer-actions svelte-13gqz0t">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="page-header svelte-13gqz0t"><a class="breadcrumb svelte-13gqz0t"${attr("href", `${stringify(base)}/workout/`)}>← Workouts</a> <div class="header-meta svelte-13gqz0t"><h1 class="svelte-13gqz0t">${escape_html(LABELS[data.type])}</h1> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-state svelte-13gqz0t"><span class="spinner svelte-13gqz0t" aria-label="Loading…"></span></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
