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
const component = async () => component_cache ??= (await import('./_page.svelte-BF-1qWre.js')).default;
const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
const imports = ["_app/immutable/nodes/10.BFpshhIQ.js","_app/immutable/chunks/scheduler.Clviz5E8.js","_app/immutable/chunks/index.C2t9fK9o.js","_app/immutable/chunks/helpers.F_hB7tz5.js","_app/immutable/chunks/page.Bd4QL5cq.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.DyrkCWPu.js","_app/immutable/chunks/pocketbase.PRKJtBbO.js","_app/immutable/chunks/switch.CNBn360u.js","_app/immutable/chunks/index.CLzr7ZlM.js","_app/immutable/chunks/Avatar.D_QqXKVF.js","_app/immutable/chunks/button.OZ_DY3bL.js","_app/immutable/chunks/AppBottomMenu.DXtCMbaf.js","_app/immutable/chunks/stores.Qg9DDuR0.js","_app/immutable/chunks/index.DyBJejKP.js","_app/immutable/chunks/zod.DbI0_dRq.js","_app/immutable/chunks/memoize.B38AcDh4.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.DNKeDpc1.js","_app/immutable/chunks/CaretLeft.C7mtIpMG.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/button.CJCC36Bh.js"];
const stylesheets = ["_app/immutable/assets/10.BG3GntSY.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-m1tRNLt1.js.map
