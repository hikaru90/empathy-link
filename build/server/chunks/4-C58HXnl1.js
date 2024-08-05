import { f as fail, r as redirect } from './index-DHSpIlkf.js';
import './client-Citk00eW.js';
import { z } from './index-BgK6iorh.js';
import { s as superValidate } from './superValidate-s7Ti4f73.js';
import { z as zod } from './zod-Bv-6xRnW.js';
import { a as locale, t as t2 } from './translations-CjpxX11l.js';
import { g as get_store_value } from './exports-BRB0bLON.js';
import './index2-De7DMM6-.js';
import './stores-BZs2yA97.js';
import './lifecycle-BsyQvuw_.js';
import './stringify-DX2pbVR5.js';
import './scheduler-M4PBPObN.js';

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
const component = async () => component_cache ??= (await import('./_page.svelte-DoPptjeB.js')).default;
const server_id = "src/routes/auth/register/+page.server.ts";
const imports = ["_app/immutable/nodes/4.B6_gsQsZ.js","_app/immutable/chunks/scheduler.gWKEXFbz.js","_app/immutable/chunks/index.CG0cexN_.js","_app/immutable/chunks/Menu.DckRfB8c.js","_app/immutable/chunks/index.DX7FOcvC.js","_app/immutable/chunks/page.DM_0WmRN.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.CEh8OOCl.js","_app/immutable/chunks/Avatar.svelte_svelte_type_style_lang.DPRrV1hT.js","_app/immutable/chunks/Avatar.h3nvYJtf.js","_app/immutable/chunks/button.DdYiIxki.js","_app/immutable/chunks/zod.D0XA1AUd.js","_app/immutable/chunks/memoize.BCGTZPkc.js","_app/immutable/chunks/stores.CyrLmYVR.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.B2dq-T7m.js","_app/immutable/chunks/schema.CrPhIjpD.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.DX1bSK0D.js","_app/immutable/chunks/form-button.BmqzV2Ai.js"];
const stylesheets = ["_app/immutable/assets/Avatar.Btwqd2bw.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-C58HXnl1.js.map
