import { f as fail, r as redirect } from './index-DHSpIlkf.js';
import './client-BGiBm9n9.js';
import './memoize-B28xu6JT.js';
import { s as superValidate } from './superValidate-Cs6G1-7q.js';
import { z as zod } from './zod-Bj0F2ims.js';
import { z } from './index-BibYS5cI.js';
import { a as locale, t as t2 } from './translations-BF87NCsX.js';
import { g as get_store_value } from './exports-CLG2BRq1.js';
import './index2-BL47qDlJ.js';
import './stores-DfFLgiwW.js';
import './lifecycle-Dr9vL0LE.js';
import './stringify-DX2pbVR5.js';
import './scheduler-Be-hqvXf.js';

console.log("locale", get_store_value(locale));
const formSchema = z.object({
  email: z.string().email({ message: get_store_value(t2)("default.page.login.form.email.validEmailError") }),
  password: z.string().min(6, { message: get_store_value(t2)("default.page.login.form.password.tooShortError") }).max(30, { message: get_store_value(t2)("default.page.login.form.password.tooLongError") })
});
const load = async ({ locals }) => {
  return {
    form: await superValidate(zod(formSchema))
  };
};
const actions = {
  default: async (event) => {
    console.log("action");
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    try {
      await event.locals.pb.collection("users").create({
        email: form.data.email,
        password: form.data.password,
        passwordConfirm: form.data.password
      });
      await event.locals.pb.collection("users").requestVerification(form.data.email);
    } catch (err) {
      console.log("error in register form", err);
      return fail(500, {
        form
      });
    }
    redirect(302, "/app/auth/login");
    return { form };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-N9nbYxZy.js')).default;
const server_id = "src/routes/app/auth/register/+page.server.ts";
const imports = ["_app/immutable/nodes/5.BKJAOMpq.js","_app/immutable/chunks/scheduler.CkaH_kk_.js","_app/immutable/chunks/index.54FFccaA.js","_app/immutable/chunks/form-button.DK64LBJG.js","_app/immutable/chunks/helpers.6NvQFJWp.js","_app/immutable/chunks/page.DamFOs5c.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.Cn3xRfEv.js","_app/immutable/chunks/Avatar.svelte_svelte_type_style_lang.DOqgdAoY.js","_app/immutable/chunks/mode.xV8F3Z9b.js","_app/immutable/chunks/Avatar.NWkREAHY.js","_app/immutable/chunks/sheet-header.D2ZyjI5t.js","_app/immutable/chunks/button.CpUAd11I.js","_app/immutable/chunks/button.C_MU4aCp.js","_app/immutable/chunks/button.DOhbcnex.js","_app/immutable/chunks/zod.CXyHRmIx.js","_app/immutable/chunks/memoize.DQfNMZz0.js","_app/immutable/chunks/stores.OUg7S8yO.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.5iOOS3dT.js","_app/immutable/chunks/schema.BtJB5XZB.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.BnlcgPzc.js"];
const stylesheets = ["_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/Avatar.CEzyzJt9.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-D4NP6s29.js.map
