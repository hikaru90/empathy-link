import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { A as AppBottomMenu } from "../../../../chunks/AppBottomMenu.js";
import { A as AppTopMenu } from "../../../../chunks/AppTopMenu.js";
import "clsx";
import "dequal";
import "../../../../chunks/create.js";
import "../../../../chunks/index3.js";
import "../../../../chunks/schema.js";
import "../../../../chunks/client.js";
import "ts-deepmerge";
import "../../../../chunks/formData.js";
import "../../../../chunks/index.js";
import "memoize-weak";
import "zod-to-json-schema";
import { t } from "../../../../chunks/translations.js";
import "../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
/* empty css                                                              */
import "../../../../chunks/pocketbase.js";
import { u as user } from "../../../../chunks/auth.js";
import "../../../../chunks/page.js";
import { B as Button$1 } from "../../../../chunks/index5.js";
import { B as Button } from "../../../../chunks/index4.js";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { H as Heart } from "../../../../chunks/heart.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return `${$user ? `<div class="flex h-full flex-grow flex-col justify-between overflow-hidden">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container flex-grow pb-40"><div class="relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"><h1 class="font-heading text-lg font-semibold">${escape($t("default.page.selfempathy.heading"))}</h1></div> ${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="relative flex h-auto items-center justify-between"><a href="/app/dashboard" class="block">${validate_component(Button, "Button").$$render(
        $$result,
        {
          decoration: "dark-op1",
          class: "flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
        },
        {},
        {
          default: () => {
            return `${validate_component(Chevron_left, "ChevronLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
          }
        }
      )}</a> <a href="/app/selfempathy/create" class="skeumorphic-button-dark inline-block rounded-full mr-1 md:mr-0.5">${validate_component(Button$1, "SparkleButton").$$render(
        $$result,
        {
          class: "flex items-center justify-between gap-10 rounded-full pl-5 pr-3 font-bold text-black dark:shadow-gray-300/30"
        },
        {},
        {
          default: () => {
            return `${escape($t("default.page.selfempathy.create"))} ${validate_component(Heart, "Heart").$$render(
              $$result,
              {
                class: "h-4 w-4 text-red-600\n							"
              },
              {},
              {}
            )}`;
          }
        }
      )}</a></div>`;
    }
  })}</div></div>` : ``}`;
});
export {
  Page as default
};
