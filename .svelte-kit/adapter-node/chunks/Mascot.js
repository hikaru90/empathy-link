import { tv } from "tailwind-variants";
import "./Avatar.svelte_svelte_type_style_lang.js";
import "clsx";
import { c as compute_rest_props, s as subscribe } from "./utils.js";
import { c as createEventDispatcher } from "./lifecycle.js";
import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, a as add_attribute, e as escape, v as validate_component, f as each } from "./ssr.js";
import { t } from "./translations.js";
import { B as Button } from "./Avatar.js";
import { C as CaretLeft } from "./CaretLeft.js";
import { b as backgroundImage } from "./SparklePill.js";
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
const css$2 = {
  code: ".group .light-button{transition:box-shadow 50ms, background-color 700ms}.group:active .light-button{box-shadow:0 0 0 rgba(255, 255, 255, 0.6), 0 0 0 rgba(0, 0, 0, 0.2)}",
  map: null
};
const FormStepper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  createEventDispatcher();
  let { step } = $$props;
  let { class: className = void 0 } = $$props;
  let { primaryButtonClass = void 0 } = $$props;
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.primaryButtonClass === void 0 && $$bindings.primaryButtonClass && primaryButtonClass !== void 0)
    $$bindings.primaryButtonClass(primaryButtonClass);
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
        return `${validate_component(CaretLeft, "CaretLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
      }
    }
  )}</div> ${validate_component(Button, "Button").$$render(
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
        return ` ${escape($t("default.page.fights.form.general.next"))} ${validate_component(ArrowRight$1, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
      }
    }
  )} </div>`;
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
  return `<div class="${"sticky top-0 z-10 -mx-5 md:flex md:justify-center " + escape(`bg-${stepBackground}-background`, true) + " transition duration-700 svelte-1oqfzpf"}"><div class="md:my-4"><div class="lcd-screen relative flex items-center gap-[4px] border border-black/10 bg-black/5 p-[2px] dark:bg-black/20 md:rounded"> ${each(steps, (entry, index) => {
    return `${!entry.hidden ? `<button type="button" class="${"group " + escape(`bg-${stepBackground}-background`, true) + " flex-grow rounded-[2px] shadow transition duration-700 svelte-1oqfzpf"}"><div class="flex items-center justify-center overflow-hidden rounded-[2px] p-2 shadow-inner shadow-white/20 dark:shadow-white/10"><div class="${"skeumorphic-button " + escape(`bg-${entry.slug}-background text-${entry.slug}-foreground`, true) + " rounded-full border-2 " + escape(`border-${stepBackground}-background`, true) + " transition duration-700 svelte-1oqfzpf"}"><div class="${"flex items-center rounded-full border border-black/5 p-1 " + escape(step === index + 1 ? "px-2" : "", true) + " group-hover:bg-white/40 dark:group-hover:bg-white/10 transition duration-200"}"><div class="${"flex h-4 w-4 scale-110 items-center justify-center " + escape(`fill-${entry.slug}-foreground`, true) + " svelte-1oqfzpf"}"><!-- HTML_TAG_START -->${entry.icon}<!-- HTML_TAG_END --></div> <div class="${"max-h-0 max-w-0 scale-0 transform text-sm " + escape(
      step === index + 1 ? "opacity-1 ml-1 mr-1 max-h-4 max-w-[300px] scale-100 transition-all delay-200" : "max-w-0 scale-0 opacity-0",
      true
    )}"><span class="-mt-[2px] block">${escape(entry.name)}</span> </div></div> </div></div> </button>` : ``}`;
  })}</div></div> </div>`;
});
const css = {
  code: ".mouth.svelte-1krlj0r{animation:svelte-1krlj0r-mouth 10s infinite}@keyframes svelte-1krlj0r-mouth{0%{transform:scaleY(0.4)}5%{transform:scaleY(1)}25%{transform:scaleY(0.4)}100%{transform:scaleY(1)}}@keyframes svelte-1krlj0r-lookaround{0%{transform:translate(0, 20%)}5%{transform:translate(-20%, 20%)}25%{transform:translate(40%, 20%)}30%{transform:translate(30%, 52%)}50%{transform:translate(30%, 52%)}55%{transform:translate(-30%, 44%)}85%{transform:translate(-30%, 44%)}100%{transform:translate(0, 20%)}}",
  map: null
};
const Mascot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="flex left-0 right-0 justify-center gap-1 h-12 relative -mx-4 mt-2" data-svelte-h="svelte-1sp3f9i"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg h-full w-[60px] rounded-t-[50px] rounded-b transition duration-700 flex items-center justify-center relative z-10 shadow-lg"><div data-name="face" class="face-3 flex flex-col gap-1"><div data-name="eyes" class="eyes flex justify-center items-center gap-2"><div class="w-2 h-2 bg-black border-2 border-white rounded-full shadow-md"></div> <div class="w-2 h-2 bg-black border-2 border-white rounded-full shadow-md"></div></div> <div data-name="mouth" class="mouth flex items-center justify-center svelte-1krlj0r"><div class="w-2.5 h-1.5 bg-black rounded-b-full"></div></div></div></div> </div>`;
});
export {
  FormStepDisplay as F,
  Mascot as M,
  FormStepper as a,
  toggleVariants as t
};
