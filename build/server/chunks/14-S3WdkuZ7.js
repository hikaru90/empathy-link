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

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B6X9XwPq.js')).default;
const server_id = "src/routes/app/selfempathy/[id]/respond/+page.server.ts";
const imports = ["_app/immutable/nodes/14.DfpVMa2J.js","_app/immutable/chunks/scheduler.BmBrB_dT.js","_app/immutable/chunks/index.BQZQ5DB3.js","_app/immutable/chunks/helpers.g8wrkI0H.js","_app/immutable/chunks/entry.DnNy0IhO.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/AppBottomMenu.CkXkkK6h.js","_app/immutable/chunks/switch.fB03Cpk5.js","_app/immutable/chunks/Avatar.BhWA5DcG.js","_app/immutable/chunks/button.D_ITeu-i.js","_app/immutable/chunks/stores.BdCL2gQQ.js","_app/immutable/chunks/index.SsLB4xxl.js","_app/immutable/chunks/zod.B5pDC7Hl.js","_app/immutable/chunks/memoize.BzJ9-avW.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.BCQgmsBQ.js","_app/immutable/chunks/ResponseMascot.CKzs_CLF.js","_app/immutable/chunks/CaretLeft.Cs-VcT_4.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/button.BlP37tcM.js"];
const stylesheets = ["_app/immutable/assets/10.Cwb1ZngV.css","_app/immutable/assets/helpers.Bq721S71.css","_app/immutable/assets/switch.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css","_app/immutable/assets/Mascot.BdSU-Snk.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-S3WdkuZ7.js.map
