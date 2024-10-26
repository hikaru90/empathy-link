import { f as compute_rest_props, e as subscribe, g as get_store_value } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, e as escape, b as each, v as validate_component, s as spread, d as escape_attribute_value, f as escape_object, a as add_attribute } from './ssr-C1fln0Kh.js';
import { tv } from 'tailwind-variants';
import './page-C8qygIqX.js';
import 'clsx';
import { c as createEventDispatcher, s as setContext, g as getContext, o as onDestroy } from './lifecycle-Dr9vL0LE.js';
import { e as effect$1, s as styleToString$1, a as executeCallbacks, h as handleEscapeKeydown, b as addEventListener, n as noop$1, u as useEscapeKeydown, c as useClickOutside, i as isBrowser$1, d as chain, f as noop, g as isFunction, j as isHTMLElement$1, k as addMeltEventListener, l as kbd } from './root.svelte_svelte_type_style_lang-Bt4Du0Yj.js';
import { d as derived, w as writable, a as readonly } from './index2-BL47qDlJ.js';
import { c as cn } from './utils2-CW1DFYkq.js';
import { r as is_void } from './switch-DiY35A-z.js';
import { n as nanoid, G as createFocusTrap$1 } from './index3-BHwnx4G9.js';
import { t as tick } from './scheduler-Be-hqvXf.js';

