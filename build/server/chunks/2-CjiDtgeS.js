import { l as loadTranslations } from './translations-MFOOILLS.js';
import { u as user } from './auth-CaZN_opl.js';
import './index2-BL47qDlJ.js';
import './exports-CLG2BRq1.js';
import './client-BGiBm9n9.js';

const load$1 = async ({ url, data }) => {
  await loadTranslations(data.locale, url.pathname);
  if (data.user)
    user.set(data.user);
  else
    user.set(void 0);
  console.log("layout.ts values - locals:", data);
  console.log("layout.ts values - user:", data.user);
  return {
    locale: data.locale,
    route: url.pathname,
    user: data.user
  };
};

var _layout_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load$1
});

const load = async ({ url, locals }) => {
  await loadTranslations(locals.locale, url.pathname);
  console.log("layout.server.ts values - locals:", locals);
  console.log("layout.server.ts values - user:", locals.user);
  return {
    url: url.pathname,
    user: locals.user,
    locale: locals.locale
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DXxWeLsj.js')).default;
const universal_id = "src/routes/app/+layout.ts";
const server_id = "src/routes/app/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.C1znI3TE.js","_app/immutable/chunks/page.Bdjqy4pw.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.CXukiqCs.js","_app/immutable/chunks/scheduler.Clviz5E8.js","_app/immutable/chunks/index.C2t9fK9o.js","_app/immutable/chunks/ResizeObserver.es.Bq7KoWR4.js","_app/immutable/chunks/helpers.Dj0e7Byj.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.CKatqjSG.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-learn.DB5MBh20.js","_app/immutable/chunks/stores.WBl8b-3l.js","_app/immutable/chunks/button.CK6XXZFl.js"];
const stylesheets = ["_app/immutable/assets/2.DfEh8A2i.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/ResizeObserver.CmiY_UUB.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = ["_app/immutable/assets/InterTight-Regular.CqoMwhRv.woff2","_app/immutable/assets/InterTight-Regular.DCSbckRh.woff","_app/immutable/assets/InterTight-Regular.B4tqujfy.ttf","_app/immutable/assets/subset-Inter-Regular.DZ8VgNuZ.woff2","_app/immutable/assets/subset-Inter-Regular.syRB4m7t.woff","_app/immutable/assets/subset-Inter-Regular.VY9OEPcL.ttf","_app/immutable/assets/subset-Inter-Bold.BNqEc-ji.woff2","_app/immutable/assets/subset-Inter-Bold.DDg232fS.woff","_app/immutable/assets/subset-Inter-Bold.C8gDZFIR.ttf"];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=2-CjiDtgeS.js.map
