import { c as compute_rest_props } from "./utils.js";
import { c as create_ssr_component, v as validate_component, f as each, e as escape } from "./ssr.js";
import "./Avatar.svelte_svelte_type_style_lang.js";
import { d as Button$1 } from "./Avatar.js";
import { c as cn } from "./utils2.js";
import { b as backgroundImage } from "./SparklePill.js";
import { tv } from "tailwind-variants";
import "clsx";
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "variant", "size", "builders"]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size = "default" } = $$props;
  let { builders = [] } = $$props;
  const positions = [
    { left: -30, top: -20, scale: 0.4 },
    { left: 120, top: -10, scale: 0.6 },
    { left: 40, top: 100, scale: 1 },
    { left: -20, top: 110, scale: 0.8 },
    { left: 110, top: 110, scale: 1.2 },
    { left: 20, top: -60, scale: 1 },
    { left: 60, top: -40, scale: 0.4 }
  ];
  const delays = [
    "delay-0",
    "delay-75",
    "delay-300",
    "delay-500",
    "delay-700",
    "delay-1000",
    "delay-500"
  ];
  const animationTimings = [
    "animation-duration: 500ms;animation-delay: 0ms;",
    "animation-duration: 700ms;animation-delay: 75ms;",
    "animation-duration: 1000ms;animation-delay: 300ms;",
    "animation-duration: 400ms;animation-delay: 500ms;",
    "animation-duration: 1500ms;animation-delay: 700ms;",
    "animation-duration: 2500ms;animation-delay: 200ms;",
    "animation-duration: 700ms;animation-delay: 75ms;"
  ];
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.builders === void 0 && $$bindings.builders && builders !== void 0)
    $$bindings.builders(builders);
  return `${validate_component(Button$1, "ButtonPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      { builders },
      {
        style: "background-image: url('" + backgroundImage + "'); background-size: 300% 300%;"
      },
      {
        class: cn(buttonVariants({ variant, size, className }), "animate-bg-hover-fast group relative transform scale-100 hover:scale-105 transition ease-in")
      },
      { type: "button" },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="pointer-events-none absolute h-full w-full scale-60 -z-10 transform opacity-0 transition group-hover:scale-100 group-hover:opacity-100 group-hover:delay-300">${each(positions, (star, index) => {
          return `<div class="${"absolute w-4 scale-0 fill-yellow-700 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 dark:fill-yellow-100 " + escape(delays[index], true)}" style="${"left: " + escape(star.left, true) + "%;top: " + escape(star.top, true) + "%;transform: scale(" + escape(star.scale, true) + ")"}"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="${"filter: drop-shadow(0 0 10px rgba(255,255,255,0.6));" + escape(animationTimings[index], true)}" class="-translate-x-50 -translate-y-50 animate-wobble transform"><path d="M16.451.68339c0,11.57088-3.857,15.42784-15.42785,15.42784,11.57088,0,15.42785,3.857,15.42785,15.42784,0-11.57088,3.857-15.42784,15.42785-15.42784C20.308,16.11123,16.451,12.25427,16.451.68339Z"></path></svg> </div>`;
        })}</div> ${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
export {
  Button as B
};
