import { s as subscribe } from "./utils.js";
import { c as create_ssr_component } from "./ssr.js";
import "./Avatar.svelte_svelte_type_style_lang.js";
import { d as derivedMode, s as scroll } from "./page.js";
import { t } from "./translations.js";
import "clsx";
import "./client.js";
import "./auth.js";
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
  return ` <div class="fixed left-3 right-3 bottom-[72px] z-[100] rounded-full p-2 backdrop-blur-lg backdrop-brightness-[0.3] shadow-xl shadow-black/20">${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  AppBottomMenu as A
};
