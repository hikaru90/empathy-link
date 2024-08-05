import * as server from '../entries/pages/fights/_id_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fights/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/fights/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DbgYA67B.js","_app/immutable/chunks/scheduler.gWKEXFbz.js","_app/immutable/chunks/index.CG0cexN_.js","_app/immutable/chunks/index.cH0IdTE4.js","_app/immutable/chunks/page.BfOfo_9B.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.CWnlcbln.js","_app/immutable/chunks/Avatar.Dh95kRus.js","_app/immutable/chunks/Avatar.svelte_svelte_type_style_lang.DLhwFRS-.js","_app/immutable/chunks/AppTopMenu.C_y8wpbh.js","_app/immutable/chunks/AppBottomMenu.Bl4_HKxc.js","_app/immutable/chunks/zod.CS4Ln7Cw.js","_app/immutable/chunks/memoize.CCA0v6Fo.js","_app/immutable/chunks/stores.COqhhIL7.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.CyatNRu3.js","_app/immutable/chunks/defaults.CEskAMGU.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/skeleton.B5q9FN8a.js","_app/immutable/chunks/index.CQneZq0D.js","_app/immutable/chunks/index.DRbuV-AL.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.EWVuRjxP.js","_app/immutable/chunks/CaretLeft.CMBBCnzY.js","_app/immutable/chunks/PaperPlane.BOoo_EtN.js"];
export const stylesheets = ["_app/immutable/assets/8.D0_bWKBs.css","_app/immutable/assets/Avatar.Btwqd2bw.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/index.CiZ0nAqS.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
export const fonts = [];
