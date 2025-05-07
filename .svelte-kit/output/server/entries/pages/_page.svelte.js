import { s as subscribe, g as get_store_value, a as null_to_empty, c as compute_rest_props } from "../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, b as each, e as escape, a as add_attribute, s as spread, g as escape_attribute_value, h as escape_object } from "../../chunks/ssr.js";
import "../../chunks/index3.js";
import { S as Sheet_content, a as Sheet_header, b as Sheet_title, B as Button, R as Root$1, c as Select_trigger, V as Value, d as Select_content, e as Select_item, I as Input, L as Logo } from "../../chunks/index4.js";
import { t, l as locale } from "../../chunks/translations.js";
import "../../chunks/client.js";
import { b as backgroundColor, w as windowWidth, s as scroll, c as currentSection, a as windowHeight } from "../../chunks/page.js";
import { B as Button$1 } from "../../chunks/index5.js";
import { R as Root, C as Close } from "../../chunks/index6.js";
import { C as Cross1 } from "../../chunks/Cross1.js";
import { s as setCookie } from "../../chunks/helpers.js";
import "dequal";
import { c as cn } from "../../chunks/create.js";
import "clsx";
import { I as Icon } from "../../chunks/Icon.js";
import { C as Chevron_right } from "../../chunks/chevron-right.js";
import { B as Button$2 } from "../../chunks/button.js";
import { b as backgroundImage } from "../../chunks/SparklePill.js";
import { I as IconFolder, a as IconEye, b as IconHeart, c as IconSwirl, d as IconSteps } from "../../chunks/icon-steps.js";
import { S as Send_horizontal } from "../../chunks/send-horizontal.js";
import { H as Heart } from "../../chunks/heart.js";
import { g as getContext } from "../../chunks/lifecycle.js";
const IconSelf = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="finger-print-outline">\n    <path class="cls-1" d="M17.53,4.78c-.08,0-.15-.02-.22-.06-3.23-1.82-7.18-1.82-10.41,0-.23.12-.51.04-.63-.19,0,0,0,0,0-.01-.12-.23-.04-.52.19-.66,3.5-1.97,7.78-1.98,11.29,0,.23.13.32.42.2.65-.07.17-.23.27-.41.28ZM4.15,9.88c-.1,0-.19-.03-.27-.09-.21-.16-.26-.46-.11-.68.89-1.33,2.1-2.42,3.51-3.17,3.02-1.57,6.62-1.58,9.64-.01,1.41.75,2.61,1.83,3.5,3.15.15.22.1.52-.11.68-.2.15-.49.11-.64-.09,0,0-.01-.02-.02-.02-.81-1.19-1.9-2.17-3.17-2.85-2.76-1.43-6.03-1.42-8.79.01-1.28.69-2.37,1.67-3.18,2.87-.07.13-.21.21-.37.2h0ZM10,21.59c-.13,0-.24-.05-.33-.15-.76-.75-1.4-1.61-1.88-2.56-.67-1.3-1.01-2.75-.98-4.21,0-2.92,2.37-5.29,5.29-5.29,2.92,0,5.29,2.37,5.29,5.29,0,.26-.21.47-.47.47s-.47-.21-.47-.47c-.05-2.41-2.04-4.32-4.45-4.26-2.33.05-4.21,1.93-4.26,4.26-.02,1.3.27,2.58.87,3.74.45.87,1.03,1.66,1.73,2.35.18.2.18.49,0,.69-.09.09-.21.14-.34.15ZM16.7,19.79c-1.03.03-2.05-.28-2.9-.86-1.39-.97-2.22-2.56-2.22-4.26-.01-.26.19-.48.45-.49s.48.19.49.45c0,.01,0,.03,0,.04,0,1.38.68,2.67,1.81,3.45.7.48,1.53.72,2.38.69.33,0,.65-.04.97-.1.25-.04.5.13.54.38,0,0,0,.01,0,.02.05.26-.12.51-.38.56-.37.07-.75.11-1.13.12h0ZM14.82,21.79s-.08,0-.12-.02c-3.24-.83-5.51-3.75-5.51-7.1,0-1.59,1.29-2.88,2.88-2.88,1.59,0,2.88,1.29,2.88,2.88.02,1.07.91,1.92,1.99,1.9,1.04-.02,1.88-.86,1.9-1.9-.04-3.7-3.08-6.67-6.78-6.63-2.65,0-5.06,1.52-6.18,3.91-.38.86-.57,1.78-.55,2.72,0,1.19.21,2.38.63,3.5.1.25-.02.52-.27.62,0,0,0,0,0,0-.24.09-.5-.03-.59-.26,0,0,0-.01,0-.02-.45-1.23-.68-2.53-.68-3.84-.02-1.08.2-2.15.64-3.15,1.8-3.87,6.4-5.55,10.27-3.74,2.68,1.25,4.42,3.92,4.47,6.88,0,1.59-1.29,2.88-2.88,2.88s-2.88-1.29-2.88-2.88c-.03-1.07-.93-1.92-2.01-1.88-1.03.03-1.85.86-1.88,1.88-.01,1.63.62,3.2,1.75,4.38.83.88,1.89,1.5,3.06,1.8.25.08.4.34.33.59-.04.21-.22.36-.44.37h0Z"/>\n  </g>\n</svg>';
const IconFight = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Gruppe_159" data-name="Gruppe 159">\n    <g id="flash-outline">\n      <path class="cls-1" d="M9.97,19.34s-.09,0-.13-.01c-.31-.07-.51-.38-.44-.69l.98-5.4h-3.84c-.19,0-.37-.11-.45-.28s-.06-.38.06-.53L13.76,3.02h0c.13-.15.38-.25.56-.21.32.06.53.36.47.68l-.99,5.42h3.84c.19,0,.37.11.45.28s.06.38-.06.53l-7.6,9.4c-.09.12-.3.22-.45.22ZM10.39,18.8v.03s0-.02,0-.03ZM7.59,12.23h3.39c.15,0,.29.07.38.18.1.11.13.26.11.41l-.8,4.4,5.92-7.32h-3.39c-.15,0-.29-.07-.38-.18-.09-.11-.13-.26-.11-.41l.81-4.4-5.92,7.32ZM14.15,3.33h0,0Z"/>\n    </g>\n  </g>\n</svg>';
const IconFeedback = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Pfad_52" data-name="Pfad 52">\n    <path class="cls-1" d="M12.49,20.75c-.3,0-.55-.25-.55-.55v-8.1H3.84c-.3,0-.55-.25-.55-.55s.25-.55.55-.55h8.1v-3.29c0-2.42,1.97-4.39,4.39-4.39s4.39,1.97,4.39,4.39-1.97,4.39-4.39,4.39h-3.29v8.1c0,.3-.25.55-.55.55ZM13.04,11h3.29c1.82,0,3.29-1.48,3.29-3.29s-1.48-3.29-3.29-3.29-3.29,1.48-3.29,3.29v3.29Z"/>\n  </g>\n  <g id="Pfad_53" data-name="Pfad 53">\n    <path class="cls-1" d="M6.73,14.93c-.13,0-.26-.05-.35-.15l-2.88-2.88c-.2-.2-.2-.51,0-.71l2.88-2.88c.2-.2.51-.2.71,0s.2.51,0,.71l-2.53,2.53,2.53,2.53c.2.2.2.51,0,.71-.1.1-.23.15-.35.15Z"/>\n  </g>\n</svg>';
const IconLearn = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Pfad_62" data-name="Pfad 62">\n    <path class="cls-1" d="M18.21,17.39h.78c.23,0,.42-.19.42-.42V4.03c0-.23-.19-.42-.42-.42H6.65c-1.05,0-1.89.86-1.89,1.91v13.17s0,.06,0,.09c.1,1.02.96,1.8,1.99,1.8h12.24c.23,0,.42-.19.42-.42s-.19-.42-.42-.42h-.76c-.64-.01-1.16-.54-1.14-1.19.01-.62.5-1.12,1.12-1.14h0ZM5.61,5.51c0-.58.46-1.05,1.04-1.06h11.91v12.09h-.36l-11.45.04c-.41,0-.81.14-1.14.38V5.51ZM6.76,19.73c-.63.02-1.16-.48-1.18-1.11-.02-.63.48-1.16,1.11-1.18.02,0,.05,0,.07,0l9.78-.05c-.25.33-.39.74-.39,1.16,0,.42.14.83.39,1.17H6.76Z"/>\n  </g>\n</svg>';
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "6",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "menu" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const WebsiteHamburgerMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $backgroundColor, $$unsubscribe_backgroundColor;
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_backgroundColor = subscribe(backgroundColor, (value) => $backgroundColor = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  let { menuItems } = $$props;
  let dialogOpen = false;
  const langs = [{ value: "en", label: "English" }, { value: "de", label: "German" }];
  const handleSelect = (event) => {
    if (event) {
      setCookie("locale", event.value);
      locale.update(() => event.value);
    }
  };
  if ($$props.menuItems === void 0 && $$bindings.menuItems && menuItems !== void 0) $$bindings.menuItems(menuItems);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root, "Sheet.Root").$$render(
      $$result,
      { open: dialogOpen },
      {
        open: ($$value) => {
          dialogOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<button class="flex items-center">${validate_component(Menu, "Menu").$$render($$result, { class: "size-6" }, {}, {})}</button> ${validate_component(Sheet_content, "Sheet.Content").$$render(
            $$result,
            {
              class: $backgroundColor + " z-[1003] flex flex-col border-muted"
            },
            {},
            {
              default: () => {
                return `${validate_component(Sheet_header, "Sheet.Header").$$render(
                  $$result,
                  {
                    class: "flex flex-row items-center justify-between border-b border-black/10 px-5 py-2.5"
                  },
                  {},
                  {
                    default: () => {
                      return `${validate_component(Sheet_title, "Sheet.Title").$$render($$result, { class: "pt-0.5" }, {}, {
                        default: () => {
                          return `${escape($t("default.menu.title"))}`;
                        }
                      })} ${validate_component(Close, "Sheet.Close").$$render($$result, { class: "!m-0" }, {}, {
                        default: () => {
                          return `${validate_component(Button, "ButtonOp1").$$render(
                            $$result,
                            {
                              decoration: "floating-op1",
                              class: "-mr-2 flex items-center justify-center border-neutral-200 bg-background p-1.5 text-sm text-neutral-800 transition hover:bg-offwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
                            },
                            {},
                            {
                              default: () => {
                                return `${validate_component(Cross1, "Cross1").$$render($$result, { class: "size-4 text-red-600" }, {}, {})}`;
                              }
                            }
                          )}`;
                        }
                      })}`;
                    }
                  }
                )} <div class="flex h-full flex-col justify-between gap-2 p-5"><div class="mb-10 flex flex-col items-start gap-2">${each(menuItems, (item) => {
                  return `<button class="flex w-full items-center justify-between gap-2 text-lg font-bold">${escape(item.label)} <div class="mr-[2px] flex size-6 items-center justify-center rounded-full">${validate_component(Chevron_right, "ChevronRight").$$render($$result, { class: "size-4" }, {}, {})}</div> </button>`;
                })}</div> <div class="flex flex-col gap-5">${validate_component(Root$1, "Select.Root").$$render(
                  $$result,
                  {
                    selected: langs.find((lang) => lang.value === $locale),
                    onSelectedChange: handleSelect
                  },
                  {},
                  {
                    default: () => {
                      return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "" }, {}, {
                        default: () => {
                          return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Language" }, {}, {})}`;
                        }
                      })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `${each(langs, (lang) => {
                            return `${validate_component(Select_item, "Select.Item").$$render($$result, { value: lang.value, label: lang.label }, {}, {
                              default: () => {
                                return `${escape(lang.label)}`;
                              }
                            })}`;
                          })}`;
                        }
                      })} ${validate_component(Input, "Select.Input").$$render($$result, { name: "favoriteFruit" }, {}, {})}`;
                    }
                  }
                )} <div class="mb-3 border-b border-gray-300/30 dark:border-gray-300/20"></div> ${validate_component(Button$1, "Button").$$render(
                  $$result,
                  {
                    variant: "outline",
                    class: "w-full font-bold dark:text-black rounded-lg"
                  },
                  {},
                  {
                    default: () => {
                      return `${escape($t("default.page.login.heading"))}`;
                    }
                  }
                )}</div></div>`;
              }
            }
          )}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_backgroundColor();
  $$unsubscribe_t();
  $$unsubscribe_locale();
  return $$rendered;
});
const WebsiteMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let menuItems;
  let $windowWidth, $$unsubscribe_windowWidth;
  let $t, $$unsubscribe_t;
  let $scroll, $$unsubscribe_scroll;
  let $backgroundColor, $$unsubscribe_backgroundColor;
  let $currentSection, $$unsubscribe_currentSection;
  $$unsubscribe_windowWidth = subscribe(windowWidth, (value) => $windowWidth = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_scroll = subscribe(scroll, (value) => $scroll = value);
  $$unsubscribe_backgroundColor = subscribe(backgroundColor, (value) => $backgroundColor = value);
  $$unsubscribe_currentSection = subscribe(currentSection, (value) => $currentSection = value);
  menuItems = () => [
    {
      label: $t("default.menu.sections.the4steps"),
      target: "stepsTarget"
    },
    {
      label: $t("default.menu.sections.modules"),
      target: "modulesTarget"
    },
    {
      label: $t("default.menu.sections.selfempathy"),
      target: "selfempathyTarget"
    },
    {
      label: $t("default.menu.sections.fight"),
      target: "fightTarget"
    },
    {
      label: $t("default.menu.sections.feedback"),
      target: "feedbackTarget"
    },
    {
      label: $t("default.menu.sections.learn"),
      target: "learnTarget"
    }
  ];
  $$unsubscribe_windowWidth();
  $$unsubscribe_t();
  $$unsubscribe_scroll();
  $$unsubscribe_backgroundColor();
  $$unsubscribe_currentSection();
  return `<div style="${"width:" + escape($windowWidth, true) + "px;"}" class="fixed left-0 top-0 z-[100]"><div class="${escape(
    "max-h-96 opacity-100",
    true
  ) + " " + escape($scroll > 5 ? "shadow-xl shadow-black/5 delay-150" : "", true) + " overflow-hidden transition-all"}"><nav class="${escape($scroll > 5 ? $backgroundColor : "bg-white-background", true) + " flex items-center justify-between px-5 py-3 transition-all duration-500 lg:py-3"}"><a href="/" class="w-1 overflow-visible"><div>${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}</div></a> <div class="hidden items-center gap-7 lg:flex">${each(menuItems(), (item) => {
    return `<button class="group relative"><div class="shadow-x absolute -bottom-1 -left-3 -right-3 -top-1 z-0 rounded-md bg-white-background/30 opacity-0 shadow-md transition-opacity group-hover:opacity-100"></div> <div class="${escape(
      item.target === $currentSection ? "opacity-100" : "opacity-0",
      true
    ) + " absolute -bottom-1 -left-3 -right-3 -top-1 rounded-md bg-black/5 shadow-inner shadow-black/20 transition-opacity duration-300"}"></div> <div class="relative z-10">${escape(item.label)}</div> </button>`;
  })}</div> <div class="flex w-1 items-center justify-end gap-4">${validate_component(Button$2, "Button").$$render(
    $$result,
    {
      variant: "outline",
      class: "hidden font-bold lg:block"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.login.heading"))}`;
      }
    }
  )} <div class="lg:hidden">${validate_component(WebsiteHamburgerMenu, "WebsiteHamburgerMenu").$$render($$result, { menuItems: menuItems() }, {}, {})}</div></div></nav></div> </div>`;
});
const css$7 = {
  code: ".step.svelte-1epttz6{display:flex;align-items:center;justify-content:center;border-radius:1.6em;padding:0.3em;--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}:root{--duration:6s}.heart.svelte-1epttz6{animation:svelte-1epttz6-heart}.step5.svelte-1epttz6{animation:svelte-1epttz6-step5}.step4.svelte-1epttz6{animation:svelte-1epttz6-step4}.step3.svelte-1epttz6{animation:svelte-1epttz6-step3}.step2.svelte-1epttz6{animation:svelte-1epttz6-step2}.step1.svelte-1epttz6{animation:svelte-1epttz6-step1}.step1.svelte-1epttz6,.step2.svelte-1epttz6,.step3.svelte-1epttz6,.step4.svelte-1epttz6,.step5.svelte-1epttz6,.heart.svelte-1epttz6{animation-duration:var(--duration);animation-iteration-count:infinite;animation-fill-mode:forwards;animation-timing-function:ease-out}@keyframes svelte-1epttz6-heart{0%,65%{opacity:0;transform:scale(0)}75%,90%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0)}}@keyframes svelte-1epttz6-step5{0%,27.5%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity, 1));opacity:0;transform:scale(0)}35%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity, 1));opacity:1;transform:scale(1)}40%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity, 1))}40.1%{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}50%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity, 1))}55%{opacity:0}100%{opacity:0}}@keyframes svelte-1epttz6-step4{0%,22.5%{transform:scale(0);opacity:0}30%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-1epttz6-step3{0%,17.5%{transform:scale(0);opacity:0}25%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-1epttz6-step2{0%,12.5%{transform:scale(0);opacity:0}20%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-1epttz6-step1{0%,10%{transform:scale(0);opacity:0}15%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}.pop-in.svelte-1epttz6{animation:svelte-1epttz6-popIn;animation-duration:var(--duration);animation-iteration-count:infinite;animation-fill-mode:forwards}@keyframes svelte-1epttz6-popIn{0%{opacity:0;transform:translate(0, 0)}10%{opacity:1;transform:translate(0, 8em)}15%{opacity:0;transform:translate(0, 8em)}55%{opacity:0}65%{opacity:1}70%{opacity:0}100%{opacity:0;transform:translate(0, 8em)}}",
  map: '{"version":3,"file":"HeroAnimation.svelte","sources":["HeroAnimation.svelte"],"sourcesContent":["<script lang=\\"ts\\">import backgroundImage from \\"$assets/images/holo3.jpg\\";\\nimport { t } from \\"$lib/translations\\";\\nimport IconFolder from \\"$assets/icons/icon-folder.svg?raw\\";\\nimport IconSelf from \\"$assets/icons/icon-self.svg?raw\\";\\nimport IconFight from \\"$assets/icons/icon-fight.svg?raw\\";\\nimport IconFeedback from \\"$assets/icons/icon-feedback.svg?raw\\";\\nimport IconLearn from \\"$assets/icons/icon-learn.svg?raw\\";\\nimport { get } from \\"svelte/store\\";\\nimport IconEye from \\"$assets/icons/icon-eye.svg?raw\\";\\nimport IconHeart from \\"$assets/icons/icon-heart.svg?raw\\";\\nimport IconSwirl from \\"$assets/icons/icon-swirl.svg?raw\\";\\nimport IconSteps from \\"$assets/icons/icon-steps.svg?raw\\";\\nimport SendHorizontal from \\"lucide-svelte/icons/send-horizontal\\";\\nimport Heart from \\"lucide-svelte/icons/heart\\";\\nlet menuItems = [\\n  {\\n    slug: \\"home\\",\\n    name: get(t)(\\"default.menu.bar.home\\"),\\n    path: \\"/app/dashboard\\",\\n    icon: IconFolder,\\n    available: true\\n  },\\n  {\\n    slug: \\"selfempathy\\",\\n    name: get(t)(\\"default.menu.bar.selfempathy\\"),\\n    path: \\"/app/selfempathy\\",\\n    icon: IconSelf,\\n    available: false\\n  },\\n  {\\n    slug: \\"fights\\",\\n    name: get(t)(\\"default.menu.bar.fights\\"),\\n    path: \\"/app/fights\\",\\n    icon: IconFight,\\n    available: true\\n  },\\n  {\\n    slug: \\"feedback\\",\\n    name: get(t)(\\"default.menu.bar.feedback\\"),\\n    path: \\"/app/feedback\\",\\n    icon: IconFeedback,\\n    available: false\\n  },\\n  {\\n    slug: \\"learn\\",\\n    name: get(t)(\\"default.menu.bar.learn\\"),\\n    path: \\"/app/learn\\",\\n    icon: IconLearn,\\n    available: false\\n  }\\n];\\nt.subscribe((value) => {\\n  const newMenuItems = menuItems.map((entry) => {\\n    const translation = value(`default.menu.bar.${entry.slug}`);\\n    entry.name = translation;\\n    return entry;\\n  });\\n  menuItems = [...newMenuItems];\\n});\\n<\/script>\\n\\n<div class=\\"relative h-full w-full p-[1.2em]\\">\\n\\t<div class=\\"pop-in\\">\\n\\t\\t<div class=\\"flex items-center justify-center\\">\\n\\t\\t\\t<div\\n\\t\\t\\t\\tstyle=\\"background-image: url(\'{backgroundImage}\'); background-size: 300% 100%\\"\\n\\t\\t\\t\\tclass=\\"animate-bg-fast flex h-[1em] w-[2em] flex-col items-center justify-center rounded-full shadow-lg\\"\\n\\t\\t\\t></div>\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<div class=\\"relative flex h-full flex-col justify-between pb-[3.6em]\\">\\n\\t\\t<div class=\\"flex flex-col gap-px sm:gap-[0.5em]\\">\\n\\t\\t\\t<div class=\\"step step1 bg-observation-background\\">\\n\\t\\t\\t\\t<div class=\\"w-[2em] fill-observation-foreground\\">\\n\\t\\t\\t\\t\\t{@html IconEye}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"step step2 bg-feelings-background\\">\\n\\t\\t\\t\\t<div class=\\"w-[2em] fill-feelings-foreground\\">\\n\\t\\t\\t\\t\\t{@html IconHeart}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"step step3 bg-needs-background\\">\\n\\t\\t\\t\\t<div class=\\"w-[2em] fill-needs-foreground\\">\\n\\t\\t\\t\\t\\t{@html IconSwirl}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"step step4 bg-request-background\\">\\n\\t\\t\\t\\t<div class=\\"w-[2em] fill-request-foreground\\">\\n\\t\\t\\t\\t\\t{@html IconSteps}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"step5 flex items-center justify-center rounded-full p-[1em] shadow-lg\\">\\n\\t\\t\\t<div class=\\"flex w-full items-center justify-between fill-observation-foreground\\">\\n\\t\\t\\t\\t<div class=\\"h-[0.5em] w-[3em] rounded bg-slate-600\\"></div>\\n\\t\\t\\t\\t<SendHorizontal class=\\"text-slate-500\\" />\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\n\\t\\t<div class=\\"absolute flex h-full w-full items-center justify-center pb-[3em]\\">\\n\\t\\t\\t<div class=\\"heart\\">\\n\\t\\t\\t\\t<Heart class=\\"size-[5em] text-red-400\\" />\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<div\\n\\t\\tclass=\\"fixed bottom-0 left-0 z-40 w-full rounded-b-[1em] bg-black px-[0.5em] py-[0.5em] text-gray-200\\"\\n\\t>\\n\\t\\t<div class=\\"\\">\\n\\t\\t\\t<img\\n\\t\\t\\t\\tsrc=\\"/inverted-border.svg\\"\\n\\t\\t\\t\\talt=\\"\\"\\n\\t\\t\\t\\tclass=\\"absolute left-[0.01em] top-[0.02em] w-[1.6em] -translate-y-full transform\\"\\n\\t\\t\\t/>\\n\\t\\t\\t<img\\n\\t\\t\\t\\tsrc=\\"/inverted-border.svg\\"\\n\\t\\t\\t\\talt=\\"\\"\\n\\t\\t\\t\\tclass=\\"absolute right-[0.13em] top-[0em] w-[1.6em] -translate-y-full -rotate-90 transform\\"\\n\\t\\t\\t/>\\n\\t\\t</div>\\n\\t\\t<div class=\\"flex items-center justify-around\\">\\n\\t\\t\\t{#each menuItems as item}\\n\\t\\t\\t\\t<div class=\\"relative flex flex-col items-center justify-center\\">\\n\\t\\t\\t\\t\\t<a href={item.path} class=\\"flex flex-col items-center justify-center\\">\\n\\t\\t\\t\\t\\t\\t<div class=\\"size-[1.4em] fill-white\\">\\n\\t\\t\\t\\t\\t\\t\\t{@html item.icon}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<style lang=\\"scss\\">.step {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  border-radius: 1.6em;\\n  padding: 0.3em;\\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\\n}\\n\\n:root {\\n  --duration: 6s;\\n}\\n\\n.heart {\\n  animation: heart;\\n}\\n\\n.step5 {\\n  animation: step5;\\n}\\n\\n.step4 {\\n  animation: step4;\\n}\\n\\n.step3 {\\n  animation: step3;\\n}\\n\\n.step2 {\\n  animation: step2;\\n}\\n\\n.step1 {\\n  animation: step1;\\n}\\n\\n.step1,\\n.step2,\\n.step3,\\n.step4,\\n.step5,\\n.heart {\\n  animation-duration: var(--duration);\\n  animation-iteration-count: infinite;\\n  animation-fill-mode: forwards;\\n  animation-timing-function: ease-out;\\n}\\n\\n@keyframes heart {\\n  0%, 65% {\\n    opacity: 0;\\n    transform: scale(0);\\n  }\\n  75%, 90% {\\n    opacity: 1;\\n    transform: scale(1);\\n  }\\n  100% {\\n    opacity: 0;\\n    transform: scale(0);\\n  }\\n}\\n@keyframes step5 {\\n  0%, 27.5% {\\n    --tw-bg-opacity: 1;\\n    background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\\n    opacity: 0;\\n    transform: scale(0);\\n  }\\n  35% {\\n    --tw-bg-opacity: 1;\\n    background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\\n    opacity: 1;\\n    transform: scale(1);\\n  }\\n  40% {\\n    --tw-bg-opacity: 1;\\n    background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\\n  }\\n  40.1% {\\n    --tw-bg-opacity: 1;\\n    background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\\n  }\\n  50% {\\n    --tw-bg-opacity: 1;\\n    background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\\n  }\\n  55% {\\n    opacity: 0;\\n  }\\n  100% {\\n    opacity: 0;\\n  }\\n}\\n@keyframes step4 {\\n  0%, 22.5% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n  30% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  50% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  55%, 100% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n}\\n@keyframes step3 {\\n  0%, 17.5% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n  25% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  50% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  55%, 100% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n}\\n@keyframes step2 {\\n  0%, 12.5% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n  20% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  50% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  55%, 100% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n}\\n@keyframes step1 {\\n  0%, 10% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n  15% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  50% {\\n    transform: scale(1);\\n    opacity: 1;\\n  }\\n  55%, 100% {\\n    transform: scale(0);\\n    opacity: 0;\\n  }\\n}\\n.pop-in {\\n  animation: popIn;\\n  animation-duration: var(--duration);\\n  animation-iteration-count: infinite;\\n  animation-fill-mode: forwards;\\n}\\n\\n@keyframes popIn {\\n  0% {\\n    opacity: 0;\\n    transform: translate(0, 0);\\n  }\\n  10% {\\n    opacity: 1;\\n    transform: translate(0, 8em);\\n  }\\n  15% {\\n    opacity: 0;\\n    transform: translate(0, 8em);\\n  }\\n  55% {\\n    opacity: 0;\\n  }\\n  65% {\\n    opacity: 1;\\n  }\\n  70% {\\n    opacity: 0;\\n  }\\n  100% {\\n    opacity: 0;\\n    transform: translate(0, 8em);\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAyImB,oBAAM,CACvB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,KAAK,CACpB,OAAO,CAAE,KAAK,CACd,WAAW,CAAE,kEAAkE,CAC/E,mBAAmB,CAAE,8EAA8E,CACnG,UAAU,CAAE,IAAI,uBAAuB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,WAAW,CACxG,CAEA,KAAM,CACJ,UAAU,CAAE,EACd,CAEA,qBAAO,CACL,SAAS,CAAE,oBACb,CAEA,qBAAO,CACL,SAAS,CAAE,oBACb,CAEA,qBAAO,CACL,SAAS,CAAE,oBACb,CAEA,qBAAO,CACL,SAAS,CAAE,oBACb,CAEA,qBAAO,CACL,SAAS,CAAE,oBACb,CAEA,qBAAO,CACL,SAAS,CAAE,oBACb,CAEA,qBAAM,CACN,qBAAM,CACN,qBAAM,CACN,qBAAM,CACN,qBAAM,CACN,qBAAO,CACL,kBAAkB,CAAE,IAAI,UAAU,CAAC,CACnC,yBAAyB,CAAE,QAAQ,CACnC,mBAAmB,CAAE,QAAQ,CAC7B,yBAAyB,CAAE,QAC7B,CAEA,WAAW,oBAAM,CACf,EAAE,CAAE,GAAI,CACN,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,MAAM,CAAC,CACpB,CACA,GAAG,CAAE,GAAI,CACP,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,MAAM,CAAC,CACpB,CACA,IAAK,CACH,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,MAAM,CAAC,CACpB,CACF,CACA,WAAW,oBAAM,CACf,EAAE,CAAE,KAAM,CACR,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,EAAE,CAAC,CAAC,CACzD,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,MAAM,CAAC,CACpB,CACA,GAAI,CACF,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,EAAE,CAAC,CAAC,CACzD,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,MAAM,CAAC,CACpB,CACA,GAAI,CACF,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,EAAE,CAAC,CAC1D,CACA,KAAM,CACJ,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,IAAI,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,EAAE,CAAC,CAC7D,CACA,GAAI,CACF,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,EAAE,CAAC,CAC1D,CACA,GAAI,CACF,OAAO,CAAE,CACX,CACA,IAAK,CACH,OAAO,CAAE,CACX,CACF,CACA,WAAW,oBAAM,CACf,EAAE,CAAE,KAAM,CACR,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAG,CAAE,IAAK,CACR,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACF,CACA,WAAW,oBAAM,CACf,EAAE,CAAE,KAAM,CACR,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAG,CAAE,IAAK,CACR,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACF,CACA,WAAW,oBAAM,CACf,EAAE,CAAE,KAAM,CACR,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAG,CAAE,IAAK,CACR,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACF,CACA,WAAW,oBAAM,CACf,EAAE,CAAE,GAAI,CACN,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACA,GAAG,CAAE,IAAK,CACR,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACX,CACF,CACA,sBAAQ,CACN,SAAS,CAAE,oBAAK,CAChB,kBAAkB,CAAE,IAAI,UAAU,CAAC,CACnC,yBAAyB,CAAE,QAAQ,CACnC,mBAAmB,CAAE,QACvB,CAEA,WAAW,oBAAM,CACf,EAAG,CACD,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,CAAC,CAC3B,CACA,GAAI,CACF,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,GAAG,CAC7B,CACA,GAAI,CACF,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,GAAG,CAC7B,CACA,GAAI,CACF,OAAO,CAAE,CACX,CACA,GAAI,CACF,OAAO,CAAE,CACX,CACA,GAAI,CACF,OAAO,CAAE,CACX,CACA,IAAK,CACH,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,GAAG,CAC7B,CACF"}'
};
const HeroAnimation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let menuItems = [
    {
      slug: "home",
      name: get_store_value(t)("default.menu.bar.home"),
      path: "/app/dashboard",
      icon: IconFolder,
      available: true
    },
    {
      slug: "selfempathy",
      name: get_store_value(t)("default.menu.bar.selfempathy"),
      path: "/app/selfempathy",
      icon: IconSelf,
      available: false
    },
    {
      slug: "fights",
      name: get_store_value(t)("default.menu.bar.fights"),
      path: "/app/fights",
      icon: IconFight,
      available: true
    },
    {
      slug: "feedback",
      name: get_store_value(t)("default.menu.bar.feedback"),
      path: "/app/feedback",
      icon: IconFeedback,
      available: false
    },
    {
      slug: "learn",
      name: get_store_value(t)("default.menu.bar.learn"),
      path: "/app/learn",
      icon: IconLearn,
      available: false
    }
  ];
  t.subscribe((value) => {
    const newMenuItems = menuItems.map((entry) => {
      const translation = value(`default.menu.bar.${entry.slug}`);
      entry.name = translation;
      return entry;
    });
    menuItems = [...newMenuItems];
  });
  $$result.css.add(css$7);
  return `<div class="relative h-full w-full p-[1.2em]"><div class="pop-in svelte-1epttz6" data-svelte-h="svelte-1igc2am"><div class="flex items-center justify-center"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg-fast flex h-[1em] w-[2em] flex-col items-center justify-center rounded-full shadow-lg"></div></div></div> <div class="relative flex h-full flex-col justify-between pb-[3.6em]"><div class="flex flex-col gap-px sm:gap-[0.5em]"><div class="step step1 bg-observation-background svelte-1epttz6"><div class="w-[2em] fill-observation-foreground"><!-- HTML_TAG_START -->${IconEye}<!-- HTML_TAG_END --></div></div> <div class="step step2 bg-feelings-background svelte-1epttz6"><div class="w-[2em] fill-feelings-foreground"><!-- HTML_TAG_START -->${IconHeart}<!-- HTML_TAG_END --></div></div> <div class="step step3 bg-needs-background svelte-1epttz6"><div class="w-[2em] fill-needs-foreground"><!-- HTML_TAG_START -->${IconSwirl}<!-- HTML_TAG_END --></div></div> <div class="step step4 bg-request-background svelte-1epttz6"><div class="w-[2em] fill-request-foreground"><!-- HTML_TAG_START -->${IconSteps}<!-- HTML_TAG_END --></div></div></div> <div class="step5 flex items-center justify-center rounded-full p-[1em] shadow-lg svelte-1epttz6"><div class="flex w-full items-center justify-between fill-observation-foreground"><div class="h-[0.5em] w-[3em] rounded bg-slate-600"></div> ${validate_component(Send_horizontal, "SendHorizontal").$$render($$result, { class: "text-slate-500" }, {}, {})}</div></div> <div class="absolute flex h-full w-full items-center justify-center pb-[3em]"><div class="heart svelte-1epttz6">${validate_component(Heart, "Heart").$$render($$result, { class: "size-[5em] text-red-400" }, {}, {})}</div></div></div> <div class="fixed bottom-0 left-0 z-40 w-full rounded-b-[1em] bg-black px-[0.5em] py-[0.5em] text-gray-200"><div class="" data-svelte-h="svelte-1e4u1hl"><img src="/inverted-border.svg" alt="" class="absolute left-[0.01em] top-[0.02em] w-[1.6em] -translate-y-full transform"> <img src="/inverted-border.svg" alt="" class="absolute right-[0.13em] top-[0em] w-[1.6em] -translate-y-full -rotate-90 transform"></div> <div class="flex items-center justify-around">${each(menuItems, (item) => {
    return `<div class="relative flex flex-col items-center justify-center"><a${add_attribute("href", item.path, 0)} class="flex flex-col items-center justify-center"><div class="size-[1.4em] fill-white"><!-- HTML_TAG_START -->${item.icon}<!-- HTML_TAG_END --> </div></a> </div>`;
  })}</div></div> </div>`;
});
const css$6 = {
  code: ".screen-container.svelte-1g7h3w5{perspective:283em;perspective-origin:109% 131%}.screen.svelte-1g7h3w5{transform:translate(-53%, -52%) rotateY(-31deg) rotateX(20deg) rotateZ(-1deg)}",
  map: '{"version":3,"file":"MockupHero.svelte","sources":["MockupHero.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { cn } from \\"$lib/utils.js\\";\\nimport HeroAnimation from \\"$lib/components/HeroAnimation.svelte\\";\\nexport let className = void 0;\\nexport { className as class };\\n<\/script>\\n\\n<div class=\\"text-[7px] md:text-[12px] lg:text-[16px]\\">\\n  <div class={cn(\\"relative screen-container float\\", className)}>\\n    <img src=\\"iphone_mockup.png\\" alt=\\"\\" class=\\"relative z-10\\" />\\n    <div class=\\"screen shadow-[inset_0_0_20px_0_rgba(255,255,255,0.1)] bg-muted absolute top-1/2 left-1/2 w-[59%] h-[100%] rounded-[2em] overflow-hidden\\">\\n      <HeroAnimation />\\n    </div>\\n  </div>\\n</div>\\n\\n<style lang=\\"scss\\">.screen-container {\\n  perspective: 283em;\\n  perspective-origin: 109% 131%;\\n}\\n\\n.screen {\\n  transform: translate(-53%, -52%) rotateY(-31deg) rotateX(20deg) rotateZ(-1deg);\\n}</style>\\n"],"names":[],"mappings":"AAemB,gCAAkB,CACnC,WAAW,CAAE,KAAK,CAClB,kBAAkB,CAAE,IAAI,CAAC,IAC3B,CAEA,sBAAQ,CACN,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,QAAQ,KAAK,CAAC,CAAC,QAAQ,KAAK,CAC/E"}'
};
const MockupHero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  $$result.css.add(css$6);
  return `<div class="text-[7px] md:text-[12px] lg:text-[16px]"><div class="${escape(null_to_empty(cn("relative screen-container float", className)), true) + " svelte-1g7h3w5"}"><img src="iphone_mockup.png" alt="" class="relative z-10"> <div class="screen shadow-[inset_0_0_20px_0_rgba(255,255,255,0.1)] bg-muted absolute top-1/2 left-1/2 w-[59%] h-[100%] rounded-[2em] overflow-hidden svelte-1g7h3w5">${validate_component(HeroAnimation, "HeroAnimation").$$render($$result, {}, {}, {})}</div></div> </div>`;
});
const css$5 = {
  code: ".animate-icon4-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:4s;animation-delay:400ms;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon3-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:4s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon2-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:3s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon1-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:2s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-phone-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:1s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}@keyframes svelte-1aoqqap-phonePulse{0%{opacity:0}100%{opacity:1}}",
  map: `{"version":3,"file":"AnimatedHeroBig.svelte","sources":["AnimatedHeroBig.svelte"],"sourcesContent":["<script>\\n\\timport { t } from '$lib/translations';\\n\\timport { Button as SparkleButton } from '$lib/components/ui/button-sparkle';\\n\\timport { Button } from '$lib/components/ui/button';\\n\\timport HeroAnimation from '$lib/components/HeroAnimation.svelte';\\n\\timport { onMount, onDestroy } from 'svelte';\\n\\timport { scroll, windowWidth } from '$store/page';\\n\\timport MockupHero from '$lib/components/MockupHero.svelte';\\n\\n\\tlet animationWidth = 1000;\\n\\n\\tconst handleResize = () => {\\n\\t\\tanimationWidth = window?.document?.getElementById('animation')?.getBoundingClientRect()?.width;\\n\\t\\tconsole.log('animationWidth', animationWidth);\\n\\t};\\n<\/script>\\n\\n<div class=\\"relative z-10 flex h-svh flex-col pt-20 md:pt-32\\">\\n\\t<div class=\\"flex-grow flex flex-col justify-center\\">\\n\\t\\t<h1\\n\\t\\t\\tclass=\\"mb-10 max-w-[14em] font-display text-4xl font-semibold leading-[106%] md:text-5xl lg:text-7xl\\"\\n\\t\\t>\\n\\t\\t\\t{$t('default.page.home.hero')}\\n\\t\\t</h1>\\n\\t\\t<a href=\\"/app/auth/login\\">\\n\\t\\t\\t<SparkleButton\\n\\t\\t\\t\\tclass=\\"rounded-lg px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{$t('default.page.home.cta')}\\n\\t\\t\\t</SparkleButton>\\n\\t\\t</a>\\n\\t</div>\\n\\t<div class=\\"relative md:mb-32 lg:mb-60\\">\\n\\t\\t<div class=\\"-mx-5 mt-20 flex items-center md:mx-0\\">\\n\\t\\t\\t<div class=\\"hidden rounded-full bg-muted-dark/40 md:block md:size-32 lg:size-40\\"></div>\\n\\t\\t\\t<div class=\\"-ml-16 hidden rounded-full bg-muted-dark md:block md:size-32 lg:size-40\\"></div>\\n\\t\\t\\t<div\\n\\t\\t\\t\\tstyle=\\"background-image: url('/women.jpg')\\"\\n\\t\\t\\t\\tclass=\\"h-52 w-full bg-cover bg-right md:-ml-16 md:h-32 md:w-[300px] md:rounded-full md:bg-center lg:h-40 lg:w-[500px]\\"\\n\\t\\t\\t></div>\\n\\t\\t</div>\\n\\t\\t<MockupHero\\n\\t\\t\\tclass=\\"absolute -right-4 top-0 w-40 md:w-60 lg:right-0 lg:w-96 -mt-20\\"\\n\\t\\t/>\\n\\t</div>\\n</div>\\n\\n<style lang=\\"scss\\">:global(.animate-icon4-pulse) {\\n  animation-name: phonePulse;\\n  animation-duration: 4s;\\n  animation-delay: 400ms;\\n  animation-timing-function: ease-in-out;\\n  animation-direction: alternate;\\n  animation-iteration-count: infinite;\\n}\\n\\n:global(.animate-icon3-pulse) {\\n  animation-name: phonePulse;\\n  animation-duration: 4s;\\n  animation-timing-function: ease-in-out;\\n  animation-direction: alternate;\\n  animation-iteration-count: infinite;\\n}\\n\\n:global(.animate-icon2-pulse) {\\n  animation-name: phonePulse;\\n  animation-duration: 3s;\\n  animation-timing-function: ease-in-out;\\n  animation-direction: alternate;\\n  animation-iteration-count: infinite;\\n}\\n\\n:global(.animate-icon1-pulse) {\\n  animation-name: phonePulse;\\n  animation-duration: 2s;\\n  animation-timing-function: ease-in-out;\\n  animation-direction: alternate;\\n  animation-iteration-count: infinite;\\n}\\n\\n:global(.animate-phone-pulse) {\\n  animation-name: phonePulse;\\n  animation-duration: 1s;\\n  animation-timing-function: ease-in-out;\\n  animation-direction: alternate;\\n  animation-iteration-count: infinite;\\n}\\n\\n@keyframes phonePulse {\\n  0% {\\n    opacity: 0;\\n  }\\n  100% {\\n    opacity: 1;\\n  }\\n}</style>\\n"],"names":[],"mappings":"AA+C2B,oBAAsB,CAC/C,cAAc,CAAE,yBAAU,CAC1B,kBAAkB,CAAE,EAAE,CACtB,eAAe,CAAE,KAAK,CACtB,yBAAyB,CAAE,WAAW,CACtC,mBAAmB,CAAE,SAAS,CAC9B,yBAAyB,CAAE,QAC7B,CAEQ,oBAAsB,CAC5B,cAAc,CAAE,yBAAU,CAC1B,kBAAkB,CAAE,EAAE,CACtB,yBAAyB,CAAE,WAAW,CACtC,mBAAmB,CAAE,SAAS,CAC9B,yBAAyB,CAAE,QAC7B,CAEQ,oBAAsB,CAC5B,cAAc,CAAE,yBAAU,CAC1B,kBAAkB,CAAE,EAAE,CACtB,yBAAyB,CAAE,WAAW,CACtC,mBAAmB,CAAE,SAAS,CAC9B,yBAAyB,CAAE,QAC7B,CAEQ,oBAAsB,CAC5B,cAAc,CAAE,yBAAU,CAC1B,kBAAkB,CAAE,EAAE,CACtB,yBAAyB,CAAE,WAAW,CACtC,mBAAmB,CAAE,SAAS,CAC9B,yBAAyB,CAAE,QAC7B,CAEQ,oBAAsB,CAC5B,cAAc,CAAE,yBAAU,CAC1B,kBAAkB,CAAE,EAAE,CACtB,yBAAyB,CAAE,WAAW,CACtC,mBAAmB,CAAE,SAAS,CAC9B,yBAAyB,CAAE,QAC7B,CAEA,WAAW,yBAAW,CACpB,EAAG,CACD,OAAO,CAAE,CACX,CACA,IAAK,CACH,OAAO,CAAE,CACX,CACF"}`
};
const AnimatedHeroBig = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$result.css.add(css$5);
  $$unsubscribe_t();
  return `<div class="relative z-10 flex h-svh flex-col pt-20 md:pt-32"><div class="flex-grow flex flex-col justify-center"><h1 class="mb-10 max-w-[14em] font-display text-4xl font-semibold leading-[106%] md:text-5xl lg:text-7xl">${escape($t("default.page.home.hero"))}</h1> <a href="/app/auth/login">${validate_component(Button$1, "SparkleButton").$$render(
    $$result,
    {
      class: "rounded-lg px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.home.cta"))}`;
      }
    }
  )}</a></div> <div class="relative md:mb-32 lg:mb-60"><div class="-mx-5 mt-20 flex items-center md:mx-0" data-svelte-h="svelte-15kgd4m"><div class="hidden rounded-full bg-muted-dark/40 md:block md:size-32 lg:size-40"></div> <div class="-ml-16 hidden rounded-full bg-muted-dark md:block md:size-32 lg:size-40"></div> <div style="background-image: url('/women.jpg')" class="h-52 w-full bg-cover bg-right md:-ml-16 md:h-32 md:w-[300px] md:rounded-full md:bg-center lg:h-40 lg:w-[500px]"></div></div> ${validate_component(MockupHero, "MockupHero").$$render(
    $$result,
    {
      class: "absolute -right-4 top-0 w-40 md:w-60 lg:right-0 lg:w-96 -mt-20"
    },
    {},
    {}
  )}</div> </div>`;
});
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "plus," } = $$props;
  let { withEvents = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0) $$bindings.role(role);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0) $$bindings.ariaLabel(ariaLabel);
  if ($$props.withEvents === void 0 && $$bindings.withEvents && withEvents !== void 0) $$bindings.withEvents(withEvents);
  return `${withEvents ? `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor"></path></svg>` : `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor"></path></svg>`} `;
});
const Connector = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.25 23.28">\n  <path stroke-miterlimit="10" stroke-width="3.3" d="M2,23.28h0c0-6.43,5.21-11.64,11.64-11.64h60.97C81.04,11.64,86.25,6.43,86.25,0h0"/>\n</svg>\n';
const css$4 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: `{"version":3,"file":"The4Steps.svelte","sources":["The4Steps.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { t, locale } from \\"$lib/translations\\";\\nimport IconPlus from \\"svelte-radix/Plus.svelte\\";\\nimport IconEye from \\"$assets/icons/icon-eye.svg?raw\\";\\nimport IconHeart from \\"$assets/icons/icon-heart.svg?raw\\";\\nimport IconSwirl from \\"$assets/icons/icon-swirl.svg?raw\\";\\nimport IconSteps from \\"$assets/icons/icon-steps.svg?raw\\";\\nimport Connector from \\"$assets/icons/connector.svg?raw\\";\\nimport { Button } from \\"$lib/components/ui/button\\";\\n$: cards = [\\n  {\\n    heading: $t(\\"default.page.home.components.the4steps.steps.observation.heading\\"),\\n    color: \\"observation-foreground\\",\\n    backgroundColor: \\"observation-background\\",\\n    icon: IconEye,\\n    text: $t(\\"default.page.home.components.the4steps.steps.observation.text\\")\\n  },\\n  {\\n    heading: $t(\\"default.page.home.components.the4steps.steps.feelings.heading\\"),\\n    color: \\"feelings-foreground\\",\\n    backgroundColor: \\"feelings-background\\",\\n    icon: IconHeart,\\n    text: $t(\\"default.page.home.components.the4steps.steps.feelings.text\\")\\n  },\\n  {\\n    heading: $t(\\"default.page.home.components.the4steps.steps.needs.heading\\"),\\n    color: \\"needs-foreground\\",\\n    backgroundColor: \\"needs-background\\",\\n    icon: IconSwirl,\\n    text: $t(\\"default.page.home.components.the4steps.steps.needs.text\\")\\n  },\\n  {\\n    heading: $t(\\"default.page.home.components.the4steps.steps.request.heading\\"),\\n    color: \\"request-foreground\\",\\n    backgroundColor: \\"request-background\\",\\n    icon: IconSteps,\\n    text: $t(\\"default.page.home.components.the4steps.steps.request.text\\")\\n  }\\n];\\n<\/script>\\n\\n<div class=\\"flex flex-col items-center mb-40 pt-12 md:pt-0\\">\\n\\t<h2 class=\\"mb-16 md:mb:20 max-w-[13em] text-center font-display text-3xl md:text-4xl font-semibold lg:text-5xl\\">\\n\\t\\t{$t('default.page.home.components.the4steps.heading')}\\n\\t</h2>\\n\\t<div class=\\"relative mb-16 md:mb:20\\">\\n    <div class=\\"hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2\\">\\n\\t\\t\\t<div class=\\"w-28 stroke-black fill-none dark:stroke-neon\\">\\n\\t\\t\\t\\t{@html Connector}\\n\\t\\t\\t</div>\\n      <!-- <img src=\\"/connector.svg\\" alt=\\"connector\\" class=\\"w-28 text-red-200\\"> -->\\n    </div>\\n\\t\\t<div class=\\"md:-m-4 flex flex-wrap items-stretch justify-center\\">\\n\\t\\t\\t{#each cards as card}\\n\\t\\t\\t\\t<div class=\\"group relative h-52 md:h-72 w-full px-4 py-3 md:py-4 md:w-1/2 md:max-w-[460px]\\">\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"absolute left-full top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-first:md:block dark:bg-neon\\"\\n\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"absolute left-0 top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-last:md:block dark:bg-neon\\"\\n\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t<div class=\\"flex h-full flex-col justify-between rounded-3xl bg-muted p-5 md:p-6 lg:p-8 shadow-lg\\">\\n\\t\\t\\t\\t\\t\\t<div class=\\"flex flex-row md:flex-col gap-4 items-center md:items-start\\">\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"skeumorphic-button h-9 w-9 rounded-full bg-offwhite p-0.5\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"bg-{card.backgroundColor} fill-{card.color} flex items-center justify-center rounded-full p-1 shadow-inner\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{@html card.icon}\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t<h3 class=\\"md:mb-6 font-display text-xl font-semibold md:text-2xl\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t{card.heading}\\n\\t\\t\\t\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<div class=\\"flex\\">\\n\\t\\t\\t\\t\\t\\t\\t<p class=\\"\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t{card.text}\\n\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex items-end\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"ml-2 lg:ml-10 flex w-6 h-6 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white/60 shadow-md\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<IconPlus />\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n  <!-- <div class=\\"flex items-center justify-center\\">\\n    <Button variant=\\"outline\\" class=\\"bg-transparent border-2 border-black/60 text-base\\">\\n      {$t('default.page.home.components.the4steps.cta.text')}\\n    </Button>\\n  </div> -->\\n</div>\\n\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}</style>\\n"],"names":[],"mappings":"AAiGmB,iCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C"}`
};
const The4Steps = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cards;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$result.css.add(css$4);
  cards = [
    {
      heading: $t("default.page.home.components.the4steps.steps.observation.heading"),
      color: "observation-foreground",
      backgroundColor: "observation-background",
      icon: IconEye,
      text: $t("default.page.home.components.the4steps.steps.observation.text")
    },
    {
      heading: $t("default.page.home.components.the4steps.steps.feelings.heading"),
      color: "feelings-foreground",
      backgroundColor: "feelings-background",
      icon: IconHeart,
      text: $t("default.page.home.components.the4steps.steps.feelings.text")
    },
    {
      heading: $t("default.page.home.components.the4steps.steps.needs.heading"),
      color: "needs-foreground",
      backgroundColor: "needs-background",
      icon: IconSwirl,
      text: $t("default.page.home.components.the4steps.steps.needs.text")
    },
    {
      heading: $t("default.page.home.components.the4steps.steps.request.heading"),
      color: "request-foreground",
      backgroundColor: "request-background",
      icon: IconSteps,
      text: $t("default.page.home.components.the4steps.steps.request.text")
    }
  ];
  $$unsubscribe_t();
  return `<div class="flex flex-col items-center mb-40 pt-12 md:pt-0"><h2 class="mb-16 md:mb:20 max-w-[13em] text-center font-display text-3xl md:text-4xl font-semibold lg:text-5xl">${escape($t("default.page.home.components.the4steps.heading"))}</h2> <div class="relative mb-16 md:mb:20"><div class="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><div class="w-28 stroke-black fill-none dark:stroke-neon"><!-- HTML_TAG_START -->${Connector}<!-- HTML_TAG_END --></div> </div> <div class="md:-m-4 flex flex-wrap items-stretch justify-center">${each(cards, (card) => {
    return `<div class="group relative h-52 md:h-72 w-full px-4 py-3 md:py-4 md:w-1/2 md:max-w-[460px]"><div class="absolute left-full top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-first:md:block dark:bg-neon"></div> <div class="absolute left-0 top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-last:md:block dark:bg-neon"></div> <div class="flex h-full flex-col justify-between rounded-3xl bg-muted p-5 md:p-6 lg:p-8 shadow-lg"><div class="flex flex-row md:flex-col gap-4 items-center md:items-start"><div class="skeumorphic-button h-9 w-9 rounded-full bg-offwhite p-0.5 svelte-5cv73o"><div class="${"bg-" + escape(card.backgroundColor, true) + " fill-" + escape(card.color, true) + " flex items-center justify-center rounded-full p-1 shadow-inner svelte-5cv73o"}"><!-- HTML_TAG_START -->${card.icon}<!-- HTML_TAG_END --> </div></div> <h3 class="md:mb-6 font-display text-xl font-semibold md:text-2xl">${escape(card.heading)} </h3></div> <div class="flex"><p class="">${escape(card.text)}</p> <div class="flex items-end"><div class="ml-2 lg:ml-10 flex w-6 h-6 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white/60 shadow-md">${validate_component(Plus, "IconPlus").$$render($$result, {}, {}, {})} </div></div> </div></div> </div>`;
  })}</div></div>  </div>`;
});
const Modules = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let modules;
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  modules = [
    {
      heading: $t("default.page.home.components.modules.modules.selfempathy"),
      icon: IconSelf,
      delayed: false
    },
    {
      heading: $t("default.page.home.components.modules.modules.fight"),
      icon: IconFight,
      delayed: false
    },
    {
      heading: $t("default.page.home.components.modules.modules.feedback"),
      icon: IconFeedback,
      delayed: true
    },
    {
      heading: $t("default.page.home.components.modules.modules.learn"),
      icon: IconLearn,
      delayed: true
    }
  ];
  $$unsubscribe_t();
  $$unsubscribe_locale();
  return `<div class="mb-40 flex flex-col items-center"><h2 class="mb-16 md:mb:20 max-w-[19em] text-center font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.modules.heading"))}</h2> <div class="relative"><div class="relative flex flex-row flex-wrap justify-center gap-4">${each(modules, (module) => {
    return `<div class="group relative flex items-center justify-center rounded-[36px] bg-muted p-3 lg:p-6 text-sm shadow-xl md:w-auto"><div class="absolute left-full top-1/2 hidden h-1 w-4 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden"></div> <div class="flex size-[100px] md:size-[120px] lg:size-[140px] flex-shrink-0 flex-col items-center justify-between rounded-3xl bg-black p-2 lg:p-4 text-offwhite shadow-xl"><div></div> <div class="flex w-16 h-16 lg:h-20 lg:w-20 flex-shrink-0 items-center justify-center rounded-full fill-offwhite/90 dark:fill-white p-1 shadow-inner"><!-- HTML_TAG_START -->${module.icon}<!-- HTML_TAG_END --></div> <div class="relative">${module.delayed ? `<div class="absolute right-4 top-0.5 -translate-y-full translate-x-full transform rounded-full bg-red-500 px-2 py-0.5 text-xs">${escape($locale == "en" ? "soon" : "bald")} </div>` : ``} <span class="text-[10px] md:text-xs dark:text-white">${escape(module.heading)}</span> </div></div> </div>`;
  })}</div></div></div>`;
});
const PhoneMockup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  let { mockup } = $$props;
  let { color } = $$props;
  let { inverted = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.mockup === void 0 && $$bindings.mockup && mockup !== void 0) $$bindings.mockup(mockup);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
  if ($$props.inverted === void 0 && $$bindings.inverted && inverted !== void 0) $$bindings.inverted(inverted);
  return `<div${add_attribute("class", cn("flex items-center justify-center relative", className), 0)}><img src="phone_frontal.png" alt="Phone Mockup" class=""> <div class="bg-black bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-[35px] transform translate-y-1px z-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]"></div> <div style="${"background-image: url('" + escape(mockup, true) + "')"}" class="${"bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-30px)] h-[calc(100%-30px)] " + escape(color, true) + " rounded-[26px] sm:rounded-[30px] md:rounded-[35px] transform translate-y-1px"}"><div class="relative"><div class="absolute top-0 left-0 z-10 w-full flex items-center justify-between px-6 py-3"><span class="${"text-[9px] font-bold " + escape(inverted ? "text-white" : "text-black", true)}">09:46</span> <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 sm:w-20 h-5 sm:h-6 bg-black rounded-full flex items-center justify-end px-[4px] pt-[2px]" data-svelte-h="svelte-fpahys"><img src="/phone-lens.jpg" alt="Phone Lens" class="w-4 h-4 rounded-full"></div> <img${add_attribute(
    "src",
    inverted ? "/phone-icons-inverted.svg" : "/phone-icons.svg",
    0
  )} alt="Phone Icons" class="h-1.5 sm:h-2"></div></div></div></div>`;
});
const css$3 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: `{"version":3,"file":"Selfempathy.svelte","sources":["Selfempathy.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { t, locale } from \\"$lib/translations\\";\\nimport IconSelf from \\"$assets/icons/icon-self.svg?raw\\";\\nimport IconFight from \\"$assets/icons/icon-fight.svg?raw\\";\\nimport IconFeedback from \\"$assets/icons/icon-feedback.svg?raw\\";\\nimport IconLearn from \\"$assets/icons/icon-learn.svg?raw\\";\\nimport PhoneMockup from \\"$lib/components/PhoneMockup.svelte\\";\\nlet moduleName = void 0;\\nlocale.subscribe((value) => {\\n  moduleName = value === \\"en\\" ? \\"Module\\" : \\"Modul\\";\\n});\\n<\/script>\\n\\n<div class=\\"flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-20 mb-40\\">\\n\\t<div class=\\"flex flex-col items-center justify-center xl:items-start\\">\\n\\t\\t<div class=\\"skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1\\">\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"bg-black fill-offwhite dark:fill-neon flex items-center justify-center rounded-full p-1.5 shadow-inner\\"\\n\\t\\t\\t>\\n\\t\\t\\t{@html IconSelf}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"text-black/60 dark:text-white/80 mb-3 ml-0.5\\">\\n\\t\\t\\t1. { moduleName}\\n\\t\\t</div>\\n\\t\\t<h2 class=\\"font-display text-2xl font-semibold lg:text-4xl mb-8\\">\\n\\t\\t\\t{$t('default.page.home.components.selfempathy.heading')}\\n\\t\\t</h2>\\n\\t\\t<p class=\\"max-w-md\\">\\n\\t\\t\\t{$t('default.page.home.components.selfempathy.description')}\\n\\t\\t</p>\\n\\t</div>\\n\\t<div class=\\"relative flex\\">\\n\\t\\t<PhoneMockup mockup=\\"screenshot-fight2.png\\" color=\\"bg-[#618BFF]\\" inverted class=\\"w-50 md:w-72\\" />\\n\\t\\t<PhoneMockup mockup=\\"screenshot-dashboard.png\\" color=\\"bg-[#D7D5D1]\\" class=\\"w-50 md:w-72 -ml-36\\" />\\n\\t</div>\\n</div>\\n\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}</style>\\n"],"names":[],"mappings":"AAqCmB,iCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C"}`
};
const Selfempathy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css$3);
  $$unsubscribe_t();
  return `<div class="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-20 mb-40"><div class="flex flex-col items-center justify-center xl:items-start"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-5cv73o"><div class="bg-black fill-offwhite dark:fill-neon flex items-center justify-center rounded-full p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconSelf}<!-- HTML_TAG_END --></div></div> <div class="text-black/60 dark:text-white/80 mb-3 ml-0.5">1. ${escape(moduleName)}</div> <h2 class="font-display text-2xl font-semibold lg:text-4xl mb-8">${escape($t("default.page.home.components.selfempathy.heading"))}</h2> <p class="max-w-md">${escape($t("default.page.home.components.selfempathy.description"))}</p></div> <div class="relative flex">${validate_component(PhoneMockup, "PhoneMockup").$$render(
    $$result,
    {
      mockup: "screenshot-fight2.png",
      color: "bg-[#618BFF]",
      inverted: true,
      class: "w-50 md:w-72"
    },
    {},
    {}
  )} ${validate_component(PhoneMockup, "PhoneMockup").$$render(
    $$result,
    {
      mockup: "screenshot-dashboard.png",
      color: "bg-[#D7D5D1]",
      class: "w-50 md:w-72 -ml-36"
    },
    {},
    {}
  )}</div> </div>`;
});
const css$2 = {
  code: '.skeumorphic-button.svelte-1i4hfgr{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.label.svelte-1i4hfgr{box-shadow:-4px -4px 8px 0 white;position:relative;height:1.25rem;width:1.25rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity, 1))}.label.svelte-1i4hfgr:after{content:"";box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-1i4hfgr{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}.need.svelte-1i4hfgr{position:relative;z-index:10;display:inline}.need.svelte-1i4hfgr:before{content:"";position:absolute;left:0px;top:0px;height:100%;width:100%;z-index:-1}',
  map: `{"version":3,"file":"Fight.svelte","sources":["Fight.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { t, locale } from \\"$lib/translations\\";\\nimport backgroundImage from \\"$assets/images/holo3.jpg\\";\\nimport IconEye from \\"$assets/icons/icon-eye.svg?raw\\";\\nimport IconHeart from \\"$assets/icons/icon-heart.svg?raw\\";\\nimport IconSwirl from \\"$assets/icons/icon-swirl.svg?raw\\";\\nimport IconSteps from \\"$assets/icons/icon-steps.svg?raw\\";\\nimport IconSelf from \\"$assets/icons/icon-self.svg?raw\\";\\nimport IconFight from \\"$assets/icons/icon-fight.svg?raw\\";\\nimport IconFeedback from \\"$assets/icons/icon-feedback.svg?raw\\";\\nimport IconLearn from \\"$assets/icons/icon-learn.svg?raw\\";\\nimport PhoneMockup from \\"$lib/components/PhoneMockup.svelte\\";\\n$: tableRows = [\\n  {\\n    icon: IconEye,\\n    color: \\"observation\\",\\n    type: \\"text\\",\\n    content: $t(\\"default.page.home.components.fight.steps.observation\\")\\n  },\\n  {\\n    icon: IconHeart,\\n    color: \\"feelings\\",\\n    type: \\"array\\",\\n    content: $t(\\"default.page.home.components.fight.steps.feelings\\")\\n  },\\n  {\\n    icon: IconSwirl,\\n    color: \\"needs\\",\\n    type: \\"array\\",\\n    content: $t(\\"default.page.home.components.fight.steps.needs\\")\\n  },\\n  {\\n    icon: IconSteps,\\n    color: \\"request\\",\\n    type: \\"text\\",\\n    content: $t(\\"default.page.home.components.fight.steps.request\\")\\n  }\\n];\\nlet moduleName = void 0;\\nlocale.subscribe((value) => {\\n  moduleName = value === \\"en\\" ? \\"Module\\" : \\"Modul\\";\\n});\\n<\/script>\\n\\n<div class=\\"mb-32\\">\\n\\t<div class=\\"flex flex-col items-center\\">\\n\\t\\t<div class=\\"skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1\\">\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{@html IconFight}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"mb-3 ml-0.5 text-black/60 dark:text-white/80\\">\\n\\t\\t\\t2. {moduleName}\\n\\t\\t</div>\\n\\t\\t<h2 class=\\"mb-8 font-display text-2xl font-semibold lg:text-4xl\\">\\n\\t\\t\\t{$t('default.page.home.components.fight.heading')}\\n\\t\\t</h2>\\n\\t</div>\\n\\n\\t<div\\n\\t\\tclass=\\"relative flex flex-col items-center justify-start gap-4 lg:mt-24 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10\\"\\n\\t>\\n\\t\\t<div\\n\\t\\t\\tclass=\\"absolute left-1/2 top-[90px] hidden h-40 w-full -translate-x-1/2 -translate-y-full transform rounded-full border-4 border-black dark:border-neon lg:block\\"\\n\\t\\t>\\n\\t\\t\\t<div class=\\"absolute -top-[2px] left-1/2 hidden -translate-y-1/2 transform lg:block\\">\\n\\t\\t\\t\\t<div class=\\"h-4 w-4 rotate-45 transform border-b-4 border-l-4 border-black dark:border-neon\\"></div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"relative z-0\\">\\n\\t\\t\\t<div class=\\"absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block\\">\\n\\t\\t\\t\\t<div class=\\"h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon\\"></div>\\n\\t\\t\\t</div>\\n\\t\\t\\t<!-- card -->\\n\\t\\t\\t<div class=\\"m-4\\">\\n\\t\\t\\t\\t<div class=\\"relative w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52\\">\\n\\t\\t\\t\\t\\t{#each tableRows as row}\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"label bg-{row.color}-background\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"icon fill-{row.color}-foreground\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{@html row.icon}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex-grow break-all px-3 pb-3 pt-4 dark:text-black\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t{row.content}\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<p class=\\"w-full py-4 md:w-52\\">\\n\\t\\t\\t\\t\\tDu notierst Deine Beobachtung, Gefühle, Bedürfnisse und Bitten\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"relative z-0\\">\\n\\t\\t\\t<div class=\\"absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block\\">\\n\\t\\t\\t\\t<div class=\\"h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon\\"></div>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block\\">\\n\\t\\t\\t\\t<div class=\\"h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon\\"></div>\\n\\t\\t\\t</div>\\n\\t\\t\\t<!-- card -->\\n\\t\\t\\t<div class=\\"m-4\\">\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tstyle=\\"background-image: url('{backgroundImage}'); background-size: 300% 100%\\"\\n\\t\\t\\t\\t\\tclass={'shadow-black-5 flex h-[178.22px] w-full items-center justify-center rounded-lg bg-center bg-repeat-x shadow-xl md:w-52'}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<div class=\\"h-8 w-20 rounded-full border-4 border-white\\"></div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<p class=\\"w-full py-4 md:w-52\\">\\n\\t\\t\\t\\t\\tWir generieren einen Empathie-Link, den Du Deiner/m Streitpartner*in schickst\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"relative z-0\\">\\n\\t\\t\\t<div class=\\"absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block\\">\\n\\t\\t\\t\\t<div class=\\"h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon\\"></div>\\n\\t\\t\\t</div>\\n\\t\\t\\t<!-- card -->\\n\\t\\t\\t<div class=\\"m-4\\">\\n\\t\\t\\t\\t<div class=\\"w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52\\">\\n\\t\\t\\t\\t\\t{#each tableRows as row}\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"label bg-{row.color}-background\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"icon fill-{row.color}-foreground\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{@html row.icon}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex-grow break-all px-3 pb-3 pt-4 dark:text-black\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t{row.content}\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<p class=\\"w-full py-4 md:w-52\\">\\n\\t\\t\\t\\t\\tDein/e Streitpartner*in kann sich in Ruhe mit Deiner Sicht der Dinge auseinandersetzen und\\n\\t\\t\\t\\t\\tantwortet dann\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}\\n\\n.label {\\n  box-shadow: -4px -4px 8px 0 white;\\n  position: relative;\\n  height: 1.25rem;\\n  width: 1.25rem;\\n  flex-shrink: 0;\\n  border-radius: 9999px;\\n  border-width: 1px;\\n  --tw-border-opacity: 1;\\n  border-color: rgb(255 255 255 / var(--tw-border-opacity, 1));\\n}\\n\\n.label:after {\\n  content: \\"\\";\\n  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);\\n  display: block;\\n  height: 100%;\\n  width: 100%;\\n  border-radius: 9999px;\\n}\\n\\n.icon {\\n  position: absolute;\\n  left: 50%;\\n  top: 50%;\\n  height: 0.875rem;\\n  width: 0.875rem;\\n  --tw-translate-x: -50%;\\n  --tw-translate-y: -50%;\\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\\n}\\n\\n:global(.card-root) {\\n  box-shadow: -5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1);\\n}\\n\\n.need {\\n  position: relative;\\n  z-index: 10;\\n  display: inline;\\n}\\n.need:before {\\n  content: \\"\\";\\n  position: absolute;\\n  left: 0px;\\n  top: 0px;\\n  height: 100%;\\n  width: 100%;\\n  z-index: -1; /* Ensure the background is behind the text */\\n}</style>\\n"],"names":[],"mappings":"AA4JmB,kCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C,CAEA,qBAAO,CACL,UAAU,CAAE,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CACjC,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,OAAO,CACd,WAAW,CAAE,CAAC,CACd,aAAa,CAAE,MAAM,CACrB,YAAY,CAAE,GAAG,CACjB,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,IAAI,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,mBAAmB,CAAC,EAAE,CAAC,CAC7D,CAEA,qBAAM,MAAO,CACX,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC5C,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,MACjB,CAEA,oBAAM,CACJ,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,QAAQ,CAChB,KAAK,CAAE,QAAQ,CACf,gBAAgB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACtB,SAAS,CAAE,UAAU,IAAI,gBAAgB,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,OAAO,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAChM,CAEQ,UAAY,CAClB,UAAU,CAAE,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CACnF,CAEA,oBAAM,CACJ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,MACX,CACA,oBAAK,OAAQ,CACX,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,EACX"}`
};
const Fight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableRows;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css$2);
  tableRows = [
    {
      icon: IconEye,
      color: "observation",
      type: "text",
      content: $t("default.page.home.components.fight.steps.observation")
    },
    {
      icon: IconHeart,
      color: "feelings",
      type: "array",
      content: $t("default.page.home.components.fight.steps.feelings")
    },
    {
      icon: IconSwirl,
      color: "needs",
      type: "array",
      content: $t("default.page.home.components.fight.steps.needs")
    },
    {
      icon: IconSteps,
      color: "request",
      type: "text",
      content: $t("default.page.home.components.fight.steps.request")
    }
  ];
  $$unsubscribe_t();
  return `<div class="mb-32"><div class="flex flex-col items-center"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-1i4hfgr"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconFight}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">2. ${escape(moduleName)}</div> <h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.fight.heading"))}</h2></div> <div class="relative flex flex-col items-center justify-start gap-4 lg:mt-24 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10"><div class="absolute left-1/2 top-[90px] hidden h-40 w-full -translate-x-1/2 -translate-y-full transform rounded-full border-4 border-black dark:border-neon lg:block" data-svelte-h="svelte-79vc0a"><div class="absolute -top-[2px] left-1/2 hidden -translate-y-1/2 transform lg:block"><div class="h-4 w-4 rotate-45 transform border-b-4 border-l-4 border-black dark:border-neon"></div></div></div> <div class="relative z-0"><div class="absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block" data-svelte-h="svelte-6usgx3"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div>  <div class="m-4"><div class="relative w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52">${each(tableRows, (row) => {
    return `<div class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"><div class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"><div class="${"label bg-" + escape(row.color, true) + "-background svelte-1i4hfgr"}"><div class="${"icon fill-" + escape(row.color, true) + "-foreground svelte-1i4hfgr"}"><!-- HTML_TAG_START -->${row.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex-grow break-all px-3 pb-3 pt-4 dark:text-black">${escape(row.content)}</div> </div>`;
  })}</div> <p class="w-full py-4 md:w-52" data-svelte-h="svelte-1pur9mq">Du notierst Deine Beobachtung, Gefühle, Bedürfnisse und Bitten</p></div></div> <div class="relative z-0" data-svelte-h="svelte-17u2ho1"><div class="absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div> <div class="absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div>  <div class="m-4"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}"${add_attribute("class", "shadow-black-5 flex h-[178.22px] w-full items-center justify-center rounded-lg bg-center bg-repeat-x shadow-xl md:w-52", 0)}><div class="h-8 w-20 rounded-full border-4 border-white"></div></div> <p class="w-full py-4 md:w-52">Wir generieren einen Empathie-Link, den Du Deiner/m Streitpartner*in schickst</p></div></div> <div class="relative z-0"><div class="absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block" data-svelte-h="svelte-1mtsf3o"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div>  <div class="m-4"><div class="w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52">${each(tableRows, (row) => {
    return `<div class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"><div class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"><div class="${"label bg-" + escape(row.color, true) + "-background svelte-1i4hfgr"}"><div class="${"icon fill-" + escape(row.color, true) + "-foreground svelte-1i4hfgr"}"><!-- HTML_TAG_START -->${row.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex-grow break-all px-3 pb-3 pt-4 dark:text-black">${escape(row.content)}</div> </div>`;
  })}</div> <p class="w-full py-4 md:w-52" data-svelte-h="svelte-2rqqw4">Dein/e Streitpartner*in kann sich in Ruhe mit Deiner Sicht der Dinge auseinandersetzen und
					antwortet dann</p></div></div></div> </div>`;
});
const css$1 = {
  code: '.skeumorphic-button.svelte-1i4hfgr{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.label.svelte-1i4hfgr{box-shadow:-4px -4px 8px 0 white;position:relative;height:1.25rem;width:1.25rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity, 1))}.label.svelte-1i4hfgr:after{content:"";box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-1i4hfgr{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}.need.svelte-1i4hfgr{position:relative;z-index:10;display:inline}.need.svelte-1i4hfgr:before{content:"";position:absolute;left:0px;top:0px;height:100%;width:100%;z-index:-1}',
  map: `{"version":3,"file":"Feedback.svelte","sources":["Feedback.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { t, locale } from \\"$lib/translations\\";\\nimport backgroundImage from \\"$assets/images/holo3.jpg\\";\\nimport IconEye from \\"$assets/icons/icon-eye.svg?raw\\";\\nimport IconHeart from \\"$assets/icons/icon-heart.svg?raw\\";\\nimport IconSwirl from \\"$assets/icons/icon-swirl.svg?raw\\";\\nimport IconSteps from \\"$assets/icons/icon-steps.svg?raw\\";\\nimport IconSelf from \\"$assets/icons/icon-self.svg?raw\\";\\nimport IconFight from \\"$assets/icons/icon-fight.svg?raw\\";\\nimport IconFeedback from \\"$assets/icons/icon-feedback.svg?raw\\";\\nimport IconLearn from \\"$assets/icons/icon-learn.svg?raw\\";\\nimport PhoneMockup from \\"$lib/components/PhoneMockup.svelte\\";\\n$: tableRows = [\\n  {\\n    icon: IconEye,\\n    color: \\"observation\\",\\n    type: \\"text\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.observation\\")\\n  },\\n  {\\n    icon: IconHeart,\\n    color: \\"feelings\\",\\n    type: \\"array\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.feelings\\")\\n  },\\n  {\\n    icon: IconSwirl,\\n    color: \\"needs\\",\\n    type: \\"array\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.needs\\")\\n  },\\n  {\\n    icon: IconSteps,\\n    color: \\"request\\",\\n    type: \\"text\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.request\\")\\n  }\\n];\\nlet moduleName = void 0;\\nlocale.subscribe((value) => {\\n  moduleName = value === \\"en\\" ? \\"Module\\" : \\"Modul\\";\\n});\\n<\/script>\\n\\n<div class=\\"mb-40\\">\\n\\t<div class=\\"flex flex-col items-center\\">\\n\\t\\t<div class=\\"skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1\\">\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{@html IconFeedback}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"mb-3 ml-0.5 text-black/60 dark:text-white/80\\">\\n\\t\\t\\t3. {moduleName}\\n\\t\\t</div>\\n\\t\\t<div class=\\"relative\\">\\n\\t\\t\\t<h2 class=\\"mb-8 font-display text-2xl font-semibold lg:text-4xl\\">\\n\\t\\t\\t\\t{$t('default.page.home.components.feedback.heading')}\\n\\t\\t\\t</h2>\\n\\t\\t\\t<div class=\\"bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full\\">\\n\\t\\t\\t\\t{$t('default.menu.soon')}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<p class=\\"max-w-md text-center mb-8\\">\\n\\t\\t\\t{$t('default.page.home.components.feedback.description')}\\n\\t\\t</p>\\n\\t</div>\\n\\n\\t<div class=\\"relative flex flex-row flex-wrap justify-center items-stretch -mx-3\\">\\n\\t\\t{#each tableRows as card}\\n\\t\\t\\t<div class=\\"group mx-4 md:mx-0 relative p-3 text-sm w-full md:w-1/4 md:max-w-[460px]\\">\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"absolute left-full -ml-3 top-1/2 hidden h-1 w-6 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden\\"\\n\\t\\t\\t\\t></div>\\n\\n\\t\\t\\t\\t<div class=\\"group relative h-full shadow-xl p-6 bg-muted rounded-3xl hyphens-auto\\">\\n\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t<div class=\\"skeumorphic-button mb-8 h-9 w-9 rounded-full bg-offwhite p-0.5\\">\\n\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"bg-{card.color}-background fill-{card.color}-foreground flex items-center justify-center rounded-full p-1 shadow-inner\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t{@html card.icon}\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"flex\\">\\n\\t\\t\\t\\t\\t\\t<p class=\\"\\">\\n\\t\\t\\t\\t\\t\\t\\t{card.content}\\n\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t{/each}\\n\\t</div>\\n</div>\\n\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}\\n\\n.label {\\n  box-shadow: -4px -4px 8px 0 white;\\n  position: relative;\\n  height: 1.25rem;\\n  width: 1.25rem;\\n  flex-shrink: 0;\\n  border-radius: 9999px;\\n  border-width: 1px;\\n  --tw-border-opacity: 1;\\n  border-color: rgb(255 255 255 / var(--tw-border-opacity, 1));\\n}\\n\\n.label:after {\\n  content: \\"\\";\\n  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);\\n  display: block;\\n  height: 100%;\\n  width: 100%;\\n  border-radius: 9999px;\\n}\\n\\n.icon {\\n  position: absolute;\\n  left: 50%;\\n  top: 50%;\\n  height: 0.875rem;\\n  width: 0.875rem;\\n  --tw-translate-x: -50%;\\n  --tw-translate-y: -50%;\\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\\n}\\n\\n:global(.card-root) {\\n  box-shadow: -5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1);\\n}\\n\\n.need {\\n  position: relative;\\n  z-index: 10;\\n  display: inline;\\n}\\n.need:before {\\n  content: \\"\\";\\n  position: absolute;\\n  left: 0px;\\n  top: 0px;\\n  height: 100%;\\n  width: 100%;\\n  z-index: -1; /* Ensure the background is behind the text */\\n}</style>\\n"],"names":[],"mappings":"AAgGmB,kCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C,CAEA,qBAAO,CACL,UAAU,CAAE,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CACjC,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,OAAO,CACd,WAAW,CAAE,CAAC,CACd,aAAa,CAAE,MAAM,CACrB,YAAY,CAAE,GAAG,CACjB,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,IAAI,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,mBAAmB,CAAC,EAAE,CAAC,CAC7D,CAEA,qBAAM,MAAO,CACX,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC5C,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,MACjB,CAEA,oBAAM,CACJ,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,QAAQ,CAChB,KAAK,CAAE,QAAQ,CACf,gBAAgB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACtB,SAAS,CAAE,UAAU,IAAI,gBAAgB,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,OAAO,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAChM,CAEQ,UAAY,CAClB,UAAU,CAAE,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CACnF,CAEA,oBAAM,CACJ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,MACX,CACA,oBAAK,OAAQ,CACX,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,EACX"}`
};
const Feedback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableRows;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css$1);
  tableRows = [
    {
      icon: IconEye,
      color: "observation",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.observation")
    },
    {
      icon: IconHeart,
      color: "feelings",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.feelings")
    },
    {
      icon: IconSwirl,
      color: "needs",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.needs")
    },
    {
      icon: IconSteps,
      color: "request",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.request")
    }
  ];
  $$unsubscribe_t();
  return `<div class="mb-40"><div class="flex flex-col items-center"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-1i4hfgr"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconFeedback}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">3. ${escape(moduleName)}</div> <div class="relative"><h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.feedback.heading"))}</h2> <div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">${escape($t("default.menu.soon"))}</div></div> <p class="max-w-md text-center mb-8">${escape($t("default.page.home.components.feedback.description"))}</p></div> <div class="relative flex flex-row flex-wrap justify-center items-stretch -mx-3">${each(tableRows, (card) => {
    return `<div class="group mx-4 md:mx-0 relative p-3 text-sm w-full md:w-1/4 md:max-w-[460px]"><div class="absolute left-full -ml-3 top-1/2 hidden h-1 w-6 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden"></div> <div class="group relative h-full shadow-xl p-6 bg-muted rounded-3xl hyphens-auto"><div><div class="skeumorphic-button mb-8 h-9 w-9 rounded-full bg-offwhite p-0.5 svelte-1i4hfgr"><div class="${"bg-" + escape(card.color, true) + "-background fill-" + escape(card.color, true) + "-foreground flex items-center justify-center rounded-full p-1 shadow-inner svelte-1i4hfgr"}"><!-- HTML_TAG_START -->${card.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex"><p class="">${escape(card.content)}</p> </div></div> </div>`;
  })}</div> </div>`;
});
const css = {
  code: ".skeumorphic-button.svelte-1u6dyjo{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}",
  map: `{"version":3,"file":"Learn.svelte","sources":["Learn.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { t, locale } from \\"$lib/translations\\";\\nimport backgroundImage from \\"$assets/images/holo3.jpg\\";\\nimport IconEye from \\"$assets/icons/icon-eye.svg?raw\\";\\nimport IconHeart from \\"$assets/icons/icon-heart.svg?raw\\";\\nimport IconSwirl from \\"$assets/icons/icon-swirl.svg?raw\\";\\nimport IconSteps from \\"$assets/icons/icon-steps.svg?raw\\";\\nimport IconSelf from \\"$assets/icons/icon-self.svg?raw\\";\\nimport IconFight from \\"$assets/icons/icon-fight.svg?raw\\";\\nimport IconFeedback from \\"$assets/icons/icon-feedback.svg?raw\\";\\nimport IconLearn from \\"$assets/icons/icon-learn.svg?raw\\";\\nimport PhoneMockup from \\"$lib/components/PhoneMockup.svelte\\";\\n$: tableRows = [\\n  {\\n    icon: IconEye,\\n    color: \\"observation\\",\\n    type: \\"text\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.observation\\")\\n  },\\n  {\\n    icon: IconHeart,\\n    color: \\"feelings\\",\\n    type: \\"array\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.feelings\\")\\n  },\\n  {\\n    icon: IconSwirl,\\n    color: \\"needs\\",\\n    type: \\"array\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.needs\\")\\n  },\\n  {\\n    icon: IconSteps,\\n    color: \\"request\\",\\n    type: \\"text\\",\\n    content: $t(\\"default.page.home.components.feedback.steps.request\\")\\n  }\\n];\\nlet moduleName = void 0;\\nlocale.subscribe((value) => {\\n  moduleName = value === \\"en\\" ? \\"Module\\" : \\"Modul\\";\\n});\\n<\/script>\\n\\n<div class=\\"mb-40\\">\\n\\t<div class=\\"flex flex-col items-center lg:items-start text-center lg:text-left\\">\\n\\t\\t<div class=\\"skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1\\">\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{@html IconLearn}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"mb-3 ml-0.5 text-black/60 dark:text-white/80\\">\\n\\t\\t\\t4. {moduleName}\\n\\t\\t</div>\\n\\t\\t<div class=\\"relative\\">\\n\\t\\t\\t<h2 class=\\"mb-8 font-display text-2xl font-semibold lg:text-4xl\\">\\n\\t\\t\\t\\t{$t('default.page.home.components.learn.heading')}\\n\\t\\t\\t</h2>\\n\\t\\t\\t<div class=\\"bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full\\">\\n\\t\\t\\t\\t{$t('default.menu.soon')}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<p class=\\"max-w-md mb-8\\">\\n\\t\\t\\t{$t('default.page.home.components.learn.description')}\\n\\t\\t</p>\\n\\t</div>\\n\\n</div>\\n\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}\\n\\n:global(.card-root) {\\n  box-shadow: -5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1);\\n}</style>\\n"],"names":[],"mappings":"AAsEmB,kCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C,CAEQ,UAAY,CAClB,UAAU,CAAE,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CACnF"}`
};
const Learn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css);
  [
    {
      icon: IconEye,
      color: "observation",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.observation")
    },
    {
      icon: IconHeart,
      color: "feelings",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.feelings")
    },
    {
      icon: IconSwirl,
      color: "needs",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.needs")
    },
    {
      icon: IconSteps,
      color: "request",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.request")
    }
  ];
  $$unsubscribe_t();
  return `<div class="mb-40"><div class="flex flex-col items-center lg:items-start text-center lg:text-left"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-1u6dyjo"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconLearn}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">4. ${escape(moduleName)}</div> <div class="relative"><h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.learn.heading"))}</h2> <div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">${escape($t("default.menu.soon"))}</div></div> <p class="max-w-md mb-8">${escape($t("default.page.home.components.learn.description"))}</p></div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $backgroundColor, $$unsubscribe_backgroundColor;
  $$unsubscribe_backgroundColor = subscribe(backgroundColor, (value) => $backgroundColor = value);
  const targetColors = [
    {
      name: "topTarget",
      color: "bg-white-background"
    },
    {
      name: "stepsTarget",
      color: "bg-background"
    },
    {
      name: "modulesTarget",
      color: "bg-background"
    },
    {
      name: "selfempathyTarget",
      color: "bg-observation-background dark:bg-white-background"
    },
    {
      name: "fightTarget",
      color: "bg-feelings-background dark:bg-background"
    },
    {
      name: "feedbackTarget",
      color: "bg-needs-background dark:bg-white-background"
    },
    {
      name: "learnTarget",
      color: "bg-request-background dark:bg-background"
    }
  ];
  const updateBackgroundColor = () => {
    const targets = targetColors;
    let newColor = "";
    let section = "";
    const offset = 100;
    for (const target of targets) {
      const targetDiv = document.getElementById(target.name);
      if (targetDiv) {
        const rect = targetDiv.getBoundingClientRect();
        if (rect.top + offset >= 0 && rect.bottom + offset <= window.innerHeight) {
          newColor = target.color;
          section = target.name;
          break;
        }
      }
    }
    if (newColor) {
      backgroundColor.set(newColor);
      currentSection.set(section);
    }
  };
  scroll.subscribe(() => updateBackgroundColor());
  windowHeight.subscribe(() => updateBackgroundColor());
  $$unsubscribe_backgroundColor();
  return `<div class="flex h-full flex-grow flex-col justify-between">${validate_component(WebsiteMenu, "WebsiteMenu").$$render($$result, {}, {}, {})} <div class="${escape($backgroundColor, true) + " relative flex-grow transition duration-500"}"><div id="topTarget"></div> <div class="relative z-0 mb-20"><div class="max-container">${validate_component(AnimatedHeroBig, "AnimatedHeroBig").$$render($$result, {}, {}, {})}</div></div> <div class="max-container relative z-10 pb-40"><div id="stepsTarget"></div> ${validate_component(The4Steps, "The4Steps").$$render($$result, {}, {}, {})} <div id="modulesTarget"></div> ${validate_component(Modules, "Modules").$$render($$result, {}, {}, {})} <div id="selfempathyTarget"></div> ${validate_component(Selfempathy, "Selfempathy").$$render($$result, {}, {}, {})} <div id="fightTarget"></div> ${validate_component(Fight, "Fight").$$render($$result, {}, {}, {})} <div id="feedbackTarget"></div> ${validate_component(Feedback, "Feedback").$$render($$result, {}, {}, {})} <div id="learnTarget"></div> ${validate_component(Learn, "Learn").$$render($$result, {}, {}, {})}</div></div></div>`;
});
export {
  Page as default
};
