import * as server from '../entries/pages/app/fights/_id_/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/fights/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/fights/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.Cn_DUZHj.js","_app/immutable/chunks/scheduler.BmBrB_dT.js","_app/immutable/chunks/index.BQZQ5DB3.js","_app/immutable/chunks/helpers.g8wrkI0H.js","_app/immutable/chunks/entry.DnNy0IhO.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/AppBottomMenu.CkXkkK6h.js","_app/immutable/chunks/switch.fB03Cpk5.js","_app/immutable/chunks/Avatar.BhWA5DcG.js","_app/immutable/chunks/button.D_ITeu-i.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/Share.CIl3d03I.js","_app/immutable/chunks/input.QcM6aL-y.js","_app/immutable/chunks/zod.B5pDC7Hl.js","_app/immutable/chunks/memoize.BzJ9-avW.js","_app/immutable/chunks/stores.BdCL2gQQ.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/index.SsLB4xxl.js","_app/immutable/chunks/index.CRAHlQQo.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.CqHcWxsp.js","_app/immutable/chunks/CaretLeft.Cs-VcT_4.js","_app/immutable/chunks/Check.CFBCV6Q5.js","_app/immutable/chunks/PaperPlane.CDcRMlbn.js","_app/immutable/chunks/FightDisplay.DZ1SKm3W.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/skeleton.BQQp5uE_.js"];
export const stylesheets = ["_app/immutable/assets/helpers.Bq721S71.css","_app/immutable/assets/switch.kHZku1PE.css","_app/immutable/assets/Share.D0i0oang.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/dialog-content.CiZ0nAqS.css","_app/immutable/assets/Toaster.CqNDpgoD.css","_app/immutable/assets/FightDisplay.C0O7MeJv.css"];
export const fonts = [];
