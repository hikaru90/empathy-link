import * as server from '../entries/pages/fights/_id_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fights/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/fights/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.CqoG9xVo.js","_app/immutable/chunks/scheduler.CKu2orG_.js","_app/immutable/chunks/index.DXc6nQ0s.js","_app/immutable/chunks/page.CjYSaJLb.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.DV9I5Wjp.js","_app/immutable/chunks/Menu.DmxiePjz.js","_app/immutable/chunks/zod.CoJ9B_D1.js","_app/immutable/chunks/memoize.CGCrhbMP.js","_app/immutable/chunks/stores.3cYkxB9D.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.w0ZSS3XE.js","_app/immutable/chunks/defaults.CEskAMGU.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/index.B1fi2NTa.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/skeleton.C-vm2T2Q.js","_app/immutable/chunks/index.BhsRs3n4.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.QUt0y59N.js","_app/immutable/chunks/PaperPlane.BSjWv32x.js"];
export const stylesheets = ["_app/immutable/assets/8.DXoPMDRy.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/index.L5X4MdG3.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
export const fonts = [];
