import { p as pb } from './pocketbase-jOic377y.js';
import './index-DHSpIlkf.js';

const prerender = false;
const load = async ({ params, locals }) => {
  const { id } = params;
  try {
    let response = null;
    const fight = await pb.collection("fights").getOne(id, {
      expand: "owner"
    });
    console.log("fight", fight);
    const fightOwner = fight.expand?.owner;
    console.log("fightOwner", fightOwner);
    if (fightOwner?.email !== locals.user?.email) {
      response = await pb.collection("fights").update(id, { opened: true });
    }
    console.log("fightOwner?.email", fightOwner?.email, locals.user?.email);
    console.log("owner response", response);
    return {
      response
    };
  } catch (err) {
    console.error("Error updating fight response:", err);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load,
  prerender: prerender
});

const index = 10;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C-kYuaD6.js')).default;
const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
const imports = ["_app/immutable/nodes/10.Bi-BZMQX.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/helpers.C2F2lmQ3.js","_app/immutable/chunks/page.BxjNqAN0.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.B5Mv6Uxa.js","_app/immutable/chunks/AppTopMenu.bu7JEGYI.js","_app/immutable/chunks/switch.DNTnQ2M_.js","_app/immutable/chunks/index.DfSKg4Ih.js","_app/immutable/chunks/Avatar.CLYrKi-U.js","_app/immutable/chunks/button.A7J3RAYz.js","_app/immutable/chunks/AppBottomMenu.BG1J1hbK.js","_app/immutable/chunks/stores.C46p-EcX.js","_app/immutable/chunks/index.BEk7VaRI.js","_app/immutable/chunks/zod.DVU-mH4r.js","_app/immutable/chunks/memoize.DZzCiDwd.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.BWl5-9Zr.js","_app/immutable/chunks/CaretLeft.BzQWyqnQ.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/button.C095cpuc.js"];
const stylesheets = ["_app/immutable/assets/10.BG3GntSY.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-CJXqyDqY.js.map
