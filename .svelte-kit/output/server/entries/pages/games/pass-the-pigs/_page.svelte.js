import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../../../chunks/index2.js";
import { b as base } from "../../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentIndex, winner;
    let nextId = 1;
    const createPlayer = (index) => ({
      id: nextId++,
      name: `PLAYER ${index + 1}`,
      score: 0,
      eliminated: false
    });
    let players = Array.from({ length: 4 }, (_, index) => createPlayer(index));
    let targetScore = 100;
    let currentPlayerId = players[0]?.id ?? 0;
    const displayNameFor = (player, index) => player.name.trim() ? player.name : `PLAYER ${index + 1}`;
    currentIndex = players.findIndex((player) => player.id === currentPlayerId);
    currentIndex >= 0 ? players[currentIndex] : null;
    winner = players.find((player) => !player.eliminated && player.score >= targetScore) ?? null;
    players.filter((player) => !player.eliminated && player.id !== currentPlayerId && player.score >= 20);
    head("fqwyp4", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Pass the Pigs</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com" class="svelte-fqwyp4"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" class="svelte-fqwyp4"/> <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&amp;family=Space+Grotesk:wght@400;500;600;700&amp;display=swap" rel="stylesheet" class="svelte-fqwyp4"/>`);
    });
    $$renderer2.push(`<section class="pigs-page svelte-fqwyp4"><a class="breadcrumb svelte-fqwyp4"${attr("href", `${stringify(base)}/games`)}>← Game Score Tools</a> <header class="hero svelte-fqwyp4"><p class="eyebrow svelte-fqwyp4">Pass the Pigs</p> <h1 class="svelte-fqwyp4">Track every roll, bank, and hog call.</h1> <p class="subhead svelte-fqwyp4">Use the score buttons for each pig position, then bank when you want to
      lock in points. Special rolls reset or end a turn instantly.</p></header> `);
    if (winner) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="winner-banner svelte-fqwyp4"><strong class="svelte-fqwyp4">${escape_html(displayNameFor(winner, players.indexOf(winner)))}</strong> reaches ${escape_html(targetScore)} points.
      Finish the round or reset for a new game.</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="setup-stage svelte-fqwyp4"><div class="panel setup-card svelte-fqwyp4"><div class="panel-head svelte-fqwyp4"><div class="svelte-fqwyp4"><h2 class="svelte-fqwyp4">Table setup</h2> <p class="muted svelte-fqwyp4">Set the target score and player count before starting.</p></div></div> <div class="setup-controls svelte-fqwyp4"><label class="field svelte-fqwyp4"><span class="svelte-fqwyp4">Target score</span> <input class="number svelte-fqwyp4" type="number" min="50" max="500" step="10"${attr("value", targetScore)}/></label> <div class="player-buttons svelte-fqwyp4"><button class="ghost svelte-fqwyp4" type="button">+ Add player</button> <button class="ghost svelte-fqwyp4" type="button">- Remove player</button></div></div></div> <div class="panel player-setup svelte-fqwyp4"><div class="panel-head svelte-fqwyp4"><div class="svelte-fqwyp4"><h2 class="svelte-fqwyp4">Players</h2> <p class="muted svelte-fqwyp4">Name each player before the first roll.</p></div></div> <div class="player-grid svelte-fqwyp4"><!--[-->`);
      const each_array = ensure_array_like(players);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let player = each_array[index];
        $$renderer2.push(`<label class="field svelte-fqwyp4"><span class="svelte-fqwyp4">Player ${escape_html(index + 1)}</span> <input type="text"${attr("value", player.name)}${attr("aria-label", `Name for player ${index + 1}`)} class="svelte-fqwyp4"/></label>`);
      }
      $$renderer2.push(`<!--]--></div></div></section> <div class="setup-actions svelte-fqwyp4"><button class="primary start-button svelte-fqwyp4" type="button">Start game</button></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};
