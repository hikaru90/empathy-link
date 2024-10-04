import * as server from '../entries/pages/app/fights/_id_/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/fights/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/fights/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.C7nO8q7g.js","_app/immutable/chunks/scheduler.DdioMMNe.js","_app/immutable/chunks/index.DwuYAy9N.js","_app/immutable/chunks/helpers.CreFEfAf.js","_app/immutable/chunks/page.y5a_kKVh.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.BCP1s-CR.js","_app/immutable/chunks/pocketbase.CrRMU9yX.js","_app/immutable/chunks/switch.OkAPrZLF.js","_app/immutable/chunks/index.BUraClYp.js","_app/immutable/chunks/Avatar.CVBxVDkD.js","_app/immutable/chunks/button.BYp31HAG.js","_app/immutable/chunks/AppBottomMenu.94h8reMa.js","_app/immutable/chunks/Share.BPz3q31k.js","_app/immutable/chunks/input.nuCiEMIp.js","_app/immutable/chunks/zod.B97PrdGN.js","_app/immutable/chunks/memoize.Di7UoVw0.js","_app/immutable/chunks/stores.Cjp1LSY7.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/index.C9TZxjhQ.js","_app/immutable/chunks/index.QlCbpJm_.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.jtUVx24Y.js","_app/immutable/chunks/CaretLeft.C8z7iHOO.js","_app/immutable/chunks/PaperPlane.BW0XABiB.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/skeleton.BdebeVnV.js"];
export const stylesheets = ["_app/immutable/assets/9.C0O7MeJv.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/Share.D0i0oang.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/index.CiZ0nAqS.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
export const fonts = [];
