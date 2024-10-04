import * as server from '../entries/pages/app/auth/register/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/auth/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/auth/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.onQw2Fos.js","_app/immutable/chunks/scheduler.DdioMMNe.js","_app/immutable/chunks/index.DwuYAy9N.js","_app/immutable/chunks/form-button.BTc7CkiL.js","_app/immutable/chunks/helpers.CreFEfAf.js","_app/immutable/chunks/page.y5a_kKVh.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.BCP1s-CR.js","_app/immutable/chunks/index.BUraClYp.js","_app/immutable/chunks/switch.OkAPrZLF.js","_app/immutable/chunks/Avatar.CVBxVDkD.js","_app/immutable/chunks/button.BYp31HAG.js","_app/immutable/chunks/button.DyMNkcnI.js","_app/immutable/chunks/zod.B97PrdGN.js","_app/immutable/chunks/memoize.Di7UoVw0.js","_app/immutable/chunks/stores.Cjp1LSY7.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.nuCiEMIp.js","_app/immutable/chunks/schema.BUBsW9lW.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.jtUVx24Y.js"];
export const stylesheets = ["_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
export const fonts = [];
