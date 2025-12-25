

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.CSF4tqsi.js","_app/immutable/chunks/DYjCt7Qj.js","_app/immutable/chunks/Bc5AGW9m.js"];
export const stylesheets = ["_app/immutable/assets/3.BEkLjZFH.css"];
export const fonts = [];
