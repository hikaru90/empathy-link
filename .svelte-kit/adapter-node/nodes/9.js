import * as server from '../entries/pages/fights/_id_/respond/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fights/_id_/respond/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/fights/[id]/respond/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.C7NDPREz.js","_app/immutable/chunks/scheduler.CKu2orG_.js","_app/immutable/chunks/index.DXc6nQ0s.js","_app/immutable/chunks/page.CjYSaJLb.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.DV9I5Wjp.js","_app/immutable/chunks/stores.3cYkxB9D.js","_app/immutable/chunks/Menu.DmxiePjz.js","_app/immutable/chunks/index.BhsRs3n4.js","_app/immutable/chunks/zod.CoJ9B_D1.js","_app/immutable/chunks/memoize.CGCrhbMP.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/Mascot.DdMQgkTt.js","_app/immutable/chunks/defaults.CEskAMGU.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js"];
export const stylesheets = ["_app/immutable/assets/9.Bddb2Kvx.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Mascot.CIMRm52r.css"];
export const fonts = [];
