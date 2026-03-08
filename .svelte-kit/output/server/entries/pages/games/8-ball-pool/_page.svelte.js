import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../../../chunks/index2.js";
import { b as base } from "../../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer) {
  let rounds, matchupCount;
  const rosterSize = 4;
  const maxNameLength = 18;
  const makeDefaultRoster = (label) => Array.from({ length: rosterSize }, (_, index) => `${label} ${index + 1}`);
  let homeInputs = makeDefaultRoster("Home");
  let awayInputs = makeDefaultRoster("Away");
  [...homeInputs];
  [...awayInputs];
  rounds = [];
  matchupCount = rounds.reduce((total, round) => total + round.matches.length, 0);
  head("1cbtgg0", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Pool League</title>`);
    });
    $$renderer2.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&amp;family=Sora:wght@400;500;600&amp;display=swap" rel="stylesheet"/>`);
  });
  $$renderer.push(`<section class="pool-page svelte-1cbtgg0"><a class="breadcrumb svelte-1cbtgg0"${attr("href", `${stringify(base)}/games`)}>← Game Score Tools</a> `);
  {
    $$renderer.push("<!--[!-->");
    $$renderer.push(`<header class="hero svelte-1cbtgg0"><p class="eyebrow svelte-1cbtgg0">Pool league</p> <h1 class="svelte-1cbtgg0">Round-robin matchups.</h1></header> <div class="pool-card svelte-1cbtgg0"><div class="card-top svelte-1cbtgg0"><div><p class="card-label svelte-1cbtgg0">Lineup</p> <h2 class="svelte-1cbtgg0">Set the teams.</h2></div> <span class="chip svelte-1cbtgg0">${escape_html(matchupCount || rosterSize * rosterSize)} total games</span></div> <form class="rosters svelte-1cbtgg0"><div class="roster-block svelte-1cbtgg0"><div class="roster-head svelte-1cbtgg0"><h3 class="svelte-1cbtgg0">Home team</h3> <span class="roster-pill svelte-1cbtgg0">Stays in order</span></div> <div class="roster-grid svelte-1cbtgg0"><!--[-->`);
    const each_array_2 = ensure_array_like(homeInputs);
    for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
      each_array_2[index];
      $$renderer.push(`<label class="name-field svelte-1cbtgg0"><span>Home ${escape_html(index + 1)}</span> <input${attr("value", homeInputs[index])}${attr("placeholder", `Home ${stringify(index + 1)}`)}${attr("maxlength", maxNameLength)} autocomplete="off" class="svelte-1cbtgg0"/></label>`);
    }
    $$renderer.push(`<!--]--></div></div> <div class="roster-block svelte-1cbtgg0"><div class="roster-head svelte-1cbtgg0"><h3 class="svelte-1cbtgg0">Away team</h3> <span class="roster-pill shift-pill svelte-1cbtgg0">Shifts each round</span></div> <div class="roster-grid svelte-1cbtgg0"><!--[-->`);
    const each_array_3 = ensure_array_like(awayInputs);
    for (let index = 0, $$length = each_array_3.length; index < $$length; index++) {
      each_array_3[index];
      $$renderer.push(`<label class="name-field svelte-1cbtgg0"><span>Away ${escape_html(index + 1)}</span> <input${attr("value", awayInputs[index])}${attr("placeholder", `Away ${stringify(index + 1)}`)}${attr("maxlength", maxNameLength)} autocomplete="off" class="svelte-1cbtgg0"/></label>`);
    }
    $$renderer.push(`<!--]--></div></div> <button class="confirm svelte-1cbtgg0" type="submit">Confirm teams</button></form></div>`);
  }
  $$renderer.push(`<!--]--></section>`);
}
export {
  _page as default
};
