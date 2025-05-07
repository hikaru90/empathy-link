import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { A as AppTopMenu } from "../../../../../chunks/AppTopMenu.js";
import "../../../../../chunks/index3.js";
import { t } from "../../../../../chunks/translations.js";
import "dequal";
import "../../../../../chunks/create.js";
import "clsx";
import "../../../../../chunks/index6.js";
import "../../../../../chunks/page.js";
import "../../../../../chunks/auth.js";
import "../../../../../chunks/client.js";
import { d as defaults } from "../../../../../chunks/FormStepDisplay.svelte_svelte_type_style_lang.js";
import "ts-deepmerge";
import "../../../../../chunks/formData.js";
import "../../../../../chunks/index.js";
/* empty css                                                         */
import "memoize-weak";
import { a as zod } from "../../../../../chunks/zod.js";
import { z } from "zod";
import { g as get_store_value } from "../../../../../chunks/utils.js";
import { p as pb } from "../../../../../chunks/pocketbase.js";
import "../../../../../chunks/root.svelte_svelte_type_style_lang.js";
/* empty css                                                                 */
import "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
/* empty css                                                        */
import { o as onDestroy } from "../../../../../chunks/lifecycle.js";
import "marked";
import { w as writable } from "../../../../../chunks/index2.js";
const schemaStep1 = z.object({
  balance: z.number().min(1).max(5),
  awareness: z.number().min(1).max(5),
  energy: z.number().min(1).max(5),
  calmness: z.number().min(1).max(5),
  kindness: z.number().min(1).max(5)
});
const schemaStep2 = schemaStep1.extend({
  observation: z.string().min(10, { message: get_store_value(t)("default.page.fights.form.observation.tooShortError") })
});
const schemaStep3 = schemaStep2.extend({
  feelings: z.array(z.string()).min(1, { message: get_store_value(t)("default.page.fights.form.feelings.tooFewError") })
});
const schemaStep4 = schemaStep3.extend({
  needs: z.array(z.string()).min(1, { message: get_store_value(t)("default.page.fights.form.needs.tooFewError") })
});
const schemaStep5 = schemaStep4.extend({
  request: z.string().optional()
});
function createAIInstancesStore() {
  const { subscribe, set, update } = writable({
    modules: {
      selfempathy: {
        history: [],
        preferences: {}
      },
      fight: {
        history: [],
        preferences: {}
      }
    }
  });
  return {
    subscribe,
    set,
    setChat: (module, chatRecord) => {
      update((instances) => ({
        ...instances,
        modules: {
          ...instances.modules,
          [module]: {
            id: chatRecord.id,
            history: chatRecord.history,
            preferences: chatRecord.preferences
          }
        }
      }));
    },
    addMessage: (module, role, content) => {
      update((instances) => {
        const newMessage = {
          role,
          parts: [{ text: content }],
          timestamp: Date.now()
        };
        const updatedHistory = [...instances.modules[module].history, newMessage];
        return {
          ...instances,
          modules: {
            ...instances.modules,
            [module]: {
              ...instances.modules[module],
              history: updatedHistory.slice(-200)
            }
          }
        };
      });
    },
    clearHistory: (module) => {
      update((instances) => ({
        ...instances,
        modules: {
          ...instances.modules,
          [module]: {
            ...instances.modules[module],
            history: []
          }
        }
      }));
    }
  };
}
createAIInstancesStore();
const SelfempathyChat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chat;
  onDestroy(async () => {
    await pb.collection("chats").unsubscribe(chat.id);
  });
  return `<button data-svelte-h="svelte-klfmrc">clear chat</button> ${``}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  defaults(zod(schemaStep5));
  [
    zod(schemaStep1),
    zod(schemaStep2),
    zod(schemaStep3),
    zod(schemaStep4),
    zod(schemaStep5)
  ];
  return `<div class="flex flex-grow flex-col justify-between transition duration-500 dark:bg-background h-svh">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container flex flex-grow flex-col pb-20 pt-2 relative h-[calc(100vh-100px)]"><div class="flex-grow p-2 h-full">${validate_component(SelfempathyChat, "SelfempathyChat").$$render($$result, {}, {}, {})}</div></div></div>`;
});
export {
  Page as default
};
