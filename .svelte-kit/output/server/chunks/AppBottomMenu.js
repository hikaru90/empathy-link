import { s as subscribe } from "./utils.js";
import { c as create_ssr_component } from "./ssr.js";
import "./index4.js";
import { d as derivedMode, s as scroll } from "./page.js";
import { t } from "./translations.js";
import "dequal";
import "./index3.js";
import "clsx";
import "./index7.js";
import "./auth.js";
import "./client.js";
const AppBottomMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_mode;
  let $t, $$unsubscribe_t;
  $$unsubscribe_mode = subscribe(derivedMode, (value) => value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  scroll.subscribe((value) => {
  });
  [
    { label: $t("default.page.home.nav") },
    { label: $t("default.page.contact.nav") }
  ];
  $$unsubscribe_mode();
  $$unsubscribe_t();
  return ` <div class="fixed left-3 right-3 bottom-[72px] lg:bottom-[86px] z-[100] rounded-full p-2 backdrop-blur-lg backdrop-brightness-[0.3] shadow-xl shadow-black/20 dark:shadow-white/10 dark:shadow-2xl max-w-[1200px] mx-auto">${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  AppBottomMenu as A
};
