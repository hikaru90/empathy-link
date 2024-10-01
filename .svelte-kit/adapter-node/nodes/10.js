import * as server from '../entries/pages/app/fights/_id_/respond/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/fights/_id_/respond/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.BXWCjfsO.js","_app/immutable/chunks/scheduler.D1PieneV.js","_app/immutable/chunks/index.C3mFgbJp.js","_app/immutable/chunks/helpers.DSTVP_LV.js","_app/immutable/chunks/page.DQIK3wp5.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.D4JEcaEf.js","_app/immutable/chunks/pocketbase.Dj25iZlr.js","_app/immutable/chunks/sheet-title.DLaL8EkV.js","_app/immutable/chunks/Avatar.svelte_svelte_type_style_lang.z0ErXBdC.js","_app/immutable/chunks/Avatar.keSYyv-U.js","_app/immutable/chunks/mode.CYM0Va2b.js","_app/immutable/chunks/button.D6Mx7X_c.js","_app/immutable/chunks/button.Ip12NaY0.js","_app/immutable/chunks/AppBottomMenu.DOQnBVMv.js","_app/immutable/chunks/stores.L5e1JiUK.js","_app/immutable/chunks/index._aXJaOKJ.js","_app/immutable/chunks/zod.BICKCrrP.js","_app/immutable/chunks/memoize.Bryq1t9y.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.Bt33s8CL.js","_app/immutable/chunks/CaretLeft.Cm6rIGr6.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/button.7LkmpkTV.js"];
export const stylesheets = ["_app/immutable/assets/10.DXZrQMdT.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/Avatar.CEzyzJt9.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
export const fonts = [];
