import * as server from '../entries/pages/app/fights/_id_/respond/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/fights/_id_/respond/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.DUdp9S-j.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/helpers.Dibp7sA5.js","_app/immutable/chunks/page.bZUY7JJF.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.Ctrs9mTK.js","_app/immutable/chunks/AppTopMenu.Dq6v7hsH.js","_app/immutable/chunks/switch.ugwwvEwu.js","_app/immutable/chunks/index.DDDUaqVC.js","_app/immutable/chunks/Avatar.C7ArXovL.js","_app/immutable/chunks/button.JkBH6UTa.js","_app/immutable/chunks/AppBottomMenu.IwLlHcLO.js","_app/immutable/chunks/stores.3y2l6SWm.js","_app/immutable/chunks/index.Cv6N4ySl.js","_app/immutable/chunks/zod.dDOca3ht.js","_app/immutable/chunks/memoize.DxdV8b0X.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.BYWwPgZB.js","_app/immutable/chunks/CaretLeft.BbUvETf9.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/button.DvmTZhhU.js"];
export const stylesheets = ["_app/immutable/assets/10.BG3GntSY.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
export const fonts = [];
