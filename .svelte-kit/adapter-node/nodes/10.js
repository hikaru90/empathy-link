import * as server from '../entries/pages/app/fights/_id_/respond/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/fights/_id_/respond/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.C__Or8lj.js","_app/immutable/chunks/scheduler.CkaH_kk_.js","_app/immutable/chunks/index.54FFccaA.js","_app/immutable/chunks/helpers.6NvQFJWp.js","_app/immutable/chunks/page.DamFOs5c.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.Cn3xRfEv.js","_app/immutable/chunks/pocketbase.0TMbqc9Z.js","_app/immutable/chunks/sheet-header.D2ZyjI5t.js","_app/immutable/chunks/Avatar.svelte_svelte_type_style_lang.DOqgdAoY.js","_app/immutable/chunks/Avatar.NWkREAHY.js","_app/immutable/chunks/mode.xV8F3Z9b.js","_app/immutable/chunks/button.CpUAd11I.js","_app/immutable/chunks/button.C_MU4aCp.js","_app/immutable/chunks/AppBottomMenu.CDrbokZT.js","_app/immutable/chunks/stores.OUg7S8yO.js","_app/immutable/chunks/index.D5ujl8FQ.js","_app/immutable/chunks/zod.CXyHRmIx.js","_app/immutable/chunks/memoize.DQfNMZz0.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.FOC2mITr.js","_app/immutable/chunks/CaretLeft.B2CCAozD.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/button.DOhbcnex.js"];
export const stylesheets = ["_app/immutable/assets/10.DXZrQMdT.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/Avatar.CEzyzJt9.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
export const fonts = [];
