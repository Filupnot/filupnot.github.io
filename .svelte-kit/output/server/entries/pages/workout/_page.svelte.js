import { V as head, X as attr, _ as stringify } from "../../../chunks/index2.js";
import { b as base } from "../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("1iztl5s", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Workout Tracker</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<section class="workout-page svelte-1iztl5s"><a class="breadcrumb svelte-1iztl5s"${attr("href", `${stringify(base)}/`)}>← Home</a> <header class="page-hero svelte-1iztl5s"><p class="eyebrow svelte-1iztl5s">Workout Tracker</p> <h1 class="svelte-1iztl5s">Train smarter.</h1> <p class="subhead svelte-1iztl5s">Log sets, track PRs, and rest on time.</p></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-state svelte-1iztl5s"><span class="spinner svelte-1iztl5s" aria-label="Loading…"></span></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};
