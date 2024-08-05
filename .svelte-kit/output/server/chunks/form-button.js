import { c as compute_rest_props } from "./utils.js";
import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import "./Avatar.svelte_svelte_type_style_lang.js";
import { B as Button } from "./Menu.js";
const Form_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `${validate_component(Button, "Button.Root").$$render($$result, Object.assign({}, { type: "submit" }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Form_button as F
};
