

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DrRWYN6e.js","_app/immutable/chunks/wAncXoqV.js","_app/immutable/chunks/BqAO4Gzu.js","_app/immutable/chunks/BxRlFAhy.js"];
export const stylesheets = ["_app/immutable/assets/3.DsoII8W4.css"];
export const fonts = [];
