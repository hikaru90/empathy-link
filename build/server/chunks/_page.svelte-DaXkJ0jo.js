import { e as subscribe } from './exports-CLG2BRq1.js';
import { o as onDestroy } from './lifecycle-DfHz3eeH.js';
import { c as create_ssr_component, v as validate_component } from './ssr-DSt7LLAo.js';
import { t as t2, a as locale } from './translations-BMzuJwzR.js';
import './page-Bu8b23cc.js';
import 'clsx';
import './index3-BMGKZ3wd.js';
import './client-BGiBm9n9.js';
import './auth-DQAPWa54.js';
import { p as pb } from './pocketbase-jOic377y.js';
import { p as page } from './stores-CxxJpioQ.js';
import './memoize-BkSYiOwG.js';
import './index-DHSpIlkf.js';
import './root.svelte_svelte_type_style_lang-DLmkTVv4.js';
import './Toaster.svelte_svelte_type_style_lang-B9JrK1jS.js';
import { S as Skeleton } from './skeleton-qoOxuKBA.js';
import './index2-BL47qDlJ.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ssr2-BVSPLo1E.js';
import './scheduler-C1h3Gt9x.js';
import './stringify-DX2pbVR5.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $$unsubscribe_t;
  let $$unsubscribe_locale;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_t = subscribe(t2, (value) => value);
  $$unsubscribe_locale = subscribe(locale, (value) => value);
  onDestroy(() => {
    pb.collection("responses").unsubscribe("*");
  });
  $page.params.id;
  $$unsubscribe_page();
  $$unsubscribe_t();
  $$unsubscribe_locale();
  return `${`<div class="flex h-full items-center justify-center">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-[20px] w-[100px] rounded-full" }, {}, {})}</div>`}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-DaXkJ0jo.js.map
