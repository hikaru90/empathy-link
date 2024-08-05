import * as server from '../entries/pages/auth/register/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.B6_gsQsZ.js","_app/immutable/chunks/scheduler.gWKEXFbz.js","_app/immutable/chunks/index.CG0cexN_.js","_app/immutable/chunks/Menu.DckRfB8c.js","_app/immutable/chunks/index.DX7FOcvC.js","_app/immutable/chunks/page.DM_0WmRN.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.CEh8OOCl.js","_app/immutable/chunks/Avatar.svelte_svelte_type_style_lang.DPRrV1hT.js","_app/immutable/chunks/Avatar.h3nvYJtf.js","_app/immutable/chunks/button.DdYiIxki.js","_app/immutable/chunks/zod.D0XA1AUd.js","_app/immutable/chunks/memoize.BCGTZPkc.js","_app/immutable/chunks/stores.CyrLmYVR.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.B2dq-T7m.js","_app/immutable/chunks/schema.CrPhIjpD.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.DX1bSK0D.js","_app/immutable/chunks/form-button.BmqzV2Ai.js"];
export const stylesheets = ["_app/immutable/assets/Avatar.Btwqd2bw.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
export const fonts = [];
