import { s as subscribe } from "../../../../../chunks/utils.js";
import { o as onDestroy } from "../../../../../chunks/lifecycle.js";
import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { t, l as locale } from "../../../../../chunks/translations.js";
import "../../../../../chunks/page.js";
import "clsx";
import "../../../../../chunks/index3.js";
import "../../../../../chunks/client.js";
import "../../../../../chunks/auth.js";
import { p as pb } from "../../../../../chunks/pocketbase.js";
import { p as page } from "../../../../../chunks/stores.js";
import "../../../../../chunks/memoize.js";
import "../../../../../chunks/index.js";
import "../../../../../chunks/root.svelte_svelte_type_style_lang.js";
/* empty css                                                                 */
import "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
/* empty css                                                        */
import { S as Skeleton } from "../../../../../chunks/skeleton.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $$unsubscribe_t;
  let $$unsubscribe_locale;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_t = subscribe(t, (value) => value);
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
export {
  Page as default
};
