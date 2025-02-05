import { f as fail, r as redirect } from './index-DHSpIlkf.js';
import './client-BGiBm9n9.js';
import './memoize-BkSYiOwG.js';
import { s as superValidate } from './superValidate-rYpk9HcO.js';
import { z as zod } from './zod-BhS6dRKS.js';
import { f as formSchema } from './schema-EMGY3IXS.js';
import { u as user } from './auth-DQAPWa54.js';
import './exports-CLG2BRq1.js';
import './index2-BL47qDlJ.js';
import './stores-CxxJpioQ.js';
import './lifecycle-DfHz3eeH.js';
import './stringify-DX2pbVR5.js';
import './scheduler-C1h3Gt9x.js';
import './index-BibYS5cI.js';
import './translations-BMzuJwzR.js';

const redirectToFightOrDashboard = (cookies) => {
  const loginRedirectTarget = cookies.get("loginRedirectTarget");
  if (loginRedirectTarget) {
    redirect(302, loginRedirectTarget);
  } else {
    redirect(302, "/app/dashboard");
  }
};
const load = async ({ locals, cookies }) => {
  if (locals.user) {
    user.update((value) => locals.user);
    console.log("redirecting");
    console.log("PageServerLoad locals", locals);
    redirectToFightOrDashboard(cookies);
  }
  return {
    form: await superValidate(zod(formSchema))
  };
};
const actions = {
  default: async (event) => {
    try {
      console.log("action");
      const form = await superValidate(event, zod(formSchema));
      if (!form.valid) {
        return fail(400, {
          form
        });
      }
      try {
        await event.locals.pb.collection("users").authWithPassword(form.data.email, form.data.password);
        if (!event.locals.pb?.authStore?.model?.verified) {
          event.locals.pb.authStore.clear();
          console.log("user not verified");
          return fail(400, {
            form
          });
        }
      } catch (err) {
        console.log("error in form", err);
        return fail(400, {
          form
        });
      }
      redirectToFightOrDashboard(event.cookies);
      return { form };
    } catch (err) {
      console.log("error in login action", err);
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CM8J5ozW.js')).default;
const server_id = "src/routes/app/auth/login/+page.server.ts";
const imports = ["_app/immutable/nodes/4.Cp7-GkON.js","_app/immutable/chunks/scheduler.BmBrB_dT.js","_app/immutable/chunks/index.BQZQ5DB3.js","_app/immutable/chunks/form-button.CNyopK56.js","_app/immutable/chunks/helpers.g8wrkI0H.js","_app/immutable/chunks/entry.DnNy0IhO.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/switch.fB03Cpk5.js","_app/immutable/chunks/Avatar.BhWA5DcG.js","_app/immutable/chunks/button.D_ITeu-i.js","_app/immutable/chunks/button.BlP37tcM.js","_app/immutable/chunks/memoize.BzJ9-avW.js","_app/immutable/chunks/stores.BdCL2gQQ.js","_app/immutable/chunks/zod.B5pDC7Hl.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.QcM6aL-y.js","_app/immutable/chunks/schema.Dzw43gaf.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.CqHcWxsp.js","_app/immutable/chunks/index.CRAHlQQo.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/Check.CFBCV6Q5.js"];
const stylesheets = ["_app/immutable/assets/helpers.Bq721S71.css","_app/immutable/assets/switch.kHZku1PE.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css","_app/immutable/assets/dialog-content.CiZ0nAqS.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-CTRx4Tmj.js.map
