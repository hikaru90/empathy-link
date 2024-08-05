import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { A as AppBottomMenu } from "../../../chunks/AppBottomMenu.js";
import "../../../chunks/index.js";
import "clsx";
import "../../../chunks/Avatar.svelte_svelte_type_style_lang.js";
import "../../../chunks/schema.js";
import "../../../chunks/client.js";
import "../../../chunks/memoize.js";
import "../../../chunks/translations.js";
import "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  console.log("login page");
  return `<div class="flex h-full flex-grow flex-col justify-between"><div class="flex-grow">${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {})} <h1 data-svelte-h="svelte-143zctw">Selfempathy</h1></div></div>`;
});
export {
  Page as default
};
