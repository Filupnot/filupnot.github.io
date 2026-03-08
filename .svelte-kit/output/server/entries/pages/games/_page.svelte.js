import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../../chunks/index2.js";
import { b as base } from "../../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const games = [
      {
        title: "Darts (Cricket)",
        path: "/games/darts-cricket",
        thumbnail: "/darts-thumb.png"
      },
      {
        title: "Oh Hell!",
        path: "/games/oh-hell",
        thumbnail: "/oh-hell-thumb.svg"
      },
      {
        title: "Dominoes",
        path: "/games/dominoes",
        thumbnail: "/dominoes-thumb.svg"
      },
      {
        title: "Pool League",
        path: "/games/8-ball-pool",
        thumbnail: "/pool-thumb.svg"
      },
      {
        title: "Pass the Pigs",
        path: "/games/pass-the-pigs",
        thumbnail: "/pigs-thumb.svg"
      }
    ];
    head("6rw1dw", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Game Score Tools</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<section class="games-page svelte-6rw1dw"><a class="breadcrumb svelte-6rw1dw"${attr("href", `${stringify(base)}/`)}>← Home</a> <header class="page-hero svelte-6rw1dw"><p class="eyebrow svelte-6rw1dw">Game Score Tools</p> <h1 class="svelte-6rw1dw">Game score tracking.</h1> <p class="subhead svelte-6rw1dw">Pick a game to open its score tool.</p></header> <div class="games-grid svelte-6rw1dw"><!--[-->`);
    const each_array = ensure_array_like(games);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let game = each_array[$$index];
      $$renderer2.push(`<a class="game-card svelte-6rw1dw"${attr("href", `${stringify(base)}${stringify(game.path)}`)}><div class="card-body svelte-6rw1dw"><div class="thumb-wrap svelte-6rw1dw"><img class="thumb svelte-6rw1dw"${attr("src", `${stringify(base)}${stringify(game.thumbnail)}`)} alt=""/></div> <h2 class="svelte-6rw1dw">${escape_html(game.title)}</h2></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></section> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
