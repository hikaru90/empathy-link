import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, v as validate_component, e as escape } from "./ssr.js";
import { d as derivedMode, s as scroll } from "./page.js";
import { t } from "./translations.js";
import "clsx";
import { g as Logo, B as Button } from "./switch.js";
import { A as Avatar_1 } from "./Avatar.js";
import { u as user } from "./auth.js";
import "./client.js";
import "./index3.js";
const AppTopMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_mode;
  let $t, $$unsubscribe_t;
  let $user, $$unsubscribe_user;
  $$unsubscribe_mode = subscribe(derivedMode, (value) => value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  [
    { label: $t("default.page.home.nav") },
    { label: $t("default.page.contact.nav") }
  ];
  $$unsubscribe_mode();
  $$unsubscribe_t();
  $$unsubscribe_user();
  return ` <div class="left-0 top-0 z-[100] w-full border-b border-black/10"><nav class="flex items-center justify-between px-5 py-2 transition-all"><a href="/" class="">${validate_component(Logo, "Logo").$$render($$result, { simplified: true }, {}, {})}</a> <div class="flex items-center gap-4">${$user ? `<div class="">${validate_component(Avatar_1, "Avatar").$$render($$result, {}, {}, {})}</div>` : `${validate_component(Button, "Button").$$render(
    $$result,
    {
      decoration: "op1",
      class: "dark:text-white"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.login.heading"))}`;
      }
    }
  )}`}</div></nav> ${slots.submenu ? slots.submenu({}) : ``}</div>`;
});
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
  AppTopMenu as A,
  AppBottomMenu as a
};
