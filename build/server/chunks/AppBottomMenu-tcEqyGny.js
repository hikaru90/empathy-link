import { e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component } from './ssr-C1fln0Kh.js';
import './index3-BHwnx4G9.js';
import { d as derivedMode, s as scroll } from './page-C8qygIqX.js';
import { t as t2 } from './translations-CVEYc68s.js';
import 'clsx';
import './client-BGiBm9n9.js';
import './auth-CaZN_opl.js';

const AppBottomMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_mode;
  let $t, $$unsubscribe_t;
  $$unsubscribe_mode = subscribe(derivedMode, (value) => value);
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  scroll.subscribe((value) => {
  });
  [
    { label: $t("default.page.home.nav") },
    { label: $t("default.page.contact.nav") }
  ];
  $$unsubscribe_mode();
  $$unsubscribe_t();
  return ` <div class="fixed left-3 right-3 bottom-[72px] lg:bottom-[86px] z-[100] rounded-full p-2 backdrop-blur-lg backdrop-brightness-[0.3] shadow-xl shadow-black/20 dark:shadow-white/10 dark:shadow-2xl">${slots.default ? slots.default({}) : ``}</div>`;
});

export { AppBottomMenu as A };
//# sourceMappingURL=AppBottomMenu-tcEqyGny.js.map
