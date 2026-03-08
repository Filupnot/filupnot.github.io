import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../../../chunks/index2.js";
import { b as base } from "../../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const minPlayers = 2;
    const maxPlayers = 8;
    let players = ["", "", "", ""];
    let maxHand = 8;
    let useReturnTrip = true;
    let rounds = [];
    const buildRounds = (handSize, returnTrip, playerCount) => {
      const sizes = Array.from({ length: handSize }, (_, index) => handSize - index);
      {
        sizes.push(...Array.from({ length: handSize - 1 }, (_, index) => index + 2));
      }
      return sizes.map((size) => ({
        handSize: size,
        bids: Array.from({ length: playerCount }, () => null),
        takes: Array.from({ length: playerCount }, () => null)
      }));
    };
    const regenerateRounds = () => {
      rounds = buildRounds(maxHand, useReturnTrip, players.length);
      Array.from({ length: rounds.length }, () => "bids");
    };
    regenerateRounds();
    head("8u244y", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Oh Hell!</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Fraunces:opsz,wght@9..144,600;9..144,700&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<section class="ohhell-page svelte-8u244y"><a class="breadcrumb svelte-8u244y"${attr("href", `${stringify(base)}/games`)}>← Game Score Tools</a> <div class="board svelte-8u244y"><header class="board-head svelte-8u244y"><div><div class="eyebrow-row svelte-8u244y"><p class="eyebrow svelte-8u244y">Oh Hell!</p> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<h1 class="svelte-8u244y">Bid, take, and score.</h1> <p class="subhead svelte-8u244y">Hit your bid exactly to score 10 + tricks (or 5 for a zero bid). Miss
            the bid and you just score the tricks you took.</p>`);
    }
    $$renderer2.push(`<!--]--></div> <div></div></header> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="setup-grid svelte-8u244y"><div class="setup-card svelte-8u244y"><h2 class="svelte-8u244y">Players</h2> <p class="hint svelte-8u244y">Tap a name to edit. Add up to 8 players.</p> <div class="player-list svelte-8u244y"><!--[-->`);
      const each_array = ensure_array_like(players);
      for (let playerIndex = 0, $$length = each_array.length; playerIndex < $$length; playerIndex++) {
        let player = each_array[playerIndex];
        $$renderer2.push(`<label class="player-row svelte-8u244y"><span class="player-index svelte-8u244y">${escape_html(playerIndex + 1)}</span> <input class="player-input svelte-8u244y"${attr("value", player)} maxlength="14"${attr("placeholder", `PLAYER ${playerIndex + 1}`)}/></label>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="player-actions svelte-8u244y"><button class="ghost-button svelte-8u244y" type="button"${attr("disabled", players.length >= maxPlayers, true)}>Add player</button> <button class="ghost-button svelte-8u244y" type="button"${attr("disabled", players.length <= minPlayers, true)}>Remove</button></div></div> <div class="setup-card svelte-8u244y"><h2 class="svelte-8u244y">Rounds</h2> <p class="hint svelte-8u244y">Pick a max hand size and whether to play back down.</p> <label class="control svelte-8u244y"><span>Max hand size</span> `);
      $$renderer2.select(
        { value: maxHand, class: "" },
        ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like([5, 6, 7, 8, 9, 10, 11, 12, 13]);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let size = each_array_1[$$index_1];
            $$renderer3.option({ value: size }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(size)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        },
        "svelte-8u244y"
      );
      $$renderer2.push(`</label> <label class="toggle svelte-8u244y"><input type="checkbox"${attr("checked", useReturnTrip, true)}/> <span>Play back up to ${escape_html(maxHand)}</span></label> <div class="round-summary svelte-8u244y"><span>${escape_html(rounds.length)} rounds</span> <span class="round-list svelte-8u244y">${escape_html(rounds.map((round) => round.handSize).join(" / "))}</span></div> <button class="primary-button svelte-8u244y" type="button">Start rounds</button></div></div>`);
    }
    $$renderer2.push(`<!--]--> <button class="reset-text svelte-8u244y" type="button" aria-live="polite">${escape_html("RESET SCORES")}</button></div></section>`);
  });
}
export {
  _page as default
};
