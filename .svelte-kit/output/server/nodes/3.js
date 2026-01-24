

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Ctf47y2y.js","_app/immutable/chunks/7E3TE2H7.js","_app/immutable/chunks/OkgDLo3s.js","_app/immutable/chunks/B3Mksg1v.js"];
export const stylesheets = ["_app/immutable/assets/3.DsoII8W4.css"];
export const fonts = [];
