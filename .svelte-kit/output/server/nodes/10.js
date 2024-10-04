import * as server from '../entries/pages/app/fights/_id_/respond/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/fights/_id_/respond/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.u_34B-zk.js","_app/immutable/chunks/scheduler.DdioMMNe.js","_app/immutable/chunks/index.DwuYAy9N.js","_app/immutable/chunks/helpers.DRuoA_Ub.js","_app/immutable/chunks/page.CF0Ovvew.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.Bj8-M4tG.js","_app/immutable/chunks/pocketbase.D5VS0VDr.js","_app/immutable/chunks/switch.SCDcmPRi.js","_app/immutable/chunks/index.B3moHJ5Z.js","_app/immutable/chunks/Avatar.CSEddbAJ.js","_app/immutable/chunks/button.B35vIzx1.js","_app/immutable/chunks/AppBottomMenu.Dq_ZJfxR.js","_app/immutable/chunks/stores.BjqphM1R.js","_app/immutable/chunks/index.WpHQCfF7.js","_app/immutable/chunks/zod.Dpy8eUe1.js","_app/immutable/chunks/memoize.DKCXd2wb.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.Bm8zcuhN.js","_app/immutable/chunks/CaretLeft.DecFd9iH.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/button.CCeL8w-r.js"];
export const stylesheets = ["_app/immutable/assets/10.BG3GntSY.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
export const fonts = [];
