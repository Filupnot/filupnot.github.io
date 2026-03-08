import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../../../chunks/index2.js";
import { b as base } from "../../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer) {
  const teamNames = ["HOME", "AWAY"];
  let scores = [0, 0];
  teamNames.map(() => [0, 0]);
  head("1j2lq3d", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Dominoes</title>`);
    });
    $$renderer2.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Fraunces:opsz,wght@9..144,600;9..144,700&amp;display=swap" rel="stylesheet"/>`);
  });
  $$renderer.push(`<section class="dominoes-page svelte-1j2lq3d"><a class="breadcrumb svelte-1j2lq3d"${attr("href", `${stringify(base)}/games`)}>← Game Score Tools</a> <div class="board svelte-1j2lq3d"><div class="board-head svelte-1j2lq3d"><span class="team-chip team-left svelte-1j2lq3d">${escape_html(teamNames[0])}</span> <span class="target-label svelte-1j2lq3d">Score</span> <span class="team-chip team-right svelte-1j2lq3d">${escape_html(teamNames[1])}</span></div> <div class="score-grid svelte-1j2lq3d"><!--[-->`);
  const each_array = ensure_array_like(teamNames);
  for (let teamIndex = 0, $$length = each_array.length; teamIndex < $$length; teamIndex++) {
    let team = each_array[teamIndex];
    $$renderer.push(`<div class="score-column svelte-1j2lq3d"><button class="score-control svelte-1j2lq3d" type="button"${attr("aria-label", `Increase ${stringify(team)} score`)}><svg class="arrow svelte-1j2lq3d" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6l6 7H6l6-7z"></path></svg></button> <div class="score-window svelte-1j2lq3d" aria-live="polite"><!---->`);
    {
      $$renderer.push(`<span class="score-value svelte-1j2lq3d">${escape_html(scores[teamIndex])}</span>`);
    }
    $$renderer.push(`<!----></div> <button class="score-control svelte-1j2lq3d" type="button"${attr("aria-label", `Decrease ${stringify(team)} score`)}><svg class="arrow arrow-down svelte-1j2lq3d" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6l6 7H6l6-7z"></path></svg></button></div>`);
  }
  $$renderer.push(`<!--]--></div> <button class="reset-text svelte-1j2lq3d" type="button" aria-live="polite">${escape_html("RESET")}</button></div></section>`);
}
export {
  _page as default
};
