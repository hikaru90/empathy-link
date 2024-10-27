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
const component = async () => component_cache ??= (await import('./_page.svelte-DSWsSsSj.js')).default;
const server_id = "src/routes/app/fights/[id]/respond/+page.server.ts";
const imports = ["_app/immutable/nodes/10.DUdp9S-j.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js","_app/immutable/chunks/helpers.Dibp7sA5.js","_app/immutable/chunks/page.bZUY7JJF.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.Ctrs9mTK.js","_app/immutable/chunks/AppTopMenu.Dq6v7hsH.js","_app/immutable/chunks/switch.ugwwvEwu.js","_app/immutable/chunks/index.DDDUaqVC.js","_app/immutable/chunks/Avatar.C7ArXovL.js","_app/immutable/chunks/button.JkBH6UTa.js","_app/immutable/chunks/AppBottomMenu.IwLlHcLO.js","_app/immutable/chunks/stores.3y2l6SWm.js","_app/immutable/chunks/index.Cv6N4ySl.js","_app/immutable/chunks/zod.dDOca3ht.js","_app/immutable/chunks/memoize.DxdV8b0X.js","_app/immutable/chunks/_commonjsHelpers.CqkleIqs.js","_app/immutable/chunks/textarea.BYWwPgZB.js","_app/immutable/chunks/CaretLeft.BbUvETf9.js","_app/immutable/chunks/icon-folder.CBGieXVr.js","_app/immutable/chunks/icon-steps.dGSELuxl.js","_app/immutable/chunks/pocketbase.Ce4YzWbP.js","_app/immutable/chunks/button.DvmTZhhU.js"];
const stylesheets = ["_app/immutable/assets/10.BG3GntSY.css","_app/immutable/assets/page.Bq721S71.css","_app/immutable/assets/index.kHZku1PE.css","_app/immutable/assets/index.D74ziVn_.css","_app/immutable/assets/memoize.Crp_yK76.css","_app/immutable/assets/textarea.Ba2o0PgK.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-BUsq1Xm4.js.map
