import { f as fail, r as redirect } from './index-DHSpIlkf.js';
import './client-BGiBm9n9.js';
import './memoize-CrOQi2XR.js';
import { s as superValidate, a as setError } from './superValidate-DXI-Y6KM.js';
import { z as zod } from './zod-CSB5-Kzu.js';
import { z } from './index-BibYS5cI.js';
import { a as locale, t as t2 } from './translations-Bkz4zMob.js';
import { g as get_store_value } from './exports-CLG2BRq1.js';
import './index2-BL47qDlJ.js';
import './stores-DfFLgiwW.js';
import './lifecycle-Dr9vL0LE.js';
import './stringify-DX2pbVR5.js';
import './scheduler-Be-hqvXf.js';

console.log("locale", get_store_value(locale));
const formSchema = z.object({
  firstName: z.string().min(3, { message: get_store_value(t2)("default.page.login.form.firstname.tooShortError") }).max(30, { message: get_store_value(t2)("default.page.login.form.firstname.tooLongError") }),
  lastName: z.string().min(3, { message: get_store_value(t2)("default.page.login.form.lastname.tooShortError") }).max(30, { message: get_store_value(t2)("default.page.login.form.lastname.tooLongError") }),
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
      const existingUser = await event.locals.pb.collection("users").getFirstListItem(`email="${form.data.email}"`);
      if (existingUser) {
        return setError(form, "email", "A user with this email already exists");
      }
    } catch (err) {
      if (err.status !== 404) {
        console.error("Error checking for existing user:", err);
        return fail(500, { form });
      }
    }
    try {
      const formData = {
        firstName: form.data.firstName,
        lastName: form.data.lastName,
        email: form.data.email,
        password: form.data.password,
        passwordConfirm: form.data.password,
        emailVisibility: true
      };
      console.log("formData", formData);
      const creationResult = await event.locals.pb.collection("users").create(formData);
      console.log("creationResult", creationResult);
      await event.locals.pb.collection("users").requestVerification(String(form.data.email));
    } catch (err) {
      console.log("error in register form", err);
      return fail(500, {
        form
      });
    }
    redirect(302, "/app/auth/login?verifyMail=true");
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
const component = async () => component_cache ??= (await import('./_page.svelte-bpApbnIK.js')).default;
const server_id = "src/routes/app/auth/register/+page.server.ts";
const imports = ["_app/immutable/nodes/5.D9yX33ac.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/form-button.Bt4HIfP4.js","_app/immutable/chunks/helpers.C2F2lmQ3.js","_app/immutable/chunks/page.BxjNqAN0.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.B5Mv6Uxa.js","_app/immutable/chunks/index.DfSKg4Ih.js","_app/immutable/chunks/switch.DNTnQ2M_.js","_app/immutable/chunks/Avatar.CLYrKi-U.js","_app/immutable/chunks/button.A7J3RAYz.js","_app/immutable/chunks/button.C095cpuc.js","_app/immutable/chunks/zod.DVU-mH4r.js","_app/immutable/chunks/memoize.DZzCiDwd.js","_app/immutable/chunks/stores.C46p-EcX.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.Dnbnrzao.js","_app/immutable/chunks/schema.DicqP0gP.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.B5laX6kM.js"];
const stylesheets = ["_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-D9eMt2zB.js.map
