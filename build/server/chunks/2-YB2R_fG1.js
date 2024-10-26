import { l as loadTranslations } from './translations-Bkz4zMob.js';
import { u as user } from './auth-DQAPWa54.js';
import './index2-BL47qDlJ.js';
import './exports-CLG2BRq1.js';
import './client-BGiBm9n9.js';

const load$1 = async ({ url, data }) => {
  await loadTranslations(data.locale, url.pathname);
  if (data.user)
    user.set(data.user);
  else
    user.set(void 0);
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
const component = async () => component_cache ??= (await import('./_layout.svelte-D2jK8br5.js')).default;
const universal_id = "src/routes/app/+layout.ts";
const server_id = "src/routes/app/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.CsLoohY5.js","_app/immutable/chunks/page.BxjNqAN0.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.B5Mv6Uxa.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/ResizeObserver.es.Ct-hmR27.js","_app/immutable/chunks/helpers.C2F2lmQ3.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.B5laX6kM.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-learn.DB5MBh20.js","_app/immutable/chunks/stores.C46p-EcX.js","_app/immutable/chunks/button.A7J3RAYz.js"];
const stylesheets = ["_app/immutable/assets/2.DfEh8A2i.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/ResizeObserver.DNnuGCMr.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = ["_app/immutable/assets/InterTight-Regular.CqoMwhRv.woff2","_app/immutable/assets/InterTight-Regular.DCSbckRh.woff","_app/immutable/assets/InterTight-Regular.B4tqujfy.ttf","_app/immutable/assets/subset-Inter-Regular.DZ8VgNuZ.woff2","_app/immutable/assets/subset-Inter-Regular.syRB4m7t.woff","_app/immutable/assets/subset-Inter-Regular.VY9OEPcL.ttf","_app/immutable/assets/subset-Inter-Bold.BNqEc-ji.woff2","_app/immutable/assets/subset-Inter-Bold.DDg232fS.woff","_app/immutable/assets/subset-Inter-Bold.C8gDZFIR.ttf"];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=2-YB2R_fG1.js.map
