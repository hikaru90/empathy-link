import { e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, v as validate_component, e as escape } from './ssr-DSt7LLAo.js';
import { A as AppTopMenu, a as AppBottomMenu } from './AppBottomMenu-Brc30YBM.js';
import './index-DHSpIlkf.js';
import 'clsx';
import './page-Bu8b23cc.js';
import './index3-BMGKZ3wd.js';
import './schema-EMGY3IXS.js';
import './client-BGiBm9n9.js';
import './memoize-BkSYiOwG.js';
import { t as t2 } from './translations-BMzuJwzR.js';
import './Toaster.svelte_svelte_type_style_lang-B9JrK1jS.js';
import './pocketbase-jOic377y.js';
import { u as user } from './auth-DQAPWa54.js';
import { B as Button$1 } from './index4-ciL0z8R6.js';
import { B as Button } from './switch-BUhJuRfb.js';
import { C as CaretLeft$1 } from './CaretLeft-CEffUaDR.js';
import { H as HeartFilled$1 } from './HeartFilled-uypjpm8r.js';
import './lifecycle-DfHz3eeH.js';
import './Avatar-BCqFeSfL.js';
import './helpers-CTGollho.js';
import './SparklePill-Dfb-eSg5.js';
import './index2-BL47qDlJ.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ssr2-BVSPLo1E.js';
import './scheduler-C1h3Gt9x.js';
import './index-BibYS5cI.js';
import './stores-CxxJpioQ.js';
import './stringify-DX2pbVR5.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return `${$user ? `<div class="flex h-full flex-grow flex-col justify-between overflow-hidden">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container flex-grow pb-40"><div class="relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"><h1 class="font-heading text-lg font-semibold">${escape($t("default.page.selfempathy.heading"))}</h1></div> ${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
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
      )}</a> <a href="/app/selfempathy/create" class="skeumorphic-button-dark inline-block rounded-full mr-1 md:mr-0.5">${validate_component(Button$1, "SparkleButton").$$render(
        $$result,
        {
          class: "flex items-center justify-between gap-10 rounded-full pl-5 pr-3 font-bold text-black dark:shadow-gray-300/30"
        },
        {},
        {
          default: () => {
            return `${escape($t("default.page.selfempathy.create"))} ${validate_component(HeartFilled$1, "HeartFilled").$$render(
              $$result,
              {
                class: "h-4 w-4 text-red-600\r\n							"
              },
              {},
              {}
            )}`;
          }
        }
      )}</a></div>`;
    }
  })}</div></div>` : ``}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-DPm7tSO7.js.map
