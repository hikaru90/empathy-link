import { c as compute_rest_props, s as subscribe, g as get_store_value } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, s as spread, a as add_attribute, h as escape_object, v as validate_component, g as escape_attribute_value, e as escape, b as each } from "../../../../../chunks/ssr.js";
import { A as AppTopMenu } from "../../../../../chunks/AppTopMenu.js";
import { A as AppBottomMenu } from "../../../../../chunks/AppBottomMenu.js";
import { F as Form_field, C as Control, c as Form_label, I as Input, d as Form_field_errors } from "../../../../../chunks/input.js";
import "dequal";
import { o as omit, m as makeElement, d as createElHelpers, a as isHTMLElement, e as executeCallbacks, b as addMeltEventListener, k as kbd, r as noop, t as disabledAttr, c as cn } from "../../../../../chunks/create.js";
import { h as handleRovingFocus, g as arraysAreEqual, B as Button } from "../../../../../chunks/index4.js";
import { t as toWritableStores, o as overridable, a as createBitAttrs, r as removeUndefined, b as getOptionUpdater, d as createDispatcher } from "../../../../../chunks/dialog-close.js";
import { s as setContext, g as getContext, o as onDestroy, c as createEventDispatcher } from "../../../../../chunks/lifecycle.js";
import { w as writable, d as derived } from "../../../../../chunks/index2.js";
import "clsx";
import { d as defaults$1, t as toggleVariants } from "../../../../../chunks/FormStepDisplay.svelte_svelte_type_style_lang.js";
import "../../../../../chunks/client.js";
import "ts-deepmerge";
import { s as superForm } from "../../../../../chunks/formData.js";
import "../../../../../chunks/index.js";
import { b as backgroundColor } from "../../../../../chunks/page.js";
import { t, l as locale } from "../../../../../chunks/translations.js";
/* empty css                                                         */
import { C as Chevron_left } from "../../../../../chunks/chevron-left.js";
import { C as Close, A as Arrow_right, a as Chevron_up, b as Chevron_down, F as FormStepDisplay } from "../../../../../chunks/chevron-down.js";
import "memoize-weak";
import { a as zod, z as zodClient } from "../../../../../chunks/zod.js";
import { z } from "zod";
import { I as IconFolder, a as IconEye, b as IconHeart, c as IconSwirl, d as IconSteps } from "../../../../../chunks/icon-steps.js";
import { p as pb } from "../../../../../chunks/pocketbase.js";
import { b as backgroundImage } from "../../../../../chunks/SparklePill.js";
import { u as user } from "../../../../../chunks/auth.js";
import "../../../../../chunks/index6.js";
import "../../../../../chunks/index3.js";
import { p as page } from "../../../../../chunks/stores.js";
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title, c as Dialog_description } from "../../../../../chunks/index7.js";
import { a as toast } from "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
/* empty css                                                        */
import { C as Check } from "../../../../../chunks/check.js";
import { R as Rotate_ccw } from "../../../../../chunks/rotate-ccw.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { D as Drawer, a as Drawer_content, b as Drawer_header, c as Drawer_title } from "../../../../../chunks/drawer-title.js";
import { X } from "../../../../../chunks/x.js";
import { S as Send_horizontal } from "../../../../../chunks/send-horizontal.js";
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
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
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0) $$bindings.loop(loop);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0) $$bindings.orientation(orientation);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0) $$bindings.onValueChange(onValueChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
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
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $item({ value, disabled });
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_item();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Share_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "18", "cy": "5", "r": "3" }],
    ["circle", { "cx": "6", "cy": "12", "r": "3" }],
    ["circle", { "cx": "18", "cy": "19", "r": "3" }],
    [
      "line",
      {
        "x1": "8.59",
        "x2": "15.42",
        "y1": "13.51",
        "y2": "17.49"
      }
    ],
    [
      "line",
      {
        "x1": "15.41",
        "x2": "8.59",
        "y1": "6.51",
        "y2": "10.49"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "share-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Clipboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "8",
        "height": "4",
        "x": "8",
        "y": "2",
        "rx": "1",
        "ry": "1"
      }
    ],
    [
      "path",
      {
        "d": "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "clipboard" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Mail = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "16",
        "x": "2",
        "y": "4",
        "rx": "2"
      }
    ],
    [
      "path",
      {
        "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "mail" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Drawer_footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
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
const css$3 = {
  code: '.label.svelte-1isa4gk{box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);position:relative;height:1.75rem;width:1.75rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity, 1))}.label.svelte-1isa4gk:after{content:"";box-shadow:-4px -4px 8px 0 white;display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-1isa4gk{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.skeumorphic-button.svelte-1isa4gk{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}',
  map: `{"version":3,"file":"Share.svelte","sources":["Share.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { daysAgo } from \\"$scripts/helpers\\";\\nimport AppTopMenu from \\"$lib/components/AppTopMenu.svelte\\";\\nimport AppBottomMenu from \\"$lib/components/AppBottomMenu.svelte\\";\\nimport * as Form from \\"$lib/components/ui/form\\";\\nimport { Input } from \\"$lib/components/ui/input\\";\\nimport { defaults, superForm } from \\"sveltekit-superforms\\";\\nimport { t, locale } from \\"$lib/translations\\";\\nimport { zodClient, zod } from \\"sveltekit-superforms/adapters\\";\\nimport { pb } from \\"$scripts/pocketbase\\";\\nimport { onMount, onDestroy } from \\"svelte\\";\\nimport { Button } from \\"$lib/components/ui/button-op1/index.js\\";\\nimport { z } from \\"zod\\";\\nimport { get } from \\"svelte/store\\";\\nimport { page } from \\"$app/stores\\";\\nimport ChevronLeft from \\"lucide-svelte/icons/chevron-left\\";\\nimport Share2 from \\"lucide-svelte/icons/share-2\\";\\nimport X from \\"lucide-svelte/icons/x\\";\\nimport Clipboard from \\"lucide-svelte/icons/clipboard\\";\\nimport Mail from \\"lucide-svelte/icons/mail\\";\\nimport SendHorizontal from \\"lucide-svelte/icons/send-horizontal\\";\\nimport RotateCcw from \\"lucide-svelte/icons/rotate-ccw\\";\\nimport Check from \\"lucide-svelte/icons/check\\";\\nimport * as Drawer from \\"$lib/components/ui/drawer\\";\\nimport { copy } from \\"svelte-copy\\";\\nimport * as Dialog from \\"$lib/components/ui/dialog\\";\\nimport { toast } from \\"svelte-sonner\\";\\nimport { goto } from \\"$app/navigation\\";\\nexport let id;\\nexport let record;\\nlet initialized = false;\\nlet pending = true;\\nlet responses = [];\\nlet dialogOpen = false;\\nlet drawerOpen = false;\\nlet recipient = \\"\\";\\nlet confirmDeletion = false;\\n$: shareableLink = \`\${$page.url.origin}/app/fights/\${id}/respond\`;\\n$: daysAgoIntl = () => {\\n  if (!initialized) return \\"...\\";\\n  return daysAgo(record.created);\\n};\\nconst schema = z.object({\\n  email: z.string().email({ message: get(t)(\\"default.page.login.form.email.validEmailError\\") })\\n});\\nconst data = defaults(zod(schema));\\nconst checkSingleValidationStep = async (step) => {\\n  const validations = [schemaStep1, schemaStep2, schemaStep3, schemaStep4, lastStep];\\n  const constraints = Object.keys(zod(validations[step - 1]).constraints);\\n  let allFieldsValid = true;\\n  for (const constraint of constraints) {\\n    const res = await validate(constraint, { update: false });\\n    if (res) allFieldsValid = false;\\n  }\\n  if (!allFieldsValid) {\\n    return false;\\n  }\\n  return true;\\n};\\nconst checkValidation = async () => {\\n  const validationResult = await validateForm($formData, schema);\\n  if (!validationResult.valid) {\\n    errors.set(validationResult.errors);\\n    return false;\\n  }\\n  return true;\\n};\\nconst form = superForm(data, {\\n  // SPA: true,\\n  resetForm: false,\\n  validators: zodClient(schema),\\n  async onSubmit({ validators, cancel }) {\\n    console.log(\\"onSubmit\\");\\n    cancel();\\n    if (await checkValidation()) {\\n      sendLink();\\n    }\\n  }\\n  // async onUpdated({ form }) {\\n  // \\tconsole.log('onUpdated');\\n  // \\tif (form.valid) step = 1;\\n  // }\\n});\\nconst { form: formData, errors, enhance, validate, validateForm } = form;\\nconst deleteFight = async () => {\\n  try {\\n    await pb.collection(\\"fights\\").delete(id);\\n    confirmDeletion = false;\\n    goto(\\"/app/auth/login\\");\\n  } catch (err) {\\n    console.error(\\"error deleting fight\\");\\n  }\\n};\\nconst sendLink = () => {\\n  try {\\n    console.log(\\"send link record\\", record);\\n    const sendMailRes = fetch(\\"/api/mails/send\\", {\\n      method: \\"POST\\",\\n      headers: {\\n        \\"Content-Type\\": \\"application/json\\"\\n      },\\n      body: JSON.stringify({\\n        template: \\"sendLink\\",\\n        locale: $locale,\\n        to: $formData.email,\\n        owner: record.expand.owner.firstName,\\n        recipientName: record.name,\\n        link: shareableLink\\n      })\\n    });\\n    console.log(\\"sendMailRes\\", sendMailRes);\\n    dialogOpen = false;\\n    toast.success($t(\\"default.menu.share.mailLinkConfirmation\\"));\\n  } catch (err) {\\n    console.log(\\"error sending link per mail\\", err);\\n    toast.error($t(\\"default.menu.share.mailLinkError\\"));\\n  }\\n};\\nconst toggleResolution = async () => {\\n  try {\\n    await pb.collection(\\"fights\\").update(id, { resolved: !record.resolved });\\n  } catch (err) {\\n    console.error(\\"error resolving fight\\", err);\\n  }\\n};\\nonMount(async () => {\\n  initialized = true;\\n  pending = false;\\n  console.log(\\"record\\", record);\\n  console.log(\\"responses\\", responses);\\n});\\nonDestroy(() => {\\n  pb.collection(\\"responses\\").unsubscribe(\\"*\\");\\n});\\n<\/script>\\n\\n<div class=\\"relative flex h-auto w-full items-center justify-between\\">\\n\\t<a href=\\"/app/dashboard\\" class=\\"block\\">\\n\\t\\t<Button\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\tclass=\\"flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200\\"\\n\\t\\t>\\n\\t\\t\\t<ChevronLeft class=\\"h-4 w-4 rounded-full\\" />\\n\\t\\t</Button>\\n\\t</a>\\n\\n\\t<div class=\\"flex items-center\\">\\n\\t\\t{#if !record.resolved}\\n\\t\\t<Button\\n\\t\\t\\ton:click={toggleResolution}\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\tclass=\\"flex items-center gap-2 border-neutral-900 bg-green-700 text-sm text-zinc-200 hover:bg-green-800\\"\\n\\t\\t>\\n\\t\\t\\t{$t('default.page.fight.resolve')}\\n\\t\\t\\t<Check class=\\"-mr-2\\" />\\n\\t\\t</Button>\\n\\t\\t{:else}\\n\\t\\t<Button\\n\\t\\t\\ton:click={toggleResolution}\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\tclass=\\"flex items-center gap-2 border-neutral-900 bg-red-700 text-sm text-zinc-200 hover:bg-red-800\\"\\n\\t\\t>\\n\\t\\t\\t{$t('default.page.fight.unresolve')}\\n\\t\\t\\t<RotateCcw class=\\"-mr-2\\" />\\n\\t\\t</Button>\\n\\t\\t{/if}\\n\\t\\t<Button\\n\\t\\t\\ton:click={() => (drawerOpen = true)}\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\tclass=\\"flex items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200\\"\\n\\t\\t>\\n\\t\\t\\t{$t('default.menu.share.cta')}\\n\\t\\t\\t<Share2 class=\\"-mr-1\\" />\\n\\t\\t</Button>\\n\\t</div>\\n</div>\\n\\n<Drawer.Root bind:open={drawerOpen}>\\n\\t<Drawer.Content class=\\"\\">\\n\\t\\t<Drawer.Header class=\\"w-full border-b border-black/10\\">\\n\\t\\t\\t<div class=\\"flex items-center justify-between\\">\\n\\t\\t\\t\\t<Drawer.Title>{$t('default.menu.share.cta')}</Drawer.Title>\\n\\t\\t\\t\\t<!-- <Drawer.Description>This action cannot be undone.</Drawer.Description> -->\\n\\t\\t\\t\\t<Drawer.Close>\\n\\t\\t\\t\\t\\t<div class=\\"label bg-feelings-background\\">\\n\\t\\t\\t\\t\\t\\t<div class=\\"icon fill-feelings-foreground\\">\\n\\t\\t\\t\\t\\t\\t\\t<!-- {@html row.icon} -->\\n\\t\\t\\t\\t\\t\\t\\t<X class=\\"text-red-600\\" />\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</Drawer.Close>\\n\\t\\t\\t</div>\\n\\t\\t</Drawer.Header>\\n\\t\\t<Drawer.Footer class=\\"pb-10\\">\\n\\t\\t\\t<div class=\\"max-container flex flex-col gap-4\\">\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\tuse:copy={shareableLink}\\n\\t\\t\\t\\t\\ton:svelte-copy={() => {\\n\\t\\t\\t\\t\\t\\tdrawerOpen = false;\\n\\t\\t\\t\\t\\t\\ttoast.success($t('default.menu.share.copyLinkConfirmation'));\\n\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t\\tclass=\\"skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{$t('default.menu.share.copyLink')}\\n\\t\\t\\t\\t\\t<Clipboard />\\n\\t\\t\\t\\t</button>\\n\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\ton:click={() => ((drawerOpen = false), (dialogOpen = true))}\\n\\t\\t\\t\\t\\tclass=\\"skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm\\"\\n\\t\\t\\t\\t\\t>{$t('default.menu.share.mailLink')} <Mail /></button\\n\\t\\t\\t\\t>\\n\\t\\t\\t</div>\\n\\t\\t</Drawer.Footer>\\n\\t</Drawer.Content>\\n</Drawer.Root>\\n\\n<Dialog.Root bind:open={dialogOpen} preventScroll={false}>\\n\\t<Dialog.Content>\\n\\t\\t<Dialog.Header>\\n\\t\\t\\t<Dialog.Title class=\\"mb-10 max-w-[9em] leading-tight\\"\\n\\t\\t\\t\\t>{$t('default.menu.share.mailDialogText')}</Dialog.Title\\n\\t\\t\\t>\\n\\t\\t\\t<Dialog.Description>\\n\\t\\t\\t\\t<form\\n\\t\\t\\t\\t\\ton:submit|preventDefault\\n\\t\\t\\t\\t\\tuse:enhance\\n\\t\\t\\t\\t\\tclass=\\"-mt-1 flex h-full flex-grow flex-col items-start\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<Form.Field {form} name=\\"email\\" class=\\"w-full\\">\\n\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\n\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\">E-Mail</Form.Label>\\n\\t\\t\\t\\t\\t\\t\\t<Input\\n\\t\\t\\t\\t\\t\\t\\t\\t{...attrs}\\n\\t\\t\\t\\t\\t\\t\\t\\tbind:value={$formData.email}\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"text\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tplaceholder={$locale === 'en' ? 'E-Mail' : 'E-Mail Adresse'}\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"mb-4\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t</Form.Control>\\n\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\n\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\n\\t\\t\\t\\t\\t</Form.Field>\\n\\t\\t\\t\\t\\t<div class=\\"flex w-full justify-end\\">\\n\\t\\t\\t\\t\\t\\t<Button type=\\"submit\\" class=\\"flex items-center gap-3\\"\\n\\t\\t\\t\\t\\t\\t\\t>{$t('default.menu.share.cta')} <SendHorizontal /></Button\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</form>\\n\\t\\t\\t</Dialog.Description>\\n\\t\\t</Dialog.Header>\\n\\t</Dialog.Content>\\n</Dialog.Root>\\n\\n<style lang=\\"scss\\">.label {\\n  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);\\n  position: relative;\\n  height: 1.75rem;\\n  width: 1.75rem;\\n  flex-shrink: 0;\\n  border-radius: 9999px;\\n  border-width: 1px;\\n  --tw-border-opacity: 1;\\n  border-color: rgb(255 255 255 / var(--tw-border-opacity, 1));\\n}\\n\\n.label:after {\\n  content: \\"\\";\\n  box-shadow: -4px -4px 8px 0 white;\\n  display: block;\\n  height: 100%;\\n  width: 100%;\\n  border-radius: 9999px;\\n}\\n\\n.icon {\\n  position: absolute;\\n  left: 50%;\\n  top: 50%;\\n  height: 0.875rem;\\n  width: 0.875rem;\\n  --tw-translate-x: -50%;\\n  --tw-translate-y: -50%;\\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\\n}\\n\\n.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}</style>\\n"],"names":[],"mappings":"AA6PmB,qBAAO,CACxB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC5C,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,OAAO,CACd,WAAW,CAAE,CAAC,CACd,aAAa,CAAE,MAAM,CACrB,YAAY,CAAE,GAAG,CACjB,mBAAmB,CAAE,CAAC,CACtB,YAAY,CAAE,IAAI,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,mBAAmB,CAAC,EAAE,CAAC,CAC7D,CAEA,qBAAM,MAAO,CACX,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CACjC,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,MACjB,CAEA,oBAAM,CACJ,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,QAAQ,CAChB,KAAK,CAAE,QAAQ,CACf,gBAAgB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACtB,SAAS,CAAE,UAAU,IAAI,gBAAgB,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,OAAO,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAChM,CAEA,kCAAoB,CAClB,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C"}`
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
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.record === void 0 && $$bindings.record && record !== void 0) $$bindings.record(record);
  $$result.css.add(css$3);
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
          return `${validate_component(Chevron_left, "ChevronLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
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
          return `${escape($t("default.page.fight.unresolve"))} ${validate_component(Rotate_ccw, "RotateCcw").$$render($$result, { class: "-mr-2" }, {}, {})}`;
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
          return `${escape($t("default.menu.share.cta"))} ${validate_component(Share_2, "Share2").$$render($$result, { class: "-mr-1" }, {}, {})}`;
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
                      return `<div class="label bg-feelings-background svelte-1isa4gk"><div class="icon fill-feelings-foreground svelte-1isa4gk"> ${validate_component(X, "X").$$render($$result, { class: "text-red-600" }, {}, {})}</div></div>`;
                    }
                  })}</div>`;
                }
              })} ${validate_component(Drawer_footer, "Drawer.Footer").$$render($$result, { class: "pb-10" }, {}, {
                default: () => {
                  return `<div class="max-container flex flex-col gap-4"><button class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm svelte-1isa4gk">${escape($t("default.menu.share.copyLink"))} ${validate_component(Clipboard, "Clipboard").$$render($$result, {}, {}, {})}</button> <button class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm svelte-1isa4gk">${escape($t("default.menu.share.mailLink"))} ${validate_component(Mail, "Mail").$$render($$result, {}, {}, {})}</button></div>`;
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
                            return `${escape($t("default.menu.share.cta"))} ${validate_component(Send_horizontal, "SendHorizontal").$$render($$result, {}, {}, {})}`;
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
const Toggle_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "variant", "size", "value"]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size = "default" } = $$props;
  let { value = void 0 } = $$props;
  setToggleGroupCtx({ variant, size });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0) $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
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
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0) $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
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
const Textarea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value", "readonly"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { readonly = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0) $$bindings.readonly(readonly);
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
  code: ".group .light-button{transition:box-shadow 50ms, background-color 700ms}.group:active .light-button{box-shadow:0 0 0 rgba(255, 255, 255, 0.6), 0 0 0 rgba(0, 0, 0, 0.2)}",
  map: `{"version":3,"file":"FormStepper.svelte","sources":["FormStepper.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { Button } from \\"$lib/components/ui/button-op1/index.js\\";\\nimport { createEventDispatcher } from \\"svelte\\";\\nimport { t } from \\"$lib/translations\\";\\nimport ArrowRight from \\"lucide-svelte/icons/arrow-right\\";\\nimport ChevronLeft from \\"lucide-svelte/icons/chevron-left\\";\\nconst dispatch = createEventDispatcher();\\nexport let step;\\nexport let checkForJudgement;\\nlet className = void 0;\\nexport { className as class };\\nconst toPrev = () => {\\n  console.log(\\"toPrev\\");\\n  dispatch(\\"toPrev\\");\\n};\\nconst handleJudgementCheck = () => {\\n  dispatch(\\"validateObservation\\");\\n};\\n<\/script>\\n\\n<div class=\\"flex justify-between {className}\\">\\n\\t<div\\n\\t\\tclass=\\"{step > 1\\n\\t\\t\\t? 'max-w-60 opacity-100'\\n\\t\\t\\t: 'max-w-0 opacity-0'} group relative transform overflow-visible\\"\\n\\t>\\n\\t\\t<Button\\n\\t\\t\\ton:click={toPrev}\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\tclass=\\"flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200\\"\\n\\t\\t>\\n\\t\\t\\t<ChevronLeft class=\\"h-4 w-4 rounded-full\\" />\\n\\t\\t</Button>\\n\\t</div>\\n\\t{#if checkForJudgement}\\n\\t<Button on:click={handleJudgementCheck}\\n\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\twrapperClass=\\"w-full\\"\\n\\t\\tclass=\\"flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200\\"\\n\\t>\\n\\t\\t<!-- <Button\\n\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\tclass=\\"light-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-foreground dark:border-x dark:border-t dark:border-white/5\\"\\n\\t\\t> -->\\n\\t\\t{$t('default.page.fights.form.general.checkJudgement')}\\n\\t\\t<ArrowRight class=\\"h-3 w-3\\" />\\n\\t</Button>\\n\\t{:else}\\n\\t<Button\\n\\t\\ttype=\\"submit\\"\\n\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\twrapperClass=\\"w-full\\"\\n\\t\\tclass=\\"flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200\\"\\n\\t>\\n\\t\\t<!-- <Button\\n\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\tclass=\\"light-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-foreground dark:border-x dark:border-t dark:border-white/5\\"\\n\\t\\t> -->\\n\\t\\t{$t('default.page.fights.form.general.next')}\\n\\t\\t<ArrowRight class=\\"h-3 w-3\\" />\\n\\t</Button>\\n\\t{/if}\\n</div>\\n\\n<style lang=\\"scss\\">:global(.group .light-button) {\\n  transition: box-shadow 50ms, background-color 700ms;\\n}\\n\\n:global(.group:active .light-button) {\\n  box-shadow: 0 0 0 rgba(255, 255, 255, 0.6), 0 0 0 rgba(0, 0, 0, 0.2);\\n}</style>\\n"],"names":[],"mappings":"AA+D2B,oBAAsB,CAC/C,UAAU,CAAE,UAAU,CAAC,IAAI,CAAC,CAAC,gBAAgB,CAAC,KAChD,CAEQ,2BAA6B,CACnC,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CACrE"}`
};
const FormStepper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  createEventDispatcher();
  let { step } = $$props;
  let { checkForJudgement } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.step === void 0 && $$bindings.step && step !== void 0) $$bindings.step(step);
  if ($$props.checkForJudgement === void 0 && $$bindings.checkForJudgement && checkForJudgement !== void 0) $$bindings.checkForJudgement(checkForJudgement);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  $$result.css.add(css$2);
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
        return `${validate_component(Chevron_left, "ChevronLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
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
        return ` ${escape($t("default.page.fights.form.general.checkJudgement"))} ${validate_component(Arrow_right, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
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
        return ` ${escape($t("default.page.fights.form.general.next"))} ${validate_component(Arrow_right, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
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
const css$1 = {
  code: ".triangle.svelte-e8i9pn{clip-path:polygon(0 0, 100% 0, 100% 100%)}.mouth.svelte-e8i9pn{animation:svelte-e8i9pn-mouth 10s infinite}.lookaround.svelte-e8i9pn{animation:svelte-e8i9pn-lookaround 10s infinite}.chevron.svelte-e8i9pn{display:flex;width:1rem;height:1rem;align-items:center;justify-content:center;border-radius:0.25rem;--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}@keyframes svelte-e8i9pn-mouth{0%{transform:scaleY(0.4)}5%{transform:scaleY(1)}25%{transform:scaleY(0.4)}100%{transform:scaleY(1)}}@keyframes svelte-e8i9pn-lookaround{0%{transform:translate(0, 20%)}5%{transform:translate(-20%, 20%)}25%{transform:translate(40%, 20%)}30%{transform:translate(30%, 52%)}50%{transform:translate(30%, 52%)}55%{transform:translate(-30%, 44%)}85%{transform:translate(-30%, 44%)}100%{transform:translate(0, 20%)}}",
  map: '{"version":3,"file":"Mascot.svelte","sources":["Mascot.svelte"],"sourcesContent":["<script lang=\\"ts\\">import ChevronUp from \\"lucide-svelte/icons/chevron-up\\";\\nimport ChevronDown from \\"lucide-svelte/icons/chevron-down\\";\\nimport backgroundImage from \\"$assets/images/holo3.jpg\\";\\nimport { t, locale } from \\"$lib/translations\\";\\nimport { onMount, onDestroy } from \\"svelte\\";\\nexport let step;\\nexport let formSuccess;\\nexport let speechBubbleContentArray;\\nlet speechBubbleIndex = 0;\\nlet thinking = false;\\nconst getSpeechBubbleContent = (formSuccess2, step2) => {\\n  try {\\n    return step2 === 13 && !formSuccess2 ? speechBubbleContentArray.find((el) => el.step === 13).errorContent : speechBubbleContentArray.find((el) => el.step === step2).content;\\n  } catch (err) {\\n    console.error(\\"error in getSpeechBubbleContent\\", err);\\n    return [];\\n  }\\n};\\n$: speechBubbleContent = getSpeechBubbleContent(formSuccess, step);\\nlet speechBubbleElement;\\nlet typingTimeoutId;\\n$: step, speechBubbleIndex = 0;\\n$: {\\n  if (speechBubbleElement) {\\n    console.log(\\"inside if speechBubbleElement\\");\\n    typeText(speechBubbleElement, speechBubbleContent[speechBubbleIndex], 30);\\n  }\\n}\\nconst typeText = (element, text, speed) => {\\n  try {\\n    let type = function() {\\n      if (index < text.length) {\\n        element.innerHTML += text.charAt(index);\\n        index++;\\n        typingTimeoutId = setTimeout(type, speed);\\n      }\\n    };\\n    console.log(\\"typeText\\");\\n    let index = 0;\\n    element.innerHTML = \\"\\";\\n    const tempElement = document.createElement(\\"div\\");\\n    tempElement.style.visibility = \\"hidden\\";\\n    tempElement.style.position = \\"absolute\\";\\n    tempElement.style.width = `${element.clientWidth}px`;\\n    tempElement.style.color = \\"red\\";\\n    tempElement.style.whiteSpace = \\"pre-wrap\\";\\n    tempElement.innerText = text;\\n    element.appendChild(tempElement);\\n    const targetHeight = tempElement.clientHeight;\\n    element.style.height = `${targetHeight}px`;\\n    element.removeChild(tempElement);\\n    if (typingTimeoutId) {\\n      clearTimeout(typingTimeoutId);\\n    }\\n    type();\\n  } catch (err) {\\n    console.error(\\"error typing text\\", err);\\n  }\\n};\\nconst addSpeechBubbleText = (text = \\"Hi\\") => {\\n  speechBubbleContent = [speechBubbleContent[0], text];\\n  speechBubbleIndex = 1;\\n};\\nexport const checkJudgement = async (judgement) => {\\n  thinking = true;\\n  try {\\n    const judgementRes = await fetch(\\"/api/ai/checkForJudgement\\", {\\n      method: \\"POST\\",\\n      headers: {\\n        \\"Content-Type\\": \\"application/json\\"\\n      },\\n      body: JSON.stringify({\\n        text: judgement,\\n        lang: $locale\\n      })\\n    });\\n    const res = await judgementRes.json();\\n    thinking = false;\\n    const answer = res.result;\\n    addSpeechBubbleText(answer);\\n  } catch (err) {\\n    console.error(\\"error in getting judgement\\", err);\\n  }\\n};\\nconst decreaseIndex = () => {\\n  console.log(\\"decreaseIndex\\");\\n  if (speechBubbleIndex > 0) speechBubbleIndex--;\\n};\\nconst increaseIndex = () => {\\n  console.log(\\"increaseIndex\\");\\n  if (speechBubbleContent.length > 1 && speechBubbleIndex === 0) speechBubbleIndex++;\\n};\\nonDestroy(() => {\\n  if (typingTimeoutId) {\\n    clearTimeout(typingTimeoutId);\\n  }\\n});\\n<\/script>\\n\\n<div class=\\"mt-4 flex items-start gap-2\\">\\n\\t<div class=\\"relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1\\">\\n\\t\\t<div\\n\\t\\t\\tstyle=\\"background-image: url(\'{backgroundImage}\'); background-size: 300% 100%\\"\\n\\t\\t\\tclass=\\"animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700\\"\\n\\t\\t>\\n\\t\\t\\t<div data-name=\\"face\\" class=\\"lookaround face-3 flex flex-col gap-1\\">\\n\\t\\t\\t\\t<div data-name=\\"eyes\\" class=\\"eyes flex items-center justify-center gap-2\\">\\n\\t\\t\\t\\t\\t<div class=\\"h-2 w-2 rounded-full border-2 border-white bg-black shadow-md\\"></div>\\n\\t\\t\\t\\t\\t<div class=\\"h-2 w-2 rounded-full border-2 border-white bg-black shadow-md\\"></div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div data-name=\\"mouth\\" class=\\"mouth flex items-center justify-center\\">\\n\\t\\t\\t\\t\\t<div class=\\"h-1.5 w-2.5 rounded-b-full bg-black\\"></div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n\\t<div class=\\"flex flex-grow\\">\\n\\t\\t<div class=\\"triangle size-3 flex-shrink-0 bg-muted\\"></div>\\n\\t\\t<div\\n\\t\\t\\tclass=\\"rounded-tl-0 relative flex flex-grow rounded-b rounded-tr bg-muted px-2 pb-2 pt-1 text-sm leading-tight gap-2\\"\\n\\t\\t>\\n\\t\\t{#if thinking}\\n\\t\\t<div id=\\"speechBubble\\" class=\\"w-full\\">\\n\\t\\t\\t...\\n\\t\\t</div>\\n\\t\\t{:else}\\n\\t\\t\\t<div id=\\"speechBubble\\" bind:this={speechBubbleElement} class=\\"w-full\\"></div>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if speechBubbleContent.length > 1}\\n\\t\\t\\t<div class=\\"flex justify-end text-2xs\\">\\n\\t\\t\\t\\t<div class=\\"-mr-1 flex flex-col items-center gap-0.5\\">\\n\\t\\t\\t\\t\\t<button on:click={() => decreaseIndex()} class=\\"chevron\\">\\n\\t\\t\\t\\t\\t\\t<ChevronUp class=\\"size-2.5\\" />\\n\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t<!-- <div class=\\"flex size-4 flex-shrink-0 items-center justify-center py-1\\">\\n\\t\\t\\t\\t\\t\\t{speechBubbleIndex + 1}/{speechBubbleContent.length}\\n\\t\\t\\t\\t\\t</div> -->\\n\\t\\t\\t\\t\\t<button on:click={() => increaseIndex()} class=\\"chevron\\">\\n\\t\\t\\t\\t\\t\\t<ChevronDown class=\\"size-2.5\\" />\\n\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<!-- <button on:click={() => checkJudgement()}>Check Judgement</button> -->\\n\\n<!-- <button on:click={() => addSpeechBubbleText()}>Add Text</button> -->\\n\\n<style lang=\\"scss\\">.triangle {\\n  clip-path: polygon(0 0, 100% 0, 100% 100%);\\n}\\n\\n.mouth {\\n  animation: mouth 10s infinite;\\n}\\n\\n.lookaround {\\n  animation: lookaround 10s infinite;\\n}\\n\\n.chevron {\\n  display: flex;\\n  width: 1rem;\\n  height: 1rem;\\n  align-items: center;\\n  justify-content: center;\\n  border-radius: 0.25rem;\\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\\n}\\n\\n@keyframes mouth {\\n  0% {\\n    transform: scaleY(0.4);\\n  }\\n  5% {\\n    transform: scaleY(1);\\n  }\\n  25% {\\n    transform: scaleY(0.4);\\n  }\\n  100% {\\n    transform: scaleY(1);\\n  }\\n}\\n@keyframes lookaround {\\n  0% {\\n    transform: translate(0, 20%);\\n  }\\n  5% {\\n    transform: translate(-20%, 20%);\\n  }\\n  25% {\\n    transform: translate(40%, 20%);\\n  }\\n  30% {\\n    transform: translate(30%, 52%);\\n  }\\n  50% {\\n    transform: translate(30%, 52%);\\n  }\\n  55% {\\n    transform: translate(-30%, 44%);\\n  }\\n  85% {\\n    transform: translate(-30%, 44%);\\n  }\\n  100% {\\n    transform: translate(0, 20%);\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAuJmB,uBAAU,CAC3B,SAAS,CAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,CAC3C,CAEA,oBAAO,CACL,SAAS,CAAE,mBAAK,CAAC,GAAG,CAAC,QACvB,CAEA,yBAAY,CACV,SAAS,CAAE,wBAAU,CAAC,GAAG,CAAC,QAC5B,CAEA,sBAAS,CACP,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,OAAO,CACtB,WAAW,CAAE,6DAA6D,CAC1E,mBAAmB,CAAE,yEAAyE,CAC9F,UAAU,CAAE,IAAI,uBAAuB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,WAAW,CACxG,CAEA,WAAW,mBAAM,CACf,EAAG,CACD,SAAS,CAAE,OAAO,GAAG,CACvB,CACA,EAAG,CACD,SAAS,CAAE,OAAO,CAAC,CACrB,CACA,GAAI,CACF,SAAS,CAAE,OAAO,GAAG,CACvB,CACA,IAAK,CACH,SAAS,CAAE,OAAO,CAAC,CACrB,CACF,CACA,WAAW,wBAAW,CACpB,EAAG,CACD,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,GAAG,CAC7B,CACA,EAAG,CACD,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAChC,CACA,GAAI,CACF,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAC/B,CACA,GAAI,CACF,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAC/B,CACA,GAAI,CACF,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAC/B,CACA,GAAI,CACF,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAChC,CACA,GAAI,CACF,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAChC,CACA,IAAK,CACH,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,GAAG,CAC7B,CACF"}'
};
const Mascot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let speechBubbleContent;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  let { step } = $$props;
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
  if ($$props.step === void 0 && $$bindings.step && step !== void 0) $$bindings.step(step);
  if ($$props.formSuccess === void 0 && $$bindings.formSuccess && formSuccess !== void 0) $$bindings.formSuccess(formSuccess);
  if ($$props.speechBubbleContentArray === void 0 && $$bindings.speechBubbleContentArray && speechBubbleContentArray !== void 0) $$bindings.speechBubbleContentArray(speechBubbleContentArray);
  if ($$props.checkJudgement === void 0 && $$bindings.checkJudgement && checkJudgement !== void 0) $$bindings.checkJudgement(checkJudgement);
  $$result.css.add(css$1);
  speechBubbleContent = getSpeechBubbleContent(formSuccess, step);
  $$unsubscribe_locale();
  return `<div class="mt-4 flex items-start gap-2"><div class="relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1" data-svelte-h="svelte-ido9h0"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700"><div data-name="face" class="lookaround face-3 flex flex-col gap-1 svelte-e8i9pn"><div data-name="eyes" class="eyes flex items-center justify-center gap-2"><div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div> <div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div></div> <div data-name="mouth" class="mouth flex items-center justify-center svelte-e8i9pn"><div class="h-1.5 w-2.5 rounded-b-full bg-black"></div></div></div></div></div> <div class="flex flex-grow"><div class="triangle size-3 flex-shrink-0 bg-muted svelte-e8i9pn"></div> <div class="rounded-tl-0 relative flex flex-grow rounded-b rounded-tr bg-muted px-2 pb-2 pt-1 text-sm leading-tight gap-2">${thinking ? `<div id="speechBubble" class="w-full" data-svelte-h="svelte-534rav">...</div>` : `<div id="speechBubble" class="w-full"${add_attribute("this", speechBubbleElement, 0)}></div>`} ${speechBubbleContent.length > 1 ? `<div class="flex justify-end text-2xs"><div class="-mr-1 flex flex-col items-center gap-0.5"><button class="chevron svelte-e8i9pn">${validate_component(Chevron_up, "ChevronUp").$$render($$result, { class: "size-2.5" }, {}, {})}</button>  <button class="chevron svelte-e8i9pn">${validate_component(Chevron_down, "ChevronDown").$$render($$result, { class: "size-2.5" }, {}, {})}</button></div></div>` : ``}</div></div></div>  `;
});
const { Object: Object_1 } = globals;
const css = {
  code: ".form-label{margin-bottom:0.5rem;margin-top:1rem;display:block;width:100%;padding-bottom:0.5rem;font-size:1.25rem;line-height:1.75rem;font-weight:700;line-height:1.25\n}.form-label:not([data-fs-error]):is(.dark *){--tw-text-opacity:1;color:hsl(var(--foreground) / var(--tw-text-opacity, 1))\n}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import AppTopMenu from \\"$lib/components/AppTopMenu.svelte\\";\\nimport AppBottomMenu from \\"$lib/components/AppBottomMenu.svelte\\";\\nimport * as Form from \\"$lib/components/ui/form\\";\\nimport { Input } from \\"$lib/components/ui/input\\";\\nimport * as ToggleGroup from \\"$lib/components/ui/toggle-group\\";\\nimport { defaults, superForm } from \\"sveltekit-superforms\\";\\nimport FormStepper from \\"$lib/components/FormStepper.svelte\\";\\nimport FormStepDisplay from \\"$lib/components/FormStepDisplay.svelte\\";\\nimport { t, locale } from \\"$lib/translations\\";\\nimport { get } from \\"svelte/store\\";\\nimport { zodClient, zod } from \\"sveltekit-superforms/adapters\\";\\nimport {\\n  schemaStep1,\\n  schemaStep2,\\n  schemaStep3,\\n  schemaStep4,\\n  schemaStep5 as lastStep\\n} from \\"./schema\\";\\nimport IconFolder from \\"$assets/icons/icon-folder.svg?raw\\";\\nimport IconEye from \\"$assets/icons/icon-eye.svg?raw\\";\\nimport IconHeart from \\"$assets/icons/icon-heart.svg?raw\\";\\nimport IconSwirl from \\"$assets/icons/icon-swirl.svg?raw\\";\\nimport IconSteps from \\"$assets/icons/icon-steps.svg?raw\\";\\nimport { pb } from \\"$scripts/pocketbase\\";\\nimport { onMount } from \\"svelte\\";\\nimport { serializeNonPOJOs, groupBy } from \\"$scripts/helpers\\";\\nimport { Textarea } from \\"$lib/components/ui/textarea\\";\\nimport Mascot from \\"$lib/components/Mascot.svelte\\";\\nimport { user } from \\"$store/auth\\";\\nimport Share from \\"$lib/components/Share.svelte\\";\\nimport { backgroundColor } from \\"$store/page\\";\\nconst data = defaults(zod(lastStep));\\nlet feelings = [];\\nlet needs = [];\\nlet checkJudgement;\\nconst steps = [\\n  zod(schemaStep1),\\n  zod(schemaStep2),\\n  zod(schemaStep3),\\n  zod(schemaStep4),\\n  zod(lastStep)\\n];\\nlet step = 1;\\nlet formSubmitted = false;\\nlet formSuccess = false;\\nlet checkForJudgement = false;\\nlet id;\\nlet createdRecord;\\nconst updateBackgroundColor = (step2) => {\\n  const color = \`bg-\${stepConstructor[step2 - 1].slug}-background\`;\\n  backgroundColor.set(color);\\n  return color;\\n};\\n$: () => {\\n  if (step === 2) checkForJudgement = true;\\n};\\n$: options.validators = steps[step - 1];\\n$: currentBackgroundColor = updateBackgroundColor(step);\\nconst speechBubbleContentArray = [\\n  { step: 1, content: [$t(\\"default.page.fight.create.info\\")] },\\n  { step: 2, content: [$t(\\"default.page.fight.create.observation\\")] },\\n  { step: 3, content: [$t(\\"default.page.fight.create.feelings\\")] },\\n  { step: 4, content: [$t(\\"default.page.fight.create.needs\\")] },\\n  { step: 5, content: [$t(\\"default.page.fight.create.request\\")] },\\n  {\\n    step: 6,\\n    content: [$t(\\"default.page.fight.create.success\\")],\\n    errorContent: [$t(\\"default.page.fight.create.error\\")]\\n  }\\n];\\nconst handleSubmit = async () => {\\n  try {\\n    let data2 = $formData;\\n    data2.owner = $user.id;\\n    console.log(\\"submit form\\", data2);\\n    const record = await pb.collection(\\"fights\\").create(data2);\\n    id = record.id;\\n    createdRecord = record;\\n    formSuccess = true;\\n    formSubmitted = true;\\n  } catch (err) {\\n    console.log(\\"error handling submit\\", err);\\n    formSuccess = false;\\n    formSubmitted = true;\\n  }\\n};\\nconst checkSingleValidationStep = async (step2) => {\\n  const validations = [schemaStep1, schemaStep2, schemaStep3, schemaStep4, lastStep];\\n  const constraints = Object.keys(zod(validations[step2 - 1]).constraints);\\n  let allFieldsValid = true;\\n  for (const constraint of constraints) {\\n    const res = await validate(constraint, { update: false });\\n    if (res) allFieldsValid = false;\\n  }\\n  if (!allFieldsValid) {\\n    return false;\\n  }\\n  return true;\\n};\\nconst checkValidation = async () => {\\n  const validationResult = await validateForm(lastStep);\\n  if (!validationResult.valid) {\\n    errors.set(validationResult.errors);\\n    return false;\\n  }\\n  return true;\\n};\\nconst validateObservation = async () => {\\n  const validationResult = await validateForm(lastStep);\\n  const observationError = validationResult.errors.observation;\\n  if (observationError) {\\n    errors.set(validationResult.errors);\\n    return false;\\n  }\\n  disableJudgementCheck();\\n  return true;\\n};\\nconst disableJudgementCheck = () => {\\n  checkJudgement($formData.observation);\\n  checkForJudgement = false;\\n};\\nconst form = superForm(data, {\\n  // SPA: true,\\n  resetForm: false,\\n  validators: zodClient(lastStep),\\n  async onSubmit({ validators, cancel }) {\\n    console.log(\\"onSubmit\\");\\n    cancel();\\n    if (await checkValidation()) {\\n      if (step == steps.length) {\\n        handleSubmit();\\n        step++;\\n      } else step++;\\n    }\\n  },\\n  async onUpdated({ form: form2 }) {\\n    console.log(\\"onUpdated\\");\\n    if (form2.valid) step = 1;\\n  }\\n});\\nconst {\\n  form: formData,\\n  errors,\\n  message,\\n  enhance,\\n  validate,\\n  validateForm,\\n  options,\\n  updateForm\\n} = form;\\nformData.subscribe((value) => {\\n  console.log(\\"form was updated\\", value);\\n});\\nlet stepConstructor = [\\n  {\\n    slug: \\"info\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.info\\"),\\n    icon: IconFolder,\\n    invertedTextColor: false,\\n    hidden: false\\n  },\\n  {\\n    slug: \\"observation\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.observation\\"),\\n    icon: IconEye,\\n    invertedTextColor: true,\\n    hidden: false\\n  },\\n  {\\n    slug: \\"feelings\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.feelings\\"),\\n    icon: IconHeart,\\n    invertedTextColor: false,\\n    hidden: false\\n  },\\n  {\\n    slug: \\"needs\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.needs\\"),\\n    icon: IconSwirl,\\n    invertedTextColor: false,\\n    hidden: false\\n  },\\n  {\\n    slug: \\"request\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.request\\"),\\n    icon: IconSteps,\\n    invertedTextColor: false,\\n    hidden: false\\n  },\\n  {\\n    slug: \\"success\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.success\\"),\\n    icon: IconSteps,\\n    invertedTextColor: false,\\n    hidden: true\\n  }\\n];\\nt.subscribe((value) => {\\n  const newSteps = stepConstructor.map((entry) => {\\n    const translation = value(\`default.page.fights.form.general.steps.\${entry.slug}\`);\\n    entry.name = translation;\\n    return entry;\\n  });\\n  stepConstructor = [...newSteps];\\n});\\nconst decreaseStep = () => {\\n  console.log(\\"decreaseStep\\");\\n  if (step > 1) {\\n    console.log(\\"step\\", step);\\n    step = step - 1;\\n    console.log(\\"step\\", step);\\n  }\\n};\\nconst initFeelings = async () => {\\n  const records = await pb.collection(\\"feelings\\").getFullList({\\n    sort: \\"category,sort\\"\\n  });\\n  const data2 = serializeNonPOJOs(records);\\n  let res = groupBy(data2, \\"positive\\");\\n  res.map((entry) => {\\n    entry.content = groupBy(entry.content, \\"category\\");\\n    entry.content.map((category) => category.visible = false);\\n    return entry;\\n  });\\n  console.log(\\"feelings res\\", res);\\n  feelings = res;\\n};\\nconst initNeeds = async () => {\\n  const records = await pb.collection(\\"needs\\").getFullList({\\n    sort: \\"category\\"\\n  });\\n  const data2 = serializeNonPOJOs(records);\\n  let res = groupBy(data2, \\"category\\");\\n  res.map((category) => category.visible = false);\\n  console.log(\\"res\\", res);\\n  needs = res;\\n};\\nconst changeStep = async (payload) => {\\n  console.log(\\"changeStep\\");\\n  const newStep = payload.detail.step;\\n  const targetStepIsValid = await checkSingleValidationStep(newStep);\\n  console.log(\\"targetStepIsValid\\", targetStepIsValid);\\n  if (targetStepIsValid) {\\n    step = newStep;\\n  }\\n};\\nconst toggleNeedsCatgeory = (feeling, category) => {\\n  if (feeling.nameEN !== category) return;\\n  const target = needs.find((entry) => entry.category === category);\\n  if (target) target.visible = !target.visible;\\n  needs = [...needs];\\n};\\nconst toggleFeelingsCatgeory = (feeling, category) => {\\n  if (feeling.nameEN !== category) return;\\n  const target0 = feelings[0].content.find((entry) => entry.category === category);\\n  const target1 = feelings[1].content.find((entry) => entry.category === category);\\n  if (target0) target0.visible = !target0.visible;\\n  if (target1) target1.visible = !target1.visible;\\n  feelings = [...feelings];\\n};\\nconst categoryIsVisible = (feeling, category) => {\\n  const feelingSlug = feeling.nameEN;\\n  const categorySlug = category.category;\\n  if (feelingSlug === categorySlug) return true;\\n  if (category.visible) return true;\\n  return false;\\n};\\nonMount(async () => {\\n  await initFeelings();\\n  await initNeeds();\\n});\\nstep = 1;\\n<\/script>\\n\\n<!-- {#if $message}\\n\\t<div class=\\"status\\" class:error={$page.status >= 400} class:success={$page.status == 200}>\\n\\t\\t{$message}\\n\\t</div>\\n{/if} -->\\n\\n<div\\n\\tclass=\\"flex flex-grow flex-col justify-between transition duration-500 {currentBackgroundColor} dark:bg-background min-h-svh overflow-hidden\\"\\n>\\n\\t<AppTopMenu />\\n\\t<div class=\\"max-container relative flex flex-grow flex-col pb-40\\">\\n\\t\\t<form\\n\\t\\t\\ton:submit|preventDefault\\n\\t\\t\\tuse:enhance\\n\\t\\t\\tclass=\\"-mt-1 flex h-full flex-grow flex-col pb-[74px]\\"\\n\\t\\t>\\n\\t\\t\\t{#if !formSubmitted && !formSuccess}\\n\\t\\t\\t\\t<FormStepDisplay\\n\\t\\t\\t\\t\\ton:changeStep={changeStep}\\n\\t\\t\\t\\t\\t{step}\\n\\t\\t\\t\\t\\tsteps={stepConstructor}\\n\\t\\t\\t\\t\\tstepBackground={stepConstructor[step - 1].slug}\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t\\t<Mascot\\n\\t\\t\\t\\t\\t{speechBubbleContentArray}\\n\\t\\t\\t\\t\\t{step}\\n\\t\\t\\t\\t\\tbind:checkJudgement\\n\\t\\t\\t\\t\\tstepName={stepConstructor[step - 1].slug}\\n\\t\\t\\t\\t\\t{formSuccess}\\n\\t\\t\\t\\t/>\\n\\t\\t\\t\\t{#key step}\\n\\t\\t\\t\\t\\t{#if step === 1}\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"name\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label \\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.name.label')}</Form.Label\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Input {...attrs} bind:value={$formData.name} />\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"title\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label \\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.title.label')}</Form.Label\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Input {...attrs} bind:value={$formData.title} />\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{:else if step === 2}\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"observation\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.observation.label')}</Form.Label\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Textarea\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{...attrs}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:input={() => (checkForJudgement = true)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbind:value={$formData.observation}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"min-h-60\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{:else if step === 3}\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"feelings\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.feelings.label')}</Form.Label\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Root\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"multiple\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{...attrs}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbind:value={$formData.feelings}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex flex-col gap-4\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if feelings.length > 0}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each feelings as positive}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-{stepConstructor[step - 1]\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t.slug}-foreground mb-1 mt-3 flex items-center gap-3 text-xs\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{positive.category === 'true'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? $t('default.page.fights.form.general.goodFeelings')\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: $t('default.page.fights.form.general.badFeelings')}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"border-b border-{stepConstructor[step - 1]\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t.slug}-foreground mr-2 flex-grow border-opacity-20\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"-mx-1 flex w-full flex-wrap justify-start transition-all\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each positive.content as category}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each category.content as feeling}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={toggleFeelingsCatgeory(feeling, category.category)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{categoryIsVisible(feeling, category) ||\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t$formData.feelings.includes(feeling.id)\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'pointer-events-auto max-w-[300px] p-1 opacity-100'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'pointer-events-none m-0 max-w-0 p-0 opacity-0'} transition-all\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Item\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tvalue={feeling.id}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{feeling.nameEN === category.category\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? \`bg-white/40 dark:bg-muted font-bold\`\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'border border-white/40 dark:border-white/20'} py-0 text-black  shadow hover:text-black data-[state=on]:text-white dark:text-white data-[state=on]:bg-feelings-foreground dark:data-[state=on]:bg-feelings-foreground max-w-[300px]\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{$locale === 'de' ? feeling.nameDE : feeling.nameEN}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Item>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Root>\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{:else if step === 4}\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"needs\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.needs.label')}</Form.Label\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Root\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"multiple\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{...attrs}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbind:value={$formData.needs}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if needs.length > 0}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"-m-1 flex w-full flex-wrap justify-start transition-all\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each needs as category}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each category.content as need}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={toggleNeedsCatgeory(need, category.category)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{categoryIsVisible(need, category) ||\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t$formData.needs.includes(need.id)\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'pointer-events-auto max-h-60 max-w-[1000px] p-1 opacity-100'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'pointer-events-none m-0 max-h-0 max-w-0 p-0 opacity-0'} transition-all\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Item\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tvalue={need.id}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{need.nameEN === category.category\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? \`bg-white/40 dark:bg-muted font-bold\`\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'border border-white/40 dark:border-white/20'} py-0 text-black  shadow hover:text-black data-[state=on]:text-white dark:text-white data-[state=on]:bg-needs-foreground dark:data-[state=on]:bg-needs-foreground max-w-[300px]\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{$locale === 'de' ? need.nameDE : need.nameEN}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Item>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Root>\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{:else if !formSubmitted}\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"request\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.request.label')}</Form.Label\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Textarea {...attrs} bind:value={$formData.request} class=\\"min-h-60\\" />\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{:else if formSuccess}\\n\\t\\t\\t\\t\\t\\t<div></div>\\n\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t<div></div>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{/key}\\n\\n\\t\\t\\t\\t{#if !formSubmitted && !formSuccess}\\n\\t\\t\\t\\t\\t<AppBottomMenu>\\n\\t\\t\\t\\t\\t\\t<FormStepper\\n\\t\\t\\t\\t\\t\\t\\t{step}\\n\\t\\t\\t\\t\\t\\t\\t{checkForJudgement}\\n\\t\\t\\t\\t\\t\\t\\ton:validateObservation={validateObservation}\\n\\t\\t\\t\\t\\t\\t\\ton:disableJudgementCheck={disableJudgementCheck}\\n\\t\\t\\t\\t\\t\\t\\ton:toPrev={decreaseStep}\\n\\t\\t\\t\\t\\t\\t\\tprimaryButtonClass={currentBackgroundColor}\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"flex-shrink-0\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</AppBottomMenu>\\n\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t<AppBottomMenu>\\n\\t\\t\\t\\t\\t\\t<Share {id} record={createdRecord} />\\n\\t\\t\\t\\t\\t</AppBottomMenu>\\n\\t\\t\\t\\t{/if}\\n\\t\\t</form>\\n\\t</div>\\n</div>\\n\\n<style lang=\\"scss\\">/* .data-\\\\[state\\\\=on\\\\]\\\\:text-accent-foreground[data-state=on] */\\n:global(.form-label) {\\n    margin-bottom: 0.5rem;\\n    margin-top: 1rem;\\n    display: block;\\n    width: 100%;\\n    padding-bottom: 0.5rem;\\n    font-size: 1.25rem;\\n    line-height: 1.75rem;\\n    font-weight: 700;\\n    line-height: 1.25\\n}\\n:global(.form-label):not([data-fs-error]):is(.dark *) {\\n    --tw-text-opacity: 1;\\n    color: hsl(var(--foreground) / var(--tw-text-opacity, 1))\\n}</style>\\n"],"names":[],"mappings":"AA6eQ,WAAa,CACjB,aAAa,CAAE,MAAM,CACrB,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,IAAI,CACX,cAAc,CAAE,MAAM,CACtB,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,OAAO,CACpB,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE;AACjB,CACQ,WAAY,KAAK,CAAC,aAAa,CAAC,CAAC,IAAI,KAAK,CAAC,CAAC,CAAE,CAClD,iBAAiB,CAAE,CAAC,CACpB,KAAK,CAAE,IAAI,IAAI,YAAY,CAAC,CAAC,CAAC,CAAC,IAAI,iBAAiB,CAAC,EAAE,CAAC;AAC5D"}`
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
        } else step++;
      }
    },
    async onUpdated({ form: form2 }) {
      console.log("onUpdated");
      if (form2.valid) step = 1;
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
    if (feelingSlug === categorySlug) return true;
    if (category.visible) return true;
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
