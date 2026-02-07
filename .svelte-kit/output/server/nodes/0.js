import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.AVVaIlLe.js","_app/immutable/chunks/wAncXoqV.js","_app/immutable/chunks/BqAO4Gzu.js","_app/immutable/chunks/BxRlFAhy.js","_app/immutable/chunks/C_Yuzu4F.js","_app/immutable/chunks/CeUXZaPU.js","_app/immutable/chunks/DxvVRONM.js","_app/immutable/chunks/xGk7dUjb.js","_app/immutable/chunks/h9WUrgk6.js","_app/immutable/chunks/BNGsxVG5.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/pHdZIkmi.js","_app/immutable/chunks/D3v0BZuR.js","_app/immutable/chunks/BRk2N3TX.js","_app/immutable/chunks/Ps2Ki1QF.js","_app/immutable/chunks/C78-m0cx.js"];
export const stylesheets = ["_app/immutable/assets/0.DIminjST.css"];
export const fonts = [];
