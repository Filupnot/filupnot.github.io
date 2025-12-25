import { c as create_ssr_component } from "../../../chunks/ssr.js";
const css = {
  code: ".about.svelte-1y449bh{text-align:center}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<section class=\\"about\\">\\n  <h2>About</h2>\\n</section>\\n\\n<style>\\n  .about {\\n    text-align: center;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAKE,qBAAO,CACL,UAAU,CAAE,MACd"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<section class="about svelte-1y449bh" data-svelte-h="svelte-y92456"><h2>About</h2> </section>`;
});
export {
  Page as default
};
