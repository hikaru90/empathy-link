import { e as subscribe } from './exports-CLG2BRq1.js';
import { o as onDestroy } from './lifecycle-Dr9vL0LE.js';
import { c as create_ssr_component, v as validate_component } from './ssr-C1fln0Kh.js';
import { t as t2, a as locale } from './translations-Bkz4zMob.js';
import './page-C8qygIqX.js';
import 'clsx';
import './index3-BHwnx4G9.js';
import './client-BGiBm9n9.js';
import './auth-DQAPWa54.js';
import { p as pb } from './pocketbase-jOic377y.js';
import { p as page } from './stores-DfFLgiwW.js';
import './memoize-CrOQi2XR.js';
import './index-DHSpIlkf.js';
import './root.svelte_svelte_type_style_lang-Bt4Du0Yj.js';
import './Toaster.svelte_svelte_type_style_lang-B9JrK1jS.js';
import { S as Skeleton } from './skeleton-DOeF3-co.js';
import './index2-BL47qDlJ.js';
import 'tailwind-variants';
import './ssr2-BVSPLo1E.js';
import './scheduler-Be-hqvXf.js';
import './stringify-DX2pbVR5.js';
import './utils2-CW1DFYkq.js';
import 'tailwind-merge';

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
//# sourceMappingURL=_page.svelte-iWKNOjpj.js.map
