import { f as fail, r as redirect } from './index-DHSpIlkf.js';
import './client-BGiBm9n9.js';
import './memoize-B28xu6JT.js';
import { s as superValidate } from './superValidate-Cs6G1-7q.js';
import { z as zod } from './zod-Bj0F2ims.js';
import { z } from './index-BibYS5cI.js';
import { a as locale, t as t2 } from './translations-MFOOILLS.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-BJWd8hlk.js')).default;
const server_id = "src/routes/app/auth/register/+page.server.ts";
const imports = ["_app/immutable/nodes/5.ocuW3lPZ.js","_app/immutable/chunks/scheduler.Clviz5E8.js","_app/immutable/chunks/index.C2t9fK9o.js","_app/immutable/chunks/form-button.q_s_8Fgw.js","_app/immutable/chunks/helpers.Dj0e7Byj.js","_app/immutable/chunks/page.Bdjqy4pw.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.CXukiqCs.js","_app/immutable/chunks/index.BWRN6MbD.js","_app/immutable/chunks/switch.pt09IzM1.js","_app/immutable/chunks/Avatar.CKc_V2mU.js","_app/immutable/chunks/button.CK6XXZFl.js","_app/immutable/chunks/button.B8WEXDO1.js","_app/immutable/chunks/zod.S05sbb9Y.js","_app/immutable/chunks/memoize.CvRdBrx2.js","_app/immutable/chunks/stores.WBl8b-3l.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.DsC561cZ.js","_app/immutable/chunks/schema.g0iCV9wB.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.CKatqjSG.js"];
const stylesheets = ["_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-DwJtzkOv.js.map
