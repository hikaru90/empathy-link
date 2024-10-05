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
const component = async () => component_cache ??= (await import('./_page.svelte-DBgAH8un.js')).default;
const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
const imports = ["_app/immutable/nodes/10.C8AH_vJx.js","_app/immutable/chunks/scheduler.Clviz5E8.js","_app/immutable/chunks/index.C2t9fK9o.js","_app/immutable/chunks/helpers.Dj0e7Byj.js","_app/immutable/chunks/page.Bdjqy4pw.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.CXukiqCs.js","_app/immutable/chunks/pocketbase.BSgo-nxE.js","_app/immutable/chunks/switch.pt09IzM1.js","_app/immutable/chunks/index.BWRN6MbD.js","_app/immutable/chunks/Avatar.CKc_V2mU.js","_app/immutable/chunks/button.CK6XXZFl.js","_app/immutable/chunks/AppBottomMenu.Ce3Rj0E9.js","_app/immutable/chunks/stores.WBl8b-3l.js","_app/immutable/chunks/index.CRM6Z_J_.js","_app/immutable/chunks/zod.S05sbb9Y.js","_app/immutable/chunks/memoize.CvRdBrx2.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.NOvkLCnt.js","_app/immutable/chunks/CaretLeft.BDT5O55S.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/button.B8WEXDO1.js"];
const stylesheets = ["_app/immutable/assets/10.BG3GntSY.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-BtZBI4ci.js.map
