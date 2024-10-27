import { l as loadTranslations } from './translations-DZQwf8l0.js';
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

const load = async ({ fetch, url, locals }) => {
  const postHogApi = await fetch(`/api/posthog/decide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId: locals.posthogId })
  }).then((r) => r.json());
  await loadTranslations(locals.locale, url.pathname);
  return {
    url: url.pathname,
    user: locals.user,
    locale: locals.locale,
    sessionToken: locals.sessionToken,
    userId: locals.userId,
    posthogId: locals.posthogId,
    featureFlags: postHogApi.featureFlags || {}
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-LN5TtHgj.js')).default;
const universal_id = "src/routes/+layout.ts";
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.CeeuVADQ.js","_app/immutable/chunks/page.bZUY7JJF.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.Ctrs9mTK.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/ResizeObserver.es.Do8N8_i8.js","_app/immutable/chunks/helpers.Dibp7sA5.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.G8TICqEJ.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/stores.3y2l6SWm.js","_app/immutable/chunks/module.B9UjFE2l.js"];
const stylesheets = ["_app/immutable/assets/2.DfEh8A2i.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/ResizeObserver.Diec8HPv.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = ["_app/immutable/assets/InterTight-Regular.CqoMwhRv.woff2","_app/immutable/assets/InterTight-Regular.DCSbckRh.woff","_app/immutable/assets/InterTight-Regular.B4tqujfy.ttf","_app/immutable/assets/subset-Inter-Regular.DZ8VgNuZ.woff2","_app/immutable/assets/subset-Inter-Regular.syRB4m7t.woff","_app/immutable/assets/subset-Inter-Regular.VY9OEPcL.ttf","_app/immutable/assets/subset-Inter-Bold.BNqEc-ji.woff2","_app/immutable/assets/subset-Inter-Bold.DDg232fS.woff","_app/immutable/assets/subset-Inter-Bold.C8gDZFIR.ttf"];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=0-CqXOKRZ1.js.map
