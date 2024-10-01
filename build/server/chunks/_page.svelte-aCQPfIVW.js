import { e as subscribe, f as compute_rest_props } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, v as validate_component, e as escape, s as spread, d as escape_attribute_value, f as escape_object, a as add_attribute } from './ssr-C1fln0Kh.js';
import { S as Skeleton } from './skeleton-DOeF3-co.js';
import './page-C8qygIqX.js';
import { p as pb } from './pocketbase-jOic377y.js';
import { t as t2 } from './translations-BF87NCsX.js';
import { e as endDate } from './dashboard-ZmoyYwVv.js';
import './client-BGiBm9n9.js';
import { u as user } from './auth-CaZN_opl.js';
import 'clsx';
import { c as delay } from './helpers-BXrFvLoV.js';
import { A as AppTopMenu } from './AppTopMenu-BVz2mVtK.js';
import { A as AppBottomMenu } from './AppBottomMenu-DzsZ2ew0.js';
import './index-DHSpIlkf.js';
import './Avatar.svelte_svelte_type_style_lang-Ckc79-rv.js';
import './schema-Dsp_ezMk.js';
import './memoize-B28xu6JT.js';
import './Toaster.svelte_svelte_type_style_lang-B9JrK1jS.js';
import { B as Button$1 } from './index3-BeytaLJD.js';
import { B as Button } from './Avatar-CzXgJnME.js';
import { C as CaretLeft$1 } from './CaretLeft-CbllSXax.js';
import './lifecycle-Dr9vL0LE.js';
import './utils2-CW1DFYkq.js';
import 'tailwind-merge';
import './index2-BL47qDlJ.js';
import 'tailwind-variants';
import './ssr2-BVSPLo1E.js';
import '@internationalized/date';
import './sheet-header-DyTUoQcr.js';
import './SparklePill-pUbgiSQ9.js';
import './scheduler-Be-hqvXf.js';
import './index-BibYS5cI.js';
import './stores-DfFLgiwW.js';
import './stringify-DX2pbVR5.js';

const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { viewBox: "0 0 15 15" },
      { fill: "none" },
      { xmlns: "http://www.w3.org/2000/svg" },
      escape_object($$restProps)
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Plus$1 = Plus;
const css$1 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: null
};
const perPage = 5;
const FightOverviewAll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t2, (value) => value);
  let records = [];
  let page = 1;
  const fetchData = async () => {
    const newRecords = await pb.collection("fights").getList(page, perPage, {
      filter: `owner = '${$user.id}'`,
      sort: "-updated",
      expand: "responses"
    });
    if (newRecords.items.length === 0)
      ;
    await delay(1e3);
    records = [...records, ...newRecords.items];
  };
  endDate.subscribe(async () => {
    console.log("endDate changed -> fetching data");
    await fetchData();
  });
  $$result.css.add(css$1);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return `${`${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-[20px] w-[100px] rounded-full" }, {}, {})}`}`;
});
const css = {
  code: ".skeumorphic-button-dark.svelte-ef713u{transition:box-shadow 50ms;box-shadow:inset 0 0 8px 0 rgba(0, 0, 0, 0.2), var(--skeumorphic-shadow)}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$result.css.add(css);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return `${$user ? `<div class="flex h-full flex-grow flex-col justify-between">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container flex-grow pb-40"><div class="relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"><h1 class="font-heading text-lg font-semibold">${escape($t("default.page.fight.heading"))}</h1></div> ${validate_component(FightOverviewAll, "FightOverviewAll").$$render($$result, {}, {}, {})} ${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="relative flex h-auto items-center justify-between"><a href="/app/dashboard" class="block">${validate_component(Button, "Button").$$render(
        $$result,
        {
          decoration: "dark-op1",
          class: "flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
        },
        {},
        {
          default: () => {
            return `${validate_component(CaretLeft$1, "CaretLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
          }
        }
      )}</a> <a href="/app/fights/create" class="skeumorphic-button-dark inline-block rounded-full mr-1 svelte-ef713u">${validate_component(Button$1, "SparkleButton").$$render(
        $$result,
        {
          class: "flex items-center justify-between gap-10 rounded-full pl-5 pr-3 py-1 font-bold text-black dark:shadow-gray-300/30"
        },
        {},
        {
          default: () => {
            return `${escape($t("default.page.fights.create"))} ${validate_component(Plus$1, "Plus").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
          }
        }
      )}</a></div>`;
    }
  })}</div></div>` : ``}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-aCQPfIVW.js.map
