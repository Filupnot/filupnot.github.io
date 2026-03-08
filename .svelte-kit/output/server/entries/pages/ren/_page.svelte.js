import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../../chunks/index2.js";
import { b as base } from "../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer) {
  const tools = [
    {
      title: "Glass Weight Calculator",
      path: "/ren/glass-weight-calculator",
      description: "Calculate glass weight from dimensions"
    }
  ];
  head("f184hq", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Ren's Tools</title>`);
    });
    $$renderer2.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&amp;display=swap" rel="stylesheet"/>`);
  });
  $$renderer.push(`<section class="ren-page svelte-f184hq"><a class="breadcrumb svelte-f184hq"${attr("href", `${stringify(base)}/`)}>← Home</a> <header class="page-hero svelte-f184hq"><p class="eyebrow svelte-f184hq">Ren's Tools</p> <h1 class="svelte-f184hq">Glass Stuff.</h1> <p class="subhead svelte-f184hq">Tools for the glass industry.</p></header> <div class="tools-grid svelte-f184hq"><!--[-->`);
  const each_array = ensure_array_like(tools);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tool = each_array[$$index];
    $$renderer.push(`<a class="tool-card svelte-f184hq"${attr("href", `${stringify(base)}${stringify(tool.path)}`)}><div class="card-body svelte-f184hq"><div class="icon-wrap svelte-f184hq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="svelte-f184hq"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="12" y2="14"></line><line x1="8" y1="18" x2="10" y2="18"></line></svg></div> <div class="card-text svelte-f184hq"><h2 class="svelte-f184hq">${escape_html(tool.title)}</h2> <p class="svelte-f184hq">${escape_html(tool.description)}</p></div></div> <span class="card-arrow svelte-f184hq" aria-hidden="true">→</span></a>`);
  }
  $$renderer.push(`<!--]--></div></section>`);
}
export {
  _page as default
};
