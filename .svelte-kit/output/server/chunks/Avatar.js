import { c as compute_rest_props, s as subscribe } from "./utils.js";
import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, v as validate_component, e as escape, b as each, a as add_attribute } from "./ssr.js";
import "./page.js";
import { C as Cross1 } from "./Cross1.js";
import { g as getContext } from "./lifecycle.js";
import { t, l as locale } from "./translations.js";
import { R as Root, T as Trigger, C as Close } from "./index6.js";
import "dequal";
import { c as cn } from "./create.js";
import "clsx";
import { B as Button, S as Sheet_content, a as Sheet_header, b as Sheet_title, R as Root$1, c as Select_trigger, V as Value, d as Select_content, e as Select_item, I as Input } from "./index4.js";
import { s as setCookie } from "./helpers.js";
import { u as user } from "./auth.js";
import { b as backgroundImage } from "./SparklePill.js";
import { I as Icon } from "./Icon.js";
const Sheet_footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("flex flex-col", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Exit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "exit," } = $$props;
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor"></path></svg>` : `<svg${spread(
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor"></path></svg>`} `;
});
const User = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      }
    ],
    ["circle", { "cx": "12", "cy": "7", "r": "4" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "user" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  let $user, $$unsubscribe_user;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  const langs = [{ value: "en", label: "English" }, { value: "de", label: "German" }];
  const handleSelect = (selected) => {
    if (selected) {
      setCookie("locale", selected.value);
      locale.update(() => selected.value);
    }
  };
  $$unsubscribe_t();
  $$unsubscribe_locale();
  $$unsubscribe_user();
  return `${validate_component(Root, "Sheet.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Trigger, "Sheet.Trigger").$$render($$result, { asChild: true, class: "" }, {}, {
        default: ({ builder }) => {
          return `${validate_component(Button, "Button").$$render(
            $$result,
            {
              decoration: "floating-op1",
              builders: [builder],
              class: "-mr-2 flex items-center justify-center border-neutral-200 bg-background p-1.5 text-sm text-neutral-800 transition hover:bg-offwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
            },
            {},
            {
              default: () => {
                return `${validate_component(User, "User").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
              }
            }
          )}`;
        }
      })} ${validate_component(Sheet_content, "Sheet.Content").$$render(
        $$result,
        {
          side: "right",
          class: "z-[1003] flex flex-col border-muted"
        },
        {},
        {
          default: () => {
            return `${validate_component(Sheet_header, "Sheet.Header").$$render(
              $$result,
              {
                class: "flex flex-row items-center justify-between border-b border-black/10 px-5 py-2"
              },
              {},
              {
                default: () => {
                  return `${validate_component(Sheet_title, "Sheet.Title").$$render($$result, { class: "pt-0.5" }, {}, {
                    default: () => {
                      return `${escape($t("default.menu.profile.sheet.header"))}`;
                    }
                  })} ${validate_component(Close, "Sheet.Close").$$render($$result, { class: "!m-0" }, {}, {
                    default: () => {
                      return `${validate_component(Button, "Button").$$render(
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
            )} <div class="flex flex-grow flex-col justify-between p-5"><div><div class="mb-3 border-b border-gray-300/60 pb-3 dark:border-gray-300/20">${validate_component(Root$1, "Select.Root").$$render(
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
            )}</div></div> ${validate_component(Sheet_footer, "Sheet.Footer").$$render($$result, { class: "w-full" }, {}, {
              default: () => {
                return `<div class="my-2 flex gap-4 px-6"><div class="relative flex items-center justify-center"><div class="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase tracking-[-0.12em] relative z-10">${escape($user?.firstName.charAt(0))} ${escape($user?.lastName.charAt(0))}</div> <div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 400% 400%"}"${add_attribute("class", "size-[36px] rounded-full bg-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 shadow-lg", 0)}></div></div> <div class="flex flex-col"><div class="font-bold">${escape($user?.firstName)} ${escape($user?.lastName)}</div> <div class="text-sm -mt-1">${escape($user?.email)}</div></div></div> <form action="/app/auth/logout" method="POST" class="w-full"><button type="submit" class="w-full">${validate_component(Button, "Button").$$render(
                  $$result,
                  {
                    wrapperClass: "w-full",
                    decoration: "floating-op1",
                    class: "flex !h-10 w-full items-center justify-between gap-3 border-offwhite bg-orange-900 text-red-300 data-[highlighted]:bg-red-200 data-[highlighted]:text-red-500"
                  },
                  {},
                  {
                    default: () => {
                      return `${escape($t("default.menu.profile.logout"))} ${validate_component(Exit, "Exit").$$render($$result, { class: "size-3" }, {}, {})}`;
                    }
                  }
                )}</button></form> `;
              }
            })}</div>`;
          }
        }
      )}`;
    }
  })}`;
});
export {
  Avatar as A
};
