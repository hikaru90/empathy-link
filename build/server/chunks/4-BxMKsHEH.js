import { r as redirect, f as fail } from './index-DHSpIlkf.js';
import './client-BGiBm9n9.js';
import './memoize-B28xu6JT.js';
import { s as superValidate } from './superValidate-Cs6G1-7q.js';
import { z as zod } from './zod-Bj0F2ims.js';
import { f as formSchema } from './schema-BB07IwlI.js';
import { u as user } from './auth-CaZN_opl.js';
import './exports-CLG2BRq1.js';
import './index2-BL47qDlJ.js';
import './stores-DfFLgiwW.js';
import './lifecycle-Dr9vL0LE.js';
import './stringify-DX2pbVR5.js';
import './scheduler-Be-hqvXf.js';
import './index-BibYS5cI.js';
import './translations-MFOOILLS.js';

const load = async ({ locals }) => {
  console.log("PageServerLoad");
  if (locals.user) {
    user.update((value) => locals.user);
    console.log("redirecting");
    throw redirect(303, "/app/dashboard");
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
      redirect(302, "/app/dashboard");
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
const component = async () => component_cache ??= (await import('./_page.svelte-8kwUX9TO.js')).default;
const server_id = "src/routes/app/auth/login/+page.server.ts";
const imports = ["_app/immutable/nodes/4.DzWXPLB4.js","_app/immutable/chunks/scheduler.DdioMMNe.js","_app/immutable/chunks/index.DwuYAy9N.js","_app/immutable/chunks/form-button.BTc7CkiL.js","_app/immutable/chunks/helpers.CreFEfAf.js","_app/immutable/chunks/page.y5a_kKVh.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.BCP1s-CR.js","_app/immutable/chunks/index.BUraClYp.js","_app/immutable/chunks/switch.OkAPrZLF.js","_app/immutable/chunks/Avatar.CVBxVDkD.js","_app/immutable/chunks/button.BYp31HAG.js","_app/immutable/chunks/button.DyMNkcnI.js","_app/immutable/chunks/memoize.Di7UoVw0.js","_app/immutable/chunks/stores.Cjp1LSY7.js","_app/immutable/chunks/zod.B97PrdGN.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/input.nuCiEMIp.js","_app/immutable/chunks/schema.BUBsW9lW.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.jtUVx24Y.js"];
const stylesheets = ["_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/Toaster.CqNDpgoD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-BxMKsHEH.js.map
