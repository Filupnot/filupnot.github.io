import { c as create_ssr_component } from "../../chunks/ssr.js";
import { b as base } from "../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape } from "../../chunks/escape.js";
const css = {
  code: ".page.svelte-1uxu19y{min-height:100vh;display:flex;flex-direction:column}.site-header.svelte-1uxu19y{padding:1rem 1.5rem;border-bottom:1px solid #ddd}.content.svelte-1uxu19y{flex:1;display:flex;align-items:center;justify-content:center;padding:2rem 1.5rem}.site-footer.svelte-1uxu19y{padding:1rem 1.5rem;border-top:1px solid #ddd}.nav.svelte-1uxu19y{display:flex;gap:1rem}@media(max-width: 720px){.site-header.svelte-1uxu19y{padding:0.75rem 1rem}.content.svelte-1uxu19y{padding:1.5rem 1rem}}",
  map: '{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import \\"../lib/styles/global.css\\";\\nimport { base } from \\"$app/paths\\";\\nconst footerMarkdown = \\"github.com/filupnot\\";\\nconst renderFooter = (markdown) => {\\n  const trimmed = markdown.trim();\\n  const url = trimmed.startsWith(\\"http\\") ? trimmed : `https://${trimmed}`;\\n  return `<a href=\\"${url}\\" target=\\"_blank\\" rel=\\"noreferrer\\">${trimmed}</a>`;\\n};\\n<\/script>\\n\\n<svelte:head>\\n  <link rel=\\"icon\\" href=\\"/favicon.svg\\" type=\\"image/svg+xml\\" />\\n</svelte:head>\\n\\n<main class=\\"page\\">\\n  <header class=\\"site-header\\">\\n    <nav class=\\"nav\\">\\n      <a href=\\"{base}/\\">Home</a>\\n      <a href=\\"{base}/about\\">About</a>\\n    </nav>\\n  </header>\\n\\n  <section class=\\"content\\">\\n    <slot />\\n  </section>\\n\\n  <footer class=\\"site-footer\\">\\n    <div class=\\"footer-content\\">\\n      {@html renderFooter(footerMarkdown)}\\n    </div>\\n  </footer>\\n</main>\\n\\n<style>\\n  .page {\\n    min-height: 100vh;\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .site-header {\\n    padding: 1rem 1.5rem;\\n    border-bottom: 1px solid #ddd;\\n  }\\n\\n  .content {\\n    flex: 1;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    padding: 2rem 1.5rem;\\n  }\\n\\n  .site-footer {\\n    padding: 1rem 1.5rem;\\n    border-top: 1px solid #ddd;\\n  }\\n\\n  .nav {\\n    display: flex;\\n    gap: 1rem;\\n  }\\n\\n  @media (max-width: 720px) {\\n    .site-header {\\n      padding: 0.75rem 1rem;\\n    }\\n\\n    .content {\\n      padding: 1.5rem 1rem;\\n    }\\n  }\\n</style>\\n"],"names":[],"mappings":"AAkCE,oBAAM,CACJ,UAAU,CAAE,KAAK,CACjB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAClB,CAEA,2BAAa,CACX,OAAO,CAAE,IAAI,CAAC,MAAM,CACpB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAC3B,CAEA,uBAAS,CACP,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,OAAO,CAAE,IAAI,CAAC,MAChB,CAEA,2BAAa,CACX,OAAO,CAAE,IAAI,CAAC,MAAM,CACpB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IACxB,CAEA,mBAAK,CACH,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IACP,CAEA,MAAO,YAAY,KAAK,CAAE,CACxB,2BAAa,CACX,OAAO,CAAE,OAAO,CAAC,IACnB,CAEA,uBAAS,CACP,OAAO,CAAE,MAAM,CAAC,IAClB,CACF"}'
};
const footerMarkdown = "github.com/filupnot";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const renderFooter = (markdown) => {
    const trimmed = markdown.trim();
    const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    return `<a href="${url}" target="_blank" rel="noreferrer">${trimmed}</a>`;
  };
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-czf5ns_START --><link rel="icon" href="/favicon.svg" type="image/svg+xml"><!-- HEAD_svelte-czf5ns_END -->`, ""} <main class="page svelte-1uxu19y"><header class="site-header svelte-1uxu19y" data-svelte-h="svelte-hswi8w"><nav class="nav svelte-1uxu19y"><a href="${escape(base, true) + "/"}">Home</a> <a href="${escape(base, true) + "/about"}">About</a></nav></header> <section class="content svelte-1uxu19y">${slots.default ? slots.default({}) : ``}</section> <footer class="site-footer svelte-1uxu19y"><div class="footer-content"><!-- HTML_TAG_START -->${renderFooter(footerMarkdown)}<!-- HTML_TAG_END --></div></footer> </main>`;
});
export {
  Layout as default
};
