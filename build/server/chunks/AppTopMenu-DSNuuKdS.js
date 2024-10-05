import { e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, v as validate_component, e as escape } from './ssr-C1fln0Kh.js';
import { d as derivedMode } from './page-C8qygIqX.js';
import { t as t2 } from './translations-MFOOILLS.js';
import 'clsx';
import { L as Logo, B as Button } from './switch-rUCy8RtT.js';
import { A as Avatar_1 } from './Avatar-xDYCltM7.js';
import { u as user } from './auth-CaZN_opl.js';
import './client-BGiBm9n9.js';

const AppTopMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_mode;
  let $t, $$unsubscribe_t;
  let $user, $$unsubscribe_user;
  $$unsubscribe_mode = subscribe(derivedMode, (value) => value);
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  [
    { label: $t("default.page.home.nav") },
    { label: $t("default.page.contact.nav") }
  ];
  $$unsubscribe_mode();
  $$unsubscribe_t();
  $$unsubscribe_user();
  return ` <div class="left-0 top-0 z-[100] w-full border-b border-black/10"><nav class="flex items-center justify-between px-5 py-2 transition-all"><a href="/" class="">${validate_component(Logo, "Logo").$$render($$result, { simplified: true }, {}, {})}</a> <div class="flex items-center gap-4">${$user ? `<div class="">${validate_component(Avatar_1, "Avatar").$$render($$result, {}, {}, {})}</div>` : `${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `${escape($t("default.page.login.heading"))}`;
    }
  })}`}</div></nav> ${slots.submenu ? slots.submenu({}) : ``}</div>`;
});

export { AppTopMenu as A };
//# sourceMappingURL=AppTopMenu-DSNuuKdS.js.map
