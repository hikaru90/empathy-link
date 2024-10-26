import * as server from '../entries/pages/app/fights/_id_/respond/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/fights/_id_/respond/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.Bi-BZMQX.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/helpers.C2F2lmQ3.js","_app/immutable/chunks/page.BxjNqAN0.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.B5Mv6Uxa.js","_app/immutable/chunks/AppTopMenu.bu7JEGYI.js","_app/immutable/chunks/switch.DNTnQ2M_.js","_app/immutable/chunks/index.DfSKg4Ih.js","_app/immutable/chunks/Avatar.CLYrKi-U.js","_app/immutable/chunks/button.A7J3RAYz.js","_app/immutable/chunks/AppBottomMenu.BG1J1hbK.js","_app/immutable/chunks/stores.C46p-EcX.js","_app/immutable/chunks/index.BEk7VaRI.js","_app/immutable/chunks/zod.DVU-mH4r.js","_app/immutable/chunks/memoize.DZzCiDwd.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.BWl5-9Zr.js","_app/immutable/chunks/CaretLeft.BzQWyqnQ.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/button.C095cpuc.js"];
export const stylesheets = ["_app/immutable/assets/10.BG3GntSY.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
export const fonts = [];
