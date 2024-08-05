import { c as compute_rest_props, s as subscribe, g as get_store_value } from "../../../../chunks/utils.js";
import { h as handleRovingFocus, e as arraysAreEqual, g as globals } from "../../../../chunks/Avatar.js";
import { c as create_ssr_component, s as spread, h as escape_object, a as add_attribute, v as validate_component, g as escape_attribute_value, e as escape, f as each } from "../../../../chunks/ssr.js";
import { A as AppTopMenu } from "../../../../chunks/AppTopMenu.js";
import { A as AppBottomMenu } from "../../../../chunks/AppBottomMenu.js";
import { F as Form_field, C as Control, a as Form_label, I as Input, b as Form_field_errors } from "../../../../chunks/index4.js";
import { t as toWritableStores, o as omit, b as overridable, m as makeElement, x as disabledAttr, a as isHTMLElement, e as executeCallbacks, d as addMeltEventListener, j as createElHelpers, y as noop, k as kbd, n as createBitAttrs, r as removeUndefined, p as getOptionUpdater, q as createDispatcher } from "../../../../chunks/Avatar.svelte_svelte_type_style_lang.js";
import { s as setContext, g as getContext } from "../../../../chunks/lifecycle.js";
import { d as derived, w as writable } from "../../../../chunks/index2.js";
import "clsx";
import { t as toggleVariants, F as FormStepDisplay, M as Mascot, a as FormStepper } from "../../../../chunks/Mascot.js";
import { c as cn } from "../../../../chunks/utils2.js";
import "../../../../chunks/client.js";
import { s as superForm } from "../../../../chunks/memoize.js";
import { d as defaults$1 } from "../../../../chunks/defaults.js";
import "../../../../chunks/index.js";
import { t, a as locale } from "../../../../chunks/translations.js";
import { a as zod, z as zodClient } from "../../../../chunks/zod.js";
import { z } from "zod";
import { I as IconFolder, a as IconEye, b as IconHeart, c as IconSwirl, d as IconSteps } from "../../../../chunks/icon-steps.js";
import { p as pb } from "../../../../chunks/pocketbase.js";
import { u as user } from "../../../../chunks/auth.js";
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
const schemaStep1 = z.object({
  name: z.string().min(3, { message: get_store_value(t)("default.page.fights.form.name.tooShortError") })
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
  request: z.string().min(10, { message: get_store_value(t)("default.page.fights.form.request.tooFewError") })
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
        class: escape_attribute_value(cn("flex min-h-[60px] w-full rounded-md border border-input bg-black/5 dark:bg-black/20 border-black/10 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      { readonly: readonly || null },
      escape_object($$restProps)
    ],
    {}
  )}>${escape(value || "")}</textarea>`;
});
const { Object: Object_1 } = globals;
const css = {
  code: ".form-label{margin-bottom:0.5rem;margin-top:1rem;display:block;width:100%;padding-bottom:0.5rem;font-size:1.25rem;line-height:1.75rem;font-weight:700;line-height:1.25\n}.form-label:not([data-fs-error]):is(.dark *){--tw-text-opacity:1;color:hsl(var(--foreground) / var(--tw-text-opacity))\n}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  const handleSubmit = async () => {
    try {
      let data2 = $formData;
      data2.owner = $user.id;
      console.log("submit form", data2);
      const record = await pb.collection("fights").create(data2);
      formSuccess = true;
      formSubmitted = true;
    } catch (err) {
      console.log("error handling submit", err);
      formSuccess = false;
      formSubmitted = true;
    }
  };
  const checkValidation = async () => {
    const validationResult = await validateForm($formData, schemaStep5);
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
        if (step == steps.length)
          handleSubmit();
        else
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
      invertedTextColor: false
    },
    {
      slug: "observation",
      name: get_store_value(t)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true
    },
    {
      slug: "feelings",
      name: get_store_value(t)("default.page.fights.form.general.steps.feelings"),
      icon: IconHeart,
      invertedTextColor: false
    },
    {
      slug: "needs",
      name: get_store_value(t)("default.page.fights.form.general.steps.needs"),
      icon: IconSwirl,
      invertedTextColor: false
    },
    {
      slug: "request",
      name: get_store_value(t)("default.page.fights.form.general.steps.request"),
      icon: IconSteps,
      invertedTextColor: false
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
  step = 1;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    options.validators = steps[step - 1];
    $$rendered = ` <div class="${"flex flex-grow flex-col justify-between transition duration-700 " + escape(`bg-${stepConstructor[step - 1].slug}-background`, true)}">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container relative flex flex-grow flex-col pb-40"><form class="-mt-1 flex h-full flex-grow flex-col pb-[74px]">${!formSubmitted && !formSuccess ? `${validate_component(FormStepDisplay, "FormStepDisplay").$$render(
      $$result,
      {
        step,
        steps: stepConstructor,
        stepBackground: stepConstructor[step - 1].slug
      },
      {},
      {}
    )}` : ``} <div class="relative z-0">${validate_component(Mascot, "Mascot").$$render(
      $$result,
      {
        step,
        stepName: stepConstructor[step - 1].slug
      },
      {},
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
                          categoryIsVisible(feeling, category) || $formData.feelings.includes(feeling.id) ? "pointer-events-auto max-w-[1000px] p-1 opacity-100" : "pointer-events-none m-0 max-w-0 p-0 opacity-0",
                          true
                        ) + " transition-all"}">${validate_component(Toggle_group_item, "ToggleGroup.Item").$$render(
                          $$result,
                          {
                            value: feeling.id,
                            class: (feeling.nameEN === category.category ? `bg-white/40 font-bold` : "border border-white/40") + " py-0 text-black  shadow hover:text-black data-[state=on]:bg-feelings-foreground data-[state=on]:text-white dark:text-white dark:hover:bg-black/20"
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
                          class: (need.nameEN === category.category ? `bg-white/40 font-bold` : "border border-white/40") + " py-0 text-black  shadow hover:text-black data-[state=on]:bg-needs-foreground data-[state=on]:text-white dark:text-white dark:hover:bg-black/20"
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
    })}</div>` : `${formSuccess ? `Success` : `Error in Submit`}`}`}`}`}`} ${!formSubmitted && !formSuccess ? `${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(FormStepper, "FormStepper").$$render(
          $$result,
          {
            step,
            primaryButtonClass: `bg-${stepConstructor[step - 1].slug}-background`,
            class: "flex-shrink-0"
          },
          {},
          {}
        )}`;
      }
    })}` : ``}</div></form></div> </div>`;
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
