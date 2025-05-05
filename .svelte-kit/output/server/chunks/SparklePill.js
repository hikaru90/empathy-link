import { c as create_ssr_component, e as escape, a as add_attribute } from "./ssr.js";
import { c as cn } from "./index3.js";
const backgroundImage = "/_app/immutable/assets/holo3.CNY6rpg_.jpg";
const SparklePill = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { fast = false } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.fast === void 0 && $$bindings.fast && fast !== void 0) $$bindings.fast(fast);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `<div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}"${add_attribute("class", cn(fast ? "animate-bg-fast" : "animate-bg", "h-3 w-6 rounded-full bg-center bg-repeat-x", className), 0)}></div>`;
});
export {
  SparklePill as S,
  backgroundImage as b
};
