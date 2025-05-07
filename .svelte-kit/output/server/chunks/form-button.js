import { s as subscribe, c as compute_rest_props } from "./utils.js";
import { c as create_ssr_component, v as validate_component, e as escape, b as each } from "./ssr.js";
import "./index3.js";
import { L as Logo, R as Root$1, c as Select_trigger, V as Value, d as Select_content, e as Select_item, I as Input } from "./index4.js";
import { A as Avatar } from "./Avatar.js";
import { t, l as locale } from "./translations.js";
import { u as user } from "./auth.js";
import { R as Root, T as Trigger, P as Popover_content } from "./index8.js";
import "dequal";
import "./create.js";
import "clsx";
import { s as setCookie, d as debounce } from "./helpers.js";
import { s as scroll } from "./page.js";
import "./client.js";
import { I as Icon } from "./Icon.js";
import { B as Button } from "./button.js";
const Sliders_vertical = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "4",
        "y1": "21",
        "y2": "14"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "4",
        "y1": "10",
        "y2": "3"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "21",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "8",
        "y2": "3"
      }
    ],
    [
      "line",
      {
        "x1": "20",
        "x2": "20",
        "y1": "21",
        "y2": "16"
      }
    ],
    [
      "line",
      {
        "x1": "20",
        "x2": "20",
        "y1": "12",
        "y2": "3"
      }
    ],
    [
      "line",
      {
        "x1": "2",
        "x2": "6",
        "y1": "14",
        "y2": "14"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "14",
        "y1": "8",
        "y2": "8"
      }
    ],
    [
      "line",
      {
        "x1": "18",
        "x2": "22",
        "y1": "16",
        "y2": "16"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "sliders-vertical" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  let $scroll, $$unsubscribe_scroll;
  let $locale, $$unsubscribe_locale;
  let $user, $$unsubscribe_user;
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
  [
    { label: $t("default.page.home.nav") },
    { label: $t("default.page.contact.nav") }
  ];
  $$unsubscribe_t();
  $$unsubscribe_scroll();
  $$unsubscribe_locale();
  $$unsubscribe_user();
  return ` <div class="fixed left-0 top-0 z-[100] w-full border-b border-black/20 bg-offwhite shadow-xl shadow-offwhite/20"><div class="${escape(scrollingUp ? "max-h-96" : "max-h-0", true) + " transition-all overflow-hidden"}"><nav class="${"flex items-center justify-between " + escape($scroll > 5 ? "bg-offwhite/10 backdrop-blur-2xl" : "", true) + " px-5 py-2 transition-all"}"><a href="/" class="">${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}</a> <div class="flex items-center gap-4">${validate_component(Root, "Popover.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Trigger, "Popover.Trigger").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Sliders_vertical, "SlidersVertical").$$render($$result, { class: "h-5 w-5" }, {}, {})}`;
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
          )}</div>`;
        }
      })}`;
    }
  })} ${$user ? `<div class="">${validate_component(Avatar, "Avatar").$$render($$result, {}, {}, {})}</div>` : `${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `${escape($t("default.page.login.heading"))}`;
    }
  })}`}</div></nav></div> ${slots.submenu ? slots.submenu({}) : ``}</div>`;
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
