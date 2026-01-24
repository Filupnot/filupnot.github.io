import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DQ0LwWqX.js","_app/immutable/chunks/7E3TE2H7.js","_app/immutable/chunks/OkgDLo3s.js","_app/immutable/chunks/B3Mksg1v.js","_app/immutable/chunks/Dmz1izpj.js","_app/immutable/chunks/D6IYFWxt.js","_app/immutable/chunks/Fk3cocL4.js","_app/immutable/chunks/B84cQ8CF.js","_app/immutable/chunks/DCsxDTCv.js","_app/immutable/chunks/D93JssGy.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/C_v8qH-G.js","_app/immutable/chunks/DB8Rhpuk.js","_app/immutable/chunks/j7JlpyFE.js","_app/immutable/chunks/CirKMD74.js","_app/immutable/chunks/CRZ7XNtN.js"];
export const stylesheets = ["_app/immutable/assets/0.DIminjST.css"];
export const fonts = [];
