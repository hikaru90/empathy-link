import { r as redirect, f as fail } from './index-DHSpIlkf.js';
import './client-CH6iu0g5.js';
import './index-B76MYh-W.js';
import { s as superValidate } from './superValidate-D_lKo2ja.js';
import { z as zod } from './zod-DucbyiJ7.js';
import { f as formSchema } from './schema-DY75wcBE.js';
import { u as user } from './auth-hi7hLRBX.js';
import './exports-DdwBo3bR.js';
import './index2-DDd9jZNR.js';
import './stores-eIeNDe2n.js';
import './lifecycle-BsyQvuw_.js';
import './stringify-DX2pbVR5.js';
import './scheduler-B6WqtzJY.js';
import './translations-BkqIZgNA.js';

const load = async ({ locals }) => {
  console.log("PageServerLoad");
  if (locals.user) {
    user.update((value) => locals.user);
    console.log("redirecting");
    throw redirect(303, "/dashboard");
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
      redirect(302, "/dashboard");
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

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-PlxH9_Hu.js')).default;
const server_id = "src/routes/auth/login/+page.server.ts";
const imports = ["_app/immutable/nodes/3.D9TA--le.js","_app/immutable/chunks/scheduler.CKu2orG_.js","_app/immutable/chunks/index.DXc6nQ0s.js","_app/immutable/chunks/Menu.DmxiePjz.js","_app/immutable/chunks/page.CjYSaJLb.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.DV9I5Wjp.js","_app/immutable/chunks/memoize.CGCrhbMP.js","_app/immutable/chunks/stores.3cYkxB9D.js","_app/immutable/chunks/zod.CoJ9B_D1.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.w0ZSS3XE.js","_app/immutable/chunks/schema.DW48twGu.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.QUt0y59N.js","_app/immutable/chunks/form-button.Cw1lUzlW.js"];
const stylesheets = ["_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-qlSp7xbf.js.map
