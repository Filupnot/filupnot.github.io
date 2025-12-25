import { c as create_ssr_component } from "../../chunks/ssr.js";
import { b as base } from "../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { e as escape } from "../../chunks/escape.js";
const css = {
  code: ".hero.svelte-xbgtyx{display:grid;place-items:center;gap:1.5rem;text-align:center}.avatar.svelte-xbgtyx{width:240px;height:240px;object-fit:cover;border-radius:999px}h2.svelte-xbgtyx{margin:0}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { base } from \\"$app/paths\\";\\n<\/script>\\n\\n<section class=\\"hero\\">\\n  <img\\n    class=\\"avatar\\"\\n    src=\\"{base}/philip-face.png\\"\\n    alt=\\"Philip Knott\\"\\n    width=\\"240\\"\\n    height=\\"240\\"\\n  />\\n  <h2>Philip Knott</h2>\\n</section>\\n\\n<style>\\n  .hero {\\n    display: grid;\\n    place-items: center;\\n    gap: 1.5rem;\\n    text-align: center;\\n  }\\n\\n  .avatar {\\n    width: 240px;\\n    height: 240px;\\n    object-fit: cover;\\n    border-radius: 999px;\\n  }\\n\\n  h2 {\\n    margin: 0;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAeE,mBAAM,CACJ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,MAAM,CACX,UAAU,CAAE,MACd,CAEA,qBAAQ,CACN,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,UAAU,CAAE,KAAK,CACjB,aAAa,CAAE,KACjB,CAEA,gBAAG,CACD,MAAM,CAAE,CACV"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<section class="hero svelte-xbgtyx" data-svelte-h="svelte-6vp0mh"><img class="avatar svelte-xbgtyx" src="${escape(base, true) + "/philip-face.png"}" alt="Philip Knott" width="240" height="240"> <h2 class="svelte-xbgtyx">Philip Knott</h2> </section>`;
});
export {
  Page as default
};
