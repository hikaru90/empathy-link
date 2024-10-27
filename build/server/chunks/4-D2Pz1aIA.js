import { f as fail, r as redirect } from './index-DHSpIlkf.js';
import './client-BGiBm9n9.js';
import './memoize-CrOQi2XR.js';
import { s as superValidate } from './superValidate-DXI-Y6KM.js';
import { z as zod } from './zod-CSB5-Kzu.js';
import { f as formSchema } from './schema-DRIlWgAC.js';
import { u as user } from './auth-DQAPWa54.js';
import './exports-CLG2BRq1.js';
import './index2-BL47qDlJ.js';
import './stores-DfFLgiwW.js';
import './lifecycle-Dr9vL0LE.js';
import './stringify-DX2pbVR5.js';
import './scheduler-Be-hqvXf.js';
import './index-BibYS5cI.js';
import './translations-DZQwf8l0.js';

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
const component = async () => component_cache ??= (await import('./_page.svelte-DQF1X9KF.js')).default;
const server_id = "src/routes/app/auth/login/+page.server.ts";
const imports = ["_app/immutable/nodes/4.DtSjFY19.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/form-button.BHnCYszo.js","_app/immutable/chunks/helpers.Dibp7sA5.js","_app/immutable/chunks/page.bZUY7JJF.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.Ctrs9mTK.js","_app/immutable/chunks/index.DDDUaqVC.js","_app/immutable/chunks/switch.ugwwvEwu.js","_app/immutable/chunks/Avatar.C7ArXovL.js","_app/immutable/chunks/button.JkBH6UTa.js","_app/immutable/chunks/button.DvmTZhhU.js","_app/immutable/chunks/memoize.DxdV8b0X.js","_app/immutable/chunks/stores.3y2l6SWm.js","_app/immutable/chunks/zod.dDOca3ht.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.DBLEwNC_.js","_app/immutable/chunks/schema.a03NdEzJ.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.G8TICqEJ.js","_app/immutable/chunks/index.dvWlk1zN.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/Check.B_Ok3goj.js"];
const stylesheets = ["_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css","_app/immutable/assets/dialog-content.CiZ0nAqS.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-D2Pz1aIA.js.map
