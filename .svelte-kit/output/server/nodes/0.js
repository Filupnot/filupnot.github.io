import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.MMcEAP88.js","_app/immutable/chunks/B_yitYQZ.js","_app/immutable/chunks/BcBnY1C5.js","_app/immutable/chunks/Bgt4e5cg.js","_app/immutable/chunks/C-Dw83L1.js","_app/immutable/chunks/q6mOKqdP.js","_app/immutable/chunks/DKsBXdNh.js","_app/immutable/chunks/CjjSEJ9C.js","_app/immutable/chunks/ChN3xW-y.js","_app/immutable/chunks/BdgsI-J2.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/BPQ5wgkL.js","_app/immutable/chunks/BQABW9Mc.js","_app/immutable/chunks/BUYRcq9n.js","_app/immutable/chunks/BMwymINt.js","_app/immutable/chunks/0d2C45fy.js"];
export const stylesheets = ["_app/immutable/assets/0.DIminjST.css"];
export const fonts = [];
