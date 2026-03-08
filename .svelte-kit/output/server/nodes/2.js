

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/workout/+layout.ts";
export const imports = ["_app/immutable/nodes/2.CV0qbnQN.js","_app/immutable/chunks/B_yitYQZ.js","_app/immutable/chunks/BcBnY1C5.js","_app/immutable/chunks/CjjSEJ9C.js"];
export const stylesheets = [];
export const fonts = [];