const ArrowRight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const ArrowRight$1 = ArrowRight;
const ChevronDown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const ChevronDown$1 = ChevronDown;
const ChevronUp = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const ChevronUp$1 = ChevronUp;
const Cross1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Cross1$1 = Cross1;
function defaults$1(data, adapter, options) {
  if (data && "superFormValidationLibrary" in data) {
    options = adapter;
    adapter = data;
    data = null;
  }
  const validator = adapter;
  const optionDefaults = options?.defaults ?? validator.defaults;
  return {
    id: options?.id ?? validator.id ?? "",
    valid: false,
    posted: false,
    errors: {},
    data: { ...optionDefaults, ...data },
    constraints: validator.constraints,
    shape: validator.shape
  };
}
const toggleVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  variants: {
    variant: {
      default: "bg-transparent",
      outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
    },
    size: {
      default: "h-9 px-3",
      sm: "h-8 px-2",
      lg: "h-10 px-3"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const css$1 = {
  code: ".skeumorphic-button.svelte-1oqfzpf{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow)}",
  map: null
};
const FormStepDisplay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { step } = $$props;
  let { steps } = $$props;
  let { stepBackground } = $$props;
  createEventDispatcher();
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.steps === void 0 && $$bindings.steps && steps !== void 0)
    $$bindings.steps(steps);
  if ($$props.stepBackground === void 0 && $$bindings.stepBackground && stepBackground !== void 0)
    $$bindings.stepBackground(stepBackground);
  $$result.css.add(css$1);
  return `<div class="${"sticky top-0 z-10 -mx-5 md:flex md:justify-center " + escape(`bg-${stepBackground}-background`, true) + " dark:bg-background transition duration-500 svelte-1oqfzpf"}"><div class="md:my-4"><div class="lcd-screen relative flex items-center gap-[4px] border border-black/10 bg-black/5 p-[2px] dark:bg-black/20 md:rounded"> ${each(steps, (entry, index) => {
    return `${!entry.hidden ? `<button type="button" class="${"group " + escape(`bg-${stepBackground}-background`, true) + " dark:bg-background flex-grow rounded-[2px] shadow transition duration-500 svelte-1oqfzpf"}"><div class="flex items-center justify-center overflow-hidden rounded-[2px] p-2 shadow-inner shadow-white/20 dark:shadow-white/10"><div class="${"skeumorphic-button " + escape(`bg-${entry.slug}-background text-${entry.slug}-foreground`, true) + " dark:bg-muted/40 rounded-full border-2 " + escape(`border-${stepBackground}-background`, true) + " dark:border-muted transition duration-500 svelte-1oqfzpf"}"><div class="${"flex items-center rounded-full border border-black/5 p-1 " + escape(step === index + 1 ? "px-2" : "", true) + " group-hover:bg-white/40 dark:group-hover:bg-white/10 transition duration-200"}"><div class="${"flex h-4 w-4 scale-110 items-center justify-center " + escape(`fill-${entry.slug}-foreground`, true) + " svelte-1oqfzpf"}"><!-- HTML_TAG_START -->${entry.icon}<!-- HTML_TAG_END --></div> <div class="${"max-h-0 max-w-0 scale-0 transform text-sm " + escape(
      step === index + 1 ? "opacity-1 ml-1 mr-1 max-h-4 max-w-[300px] scale-100 transition-all delay-200" : "max-w-0 scale-0 opacity-0",
      true
    )}"><span class="-mt-[2px] block">${escape(entry.name)}</span> </div></div> </div></div> </button>` : ``}`;
  })}</div></div> </div>`;
});
function last(array) {
  return array[array.length - 1];
}
function lightable(value) {
  function subscribe2(run) {
    run(value);
    return () => {
    };
  }
  return { subscribe: subscribe2 };
}
const hiddenAction = (obj) => {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => key !== "action");
    }
  });
};
const isFunctionWithParams = (fn) => {
  return typeof fn === "function";
};
function builder(name2, args) {
  const { stores, action, returned } = args ?? {};
  const derivedStore = (() => {
    if (stores && returned) {
      return derived(stores, (values) => {
        const result = returned(values);
        if (isFunctionWithParams(result)) {
          const fn = (...args2) => {
            return hiddenAction({
              ...result(...args2),
              [`data-melt-${name2}`]: "",
              action: action ?? noop$1
            });
          };
          fn.action = action ?? noop$1;
          return fn;
        }
        return hiddenAction({
          ...result,
          [`data-melt-${name2}`]: "",
          action: action ?? noop$1
        });
      });
    } else {
      const returnedFn = returned;
      const result = returnedFn?.();
      if (isFunctionWithParams(result)) {
        const resultFn = (...args2) => {
          return hiddenAction({
            ...result(...args2),
            [`data-melt-${name2}`]: "",
            action: action ?? noop$1
          });
        };
        resultFn.action = action ?? noop$1;
        return lightable(resultFn);
      }
      return lightable(hiddenAction({
        ...result,
        [`data-melt-${name2}`]: "",
        action: action ?? noop$1
      }));
    }
  })();
  const actionFn = action ?? (() => {
  });
  actionFn.subscribe = derivedStore.subscribe;
  return actionFn;
}
function createElHelpers(prefix) {
  const name2 = (part) => part ? `${prefix}-${part}` : prefix;
  const attribute = (part) => `data-melt-${prefix}${part ? `-${part}` : ""}`;
  const selector = (part) => `[data-melt-${prefix}${part ? `-${part}` : ""}]`;
  const getEl = (part) => document.querySelector(selector(part));
  return {
    name: name2,
    attribute,
    selector,
    getEl
  };
}
function omit$1(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
const overridable$1 = (store, onChange) => {
  const update = (updater, sideEffect) => {
    store.update((curr) => {
      const next = updater(curr);
      let res = next;
      if (onChange) {
        res = onChange({ curr, next });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set2 = (curr) => {
    update(() => curr);
  };
  return {
    ...store,
    update,
    set: set2
  };
};
function sleep$1(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateId() {
  return nanoid(10);
}
function generateIds(args) {
  return args.reduce((acc, curr) => {
    acc[curr] = generateId();
    return acc;
  }, {});
}
const isDom = () => typeof window !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
const pt = (v) => isDom() && v.test(getPlatform().toLowerCase());
const isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;
const isMac$1 = () => pt(/^mac/) && !isTouchDevice();
const isApple = () => pt(/mac|iphone|ipad|ipod/i);
const isIos = () => isApple() && !isMac$1();
const LOCK_CLASSNAME = "data-melt-scroll-lock";
function assignStyle(el, style) {
  if (!el)
    return;
  const previousStyle = el.style.cssText;
  Object.assign(el.style, style);
  return () => {
    el.style.cssText = previousStyle;
  };
}
function setCSSProperty$1(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function getPaddingProperty$1(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function removeScroll(_document) {
  const doc = _document ?? document;
  const win = doc.defaultView ?? window;
  const { documentElement, body } = doc;
  const locked = body.hasAttribute(LOCK_CLASSNAME);
  if (locked)
    return noop$1;
  body.setAttribute(LOCK_CLASSNAME, "");
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty$1(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty$1(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  const setStyle2 = () => assignStyle(body, {
    overflow: "hidden",
    [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
  });
  const setIOSStyle = () => {
    const { scrollX, scrollY, visualViewport: visualViewport2 } = win;
    const offsetLeft = visualViewport2?.offsetLeft ?? 0;
    const offsetTop = visualViewport2?.offsetTop ?? 0;
    const restoreStyle = assignStyle(body, {
      position: "fixed",
      overflow: "hidden",
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: "0",
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
    });
    return () => {
      restoreStyle?.();
      win.scrollTo(scrollX, scrollY);
    };
  };
  const cleanups = [setScrollbarWidthProperty(), isIos() ? setIOSStyle() : setStyle2()];
  return () => {
    cleanups.forEach((fn) => fn?.());
    body.removeAttribute(LOCK_CLASSNAME);
  };
}
function toWritableStores$1(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = writable(value);
  });
  return result;
}
function getPortalParent(node) {
  let parent = node.parentElement;
  while (isHTMLElement$1(parent) && !parent.hasAttribute("data-portal")) {
    parent = parent.parentElement;
  }
  return parent || "body";
}
function getPortalDestination(node, portalProp) {
  const portalParent = getPortalParent(node);
  if (portalProp !== void 0)
    return portalProp;
  if (portalParent === "body")
    return document.body;
  return null;
}
async function handleFocus(args) {
  const { prop, defaultEl } = args;
  await Promise.all([sleep$1(1), tick]);
  if (prop === void 0) {
    defaultEl?.focus();
    return;
  }
  const returned = isFunction(prop) ? prop(defaultEl) : prop;
  if (typeof returned === "string") {
    const el = document.querySelector(returned);
    if (!isHTMLElement$1(el))
      return;
    el.focus();
  } else if (isHTMLElement$1(returned)) {
    returned.focus();
  }
}
function createFocusTrap(config = {}) {
  let trap;
  const { immediate, ...focusTrapOptions } = config;
  const hasFocus = writable(false);
  const isPaused = writable(false);
  const activate = (opts) => trap?.activate(opts);
  const deactivate = (opts) => {
    trap?.deactivate(opts);
  };
  const pause = () => {
    if (trap) {
      trap.pause();
      isPaused.set(true);
    }
  };
  const unpause = () => {
    if (trap) {
      trap.unpause();
      isPaused.set(false);
    }
  };
  const useFocusTrap = (node) => {
    trap = createFocusTrap$1(node, {
      ...focusTrapOptions,
      onActivate() {
        hasFocus.set(true);
        config.onActivate?.();
      },
      onDeactivate() {
        hasFocus.set(false);
        config.onDeactivate?.();
      }
    });
    if (immediate) {
      activate();
    }
    return {
      destroy() {
        deactivate();
        trap = void 0;
      }
    };
  };
  return {
    useFocusTrap,
    hasFocus: readonly(hasFocus),
    isPaused: readonly(isPaused),
    activate,
    deactivate,
    pause,
    unpause
  };
}
const usePortal = (el, target = "body") => {
  let targetEl;
  if (!isHTMLElement$1(target) && typeof target !== "string") {
    return {
      destroy: noop$1
    };
  }
  async function update(newTarget) {
    target = newTarget;
    if (typeof target === "string") {
      targetEl = document.querySelector(target);
      if (targetEl === null) {
        await tick();
        targetEl = document.querySelector(target);
      }
      if (targetEl === null) {
        throw new Error(`No element found matching css selector: "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      targetEl = target;
    } else {
      throw new TypeError(`Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`);
    }
    el.dataset.portal = "";
    targetEl.appendChild(el);
    el.hidden = false;
  }
  function destroy() {
    el.remove();
  }
  update(target);
  return {
    update,
    destroy
  };
};
const { name } = createElHelpers("dialog");
const defaults = {
  preventScroll: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  role: "dialog",
  defaultOpen: false,
  portal: "body",
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const openDialogIds = writable([]);
const dialogIdParts = ["content", "title", "description"];
function createDialog(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores$1(omit$1(withDefaults, "ids"));
  const { preventScroll: preventScroll2, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const activeTrigger = writable(null);
  const ids = toWritableStores$1({
    ...generateIds(dialogIdParts),
    ...withDefaults.ids
  });
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable$1(openWritable, withDefaults?.onOpenChange);
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
    return $open || $forceVisible;
  });
  let unsubScroll = noop$1;
  function handleOpen(e) {
    const el = e.currentTarget;
    const triggerEl = e.currentTarget;
    if (!isHTMLElement$1(el) || !isHTMLElement$1(triggerEl))
      return;
    open.set(true);
    activeTrigger.set(triggerEl);
  }
  function handleClose() {
    open.set(false);
    handleFocus({
      prop: get_store_value(closeFocus),
      defaultEl: get_store_value(activeTrigger)
    });
  }
  effect$1([open], ([$open]) => {
    sleep$1(100).then(() => {
      if ($open) {
        openDialogIds.update((prev) => {
          prev.push(get_store_value(ids.content));
          return prev;
        });
      } else {
        openDialogIds.update((prev) => prev.filter((id) => id !== get_store_value(ids.content)));
      }
    });
  });
  const trigger = builder(name("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        type: "button"
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        handleOpen(e);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        handleOpen(e);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = builder(name("overlay"), {
    stores: [isVisible],
    returned: ([$isVisible]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString$1({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": true,
        "data-state": $isVisible ? "open" : "closed"
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop$1;
      if (get_store_value(closeOnEscape)) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      return {
        destroy() {
          unsubEscapeKeydown();
        }
      };
    }
  });
  const content = builder(name("content"), {
    stores: [isVisible, ids.content, ids.description, ids.title],
    returned: ([$isVisible, $contentId, $descriptionId, $titleId]) => {
      return {
        id: $contentId,
        role: get_store_value(role),
        "aria-describedby": $descriptionId,
        "aria-labelledby": $titleId,
        "aria-modal": $isVisible ? "true" : void 0,
        "data-state": $isVisible ? "open" : "closed",
        tabindex: -1,
        hidden: $isVisible ? void 0 : true,
        style: styleToString$1({
          display: $isVisible ? void 0 : "none"
        })
      };
    },
    action: (node) => {
      let activate = noop$1;
      let deactivate = noop$1;
      const destroy = executeCallbacks(effect$1([open], ([$open]) => {
        if (!$open)
          return;
        const focusTrap = createFocusTrap({
          immediate: false,
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: false,
          fallbackFocus: node
        });
        activate = focusTrap.activate;
        deactivate = focusTrap.deactivate;
        const ac = focusTrap.useFocusTrap(node);
        if (ac && ac.destroy) {
          return ac.destroy;
        } else {
          return focusTrap.deactivate;
        }
      }), effect$1([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
        return useClickOutside(node, {
          enabled: $open,
          handler: (e) => {
            get_store_value(onOutsideClick)?.(e);
            if (e.defaultPrevented)
              return;
            const $openDialogIds = get_store_value(openDialogIds);
            const isLast = last($openDialogIds) === get_store_value(ids.content);
            if ($closeOnOutsideClick && isLast) {
              handleClose();
            }
          }
        }).destroy;
      }), effect$1([closeOnEscape], ([$closeOnEscape]) => {
        if (!$closeOnEscape)
          return noop$1;
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          return escapeKeydown.destroy;
        }
        return noop$1;
      }), effect$1([isVisible], ([$isVisible]) => {
        tick().then(() => {
          if (!$isVisible) {
            deactivate();
          } else {
            activate();
          }
        });
      }));
      return {
        destroy: () => {
          unsubScroll();
          destroy();
        }
      };
    }
  });
  const portalled = builder(name("portalled"), {
    stores: portal,
    returned: ($portal) => ({
      "data-portal": $portal ? "" : void 0
    }),
    action: (node) => {
      const unsubPortal = effect$1([portal], ([$portal]) => {
        if (!$portal)
          return noop$1;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return noop$1;
        const portalAction = usePortal(node, portalDestination);
        if (portalAction && portalAction.destroy) {
          return portalAction.destroy;
        } else {
          return noop$1;
        }
      });
      return {
        destroy() {
          unsubPortal();
        }
      };
    }
  });
  const title = builder(name("title"), {
    stores: [ids.title],
    returned: ([$titleId]) => ({
      id: $titleId
    })
  });
  const description = builder(name("description"), {
    stores: [ids.description],
    returned: ([$descriptionId]) => ({
      id: $descriptionId
    })
  });
  const close = builder(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.SPACE && e.key !== kbd.ENTER)
          return;
        e.preventDefault();
        handleClose();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect$1([open, preventScroll2], ([$open, $preventScroll]) => {
    if (!isBrowser$1)
      return;
    if ($preventScroll && $open)
      unsubScroll = removeScroll();
    if ($open) {
      const contentEl = document.getElementById(get_store_value(ids.content));
      handleFocus({ prop: get_store_value(openFocus), defaultEl: contentEl });
    }
    return () => {
      if (!get_store_value(forceVisible)) {
        unsubScroll();
      }
    };
  });
  return {
    ids,
    elements: {
      content,
      trigger,
      title,
      description,
      overlay,
      close,
      portalled
    },
    states: {
      open
    },
    options
  };
}
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-${bit}-${part}`]: ""
    };
  });
  return (part) => attrs[part];
}
function createDispatcher() {
  const dispatch = createEventDispatcher();
  return (e) => {
    const { originalEvent } = e.detail;
    const { cancelable } = e;
    const type = originalEvent.type;
    const shouldContinue = dispatch(type, { originalEvent, currentTarget: originalEvent.currentTarget }, { cancelable });
    if (!shouldContinue) {
      e.preventDefault();
    }
  };
}
function removeUndefined$1(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
function getOptionUpdater$1(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
function getDialogData() {
  const NAME = "dialog";
  const PARTS = [
    "close",
    "content",
    "description",
    "overlay",
    "portal",
    "title",
    "trigger"
  ];
  return {
    NAME,
    PARTS
  };
}
function setCtx$1(props) {
  const { NAME, PARTS } = getDialogData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const dialog = {
    ...createDialog({ ...removeUndefined$1(props), role: "dialog", forceVisible: true }),
    getAttrs
  };
  setContext(NAME, dialog);
  return {
    ...dialog,
    updateOption: getOptionUpdater$1(dialog.options)
  };
}
function getCtx$1() {
  const { NAME } = getDialogData();
  return getContext(NAME);
}
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { preventScroll: preventScroll2 = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { closeFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { states: { open: localOpen }, updateOption, ids } = setCtx$1({
    closeOnEscape,
    preventScroll: preventScroll2,
    closeOnOutsideClick,
    portal,
    forceVisible: true,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const idValues = derived([ids.content, ids.description, ids.title], ([$contentId, $descriptionId, $titleId]) => ({
    content: $contentId,
    description: $descriptionId,
    title: $titleId
  }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll2 !== void 0)
    $$bindings.preventScroll(preventScroll2);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0)
    $$bindings.openFocus(openFocus);
  if ($$props.closeFocus === void 0 && $$bindings.closeFocus && closeFocus !== void 0)
    $$bindings.closeFocus(closeFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0)
    $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("preventScroll", preventScroll2);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("openFocus", openFocus);
  }
  {
    updateOption("closeFocus", closeFocus);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Dialog_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["level", "asChild", "id", "el"]);
  let $title, $$unsubscribe_title;
  let { level = "h2" } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { title }, ids, getAttrs } = getCtx$1();
  $$unsubscribe_title = subscribe(title, (value) => $title = value);
  const attrs = getAttrs("title");
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.title.set(id);
    }
  }
  builder2 = $title;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_title();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${((tag) => {
    return tag ? `<${level}${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({ builder: builder2 }) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(level)}`}`;
});
const Dialog_close = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $close, $$unsubscribe_close;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { close }, getAttrs } = getCtx$1();
  $$unsubscribe_close = subscribe(close, (value) => $close = value);
  createDispatcher();
  const attrs = getAttrs("close");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $close;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_close();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<button${spread([escape_object(builder2), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`}`;
});
const Dialog_portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $portalled, $$unsubscribe_portalled;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { portalled }, getAttrs } = getCtx$1();
  $$unsubscribe_portalled = subscribe(portalled, (value) => $portalled = value);
  const attrs = getAttrs("portal");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $portalled;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_portalled();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`}`;
});
const Dialog_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "el"
  ]);
  let $content, $$unsubscribe_content;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, ids, getAttrs } = getCtx$1();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.content.set(id);
    }
  }
  builder2 = $content;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_content();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Dialog_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  let $overlay, $$unsubscribe_overlay;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { overlay }, states: { open }, getAttrs } = getCtx$1();
  $$unsubscribe_overlay = subscribe(overlay, (value) => $overlay = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs("overlay");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $overlay;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_overlay();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${transition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${inTransition && outTransition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${inTransition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${outTransition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${$open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : ``}`}`}`}`}`}`;
});
function getOptionUpdater(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1]
};
const VELOCITY_THRESHOLD = 0.4;
function effect(stores, fn) {
  if (typeof document === "undefined") {
    return () => {
    };
  }
  const unsub = derivedWithUnsubscribe(stores, (stores2, onUnsubscribe) => {
    return {
      stores: stores2,
      onUnsubscribe
    };
  }).subscribe(({ stores: stores2, onUnsubscribe }) => {
    const returned = fn(stores2);
    if (returned) {
      onUnsubscribe(returned);
    }
  });
  safeOnDestroy(unsub);
  return unsub;
}
function derivedWithUnsubscribe(stores, fn) {
  let unsubscribers = [];
  const onUnsubscribe = (cb) => {
    unsubscribers.push(cb);
  };
  const unsubscribe = () => {
    unsubscribers.forEach((fn2) => fn2());
    unsubscribers = [];
  };
  const derivedStore = derived(stores, ($storeValues) => {
    unsubscribe();
    return fn($storeValues, onUnsubscribe);
  });
  safeOnDestroy(unsubscribe);
  const subscribe2 = (...args) => {
    const unsub = derivedStore.subscribe(...args);
    return () => {
      unsub();
      unsubscribe();
    };
  };
  return {
    ...derivedStore,
    subscribe: subscribe2
  };
}
const safeOnDestroy = (fn) => {
  try {
    onDestroy(fn);
  } catch {
    return fn();
  }
};
const overridable = (store, onChange) => {
  const update = (updater, sideEffect) => {
    store.update((curr) => {
      const next = updater(curr);
      let res = next;
      if (onChange) {
        res = onChange({ curr, next });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set2 = (curr) => {
    update(() => curr);
  };
  return {
    ...store,
    update,
    set: set2
  };
};
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = writable(value);
  });
  return result;
}
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function removeUndefined(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
const cache = /* @__PURE__ */ new WeakMap();
function set(el, styles, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement) || !styles)
    return;
  const originalStyles = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }
    originalStyles[key] = el.style[key];
    el.style[key] = value;
  });
  if (ignoreCache)
    return;
  cache.set(el, originalStyles);
}
function reset(el, prop) {
  if (!el || !(el instanceof HTMLElement))
    return;
  const originalStyles = cache.get(el);
  if (!originalStyles) {
    return;
  }
  if (prop) {
    el.style[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      el.style[key] = value;
    });
  }
}
function getTranslate(element, direction) {
  const style = window.getComputedStyle(element);
  const transform = (
    // @ts-expect-error - vendor prefix
    style.transform || style.webkitTransform || style.mozTransform
  );
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
const nonTextInputTypes = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
const isBrowser = typeof document !== "undefined";
function isInput(target) {
  return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}
function isVertical(direction) {
  if (direction === "top" || direction === "bottom")
    return true;
  return false;
}
function isBottomOrRight(direction) {
  if (direction === "bottom" || direction === "right")
    return true;
  return false;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function handleSnapPoints({ activeSnapPoint, snapPoints, drawerRef, overlayRef, fadeFromIndex, openTime, direction }) {
  const isLastSnapPoint = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => {
    return $activeSnapPoint === $snapPoints?.[$snapPoints.length - 1];
  });
  const shouldFade = derived([snapPoints, fadeFromIndex, activeSnapPoint], ([$snapPoints, $fadeFromIndex, $activeSnapPoint]) => {
    return $snapPoints && $snapPoints.length > 0 && ($fadeFromIndex || $fadeFromIndex === 0) && !Number.isNaN($fadeFromIndex) && $snapPoints[$fadeFromIndex] === $activeSnapPoint || !$snapPoints;
  });
  const activeSnapPointIndex = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? null);
  const snapPointsOffset = derived(snapPoints, ($snapPoints) => {
    if ($snapPoints) {
      return $snapPoints.map((snapPoint) => {
        const hasWindow = typeof window !== "undefined";
        const isPx = typeof snapPoint === "string";
        let snapPointAsNumber = 0;
        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }
        const $direction = get_store_value(direction);
        if (isVertical($direction)) {
          const height = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerHeight : 0;
          if (hasWindow) {
            return $direction === "bottom" ? window.innerHeight - height : window.innerHeight + height;
          }
          return height;
        }
        const width = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerWidth : 0;
        if (hasWindow) {
          return $direction === "right" ? window.innerWidth - width : window.innerWidth + width;
        }
        return width;
      });
    }
    return [];
  });
  const activeSnapPointOffset = derived([snapPointsOffset, activeSnapPointIndex], ([$snapPointsOffset, $activeSnapPointIndex]) => $activeSnapPointIndex !== null ? $snapPointsOffset?.[$activeSnapPointIndex] : null);
  effect([activeSnapPoint, drawerRef], ([$activeSnapPoint, $drawerRef]) => {
    if ($activeSnapPoint && $drawerRef) {
      const $snapPoints = get_store_value(snapPoints);
      const $snapPointsOffset = get_store_value(snapPointsOffset);
      const newIndex = $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? -1;
      if ($snapPointsOffset && newIndex !== -1 && typeof $snapPointsOffset[newIndex] === "number") {
        snapToPoint($snapPointsOffset[newIndex]);
      }
    }
  });
  function snapToPoint(dimension) {
    tick().then(() => {
      const $snapPointsOffset = get_store_value(snapPointsOffset);
      const newSnapPointIndex = $snapPointsOffset?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;
      const $drawerRef = get_store_value(drawerRef);
      const $direction = get_store_value(direction);
      onSnapPointChange(newSnapPointIndex);
      set($drawerRef, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `translate3d(0, ${dimension}px, 0)` : `translate3d(${dimension}px, 0, 0)`
      });
      const $fadeFromIndex = get_store_value(fadeFromIndex);
      const $overlayRef = get_store_value(overlayRef);
      if (snapPointsOffset && newSnapPointIndex !== $snapPointsOffset.length - 1 && newSnapPointIndex !== $fadeFromIndex) {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "0"
        });
      } else {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "1"
        });
      }
      activeSnapPoint.update(() => {
        const $snapPoints = get_store_value(snapPoints);
        if (newSnapPointIndex === null || !$snapPoints)
          return null;
        return $snapPoints[newSnapPointIndex];
      });
    });
  }
  function onRelease({ draggedDistance, closeDrawer, velocity, dismissible }) {
    const $fadeFromIndex = get_store_value(fadeFromIndex);
    if ($fadeFromIndex === void 0)
      return;
    const $activeSnapPointOffset = get_store_value(activeSnapPointOffset);
    const $activeSnapPointIndex = get_store_value(activeSnapPointIndex);
    const $overlayRef = get_store_value(overlayRef);
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    const $snapPoints = get_store_value(snapPoints);
    const $direction = get_store_value(direction);
    const currentPosition = $direction === "bottom" || $direction === "right" ? ($activeSnapPointOffset ?? 0) - draggedDistance : ($activeSnapPointOffset ?? 0) + draggedDistance;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isFirst = $activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;
    if (isOverlaySnapPoint) {
      set($overlayRef, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
    if (velocity > 2 && !hasDraggedUp) {
      if (dismissible)
        closeDrawer();
      else
        snapToPoint($snapPointsOffset[0]);
      return;
    }
    if (velocity > 2 && hasDraggedUp && $snapPointsOffset && $snapPoints) {
      snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
      return;
    }
    const closestSnapPoint = $snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== "number" || typeof curr !== "number")
        return prev;
      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1;
      if (dragDirection > 0 && get_store_value(isLastSnapPoint) && $snapPoints) {
        snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
        return;
      }
      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }
      if ($activeSnapPointIndex === null)
        return;
      snapToPoint($snapPointsOffset[$activeSnapPointIndex + dragDirection]);
      return;
    }
    snapToPoint(closestSnapPoint);
  }
  function onDrag({ draggedDistance }) {
    const $drawerRef = get_store_value(drawerRef);
    const $activeSnapPointOffset = get_store_value(activeSnapPointOffset);
    if ($activeSnapPointOffset === null)
      return;
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    const $direction = get_store_value(direction);
    const newValue = $direction === "bottom" || $direction === "right" ? $activeSnapPointOffset - draggedDistance : $activeSnapPointOffset + draggedDistance;
    const lastSnapPoint = $snapPointsOffset[$snapPointsOffset.length - 1];
    if (isBottomOrRight($direction) && newValue < lastSnapPoint) {
      return;
    }
    if (!isBottomOrRight($direction) && newValue > lastSnapPoint) {
      return;
    }
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${newValue}px, 0)` : `translate3d(${newValue}px, 0, 0)`
    });
  }
  function getPercentageDragged(absDraggedDistance, isDraggingDown) {
    const $activeSnapPointIndex = get_store_value(activeSnapPointIndex);
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    const $snapPoints = get_store_value(snapPoints);
    const $fadeFromIndex = get_store_value(fadeFromIndex);
    if (!$snapPoints || typeof $activeSnapPointIndex !== "number" || !$snapPointsOffset || $fadeFromIndex === void 0)
      return null;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = $activeSnapPointIndex >= $fadeFromIndex;
    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }
    if (isOverlaySnapPoint && !isDraggingDown)
      return 1;
    if (!get_store_value(shouldFade) && !isOverlaySnapPoint)
      return null;
    const targetSnapPointIndex = isOverlaySnapPoint ? $activeSnapPointIndex + 1 : $activeSnapPointIndex - 1;
    const snapPointDistance = isOverlaySnapPoint ? $snapPointsOffset[targetSnapPointIndex] - $snapPointsOffset[targetSnapPointIndex - 1] : $snapPointsOffset[targetSnapPointIndex + 1] - $snapPointsOffset[targetSnapPointIndex];
    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);
    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }
  function onSnapPointChange(activeSnapPointIndex2) {
    const $snapPoints = get_store_value(snapPoints);
    const $snapPointsOffset = get_store_value(snapPointsOffset);
    if ($snapPoints && activeSnapPointIndex2 === $snapPointsOffset.length - 1) {
      openTime.set(/* @__PURE__ */ new Date());
    }
  }
  return {
    isLastSnapPoint,
    shouldFade,
    getPercentageDragged,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset
  };
}
function isMac() {
  return testPlatform(/^Mac/);
}
function isIPhone() {
  return testPlatform(/^iPhone/);
}
function isIPad() {
  return testPlatform(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator.platform) : void 0;
}
const visualViewport = typeof document !== "undefined" && window.visualViewport;
function isScrollable(node) {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
function getScrollParent(node) {
  if (isScrollable(node)) {
    node = node.parentElement;
  }
  while (node && !isScrollable(node)) {
    node = node.parentElement;
  }
  return node || document.scrollingElement || document.documentElement;
}
let preventScrollCount = 0;
let restore;
function preventScroll() {
  if (typeof document === "undefined")
    return () => {
    };
  preventScrollCount++;
  if (preventScrollCount === 1) {
    if (isIOS()) {
      restore = preventScrollMobileSafari();
    } else {
      restore = preventScrollStandard();
    }
  }
  return () => {
    preventScrollCount--;
    if (preventScrollCount === 0) {
      restore();
    }
  };
}
function getPaddingProperty(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function setCSSProperty(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function preventScrollStandard() {
  if (typeof document === "undefined")
    return () => {
    };
  const win = document.defaultView ?? window;
  const { documentElement, body } = document;
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  return chain(setScrollbarWidthProperty(), setStyle(body, paddingProperty, `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`), setStyle(body, "overflow", "hidden"));
}
function preventScrollMobileSafari() {
  let scrollable;
  let lastY = 0;
  const { documentElement, body, activeElement } = document;
  function onTouchStart(e) {
    scrollable = getScrollParent(e.target);
    if (scrollable === documentElement && scrollable === body)
      return;
    lastY = e.changedTouches[0].pageY;
  }
  function onTouchMove(e) {
    if (!scrollable || scrollable === documentElement || scrollable === body) {
      e.preventDefault();
      return;
    }
    const y = e.changedTouches[0].pageY;
    const scrollTop = scrollable.scrollTop;
    const bottom = scrollable.scrollHeight - scrollable.clientHeight;
    if (bottom === 0)
      return;
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) {
      e.preventDefault();
    }
    lastY = y;
  }
  function onTouchEnd(e) {
    const target = e.target;
    if (!(isInput(target) && target !== activeElement))
      return;
    e.preventDefault();
    target.style.transform = "translateY(-2000px)";
    target.focus();
    requestAnimationFrame(() => {
      target.style.transform = "";
    });
  }
  function onFocus(e) {
    const target = e.target;
    if (!isInput(target))
      return;
    target.style.transform = "translateY(-2000px)";
    requestAnimationFrame(() => {
      target.style.transform = "";
      if (visualViewport) {
        if (visualViewport.height < window.innerHeight) {
          requestAnimationFrame(() => {
            scrollIntoView(target);
          });
        } else {
          visualViewport.addEventListener("resize", () => scrollIntoView(target), { once: true });
        }
      }
    });
  }
  function onWindowScroll() {
    window.scrollTo(0, 0);
  }
  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;
  const restoreStyles = chain(
    setStyle(documentElement, "paddingRight", `${window.innerWidth - documentElement.clientWidth}px`),
    setStyle(documentElement, "overflow", "hidden")
    // setStyle(document.body, 'marginTop', `-${scrollY}px`),
  );
  window.scrollTo(0, 0);
  const removeEvents = chain(addEventListener(document, "touchstart", onTouchStart, { passive: false, capture: true }), addEventListener(document, "touchmove", onTouchMove, { passive: false, capture: true }), addEventListener(document, "touchend", onTouchEnd, { passive: false, capture: true }), addEventListener(document, "focus", onFocus, true), addEventListener(window, "scroll", onWindowScroll));
  return () => {
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}
function setStyle(element, style, value) {
  const cur = element.style[style];
  element.style[style] = value;
  return () => {
    element.style[style] = cur;
  };
}
function scrollIntoView(target) {
  const { documentElement, body, scrollingElement } = document;
  const root = scrollingElement || documentElement;
  while (target && target !== root) {
    const scrollable = getScrollParent(target);
    if (scrollable !== documentElement && scrollable !== body && scrollable !== target) {
      const scrollableTop = scrollable.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const targetBottom = target.getBoundingClientRect().bottom;
      const keyboardHeight = scrollable.getBoundingClientRect().bottom;
      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    target = scrollable.parentElement;
  }
}
let previousBodyPosition = null;
function handlePositionFixed({ isOpen, modal, nested, hasBeenOpened }) {
  const activeUrl = writable(typeof window !== "undefined" ? window.location.href : "");
  let scrollPos = 0;
  function setPositionFixed(open) {
    if (!(previousBodyPosition === null && open))
      return;
    previousBodyPosition = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      height: document.body.style.height
    };
    const { scrollX, innerHeight } = window;
    document.body.style.setProperty("position", "fixed", "important");
    document.body.style.top = `${-scrollPos}px`;
    document.body.style.left = `${-scrollX}px`;
    document.body.style.right = "0px";
    document.body.style.height = "auto";
    setTimeout(() => requestAnimationFrame(() => {
      const bottomBarHeight = innerHeight - window.innerHeight;
      if (bottomBarHeight && scrollPos >= innerHeight) {
        document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
      }
    }), 300);
  }
  function restorePositionSetting() {
    if (previousBodyPosition === null)
      return;
    const $activeUrl = get_store_value(activeUrl);
    const y = -parseInt(document.body.style.top, 10);
    const x = -parseInt(document.body.style.left, 10);
    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;
    document.body.style.height = previousBodyPosition.height;
    document.body.style.right = "unset";
    requestAnimationFrame(() => {
      if ($activeUrl !== window.location.href) {
        activeUrl.set(window.location.href);
        return;
      }
      window.scrollTo(x, y);
    });
    previousBodyPosition = null;
  }
  effect([isOpen, activeUrl], ([$isOpen, _]) => {
    if (typeof document === "undefined")
      return;
    if (get_store_value(nested) || !get_store_value(hasBeenOpened))
      return;
    if ($isOpen) {
      setPositionFixed($isOpen);
      if (!get_store_value(modal)) {
        setTimeout(() => {
          restorePositionSetting();
        }, 500);
      }
    } else {
      restorePositionSetting();
    }
  });
  return { restorePositionSetting };
}
const CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const BORDER_RADIUS = 8;
const NESTED_DISPLACEMENT = 16;
const WINDOW_TOP_OFFSET = 26;
const DRAG_CLASS = "vaul-dragging";
const openDrawerIds = writable([]);
const defaultProps = {
  closeThreshold: CLOSE_THRESHOLD,
  shouldScaleBackground: true,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
  onDrag: void 0,
  onRelease: void 0,
  snapPoints: void 0,
  fadeFromIndex: void 0,
  defaultActiveSnapPoint: void 0,
  onActiveSnapPointChange: void 0,
  defaultOpen: false,
  onOpenChange: void 0,
  fixed: void 0,
  dismissible: true,
  modal: true,
  nested: false,
  onClose: void 0,
  direction: "bottom"
};
const omittedOptions = [
  "defaultOpen",
  "onOpenChange",
  "defaultActiveSnapPoint",
  "onActiveSnapPointChange",
  "onDrag",
  "onRelease",
  "onClose"
];
function createVaul(props) {
  const { snapPoints: snapPointsProp, fadeFromIndex: fadeFromIndexProp = snapPointsProp && snapPointsProp.length - 1, ...withDefaults } = { ...defaultProps, ...removeUndefined(props) };
  const options = toWritableStores(omit({
    ...withDefaults,
    snapPoints: snapPointsProp,
    fadeFromIndex: fadeFromIndexProp
  }, ...omittedOptions));
  const triggerRef = writable(void 0);
  const { onDrag: onDragProp, onRelease: onReleaseProp, onClose, onOpenChange } = withDefaults;
  const { snapPoints, fadeFromIndex, fixed, dismissible, modal, nested, shouldScaleBackground, scrollLockTimeout, closeThreshold, direction } = options;
  const openStore = writable(withDefaults.defaultOpen);
  const isOpen = overridable(openStore, withDefaults.onOpenChange);
  const hasBeenOpened = writable(false);
  const visible = writable(false);
  const justReleased = writable(false);
  const overlayRef = writable(void 0);
  const openTime = writable(null);
  const keyboardIsOpen = writable(false);
  const drawerRef = writable(void 0);
  const drawerId = writable(void 0);
  let isDragging = false;
  let dragStartTime = null;
  let isClosing = false;
  let pointerStart = 0;
  let dragEndTime = null;
  let lastTimeDragPrevented = null;
  let isAllowedToDrag = false;
  let drawerHeightRef = get_store_value(drawerRef)?.getBoundingClientRect().height || 0;
  let previousDiffFromInitial = 0;
  let initialDrawerHeight = 0;
  let nestedOpenChangeTimer = null;
  const activeSnapPoint = overridable(writable(withDefaults.defaultActiveSnapPoint), withDefaults.onActiveSnapPointChange);
  const { activeSnapPointIndex, getPercentageDragged: getSnapPointsPercentageDragged, onDrag: onDragSnapPoints, onRelease: onReleaseSnapPoints, shouldFade, snapPointsOffset } = handleSnapPoints({
    snapPoints,
    activeSnapPoint,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    openTime,
    direction
  });
  const getContentStyle = derived([snapPointsOffset], ([$snapPointsOffset]) => {
    return (style = "") => {
      if ($snapPointsOffset && $snapPointsOffset.length > 0) {
        const styleProp = styleToString({
          "--snap-point-height": `${$snapPointsOffset[0]}px`
        });
        return style + styleProp;
      }
      return style;
    };
  });
  effect([drawerRef], ([$drawerRef]) => {
    if ($drawerRef) {
      drawerId.set($drawerRef.id);
    }
  });
  effect([isOpen], ([$open]) => {
    sleep(100).then(() => {
      const id = get_store_value(drawerId);
      if ($open && id) {
        openDrawerIds.update((prev) => {
          if (prev.includes(id)) {
            return prev;
          }
          prev.push(id);
          return prev;
        });
      } else {
        openDrawerIds.update((prev) => prev.filter((id2) => id2 !== id2));
      }
    });
  });
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen && get_store_value(shouldScaleBackground)) {
      const id = setTimeout(() => {
        reset(document.body, "background");
      }, 200);
      return () => clearTimeout(id);
    }
  });
  effect([isOpen], ([$isOpen]) => {
    let unsub = () => {
    };
    if ($isOpen) {
      unsub = preventScroll();
    }
    return unsub;
  });
  const { restorePositionSetting } = handlePositionFixed({ isOpen, modal, nested, hasBeenOpened });
  effect([drawerRef], ([$drawerRef]) => {
    let unsub = noop;
    if ($drawerRef) {
      unsub = handleEscapeKeydown($drawerRef, () => {
        closeDrawer(true);
      });
    }
    return () => {
      unsub();
    };
  });
  function openDrawer() {
    if (isClosing)
      return;
    hasBeenOpened.set(true);
    isOpen.set(true);
  }
  function onPress(event) {
    const $drawerRef = get_store_value(drawerRef);
    if (!get_store_value(dismissible) && !get_store_value(snapPoints))
      return;
    if ($drawerRef && !$drawerRef.contains(event.target))
      return;
    drawerHeightRef = $drawerRef?.getBoundingClientRect().height || 0;
    isDragging = true;
    dragStartTime = /* @__PURE__ */ new Date();
    if (isIOS()) {
      window.addEventListener("touchend", () => isAllowedToDrag = false, { once: true });
    }
    event.target.setPointerCapture(event.pointerId);
    pointerStart = isVertical(get_store_value(direction)) ? event.screenY : event.screenX;
  }
  function shouldDrag(el, isDraggingInDirection) {
    const $drawerRef = get_store_value(drawerRef);
    let element = el;
    const highlightedText = window.getSelection()?.toString();
    const $direction = get_store_value(direction);
    const swipeAmount = $drawerRef ? getTranslate($drawerRef, $direction) : null;
    const date = /* @__PURE__ */ new Date();
    if (element.hasAttribute("data-vaul-no-drag") || element.closest("[data-vaul-no-drag]")) {
      return false;
    }
    const $openTime = get_store_value(openTime);
    if ($openTime && date.getTime() - $openTime.getTime() < 500) {
      return false;
    }
    if (swipeAmount !== null) {
      if ($direction === "bottom" || $direction === "right" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }
    if (swipeAmount !== null && swipeAmount > 0) {
      return true;
    }
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }
    const $scrollLockTimeout = get_store_value(scrollLockTimeout);
    if (lastTimeDragPrevented && date.getTime() - lastTimeDragPrevented.getTime() < $scrollLockTimeout && swipeAmount === 0) {
      lastTimeDragPrevented = date;
      return false;
    }
    if (isDraggingInDirection) {
      lastTimeDragPrevented = date;
      return false;
    }
    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented = /* @__PURE__ */ new Date();
          return false;
        }
        if (element.getAttribute("role") === "dialog") {
          return true;
        }
      }
      element = element.parentNode;
    }
    return true;
  }
  function onDrag(event) {
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef || !isDragging)
      return;
    const $direction = get_store_value(direction);
    const directionMultiplier = getDirectionMultiplier($direction);
    const draggedDistance = getDistanceMoved(pointerStart, $direction, event) * directionMultiplier;
    const isDraggingInDirection = draggedDistance > 0;
    const $activeSnapPointIndex = get_store_value(activeSnapPointIndex);
    const $snapPoints = get_store_value(snapPoints);
    if ($snapPoints && $activeSnapPointIndex === 0 && !get_store_value(dismissible))
      return;
    if (!isAllowedToDrag && !shouldDrag(event.target, isDraggingInDirection)) {
      return;
    }
    $drawerRef.classList.add(DRAG_CLASS);
    isAllowedToDrag = true;
    set($drawerRef, {
      transition: "none"
    });
    const $overlayRef = get_store_value(overlayRef);
    set($overlayRef, {
      transition: "none"
    });
    if ($snapPoints) {
      onDragSnapPoints({ draggedDistance });
    }
    if (isDraggingInDirection && !$snapPoints) {
      const dampenedDraggedDistance = dampenValue(draggedDistance);
      const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
      return;
    }
    const absDraggedDistance = Math.abs(draggedDistance);
    let percentageDragged = absDraggedDistance / drawerHeightRef;
    const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingInDirection);
    if (snapPointPercentageDragged !== null) {
      percentageDragged = snapPointPercentageDragged;
    }
    const opacityValue = 1 - percentageDragged;
    const $fadeFromIndex = get_store_value(fadeFromIndex);
    const $shouldFade = get_store_value(shouldFade);
    if ($shouldFade || $fadeFromIndex && $activeSnapPointIndex === $fadeFromIndex - 1) {
      onDragProp?.(event, percentageDragged);
      set($overlayRef, {
        opacity: `${opacityValue}`,
        transition: "none"
      }, true);
    }
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (wrapper && $overlayRef && get_store_value(shouldScaleBackground)) {
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
      const borderRadiusValue = 8 - percentageDragged * 8;
      const translateValue = Math.max(0, 14 - percentageDragged * 14);
      set(wrapper, {
        borderRadius: `${borderRadiusValue}px`,
        transform: isVertical($direction) ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)` : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
        transition: "none"
      }, true);
    }
    if (!$snapPoints) {
      const translateValue = absDraggedDistance * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
    }
  }
  function scaleBackground(open, backgroundColor = "black") {
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (!wrapper || !get_store_value(shouldScaleBackground))
      return;
    const $direction = get_store_value(direction);
    if (open) {
      set(document.body, {
        background: document.body.style.backgroundColor || document.body.style.background
      });
      set(document.body, {
        background: backgroundColor
      }, true);
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    } else {
      reset(wrapper, "overflow");
      reset(wrapper, "transform");
      reset(wrapper, "borderRadius");
      set(wrapper, {
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
  }
  effect([activeSnapPointIndex, snapPoints, snapPointsOffset], ([$activeSnapPointIndex, $snapPoints, $snapPointsOffset]) => {
    function onVisualViewportChange() {
      const $drawerRef = get_store_value(drawerRef);
      if (!$drawerRef)
        return;
      const $keyboardIsOpen = get_store_value(keyboardIsOpen);
      const focusedElement = document.activeElement;
      if (isInput(focusedElement) || $keyboardIsOpen) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        let diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = $drawerRef.getBoundingClientRect().height || 0;
        if (!initialDrawerHeight) {
          initialDrawerHeight = drawerHeight;
        }
        const offsetFromTop = $drawerRef.getBoundingClientRect().top;
        if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) {
          keyboardIsOpen.set(!$keyboardIsOpen);
        }
        if ($snapPoints && $snapPoints.length > 0 && $snapPointsOffset && $activeSnapPointIndex) {
          const activeSnapPointHeight = $snapPointsOffset[$activeSnapPointIndex] || 0;
          diffFromInitial += activeSnapPointHeight;
        }
        previousDiffFromInitial = diffFromInitial;
        if (drawerHeight > visualViewportHeight || $keyboardIsOpen) {
          const height = $drawerRef.getBoundingClientRect().height;
          let newDrawerHeight = height;
          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
          }
          if (get_store_value(fixed)) {
            $drawerRef.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            $drawerRef.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else {
          $drawerRef.style.height = `${initialDrawerHeight}px`;
        }
        if ($snapPoints && $snapPoints.length > 0 && !$keyboardIsOpen) {
          $drawerRef.style.bottom = `0px`;
        } else {
          $drawerRef.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }
    let removeListener = noop;
    if (window.visualViewport) {
      removeListener = addEventListener(window.visualViewport, "resize", onVisualViewportChange);
    }
    return () => {
      removeListener();
    };
  });
  function closeDrawer(withKeyboard = false) {
    if (isClosing)
      return;
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef)
      return;
    const $direction = get_store_value(direction);
    onClose?.();
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${$direction === "bottom" ? "100%" : "-100%"}, 0)` : `translate3d(${$direction === "right" ? "100%" : "-100%"}, 0, 0)`,
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set(get_store_value(overlayRef), {
      opacity: "0",
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    scaleBackground(false);
    isClosing = true;
    setTimeout(() => {
      visible.set(false);
      isOpen.set(false);
      isClosing = false;
      if (withKeyboard) {
        get_store_value(triggerRef)?.focus();
      }
    }, 300);
    const $snapPoints = get_store_value(snapPoints);
    setTimeout(() => {
      reset(document.documentElement, "scrollBehavior");
      if ($snapPoints) {
        activeSnapPoint.set($snapPoints[0]);
      }
    }, TRANSITIONS.DURATION * 1e3);
  }
  effect([isOpen], ([$isOpen]) => {
    if ($isOpen) {
      hasBeenOpened.set(true);
    } else {
      closeDrawer();
    }
  });
  function resetDrawer() {
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef)
      return;
    const $overlayRef = get_store_value(overlayRef);
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    const $direction = get_store_value(direction);
    const currentSwipeAmount = getTranslate($drawerRef, $direction);
    set($drawerRef, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set($overlayRef, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      opacity: "1"
    });
    const $shouldScaleBackground = get_store_value(shouldScaleBackground);
    const $isOpen = get_store_value(isOpen);
    if ($shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && $isOpen) {
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      }, true);
    }
  }
  function onRelease(event) {
    const $drawerRef = get_store_value(drawerRef);
    if (!isDragging || !$drawerRef)
      return;
    if (isAllowedToDrag && isInput(event.target)) {
      event.target.blur();
    }
    $drawerRef.classList.remove(DRAG_CLASS);
    isAllowedToDrag = false;
    isDragging = false;
    dragEndTime = /* @__PURE__ */ new Date();
    const $direction = get_store_value(direction);
    const swipeAmount = getTranslate($drawerRef, $direction);
    if (event.target && !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return;
    if (dragStartTime === null)
      return;
    const timeTaken = dragEndTime.getTime() - dragStartTime.getTime();
    const distMoved = getDistanceMoved(pointerStart, $direction, event);
    const velocity = Math.abs(distMoved) / timeTaken;
    if (velocity > 0.05) {
      justReleased.set(true);
      setTimeout(() => {
        justReleased.set(false);
      }, 200);
    }
    if (get_store_value(snapPoints)) {
      onReleaseSnapPoints({
        draggedDistance: distMoved * getDirectionMultiplier($direction),
        closeDrawer,
        velocity,
        dismissible: get_store_value(dismissible)
      });
      onReleaseProp?.(event, true);
      return;
    }
    if ($direction === "bottom" || $direction === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      onReleaseProp?.(event, true);
      return;
    }
    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    const visibleDrawerHeight = Math.min(get_store_value(drawerRef)?.getBoundingClientRect().height ?? 0, window.innerHeight);
    if (swipeAmount >= visibleDrawerHeight * get_store_value(closeThreshold)) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    onReleaseProp?.(event, true);
    resetDrawer();
  }
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen)
      return;
    if (isBrowser) {
      set(document.documentElement, {
        scrollBehavior: "auto"
      });
    }
    openTime.set(/* @__PURE__ */ new Date());
    scaleBackground(true, props.backgroundColor);
  });
  effect([visible], ([$visible]) => {
    if (!$visible)
      return;
    const $drawerRef = get_store_value(drawerRef);
    if (!$drawerRef)
      return;
    const children = $drawerRef.querySelectorAll("*");
    children.forEach((child) => {
      const htmlChild = child;
      if (htmlChild.scrollHeight > htmlChild.clientHeight || htmlChild.scrollWidth > htmlChild.clientWidth) {
        htmlChild.classList.add("vaul-scrollable");
      }
    });
  });
  function onNestedOpenChange(o) {
    const $drawerRef = get_store_value(drawerRef);
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;
    if (nestedOpenChangeTimer) {
      window.clearTimeout(nestedOpenChangeTimer);
    }
    set($drawerRef, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: `scale(${scale}) translate3d(0, ${y}px, 0)`
    });
    if (!o && $drawerRef) {
      nestedOpenChangeTimer = setTimeout(() => {
        const $direction = get_store_value(direction);
        const translateValue = getTranslate($drawerRef, $direction);
        set($drawerRef, {
          transition: "none",
          transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        });
      }, 500);
    }
  }
  function onNestedDrag(_, percentageDragged) {
    if (percentageDragged < 0)
      return;
    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;
    const $direction = get_store_value(direction);
    set(get_store_value(drawerRef), {
      transform: isVertical($direction) ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)` : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: "none"
    });
  }
  function onNestedRelease(_, o) {
    const $direction = get_store_value(direction);
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    const scale = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
    const translate = o ? -NESTED_DISPLACEMENT : 0;
    if (o) {
      set(get_store_value(drawerRef), {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `scale(${scale}) translate3d(0, ${translate}px, 0)` : `scale(${scale}) translate3d(${translate}px, 0, 0)`
      });
    }
  }
  return {
    states: {
      isOpen,
      hasBeenOpened,
      snapPoints,
      activeSnapPoint,
      snapPointsOffset,
      keyboardIsOpen,
      shouldFade,
      visible,
      drawerId,
      openDrawerIds
    },
    helpers: {
      getContentStyle
    },
    methods: {
      closeDrawer,
      onOpenChange,
      onPress,
      onRelease,
      onDrag,
      scaleBackground,
      onNestedDrag,
      onNestedOpenChange,
      onNestedRelease,
      restorePositionSetting,
      openDrawer
    },
    refs: {
      drawerRef,
      overlayRef,
      triggerRef
    },
    options
  };
}
function dampenValue(v) {
  return 8 * (Math.log(v + 1) - 2);
}
function getScale() {
  return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
}
function getDistanceMoved(pointerStart, direction, event) {
  if (event.type.startsWith("touch")) {
    return getDistanceMovedForTouch(pointerStart, direction, event);
  } else {
    return getDistanceMovedForPointer(pointerStart, direction, event);
  }
}
function getDistanceMovedForPointer(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.screenY : event.screenX);
}
function getDistanceMovedForTouch(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.changedTouches[0].screenY : event.changedTouches[0].screenX);
}
function getDirectionMultiplier(direction) {
  return direction === "bottom" || direction === "right" ? 1 : -1;
}
const VAUL_ROOT = Symbol("VAUL_ROOT");
function setCtx(props = {}) {
  const vaul = createVaul(props);
  const updateOption = getOptionUpdater(vaul.options);
  setContext(VAUL_ROOT, { ...vaul, updateOption });
  return {
    ...vaul,
    updateOption
  };
}
function getCtx() {
  return getContext(VAUL_ROOT);
}
const css = {
  code: '[data-vaul-drawer]{touch-action:none;transition:transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)}[data-vaul-drawer][data-vaul-drawer-direction="bottom"]{transform:translate3d(0, 100%, 0)}[data-vaul-drawer][data-vaul-drawer-direction="top"]{transform:translate3d(0, -100%, 0)}[data-vaul-drawer][data-vaul-drawer-direction="left"]{transform:translate3d(-100%, 0, 0)}[data-vaul-drawer][data-vaul-drawer-direction="right"]{transform:translate3d(100%, 0, 0)}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="top"]{overflow-y:hidden !important}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="bottom"]{overflow-y:hidden !important}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="left"]{overflow-x:hidden !important}.vaul-dragging .vaul-scrollable [data-vaul-drawer-direction="right"]{overflow-x:hidden !important}[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="top"]{transform:translate3d(0, var(--snap-point-height, 0), 0)}\n			[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="bottom"]\n		{transform:translate3d(0, var(--snap-point-height, 0), 0)}[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="left"]{transform:translate3d(var(--snap-point-height, 0), 0, 0)}[data-vaul-drawer][data-vaul-drawer-visible="true"][data-vaul-drawer-direction="right"]{transform:translate3d(var(--snap-point-height, 0), 0, 0)}[data-vaul-overlay]{opacity:0;transition:opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)}[data-vaul-overlay][data-vaul-drawer-visible="true"]{opacity:1}[data-vaul-drawer]::after{content:"";position:absolute;background:inherit;background-color:inherit}[data-vaul-drawer][data-vaul-drawer-direction="top"]::after{top:initial;bottom:100%;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction="bottom"]::after{top:100%;bottom:initial;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction="left"]::after{left:initial;right:100%;top:0;bottom:0;width:200%}[data-vaul-drawer][data-vaul-drawer-direction="right"]::after{left:100%;right:initial;top:0;bottom:0;width:200%}\n			[data-vaul-overlay][data-vaul-snap-points="true"]:not(\n					[data-vaul-snap-points-overlay="true"]\n				):not([data-state="closed"])\n		{opacity:0}\n			[data-vaul-overlay][data-vaul-snap-points-overlay="true"]:not(\n					[data-vaul-drawer-visible="false"]\n				)\n		{opacity:1}@keyframes fake-animation{from{}to{}}@media(hover: hover) and (pointer: fine){[data-vaul-drawer]{-webkit-user-select:none;-moz-user-select:none;user-select:none}}',
  map: null
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "open",
    "onOpenChange",
    "closeThreshold",
    "scrollLockTimeout",
    "snapPoints",
    "fadeFromIndex",
    "openFocus",
    "onOutsideClick",
    "closeOnOutsideClick",
    "backgroundColor",
    "nested",
    "shouldScaleBackground",
    "activeSnapPoint",
    "onActiveSnapPointChange",
    "onRelease",
    "onDrag",
    "onClose",
    "dismissible",
    "direction"
  ]);
  let $isOpen, $$unsubscribe_isOpen;
  let $keyboardIsOpen, $$unsubscribe_keyboardIsOpen;
  let $localDismissible, $$unsubscribe_localDismissible;
  let { open = false } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { closeThreshold = void 0 } = $$props;
  let { scrollLockTimeout = void 0 } = $$props;
  let { snapPoints = void 0 } = $$props;
  let { fadeFromIndex = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  let { closeOnOutsideClick = true } = $$props;
  let { backgroundColor = "black" } = $$props;
  let { nested = false } = $$props;
  let { shouldScaleBackground = false } = $$props;
  let { activeSnapPoint = void 0 } = $$props;
  let { onActiveSnapPointChange = void 0 } = $$props;
  let { onRelease = void 0 } = $$props;
  let { onDrag = void 0 } = $$props;
  let { onClose = void 0 } = $$props;
  let { dismissible = void 0 } = $$props;
  let { direction = "bottom" } = $$props;
  const { states: { keyboardIsOpen, activeSnapPoint: localActiveSnapPoint, drawerId, openDrawerIds: openDrawerIds2, isOpen }, methods: { closeDrawer, openDrawer }, options: { dismissible: localDismissible }, updateOption } = setCtx({
    defaultOpen: open,
    defaultActiveSnapPoint: activeSnapPoint,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    },
    onActiveSnapPointChange: ({ next }) => {
      if (next === void 0 && snapPoints && activeSnapPoint !== next) {
        const newNext = snapPoints[0];
        onActiveSnapPointChange?.(newNext);
        activeSnapPoint = newNext;
        return newNext;
      }
      if (activeSnapPoint !== next) {
        onActiveSnapPointChange?.(next);
        activeSnapPoint = next;
      }
      return next;
    },
    closeThreshold,
    scrollLockTimeout,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapPoints,
    fadeFromIndex,
    nested,
    onDrag,
    onClose,
    onRelease,
    shouldScaleBackground,
    backgroundColor,
    dismissible,
    direction
  });
  $$unsubscribe_keyboardIsOpen = subscribe(keyboardIsOpen, (value) => $keyboardIsOpen = value);
  $$unsubscribe_isOpen = subscribe(isOpen, (value) => $isOpen = value);
  $$unsubscribe_localDismissible = subscribe(localDismissible, (value) => $localDismissible = value);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.closeThreshold === void 0 && $$bindings.closeThreshold && closeThreshold !== void 0)
    $$bindings.closeThreshold(closeThreshold);
  if ($$props.scrollLockTimeout === void 0 && $$bindings.scrollLockTimeout && scrollLockTimeout !== void 0)
    $$bindings.scrollLockTimeout(scrollLockTimeout);
  if ($$props.snapPoints === void 0 && $$bindings.snapPoints && snapPoints !== void 0)
    $$bindings.snapPoints(snapPoints);
  if ($$props.fadeFromIndex === void 0 && $$bindings.fadeFromIndex && fadeFromIndex !== void 0)
    $$bindings.fadeFromIndex(fadeFromIndex);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0)
    $$bindings.openFocus(openFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0)
    $$bindings.onOutsideClick(onOutsideClick);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.backgroundColor === void 0 && $$bindings.backgroundColor && backgroundColor !== void 0)
    $$bindings.backgroundColor(backgroundColor);
  if ($$props.nested === void 0 && $$bindings.nested && nested !== void 0)
    $$bindings.nested(nested);
  if ($$props.shouldScaleBackground === void 0 && $$bindings.shouldScaleBackground && shouldScaleBackground !== void 0)
    $$bindings.shouldScaleBackground(shouldScaleBackground);
  if ($$props.activeSnapPoint === void 0 && $$bindings.activeSnapPoint && activeSnapPoint !== void 0)
    $$bindings.activeSnapPoint(activeSnapPoint);
  if ($$props.onActiveSnapPointChange === void 0 && $$bindings.onActiveSnapPointChange && onActiveSnapPointChange !== void 0)
    $$bindings.onActiveSnapPointChange(onActiveSnapPointChange);
  if ($$props.onRelease === void 0 && $$bindings.onRelease && onRelease !== void 0)
    $$bindings.onRelease(onRelease);
  if ($$props.onDrag === void 0 && $$bindings.onDrag && onDrag !== void 0)
    $$bindings.onDrag(onDrag);
  if ($$props.onClose === void 0 && $$bindings.onClose && onClose !== void 0)
    $$bindings.onClose(onClose);
  if ($$props.dismissible === void 0 && $$bindings.dismissible && dismissible !== void 0)
    $$bindings.dismissible(dismissible);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    activeSnapPoint !== void 0 && localActiveSnapPoint.set(activeSnapPoint);
    {
      updateOption("closeThreshold", closeThreshold);
    }
    {
      updateOption("scrollLockTimeout", scrollLockTimeout);
    }
    {
      updateOption("snapPoints", snapPoints);
    }
    {
      updateOption("fadeFromIndex", fadeFromIndex);
    }
    {
      updateOption("openFocus", openFocus);
    }
    {
      updateOption("shouldScaleBackground", shouldScaleBackground);
    }
    {
      updateOption("backgroundColor", backgroundColor);
    }
    {
      updateOption("dismissible", dismissible);
    }
    {
      updateOption("direction", direction);
    }
    open && !$isOpen && openDrawer();
    !open && $isOpen && closeDrawer();
    $$rendered = `${validate_component(Dialog, "DialogPrimitive.Root").$$render(
      $$result,
      Object.assign(
        {},
        { closeOnOutsideClick },
        { closeOnEscape: false },
        { preventScroll: false },
        {
          onOpenChange: (o) => {
            onOpenChange?.(o);
            if (!o) {
              closeDrawer();
            } else if (o) {
              openDrawer();
            }
          }
        },
        {
          onOutsideClick: (e) => {
            if (!closeOnOutsideClick)
              return;
            onOutsideClick?.(e);
            if (e?.defaultPrevented)
              return;
            if ($keyboardIsOpen) {
              keyboardIsOpen.set(false);
            }
            e.preventDefault();
            if (!$localDismissible) {
              return;
            }
            const $openDialogIds = get_store_value(openDrawerIds2);
            const isLast = $openDialogIds[$openDialogIds.length - 1] === get_store_value(drawerId);
            if (isLast) {
              onOpenChange?.(false);
              closeDrawer();
            }
          }
        },
        $$restProps,
        { open }
      ),
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_isOpen();
  $$unsubscribe_keyboardIsOpen();
  $$unsubscribe_localDismissible();
  return $$rendered;
});
const Visible = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  getCtx();
  return ``;
});
const Content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["style"]);
  let $drawerRef, $$unsubscribe_drawerRef;
  let $getContentStyle, $$unsubscribe_getContentStyle;
  let $direction, $$unsubscribe_direction;
  let $visible, $$unsubscribe_visible;
  const { refs: { drawerRef }, states: { visible }, helpers: { getContentStyle }, methods: { onPress, onDrag, onRelease }, options: { direction } } = getCtx();
  $$unsubscribe_drawerRef = subscribe(drawerRef, (value) => $drawerRef = value);
  $$unsubscribe_visible = subscribe(visible, (value) => $visible = value);
  $$unsubscribe_getContentStyle = subscribe(getContentStyle, (value) => $getContentStyle = value);
  $$unsubscribe_direction = subscribe(direction, (value) => $direction = value);
  let { style = "" } = $$props;
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Dialog_content, "DialogPrimitive.Content").$$render(
      $$result,
      Object.assign(
        {},
        { style: $getContentStyle(style) },
        { "data-vaul-drawer": "" },
        { "data-vaul-drawer-direction": $direction },
        {
          "data-vaul-drawer-visible": $visible ? "true" : "false"
        },
        $$restProps,
        { el: $drawerRef }
      ),
      {
        el: ($$value) => {
          $drawerRef = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Visible, "Visible").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_drawerRef();
  $$unsubscribe_getContentStyle();
  $$unsubscribe_direction();
  $$unsubscribe_visible();
  return $$rendered;
});
const Overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hasSnapPoints;
  let $$restProps = compute_rest_props($$props, []);
  let $snapPoints, $$unsubscribe_snapPoints;
  let $overlayRef, $$unsubscribe_overlayRef;
  let $visible, $$unsubscribe_visible;
  let $isOpen, $$unsubscribe_isOpen;
  let $shouldFade, $$unsubscribe_shouldFade;
  const { refs: { overlayRef }, states: { isOpen, visible, snapPoints, shouldFade }, methods: { onRelease } } = getCtx();
  $$unsubscribe_overlayRef = subscribe(overlayRef, (value) => $overlayRef = value);
  $$unsubscribe_isOpen = subscribe(isOpen, (value) => $isOpen = value);
  $$unsubscribe_visible = subscribe(visible, (value) => $visible = value);
  $$unsubscribe_snapPoints = subscribe(snapPoints, (value) => $snapPoints = value);
  $$unsubscribe_shouldFade = subscribe(shouldFade, (value) => $shouldFade = value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    hasSnapPoints = $snapPoints && $snapPoints.length > 0;
    $$rendered = `${validate_component(Dialog_overlay, "DialogPrimitive.Overlay").$$render(
      $$result,
      Object.assign(
        {},
        {
          "data-vaul-drawer-visible": $visible ? "true" : "false"
        },
        { "data-vaul-overlay": "" },
        {
          "data-vaul-snap-points": $isOpen && hasSnapPoints ? "true" : "false"
        },
        {
          "data-vaul-snap-points-overlay": $isOpen && $shouldFade ? "true" : "false"
        },
        $$restProps,
        { el: $overlayRef }
      ),
      {
        el: ($$value) => {
          $overlayRef = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_snapPoints();
  $$unsubscribe_overlayRef();
  $$unsubscribe_visible();
  $$unsubscribe_isOpen();
  $$unsubscribe_shouldFade();
  return $$rendered;
});
const Close_wrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let _;
  let rest;
  let { meltBuilder } = $$props;
  const { methods: { closeDrawer } } = getCtx();
  const wrappedAction = (node) => {
    const handleKeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeDrawer(true);
      }
    };
    const handleClick = () => {
      closeDrawer();
    };
    node.addEventListener("keydown", handleKeydown);
    node.addEventListener("click", handleClick);
    return () => {
      node.removeEventListener("keydown", handleKeydown);
      node.removeEventListener("click", handleClick);
    };
  };
  if ($$props.meltBuilder === void 0 && $$bindings.meltBuilder && meltBuilder !== void 0)
    $$bindings.meltBuilder(meltBuilder);
  ({ _, ...rest } = meltBuilder);
  {
    Object.assign(rest, { action: wrappedAction });
  }
  return `${slots.default ? slots.default({ newBuilder: rest }) : ``}`;
});
const Close$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "asChild"]);
  let { el = void 0 } = $$props;
  let { asChild = false } = $$props;
  getCtx();
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${asChild ? `${validate_component(Dialog_close, "DialogPrimitive.Close").$$render(
      $$result,
      Object.assign({}, $$restProps, { asChild }, { el }),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder: builder2 }) => {
          return `${validate_component(Close_wrapper, "CloseWrapper").$$render($$result, { meltBuilder: builder2 }, {}, {
            default: ({ newBuilder }) => {
              return `${slots.default ? slots.default({ builder: newBuilder }) : ``}`;
            }
          })}`;
        }
      }
    )}` : `${validate_component(Dialog_close, "DialogPrimitive.Close").$$render(
      $$result,
      Object.assign({}, $$restProps, { asChild }, { el }),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ builder: builder2 }) => {
          return `${slots.default ? slots.default({ builder: builder2 }) : ``}`;
        }
      }
    )}`}`;
  } while (!$$settled);
  return $$rendered;
});
const Portal = Dialog_portal;
const Title = Dialog_title;
const Drawer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["shouldScaleBackground", "open", "activeSnapPoint"]);
  let { shouldScaleBackground = true } = $$props;
  let { open = false } = $$props;
  let { activeSnapPoint = void 0 } = $$props;
  if ($$props.shouldScaleBackground === void 0 && $$bindings.shouldScaleBackground && shouldScaleBackground !== void 0)
    $$bindings.shouldScaleBackground(shouldScaleBackground);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.activeSnapPoint === void 0 && $$bindings.activeSnapPoint && activeSnapPoint !== void 0)
    $$bindings.activeSnapPoint(activeSnapPoint);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Root, "DrawerPrimitive.Root").$$render(
      $$result,
      Object.assign({}, { shouldScaleBackground }, $$restProps, { open }, { activeSnapPoint }),
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        },
        activeSnapPoint: ($$value) => {
          activeSnapPoint = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Drawer_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Overlay, "DrawerPrimitive.Overlay").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("fixed inset-0 z-[1000] backdrop-blur-lg backdrop-brightness-[0.3]", className)
        },
        $$restProps,
        { el }
      ),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Drawer_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Portal, "DrawerPrimitive.Portal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Drawer_overlay, "DrawerOverlay").$$render($$result, {}, {}, {})} ${validate_component(Content, "DrawerPrimitive.Content").$$render(
        $$result,
        Object.assign(
          {},
          {
            class: cn("fixed inset-x-0 bottom-[68px] z-[1001] mt-24 flex h-auto flex-col rounded-t-[16px] border bg-offwhite", className)
          },
          $$restProps
        ),
        {},
        {
          default: () => {
            return `<div class="mx-auto mt-3 -mb-3 h-1 w-16 rounded-full bg-black bg-opacity-10"></div> ${slots.default ? slots.default({}) : ``}`;
          }
        }
      )}`;
    }
  })}`;
});
const Drawer_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
        class: escape_attribute_value(cn("grid gap-1.5 p-4 text-center sm:text-left", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Drawer_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["el", "class"]);
  let { el = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Title, "DrawerPrimitive.Title").$$render(
      $$result,
      Object.assign(
        {},
        {
          class: cn("text-lg font-semibold leading-none tracking-tight", className)
        },
        $$restProps,
        { el }
      ),
      {
        el: ($$value) => {
          el = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Close = Close$1;

export { ArrowRight$1 as A, ChevronUp$1 as C, Drawer as D, FormStepDisplay as F, ChevronDown$1 as a, Drawer_content as b, Drawer_header as c, defaults$1 as d, Drawer_title as e, Close as f, Cross1$1 as g, toggleVariants as t };
//# sourceMappingURL=index7-Cg86EKQ4.js.map
