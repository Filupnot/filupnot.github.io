import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../../../chunks/index2.js";
import { b as base } from "../../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer) {
  const rows = ["20", "19", "18", "17", "16", "15", "Bull"];
  const markIcons = [
    "",
    "cricket-one.png",
    "cricket-two.png",
    "cricket-three.png"
  ];
  let teamNames = ["HOME", "AWAY"];
  let marks = rows.map(() => [0, 0]);
  rows.map(() => [0, 0]);
  rows.map(() => [false, false]);
  rows.map(() => [0, 0]);
  head("18pf99b", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Darts Cricket</title>`);
    });
    $$renderer2.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Fraunces:opsz,wght@9..144,600;9..144,700&amp;display=swap" rel="stylesheet"/>`);
  });
  $$renderer.push(`<section class="cricket-page svelte-18pf99b"><a class="breadcrumb svelte-18pf99b"${attr("href", `${stringify(base)}/games`)}>← Game Score Tools</a> <div class="board svelte-18pf99b"><div class="board-head svelte-18pf99b"><button class="team-chip team-left svelte-18pf99b" type="button" aria-label="Rename HOME team">${escape_html(teamNames[0])}</button> <span class="target-label svelte-18pf99b">Targets</span> <button class="team-chip team-right svelte-18pf99b" type="button" aria-label="Rename AWAY team">${escape_html(teamNames[1])}</button></div> <div class="board-grid svelte-18pf99b" role="grid"><!--[-->`);
  const each_array = ensure_array_like(rows);
  for (let rowIndex = 0, $$length = each_array.length; rowIndex < $$length; rowIndex++) {
    let row = each_array[rowIndex];
    $$renderer.push(`<div class="board-row svelte-18pf99b" role="row"><button class="mark-cell svelte-18pf99b" type="button"${attr("aria-label", `${stringify(teamNames[0])} marks for ${stringify(row)}`)}>`);
    if (marks[rowIndex][0] > 0) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<img class="mark-icon svelte-18pf99b"${attr("src", `${stringify(base)}/${stringify(markIcons[marks[rowIndex][0]])}`)} alt=""/>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--></button> <div class="target-cell svelte-18pf99b" role="rowheader">${escape_html(row)}</div> <button class="mark-cell svelte-18pf99b" type="button"${attr("aria-label", `${stringify(teamNames[1])} marks for ${stringify(row)}`)}>`);
    if (marks[rowIndex][1] > 0) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<img class="mark-icon svelte-18pf99b"${attr("src", `${stringify(base)}/${stringify(markIcons[marks[rowIndex][1]])}`)} alt=""/>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--></button></div>`);
  }
  $$renderer.push(`<!--]--></div> <button class="reset-text svelte-18pf99b" type="button" aria-live="polite">${escape_html("RESET")}</button></div></section>`);
}
export {
  _page as default
};
