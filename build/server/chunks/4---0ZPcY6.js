import { f as fail, r as redirect } from './index-DHSpIlkf.js';
import './client-CH6iu0g5.js';
import { z } from './index-B76MYh-W.js';
import { s as superValidate } from './superValidate-D_lKo2ja.js';
import { z as zod } from './zod-DucbyiJ7.js';
import { a as locale, t as t2 } from './translations-BkqIZgNA.js';
import { g as get_store_value } from './exports-DdwBo3bR.js';
import './index2-DDd9jZNR.js';
import './stores-eIeNDe2n.js';
import './lifecycle-BsyQvuw_.js';
import './stringify-DX2pbVR5.js';
import './scheduler-B6WqtzJY.js';

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
    redirect(302, "/auth/login");
    return { form };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Dy0EWZ3N.js')).default;
const server_id = "src/routes/auth/register/+page.server.ts";
const imports = ["_app/immutable/nodes/4.Qlhcm-NY.js","_app/immutable/chunks/scheduler.CKu2orG_.js","_app/immutable/chunks/index.DXc6nQ0s.js","_app/immutable/chunks/Menu.DmxiePjz.js","_app/immutable/chunks/page.CjYSaJLb.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.DV9I5Wjp.js","_app/immutable/chunks/zod.CoJ9B_D1.js","_app/immutable/chunks/memoize.CGCrhbMP.js","_app/immutable/chunks/stores.3cYkxB9D.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.w0ZSS3XE.js","_app/immutable/chunks/schema.DW48twGu.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.QUt0y59N.js","_app/immutable/chunks/form-button.Cw1lUzlW.js"];
const stylesheets = ["_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4---0ZPcY6.js.map
