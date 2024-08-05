import { f as subscribe } from './exports-BRB0bLON.js';
import { c as create_ssr_component } from './ssr-BA-Jr39X.js';
import './Avatar.svelte_svelte_type_style_lang-CKoyyoc4.js';
import { d as derivedMode, s as scroll } from './page-5nJ1lmTK.js';
import { t as t2 } from './translations-CjpxX11l.js';
import 'clsx';
import './client-Citk00eW.js';
import './auth-CMWyavi_.js';

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
  return ` <div class="fixed left-3 right-3 bottom-[72px] z-[100] rounded-full p-2 backdrop-blur-lg backdrop-brightness-[0.3] shadow-xl shadow-black/20">${slots.default ? slots.default({}) : ``}</div>`;
});

export { AppBottomMenu as A };
//# sourceMappingURL=AppBottomMenu-u0bgo7yY.js.map
