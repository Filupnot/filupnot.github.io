import { V as head, X as attr, $ as ensure_array_like, _ as stringify } from "../../chunks/index2.js";
import { b as base } from "../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape_html } from "../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const cards = [
      {
        title: "Game Score Tools",
        description: "Simple score tracking tools for games.",
        href: "/games"
      },
      {
        title: "Ren's Tools",
        description: "Glass weight calculator and more.",
        href: "/ren"
      }
    ];
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Home</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&amp;display=swap" rel="stylesheet"/>`);
    });
    $$renderer2.push(`<canvas class="ambient-canvas svelte-1uha8ag" aria-hidden="true"></canvas> <div class="home-stack svelte-1uha8ag"><section class="hero svelte-1uha8ag"><div class="portrait-wrap svelte-1uha8ag"><img class="avatar svelte-1uha8ag"${attr("src", `${stringify(base)}/philip-face.png`)} alt="Philip Knott" width="200" height="200"/> <span class="orbit svelte-1uha8ag"></span></div> <div class="hero-text svelte-1uha8ag"><p class="eyebrow svelte-1uha8ag">Hello, I am</p> <h2 class="svelte-1uha8ag">Philip Knott</h2> <p class="subhead svelte-1uha8ag">Software developer. Owns a domain.</p></div></section> <section class="cards svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(cards);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let card = each_array[$$index];
      $$renderer2.push(`<a class="card svelte-1uha8ag"${attr("href", `${stringify(base)}${stringify(card.href)}`)}><div class="card-text"><h3 class="svelte-1uha8ag">${escape_html(card.title)}</h3> <p class="svelte-1uha8ag">${escape_html(card.description)}</p></div> <span class="card-arrow svelte-1uha8ag" aria-hidden="true">→</span></a>`);
    }
    $$renderer2.push(`<!--]--></section></div> <footer class="site-footer svelte-1uha8ag"><a href="https://github.com/Filupnot/filupnot.github.io" target="_blank" rel="noopener noreferrer" aria-label="Repository for this website" class="svelte-1uha8ag"><svg class="github-icon svelte-1uha8ag" viewBox="0 0 24 24" role="img" aria-hidden="true"><path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.02c0 4.426 2.865 8.185 6.84 9.51.5.092.682-.217.682-.482 0-.238-.008-.868-.013-1.703-2.782.604-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.533 1.033 1.533 1.033.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.95 0-1.093.39-1.987 1.03-2.686-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.845c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.545 1.377.202 2.394.1 2.647.64.699 1.028 1.593 1.028 2.686 0 3.848-2.339 4.694-4.566 4.943.359.309.678.92.678 1.852 0 1.337-.012 2.417-.012 2.747 0 .268.18.58.688.481A10.022 10.022 0 0 0 22 12.02C22 6.484 17.523 2 12 2z"></path></svg></a></footer>`);
  });
}
export {
  _page as default
};
