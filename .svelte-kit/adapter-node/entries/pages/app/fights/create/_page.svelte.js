import { c as compute_rest_props, s as subscribe, g as get_store_value } from "../../../../../chunks/utils.js";
import { k as handleRovingFocus, l as arraysAreEqual, B as Button, m as globals } from "../../../../../chunks/switch.js";
import { c as create_ssr_component, s as spread, h as escape_object, a as add_attribute, g as escape_attribute_value, v as validate_component, e as escape, f as each } from "../../../../../chunks/ssr.js";
import { A as AppTopMenu } from "../../../../../chunks/AppTopMenu.js";
import { A as AppBottomMenu } from "../../../../../chunks/AppBottomMenu.js";
import { F as Form_field, C as Control, c as Form_label, I as Input, d as Form_field_errors } from "../../../../../chunks/index5.js";
import { o as omit, m as makeElement, u as disabledAttr, q as isHTMLElement, h as executeCallbacks, j as addMeltEventListener, l as createElHelpers, r as noop, k as kbd, b as backgroundColor } from "../../../../../chunks/page.js";
import { t as toWritableStores, o as overridable, c as createBitAttrs, b as removeUndefined, d as getOptionUpdater, e as createDispatcher } from "../../../../../chunks/index3.js";
import { s as setContext, g as getContext, c as createEventDispatcher, o as onDestroy } from "../../../../../chunks/lifecycle.js";
import { d as derived, w as writable } from "../../../../../chunks/index2.js";
import "clsx";
import { t as toggleVariants, A as ArrowRight, C as ChevronUp, a as ChevronDown, d as defaults$1, D as Drawer, b as Drawer_content, c as Drawer_header, e as Drawer_title, f as Close, g as Cross1, F as FormStepDisplay } from "../../../../../chunks/index7.js";
import { c as cn } from "../../../../../chunks/utils2.js";
import "../../../../../chunks/client.js";
import { s as superForm } from "../../../../../chunks/memoize.js";
import "../../../../../chunks/index.js";
import { t, l as locale } from "../../../../../chunks/translations.js";
import { C as CaretLeft } from "../../../../../chunks/CaretLeft.js";
import { a as zod, z as zodClient } from "../../../../../chunks/zod.js";
import { z } from "zod";
import { I as IconFolder, a as IconEye, b as IconHeart, c as IconSwirl, d as IconSteps } from "../../../../../chunks/icon-steps.js";
import { p as pb } from "../../../../../chunks/pocketbase.js";
import { b as backgroundImage } from "../../../../../chunks/SparklePill.js";
import { u as user } from "../../../../../chunks/auth.js";
import { p as page } from "../../../../../chunks/stores.js";
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title, c as Dialog_description } from "../../../../../chunks/index6.js";
import { a as toast } from "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
/* empty css                                                        */
import { C as Check } from "../../../../../chunks/Check.js";
import { P as PaperPlane } from "../../../../../chunks/PaperPlane.js";
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
const defaults = {
  type: "single",
  orientation: "horizontal",
  loop: true,
  rovingFocus: true,
  disabled: false,
  defaultValue: ""
};
const { name, selector } = createElHelpers("toggle-group");
const createToggleGroup = (props) => {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "value"));
  const { type, orientation, loop, rovingFocus, disabled } = options;
  const defaultValue = withDefaults.defaultValue ? withDefaults.defaultValue : withDefaults.type === "single" ? void 0 : [];
  const valueWritable = withDefaults.value ?? writable(defaultValue);
  const value = overridable(valueWritable, withDefaults?.onValueChange);
  const root = makeElement(name(), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        role: "group",
        "data-orientation": $orientation
      };
    }
  });
  const item = makeElement(name("item"), {
    stores: [value, disabled, orientation, type],
    returned: ([$value, $disabled, $orientation, $type]) => {
      return (props2) => {
        const itemValue = typeof props2 === "string" ? props2 : props2.value;
        const argDisabled = typeof props2 === "string" ? false : !!props2.disabled;
        const disabled2 = $disabled || argDisabled;
        const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
        const isSingle = $type === "single";
        const isMultiple = $type === "multiple" || $type === void 0;
        return {
          disabled: disabledAttr(disabled2),
          pressed,
          "data-orientation": $orientation,
          "data-disabled": disabledAttr(disabled2),
          "data-state": pressed ? "on" : "off",
          "data-value": itemValue,
          "aria-pressed": isMultiple ? pressed : void 0,
          "aria-checked": isSingle ? pressed : void 0,
          type: "button",
          role: isSingle ? "radio" : void 0,
          tabindex: pressed ? 0 : -1
        };
      };
    },
    action: (node) => {
      let unsub = noop;
      const parentGroup = node.closest(selector());
      if (!isHTMLElement(parentGroup))
        return {};
      const items = Array.from(parentGroup.querySelectorAll(selector("item")));
      const $value = value.get();
      const anyPressed = Array.isArray($value) ? $value.length > 0 : $value ? true : false;
      if (!anyPressed && items[0] === node) {
        node.tabIndex = 0;
      }
      function getNodeProps() {
        const itemValue = node.dataset.value;
        const disabled2 = node.dataset.disabled === "true";
        return { value: itemValue, disabled: disabled2 };
      }
      function handleValueUpdate() {
        const { value: itemValue, disabled: disabled2 } = getNodeProps();
        if (itemValue === void 0 || disabled2)
          return;
        value.update(($value2) => {
          if (Array.isArray($value2)) {
            if ($value2.includes(itemValue)) {
              return $value2.filter((i) => i !== itemValue);
            }
            return [...$value2, itemValue];
          }
          return $value2 === itemValue ? void 0 : itemValue;
        });
      }
      unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleValueUpdate();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
          e.preventDefault();
          handleValueUpdate();
          return;
        }
        if (!rovingFocus.get())
          return;
        const el = e.currentTarget;
        if (!isHTMLElement(el))
          return;
        const root2 = el.closest(selector());
        if (!isHTMLElement(root2))
          return;
        const items2 = Array.from(root2.querySelectorAll(selector("item") + ":not([data-disabled])")).filter((item2) => isHTMLElement(item2));
        const currentIndex = items2.indexOf(el);
        const dir = getElemDirection(el);
        const $orientation = orientation.get();
        const nextKey = {
          horizontal: dir === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
          vertical: kbd.ARROW_DOWN
        }[$orientation ?? "horizontal"];
        const prevKey = {
          horizontal: dir === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
          vertical: kbd.ARROW_UP
        }[$orientation ?? "horizontal"];
        const $loop = loop.get();
        if (e.key === nextKey) {
          e.preventDefault();
          const nextIndex = currentIndex + 1;
          if (nextIndex >= items2.length && $loop) {
            handleRovingFocus(items2[0]);
          } else {
            handleRovingFocus(items2[nextIndex]);
          }
        } else if (e.key === prevKey) {
          e.preventDefault();
          const prevIndex = currentIndex - 1;
          if (prevIndex < 0 && $loop) {
            handleRovingFocus(items2[items2.length - 1]);
          } else {
            handleRovingFocus(items2[prevIndex]);
          }
        } else if (e.key === kbd.HOME) {
          e.preventDefault();
          handleRovingFocus(items2[0]);
        } else if (e.key === kbd.END) {
          e.preventDefault();
          handleRovingFocus(items2[items2.length - 1]);
        }
      }));
      return {
        destroy: unsub
      };
    }
  });
  const isPressed = derived(value, ($value) => {
    return (itemValue) => {
      return Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
    };
  });
  return {
    elements: {
      root,
      item
    },
    states: {
      value
    },
    helpers: {
      isPressed
    },
    options
  };
};
function getToggleGroupData() {
  const NAME = "toggle-group";
  const PARTS = ["root", "item"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getToggleGroupData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const toggleGroup = { ...createToggleGroup(removeUndefined(props)), getAttrs };
  setContext(NAME, toggleGroup);
  return {
    ...toggleGroup,
    updateOption: getOptionUpdater(toggleGroup.options)
  };
}
function getCtx() {
  const { NAME } = getToggleGroupData();
  return getContext(NAME);
}
const Toggle_group$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["type", "disabled", "loop", "value", "orientation", "onValueChange", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { type = "single" } = $$props;
  let { disabled = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { orientation = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { value: localValue }, updateOption, getAttrs } = setCtx({
    disabled,
    type,
    defaultValue: value,
    loop,
    orientation,
    onValueChange: ({ next }) => {
      if (Array.isArray(next)) {
        if (!Array.isArray(value) || !arraysAreEqual(value, next)) {
          onValueChange?.(next);
          value = next;
          return next;
        }
        return next;
      }
      if (value !== next) {
        onValueChange?.(next);
        value = next;
      }
      return next;
    }
  });
  $$unsubscribe_root = subscribe(root, (value2) => $root = value2);
  const attrs = getAttrs("root");
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0)
    $$bindings.loop(loop);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0)
    $$bindings.orientation(orientation);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0)
    $$bindings.onValueChange(onValueChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("loop", loop);
  }
  {
    updateOption("type", type);
  }
  {
    updateOption("orientation", orientation);
  }
  builder = $root;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Toggle_group_item$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "asChild", "el"]);
  let $item, $$unsubscribe_item;
  let { value } = $$props;
  let { disabled = false } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { item }, getAttrs } = getCtx();
  $$unsubscribe_item = subscribe(item, (value2) => $item = value2);
  createDispatcher();
  const attrs = getAttrs("item");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $item({ value, disabled });
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_item();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Clipboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Clipboard$1 = Clipboard;
const EnvelopeClosed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const EnvelopeClosed$1 = EnvelopeClosed;
const Reset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Reset$1 = Reset;
const Share1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7.50003C5 8.32845 4.32843 9.00003 3.5 9.00003C2.67157 9.00003 2 8.32845 2 7.50003C2 6.6716 2.67157 6.00003 3.5 6.00003C4.32843 6.00003 5 6.6716 5 7.50003ZM5.71313 8.66388C5.29445 9.45838 4.46048 10 3.5 10C2.11929 10 1 8.88074 1 7.50003C1 6.11931 2.11929 5.00003 3.5 5.00003C4.46048 5.00003 5.29445 5.54167 5.71313 6.33616L9.10424 4.21671C9.03643 3.98968 9 3.74911 9 3.50003C9 2.11932 10.1193 1.00003 11.5 1.00003C12.8807 1.00003 14 2.11932 14 3.50003C14 4.88074 12.8807 6.00003 11.5 6.00003C10.6915 6.00003 9.97264 5.61624 9.51566 5.0209L5.9853 7.22738C5.99502 7.31692 6 7.40789 6 7.50003C6 7.59216 5.99502 7.68312 5.9853 7.77267L9.51567 9.97915C9.97265 9.38382 10.6915 9.00003 11.5 9.00003C12.8807 9.00003 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 11.2509 9.03643 11.0104 9.10425 10.7833L5.71313 8.66388ZM11.5 5.00003C12.3284 5.00003 13 4.32846 13 3.50003C13 2.6716 12.3284 2.00003 11.5 2.00003C10.6716 2.00003 10 2.6716 10 3.50003C10 4.32846 10.6716 5.00003 11.5 5.00003ZM13 11.5C13 12.3285 12.3284 13 11.5 13C10.6716 13 10 12.3285 10 11.5C10 10.6716 10.6716 10 11.5 10C12.3284 10 13 10.6716 13 11.5Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Share1$1 = Share1;
const Toggle_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "variant", "size", "value"]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size = "default" } = $$props;
  let { value = void 0 } = $$props;
  setToggleGroupCtx({ variant, size });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Toggle_group$1, "ToggleGroupPrimitive.Root").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("flex items-center justify-center gap-1", className)
        },
        $$restProps,
        { value }
      ),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder }) => {
          return `${slots.default ? slots.default({ builder }) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Toggle_group_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "variant", "size", "value"]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size = "default" } = $$props;
  let { value } = $$props;
  const ctx = getToggleGroupCtx();
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `${validate_component(Toggle_group_item$1, "ToggleGroupPrimitive.Item").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn(
          toggleVariants({
            variant: ctx.variant || variant,
            size: ctx.size || size
          }),
          className
        )
      },
      { value },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
function setToggleGroupCtx(props) {
  setContext("toggleGroup", props);
}
function getToggleGroupCtx() {
  return getContext("toggleGroup");
}
const css$3 = {
  code: ".group .light-button{transition:box-shadow 50ms, background-color 700ms}.group:active .light-button{box-shadow:0 0 0 rgba(255, 255, 255, 0.6), 0 0 0 rgba(0, 0, 0, 0.2)}",
  map: null
};
const FormStepper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  createEventDispatcher();
  let { step } = $$props;
  let { checkForJudgement } = $$props;
  let { class: className = void 0 } = $$props;
  let { primaryButtonClass = void 0 } = $$props;
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.checkForJudgement === void 0 && $$bindings.checkForJudgement && checkForJudgement !== void 0)
    $$bindings.checkForJudgement(checkForJudgement);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.primaryButtonClass === void 0 && $$bindings.primaryButtonClass && primaryButtonClass !== void 0)
    $$bindings.primaryButtonClass(primaryButtonClass);
  $$result.css.add(css$3);
  $$unsubscribe_t();
  return `<div class="${"flex justify-between " + escape(className, true)}"><div class="${escape(step > 1 ? "max-w-60 opacity-100" : "max-w-0 opacity-0", true) + " group relative transform overflow-visible"}">${validate_component(Button, "Button").$$render(
    $$result,
    {
      decoration: "dark-op1",
      class: "flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
    },
    {},
    {
      default: () => {
        return `${validate_component(CaretLeft, "CaretLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
      }
    }
  )}</div> ${checkForJudgement ? `${validate_component(Button, "Button").$$render(
    $$result,
    {
      decoration: "dark-op1",
      wrapperClass: "w-full",
      class: "flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
    },
    {},
    {
      default: () => {
        return ` ${escape($t("default.page.fights.form.general.checkJudgement"))} ${validate_component(ArrowRight, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
      }
    }
  )}` : `${validate_component(Button, "Button").$$render(
    $$result,
    {
      type: "submit",
      decoration: "dark-op1",
      wrapperClass: "w-full",
      class: "flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
    },
    {},
    {
      default: () => {
        return ` ${escape($t("default.page.fights.form.general.next"))} ${validate_component(ArrowRight, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
      }
    }
  )}`} </div>`;
});
const schemaStep1 = z.object({
  name: z.string().min(3, { message: get_store_value(t)("default.page.fights.form.name.tooShortError") }),
  title: z.string().min(3, { message: get_store_value(t)("default.page.fights.form.title.tooShortError") })
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
const Textarea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value", "readonly"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { readonly = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0)
    $$bindings.readonly(readonly);
  return `<textarea${spread(
    [
      {
        class: escape_attribute_value(cn("flex min-h-[60px] w-full rounded-md border border-input bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/10 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      { readonly: readonly || null },
      escape_object($$restProps)
    ],
    {}
  )}>${escape(value || "")}</textarea>`;
});
const css$2 = {
  code: ".triangle.svelte-12yl6i5{-webkit-clip-path:polygon(0 0, 100% 0, 100% 100%);clip-path:polygon(0 0, 100% 0, 100% 100%)}.mouth.svelte-12yl6i5{animation:svelte-12yl6i5-mouth 10s infinite}.lookaround.svelte-12yl6i5{animation:svelte-12yl6i5-lookaround 10s infinite}.chevron.svelte-12yl6i5{display:flex;width:1rem;height:1rem;align-items:center;justify-content:center;border-radius:0.25rem;--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}@keyframes svelte-12yl6i5-mouth{0%{transform:scaleY(0.4)}5%{transform:scaleY(1)}25%{transform:scaleY(0.4)}100%{transform:scaleY(1)}}@keyframes svelte-12yl6i5-lookaround{0%{transform:translate(0, 20%)}5%{transform:translate(-20%, 20%)}25%{transform:translate(40%, 20%)}30%{transform:translate(30%, 52%)}50%{transform:translate(30%, 52%)}55%{transform:translate(-30%, 44%)}85%{transform:translate(-30%, 44%)}100%{transform:translate(0, 20%)}}",
  map: null
};
const Mascot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let speechBubbleContent;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  let { step } = $$props;
  let { stepName } = $$props;
  let { formSuccess } = $$props;
  let { speechBubbleContentArray } = $$props;
  let thinking = false;
  const getSpeechBubbleContent = (formSuccess2, step2) => {
    try {
      return step2 === 13 && !formSuccess2 ? speechBubbleContentArray.find((el) => el.step === 13).errorContent : speechBubbleContentArray.find((el) => el.step === step2).content;
    } catch (err) {
      console.error("error in getSpeechBubbleContent", err);
      return [];
    }
  };
  let speechBubbleElement;
  const addSpeechBubbleText = (text = "Hi") => {
    speechBubbleContent = [speechBubbleContent[0], text];
  };
  const checkJudgement = async (judgement) => {
    thinking = true;
    try {
      const judgementRes = await fetch("/api/ai/checkForJudgement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: judgement, lang: $locale })
      });
      const res = await judgementRes.json();
      thinking = false;
      const answer = res.result;
      addSpeechBubbleText(answer);
    } catch (err) {
      console.error("error in getting judgement", err);
    }
  };
  onDestroy(() => {
  });
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.stepName === void 0 && $$bindings.stepName && stepName !== void 0)
    $$bindings.stepName(stepName);
  if ($$props.formSuccess === void 0 && $$bindings.formSuccess && formSuccess !== void 0)
    $$bindings.formSuccess(formSuccess);
  if ($$props.speechBubbleContentArray === void 0 && $$bindings.speechBubbleContentArray && speechBubbleContentArray !== void 0)
    $$bindings.speechBubbleContentArray(speechBubbleContentArray);
  if ($$props.checkJudgement === void 0 && $$bindings.checkJudgement && checkJudgement !== void 0)
    $$bindings.checkJudgement(checkJudgement);
  $$result.css.add(css$2);
  speechBubbleContent = getSpeechBubbleContent(formSuccess, step);
  $$unsubscribe_locale();
  return `<div class="mt-4 flex items-start gap-2"><div class="relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1" data-svelte-h="svelte-ido9h0"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700"><div data-name="face" class="lookaround face-3 flex flex-col gap-1 svelte-12yl6i5"><div data-name="eyes" class="eyes flex items-center justify-center gap-2"><div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div> <div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div></div> <div data-name="mouth" class="mouth flex items-center justify-center svelte-12yl6i5"><div class="h-1.5 w-2.5 rounded-b-full bg-black"></div></div></div></div></div> <div class="flex flex-grow"><div class="triangle size-3 flex-shrink-0 bg-muted svelte-12yl6i5"></div> <div class="rounded-tl-0 relative flex flex-grow rounded-b rounded-tr bg-muted px-2 pb-2 pt-1 text-sm leading-tight gap-2">${thinking ? `<div id="speechBubble" class="w-full" data-svelte-h="svelte-534rav">...</div>` : `<div id="speechBubble" class="w-full"${add_attribute("this", speechBubbleElement, 0)}></div>`} ${speechBubbleContent.length > 1 ? `<div class="flex justify-end text-2xs"><div class="-mr-1 flex flex-col items-center gap-0.5"><button class="chevron svelte-12yl6i5">${validate_component(ChevronUp, "ChevronUp").$$render($$result, { class: "size-2.5" }, {}, {})}</button>  <button class="chevron svelte-12yl6i5">${validate_component(ChevronDown, "ChevronDown").$$render($$result, { class: "size-2.5" }, {}, {})}</button></div></div>` : ``}</div></div></div>  `;
});
const Drawer_footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("mt-auto flex flex-col gap-2 p-4", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const { Object: Object_1$1 } = globals;
const css$1 = {
  code: '.label.svelte-ljnb6t{box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);position:relative;height:1.75rem;width:1.75rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.label.svelte-ljnb6t:after{content:"";box-shadow:-4px -4px 8px 0 white;display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-ljnb6t{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.skeumorphic-button.svelte-ljnb6t{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}',
  map: null
};
const Share = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let shareableLink;
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  let $locale, $$unsubscribe_locale;
  let $page, $$unsubscribe_page;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { id } = $$props;
  let { record } = $$props;
  let dialogOpen = false;
  let drawerOpen = false;
  const schema = z.object({
    email: z.string().email({
      message: get_store_value(t)("default.page.login.form.email.validEmailError")
    })
  });
  const data = defaults$1(zod(schema));
  const checkValidation = async () => {
    const validationResult = await validateForm($formData, schema);
    if (!validationResult.valid) {
      errors.set(validationResult.errors);
      return false;
    }
    return true;
  };
  const form = superForm(data, {
    // SPA: true,
    resetForm: false,
    validators: zodClient(schema),
    async onSubmit({ validators, cancel }) {
      console.log("onSubmit");
      cancel();
      if (await checkValidation()) {
        sendLink();
      }
    }
  });
  const { form: formData, errors, enhance, validate, validateForm } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  const sendLink = () => {
    try {
      console.log("send link record", record);
      const sendMailRes = fetch("/api/mails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "sendLink",
          locale: $locale,
          to: $formData.email,
          owner: record.expand.owner.firstName,
          recipientName: record.name,
          link: shareableLink
        })
      });
      console.log("sendMailRes", sendMailRes);
      dialogOpen = false;
      toast.success($t("default.menu.share.mailLinkConfirmation"));
    } catch (err) {
      console.log("error sending link per mail", err);
      toast.error($t("default.menu.share.mailLinkError"));
    }
  };
  onDestroy(() => {
    pb.collection("responses").unsubscribe("*");
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.record === void 0 && $$bindings.record && record !== void 0)
    $$bindings.record(record);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    shareableLink = `${$page.url.origin}/app/fights/${id}/respond`;
    $$rendered = `<div class="relative flex h-auto w-full items-center justify-between"><a href="/app/dashboard" class="block">${validate_component(Button, "Button").$$render(
      $$result,
      {
        decoration: "dark-op1",
        class: "flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
      },
      {},
      {
        default: () => {
          return `${validate_component(CaretLeft, "CaretLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
        }
      }
    )}</a> <div class="flex items-center">${!record.resolved ? `${validate_component(Button, "Button").$$render(
      $$result,
      {
        decoration: "dark-op1",
        class: "flex items-center gap-2 border-neutral-900 bg-green-700 text-sm text-zinc-200 hover:bg-green-800"
      },
      {},
      {
        default: () => {
          return `${escape($t("default.page.fight.resolve"))} ${validate_component(Check, "Check").$$render($$result, { class: "-mr-2" }, {}, {})}`;
        }
      }
    )}` : `${validate_component(Button, "Button").$$render(
      $$result,
      {
        decoration: "dark-op1",
        class: "flex items-center gap-2 border-neutral-900 bg-red-700 text-sm text-zinc-200 hover:bg-red-800"
      },
      {},
      {
        default: () => {
          return `${escape($t("default.page.fight.unresolve"))} ${validate_component(Reset$1, "Reset").$$render($$result, { class: "-mr-2" }, {}, {})}`;
        }
      }
    )}`} ${validate_component(Button, "Button").$$render(
      $$result,
      {
        decoration: "dark-op1",
        class: "flex items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
      },
      {},
      {
        default: () => {
          return `${escape($t("default.menu.share.cta"))} ${validate_component(Share1$1, "Share1").$$render($$result, { class: "-mr-1" }, {}, {})}`;
        }
      }
    )}</div></div> ${validate_component(Drawer, "Drawer.Root").$$render(
      $$result,
      { open: drawerOpen },
      {
        open: ($$value) => {
          drawerOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Drawer_content, "Drawer.Content").$$render($$result, { class: "" }, {}, {
            default: () => {
              return `${validate_component(Drawer_header, "Drawer.Header").$$render($$result, { class: "w-full border-b border-black/10" }, {}, {
                default: () => {
                  return `<div class="flex items-center justify-between">${validate_component(Drawer_title, "Drawer.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape($t("default.menu.share.cta"))}`;
                    }
                  })}  ${validate_component(Close, "Drawer.Close").$$render($$result, {}, {}, {
                    default: () => {
                      return `<div class="label bg-feelings-background svelte-ljnb6t"><div class="icon fill-feelings-foreground svelte-ljnb6t"> ${validate_component(Cross1, "Cross1").$$render($$result, { class: "text-red-600" }, {}, {})}</div></div>`;
                    }
                  })}</div>`;
                }
              })} ${validate_component(Drawer_footer, "Drawer.Footer").$$render($$result, { class: "pb-10" }, {}, {
                default: () => {
                  return `<div class="max-container flex flex-col gap-4"><button class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm svelte-ljnb6t">${escape($t("default.menu.share.copyLink"))} ${validate_component(Clipboard$1, "Clipboard").$$render($$result, {}, {}, {})}</button> <button class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm svelte-ljnb6t">${escape($t("default.menu.share.mailLink"))} ${validate_component(EnvelopeClosed$1, "EnvelopeClosed").$$render($$result, {}, {}, {})}</button></div>`;
                }
              })}`;
            }
          })}`;
        }
      }
    )} ${validate_component(Root, "Dialog.Root").$$render(
      $$result,
      { preventScroll: false, open: dialogOpen },
      {
        open: ($$value) => {
          dialogOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Dialog_content, "Dialog.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, { class: "mb-10 max-w-[9em] leading-tight" }, {}, {
                    default: () => {
                      return `${escape($t("default.menu.share.mailDialogText"))}`;
                    }
                  })} ${validate_component(Dialog_description, "Dialog.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `<form class="-mt-1 flex h-full flex-grow flex-col items-start">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "email", class: "w-full" }, {}, {
                        default: () => {
                          return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
                            default: ({ attrs }) => {
                              return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
                                default: () => {
                                  return `E-Mail`;
                                }
                              })} ${validate_component(Input, "Input").$$render(
                                $$result,
                                Object_1$1.assign(
                                  {},
                                  attrs,
                                  { type: "text" },
                                  {
                                    placeholder: $locale === "en" ? "E-Mail" : "E-Mail Adresse"
                                  },
                                  { class: "mb-4" },
                                  { value: $formData.email }
                                ),
                                {
                                  value: ($$value) => {
                                    $formData.email = $$value;
                                    $$settled = false;
                                  }
                                },
                                {}
                              )}`;
                            }
                          })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
                        }
                      })} <div class="flex w-full justify-end">${validate_component(Button, "Button").$$render(
                        $$result,
                        {
                          type: "submit",
                          class: "flex items-center gap-3"
                        },
                        {},
                        {
                          default: () => {
                            return `${escape($t("default.menu.share.cta"))} ${validate_component(PaperPlane, "PaperPlane").$$render($$result, {}, {}, {})}`;
                          }
                        }
                      )}</div></form>`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_t();
  $$unsubscribe_formData();
  $$unsubscribe_locale();
  $$unsubscribe_page();
  return $$rendered;
});
const { Object: Object_1 } = globals;
const css = {
  code: ".form-label{margin-bottom:0.5rem;margin-top:1rem;display:block;width:100%;padding-bottom:0.5rem;font-size:1.25rem;line-height:1.75rem;font-weight:700;line-height:1.25\n}.form-label:not([data-fs-error]):is(.dark *){--tw-text-opacity:1;color:hsl(var(--foreground) / var(--tw-text-opacity))\n}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentBackgroundColor;
  let $formData, $$unsubscribe_formData;
  let $user, $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  const data = defaults$1(zod(schemaStep5));
  let feelings = [];
  let needs = [];
  let checkJudgement;
  const steps = [
    zod(schemaStep1),
    zod(schemaStep2),
    zod(schemaStep3),
    zod(schemaStep4),
    zod(schemaStep5)
  ];
  let step = 1;
  let formSubmitted = false;
  let formSuccess = false;
  let checkForJudgement = false;
  let id;
  let createdRecord;
  const updateBackgroundColor = (step2) => {
    const color = `bg-${stepConstructor[step2 - 1].slug}-background`;
    backgroundColor.set(color);
    return color;
  };
  const speechBubbleContentArray = [
    {
      step: 1,
      content: [$t("default.page.fight.create.info")]
    },
    {
      step: 2,
      content: [$t("default.page.fight.create.observation")]
    },
    {
      step: 3,
      content: [$t("default.page.fight.create.feelings")]
    },
    {
      step: 4,
      content: [$t("default.page.fight.create.needs")]
    },
    {
      step: 5,
      content: [$t("default.page.fight.create.request")]
    },
    {
      step: 6,
      content: [$t("default.page.fight.create.success")],
      errorContent: [$t("default.page.fight.create.error")]
    }
  ];
  const handleSubmit = async () => {
    try {
      let data2 = $formData;
      data2.owner = $user.id;
      console.log("submit form", data2);
      const record = await pb.collection("fights").create(data2);
      id = record.id;
      createdRecord = record;
      formSuccess = true;
      formSubmitted = true;
    } catch (err) {
      console.log("error handling submit", err);
      formSuccess = false;
      formSubmitted = true;
    }
  };
  const checkValidation = async () => {
    const validationResult = await validateForm(schemaStep5);
    if (!validationResult.valid) {
      errors.set(validationResult.errors);
      return false;
    }
    return true;
  };
  const form = superForm(data, {
    // SPA: true,
    resetForm: false,
    validators: zodClient(schemaStep5),
    async onSubmit({ validators, cancel }) {
      console.log("onSubmit");
      cancel();
      if (await checkValidation()) {
        if (step == steps.length) {
          handleSubmit();
          step++;
        } else
          step++;
      }
    },
    async onUpdated({ form: form2 }) {
      console.log("onUpdated");
      if (form2.valid)
        step = 1;
    }
  });
  const { form: formData, errors, message, enhance, validate, validateForm, options, updateForm } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  formData.subscribe((value) => {
    console.log("form was updated", value);
  });
  let stepConstructor = [
    {
      slug: "info",
      name: get_store_value(t)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "observation",
      name: get_store_value(t)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true,
      hidden: false
    },
    {
      slug: "feelings",
      name: get_store_value(t)("default.page.fights.form.general.steps.feelings"),
      icon: IconHeart,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "needs",
      name: get_store_value(t)("default.page.fights.form.general.steps.needs"),
      icon: IconSwirl,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "request",
      name: get_store_value(t)("default.page.fights.form.general.steps.request"),
      icon: IconSteps,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "success",
      name: get_store_value(t)("default.page.fights.form.general.steps.success"),
      icon: IconSteps,
      invertedTextColor: false,
      hidden: true
    }
  ];
  t.subscribe((value) => {
    const newSteps = stepConstructor.map((entry) => {
      const translation = value(`default.page.fights.form.general.steps.${entry.slug}`);
      entry.name = translation;
      return entry;
    });
    stepConstructor = [...newSteps];
  });
  const categoryIsVisible = (feeling, category) => {
    const feelingSlug = feeling.nameEN;
    const categorySlug = category.category;
    if (feelingSlug === categorySlug)
      return true;
    if (category.visible)
      return true;
    return false;
  };
  step = 3;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    options.validators = steps[step - 1];
    currentBackgroundColor = updateBackgroundColor(step);
    $$rendered = ` <div class="${"flex flex-grow flex-col justify-between transition duration-500 " + escape(currentBackgroundColor, true) + " dark:bg-background min-h-svh overflow-hidden"}">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container relative flex flex-grow flex-col pb-40"><form class="-mt-1 flex h-full flex-grow flex-col pb-[74px]">${!formSubmitted && !formSuccess ? `${validate_component(FormStepDisplay, "FormStepDisplay").$$render(
      $$result,
      {
        step,
        steps: stepConstructor,
        stepBackground: stepConstructor[step - 1].slug
      },
      {},
      {}
    )}` : ``} ${validate_component(Mascot, "Mascot").$$render(
      $$result,
      {
        speechBubbleContentArray,
        step,
        stepName: stepConstructor[step - 1].slug,
        formSuccess,
        checkJudgement
      },
      {
        checkJudgement: ($$value) => {
          checkJudgement = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${step === 1 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "name" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label " }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.name.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object_1.assign({}, attrs, { value: $formData.name }),
              {
                value: ($$value) => {
                  $formData.name = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })} ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "title" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label " }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.title.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object_1.assign({}, attrs, { value: $formData.title }),
              {
                value: ($$value) => {
                  $formData.title = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${step === 2 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "observation" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.observation.label"))}`;
              }
            })} ${validate_component(Textarea, "Textarea").$$render(
              $$result,
              Object_1.assign({}, attrs, { class: "min-h-60" }, { value: $formData.observation }),
              {
                value: ($$value) => {
                  $formData.observation = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${step === 3 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "feelings" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.feelings.label"))}`;
              }
            })} ${validate_component(Toggle_group, "ToggleGroup.Root").$$render(
              $$result,
              Object_1.assign({}, { type: "multiple" }, attrs, { class: "flex flex-col gap-4" }, { value: $formData.feelings }),
              {
                value: ($$value) => {
                  $formData.feelings = $$value;
                  $$settled = false;
                }
              },
              {
                default: () => {
                  return `${feelings.length > 0 ? `<div class="">${each(feelings, (positive) => {
                    return `<div class="${"text-" + escape(stepConstructor[step - 1].slug, true) + "-foreground mb-1 mt-3 flex items-center gap-3 text-xs"}">${escape(positive.category === "true" ? $t("default.page.fights.form.general.goodFeelings") : $t("default.page.fights.form.general.badFeelings"))} <div class="${"border-b border-" + escape(stepConstructor[step - 1].slug, true) + "-foreground mr-2 flex-grow border-opacity-20"}"></div></div> <div class="-mx-1 flex w-full flex-wrap justify-start transition-all">${each(positive.content, (category) => {
                      return `${each(category.content, (feeling) => {
                        return `<button type="button" class="${escape(
                          categoryIsVisible(feeling, category) || $formData.feelings.includes(feeling.id) ? "pointer-events-auto max-w-[300px] p-1 opacity-100" : "pointer-events-none m-0 max-w-0 p-0 opacity-0",
                          true
                        ) + " transition-all"}">${validate_component(Toggle_group_item, "ToggleGroup.Item").$$render(
                          $$result,
                          {
                            value: feeling.id,
                            class: (feeling.nameEN === category.category ? `bg-white/40 dark:bg-muted font-bold` : "border border-white/40 dark:border-white/20") + " py-0 text-black  shadow hover:text-black data-[state=on]:text-white dark:text-white data-[state=on]:bg-feelings-foreground dark:data-[state=on]:bg-feelings-foreground max-w-[300px]"
                          },
                          {},
                          {
                            default: () => {
                              return `${escape($locale === "de" ? feeling.nameDE : feeling.nameEN)} `;
                            }
                          }
                        )} </button>`;
                      })}`;
                    })} </div>`;
                  })}</div>` : ``}`;
                }
              }
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${step === 4 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "needs" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.needs.label"))}`;
              }
            })} ${validate_component(Toggle_group, "ToggleGroup.Root").$$render(
              $$result,
              Object_1.assign({}, { type: "multiple" }, attrs, { class: "" }, { value: $formData.needs }),
              {
                value: ($$value) => {
                  $formData.needs = $$value;
                  $$settled = false;
                }
              },
              {
                default: () => {
                  return `${needs.length > 0 ? `<div class="-m-1 flex w-full flex-wrap justify-start transition-all">${each(needs, (category) => {
                    return `${each(category.content, (need) => {
                      return `<button type="button" class="${escape(
                        categoryIsVisible(need, category) || $formData.needs.includes(need.id) ? "pointer-events-auto max-h-60 max-w-[1000px] p-1 opacity-100" : "pointer-events-none m-0 max-h-0 max-w-0 p-0 opacity-0",
                        true
                      ) + " transition-all"}">${validate_component(Toggle_group_item, "ToggleGroup.Item").$$render(
                        $$result,
                        {
                          value: need.id,
                          class: (need.nameEN === category.category ? `bg-white/40 dark:bg-muted font-bold` : "border border-white/40 dark:border-white/20") + " py-0 text-black  shadow hover:text-black data-[state=on]:text-white dark:text-white data-[state=on]:bg-needs-foreground dark:data-[state=on]:bg-needs-foreground max-w-[300px]"
                        },
                        {},
                        {
                          default: () => {
                            return `${escape($locale === "de" ? need.nameDE : need.nameEN)} `;
                          }
                        }
                      )} </button>`;
                    })}`;
                  })}</div>` : ``}`;
                }
              }
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${!formSubmitted ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "request" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.request.label"))}`;
              }
            })} ${validate_component(Textarea, "Textarea").$$render(
              $$result,
              Object_1.assign({}, attrs, { class: "min-h-60" }, { value: $formData.request }),
              {
                value: ($$value) => {
                  $formData.request = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${formSuccess ? `<div></div>` : `<div></div>`}`}`}`}`}`} ${!formSubmitted && !formSuccess ? `${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(FormStepper, "FormStepper").$$render(
          $$result,
          {
            step,
            checkForJudgement,
            primaryButtonClass: currentBackgroundColor,
            class: "flex-shrink-0"
          },
          {},
          {}
        )}`;
      }
    })}` : `${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Share, "Share").$$render($$result, { id, record: createdRecord }, {}, {})}`;
      }
    })}`}</form></div> </div>`;
  } while (!$$settled);
  $$unsubscribe_formData();
  $$unsubscribe_user();
  $$unsubscribe_t();
  $$unsubscribe_locale();
  return $$rendered;
});
export {
  Page as default
};
