import { g as get_store_value, s as subscribe, c as compute_rest_props, a as null_to_empty } from "./utils.js";
import { c as create_ssr_component, s as spread, a as add_attribute, h as escape_object, e as escape, g as escape_attribute_value, v as validate_component } from "./ssr.js";
import { dequal } from "dequal";
import { a as isHTMLElement, i as isBrowser, w as withGet, g as getElementByMeltId, h as isElement, j as isHTMLLabelElement, m as makeElement, b as addMeltEventListener, o as omit, d as createElHelpers, l as isObject, n as stripValues, e as executeCallbacks, k as kbd, p as isHTMLButtonElement, F as FIRST_LAST_KEYS, q as isElementDisabled, u as useEscapeKeydown, r as noop, t as disabledAttr, v as isHTMLInputElement, f as effect, s as styleToString, x as createHiddenInput, y as safeOnMount, c as cn, z as flyAndScale } from "./create.js";
import { d as derivedVisible, u as usePopper, g as getPositioningUpdater, B as Button$1, D as Dialog_portal, f as fade, a as Dialog_overlay, b as fly, c as Dialog_content, e as Dialog_title, s as scale } from "./Cross1.js";
import { d as buttonVariants } from "./page.js";
import { S as SparklePill } from "./SparklePill.js";
import { s as sheetTransitions, a as sheetVariants } from "./index6.js";
import { s as sleep, w as wrapArray, o as overridable, t as toWritableStores, g as generateIds, l as last, e as back, f as forward, p as prev, n as next, h as getPortalDestination, j as generateId, k as removeScroll, m as toggle, a as createBitAttrs, r as removeUndefined, b as getOptionUpdater, d as createDispatcher } from "./dialog-close.js";
import { s as setContext, g as getContext } from "./lifecycle.js";
import { w as writable, d as derived, a as readonly } from "./index2.js";
import { t as tick } from "./scheduler.js";
import "clsx";
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}
function addHighlight(element) {
  element.setAttribute("data-highlighted", "");
}
function removeHighlight(element) {
  element.removeAttribute("data-highlighted");
}
function getOptions(el) {
  return Array.from(el.querySelectorAll('[role="option"]:not([data-disabled])')).filter((el2) => isHTMLElement(el2));
}
function debounce(fn, wait = 500) {
  let timeout = null;
  return function(...args) {
    const later = () => {
      timeout = null;
      fn(...args);
    };
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function handleRovingFocus(nextElement) {
  if (!isBrowser)
    return;
  sleep(1).then(() => {
    const currentFocusedElement = document.activeElement;
    if (!isHTMLElement(currentFocusedElement) || currentFocusedElement === nextElement)
      return;
    currentFocusedElement.tabIndex = -1;
    if (nextElement) {
      nextElement.tabIndex = 0;
      nextElement.focus();
    }
  });
}
const ignoredKeys = /* @__PURE__ */ new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "NumLock"]);
const defaults$1 = {
  onMatch: handleRovingFocus,
  getCurrentItem: () => document.activeElement
};
function createTypeaheadSearch(args = {}) {
  const withDefaults = { ...defaults$1, ...args };
  const typed = withGet(writable([]));
  const resetTyped = debounce(() => {
    typed.update(() => []);
  });
  const handleTypeaheadSearch = (key, items) => {
    if (ignoredKeys.has(key))
      return;
    const currentItem = withDefaults.getCurrentItem();
    const $typed = get_store_value(typed);
    if (!Array.isArray($typed)) {
      return;
    }
    $typed.push(key.toLowerCase());
    typed.set($typed);
    const candidateItems = items.filter((item) => {
      if (item.getAttribute("disabled") === "true" || item.getAttribute("aria-disabled") === "true" || item.hasAttribute("data-disabled")) {
        return false;
      }
      return true;
    });
    const isRepeated = $typed.length > 1 && $typed.every((char) => char === $typed[0]);
    const normalizeSearch = isRepeated ? $typed[0] : $typed.join("");
    const currentItemIndex = isHTMLElement(currentItem) ? candidateItems.indexOf(currentItem) : -1;
    let wrappedItems = wrapArray(candidateItems, Math.max(currentItemIndex, 0));
    const excludeCurrentItem = normalizeSearch.length === 1;
    if (excludeCurrentItem) {
      wrappedItems = wrappedItems.filter((v) => v !== currentItem);
    }
    const nextItem = wrappedItems.find((item) => item?.innerText && item.innerText.toLowerCase().startsWith(normalizeSearch.toLowerCase()));
    if (isHTMLElement(nextItem) && nextItem !== currentItem) {
      withDefaults.onMatch(nextItem);
    }
    resetTyped();
  };
  return {
    typed,
    resetTyped,
    handleTypeaheadSearch
  };
}
function createClickOutsideIgnore(meltId) {
  return (e) => {
    const target = e.target;
    const triggerEl = getElementByMeltId(meltId);
    if (!triggerEl || !isElement(target))
      return false;
    const id = triggerEl.id;
    if (isHTMLLabelElement(target) && id === target.htmlFor) {
      return true;
    }
    if (target.closest(`label[for="${id}"]`)) {
      return true;
    }
    return false;
  };
}
function createLabel() {
  const root = makeElement("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}
const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];
const defaults = {
  positioning: {
    placement: "bottom",
    sameWidth: true
  },
  scrollAlignment: "nearest",
  loop: true,
  defaultOpen: false,
  closeOnOutsideClick: true,
  preventScroll: true,
  closeOnEscape: true,
  forceVisible: false,
  portal: void 0,
  builder: "listbox",
  disabled: false,
  required: false,
  name: void 0,
  typeahead: true,
  highlightOnHover: true,
  onOutsideClick: void 0
};
const listboxIdParts = ["trigger", "menu", "label"];
function createListbox(props) {
  const withDefaults = { ...defaults, ...props };
  const activeTrigger = withGet(writable(null));
  const highlightedItem = withGet(writable(null));
  const selectedWritable = withDefaults.selected ?? writable(withDefaults.defaultSelected);
  const selected = overridable(selectedWritable, withDefaults?.onSelectedChange);
  const highlighted = derived(highlightedItem, ($highlightedItem) => $highlightedItem ? getOptionProps($highlightedItem) : void 0);
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const options = toWritableStores({
    ...omit(withDefaults, "open", "defaultOpen", "builder", "ids"),
    multiple: withDefaults.multiple ?? false
  });
  const { scrollAlignment, loop, closeOnOutsideClick, closeOnEscape, preventScroll, portal, forceVisible, positioning, multiple, arrowSize, disabled, required, typeahead, name: nameProp, highlightOnHover, onOutsideClick } = options;
  const { name, selector } = createElHelpers(withDefaults.builder);
  const ids = toWritableStores({ ...generateIds(listboxIdParts), ...withDefaults.ids });
  const { handleTypeaheadSearch } = createTypeaheadSearch({
    onMatch: (element) => {
      highlightedItem.set(element);
      element.scrollIntoView({ block: scrollAlignment.get() });
    },
    getCurrentItem() {
      return highlightedItem.get();
    }
  });
  function getOptionProps(el) {
    const value = el.getAttribute("data-value");
    const label2 = el.getAttribute("data-label");
    const disabled2 = el.hasAttribute("data-disabled");
    return {
      value: value ? JSON.parse(value) : value,
      label: label2 ?? el.textContent ?? void 0,
      disabled: disabled2 ? true : false
    };
  }
  const setOption = (newOption) => {
    selected.update(($option) => {
      const $multiple = multiple.get();
      if ($multiple) {
        const optionArr = Array.isArray($option) ? [...$option] : [];
        return toggle(newOption, optionArr, (itemA, itemB) => dequal(itemA.value, itemB.value));
      }
      return newOption;
    });
  };
  function selectItem(item) {
    const props2 = getOptionProps(item);
    setOption(props2);
  }
  async function openMenu() {
    open.set(true);
    const triggerEl = document.getElementById(ids.trigger.get());
    if (!triggerEl)
      return;
    activeTrigger.set(triggerEl);
    await tick();
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement(menuElement))
      return;
    const selectedItem = menuElement.querySelector("[aria-selected=true]");
    if (!isHTMLElement(selectedItem))
      return;
    highlightedItem.set(selectedItem);
  }
  async function closeMenu() {
    await sleep(0);
    open.set(false);
    highlightedItem.set(null);
  }
  const isVisible = derivedVisible({ open, forceVisible, activeTrigger });
  const isSelected = derived([selected], ([$selected]) => {
    return (value) => {
      if (Array.isArray($selected)) {
        return $selected.some((o) => dequal(o.value, value));
      }
      if (isObject(value)) {
        return dequal($selected?.value, stripValues(value, void 0));
      }
      return dequal($selected?.value, value);
    };
  });
  const isHighlighted = derived([highlighted], ([$value]) => {
    return (item) => {
      return dequal($value?.value, item);
    };
  });
  const trigger = makeElement(name("trigger"), {
    stores: [open, highlightedItem, disabled, ids.menu, ids.trigger, ids.label],
    returned: ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]) => {
      return {
        "aria-activedescendant": $highlightedItem?.id,
        "aria-autocomplete": "list",
        "aria-controls": $menuId,
        "aria-expanded": $open,
        "aria-labelledby": $labelId,
        // autocomplete: 'off',
        id: $triggerId,
        role: "combobox",
        disabled: disabledAttr($disabled),
        type: withDefaults.builder === "select" ? "button" : void 0
      };
    },
    action: (node) => {
      const isInput = isHTMLInputElement(node);
      const unsubscribe = executeCallbacks(
        addMeltEventListener(node, "click", () => {
          node.focus();
          const $open = open.get();
          if ($open) {
            closeMenu();
          } else {
            openMenu();
          }
        }),
        // Handle all input key events including typing, meta, and navigation.
        addMeltEventListener(node, "keydown", (e) => {
          const $open = open.get();
          if (!$open) {
            if (INTERACTION_KEYS.includes(e.key)) {
              return;
            }
            if (e.key === kbd.TAB) {
              return;
            }
            if (e.key === kbd.BACKSPACE && isInput && node.value === "") {
              return;
            }
            if (e.key === kbd.SPACE && isHTMLButtonElement(node)) {
              return;
            }
            openMenu();
            tick().then(() => {
              const $selectedItem = selected.get();
              if ($selectedItem)
                return;
              const menuEl = document.getElementById(ids.menu.get());
              if (!isHTMLElement(menuEl))
                return;
              const enabledItems = Array.from(menuEl.querySelectorAll(`${selector("item")}:not([data-disabled]):not([data-hidden])`)).filter((item) => isHTMLElement(item));
              if (!enabledItems.length)
                return;
              if (e.key === kbd.ARROW_DOWN) {
                highlightedItem.set(enabledItems[0]);
                enabledItems[0].scrollIntoView({ block: scrollAlignment.get() });
              } else if (e.key === kbd.ARROW_UP) {
                highlightedItem.set(last(enabledItems));
                last(enabledItems).scrollIntoView({ block: scrollAlignment.get() });
              }
            });
          }
          if (e.key === kbd.TAB) {
            closeMenu();
            return;
          }
          if (e.key === kbd.ENTER || e.key === kbd.SPACE && isHTMLButtonElement(node)) {
            e.preventDefault();
            const $highlightedItem = highlightedItem.get();
            if ($highlightedItem) {
              selectItem($highlightedItem);
            }
            if (!multiple.get()) {
              closeMenu();
            }
          }
          if (e.key === kbd.ARROW_UP && e.altKey) {
            closeMenu();
          }
          if (FIRST_LAST_KEYS.includes(e.key)) {
            e.preventDefault();
            const menuElement = document.getElementById(ids.menu.get());
            if (!isHTMLElement(menuElement))
              return;
            const itemElements = getOptions(menuElement);
            if (!itemElements.length)
              return;
            const candidateNodes = itemElements.filter((opt) => !isElementDisabled(opt) && opt.dataset.hidden === void 0);
            const $currentItem = highlightedItem.get();
            const currentIndex = $currentItem ? candidateNodes.indexOf($currentItem) : -1;
            const $loop = loop.get();
            const $scrollAlignment = scrollAlignment.get();
            let nextItem;
            switch (e.key) {
              case kbd.ARROW_DOWN:
                nextItem = next(candidateNodes, currentIndex, $loop);
                break;
              case kbd.ARROW_UP:
                nextItem = prev(candidateNodes, currentIndex, $loop);
                break;
              case kbd.PAGE_DOWN:
                nextItem = forward(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.PAGE_UP:
                nextItem = back(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.HOME:
                nextItem = candidateNodes[0];
                break;
              case kbd.END:
                nextItem = last(candidateNodes);
                break;
              default:
                return;
            }
            highlightedItem.set(nextItem);
            nextItem?.scrollIntoView({ block: $scrollAlignment });
          } else if (typeahead.get()) {
            const menuEl = document.getElementById(ids.menu.get());
            if (!isHTMLElement(menuEl))
              return;
            handleTypeaheadSearch(e.key, getOptions(menuEl));
          }
        })
      );
      let unsubEscapeKeydown = noop;
      const escape2 = useEscapeKeydown(node, {
        handler: closeMenu,
        enabled: derived([open, closeOnEscape], ([$open, $closeOnEscape]) => {
          return $open && $closeOnEscape;
        })
      });
      if (escape2 && escape2.destroy) {
        unsubEscapeKeydown = escape2.destroy;
      }
      return {
        destroy() {
          unsubscribe();
          unsubEscapeKeydown();
        }
      };
    }
  });
  const menu = makeElement(name("menu"), {
    stores: [isVisible, ids.menu],
    returned: ([$isVisible, $menuId]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        id: $menuId,
        role: "listbox",
        style: styleToString({ display: $isVisible ? void 0 : "none" })
      };
    },
    action: (node) => {
      let unsubPopper = noop;
      const unsubscribe = executeCallbacks(
        // Bind the popper portal to the input element.
        effect([isVisible, portal, closeOnOutsideClick, positioning, activeTrigger], ([$isVisible, $portal, $closeOnOutsideClick, $positioning, $activeTrigger]) => {
          unsubPopper();
          if (!$isVisible || !$activeTrigger)
            return;
          const ignoreHandler = createClickOutsideIgnore(ids.trigger.get());
          const popper = usePopper(node, {
            anchorElement: $activeTrigger,
            open,
            options: {
              floating: $positioning,
              focusTrap: null,
              modal: {
                closeOnInteractOutside: $closeOnOutsideClick,
                onClose: closeMenu,
                open: $isVisible,
                shouldCloseOnInteractOutside: (e) => {
                  onOutsideClick.get()?.(e);
                  if (e.defaultPrevented)
                    return false;
                  const target = e.target;
                  if (!isElement(target))
                    return false;
                  if (target === $activeTrigger || $activeTrigger.contains(target)) {
                    return false;
                  }
                  if (ignoreHandler(e))
                    return false;
                  return true;
                }
              },
              escapeKeydown: null,
              portal: getPortalDestination(node, $portal)
            }
          });
          if (popper && popper.destroy) {
            unsubPopper = popper.destroy;
          }
        })
      );
      return {
        destroy: () => {
          unsubscribe();
          unsubPopper();
        }
      };
    }
  });
  const { elements: { root: labelBuilder } } = createLabel();
  const { action: labelAction } = get_store_value(labelBuilder);
  const label = makeElement(name("label"), {
    stores: [ids.label, ids.trigger],
    returned: ([$labelId, $triggerId]) => {
      return {
        id: $labelId,
        for: $triggerId
      };
    },
    action: labelAction
  });
  const option = makeElement(name("option"), {
    stores: [isSelected],
    returned: ([$isSelected]) => (props2) => {
      const selected2 = $isSelected(props2.value);
      return {
        "data-value": JSON.stringify(props2.value),
        "data-label": props2.label,
        "data-disabled": disabledAttr(props2.disabled),
        "aria-disabled": props2.disabled ? true : void 0,
        "aria-selected": selected2,
        "data-selected": selected2 ? "" : void 0,
        id: generateId(),
        role: "option"
      };
    },
    action: (node) => {
      const unsubscribe = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        if (isElementDisabled(node)) {
          e.preventDefault();
          return;
        }
        selectItem(node);
        if (!multiple.get()) {
          closeMenu();
        }
      }), effect(highlightOnHover, ($highlightOnHover) => {
        if (!$highlightOnHover)
          return;
        const unsub = executeCallbacks(addMeltEventListener(node, "mouseover", () => {
          highlightedItem.set(node);
        }), addMeltEventListener(node, "mouseleave", () => {
          highlightedItem.set(null);
        }));
        return unsub;
      }));
      return { destroy: unsubscribe };
    }
  });
  const group = makeElement(name("group"), {
    returned: () => {
      return (groupId) => ({
        role: "group",
        "aria-labelledby": groupId
      });
    }
  });
  const groupLabel = makeElement(name("group-label"), {
    returned: () => {
      return (groupId) => ({
        id: groupId
      });
    }
  });
  const hiddenInput = createHiddenInput({
    value: derived([selected], ([$selected]) => {
      const value = Array.isArray($selected) ? $selected.map((o) => o.value) : $selected?.value;
      return typeof value === "string" ? value : JSON.stringify(value);
    }),
    name: readonly(nameProp),
    required,
    prefix: withDefaults.builder
  });
  const arrow = makeElement(name("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  safeOnMount(() => {
    if (!isBrowser)
      return;
    const menuEl = document.getElementById(ids.menu.get());
    const triggerEl = document.getElementById(ids.trigger.get());
    if (triggerEl) {
      activeTrigger.set(triggerEl);
    }
    if (!menuEl)
      return;
    const selectedEl = menuEl.querySelector("[data-selected]");
    if (!isHTMLElement(selectedEl))
      return;
  });
  effect([highlightedItem], ([$highlightedItem]) => {
    if (!isBrowser)
      return;
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement(menuElement))
      return;
    getOptions(menuElement).forEach((node) => {
      if (node === $highlightedItem) {
        addHighlight(node);
      } else {
        removeHighlight(node);
      }
    });
  });
  effect([open], ([$open]) => {
    if (!isBrowser)
      return;
    let unsubScroll = noop;
    if (preventScroll.get() && $open) {
      unsubScroll = removeScroll();
    }
    return () => {
      unsubScroll();
    };
  });
  return {
    ids,
    elements: {
      trigger,
      group,
      option,
      menu,
      groupLabel,
      label,
      hiddenInput,
      arrow
    },
    states: {
      open,
      selected,
      highlighted,
      highlightedItem
    },
    helpers: {
      isSelected,
      isHighlighted,
      closeMenu
    },
    options
  };
}
function createSelect(props) {
  const listbox = createListbox({ ...props, builder: "select" });
  const selectedLabel = derived(listbox.states.selected, ($selected) => {
    if (Array.isArray($selected)) {
      return $selected.map((o) => o.label).join(", ");
    }
    return $selected?.label ?? "";
  });
  return {
    ...listbox,
    elements: {
      ...listbox.elements
    },
    states: {
      ...listbox.states,
      selectedLabel
    }
  };
}
function getSelectData() {
  const NAME = "select";
  const GROUP_NAME = "select-group";
  const ITEM_NAME = "select-item";
  const PARTS = [
    "arrow",
    "content",
    "group",
    "item",
    "indicator",
    "input",
    "label",
    "trigger",
    "value"
  ];
  return {
    NAME,
    GROUP_NAME,
    ITEM_NAME,
    PARTS
  };
}
function getCtx() {
  const { NAME } = getSelectData();
  return getContext(NAME);
}
function setCtx(props) {
  const { NAME, PARTS } = getSelectData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const select = {
    ...createSelect({ ...removeUndefined(props), forceVisible: true }),
    getAttrs
  };
  setContext(NAME, select);
  return {
    ...select,
    updateOption: getOptionUpdater(select.options)
  };
}
function setItemCtx(value) {
  const { ITEM_NAME } = getSelectData();
  const select = getCtx();
  setContext(ITEM_NAME, value);
  return select;
}
function getItemIndicator() {
  const { ITEM_NAME } = getSelectData();
  const { helpers: { isSelected }, getAttrs } = getCtx();
  const value = getContext(ITEM_NAME);
  return {
    value,
    isSelected,
    getAttrs
  };
}
function updatePositioning(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center",
    sameWidth: true
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { required = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { preventScroll = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { name = void 0 } = $$props;
  let { multiple = false } = $$props;
  let { selected = void 0 } = $$props;
  let { onSelectedChange = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { items = [] } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { states: { open: localOpen, selected: localSelected }, updateOption, ids } = setCtx({
    required,
    disabled,
    preventScroll,
    loop,
    closeOnEscape,
    closeOnOutsideClick,
    portal,
    name,
    onOutsideClick,
    multiple,
    forceVisible: true,
    defaultSelected: Array.isArray(selected) ? [...selected] : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selected
    ),
    defaultOpen: open,
    onSelectedChange: ({ next: next2 }) => {
      if (Array.isArray(next2)) {
        if (!Array.isArray(selected) || !arraysAreEqual(selected, next2)) {
          onSelectedChange?.(next2);
          selected = next2;
          return next2;
        }
        return next2;
      }
      if (selected !== next2) {
        onSelectedChange?.(next2);
        selected = next2;
      }
      return next2;
    },
    onOpenChange: ({ next: next2 }) => {
      if (open !== next2) {
        onOpenChange?.(next2);
        open = next2;
      }
      return next2;
    },
    items
  });
  const idValues = derived([ids.menu, ids.trigger, ids.label], ([$menuId, $triggerId, $labelId]) => ({
    menu: $menuId,
    trigger: $triggerId,
    label: $labelId
  }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0) $$bindings.required(required);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0) $$bindings.preventScroll(preventScroll);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0) $$bindings.loop(loop);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0) $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0) $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0) $$bindings.portal(portal);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0) $$bindings.multiple(multiple);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0) $$bindings.selected(selected);
  if ($$props.onSelectedChange === void 0 && $$bindings.onSelectedChange && onSelectedChange !== void 0) $$bindings.onSelectedChange(onSelectedChange);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0) $$bindings.onOpenChange(onOpenChange);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0) $$bindings.items(items);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0) $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  selected !== void 0 && localSelected.set(Array.isArray(selected) ? [...selected] : (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected
  ));
  {
    updateOption("required", required);
  }
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("loop", loop);
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
    updateOption("name", name);
  }
  {
    updateOption("multiple", multiple);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Select_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "avoidCollisions",
    "collisionBoundary",
    "sameWidth",
    "fitViewport",
    "strategy",
    "overlap",
    "el"
  ]);
  let $open, $$unsubscribe_open;
  let $menu, $$unsubscribe_menu;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { side = "bottom" } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 0 } = $$props;
  let { alignOffset = 0 } = $$props;
  let { collisionPadding = 8 } = $$props;
  let { avoidCollisions = true } = $$props;
  let { collisionBoundary = void 0 } = $$props;
  let { sameWidth = true } = $$props;
  let { fitViewport = false } = $$props;
  let { strategy = "absolute" } = $$props;
  let { overlap = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { menu }, states: { open }, ids, getAttrs } = getCtx();
  $$unsubscribe_menu = subscribe(menu, (value) => $menu = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  createDispatcher();
  const attrs = getAttrs("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0) $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0) $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0) $$bindings.side(side);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0) $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0) $$bindings.sideOffset(sideOffset);
  if ($$props.alignOffset === void 0 && $$bindings.alignOffset && alignOffset !== void 0) $$bindings.alignOffset(alignOffset);
  if ($$props.collisionPadding === void 0 && $$bindings.collisionPadding && collisionPadding !== void 0) $$bindings.collisionPadding(collisionPadding);
  if ($$props.avoidCollisions === void 0 && $$bindings.avoidCollisions && avoidCollisions !== void 0) $$bindings.avoidCollisions(avoidCollisions);
  if ($$props.collisionBoundary === void 0 && $$bindings.collisionBoundary && collisionBoundary !== void 0) $$bindings.collisionBoundary(collisionBoundary);
  if ($$props.sameWidth === void 0 && $$bindings.sameWidth && sameWidth !== void 0) $$bindings.sameWidth(sameWidth);
  if ($$props.fitViewport === void 0 && $$bindings.fitViewport && fitViewport !== void 0) $$bindings.fitViewport(fitViewport);
  if ($$props.strategy === void 0 && $$bindings.strategy && strategy !== void 0) $$bindings.strategy(strategy);
  if ($$props.overlap === void 0 && $$bindings.overlap && overlap !== void 0) $$bindings.overlap(overlap);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.menu.set(id);
    }
  }
  builder = $menu;
  {
    Object.assign(builder, attrs);
  }
  {
    if ($open) {
      updatePositioning({
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        avoidCollisions,
        collisionBoundary,
        sameWidth,
        fitViewport,
        strategy,
        overlap
      });
    }
  }
  $$unsubscribe_open();
  $$unsubscribe_menu();
  return ` ${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Select_input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $hiddenInput, $$unsubscribe_hiddenInput;
  let $disabled, $$unsubscribe_disabled;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { hiddenInput }, options: { disabled }, getAttrs } = getCtx();
  $$unsubscribe_hiddenInput = subscribe(hiddenInput, (value) => $hiddenInput = value);
  $$unsubscribe_disabled = subscribe(disabled, (value) => $disabled = value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = {
    ...getAttrs("input"),
    disabled: $disabled ? true : void 0
  };
  builder = $hiddenInput;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_hiddenInput();
  $$unsubscribe_disabled();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<input${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>`}`;
});
const Select_item$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let isSelected;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "label", "asChild", "el"]);
  let $isSelectedStore, $$unsubscribe_isSelectedStore;
  let $item, $$unsubscribe_item;
  let { value } = $$props;
  let { disabled = void 0 } = $$props;
  let { label = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { option: item }, helpers: { isSelected: isSelectedStore }, getAttrs } = setItemCtx(value);
  $$unsubscribe_item = subscribe(item, (value2) => $item = value2);
  $$unsubscribe_isSelectedStore = subscribe(isSelectedStore, (value2) => $isSelectedStore = value2);
  createDispatcher();
  const attrs = getAttrs("item");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $item({ value, disabled, label });
  {
    Object.assign(builder, attrs);
  }
  isSelected = $isSelectedStore(value);
  $$unsubscribe_isSelectedStore();
  $$unsubscribe_item();
  return ` ${asChild ? `${slots.default ? slots.default({ builder, isSelected }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, isSelected }) : ` ${escape(label ? label : value)} `}</div>`}`;
});
const Select_item_indicator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $isSelected, $$unsubscribe_isSelected;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { isSelected, value, getAttrs } = getItemIndicator();
  $$unsubscribe_isSelected = subscribe(isSelected, (value2) => $isSelected = value2);
  const attrs = getAttrs("indicator");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  $$unsubscribe_isSelected();
  return `${asChild ? `${slots.default ? slots.default({ attrs, isSelected: $isSelected(value) }) : ``}` : `<div${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${$isSelected(value) ? `${slots.default ? slots.default({ attrs, isSelected: $isSelected(value) }) : ``}` : ``}</div>`}`;
});
const Select_trigger$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, ids, getAttrs } = getCtx();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.trigger.set(id);
    }
  }
  builder = $trigger;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Select_value = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let label;
  let $$restProps = compute_rest_props($$props, ["placeholder", "asChild", "el"]);
  let $selectedLabel, $$unsubscribe_selectedLabel;
  let { placeholder = "" } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { states: { selectedLabel }, getAttrs } = getCtx();
  $$unsubscribe_selectedLabel = subscribe(selectedLabel, (value) => $selectedLabel = value);
  const attrs = getAttrs("value");
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  label = $selectedLabel;
  $$unsubscribe_selectedLabel();
  return `${asChild ? `${slots.default ? slots.default({ label, attrs }) : ``}` : `<span${spread(
    [
      escape_object($$restProps),
      escape_object(attrs),
      {
        "data-placeholder": escape_attribute_value(!label ? "" : void 0)
      }
    ],
    {}
  )}${add_attribute("this", el, 0)}>${escape(label ? label : placeholder)}</span>`}`;
});
const css$1 = {
  code: ".skeumorphic-button.svelte-8i710s{transition:box-shadow 50ms;box-shadow:inset 0 0 8px 0 rgba(0, 0, 0, 0.2), var(--skeumorphic-shadow-light)}.skeumorphic-button-dark.svelte-8i710s{transition:box-shadow 50ms;box-shadow:inset 0 0 8px 0 rgba(0, 0, 0, 0.2), var(--skeumorphic-shadow)}.skeumorphic-button-no-inner-shadow.svelte-8i710s{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: `{"version":3,"file":"button.svelte","sources":["button.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { Button as ButtonPrimitive } from \\"bits-ui\\";\\nimport { buttonVariants } from \\"./index.js\\";\\nimport { cn } from \\"$lib/utils.js\\";\\nlet className = void 0;\\nexport let variant = \\"default\\";\\nexport let size = \\"default\\";\\nexport let builders = [];\\nexport { className as class };\\nexport let decoration = \\"default\\";\\nexport let wrapperClass;\\nexport let noInnerShadow = false;\\n<\/script>\\n\\n{#if decoration === 'op1'}\\n\\t<div\\n\\t\\tclass={cn(\\n\\t\\t\\t'op1 relative flex items-center gap-[4px] border border-black/10 bg-black/10 p-[2px] dark:bg-black/20 md:rounded',\\n\\t\\t\\twrapperClass\\n\\t\\t)}\\n\\t>\\n\\t\\t<div class=\\"shadow\\">\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"flex items-center justify-center overflow-hidden rounded shadow-inner shadow-white/40 dark:shadow-white/10\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<ButtonPrimitive.Root\\n\\t\\t\\t\\t\\t{builders}\\n\\t\\t\\t\\t\\tclass=\\"h-[45.4px] rounded-[2px] px-2 text-black\\"\\n\\t\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\t\\t{...$$restProps}\\n\\t\\t\\t\\t\\ton:click\\n\\t\\t\\t\\t\\ton:keydown\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass={cn(\\n\\t\\t\\t\\t\\t\\t\\tbuttonVariants({ variant, size, className }),\\n\\t\\t\\t\\t\\t\\t\\t'skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 '\\n\\t\\t\\t\\t\\t\\t)}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<slot />\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</ButtonPrimitive.Root>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n{:else if decoration === 'dark-op1'}\\n\\t<div class={cn('dark-op1 relative flex items-center gap-[4px]', wrapperClass)}>\\n\\t\\t<div class=\\"flex w-full items-center justify-center\\">\\n\\t\\t\\t<ButtonPrimitive.Root\\n\\t\\t\\t\\t{builders}\\n\\t\\t\\t\\tclass=\\"p-1.5 w-full\\"\\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\t{...$$restProps}\\n\\t\\t\\t\\ton:click\\n\\t\\t\\t\\ton:keydown\\n\\t\\t\\t>\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass={cn(\\n\\t\\t\\t\\t\\t\\tbuttonVariants({ variant, size, className }),\\n\\t\\t\\t\\t\\t\\t'skeumorphic-button-dark h-[29.4px] w-full rounded-full border-2 transition duration-700 '\\n\\t\\t\\t\\t\\t)}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<slot />\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</ButtonPrimitive.Root>\\n\\t\\t</div>\\n\\t</div>\\n{:else if decoration === 'floating-op1'}\\n\\t<div class={cn('floating-op1 relative flex items-center gap-[4px]', wrapperClass)}>\\n\\t\\t<div class=\\"flex w-full flex-grow items-center justify-center\\">\\n\\t\\t\\t<ButtonPrimitive.Root\\n\\t\\t\\t\\t{builders}\\n\\t\\t\\t\\tclass=\\"w-full p-1.5\\"\\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\t{...$$restProps}\\n\\t\\t\\t\\ton:click\\n\\t\\t\\t\\ton:keydown\\n\\t\\t\\t>\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass={cn(\\n\\t\\t\\t\\t\\t\\tbuttonVariants({ variant, size, className }),\\n\\t\\t\\t\\t\\t\\t'h-[29.4px] rounded-full border-2 transition duration-700',\\n\\t\\t\\t\\t\\t\\tnoInnerShadow ? 'skeumorphic-button-no-inner-shadow' : 'skeumorphic-button'\\n\\t\\t\\t\\t\\t)}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<slot />\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</ButtonPrimitive.Root>\\n\\t\\t</div>\\n\\t</div>\\n{:else}\\n\\t<ButtonPrimitive.Root\\n\\t\\t{builders}\\n\\t\\tclass=\\"h-[45.4px] rounded-[2px] px-2 text-black\\"\\n\\t\\ttype=\\"button\\"\\n\\t\\t{...$$restProps}\\n\\t\\ton:click\\n\\t\\ton:keydown\\n\\t>\\n\\t\\t<div\\n\\t\\t\\tclass={cn(\\n\\t\\t\\t\\tbuttonVariants({ variant, size, className }),\\n\\t\\t\\t\\t'skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 dark:hover:bg-muted'\\n\\t\\t\\t)}\\n\\t\\t>\\n\\t\\t\\t<slot />\\n\\t\\t</div>\\n\\t</ButtonPrimitive.Root>\\n{/if}\\n\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: inset 0 0 8px 0 rgba(0, 0, 0, 0.2), var(--skeumorphic-shadow-light);\\n}\\n\\n.skeumorphic-button-dark {\\n  transition: box-shadow 50ms;\\n  box-shadow: inset 0 0 8px 0 rgba(0, 0, 0, 0.2), var(--skeumorphic-shadow);\\n}\\n\\n.skeumorphic-button-no-inner-shadow {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}</style>\\n"],"names":[],"mappings":"AA6GmB,iCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,0BAA0B,CAChF,CAEA,sCAAyB,CACvB,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,oBAAoB,CAC1E,CAEA,iDAAoC,CAClC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C"}`
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "variant",
    "size",
    "builders",
    "decoration",
    "wrapperClass",
    "noInnerShadow"
  ]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size = "default" } = $$props;
  let { builders = [] } = $$props;
  let { decoration = "default" } = $$props;
  let { wrapperClass } = $$props;
  let { noInnerShadow = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0) $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.builders === void 0 && $$bindings.builders && builders !== void 0) $$bindings.builders(builders);
  if ($$props.decoration === void 0 && $$bindings.decoration && decoration !== void 0) $$bindings.decoration(decoration);
  if ($$props.wrapperClass === void 0 && $$bindings.wrapperClass && wrapperClass !== void 0) $$bindings.wrapperClass(wrapperClass);
  if ($$props.noInnerShadow === void 0 && $$bindings.noInnerShadow && noInnerShadow !== void 0) $$bindings.noInnerShadow(noInnerShadow);
  $$result.css.add(css$1);
  return `${decoration === "op1" ? `<div class="${escape(null_to_empty(cn("op1 relative flex items-center gap-[4px] border border-black/10 bg-black/10 p-[2px] dark:bg-black/20 md:rounded", wrapperClass)), true) + " svelte-8i710s"}"><div class="shadow"><div class="flex items-center justify-center overflow-hidden rounded shadow-inner shadow-white/40 dark:shadow-white/10">${validate_component(Button$1, "ButtonPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      { builders },
      {
        class: "h-[45.4px] rounded-[2px] px-2 text-black"
      },
      { type: "button" },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="${escape(null_to_empty(cn(buttonVariants({ variant, size, className }), "skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 ")), true) + " svelte-8i710s"}">${slots.default ? slots.default({}) : ``}</div>`;
      }
    }
  )}</div></div></div>` : `${decoration === "dark-op1" ? `<div class="${escape(null_to_empty(cn("dark-op1 relative flex items-center gap-[4px]", wrapperClass)), true) + " svelte-8i710s"}"><div class="flex w-full items-center justify-center">${validate_component(Button$1, "ButtonPrimitive.Root").$$render($$result, Object.assign({}, { builders }, { class: "p-1.5 w-full" }, { type: "button" }, $$restProps), {}, {
    default: () => {
      return `<div class="${escape(null_to_empty(cn(buttonVariants({ variant, size, className }), "skeumorphic-button-dark h-[29.4px] w-full rounded-full border-2 transition duration-700 ")), true) + " svelte-8i710s"}">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}</div></div>` : `${decoration === "floating-op1" ? `<div class="${escape(null_to_empty(cn("floating-op1 relative flex items-center gap-[4px]", wrapperClass)), true) + " svelte-8i710s"}"><div class="flex w-full flex-grow items-center justify-center">${validate_component(Button$1, "ButtonPrimitive.Root").$$render($$result, Object.assign({}, { builders }, { class: "w-full p-1.5" }, { type: "button" }, $$restProps), {}, {
    default: () => {
      return `<div class="${escape(
        null_to_empty(cn(buttonVariants({ variant, size, className }), "h-[29.4px] rounded-full border-2 transition duration-700", noInnerShadow ? "skeumorphic-button-no-inner-shadow" : "skeumorphic-button")),
        true
      ) + " svelte-8i710s"}">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}</div></div>` : `${validate_component(Button$1, "ButtonPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      { builders },
      {
        class: "h-[45.4px] rounded-[2px] px-2 text-black"
      },
      { type: "button" },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="${escape(null_to_empty(cn(buttonVariants({ variant, size, className }), "skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 dark:hover:bg-muted")), true) + " svelte-8i710s"}">${slots.default ? slots.default({}) : ``}</div>`;
      }
    }
  )}`}`}`}`;
});
const css = {
  code: ".hide.svelte-1qs6j7g{animation:svelte-1qs6j7g-hide 400ms 2000ms forwards ease-out}@keyframes svelte-1qs6j7g-hide{0%{max-width:10rem;overflow:hidden;opacity:1}80%{max-width:0px;overflow:hidden;opacity:1}100%{max-width:0px;overflow:hidden;opacity:0}}",
  map: '{"version":3,"file":"Logo.svelte","sources":["Logo.svelte"],"sourcesContent":["<script lang=\\"ts\\">import SparklePill from \\"$lib/components/SparklePill.svelte\\";\\nexport let simplified = false;\\n<\/script>\\n\\n{#if simplified}\\n<div class=\\"font-sans font-semibold flex items-center gap-1 text-xl\\">\\n  <div class=\\"hide\\">\\n    Empathy\\n  </div>\\n  <div>\\n    <SparklePill class=\\"shadow-md dark:shadow-gray-200/30\\" />\\n  </div>\\n  <div class=\\"hide\\">\\n    Link\\n  </div>\\n</div>\\n{:else}\\n<div class=\\"font-sans font-semibold flex items-center gap-1 text-xl\\">\\n  Empathy\\n  <div>\\n    <SparklePill class=\\"shadow-md dark:shadow-gray-200/30\\" />\\n  </div>\\n  Link\\n</div>\\n{/if}\\n\\n<style lang=\\"scss\\">.hide {\\n  animation: hide 400ms 2000ms forwards ease-out;\\n}\\n\\n@keyframes hide {\\n  0% {\\n    max-width: 10rem;\\n    overflow: hidden;\\n    opacity: 1;\\n  }\\n  80% {\\n    max-width: 0px;\\n    overflow: hidden;\\n    opacity: 1;\\n  }\\n  100% {\\n    max-width: 0px;\\n    overflow: hidden;\\n    opacity: 0;\\n  }\\n}</style>\\n\\n"],"names":[],"mappings":"AA0BmB,oBAAM,CACvB,SAAS,CAAE,mBAAI,CAAC,KAAK,CAAC,MAAM,CAAC,QAAQ,CAAC,QACxC,CAEA,WAAW,mBAAK,CACd,EAAG,CACD,SAAS,CAAE,KAAK,CAChB,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,CACX,CACA,GAAI,CACF,SAAS,CAAE,GAAG,CACd,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,CACX,CACA,IAAK,CACH,SAAS,CAAE,GAAG,CACd,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,CACX,CACF"}'
};
const Logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { simplified = false } = $$props;
  if ($$props.simplified === void 0 && $$bindings.simplified && simplified !== void 0) $$bindings.simplified(simplified);
  $$result.css.add(css);
  return `${simplified ? `<div class="font-sans font-semibold flex items-center gap-1 text-xl"><div class="hide svelte-1qs6j7g" data-svelte-h="svelte-1wuy7ld">Empathy</div> <div>${validate_component(SparklePill, "SparklePill").$$render(
    $$result,
    {
      class: "shadow-md dark:shadow-gray-200/30"
    },
    {},
    {}
  )}</div> <div class="hide svelte-1qs6j7g" data-svelte-h="svelte-1x1vvqj">Link</div></div>` : `<div class="font-sans font-semibold flex items-center gap-1 text-xl">Empathy
  <div>${validate_component(SparklePill, "SparklePill").$$render(
    $$result,
    {
      class: "shadow-md dark:shadow-gray-200/30"
    },
    {},
    {}
  )}</div>
  Link</div>`}`;
});
const Sheet_portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Dialog_portal, "SheetPrimitive.Portal").$$render($$result, Object.assign({}, { class: cn(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Sheet_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = fade } = $$props;
  let { transitionConfig = { duration: 150 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0) $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0) $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Dialog_overlay, "SheetPrimitive.Overlay").$$render(
    $$result,
    Object.assign(
      {},
      { transition },
      { transitionConfig },
      {
        class: cn("fixed inset-0 z-[1002] backdrop-blur-lg backdrop-brightness-[0.3]", className)
      },
      $$restProps
    ),
    {},
    {}
  )}`;
});
const Sheet_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "side",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig"
  ]);
  let { class: className = void 0 } = $$props;
  let { side = "right" } = $$props;
  let { inTransition = fly } = $$props;
  let { inTransitionConfig = sheetTransitions[side ?? "right"].in } = $$props;
  let { outTransition = fly } = $$props;
  let { outTransitionConfig = sheetTransitions[side ?? "right"].out } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0) $$bindings.side(side);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  return `${validate_component(Sheet_portal, "SheetPortal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Sheet_overlay, "SheetOverlay").$$render($$result, {}, {}, {})} ${validate_component(Dialog_content, "SheetPrimitive.Content").$$render(
        $$result,
        Object.assign(
          {},
          { inTransition },
          { inTransitionConfig },
          { outTransition },
          { outTransitionConfig },
          {
            class: cn(sheetVariants({ side }), className)
          },
          $$restProps
        ),
        {},
        {
          default: () => {
            return `${slots.default ? slots.default({}) : ``}`;
          }
        }
      )}`;
    }
  })}`;
});
const Sheet_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("flex flex-col space-y-2 text-left justify-start items-start", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Sheet_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Dialog_title, "SheetPrimitive.Title").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-foreground text-lg font-semibold", className)
      },
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
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "check," } = $$props;
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"></path></svg>` : `<svg${spread(
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"></path></svg>`} `;
});
const Select_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value", "label", "disabled", "noIndicator"]);
  let { class: className = void 0 } = $$props;
  let { value } = $$props;
  let { label = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { noIndicator = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.noIndicator === void 0 && $$bindings.noIndicator && noIndicator !== void 0) $$bindings.noIndicator(noIndicator);
  return `${validate_component(Select_item$1, "SelectPrimitive.Item").$$render(
    $$result,
    Object.assign(
      {},
      { value },
      { disabled },
      { label },
      {
        class: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">${!noIndicator ? `${validate_component(Select_item_indicator, "SelectPrimitive.ItemIndicator").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Check, "Check").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
          }
        })}` : ``}</span> ${slots.default ? slots.default({}) : ` ${escape(label || value)} `}`;
      }
    }
  )}`;
});
const Select_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "sideOffset",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig"
  ]);
  let { class: className = void 0 } = $$props;
  let { sideOffset = 4 } = $$props;
  let { inTransition = flyAndScale } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = scale } = $$props;
  let { outTransitionConfig = { start: 0.95, opacity: 0, duration: 50 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0) $$bindings.sideOffset(sideOffset);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  return `${validate_component(Select_content$1, "SelectPrimitive.Content").$$render(
    $$result,
    Object.assign(
      {},
      { inTransition },
      { inTransitionConfig },
      { outTransition },
      { outTransitionConfig },
      { sideOffset },
      {
        class: cn("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md focus:outline-none", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="w-full p-1">${slots.default ? slots.default({}) : ``}</div>`;
      }
    }
  )}`;
});
const CaretSort = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "caret sort," } = $$props;
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor"></path></svg>` : `<svg${spread(
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor"></path></svg>`} `;
});
const Select_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Select_trigger$1, "SelectPrimitive.Trigger").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``} <div>${validate_component(CaretSort, "CaretSort").$$render($$result, { class: "h-4 w-4 opacity-50" }, {}, {})}</div>`;
      }
    }
  )}`;
});
const Root = Select;
const Input = Select_input;
const Value = Select_value;
export {
  Button as B,
  Input as I,
  Logo as L,
  Root as R,
  Sheet_content as S,
  Value as V,
  Sheet_header as a,
  Sheet_title as b,
  Select_trigger as c,
  Select_content as d,
  Select_item as e,
  createLabel as f,
  arraysAreEqual as g,
  handleRovingFocus as h
};
