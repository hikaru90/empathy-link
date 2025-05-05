import { c as compute_rest_props, s as subscribe } from "./utils.js";
import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, a as add_attribute, e as escape, v as validate_component, b as each } from "./ssr.js";
import "./index4.js";
import { d as derivedMode, s as scroll } from "./page.js";
import { g as Logo, R as Root$1, c as Select_trigger, V as Value, d as Select_content, e as Select_item, I as Input, f as Switch, L as Label } from "./index5.js";
import { A as Avatar_1 } from "./Avatar.js";
import { t, l as locale } from "./translations.js";
import { u as user } from "./auth.js";
import { R as Root, T as Trigger, P as Popover_content } from "./index10.js";
import { s as setCookie, d as debounce } from "./helpers.js";
import "./client.js";
import { B as Button } from "./button.js";
const MixerVertical = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  return `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { viewBox: "0 0 15 15" },
      { fill: "none" },
      { xmlns: "http://www.w3.org/2000/svg" },
      escape_object($$restProps)
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M5 1.5C5 1.22386 4.77614 1 4.5 1C4.22386 1 4 1.22386 4 1.5L4 7C4 7.01671 4.00082 7.03323 4.00242 7.04952C2.86009 7.28022 2 8.28967 2 9.5C2 10.7103 2.86009 11.7198 4.00242 11.9505C4.00082 11.9668 4 11.9833 4 12V13.5C4 13.7761 4.22386 14 4.5 14C4.77614 14 5 13.7761 5 13.5V12C5 11.9833 4.99918 11.9668 4.99758 11.9505C6.1399 11.7198 7 10.7103 7 9.5C7 8.28967 6.1399 7.28022 4.99758 7.04952C4.99918 7.03323 5 7.01671 5 7L5 1.5ZM11 1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5V3C10 3.01671 10.0008 3.03323 10.0024 3.04952C8.8601 3.28022 8 4.28967 8 5.5C8 6.71033 8.8601 7.71978 10.0024 7.95048C10.0008 7.96677 10 7.98329 10 8V13.5C10 13.7761 10.2239 14 10.5 14C10.7761 14 11 13.7761 11 13.5V8C11 7.98329 10.9992 7.96677 10.9976 7.95048C12.1399 7.71978 13 6.71033 13 5.5C13 4.28967 12.1399 3.28022 10.9976 3.04952C10.9992 3.03323 11 3.01671 11 3V1.5ZM4.5 8C3.67157 8 3 8.67157 3 9.5C3 10.3284 3.67157 11 4.5 11C5.32843 11 6 10.3284 6 9.5C6 8.67157 5.32843 8 4.5 8ZM9 5.5C9 4.67157 9.67157 4 10.5 4C11.3284 4 12 4.67157 12 5.5C12 6.32843 11.3284 7 10.5 7C9.67157 7 9 6.32843 9 5.5Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let darkMode;
  let $mode, $$unsubscribe_mode;
  let $t, $$unsubscribe_t;
  let $scroll, $$unsubscribe_scroll;
  let $locale, $$unsubscribe_locale;
  let $user, $$unsubscribe_user;
  $$unsubscribe_mode = subscribe(derivedMode, (value) => $mode = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_scroll = subscribe(scroll, (value) => $scroll = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  let scrollValue = 0;
  let scrollingUp = false;
  const langs = [{ value: "en", label: "English" }, { value: "de", label: "German" }];
  const handleSelect = (event) => {
    if (event) {
      setCookie("locale", event.value);
      locale.update(() => event.value);
    }
  };
  const handleScroll = (value) => {
    if (value > scrollValue) {
      scrollingUp = false;
      scrollValue = value;
      return;
    }
    scrollingUp = true;
    scrollValue = value;
  };
  scroll.subscribe((value) => {
    debounce(handleScroll(value), 300);
  });
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    [
      { label: $t("default.page.home.nav") },
      { label: $t("default.page.contact.nav") }
    ];
    darkMode = $mode === "dark";
    $$rendered = ` <div class="fixed left-0 top-0 z-[100] w-full border-b border-black/20 bg-offwhite shadow-xl shadow-offwhite/20"><div class="${escape(scrollingUp ? "max-h-96" : "max-h-0", true) + " transition-all overflow-hidden"}"><nav class="${"flex items-center justify-between " + escape($scroll > 5 ? "bg-offwhite/10 backdrop-blur-2xl" : "", true) + " px-5 py-2 transition-all"}"><a href="/" class="">${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}</a> <div class="flex items-center gap-4">${validate_component(Root, "Popover.Root").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Trigger, "Popover.Trigger").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(MixerVertical, "MixerVertical").$$render($$result, { class: "h-5 w-5" }, {}, {})}`;
          }
        })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, { class: "mt-[10px] w-40 bg-background" }, {}, {
          default: () => {
            return `<div class="mb-3 border-b border-gray-300/60 pb-3 dark:border-gray-300/20">${validate_component(Root$1, "Select.Root").$$render(
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
            )}</div> <div class="flex items-center space-x-2">${validate_component(Switch, "Switch").$$render(
              $$result,
              { id: "lightMode", checked: darkMode },
              {
                checked: ($$value) => {
                  darkMode = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Label, "Label").$$render($$result, { for: "lightMode" }, {}, {
              default: () => {
                return `Dark Mode`;
              }
            })}</div>`;
          }
        })}`;
      }
    })} ${$user ? `<div class="">${validate_component(Avatar_1, "Avatar").$$render($$result, {}, {}, {})}</div>` : `${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
      default: () => {
        return `${escape($t("default.page.login.heading"))}`;
      }
    })}`}</div></nav></div> ${slots.submenu ? slots.submenu({}) : ``}</div>`;
  } while (!$$settled);
  $$unsubscribe_mode();
  $$unsubscribe_t();
  $$unsubscribe_scroll();
  $$unsubscribe_locale();
  $$unsubscribe_user();
  return $$rendered;
});
const Form_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `${validate_component(Button, "Button.Root").$$render($$result, Object.assign({}, { type: "submit" }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Form_button as F,
  Menu as M
};
